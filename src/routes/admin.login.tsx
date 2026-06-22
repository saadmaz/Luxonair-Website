import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, AlertCircle, Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    localStorage.setItem("lx_admin", "1");
    navigate({ to: "/admin" });
    setLoading(false);
  };

  const clearError = () => { if (error) setError(""); };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#031e3e] px-4">
      <div className="w-full max-w-[380px]">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <img
            src="/Luxeonair-logo-withoutbg.png"
            alt="Luxe on Air"
            className="h-10 w-auto brightness-0 invert opacity-90"
          />
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40">
          <div className="border-b border-gray-100 px-8 py-6">
            <h1 className="text-[17px] font-bold text-gray-900">Sign in to your account</h1>
            <p className="mt-1 text-sm text-gray-400">Enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-8 py-6 space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  placeholder="you@luxonair.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#031e3e] focus:bg-white focus:ring-2 focus:ring-[#031e3e]/10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#031e3e] focus:bg-white focus:ring-2 focus:ring-[#031e3e]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#031e3e] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#042045] focus:outline-none focus:ring-2 focus:ring-[#031e3e]/30 focus:ring-offset-2 disabled:opacity-60"
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
        <p className="mt-6 text-center text-xs text-white/25">
          <a href="/" className="transition-colors hover:text-white/50">
            ← Back to Luxe on Air
          </a>
        </p>
      </div>
    </div>
  );
}
