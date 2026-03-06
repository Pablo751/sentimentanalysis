import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { useAppState, type EvaluationData, type RepositoryDocument } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import EvaluationReport from "@/components/document/EvaluationReport";
import { eventScenarios } from "@/data/eventScenarios";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const GeneratedDocument = () => {
  const {
    generatedDocument,
    evaluation,
    documentApproved,
    setDocumentApproved,
    approvedBy,
    setApprovedBy,
    selectedEventId,
    documents,
    viewingDocId,
    setViewingDocId,
    addDocument,
    showRepoSuccess,
    setShowRepoSuccess,
  } = useAppState();
  const navigate = useNavigate();
  const selectedEvent = eventScenarios.find((s) => s.id === selectedEventId);

  // Determine if we're viewing a historical (placeholder) doc
  const viewingDoc: RepositoryDocument | null = useMemo(() => {
    if (!viewingDocId) return null;
    return documents.find((d) => d.id === viewingDocId) || null;
  }, [viewingDocId, documents]);

  const isPlaceholder = !!viewingDoc && !viewingDoc.isLive;
  const isLiveView = !viewingDoc; // viewing the live generated doc

  // Placeholder evaluation from repo score
  const placeholderEval = useMemo(() => {
    if (!viewingDoc) return null;
    const s = viewingDoc.evalScore;
    return {
      overall_score: s,
      overall_verdict: s >= 80 ? "STRONG" : "NEEDS REFINEMENT",
      dimensions: {
        objective_fit: { score: s + 3, verdict: "Evaluation details archived." },
        messaging_cutthrough: { score: s, verdict: "Evaluation details archived." },
        audience_resonance: { score: s - 4, verdict: "Evaluation details archived." },
      },
      what_is_working: ["Evaluation details archived. Generate a new document to see full evaluation."],
      what_is_missing: ["Evaluation details archived. Generate a new document to see full evaluation."],
      priority_action: "Evaluation details archived. Generate a new document to see full evaluation.",
    };
  }, [viewingDoc]);

  // Handle approve & auto-save to repository
  const handleApprove = () => {
    setDocumentApproved(true);

    // Auto-save to repository
    if (selectedEvent && generatedDocument) {
      const newDoc: RepositoryDocument = {
        id: `generated-${Date.now()}`,
        title: `${selectedEvent.label} — Talking Points`,
        executive: "Mohamed Al Hammadi",
        type: "Talking Points",
        eventDate: selectedEvent.date,
        created: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
        evalScore: evaluation?.overall_score || 0,
        status: "Approved",
        approvedBy: approvedBy,
        content: generatedDocument,
        evaluation: evaluation,
        isLive: true,
      };
      addDocument(newDoc);
      setShowRepoSuccess(true);
    }
  };

  // No content to show
  if (!generatedDocument && !viewingDoc) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-20 text-center">
        <span className="material-icons text-muted-foreground text-5xl mb-4">description</span>
        <p className="text-muted-foreground">No document generated yet. Go to Brief Intake to create one.</p>
      </div>
    );
  }

  // Determine display values
  const displayTitle = isPlaceholder
    ? viewingDoc.title
    : `Talking Points — ${selectedEvent?.label || "Document"}`;

  const displaySubtitle = isPlaceholder
    ? `${viewingDoc.executive} | ${viewingDoc.title.split(" — ")[0]} | ${viewingDoc.eventDate}`
    : selectedEvent
      ? `${selectedEvent.executive.split(" — ")[0]} | ${selectedEvent.interviewer} | ${selectedEvent.date}`
      : "Generated Document";

  const displayApproved = isPlaceholder ? true : documentApproved;
  const displayStatus = isPlaceholder ? viewingDoc.status : documentApproved ? "Approved" : "Pending Approval";
  const displayContent = isPlaceholder
    ? null
    : generatedDocument;

  const displayEval = isPlaceholder ? placeholderEval : evaluation;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {isPlaceholder && (
        <button
          onClick={() => { setViewingDocId(null); navigate("/documents"); }}
          className="mb-4 text-sm text-primary flex items-center gap-1 hover:underline"
        >
          <span className="material-icons text-base">arrow_back</span>
          Back to Documents
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT — Document */}
        <div className="lg:col-span-3">
          <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
            {/* Document header */}
            <div className="flex items-start justify-between mb-1">
              <div>
                <h1 className="text-xl font-bold">{displayTitle}</h1>
                <p className="text-sm text-muted-foreground mt-1">{displaySubtitle}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isPlaceholder ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        disabled
                        className="px-3 py-1.5 text-xs font-medium border border-input text-muted-foreground rounded-md opacity-50 cursor-not-allowed"
                      >
                        Export .docx
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Available for newly generated documents</TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <button className="px-3 py-1.5 text-xs font-medium border border-primary text-primary rounded-md hover:bg-accent transition-colors">
                      Export .docx
                    </button>
                    {!documentApproved && (
                      <button className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90">
                        Approve & Finalise
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2 mb-6">
              {isPlaceholder ? (
                <>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-secondary/10 text-secondary">Approved</span>
                  {viewingDoc.status === "Sent to Client" && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-primary/10 text-primary">Sent to Client</span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">AI Generated</span>
                  {documentApproved ? (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-secondary/10 text-secondary">Approved</span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-warning/10 text-warning">Pending Approval</span>
                  )}
                </>
              )}
            </div>

            {/* Document content */}
            {isPlaceholder ? (
              <div className="py-10 text-center">
                <span className="material-icons text-muted-foreground text-4xl mb-3">archive</span>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  This document was generated and approved prior to the current session. Full document content is available in the client archive.
                  Use the Brief Intake form to generate a new version or variation of this document.
                </p>
              </div>
            ) : (
              <div className="prose max-w-none">
                <ReactMarkdown>{displayContent || ""}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Evaluation */}
        <div className="lg:col-span-2">
          {isPlaceholder && placeholderEval ? (
            <PlaceholderEvaluation eval={placeholderEval} />
          ) : (
            <EvaluationReport />
          )}
        </div>
      </div>

      {/* Approve bar — only for live docs */}
      {isLiveView && generatedDocument && (
        <>
          <div className="mt-6 bg-muted rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Approved by:</span>
              <input
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                disabled={documentApproved}
                placeholder="Enter name"
                className="px-3 py-1.5 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground w-64 disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleApprove}
              disabled={documentApproved || !approvedBy}
              className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
            >
              {documentApproved && <span className="material-icons text-base">check</span>}
              {documentApproved ? "Approved" : "Approve & Finalise"}
            </button>
          </div>
          {documentApproved && (
            <p className="text-xs text-muted-foreground mt-2 text-right">
              Approved on {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} at {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </>
      )}
    </div>
  );
};

// Placeholder evaluation component for archived docs
const PlaceholderEvaluation = ({ eval: ev }: { eval: EvaluationData }) => {
  const verdictColor = ev.overall_verdict === "STRONG" ? "text-secondary" : "text-warning";
  const barColor = ev.overall_verdict === "STRONG" ? "bg-secondary" : "bg-warning";

  return (
    <div className="space-y-4">
      <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
        <h2 className="text-base font-bold mb-1">Messaging Evaluation</h2>
        <p className="text-xs text-muted-foreground mb-4">Archived assessment</p>
        <div className="text-center py-4">
          <div className="text-4xl font-bold text-foreground">{ev.overall_score} <span className="text-lg text-muted-foreground font-normal">/ 100</span></div>
          <div className={`text-sm font-semibold mt-1 ${verdictColor}`}>{ev.overall_verdict}</div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-3">
            <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${ev.overall_score}%` }} />
          </div>
        </div>
      </div>

      {[
        { label: "Objective Fit", score: ev.dimensions.objective_fit.score },
        { label: "Messaging Cut-Through", score: ev.dimensions.messaging_cutthrough.score },
        { label: "Audience Resonance", score: ev.dimensions.audience_resonance.score },
      ].map(({ label, score }) => (
        <div key={label} className="bg-background border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-foreground">{label}</span>
            <span className="text-sm font-bold text-foreground">{score}/100</span>
          </div>
          <p className="text-xs text-muted-foreground">Evaluation details archived.</p>
        </div>
      ))}

      <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <span className="text-secondary">✅</span> What is Working
        </h3>
        <p className="text-xs text-muted-foreground">Evaluation details archived. Generate a new document to see full evaluation.</p>
      </div>

      <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <span className="text-warning">⚠️</span> What is Missing
        </h3>
        <p className="text-xs text-muted-foreground">Evaluation details archived. Generate a new document to see full evaluation.</p>
      </div>

      <div className="bg-warning/10 border border-warning/20 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
          <span>🎯</span> Priority Action
        </h3>
        <p className="text-xs text-foreground">Evaluation details archived. Generate a new document to see full evaluation.</p>
      </div>
    </div>
  );
};

export default GeneratedDocument;
