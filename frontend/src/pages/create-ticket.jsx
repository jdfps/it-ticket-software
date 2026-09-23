import { useState, useRef } from "react";
import {
  CloudLightning,
  PieChart,
  PlusCircle,
  ListChecks,
  LogOut,
  ChevronRight,
  Clock,
  AlertTriangle,
  Layers,
  ChevronDown,
  UploadCloud,
  Paperclip,
  Check,
  RotateCcw,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "Hardware", label: "💻 Hardware & Workstations" },
  { value: "Software", label: "💿 Software & Applications" },
  { value: "Network", label: "🌐 Network, Wi-Fi & VPN" },
  { value: "Account", label: "🔑 Account & Access Permissions" },
  { value: "Other", label: "❓ Other / General Service Request" },
];

const INITIAL_FORM = { title: "", category: "", description: "" };

export default function CreateSupportTicket() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, ticketNum: null });
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFiles = (fileListLike) => {
    const incoming = Array.from(fileListLike);
    if (incoming.length === 0) return;
    setFiles(incoming);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setFiles([]);
    setErrors({});
    setSubmitting(false);
    setSubmitted(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim() || form.title.trim().length < 10) {
      newErrors.title = "Ticket title must be at least 10 characters long.";
    }
    if (!form.category) {
      newErrors.category = "Please select a ticket category.";
    }
    if (!form.description.trim() || form.description.trim().length < 20) {
      newErrors.description =
        "Description must provide at least 20 characters of detail.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);

    setTimeout(() => {
      const ticketNum = Math.floor(1000 + Math.random() * 9000);
      setSubmitting(false);
      setSubmitted(true);
      setToast({ show: true, ticketNum });

      setTimeout(() => {
        setToast({ show: false, ticketNum: null });
        resetForm();
      }, 3000);
    }, 1000);
  };

  const charCount = form.description.length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-50 antialiased">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 10%, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%)",
        }}
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Branding */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
              <CloudLightning className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                Cloud IT <span className="text-sky-400">Desk</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden items-center space-x-1 md:flex">
            <a
              href="#"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <PieChart className="mr-1.5 h-4 w-4 text-slate-400" /> Dashboard
            </a>
            <a
              href="#"
              className="flex items-center rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-400"
            >
              <PlusCircle className="mr-1.5 h-4 w-4 text-sky-400" /> Create
              Ticket
            </a>
            <a
              href="#"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <ListChecks className="mr-1.5 h-4 w-4 text-slate-400" /> My
              Tickets
            </a>
          </nav>

          {/* User Profile & Status */}
          <div className="flex items-center space-x-4">
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-sm font-semibold text-slate-200">
                John Doe
              </span>
              <span className="text-xs text-slate-400">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400 align-middle" />
                Logged in as:{" "}
                <strong className="font-normal text-slate-300">
                  Employee
                </strong>
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-bold text-sky-400">
              JD
            </div>

            <button
              title="Log Out"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-rose-400"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb & Page Header */}
        <div className="mb-8">
          <nav
            className="mb-2 flex text-sm text-slate-400"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li>
                <a href="#" className="transition hover:text-slate-200">
                  Home
                </a>
              </li>
              <li>
                <ChevronRight className="mx-1 h-3 w-3 text-slate-600" />
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-200">
                  Tickets
                </a>
              </li>
              <li>
                <ChevronRight className="mx-1 h-3 w-3 text-slate-600" />
              </li>
              <li className="font-medium text-sky-400">New Support Request</li>
            </ol>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-white">
                Create Support Ticket
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Submit a detailed technical request to your internal IT team
                for immediate resolution.
              </p>
            </div>

            {/* SLA Notice Tag */}
            <div className="inline-flex items-center self-start rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-slate-300 sm:self-auto">
              <Clock className="mr-2 h-4 w-4 text-sky-400" />
              <span>
                Target First Response:{" "}
                <strong className="font-semibold text-white">
                  &lt; 2 Hours
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Form Glass Card */}
        <div
          className="rounded-2xl border border-slate-700/80 p-6 shadow-2xl sm:p-8"
          style={{
            background: "rgba(30, 41, 59, 0.7)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Global Form Error Alert */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 flex items-start space-x-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <span className="mb-0.5 block font-semibold">
                  Please fix the highlighted errors before submitting:
                </span>
                <ul className="list-inside list-disc space-y-0.5 text-xs text-rose-300">
                  {Object.values(errors).map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* 1. Ticket Title */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="ticketTitle"
                  className="block text-sm font-medium text-slate-200"
                >
                  Ticket Title <span className="text-rose-400">*</span>
                </label>
                <span className="text-xs text-slate-500">
                  Keep it short & concise
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="ticketTitle"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleChange("title")}
                  placeholder="e.g., Laptop screen flickers during Zoom video calls"
                  className={`w-full rounded-xl border bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-50 placeholder-slate-500 transition focus:outline-none focus:ring-[3px] ${
                    errors.title
                      ? "border-rose-400 focus:ring-rose-400/15"
                      : "border-slate-700 focus:border-sky-400 focus:ring-sky-400/15"
                  }`}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <span className="text-sm">✎</span>
                </div>
              </div>
              {errors.title && (
                <span className="mt-1 block text-xs text-rose-400">
                  {errors.title}
                </span>
              )}
            </div>

            {/* 2. Category */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="ticketCategory"
                  className="mb-1.5 block text-sm font-medium text-slate-200"
                >
                  Category <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="ticketCategory"
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange("category")}
                    className={`w-full cursor-pointer appearance-none rounded-xl border bg-slate-950 py-3 pl-11 pr-10 text-sm text-slate-50 transition focus:outline-none focus:ring-[3px] ${
                      errors.category
                        ? "border-rose-400 focus:ring-rose-400/15"
                        : "border-slate-700 focus:border-sky-400 focus:ring-sky-400/15"
                    }`}
                  >
                    <option value="" disabled>
                      Select issue category...
                    </option>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </div>
                {errors.category && (
                  <span className="mt-1 block text-xs text-rose-400">
                    {errors.category}
                  </span>
                )}
              </div>
            </div>

            {/* 3. Detailed Description */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="ticketDescription"
                  className="block text-sm font-medium text-slate-200"
                >
                  Detailed Description <span className="text-rose-400">*</span>
                </label>
                <span
                  className={`text-xs ${
                    charCount >= 900 ? "text-amber-400" : "text-slate-500"
                  }`}
                >
                  {charCount} / 1000 chars
                </span>
              </div>
              <textarea
                id="ticketDescription"
                name="description"
                rows={5}
                required
                maxLength={1000}
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Please describe what happened, steps to reproduce the problem, error messages displayed, and any troubleshooting steps you've already attempted..."
                className={`w-full resize-y rounded-xl border bg-slate-950 p-4 text-sm text-slate-50 placeholder-slate-500 transition focus:outline-none focus:ring-[3px] ${
                  errors.description
                    ? "border-rose-400 focus:ring-rose-400/15"
                    : "border-slate-700 focus:border-sky-400 focus:ring-sky-400/15"
                }`}
              />
              {errors.description && (
                <span className="mt-1 block text-xs text-rose-400">
                  {errors.description}
                </span>
              )}
            </div>

            {/* 4. File Attachment Drop Area */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">
                Screenshots or Error Logs{" "}
                <span className="text-xs font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
                onDrop={onDrop}
                className={`cursor-pointer rounded-2xl border-2 border-dashed bg-slate-900/50 p-6 text-center transition ${
                  dragActive
                    ? "border-sky-400 bg-sky-400/[0.08]"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.log,.txt"
                  onChange={(e) => handleFiles(e.target.files)}
                />

                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sky-400">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div className="text-sm text-slate-300">
                    <span className="font-semibold text-sky-400 hover:underline">
                      Click to upload
                    </span>{" "}
                    or drag and drop files here
                  </div>
                  <p className="text-xs text-slate-500">
                    PNG, JPG, PDF, or TXT up to 10MB each
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2 text-left">
                    {files.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/90 p-2.5 text-xs text-slate-200"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Paperclip className="h-3.5 w-3.5 text-sky-400" />
                          <span className="truncate font-medium">
                            {file.name}
                          </span>
                          <span className="text-slate-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Check className="ml-2 h-3.5 w-3.5 text-emerald-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <hr className="my-6 border-slate-800" />

            {/* 5. Form Action Buttons */}
            <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
              <button
                type="button"
                onClick={resetForm}
                className="flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white sm:w-auto"
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" /> Reset Form
              </button>

              <div className="flex w-full items-center gap-3 sm:w-auto">
                <a
                  href="#"
                  className="w-full rounded-xl px-5 py-3 text-center text-sm font-medium text-slate-400 transition hover:text-slate-200 sm:w-auto"
                >
                  Cancel
                </a>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex w-full transform items-center justify-center rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition active:scale-95 sm:w-auto ${
                    submitted
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                      : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : submitted ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Created!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Submit Ticket
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Floating Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex max-w-md items-center space-x-3 rounded-2xl border border-emerald-500/40 bg-slate-800 p-4 text-white shadow-2xl transition-all duration-400 ${
          toast.show
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-24 opacity-0"
        }`}
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-100">
            Ticket #{toast.ticketNum} Created!
          </h4>
          <p className="text-xs text-slate-300">
            Your ticket was sent to the IT Queue. Redirecting to Dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}
