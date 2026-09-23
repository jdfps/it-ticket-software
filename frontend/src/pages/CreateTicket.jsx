import { useState } from "react";
import {
  CloudLightning,
  PieChart,
  PlusCircle,
  LogOut,
  Paperclip,
  X,
  Send,
  ArrowLeft,
  FileText,
  Tag,
  AlignLeft,
  Clock,
} from "lucide-react";

export default function CreateSupportTicket({
  user,
  onSubmitTicket,
  onDashboard,
  onLogout,
}) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Hardware",
    "Software",
    "Network",
    "Account / Access",
    "Email",
    "Security",
    "Other",
  ];

  const initials =
    `${user?.firstName?.[0] || ""}${
      user?.lastName?.[0] || ""
    }`.toUpperCase();

  // --------------------------------
  // FORM CHANGE
  // --------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    // Remove the error once the user starts fixing the field.
    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }
  };

  // --------------------------------
  // VALIDATION
  // --------------------------------

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Please enter a ticket title.";
    }

    if (!form.category) {
      newErrors.category = "Please select a category.";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Please describe the issue you are experiencing.";
    }

    return newErrors;
  };

  // --------------------------------
  // FILE ATTACHMENTS
  // --------------------------------

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    setFiles((previousFiles) => [
      ...previousFiles,
      ...selectedFiles,
    ]);

    // Allows the same file to be selected again later.
    event.target.value = "";
  };

  const removeFile = (indexToRemove) => {
    setFiles((previousFiles) =>
      previousFiles.filter(
        (_, index) => index !== indexToRemove
      )
    );
  };

  // --------------------------------
  // SUBMIT TICKET
  // --------------------------------

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    onSubmitTicket({
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      files,
    });
  };

  // --------------------------------
  // PAGE
  // --------------------------------

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* LOGO */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-lg shadow-sky-900/20">
              <CloudLightning className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-bold tracking-tight text-white">
              Cloud IT{" "}
              <span className="text-sky-400">
                Desk
              </span>
            </span>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={onDashboard}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <PieChart className="mr-1.5 h-4 w-4 text-slate-400" />
              Dashboard
            </button>

            <button
              type="button"
              className="flex items-center rounded-lg bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-400"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" />
              Create Ticket
            </button>
          </nav>

          {/* USER */}
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-100">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="text-xs text-slate-400">
                Logged in as:{" "}
                <span className="capitalize text-slate-300">
                  {user?.role}
                </span>
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-bold text-sky-400">
              {initials}
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Log Out"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-rose-400"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={onDashboard}
          className="mb-6 flex items-center text-sm font-medium text-slate-400 transition hover:text-sky-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>

        {/* PAGE HEADING */}
        <div className="mb-8">
          <p className="mb-1 text-sm font-medium text-sky-400">
            Support Request
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create a New Ticket
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Describe the issue you are experiencing.
            Your ticket will be submitted to an
            administrator for review before it is
            added to the technician queue.
          </p>
        </div>

        {/* WORKFLOW INFO */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
          <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-400" />

          <div>
            <p className="text-sm font-semibold text-sky-300">
              Admin Review Required
            </p>

            <p className="mt-1 text-sm leading-relaxed text-slate-400">
              After submission, your ticket will
              appear as{" "}
              <span className="font-medium text-slate-300">
                Pending Admin Review
              </span>
              . An administrator will review the
              request and assign a priority from P1
              to P30 before technicians can claim it.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl"
        >
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="flex items-center text-lg font-semibold text-white">
              <FileText className="mr-2 h-5 w-5 text-sky-400" />
              Ticket Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Provide as much detail as possible so
              the IT team can understand the issue.
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* TITLE */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Ticket Title
                <span className="ml-1 text-rose-400">
                  *
                </span>
              </label>

              <div className="relative">
                <FileText className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Unable to connect to company VPN"
                  className={`w-full rounded-xl border bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 ${
                    errors.title
                      ? "border-rose-500 focus:border-rose-400"
                      : "border-slate-700 focus:border-sky-400"
                  }`}
                />
              </div>

              {errors.title && (
                <p className="mt-2 text-xs text-rose-400">
                  {errors.title}
                </p>
              )}
            </div>

            {/* CATEGORY */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Category
                <span className="ml-1 text-rose-400">
                  *
                </span>
              </label>

              <div className="relative">
                <Tag className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full appearance-none rounded-xl border bg-slate-950/70 py-3 pl-10 pr-4 text-sm outline-none transition ${
                    form.category
                      ? "text-white"
                      : "text-slate-500"
                  } ${
                    errors.category
                      ? "border-rose-500 focus:border-rose-400"
                      : "border-slate-700 focus:border-sky-400"
                  }`}
                >
                  <option value="">
                    Select a category...
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {errors.category && (
                <p className="mt-2 text-xs text-rose-400">
                  {errors.category}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Description
                <span className="ml-1 text-rose-400">
                  *
                </span>
              </label>

              <div className="relative">
                <AlignLeft className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Describe the issue, when it started, any error messages you are seeing, and any troubleshooting you have already tried..."
                  className={`w-full resize-none rounded-xl border bg-slate-950/70 py-3 pl-10 pr-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-slate-600 ${
                    errors.description
                      ? "border-rose-500 focus:border-rose-400"
                      : "border-slate-700 focus:border-sky-400"
                  }`}
                />
              </div>

              <div className="mt-2 flex justify-between">
                {errors.description ? (
                  <p className="text-xs text-rose-400">
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Include relevant details that may
                    help diagnose the problem.
                  </p>
                )}

                <p className="text-xs text-slate-600">
                  {form.description.length} characters
                </p>
              </div>
            </div>

            {/* ATTACHMENTS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Attachments
                <span className="ml-2 text-xs font-normal text-slate-500">
                  Optional
                </span>
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-6 py-8 text-center transition hover:border-sky-500/60 hover:bg-sky-500/5">
                <Paperclip className="mb-3 h-6 w-6 text-slate-500" />

                <span className="text-sm font-medium text-slate-300">
                  Click to attach files
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  Screenshots, documents, or other
                  files related to the issue
                </span>

                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* SELECTED FILES */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center">
                        <Paperclip className="mr-3 h-4 w-4 flex-shrink-0 text-sky-400" />

                        <div className="min-w-0">
                          <p className="truncate text-sm text-slate-300">
                            {file.name}
                          </p>

                          <p className="text-xs text-slate-600">
                            {Math.max(
                              1,
                              Math.round(file.size / 1024)
                            )}{" "}
                            KB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFile(index)
                        }
                        className="ml-4 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-rose-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FORM FOOTER */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-800 bg-slate-950/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              <span className="text-rose-400">*</span>{" "}
              Required fields
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onDashboard}
                disabled={submitting}
                className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-950/30 transition hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="mr-2 h-4 w-4" />

                {submitting
                  ? "Submitting..."
                  : "Submit for Review"}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-slate-600 sm:px-6">
          Cloud IT Desk • Support Ticket Management
          System
        </div>
      </footer>
    </div>
  );
}