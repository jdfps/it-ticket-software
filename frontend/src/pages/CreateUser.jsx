import { useState } from "react";

import {
  ArrowLeft,
  UserPlus,
  Mail,
  User,
  Shield,
  ChevronDown,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  role: "employee",
};

const ROLE_OPTIONS = [
  {
    value: "employee",
    label: "Employee",
  },
  {
    value: "technician",
    label: "Technician",
  },
  {
    value: "admin",
    label: "Admin",
  },
];

export default function CreateUser({
  onDashboard,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [copied, setCopied] = useState(false);

  // ================================================
  // FORM HANDLING
  // ================================================

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // ================================================
  // VALIDATION
  // ================================================

  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName =
        "First name is required.";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName =
        "Last name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^\S+@\S+\.\S+$/.test(
        form.email.trim()
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!form.role) {
      newErrors.role =
        "A role is required.";
    }

    return newErrors;
  };

  // ================================================
  // TEMPORARY PASSWORD
  // ================================================

  const generateTemporaryPassword = () => {
    const uppercase =
      "ABCDEFGHJKLMNPQRSTUVWXYZ";

    const lowercase =
      "abcdefghijkmnopqrstuvwxyz";

    const numbers = "23456789";

    const symbols = "!@#$%";

    const allCharacters =
      uppercase +
      lowercase +
      numbers +
      symbols;

    let password = "";

    password +=
      uppercase[
        Math.floor(
          Math.random() *
            uppercase.length
        )
      ];

    password +=
      lowercase[
        Math.floor(
          Math.random() *
            lowercase.length
        )
      ];

    password +=
      numbers[
        Math.floor(
          Math.random() *
            numbers.length
        )
      ];

    password +=
      symbols[
        Math.floor(
          Math.random() *
            symbols.length
        )
      ];

    for (
      let i = password.length;
      i < 12;
      i++
    ) {
      password +=
        allCharacters[
          Math.floor(
            Math.random() *
              allCharacters.length
          )
        ];
    }

    return password
      .split("")
      .sort(
        () => Math.random() - 0.5
      )
      .join("");
  };

  // ================================================
  // CREATE USER
  // ================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validate();

    setErrors(newErrors);

    if (
      Object.keys(newErrors).length > 0
    ) {
      return;
    }

    setSubmitting(true);

    // Simulated account creation.
    // Later this will become a FastAPI request.
    setTimeout(() => {
      const temporaryPassword =
        generateTemporaryPassword();

      setCreatedUser({
        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        email:
          form.email.trim(),

        role:
          form.role,

        temporaryPassword,

        mustChangePassword: true,
      });

      setSubmitting(false);
      setCopied(false);
    }, 700);
  };

  // ================================================
  // COPY PASSWORD
  // ================================================

  const handleCopyPassword =
    async () => {
      if (!createdUser) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          createdUser.temporaryPassword
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch {
        setCopied(false);
      }
    };

  // ================================================
  // CREATE ANOTHER USER
  // ================================================

  const handleCreateAnother = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setCreatedUser(null);
    setCopied(false);
  };

  // ================================================
  // RENDER
  // ================================================

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 antialiased">
      {/* Background */}

      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 10%, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%)",
        }}
      />

      {/* ============================================
          MAIN CONTENT
      ============================================ */}

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={onDashboard}
          className="mb-7 flex items-center text-sm font-medium text-slate-400 transition hover:text-sky-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />

          Back to Admin Dashboard
        </button>

        {/* PAGE TITLE */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
              <UserPlus className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Create User
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Create a new account and
                assign the user's system role.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            CREATE USER FORM
        ========================================== */}

        {!createdUser ? (
          <div
            className="rounded-2xl border border-slate-700/80 p-6 shadow-2xl sm:p-8"
            style={{
              background:
                "rgba(30, 41, 59, 0.7)",

              backdropFilter:
                "blur(12px)",
            }}
          >
            {/* ERROR ALERT */}

            {Object.keys(errors).length >
              0 && (
              <div className="mb-6 flex items-start space-x-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />

                <div>
                  <span className="font-semibold">
                    Please fix the
                    highlighted fields.
                  </span>
                </div>
              </div>
            )}

            <form
              className="space-y-6"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* ==================================
                  NAME
              ================================== */}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* FIRST NAME */}

                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-sm font-medium text-slate-200"
                  >
                    First Name{" "}

                    <span className="text-rose-400">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <input
                      id="firstName"
                      type="text"
                      value={
                        form.firstName
                      }
                      onChange={handleChange(
                        "firstName"
                      )}
                      placeholder="John"
                      className={`w-full rounded-xl border bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-50 placeholder-slate-500 transition focus:outline-none focus:ring-[3px] ${
                        errors.firstName
                          ? "border-rose-400 focus:ring-rose-400/15"
                          : "border-slate-700 focus:border-sky-400 focus:ring-sky-400/15"
                      }`}
                    />

                    <User className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  </div>

                  {errors.firstName && (
                    <span className="mt-1 block text-xs text-rose-400">
                      {
                        errors.firstName
                      }
                    </span>
                  )}
                </div>

                {/* LAST NAME */}

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-sm font-medium text-slate-200"
                  >
                    Last Name{" "}

                    <span className="text-rose-400">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <input
                      id="lastName"
                      type="text"
                      value={
                        form.lastName
                      }
                      onChange={handleChange(
                        "lastName"
                      )}
                      placeholder="Doe"
                      className={`w-full rounded-xl border bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-50 placeholder-slate-500 transition focus:outline-none focus:ring-[3px] ${
                        errors.lastName
                          ? "border-rose-400 focus:ring-rose-400/15"
                          : "border-slate-700 focus:border-sky-400 focus:ring-sky-400/15"
                      }`}
                    />

                    <User className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  </div>

                  {errors.lastName && (
                    <span className="mt-1 block text-xs text-rose-400">
                      {
                        errors.lastName
                      }
                    </span>
                  )}
                </div>
              </div>

              {/* ==================================
                  EMAIL
              ================================== */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-200"
                >
                  Email Address{" "}

                  <span className="text-rose-400">
                    *
                  </span>
                </label>

                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange(
                      "email"
                    )}
                    placeholder="john.doe@company.com"
                    className={`w-full rounded-xl border bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-50 placeholder-slate-500 transition focus:outline-none focus:ring-[3px] ${
                      errors.email
                        ? "border-rose-400 focus:ring-rose-400/15"
                        : "border-slate-700 focus:border-sky-400 focus:ring-sky-400/15"
                    }`}
                  />

                  <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                </div>

                {errors.email && (
                  <span className="mt-1 block text-xs text-rose-400">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* ==================================
                  ACCOUNT ROLE
              ================================== */}

              <div>
                <label
                  htmlFor="role"
                  className="mb-1.5 block text-sm font-medium text-slate-200"
                >
                  Account Role{" "}

                  <span className="text-rose-400">
                    *
                  </span>
                </label>

                <div className="relative">
                  <select
                    id="role"
                    value={form.role}
                    onChange={handleChange(
                      "role"
                    )}
                    className={`w-full cursor-pointer appearance-none rounded-xl border bg-slate-950 py-3 pl-11 pr-10 text-sm text-slate-50 transition focus:outline-none focus:ring-[3px] ${
                      errors.role
                        ? "border-rose-400 focus:ring-rose-400/15"
                        : "border-slate-700 focus:border-sky-400 focus:ring-sky-400/15"
                    }`}
                  >
                    {ROLE_OPTIONS.map(
                      (role) => (
                        <option
                          key={
                            role.value
                          }
                          value={
                            role.value
                          }
                        >
                          {
                            role.label
                          }
                        </option>
                      )
                    )}
                  </select>

                  <Shield className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />

                  <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-500" />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Employees submit tickets,
                  technicians resolve tickets,
                  and admins manage the
                  system.
                </p>
              </div>

              {/* ==================================
                  TEMPORARY PASSWORD
              ================================== */}

              <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-400" />

                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      Temporary Password
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      A temporary password
                      will automatically be
                      generated for this
                      account. The user will
                      be required to create a
                      new password the first
                      time they sign in.
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================
                  SUBMIT
              ================================== */}

              <div className="flex justify-end border-t border-slate-800 pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-400 hover:to-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                      Creating User...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />

                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================
             SUCCESS SCREEN
          ======================================== */

          <div
            className="rounded-2xl border border-slate-700/80 p-6 shadow-2xl sm:p-8"
            style={{
              background:
                "rgba(30, 41, 59, 0.7)",

              backdropFilter:
                "blur(12px)",
            }}
          >
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <h2 className="text-xl font-bold text-white">
                User Created Successfully
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Give the login information
                below to the new user.
              </p>
            </div>

            {/* USER INFORMATION */}

            <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-950/60 p-5">
              <div>
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  Name
                </span>

                <p className="mt-1 text-sm font-medium text-slate-200">
                  {createdUser.firstName}{" "}
                  {createdUser.lastName}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  Email
                </span>

                <p className="mt-1 text-sm font-medium text-slate-200">
                  {createdUser.email}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  Role
                </span>

                <p className="mt-1 text-sm font-medium capitalize text-slate-200">
                  {createdUser.role}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  Temporary Password
                </span>

                <div className="mt-1 flex items-center gap-2">
                  <code className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-sm font-semibold text-sky-300">
                    {
                      createdUser.temporaryPassword
                    }
                  </code>

                  <button
                    type="button"
                    onClick={
                      handleCopyPassword
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-400 transition hover:border-slate-600 hover:text-white"
                    title="Copy temporary password"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* WARNING */}

            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
              <p className="text-xs leading-relaxed text-amber-200/80">
                The user must change this
                temporary password the first
                time they log in.
              </p>
            </div>

            {/* ACTIONS */}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={onDashboard}
                className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />

                Back to Dashboard
              </button>

              <button
                type="button"
                onClick={
                  handleCreateAnother
                }
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-blue-500"
              >
                <UserPlus className="mr-2 h-4 w-4" />

                Create Another User
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}