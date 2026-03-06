import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ── Narrative Gap Data ──
const gapRows = [
  {
    topic: "AI Energy Demand & Nuclear",
    trending: "FT, Bloomberg, Reuters (47 articles this month)",
    competitors: "Chris Levesque — 12 quotes · Dan Sumner — 9 quotes",
    presence: "1 indirect mention",
    gapType: "VULNERABILITY" as const,
    action: "Claim Narrative",
  },
  {
    topic: "SMR Global Deployment",
    trending: "World Nuclear News, S&P Global, Reuters (31 articles)",
    competitors: "Chris Levesque — 18 quotes · Dan Sumner — 6 quotes",
    presence: "0 mentions",
    gapType: "VULNERABILITY" as const,
    action: "Claim Narrative",
  },
  {
    topic: "Nuclear as AI Data Centre Solution",
    trending: "TechCrunch Energy, Bloomberg Tech, FT (22 articles)",
    competitors: "None dominant yet",
    presence: "0 mentions",
    gapType: "OPPORTUNITY" as const,
    action: "Own This",
  },
  {
    topic: "MENA Energy Security Leadership",
    trending: "Arab News, The National, Gulf Today (19 articles)",
    competitors: "Sultan Al Jaber — 6 quotes",
    presence: "2 direct quotes",
    gapType: "CREDIBILITY GAP" as const,
    action: "Assert Voice",
  },
  {
    topic: "Nuclear New Build Financing Models",
    trending: "S&P Global, Energy Intelligence, Bloomberg (28 articles)",
    competitors: "Bernard Fontana — 4 quotes · Dan Sumner — 7 quotes",
    presence: "0 mentions",
    gapType: "OPPORTUNITY" as const,
    action: "Own This",
  },
  {
    topic: "Barakah as Global Nuclear Blueprint",
    trending: "World Nuclear News, Nuclear Engineering Int'l (14 articles)",
    competitors: "None — topic uniquely owned by ENEC",
    presence: "2 direct quotes (underperforming given ownership)",
    gapType: "CREDIBILITY GAP" as const,
    action: "Scale Presence",
  },
];

const gapStyles: Record<string, { bg: string; text: string; btnClass: string }> = {
  VULNERABILITY: { bg: "bg-[hsl(0,93%,94%)]", text: "text-[hsl(0,72%,51%)]", btnClass: "bg-primary text-primary-foreground hover:bg-primary/90" },
  OPPORTUNITY: { bg: "bg-[hsl(142,76%,93%)]", text: "text-[hsl(142,72%,42%)]", btnClass: "bg-secondary text-secondary-foreground hover:bg-secondary/90" },
  "CREDIBILITY GAP": { bg: "bg-[hsl(48,96%,89%)]", text: "text-[hsl(32,95%,44%)]", btnClass: "bg-[hsl(32,95%,44%)] text-white hover:bg-[hsl(32,95%,38%)]" },
};

// ── Theme Comparison Data ──
const themeRows = [
  { theme: "Nuclear", alJaber: "0% of posts", levesque: "98% of posts", gap: "Al Hammadi should own this space", actionable: true },
  { theme: "Energy Security", alJaber: "18%", levesque: "36%", gap: "High opportunity — his strongest claim", actionable: true },
  { theme: "AI / Data Centers", alJaber: "12%", levesque: "14%", gap: "Both weak — Al Hammadi can claim this", actionable: true },
  { theme: "Construction / Delivery", alJaber: "24%", levesque: "72%", gap: "ENEC delivered 4 reactors — underused", actionable: true },
  { theme: "Climate / Net Zero", alJaber: "24%", levesque: "8%", gap: "Al Jaber owns this — don't compete", actionable: false },
  { theme: "Partnerships", alJaber: "28%", levesque: "20%", gap: "Al Hammadi travels widely — underused", actionable: true },
];

