import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthConfigured, login } = useAppState();

  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = login(email, password);
    if (!result.ok) {
      setError(result.error || "Unable to sign in.");
      return;
    }

    navigate("/loading", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 relative"
      style={{
        backgroundImage: "url('/login-bg.png')",
        backgroundColor: "hsl(216 100% 10%)",
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "hsla(216, 100%, 15%, 0.80)" }} />
      <div className="relative z-10 w-full max-w-md rounded-lg shadow-xl p-8" style={{ backgroundColor: "rgba(255,255,255,0.95)" }}>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Edelman APEX Ascent Intelligence Platform</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          {!isAuthConfigured && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Set `VITE_APP_PASSWORD` in your local environment before using this login.
            </div>
          )}
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@edelman.com"
              autoComplete="email"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Access password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={!isAuthConfigured}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors mt-2"
          >
            Enter workspace
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
