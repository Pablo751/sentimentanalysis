import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const indexHtmlPath = path.join(distDir, "index.html");

function loadLocalEnv(filename) {
  try {
    process.loadEnvFile?.(path.join(rootDir, filename));
  } catch {
    // Ignore missing local env files.
  }
}

loadLocalEnv(".env");
loadLocalEnv(".env.local");

const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 8787);
const sessionSecret = process.env.SESSION_SECRET?.trim() || crypto.randomBytes(32).toString("hex");
const authPassword = process.env.APP_PASSWORD?.trim() || "";
const allowedEmail = process.env.APP_EMAIL?.trim().toLowerCase() || "";
const anthropicApiKey = process.env.ANTHROPIC_API_KEY?.trim() || "";
const anthropicModel = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-20250514";

if (isProduction && !process.env.SESSION_SECRET?.trim()) {
  console.error("SESSION_SECRET must be set in production.");
  process.exit(1);
}

const app = express();
const sessions = new Map();

const SESSION_COOKIE_NAME = "apex_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const MAX_DOCUMENT_LENGTH = 24_000;
const stringField = (max) => z.string().trim().min(1).max(max);

const eventScenarioSchema = z.object({
  id: stringField(100),
  label: stringField(200),
  account: stringField(100),
  department: stringField(100),
  executive: stringField(200),
  deliverableType: stringField(120),
  eventName: stringField(200),
  date: stringField(120),
  location: stringField(200),
  eventFormat: stringField(80),
  interviewer: stringField(160),
  duration: stringField(80),
  otherPanelists: z.string().trim().max(500).optional(),
  targetAudience: stringField(1_000),
  objective: stringField(2_000),
  keyMessages: stringField(4_000),
  anticipatedTopics: stringField(4_000),
  sensitivities: stringField(2_000),
}).strict();

const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(256),
}).strict();

const generateDocumentSchema = z.object({
  scenario: eventScenarioSchema,
}).strict();

const evaluateDocumentSchema = z.object({
  scenario: eventScenarioSchema,
  documentText: z.string().trim().min(1).max(MAX_DOCUMENT_LENGTH),
}).strict();

const evaluationSchema = z.object({
  overall_score: z.number().int().min(0).max(100),
  overall_verdict: z.string().trim().min(1).max(50),
  dimensions: z.object({
    objective_fit: z.object({
      score: z.number().int().min(0).max(100),
      verdict: z.string().trim().min(1).max(500),
    }),
    messaging_cutthrough: z.object({
      score: z.number().int().min(0).max(100),
      verdict: z.string().trim().min(1).max(500),
    }),
    audience_resonance: z.object({
      score: z.number().int().min(0).max(100),
      verdict: z.string().trim().min(1).max(500),
    }),
  }),
  what_is_working: z.array(z.string().trim().min(1).max(1_000)).max(10),
  what_is_missing: z.array(z.string().trim().min(1).max(1_000)).max(10),
  priority_action: z.string().trim().min(1).max(1_000),
}).strict();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

const generationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Try again later." },
});

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet({
  contentSecurityPolicy: isProduction
    ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'"],
          imgSrc: ["'self'", "data:"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
        },
      }
    : false,
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json({ limit: "50kb" }));

function parseCookies(header = "") {
  return header
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex === -1) {
        return acc;
      }

      const key = part.slice(0, separatorIndex);
      const value = part.slice(separatorIndex + 1);
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

function createSession(email) {
  const rawToken = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHmac("sha256", sessionSecret).update(rawToken).digest("hex");
  const session = {
    email,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };

  sessions.set(tokenHash, session);
  return rawToken;
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  const rawToken = cookies[SESSION_COOKIE_NAME];
  if (!rawToken) {
    return null;
  }

  const tokenHash = crypto.createHmac("sha256", sessionSecret).update(rawToken).digest("hex");
  const session = sessions.get(tokenHash);
  if (!session) {
    return null;
  }

  if (session.expiresAt <= Date.now()) {
    sessions.delete(tokenHash);
    return null;
  }

  return { ...session, tokenHash };
}

function clearSession(req, res) {
  const session = getSessionFromRequest(req);
  if (session) {
    sessions.delete(session.tokenHash);
  }

  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: req.secure,
    path: "/",
  });
}

