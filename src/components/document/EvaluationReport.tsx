import { useAppState } from "@/context/AppContext";

const EvaluationReport = () => {
  const { evaluation } = useAppState();

  if (!evaluation) {
    return (
      <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-base font-bold mb-2">Messaging Evaluation</h2>
        <p className="text-sm text-muted-foreground">Evaluation is being processed...</p>
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  const verdictColor = evaluation.overall_verdict === "STRONG" ? "text-secondary" : "text-warning";
  const barColor = evaluation.overall_verdict === "STRONG" ? "bg-secondary" : "bg-warning";

  return (
    <div className="space-y-4">
      {/* Overall score */}
      <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
        <h2 className="text-base font-bold mb-1">Messaging Evaluation</h2>
        <p className="text-xs text-muted-foreground mb-4">Automated assessment against brief objective</p>

        <div className="text-center py-4">
          <div className="text-4xl font-bold text-foreground">{evaluation.overall_score} <span className="text-lg text-muted-foreground font-normal">/ 100</span></div>
          <div className={`text-sm font-semibold mt-1 ${verdictColor}`}>{evaluation.overall_verdict}</div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-3">
            <div className={`${barColor} h-1.5 rounded-full transition-all`} style={{ width: `${evaluation.overall_score}%` }} />
          </div>
        </div>
      </div>

      {/* Dimension scores */}
      {[
        { key: "objective_fit" as const, label: "Objective Fit" },
        { key: "messaging_cutthrough" as const, label: "Messaging Cut-Through" },
        { key: "audience_resonance" as const, label: "Audience Resonance" },
      ].map(({ key, label }) => {
        const dim = evaluation.dimensions[key];
        return (
          <div key={key} className="bg-background border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <span className="text-sm font-bold text-foreground">{dim.score}/100</span>
            </div>
            <p className="text-xs text-muted-foreground">{dim.verdict}</p>
          </div>
        );
      })}

      {/* What's working */}
      <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <span className="text-secondary">✅</span> What is Working
        </h3>
        <ul className="space-y-2">
          {evaluation.what_is_working.map((item, i) => (
            <li key={i} className="text-xs text-muted-foreground leading-relaxed">• {item}</li>
          ))}
        </ul>
      </div>

      {/* What's missing */}
      <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <span className="text-warning">⚠️</span> What is Missing
        </h3>
        <ul className="space-y-2">
          {evaluation.what_is_missing.map((item, i) => (
            <li key={i} className="text-xs text-muted-foreground leading-relaxed">• {item}</li>
          ))}
        </ul>
      </div>

      {/* Priority action */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
          <span>🎯</span> Priority Action
        </h3>
        <p className="text-xs text-foreground leading-relaxed">{evaluation.priority_action}</p>
      </div>

      {/* Research sources */}
      <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3">Research Sources Used</h3>
        <div className="flex flex-wrap gap-1.5">
          {["FT Jan 2025", "S&P Award PR Dec 2025", "Arabian Business Jan 2025", "World Nuclear News Feb 2025", "CERAWeek 2026 Agenda"].map((s) => (
            <span key={s} className="text-[10px] px-2 py-1 bg-muted text-muted-foreground rounded">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationReport;
