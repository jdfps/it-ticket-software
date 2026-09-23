import { useState } from "react";
import {
  CloudLightning,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const INITIAL_FORM = {
  email: "",
  password: "",
};

export default function Login({ onLogin }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    // Dummy authentication for now.
    // FastAPI/MySQL will replace this later.
    setTimeout(() => {
      setSubmitting(false);

      if (onLogin) {
        onLogin({
          email: form.email.trim(),
          password: form.password,
          remember,
        });
      }
    }, 700);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 font-sans text-slate-50 antialiased">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 10%, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%)",
        }}
      />

      <div className="mb-8 flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
          <CloudLightning className="h-6 w-6" />
        </div>

        <span className="font-heading text-2xl font-bold tracking-tight text-white">
          Cloud IT <span className="text-sky-400">Desk</span>
        </span>

        <p className="mt-1 text-sm text-slate-400">
          Sign in to manage and track support tickets.
        </p>
      </div>

      <div
        className="w-full max-w-sm rounded-2xl border border-slate-700/80 p-6 shadow-2xl sm:p-8"
        style={{
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(12px)",
        }}
      >
        {(errors.email || errors.password) && (
          <div className="mb-6 flex items-start space-x-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>Please fix the highlighted fields below.</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="loginEmail"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              Email address
            </label>

            <div className="relative">
              <input
                type="email"
                id="loginEmail"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@company.com"
                autoComplete="email"
                className={`w-full rounded-xl border bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-50 placeholder-slate-500 transition focus:outline-none focus:ring-[3px] ${
                  errors.email
                    ? "border-rose-400 focus:ring-rose-400/15"
                    : "border-slate-700 focus:border-sky-400 focus:ring-sky-400/15"
                }`}
              />

              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
            </div>

            {errors.email && (
              <span className="mt-1 block text-xs text-rose-400">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="loginPassword"
                className="block text-sm font-medium text-slate-200"
              >
                Password
              </label>

              {/* <button
                type="button"
                className="text-xs font-medium text-sky-400 transition hover:text-sky-300"
              >
                Forgot password?
              </button> */}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="loginPassword"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`w-full rounded-xl border bg-slate-950 py-3 pl-11 pr-11 text-sm text-slate-50 placeholder-slate-500 transition focus:outline-none focus:ring-[3px] ${
                  errors.password
                    ? "border-rose-400 focus:ring-rose-400/15"
                    : "border-slate-700 focus:border-sky-400 focus:ring-sky-400/15"
                }`}
              />

              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock className="h-4 w-4" />
              </div>

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 transition hover:text-slate-300"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <span className="mt-1 block text-xs text-rose-400">
                {errors.password}
              </span>
            )}
          </div>

          <label className="flex cursor-pointer items-center space-x-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-sky-500 focus:ring-sky-400/40"
            />

            <span>Keep me signed in on this device</span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full transform items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-400 hover:to-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Having trouble signing in? Contact your IT administrator.
      </p>
    </div>
  );
}