import { useState } from "react";
import {
  CloudLightning,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function SetPassword({ user, onPasswordSet }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "New password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password =
        "Password must contain at least one number.";
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
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

    // Simulated password update.
    // This will eventually become a FastAPI request.
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        if (onPasswordSet) {
          onPasswordSet(password);
        }
      }, 800);
    }, 700);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (errors.password) {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);

    if (errors.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 font-sans text-slate-50 antialiased">
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 10%, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%)",
        }}
      />

      {/* Branding */}
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
          <CloudLightning className="h-6 w-6" />
        </div>

        <span className="font-heading text-2xl font-bold tracking-tight text-white">
          Cloud IT <span className="text-sky-400">Desk</span>
        </span>

        <p className="mt-1 text-sm text-slate-400">
          Secure your account before continuing.
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl border border-slate-700/80 p-6 shadow-2xl sm:p-8"
        style={{
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(12px)",
        }}
      >
        {!success ? (
          <>
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h1 className="text-xl font-bold text-white">
                Create Your Password
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                You're signing in for the first time. Create a new
                password before continuing to your dashboard.
              </p>

              {user?.email && (
                <p className="mt-2 text-xs font-medium text-sky-400">
                  {user.email}
                </p>
              )}
            </div>

            {/* Error Alert */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 flex items-start space-x-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />

                <span>
                  Please fix the highlighted fields below.
                </span>
              </div>
            )}

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-1.5 block text-sm font-medium text-slate-200"
                >
                  New Password
                </label>

                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
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
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 transition hover:text-slate-300"
                    title={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-slate-200"
                >
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Re-enter your new password"
                    autoComplete="new-password"
                    className={`w-full rounded-xl border bg-slate-950 py-3 pl-11 pr-11 text-sm text-slate-50 placeholder-slate-500 transition focus:outline-none focus:ring-[3px] ${
                      errors.confirmPassword
                        ? "border-rose-400 focus:ring-rose-400/15"
                        : "border-slate-700 focus:border-sky-400 focus:ring-sky-400/15"
                    }`}
                  />

                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 transition hover:text-slate-300"
                    title={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <span className="mt-1 block text-xs text-rose-400">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Password Requirements */}
              <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Password Requirements
                </p>

                <ul className="space-y-1 text-xs text-slate-500">
                  <li>• At least 8 characters</li>
                  <li>• At least one uppercase letter</li>
                  <li>• At least one lowercase letter</li>
                  <li>• At least one number</li>
                  <li>• At least one special character</li>
                </ul>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full transform items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-400 hover:to-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting Password...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Set Password
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success */
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h2 className="text-xl font-bold text-white">
              Password Created
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Your password has been updated successfully.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Loading your dashboard...
            </p>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Having trouble? Contact your IT administrator.
      </p>
    </div>
  );
}