import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import type { EvaluationData } from "@/context/AppContext";
import { eventScenarios, type EventScenario } from "@/data/eventScenarios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function buildSystemPrompt(s: EventScenario): string {
  const panelContext = s.otherPanelists
    ? `\nOther panelists: ${s.otherPanelists}`
    : "";

  return `You are an expert communications strategist at Edelman, one of the world's leading PR firms. You specialise in executive positioning for energy sector leaders.

Your task is to write professional talking points for ${s.executive}, for a ${s.eventFormat.toLowerCase()} at ${s.eventName} in ${s.location}.

EVENT DETAILS:
- Event: ${s.eventName}
- Date: ${s.date}
- Location: ${s.location}
- Format: ${s.eventFormat}
- ${s.eventFormat === "Solo Interview" ? "Interviewer" : "Moderator"}: ${s.interviewer}
- Duration: ${s.duration}${panelContext}

ABOUT ENEC AND AL HAMMADI:
- ENEC completed the Barakah Nuclear Energy Plant — 4 reactors, first in the Arab world, delivered in under 12 years and on budget
- Barakah generates 25% of UAE electricity (up to 60% in winter), 40 TWh clean electricity annually
- Prevents 22.4 million tons of carbon per annum
- ENEC won the S&P Global Excellence in Energy — Power Award 2025 — first exclusively nuclear company in a decade
- Al Hammadi chairs the World Nuclear Association
- ENEC is exploring US market expansion, Philippines nuclear partnership, Sizewell C discussions
- Al Hammadi's voice: confident, direct, globally ambitious, never defensive about nuclear

TARGET AUDIENCE: ${s.targetAudience}

OBJECTIVE: ${s.objective}

KEY MESSAGES TO WEAVE IN:
${s.keyMessages}

TOPICS TO COVER:
${s.anticipatedTopics}

AVOID:
${s.sensitivities}

FORMAT YOUR RESPONSE AS FOLLOWS — use clean markdown:

## Opening Statement
One powerful 2-3 sentence opening that Al Hammadi can use to frame the ${s.eventFormat.toLowerCase()} on his terms.

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
A: [suggested response — 3-4 sentences, in Al Hammadi's voice]

Include 3 Q&A pairs covering the anticipated topics.

## Points to Avoid / Redirect
- 3 brief redirect strategies for sensitive topics

Keep the tone confident, globally ambitious, and authoritative. Write in Al Hammadi's voice — direct, proud of ENEC's achievement, forward-looking.`;
}

