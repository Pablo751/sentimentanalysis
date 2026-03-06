import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, type RepositoryDocument } from "@/context/AppContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const statusColor: Record<string, string> = {
  "Pending Approval": "bg-warning/15 text-warning",
  Approved: "bg-secondary/15 text-secondary",
  "Sent to Client": "bg-primary/15 text-primary",
};

const scoreColor = (s: number) =>
  s >= 80 ? "text-secondary" : s >= 60 ? "text-warning" : "text-destructive";

const Documents = () => {
  const navigate = useNavigate();
  const {
    documents,
    updateDocumentStatus,
    setViewingDocId,
    generatedDocument,
    showRepoSuccess,
    setShowRepoSuccess,
  } = useAppState();

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [execFilter, setExecFilter] = useState("all");

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (typeFilter !== "all" && d.type !== typeFilter) return false;
      if (execFilter !== "all" && d.executive !== execFilter) return false;
      return true;
    });
  }, [documents, statusFilter, typeFilter, execFilter]);

  const stats = useMemo(() => {
    const total = documents.length;
    const approved = documents.filter((d) => d.status === "Approved").length;
    const pending = documents.filter((d) => d.status === "Pending Approval").length;
    const avg = total > 0 ? Math.round(documents.reduce((s, d) => s + d.evalScore, 0) / total) : 0;
    return { total, approved, pending, avg };
  }, [documents]);

  const openDocument = (doc: RepositoryDocument) => {
    if (doc.isLive && generatedDocument) {
      setViewingDocId(null);
      navigate("/document");
    } else {
      setViewingDocId(doc.id);
      navigate("/document");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Success banner */}
      {showRepoSuccess && (
        <div className="mb-4 p-3 rounded-md bg-secondary/10 text-secondary text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-icons text-base">check_circle</span>
            Document saved to repository
          </div>
          <button onClick={() => setShowRepoSuccess(false)} className="material-icons text-base hover:opacity-70">close</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Positioning Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">All executive positioning documents — ENEC</p>
        </div>
        <button
          onClick={() => navigate("/brief")}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="material-icons text-base">add</span>
          New Brief
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Documents", value: stats.total },
          { label: "Approved", value: stats.approved },
          { label: "Pending Approval", value: stats.pending },
          { label: "Avg Eval Score", value: `${stats.avg}/100` },
        ].map((s) => (
          <div key={s.label} className="bg-background border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending Approval">Pending Approval</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Sent to Client">Sent to Client</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Deliverable Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Talking Points">Talking Points</SelectItem>
            <SelectItem value="Press Release">Press Release</SelectItem>
            <SelectItem value="Briefing Note">Briefing Note</SelectItem>
            <SelectItem value="Bio">Bio</SelectItem>
            <SelectItem value="Interview Points">Interview Points</SelectItem>
          </SelectContent>
        </Select>

        <Select value={execFilter} onValueChange={setExecFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Executive" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Executives</SelectItem>
            <SelectItem value="Mohamed Al Hammadi">Mohamed Al Hammadi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Title</TableHead>
              <TableHead className="hidden md:table-cell">Executive</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Event Date</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="hidden md:table-cell">Eval Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Approved By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((doc) => (
              <TableRow
                key={doc.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => openDocument(doc)}
              >
                <TableCell className="font-medium">{doc.title}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{doc.executive}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {doc.type}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{doc.eventDate}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{doc.created}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className={`font-semibold text-sm ${scoreColor(doc.evalScore)}`}>
                    {doc.evalScore}/100
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap ${statusColor[doc.status]}`}>
                    {doc.status}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                  {doc.approvedBy || "—"}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openDocument(doc)}
                      className="px-3 py-1 text-xs font-medium border border-primary text-primary rounded hover:bg-accent transition-colors"
                    >
                      Open
                    </button>
                    {doc.status === "Approved" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors">
                            <span className="material-icons text-base">more_vert</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateDocumentStatus(doc.id, "Sent to Client")}>
                            Mark as Sent to Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                  No documents match the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Documents;
