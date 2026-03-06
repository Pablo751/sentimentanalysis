import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import type { EvaluationData } from "@/context/AppContext";
import { eventScenarios } from "@/data/eventScenarios";
import { ApiError, apiRequest } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenerateDocumentResponse {
  document: string;
}

interface EvaluateDocumentResponse {
  evaluation: EvaluationData;
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
  const { logout, setGeneratedDocument, setEvaluation, setSelectedEventId, setDocumentApproved, setApprovedBy } = useAppState();
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
      const docData = await apiRequest<GenerateDocumentResponse>("/api/documents/generate", {
        method: "POST",
        json: {
          scenario: currentScenario,
        },
      });
      setGeneratedDocument(docData.document);

      const evalData = await apiRequest<EvaluateDocumentResponse>("/api/documents/evaluate", {
        method: "POST",
        json: {
          scenario: currentScenario,
          documentText: docData.document,
        },
      });
      setEvaluation(evalData.evaluation);

      navigate("/document");
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        await logout();
        navigate("/login", { replace: true });
        return;
      }

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