const EVAL_SYSTEM_PROMPT = `You are a senior communications strategist evaluating an executive positioning document against its brief objective. Be direct, specific, and actionable in your feedback.

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

const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

interface AnthropicMessagesResponse {
  content?: Array<{
    text?: string;
  }>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Generation failed — please try again.";
}

const loadingSteps = [
  "Researching event and audience...",
  "Analysing recent ENEC coverage and competitor messaging...",
  "Reviewing Al Hammadi's recent statements and voice...",
  "Generating talking points...",
];

const BriefIntake = () => {
  const navigate = useNavigate();
  const { setGeneratedDocument, setEvaluation, setSelectedEventId, setDocumentApproved, setApprovedBy } = useAppState();
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY?.trim();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [contextOpen, setContextOpen] = useState(false);
  const [scenarioId, setScenarioId] = useState(eventScenarios[0].id);

  const scenario = eventScenarios.find((s) => s.id === scenarioId)!;

  // Clear previous generation state on mount
  useEffect(() => {
    setGeneratedDocument(null);
    setEvaluation(null);
    setDocumentApproved(false);
    setApprovedBy("");
  }, [setApprovedBy, setDocumentApproved, setEvaluation, setGeneratedDocument]);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError("Set VITE_ANTHROPIC_API_KEY in a local .env file before generating documents.");
      return;
    }

    // Reset ALL generation state before every run
    setError(null);
    setGeneratedDocument(null);
    setEvaluation(null);
    setDocumentApproved(false);
    setApprovedBy("");
    setCurrentStep(0);
    setLoading(true);
    setSelectedEventId(scenarioId);

    const stepTimers = [1000, 1500, 1000];
    for (let i = 0; i < stepTimers.length; i++) {
      await new Promise((r) => setTimeout(r, stepTimers[i]));
      setCurrentStep(i + 1);
    }

    try {
      const currentScenario = eventScenarios.find((s) => s.id === scenarioId)!;
      const systemPrompt = buildSystemPrompt(currentScenario);
      console.log("Prompt preview:", systemPrompt.substring(0, 200));

      const docRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: "user", content: "Generate the talking points based on the brief provided." }],
        }),
      });

      if (!docRes.ok) {
        const errBody = await docRes.text();
        throw new Error(`API error ${docRes.status}: ${errBody}`);
      }

      const docData: AnthropicMessagesResponse = await docRes.json();
      const docText = docData.content?.[0]?.text || "";
      setGeneratedDocument(docText);

      const evalRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 1000,
          system: EVAL_SYSTEM_PROMPT,
          messages: [{ role: "user", content: `BRIEF OBJECTIVE: ${currentScenario.objective}\n\nTARGET AUDIENCE: ${currentScenario.targetAudience}\n\nKEY MESSAGES: ${currentScenario.keyMessages}\n\nDOCUMENT TO EVALUATE:\n${docText}` }],
        }),
      });

      if (evalRes.ok) {
        const evalData: AnthropicMessagesResponse = await evalRes.json();
        const evalText = evalData.content?.[0]?.text || "";
        try {
          const jsonStr = evalText.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
          const parsed: EvaluationData = JSON.parse(jsonStr);
          setEvaluation(parsed);
        } catch (e) {
          console.error("Failed to parse evaluation JSON:", e);
          setEvaluation(null);
        }
      }

      navigate("/document");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <span className="material-icons text-primary text-5xl animate-pulse">auto_awesome</span>
        </div>
        <h2 className="text-xl font-bold mb-8">Generating Positioning Document</h2>
        <div className="space-y-4 text-left max-w-md mx-auto">
          {loadingSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              {i < currentStep ? (
                <span className="material-icons text-secondary text-xl">check_circle</span>
              ) : i === currentStep ? (
                <span className="material-icons text-primary text-xl animate-spin">progress_activity</span>
              ) : (
                <span className="material-icons text-muted-foreground/30 text-xl">radio_button_unchecked</span>
              )}
              <span className={`text-sm ${i <= currentStep ? "text-foreground" : "text-muted-foreground/50"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">New Positioning Brief</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete the brief to generate your executive positioning document</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
          <span className="material-icons text-base">error</span>
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Event Selector */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Select Event Scenario</label>
          <Select value={scenarioId} onValueChange={setScenarioId} disabled={loading}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventScenarios.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section 1 */}
        <Section title="Account & Deliverable">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Account" value={scenario.account} disabled />
            <Field label="Department" value={scenario.department} disabled />
            <Field label="Executive(s)" value={scenario.executive} disabled />
            <Field label="Deliverable Type" value={scenario.deliverableType} disabled />
          </div>
        </Section>

        {/* Section 2 */}
        <Section title="Event Details">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Event name" value={scenario.eventName} disabled />
            <Field label="Date" value={scenario.date} disabled />
            <Field label="Location" value={scenario.location} disabled />
            <Field label="Event format" value={scenario.eventFormat} disabled />
            <Field label={scenario.eventFormat === "Solo Interview" ? "Interviewer" : "Interviewer / Moderator"} value={scenario.interviewer} disabled />
            <Field label="Duration" value={scenario.duration} disabled />
            {scenario.otherPanelists && (
              <div className="col-span-2">
                <Field label="Other panelists" value={scenario.otherPanelists} disabled />
              </div>
            )}
          </div>
        </Section>

        {/* Section 3 */}
        <Section title="Messaging">
          <div className="space-y-4">
            <Field label="Target audience" value={scenario.targetAudience} disabled />
            <TextAreaField label="Objective" value={scenario.objective} disabled />
            <TextAreaField label="Key messages to land" value={scenario.keyMessages} disabled />
            <TextAreaField label="Anticipated interview topics" value={scenario.anticipatedTopics} disabled />
            <TextAreaField label="Sensitivities / avoid" value={scenario.sensitivities} disabled />
          </div>
        </Section>

        {/* Section 4 — Collapsible */}
        <div className="border border-border rounded-lg">
          <button
            onClick={() => setContextOpen(!contextOpen)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="text-sm font-semibold text-foreground">Supporting Context</span>
            <span className="material-icons text-muted-foreground text-xl">
              {contextOpen ? "expand_less" : "expand_more"}
            </span>
          </button>
          {contextOpen && (
            <div className="px-4 pb-4">
              <textarea
                placeholder="Additional context or background (optional)"
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-y"
              />
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 text-sm font-semibold text-primary-foreground bg-primary rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-icons text-lg">auto_awesome</span>
          {loading ? "Generating..." : "Generate Positioning Document"}
        </button>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="border border-border rounded-lg p-5">
    <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, value, disabled }: { label: string; value: string; disabled?: boolean }) => (
  <div>
    <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
    <input
      value={value}
      disabled={disabled}
      readOnly
      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-muted text-foreground disabled:opacity-70"
    />
  </div>
);

const TextAreaField = ({ label, value, disabled }: { label: string; value: string; disabled?: boolean }) => (
  <div>
    <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
    <textarea
      value={value}
      disabled={disabled}
      readOnly
      rows={2}
      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-muted text-foreground disabled:opacity-70 resize-none"
    />
  </div>
);

export default BriefIntake;
