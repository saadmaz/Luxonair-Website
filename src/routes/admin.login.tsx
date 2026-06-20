import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Plane, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    // Simulate a brief loading state — replace with real auth check later
    await new Promise((r) => setTimeout(r, 600));

    // For UI-only phase: any non-empty password grants access.
    // This will be replaced with a real server-side check in Phase 3.
    if (password.length >= 1) {
      localStorage.setItem("lx_admin", "1");
      navigate({ to: "/admin" });
    } else {
      setError("Incorrect password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#042045] px-4">
      {/* Card */}
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow-lg shadow-black/20 ring-1 ring-white/10">
            <Plane className="h-7 w-7 text-white" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-wide text-white">Luxonair</h1>
            <p className="mt-0.5 text-xs uppercase tracking-widest text-white/40">Admin Access</p>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl shadow-black/30">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Sign in</h2>
          <p className="mb-6 text-sm text-gray-500">Enter your admin password to continue.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#042045] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#042045]/90 focus:outline-none focus:ring-2 focus:ring-[#042045]/30 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className="mt-6 text-center text-xs text-white/30">
          <a href="/" className="transition-colors hover:text-white/60">
            ← Back to Luxonair
          </a>
        </p>
      </div>
    </div>
  );
}