function setSessionCookie(req, res, token) {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: req.secure,
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
}

function compareSecret(candidate, expected) {
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  if (candidateBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidateBuffer, expectedBuffer);
}

function assertAnthropicConfigured() {
  if (!anthropicApiKey) {
    const error = new Error("ANTHROPIC_API_KEY is not configured on the server.");
    error.statusCode = 503;
    throw error;
  }
}

function requireAuth(req, res, next) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ error: "Authentication required." });
  }

  req.session = session;
  return next();
}

function buildSystemPrompt(scenario) {
  const panelContext = scenario.otherPanelists
    ? `\nOther panelists: ${scenario.otherPanelists}`
    : "";

  return `You are an expert communications strategist at Edelman, one of the world's leading PR firms. You specialise in executive positioning for energy sector leaders.

Your task is to write professional talking points for ${scenario.executive}, for a ${scenario.eventFormat.toLowerCase()} at ${scenario.eventName} in ${scenario.location}.

EVENT DETAILS:
- Event: ${scenario.eventName}
- Date: ${scenario.date}
- Location: ${scenario.location}
- Format: ${scenario.eventFormat}
- ${scenario.eventFormat === "Solo Interview" ? "Interviewer" : "Moderator"}: ${scenario.interviewer}
- Duration: ${scenario.duration}${panelContext}

ABOUT ENEC AND AL HAMMADI:
- ENEC completed the Barakah Nuclear Energy Plant - 4 reactors, first in the Arab world, delivered in under 12 years and on budget
- Barakah generates 25% of UAE electricity (up to 60% in winter), 40 TWh clean electricity annually
- Prevents 22.4 million tons of carbon per annum
- ENEC won the S&P Global Excellence in Energy - Power Award 2025 - first exclusively nuclear company in a decade
- Al Hammadi chairs the World Nuclear Association
- ENEC is exploring US market expansion, Philippines nuclear partnership, Sizewell C discussions
- Al Hammadi's voice: confident, direct, globally ambitious, never defensive about nuclear

TARGET AUDIENCE: ${scenario.targetAudience}

OBJECTIVE: ${scenario.objective}

KEY MESSAGES TO WEAVE IN:
${scenario.keyMessages}

TOPICS TO COVER:
${scenario.anticipatedTopics}

AVOID:
${scenario.sensitivities}

FORMAT YOUR RESPONSE AS FOLLOWS - use clean markdown:

## Opening Statement
One powerful 2-3 sentence opening that Al Hammadi can use to frame the ${scenario.eventFormat.toLowerCase()} on his terms.

## Key Message 1
- 2-3 talking points
- 1 suggested soundbite (clearly labelled)

## Key Message 2
- 2-3 talking points
- 1 suggested soundbite (clearly labelled)

## Key Message 3
- 2-3 talking points
- 1 suggested soundbite (clearly labelled)

## Anticipated Questions & Suggested Responses
Q: [likely question]
A: [suggested response - 3-4 sentences, in Al Hammadi's voice]

Include 3 Q&A pairs covering the anticipated topics.

## Points to Avoid / Redirect
- 3 brief redirect strategies for sensitive topics

Keep the tone confident, globally ambitious, and authoritative. Write in Al Hammadi's voice - direct, proud of ENEC's achievement, forward-looking.`;
}

const evaluationSystemPrompt = `You are a senior communications strategist evaluating an executive positioning document against its brief objective. Be direct, specific, and actionable in your feedback.

Evaluate the document provided against THREE dimensions. Respond ONLY in the following JSON format, no other text:

{
  "overall_score": [0-100],
  "overall_verdict": "STRONG" or "NEEDS REFINEMENT",
  "dimensions": {
    "objective_fit": {
      "score": [0-100],
      "verdict": "[one line assessment]"
    },
    "messaging_cutthrough": {
      "score": [0-100],
      "verdict": "[one line assessment]"
    },
    "audience_resonance": {
      "score": [0-100],
      "verdict": "[one line assessment]"
    }
  },
  "what_is_working": [
    "[specific strength 1 with reference to document content]",
    "[specific strength 2]",
    "[specific strength 3]"
  ],
  "what_is_missing": [
    "[specific gap 1 with actionable detail]",
    "[specific gap 2]",
    "[specific gap 3]"
  ],
  "priority_action": "[single most important edit, specific and actionable, max 2 sentences]"
}`;