// ── Communication Style Data ──
const styleRows = [
  { style: "Avg post length", alJaber: "481 chars", levesque: "706 chars", rec: "Target ~600 — between both" },
  { style: "Hashtags", alJaber: "9/49 posts", levesque: "41/50 posts", rec: "Moderate use — 20–30% of posts" },
  { style: "Announcements", alJaber: "4 posts", levesque: "18 posts", rec: "More milestone posts — ENEC has plenty" },
  { style: "Personal / relational", alJaber: "4 posts", levesque: "9 posts", rec: "More — humanises a technical leader" },
  { style: "Direct quotes", alJaber: "5 posts", levesque: "2 posts", rec: "Al Jaber's style — adopt it" },
];

// ── Competitor Data ──
const competitors = [
  {
    name: "Sultan Al Jaber",
    company: "Masdar",
    title: "Minister of Industry & Advanced Technology | ADNOC CEO | Masdar Chairman",
    narrative: "\"The UAE is the world's most trusted energy partner — building the future of energy while delivering today's\"",
    topics: ["Energy Partnerships", "COP / Climate", "AI + Investment", "ADNOC Growth"],
    style: "Short, aphoristic, statesman-level (avg 481 chars)",
    notSaying: "Zero nuclear-specific posts — never positions on nuclear delivery or operational excellence",
    posts: 49,
  },
  {
    name: "Chris Levesque",
    company: "TerraPower",
    title: "President & CEO, TerraPower",
    narrative: "\"TerraPower is building the future of nuclear energy — one regulatory milestone at a time\"",
    topics: ["Natrium Construction", "Regulatory Approvals", "US Energy Policy", "AI + Nuclear"],
    style: "Detailed, milestone-driven, operational (avg 706 chars)",
    notSaying: "No MENA or international delivery narrative — entirely US/UK focused",
    posts: 50,
  },
  {
    name: "Dan Sumner",
    company: "Westinghouse",
    title: "Interim President & CEO, Westinghouse Electric Company",
    narrative: "\"Westinghouse is ready to deliver AP1000 reactors for America's nuclear renaissance\"",
    topics: ["US Nuclear Policy", "AP1000 Reactors", "Trump Energy Orders", "Supply Chain"],
    style: "Very low LinkedIn presence — mostly formal corporate announcements",
    notSaying: "No personal brand or thought leadership — almost entirely reactive",
    posts: 1,
    note: "⚡ Low LinkedIn presence — opportunity to outpace on personal brand",
  },
];

// ── Unclaimed Territory Data ──
const territories = [
  {
    tag: "🎯 HIGHEST PRIORITY",
    tagClass: "bg-[hsl(142,76%,93%)] text-[hsl(142,72%,42%)]",
    headline: "\"The Proven Nuclear Operator for the AI Era\"",
    body: "AI companies need guaranteed baseload power. ENEC has delivered 40TWh annually from 4 reactors. No other executive can combine operational proof with AI energy demand narrative — Levesque is still building, Al Jaber doesn't do nuclear specifics.",
    why: "WNA Chairman + Barakah operator + TerraPower board member = unique triple credibility",
    format: "Op-ed pitch to FT or Bloomberg + LinkedIn post series",
  },
  {
    tag: "📈 GROWING FAST",
    tagClass: "bg-[hsl(48,96%,89%)] text-[hsl(32,95%,44%)]",
    headline: "\"The Blueprint Every New Nuclear Nation Needs\"",
    body: "Philippines, Kenya, Ghana, Poland all pursuing nuclear programmes. ENEC built from zero in 12 years. No competitor can speak to this — Westinghouse sells technology, TerraPower is US-focused. Al Hammadi is the only CEO who has actually done it.",
    why: "Led UAE from zero nuclear capability to fully operational 4-unit plant",
    format: "Panel positioning at WNA events + proactive media outreach to Global South press",
  },
  {
    tag: "⚡ REACTIVE WINDOW",
    tagClass: "bg-[hsl(217,91%,95%)] text-[hsl(217,91%,60%)]",
    headline: "\"MENA's Nuclear Voice in the Global Policy Debate\"",
    body: "US nuclear policy, UK SMR licensing, EU taxonomy debates — all happening now. Al Jaber speaks on energy broadly. No MENA executive is present in the Western nuclear policy conversation. 24-72 hour reactive window exists after each major policy announcement.",
    why: "WNA Chairman gives him standing to comment on any national nuclear programme globally",
    format: "Rapid-response LinkedIn posts + journalist proactive outreach within 24h of policy news",
  },
];

