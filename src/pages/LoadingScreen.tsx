import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Brain, Radio } from "lucide-react";
import { useAppState } from "@/context/AppContext";

const publications = [
  "Reuters", "Financial Times", "Bloomberg", "The Wall Street Journal",
  "Associated Press", "S&P Global", "Arab News", "Khaleej Times",
  "Gulf Today", "Oil & Gas Middle East",
];

const LoadingScreen = () => {
  const navigate = useNavigate();
  const { setHasSeenLoader } = useAppState();
  const [stage, setStage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [visiblePubs, setVisiblePubs] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const rafRef = useRef<number>();
  const startRef = useRef<number>(0);

  // Stage 1: smooth progress bar via rAF
  useEffect(() => {
    if (stage !== 1) return;
    startRef.current = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / 6000) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setStage(2);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [stage]);

  // Stage 2: 2 seconds then advance
  useEffect(() => {
    if (stage !== 2) return;
    const t = setTimeout(() => setStage(3), 5000);
    return () => clearTimeout(t);
  }, [stage]);

  // Stage 3: sequential publication reveal
  useEffect(() => {
    if (stage !== 3) return;
    const interval = setInterval(() => {
      setVisiblePubs((p) => {
        if (p >= publications.length) {
          clearInterval(interval);
          return p;
        }
        return p + 1;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [stage]);

  // Confirmation after all pubs visible
  useEffect(() => {
    if (visiblePubs < publications.length) return;
    const t = setTimeout(() => setShowConfirmation(true), 100);
    return () => clearTimeout(t);
  }, [visiblePubs]);

  // Navigate after confirmation
  useEffect(() => {
    if (!showConfirmation) return;
    const t = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        setHasSeenLoader(true);
        navigate("/", { replace: true });
      }, 400);
    }, 3000);
    return () => clearTimeout(t);
  }, [showConfirmation, navigate, setHasSeenLoader]);

  return (
    <div
      className={`min-h-screen bg-white flex flex-col transition-opacity duration-400 ${fadingOut ? "opacity-0" : "opacity-100"}`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold text-primary tracking-tight">edelman</span>
        <span className="text-sm font-semibold text-foreground">ENEC</span>
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          {/* Stage 1 */}
          <div
            className="transition-opacity duration-300"
            style={{ opacity: stage === 1 ? 1 : 0, position: stage === 1 ? "relative" : "absolute", pointerEvents: stage === 1 ? "auto" : "none" }}
          >
            <Shield className="mx-auto mb-4 text-primary" size={32} />
            <h1 className="text-xl font-bold text-foreground mb-2">Loading ENEC Knowledge Base</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Ingesting brand guidelines, spokesperson protocols, approved messaging frameworks and Barakah nuclear positioning documents
            </p>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress}%`, transition: "none" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
          </div>

          {/* Stage 2 */}
          <div
            className="transition-opacity duration-300"
            style={{ opacity: stage === 2 ? 1 : 0, position: stage === 2 ? "relative" : "absolute", pointerEvents: stage === 2 ? "auto" : "none" }}
          >
            <Brain className="mx-auto mb-4 text-primary" size={32} />
            <h1 className="text-xl font-bold text-foreground mb-2">Applying Edelman Strategic Intelligence</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Calibrating against executive positioning benchmarks, regional communications expertise and nuclear sector tone-of-voice models
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="loading-dot w-2.5 h-2.5 rounded-full bg-primary inline-block" />
              <span className="loading-dot w-2.5 h-2.5 rounded-full bg-primary inline-block" />
              <span className="loading-dot w-2.5 h-2.5 rounded-full bg-primary inline-block" />
            </div>
          </div>

          {/* Stage 3 */}
          <div
            className="transition-opacity duration-300"
            style={{ opacity: stage === 3 ? 1 : 0, position: stage === 3 ? "relative" : "absolute", pointerEvents: stage === 3 ? "auto" : "none" }}
          >
            <Radio className="mx-auto mb-4 text-primary" size={32} />
            <h1 className="text-xl font-bold text-foreground mb-2">Scanning Global News Sources</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Monitoring Tier 1 energy and business publications for executive mentions, direct quotes and emerging narratives
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {publications.map((pub, i) => (
                <span
                  key={pub}
                  className="text-xs font-medium text-muted-foreground transition-opacity duration-200 grayscale"
                  style={{ opacity: i < visiblePubs ? 1 : 0 }}
                >
                  {pub}
                </span>
              ))}
            </div>
            {showConfirmation && (
              <p className="text-[13px] text-foreground animate-fade-in">
                <span className="text-primary">✅</span>{" "}
                <span className="font-bold">Intelligence Ready</span> — 1,247 articles processed across 50+ publications
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Edelman APEX Ascent Intelligence Platform
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
