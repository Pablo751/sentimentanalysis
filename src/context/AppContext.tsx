import { createContext, useContext, useState, ReactNode, useCallback } from "react";

type DateRange = "7d" | "30d" | "90d";
type DocStatus = "Pending Approval" | "Approved" | "Sent to Client";

export interface RepositoryDocument {
  id: string;
  title: string;
  executive: string;
  type: string;
  eventDate: string;
  created: string;
  evalScore: number;
  status: DocStatus;
  approvedBy: string;
  content: string | null;
  evaluation: EvaluationData | null;
  isLive?: boolean;
}

export interface EvaluationData {
  overall_score: number;
  overall_verdict: string;
  dimensions: {
    objective_fit: { score: number; verdict: string };
    messaging_cutthrough: { score: number; verdict: string };
    audience_resonance: { score: number; verdict: string };
  };
  what_is_working: string[];
  what_is_missing: string[];
  priority_action: string;
}

interface AppState {
  generatedDocument: string | null;
  setGeneratedDocument: (doc: string | null) => void;
  evaluation: EvaluationData | null;
  setEvaluation: (ev: EvaluationData | null) => void;
  documentApproved: boolean;
  setDocumentApproved: (v: boolean) => void;
  approvedBy: string;
  setApprovedBy: (v: string) => void;
  dateRange: DateRange;
  setDateRange: (v: DateRange) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  resetState: () => void;
  documents: RepositoryDocument[];
  addDocument: (doc: RepositoryDocument) => void;
  updateDocumentStatus: (id: string, status: DocStatus) => void;
  viewingDocId: string | null;
  setViewingDocId: (id: string | null) => void;
  showRepoSuccess: boolean;
  setShowRepoSuccess: (v: boolean) => void;
  hasSeenLoader: boolean;
  setHasSeenLoader: (v: boolean) => void;
}

const INITIAL_DOCS: RepositoryDocument[] = [
  {
    id: "demo-ceraweek",
    title: "CERAWeek 2026 — Talking Points",
    executive: "Mohamed Al Hammadi",
    type: "Talking Points",
    eventDate: "March 18, 2026",
    created: "February 27, 2026",
    evalScore: 84,
    status: "Approved",
    approvedBy: "J. Martinez",
    content: null,
    evaluation: null,
    isLive: true,
  },
  {
    id: "demo-wfes",
    title: "World Future Energy Summit — Keynote Points",
    executive: "Mohamed Al Hammadi",
    type: "Talking Points",
    eventDate: "January 20, 2026",
    created: "January 15, 2026",
    evalScore: 91,
    status: "Approved",
    approvedBy: "S. Al Rashid",
    content: null,
    evaluation: null,
  },
  {
    id: "demo-reuters",
    title: "Reuters Energy Transition Interview",
    executive: "Mohamed Al Hammadi",
    type: "Interview Points",
    eventDate: "December 10, 2025",
    created: "December 5, 2025",
    evalScore: 78,
    status: "Sent to Client",
    approvedBy: "J. Martinez",
    content: null,
    evaluation: null,
  },
  {
    id: "demo-sp",
    title: "S&P Global Platts Awards — Press Release",
    executive: "Mohamed Al Hammadi",
    type: "Press Release",
    eventDate: "December 12, 2025",
    created: "December 8, 2025",
    evalScore: 88,
    status: "Sent to Client",
    approvedBy: "S. Al Rashid",
    content: null,
    evaluation: null,
  },
];

const AppContext = createContext<AppState | null>(null);

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [documentApproved, setDocumentApproved] = useState(false);
  const [approvedBy, setApprovedBy] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<RepositoryDocument[]>(INITIAL_DOCS);
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);
  const [showRepoSuccess, setShowRepoSuccess] = useState(false);
  const [hasSeenLoader, setHasSeenLoader] = useState(false);

  const addDocument = useCallback((doc: RepositoryDocument) => {
    setDocuments((prev) => [doc, ...prev.filter((d) => d.id !== doc.id)]);
  }, []);

  const updateDocumentStatus = useCallback((id: string, status: DocStatus) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  }, []);

  const resetState = () => {
    setGeneratedDocument(null);
    setEvaluation(null);
    setDocumentApproved(false);
    setApprovedBy("");
    setDateRange("30d");
    setSelectedEventId(null);
    setViewingDocId(null);
    setHasSeenLoader(false);
  };

  return (
    <AppContext.Provider
      value={{
        generatedDocument, setGeneratedDocument,
        evaluation, setEvaluation,
        documentApproved, setDocumentApproved,
        approvedBy, setApprovedBy,
        dateRange, setDateRange,
        selectedEventId, setSelectedEventId,
        resetState,
        documents, addDocument, updateDocumentStatus,
        viewingDocId, setViewingDocId,
        showRepoSuccess, setShowRepoSuccess,
        hasSeenLoader, setHasSeenLoader,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