function buildEvaluationPrompt(scenario, documentText) {
  return `BRIEF OBJECTIVE: ${scenario.objective}

TARGET AUDIENCE: ${scenario.targetAudience}

KEY MESSAGES: ${scenario.keyMessages}

DOCUMENT TO EVALUATE:
${documentText}`;
}

async function callAnthropic({ system, messages, maxTokens }) {
  assertAnthropicConfigured();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": anthropicApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: anthropicModel,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const error = new Error(`Anthropic request failed (${response.status}). ${errorBody}`);
    error.statusCode = 502;
    throw error;
  }

  return response.json();
}

function extractTextContent(payload) {
  if (!Array.isArray(payload?.content)) {
    return "";
  }

  return payload.content
    .map((item) => (typeof item?.text === "string" ? item.text : ""))
    .join("")
    .trim();
}

function parseEvaluationJson(rawText) {
  const cleaned = rawText
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const error = new Error("The evaluation response was not valid JSON.");
    error.statusCode = 502;
    throw error;
  }

  return evaluationSchema.parse(parsed);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/auth/session", (req, res) => {
  const session = getSessionFromRequest(req);
  res.json({
    authenticated: Boolean(session),
    email: session?.email || "",
    authConfigured: Boolean(authPassword),
  });
});

app.post("/api/auth/login", loginLimiter, (req, res, next) => {
  try {
    if (!authPassword) {
      return res.status(503).json({ error: "The server login password is not configured.", authConfigured: false });
    }

    const { email, password } = loginSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase();

    if ((allowedEmail && normalizedEmail !== allowedEmail) || !compareSecret(password, authPassword)) {
      return res.status(401).json({ error: "Invalid credentials.", authConfigured: true });
    }

    const token = createSession(email);
    setSessionCookie(req, res, token);

    return res.json({
      authenticated: true,
      email,
      authConfigured: true,
    });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/auth/logout", (req, res) => {
  clearSession(req, res);
  res.status(204).end();
});

app.post("/api/documents/generate", generationLimiter, requireAuth, async (req, res, next) => {
  try {
    const { scenario } = generateDocumentSchema.parse(req.body);
    const response = await callAnthropic({
      system: buildSystemPrompt(scenario),
      maxTokens: 2_000,
      messages: [{ role: "user", content: "Generate the talking points based on the brief provided." }],
    });

    const document = extractTextContent(response);
    if (!document) {
      const error = new Error("The model returned an empty document.");
      error.statusCode = 502;
      throw error;
    }

    return res.json({ document });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/documents/evaluate", generationLimiter, requireAuth, async (req, res, next) => {
  try {
    const { scenario, documentText } = evaluateDocumentSchema.parse(req.body);
    const response = await callAnthropic({
      system: evaluationSystemPrompt,
      maxTokens: 1_000,
      messages: [{ role: "user", content: buildEvaluationPrompt(scenario, documentText) }],
    });

    const evaluationText = extractTextContent(response);
    const evaluation = parseEvaluationJson(evaluationText);
    return res.json({ evaluation });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: "Invalid request payload." });
  }

  const statusCode = typeof error?.statusCode === "number" ? error.statusCode : 500;
  const message = statusCode >= 500
    ? error?.message || "Internal server error."
    : error?.message || "Request failed.";

  return res.status(statusCode).json({ error: message });
});

if (fs.existsSync(indexHtmlPath)) {
  app.use(express.static(distDir, {
    index: false,
    extensions: ["html"],
    maxAge: isProduction ? "1h" : 0,
  }));

  app.get(/^(?!\/api\/).*/, (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(indexHtmlPath);
  });
}

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [tokenHash, session] of sessions.entries()) {
    if (session.expiresAt <= now) {
      sessions.delete(tokenHash);
    }
  }
}, 60 * 1000);

cleanupTimer.unref();

app.listen(port, () => {
  console.log(`Server listening on http://127.0.0.1:${port}`);
});