const objectiveByGap: Record<string, (topic: string) => string> = {
  VULNERABILITY: (t) => `Position Al Hammadi as the authoritative voice on ${t} and reclaim share of conversation from competitors`,
  OPPORTUNITY: (t) => `Establish Al Hammadi as the first and defining executive voice on ${t} before competitors move in`,
  "CREDIBILITY GAP": (t) => `Leverage Al Hammadi's unique credentials on ${t} to assert leadership presence commensurate with his authority`,
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="border-l-[2px] border-primary pl-3 mb-6">
    <h2 className="text-base font-semibold text-foreground">{title}</h2>
    <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
  </div>
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[13px] font-semibold text-foreground/80 mb-3">{children}</p>
);

const PositioningOpportunities = () => {
  const navigate = useNavigate();

  const handleGapAction = (topic: string, gapType: string) => {
    const obj = objectiveByGap[gapType]?.(topic) ?? "";
    navigate("/brief", { state: { prefill: { keyMessages: topic, objective: obj } } });
  };

  const handleGenerateBrief = (headline: string) => {
    navigate("/brief", { state: { prefill: { keyMessages: headline.replace(/"/g, "") } } });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">Positioning Opportunities</h1>
        <p className="text-sm text-muted-foreground mt-1">Where Al Hammadi's voice is needed — and missing</p>
      </div>

      {/* Data Freshness Banner */}
      <div className="mb-12 rounded-lg border border-[hsl(48,96%,76%)] bg-[hsl(48,100%,96%)] px-4 py-3">
        <p className="text-sm text-[hsl(32,95%,30%)]">
          🕐 Intelligence last updated: <span className="font-semibold">March 3, 2026</span>
        </p>
        <div className="mt-1 space-y-0.5 text-xs text-[hsl(32,95%,30%)]">
          <p>Media data: 50+ publications monitored daily</p>
          <p>LinkedIn data: Competitor posts scraped weekly (last run: March 1, 2026)</p>
          <p>Next scheduled update: March 10, 2026</p>
        </div>
      </div>

      {/* SECTION 1 — Narrative Gap Analysis */}
      <section className="mb-12">
        <SectionHeader
          title="Narrative Gap Analysis"
          subtitle="Topics trending in nuclear & energy media where Al Hammadi's voice is absent or underrepresented"
        />
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60">
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground w-[22%]">Topic</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground w-[18%]">Trending In</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground w-[25%]">Competitors Present</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground w-[15%]">Al Hammadi Presence</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground w-[10%]">Gap Type</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground w-[10%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {gapRows.map((row, i) => {
                const s = gapStyles[row.gapType];
                return (
                  <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : "bg-background"}>
                    <td className="px-4 py-3 font-semibold text-foreground">{row.topic}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.trending}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.competitors}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.presence}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${s.bg} ${s.text} whitespace-nowrap`}>
                        {row.gapType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleGapAction(row.topic, row.gapType)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${s.btnClass}`}
                      >
                        {row.action}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
          <p>🔴 VULNERABILITY — Competitors actively quoted, Al Hammadi absent</p>
          <p>🟢 OPPORTUNITY — Topic growing, no executive owns it yet</p>
          <p>🟡 CREDIBILITY GAP — Al Hammadi has unique authority here but is underrepresented</p>
        </div>
      </section>

      {/* SECTION 2 — Competitor LinkedIn Intelligence */}
      <section className="mb-12">
        <SectionHeader
          title="Competitor LinkedIn Intelligence"
          subtitle="What competing executives are posting about — and what they're not"
        />
        <p className="text-[11px] text-muted-foreground italic text-right -mt-4 mb-6">
          LinkedIn data based on 50 most recent posts per executive | Last scraped: March 1, 2026
        </p>

        {/* 2A — Theme Comparison */}
        <SubHeading>Where the narrative battles are being fought</SubHeading>
        <div className="border border-border rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60">
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Theme</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Al Jaber</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Levesque</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Al Hammadi Gap</th>
              </tr>
            </thead>
            <tbody>
              {themeRows.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : "bg-background"}>
                  <td className="px-4 py-3 font-semibold text-foreground">{row.theme}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{row.alJaber}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{row.levesque}</td>
                  <td className={`px-4 py-3 text-xs ${row.actionable ? "text-foreground" : "text-muted-foreground italic"}`}>
                    {row.gap}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2B — Communication Style */}
        <SubHeading>How competitors communicate — and how Al Hammadi should differ</SubHeading>
        <div className="border border-border rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60">
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Style</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Al Jaber</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Levesque</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Recommendation for Al Hammadi</th>
              </tr>
            </thead>
            <tbody>
              {styleRows.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : "bg-background"}>
                  <td className="px-4 py-3 font-semibold text-foreground">{row.style}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{row.alJaber}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{row.levesque}</td>
                  <td className="px-4 py-3 text-xs font-medium text-primary">{row.rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Insight callout */}
        <div className="mb-8 bg-[hsl(217,91%,95%)] border-l-4 border-primary rounded-r-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-1">💡 KEY INSIGHT</p>
          <p className="text-sm text-foreground/80">
            Al Jaber doesn't post about nuclear at all — he posts about energy broadly, climate, and geopolitics.
            Levesque posts almost exclusively about Natrium/Wyoming construction.
            Neither owns the intersection of nuclear + AI energy demand + proven delivery.
          </p>
          <p className="text-sm font-bold text-primary mt-2">That's Al Hammadi's unclaimed territory.</p>
        </div>

        {/* 2C — Competitor Profile Cards */}
        <SubHeading>Competitor executive profiles</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {competitors.map((c, i) => (
            <Card key={i} className="border border-border rounded-lg p-5">
              <CardContent className="p-0 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{c.name}</span>
                    <span className="text-[11px] bg-[hsl(217,91%,95%)] text-primary px-2.5 py-1 rounded-xl">{c.company}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.title}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">Dominant Narrative</p>
                  <p className="text-xs text-foreground italic">{c.narrative}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5">Top Topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.topics.map((t) => (
                      <span key={t} className="text-[11px] bg-[hsl(217,91%,95%)] text-primary px-2.5 py-1 rounded-xl">{t}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">Posting Style</p>
                  <p className="text-xs text-muted-foreground">{c.style}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">What They're NOT Saying</p>
                  <p className="text-xs text-foreground font-medium">{c.notSaying}</p>
                </div>

                {c.note && (
                  <div className="bg-[hsl(48,96%,89%)] rounded px-3 py-2">
                    <p className="text-[11px] font-medium text-[hsl(32,95%,44%)]">{c.note}</p>
                  </div>
                )}

                <div className="text-[11px] text-muted-foreground pt-1 border-t border-border">
                  <span>Posts analysed: {c.posts}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 3 — Unclaimed Territory */}
      <section className="mb-12">
        <SectionHeader
          title="Unclaimed Territory"
          subtitle="High-value narrative opportunities no competitor is currently owning"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {territories.map((t, i) => (
            <div key={i} className="bg-background rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-t-4 border-primary p-5 flex flex-col">
              <span className={`self-start text-[11px] font-semibold px-2.5 py-1 rounded mb-3 ${t.tagClass}`}>{t.tag}</span>
              <h3 className="text-base font-bold text-foreground mb-2">{t.headline}</h3>
              <p className="text-xs text-muted-foreground mb-3 flex-1">{t.body}</p>

              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-0.5">Why Al Hammadi</p>
                <p className="text-xs text-foreground">{t.why}</p>
              </div>
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-0.5">Suggested Format</p>
                <p className="text-xs text-muted-foreground">{t.format}</p>
              </div>

              <Button className="w-full" onClick={() => handleGenerateBrief(t.headline)}>
                Generate Brief
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PositioningOpportunities;
