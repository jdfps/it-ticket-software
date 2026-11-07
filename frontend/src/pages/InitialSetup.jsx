import { useState } from "react";
import { ShieldCheck, LockKeyhole, Loader2 } from "lucide-react";

export default function InitialSetup({ onInitialize, keyConfigured }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    setup_key: "",
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);

  const change = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    if (form.password.length < 12) {
      setMessage("Use a password with at least 12 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await onInitialize({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        setup_key: form.setup_key,
      });
      setComplete(true);
    } catch (err) {
      setMessage(typeof err.message === "string" ? err.message : "Setup failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const fieldStyle = "mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-white outline-none focus:border-sky-400";
  const labelStyle = "block text-sm text-slate-200";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-50">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-7 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <ShieldCheck className="h-9 w-9 text-sky-400" />
          <div>
            <h1 className="text-2xl font-bold">Welcome to IT Ticket System</h1>
            <p className="text-sm text-slate-400">One-time company administrator setup</p>
          </div>
        </div>
        <p className="mb-6 text-sm text-slate-300">
          Set up the first administrator for this installation. You'll use this account to create employees and technicians.
        </p>
        {!keyConfigured && (
          <p role="alert" className="mb-4 rounded-lg border border-amber-700 bg-amber-950/40 p-3 text-sm text-amber-200">
            Your server is missing a secure INITIAL_SETUP_KEY. Ask the person deploying the backend to add it to the environment before continuing.
          </p>
        )}
        {complete ? (
          <p role="status" className="rounded-xl border border-emerald-800 p-4 text-emerald-300">Administrator created. You can now sign in.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={labelStyle}>First name
                <input className={fieldStyle} required maxLength={255} autoComplete="given-name" value={form.first_name} onChange={change("first_name")} />
              </label>
              <label className={labelStyle}>Last name
                <input className={fieldStyle} required maxLength={255} autoComplete="family-name" value={form.last_name} onChange={change("last_name")} />
              </label>
            </div>
            <label className={labelStyle}>Admin email
              <input className={fieldStyle} type="email" required autoComplete="email" value={form.email} onChange={change("email")} />
            </label>
            <label className={labelStyle}>Password (12+ characters)
              <input className={fieldStyle} type="password" required minLength={12} maxLength={72} autoComplete="new-password" value={form.password} onChange={change("password")} />
            </label>
            <label className={labelStyle}>Confirm password
              <input className={fieldStyle} type="password" required autoComplete="new-password" value={form.confirmPassword} onChange={change("confirmPassword")} />
            </label>
            <label className={labelStyle}>Deployment setup key
              <input className={fieldStyle} type="password" required autoComplete="off" value={form.setup_key} onChange={change("setup_key")} />
            </label>
            <p className="flex items-start gap-2 text-xs text-slate-400"><LockKeyhole size={16} /> The setup key is created by your installer and stored only in the backend environment, not in the frontend.</p>
            {message && <p role="alert" className="rounded-lg border border-rose-800 bg-rose-950/30 p-3 text-sm text-rose-200">{message}</p>}
            <button type="submit" disabled={busy || !keyConfigured} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 font-semibold hover:bg-sky-500 disabled:opacity-50">
              {busy && <Loader2 size={18} className="animate-spin" />}
              {busy ? "Creating administrator..." : "Create administrator account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
