import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { eventScenarios } from "@/data/eventScenarios";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { generatedDocument, logout, selectedEventId, viewingDocId } = useAppState();
  const selectedEvent = eventScenarios.find((s) => s.id === selectedEventId);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const showDocTab = generatedDocument || viewingDocId;
  let docTabLabel = "Generated Document";
  if (viewingDocId) {
    docTabLabel = "Viewing Document";
  } else if (selectedEvent) {
    docTabLabel = `${selectedEvent.label} — Talking Points`;
  }

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-14">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-primary tracking-tight">edelman</span>
          <div className="w-px h-6 bg-border" />
          <span className="text-sm text-muted-foreground font-medium">APEX Ascent</span>
        </div>

        {/* Center: Nav links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive("/")
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/brief"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive("/brief")
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Brief Intake
          </Link>
          <Link
            to="/documents"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive("/documents")
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Documents
          </Link>
          <Link
            to="/opportunities"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive("/opportunities")
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Positioning Opportunities
          </Link>
          {showDocTab && (
            <Link
              to="/document"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive("/document")
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {docTabLabel}
            </Link>
          )}
        </div>

        {/* Right: Account + Settings */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-sm font-medium text-foreground">ENEC</span>
            <span className="material-icons text-muted-foreground text-base">arrow_drop_down</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm font-medium border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
