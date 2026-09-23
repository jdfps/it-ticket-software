import { useState } from "react";
import {
  CloudLightning,
  LayoutDashboard,
  Inbox,
  ListChecks,
  UserPlus,
  LogOut,
  Clock,
  CircleDot,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  UserRound,
  Tag,
  ChevronDown,
  ShieldCheck,
  ShieldX,
  Ticket,
} from "lucide-react";

// ================================================
// HELPERS
// ================================================

const STATUS_META = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    className:
      "bg-amber-500/10 text-amber-300 ring-amber-400/30",
  },

  open: {
    label: "Open",
    icon: CircleDot,
    className:
      "bg-sky-500/10 text-sky-300 ring-sky-400/30",
  },

  in_progress: {
    label: "In Progress",
    icon: Wrench,
    className:
      "bg-indigo-500/10 text-indigo-300 ring-indigo-400/30",
  },

  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30",
  },

  rejected: {
    label: "Rejected",
    icon: XCircle,
    className:
      "bg-rose-500/10 text-rose-300 ring-rose-400/30",
  },
};

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }) {
  const meta =
    STATUS_META[status] || STATUS_META.pending;

  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${meta.className}`}
    >
      <Icon className="mr-1.5 h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

function PriorityBadge({ priorityDays }) {
  if (!priorityDays) {
    return (
      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-slate-700">
        No Priority
      </span>
    );
  }

  return (
    <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/30">
      P{priorityDays}
    </span>
  );
}

// ================================================
// STAT CARD
// ================================================

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-3xl font-bold text-white">
          {value}
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-200">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

// ================================================
// PENDING TICKET CARD
// ================================================

function PendingTicketCard({
  ticket,
  onApproveTicket,
  onRejectTicket,
}) {
  const [priorityDays, setPriorityDays] =
    useState("");

  const [expanded, setExpanded] =
    useState(true);

  const handleApprove = () => {
    if (!priorityDays) {
      return;
    }

    onApproveTicket(
      ticket.id,
      Number(priorityDays)
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-slate-900/50">
      {/* CARD HEADER */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-4 px-5 py-5 text-left"
      >
        <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <Inbox className="h-4 w-4 text-amber-400" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Ticket #{ticket.id}
            </span>

            <span className="text-slate-700">
              •
            </span>

            <span className="text-xs text-slate-500">
              {ticket.category}
            </span>

            <StatusBadge status="pending" />
          </div>

          <h3 className="font-semibold text-white">
            {ticket.title}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Submitted by{" "}
            <span className="font-medium text-slate-300">
              {ticket.submittedBy}
            </span>
          </p>
        </div>

        <ChevronDown
          className={`mt-2 h-4 w-4 flex-shrink-0 text-slate-500 transition ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* EXPANDED CONTENT */}
      {expanded && (
        <div className="border-t border-slate-800 px-5 py-5">
          {/* DESCRIPTION */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </p>

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {ticket.description}
            </p>
          </div>

          {/* INFO */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="flex items-center text-xs text-slate-500">
                <UserRound className="mr-1.5 h-3.5 w-3.5" />
                Submitted By
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {ticket.submittedBy}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="flex items-center text-xs text-slate-500">
                <Tag className="mr-1.5 h-3.5 w-3.5" />
                Category
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {ticket.category}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="flex items-center text-xs text-slate-500">
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                Submitted
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {formatDateTime(
                  ticket.createdAt
                )}
              </p>
            </div>
          </div>

          {/* PRIORITY SELECTION */}
          <div className="mt-6 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
            <label
              htmlFor={`priority-${ticket.id}`}
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Assign Priority
            </label>

            <p className="mb-3 text-xs text-slate-400">
              P1 means the ticket should be
              completed within 1 day. P30 means it
              should be completed within 30 days.
            </p>

            <select
              id={`priority-${ticket.id}`}
              value={priorityDays}
              onChange={(event) =>
                setPriorityDays(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 sm:max-w-xs"
            >
              <option value="">
                Select priority...
              </option>

              {Array.from(
                { length: 30 },
                (_, index) => {
                  const days = index + 1;

                  return (
                    <option
                      key={days}
                      value={days}
                    >
                      P{days} - {days}{" "}
                      {days === 1
                        ? "day"
                        : "days"}
                    </option>
                  );
                }
              )}
            </select>
          </div>

          {/* ACTIONS */}
          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                onRejectTicket(ticket.id)
              }
              className="flex items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/5 px-5 py-2.5 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10"
            >
              <ShieldX className="mr-2 h-4 w-4" />
              Reject
            </button>

            <button
              type="button"
              onClick={handleApprove}
              disabled={!priorityDays}
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Approve Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================================
// ALL TICKET ROW
// ================================================

function TicketRow({ ticket }) {
  const [expanded, setExpanded] =
    useState(false);

  const pastDue =
    ticket.dueAt &&
    new Date(ticket.dueAt) <
      new Date() &&
    ticket.status !== "resolved";

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-slate-900/40 ${
        pastDue
          ? "border-rose-500/40"
          : "border-slate-800"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-slate-500 transition ${
            expanded ? "rotate-180" : ""
          }`}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">
              #{ticket.id}
            </span>

            <span className="text-xs text-slate-600">
              {ticket.category}
            </span>

            {pastDue && (
              <span className="inline-flex items-center text-xs font-semibold text-rose-400">
                <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                Past Due
              </span>
            )}
          </div>

          <p className="truncate font-semibold text-slate-100">
            {ticket.title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {ticket.submittedBy}
          </p>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <PriorityBadge
            priorityDays={
              ticket.priorityDays
            }
          />

          <StatusBadge
            status={ticket.status}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 px-5 py-5">
          <div className="mb-4 flex flex-wrap gap-2 sm:hidden">
            <PriorityBadge
              priorityDays={
                ticket.priorityDays
              }
            />

            <StatusBadge
              status={ticket.status}
            />
          </div>

          <p className="text-sm leading-relaxed text-slate-300">
            {ticket.description}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* CREATED */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-500">
                Created
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {formatDate(
                  ticket.createdAt
                )}
              </p>
            </div>

            {/* PRIORITY */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-500">
                Priority
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {ticket.priorityDays
                  ? `P${ticket.priorityDays} — ${ticket.priorityDays} ${
                      ticket.priorityDays ===
                      1
                        ? "day"
                        : "days"
                    }`
                  : "Not assigned"}
              </p>
            </div>

            {/* TECHNICIAN */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-500">
                Technician
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {ticket.technicianName ||
                  "Unassigned"}
              </p>
            </div>

            {/* DUE DATE */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-500">
                Due
              </p>

              <p
                className={`mt-1 text-sm ${
                  pastDue
                    ? "font-semibold text-rose-400"
                    : "text-slate-300"
                }`}
              >
                {ticket.dueAt
                  ? formatDate(
                      ticket.dueAt
                    )
                  : "—"}
              </p>
            </div>
          </div>

          {/* COMMENTS */}
          {ticket.comments &&
            ticket.comments.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ticket Updates
                </p>

                <div className="space-y-2">
                  {ticket.comments.map(
                    (comment) => (
                      <div
                        key={comment.id}
                        className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"
                      >
                        <div className="flex justify-between gap-4">
                          <p className="text-xs font-semibold text-slate-300">
                            {
                              comment.author
                            }
                          </p>

                          <p className="text-xs text-slate-600">
                            {formatDateTime(
                              comment.timestamp
                            )}
                          </p>
                        </div>

                        <p className="mt-1 text-sm text-slate-400">
                          {comment.text}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

// ================================================
// ADMIN DASHBOARD
// ================================================

export default function AdminDashboard({
  user,
  tickets = [],
  onApproveTicket,
  onRejectTicket,
  onCreateUser,
  onLogout,
}) {
  const [view, setView] =
    useState("dashboard");

  // --------------------------------
  // TICKET GROUPS
  // --------------------------------

  const pendingTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "pending"
    );

  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "open"
    );

  const inProgressTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
        "in_progress"
    );

  const resolvedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
        "resolved"
    );

  const rejectedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
        "rejected"
    );

  const pastDueTickets =
    tickets.filter((ticket) => {
      if (
        !ticket.dueAt ||
        ticket.status === "resolved" ||
        ticket.status === "rejected"
      ) {
        return false;
      }

      return (
        new Date(ticket.dueAt) <
        new Date()
      );
    });

  const initials =
    `${user?.firstName?.[0] || ""}${
      user?.lastName?.[0] || ""
    }`.toUpperCase();

  const sortedTickets = [
    ...tickets,
  ].sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  // --------------------------------
  // PAGE TITLE
  // --------------------------------

  let pageTitle = "Admin Dashboard";
  let pageDescription =
    "Monitor ticket activity and support operations.";

  if (view === "inbox") {
    pageTitle = "Admin Inbox";
    pageDescription =
      "Review newly submitted tickets, assign a priority, and approve or reject them.";
  }

  if (view === "tickets") {
    pageTitle = "All Tickets";
    pageDescription =
      "Monitor every ticket across the support system.";
  }

  // --------------------------------
  // RENDER
  // --------------------------------

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* LOGO */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600">
              <CloudLightning className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-bold text-white">
              Cloud IT{" "}
              <span className="text-sky-400">
                Desk
              </span>
            </span>
          </div>

          {/* NAV */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={() =>
                setView("dashboard")
              }
              className={`flex items-center rounded-lg px-3 py-2 text-sm ${
                view === "dashboard"
                  ? "bg-sky-500/10 font-semibold text-sky-400"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <LayoutDashboard className="mr-1.5 h-4 w-4" />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() =>
                setView("inbox")
              }
              className={`relative flex items-center rounded-lg px-3 py-2 text-sm ${
                view === "inbox"
                  ? "bg-sky-500/10 font-semibold text-sky-400"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Inbox className="mr-1.5 h-4 w-4" />
              Inbox

              {pendingTickets.length >
                0 && (
                <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-slate-950">
                  {
                    pendingTickets.length
                  }
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setView("tickets")
              }
              className={`flex items-center rounded-lg px-3 py-2 text-sm ${
                view === "tickets"
                  ? "bg-sky-500/10 font-semibold text-sky-400"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <ListChecks className="mr-1.5 h-4 w-4" />
              All Tickets
            </button>

            <button
              type="button"
              onClick={onCreateUser}
              className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <UserPlus className="mr-1.5 h-4 w-4" />
              Create User
            </button>
          </nav>

          {/* ADMIN PROFILE */}
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-100">
                {user?.firstName}{" "}
                {user?.lastName}
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

      {/* MAIN */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {/* TITLE */}
        <div className="mb-8">
          <p className="mb-1 text-sm font-medium text-sky-400">
            Administration
          </p>

          <h1 className="text-3xl font-bold text-white">
            {pageTitle}
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {pageDescription}
          </p>
        </div>

        {/* ==================================
            DASHBOARD
        ================================== */}

        {view === "dashboard" && (
          <>
            {/* STATS */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Inbox}
                label="Pending Review"
                value={
                  pendingTickets.length
                }
                description="Waiting for admin approval"
              />

              <StatCard
                icon={CircleDot}
                label="Open Queue"
                value={openTickets.length}
                description="Available for technicians"
              />

              <StatCard
                icon={Wrench}
                label="In Progress"
                value={
                  inProgressTickets.length
                }
                description="Currently being worked"
              />

              <StatCard
                icon={AlertTriangle}
                label="Past Due"
                value={
                  pastDueTickets.length
                }
                description="Past assigned deadline"
              />
            </div>

            {/* PENDING REVIEW PREVIEW */}
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Pending Review
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tickets that need admin
                    approval.
                  </p>
                </div>

                {pendingTickets.length >
                  0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setView("inbox")
                    }
                    className="text-sm font-semibold text-sky-400 hover:text-sky-300"
                  >
                    View Inbox →
                  </button>
                )}
              </div>

              {pendingTickets.length ===
              0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/20 px-6 py-10 text-center">
                  <CheckCircle2 className="mx-auto mb-3 h-7 w-7 text-emerald-400" />

                  <h3 className="font-semibold text-white">
                    Inbox is clear
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    There are no tickets
                    waiting for review.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTickets
                    .slice(0, 3)
                    .map((ticket) => (
                      <PendingTicketCard
                        key={ticket.id}
                        ticket={ticket}
                        onApproveTicket={
                          onApproveTicket
                        }
                        onRejectTicket={
                          onRejectTicket
                        }
                      />
                    ))}
                </div>
              )}
            </section>

            {/* SYSTEM SUMMARY */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">
                Ticket Overview
              </h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  <p className="text-sm text-slate-400">
                    Resolved Tickets
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-400">
                    {
                      resolvedTickets.length
                    }
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  <p className="text-sm text-slate-400">
                    Rejected Tickets
                  </p>

                  <p className="mt-2 text-3xl font-bold text-rose-400">
                    {
                      rejectedTickets.length
                    }
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  <p className="text-sm text-slate-400">
                    Total Tickets
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    {tickets.length}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ==================================
            ADMIN INBOX
        ================================== */}

        {view === "inbox" && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Tickets Waiting for Review
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {
                    pendingTickets.length
                  }{" "}
                  pending{" "}
                  {pendingTickets.length ===
                  1
                    ? "ticket"
                    : "tickets"}
                </p>
              </div>
            </div>

            {pendingTickets.length ===
            0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/20 px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  Inbox is clear
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                  There are currently no
                  tickets waiting for admin
                  review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTickets.map(
                  (ticket) => (
                    <PendingTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onApproveTicket={
                        onApproveTicket
                      }
                      onRejectTicket={
                        onRejectTicket
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* ==================================
            ALL TICKETS
        ================================== */}

        {view === "tickets" && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  All Tickets
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor tickets throughout
                  their entire lifecycle.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-slate-800">
                {tickets.length} Total
              </div>
            </div>

            {sortedTickets.length ===
            0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 px-6 py-16 text-center">
                <Ticket className="mx-auto mb-4 h-8 w-8 text-sky-400" />

                <h3 className="text-lg font-semibold text-white">
                  No tickets
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Submitted tickets will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedTickets.map(
                  (ticket) => (
                    <TicketRow
                      key={ticket.id}
                      ticket={ticket}
                    />
                  )
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-slate-600 sm:px-6">
          Cloud IT Desk • Administrator
          Console
        </div>
      </footer>
    </div>
  );
}