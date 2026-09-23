import { useState } from "react";
import {
  CloudLightning,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Clock,
  CircleDot,
  Wrench,
  CheckCircle2,
  XCircle,
  Ticket,
  Calendar,
  UserRound,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
  Send,
} from "lucide-react";

const STATUS_META = {
  pending: {
    label: "Pending Admin Review",
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
  if (!date) return "—";

  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
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
        Pending Priority
      </span>
    );
  }

  return (
    <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/30">
      P{priorityDays}
    </span>
  );
}

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
// TICKET LIST CARD
// ================================================

function TicketCard({
  ticket,
  onOpenTicket,
}) {
  const pastDue =
    ticket.dueAt &&
    new Date(ticket.dueAt) < new Date() &&
    ticket.status !== "resolved";

  const commentCount =
    ticket.comments?.length || 0;

  return (
    <button
      type="button"
      onClick={() => onOpenTicket(ticket.id)}
      className={`w-full rounded-2xl border bg-slate-900/40 p-5 text-left transition hover:border-sky-500/30 hover:bg-slate-900/70 ${
        pastDue
          ? "border-rose-500/40"
          : "border-slate-800"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
          </div>

          <h3 className="text-base font-semibold text-white">
            {ticket.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
            {ticket.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge
            priorityDays={ticket.priorityDays}
          />

          <StatusBadge
            status={ticket.status}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-slate-800 pt-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-slate-500">
            Created
          </p>

          <p className="mt-1 text-sm text-slate-300">
            {formatDate(ticket.createdAt)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Technician
          </p>

          <p className="mt-1 text-sm text-slate-300">
            {ticket.technicianName ||
              "Not assigned"}
          </p>
        </div>

        <div>
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
              ? formatDate(ticket.dueAt)
              : "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Messages
          </p>

          <p className="mt-1 flex items-center text-sm text-slate-300">
            <MessageSquare className="mr-1.5 h-3.5 w-3.5 text-sky-400" />
            {commentCount}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end border-t border-slate-800 pt-4">
        <span className="flex items-center text-sm font-semibold text-sky-400">
          View Ticket
          <ChevronRight className="ml-1 h-4 w-4" />
        </span>
      </div>
    </button>
  );
}

// ================================================
// TICKET DETAILS / CONVERSATION
// ================================================

function TicketDetails({
  ticket,
  user,
  onBack,
  onAddComment,
}) {
  const [message, setMessage] = useState("");

  const pastDue =
    ticket.dueAt &&
    new Date(ticket.dueAt) < new Date() &&
    ticket.status !== "resolved";

  const canReply =
    ticket.status === "in_progress" ||
    ticket.status === "open";

  const handleSend = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    onAddComment(ticket.id, message);

    setMessage("");
  };

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center text-sm font-medium text-slate-400 transition hover:text-sky-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Tickets
      </button>

      {/* TICKET HEADER */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-sm text-slate-500">
              Ticket #{ticket.id}
            </p>

            <h1 className="text-2xl font-bold text-white">
              {ticket.title}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {ticket.category}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <PriorityBadge
              priorityDays={ticket.priorityDays}
            />

            <StatusBadge
              status={ticket.status}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-slate-800 pt-5 sm:grid-cols-3">
          <div>
            <p className="flex items-center text-xs text-slate-500">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              Created
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {formatDateTime(
                ticket.createdAt
              )}
            </p>
          </div>

          <div>
            <p className="flex items-center text-xs text-slate-500">
              <UserRound className="mr-1.5 h-3.5 w-3.5" />
              Technician
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {ticket.technicianName ||
                "Not assigned yet"}
            </p>
          </div>

          <div>
            <p className="flex items-center text-xs text-slate-500">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
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
                ? formatDateTime(
                    ticket.dueAt
                  )
                : "Not assigned yet"}
            </p>
          </div>
        </div>
      </div>

      {/* ORIGINAL REQUEST */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Original Request
        </p>

        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
          {ticket.description}
        </p>
      </div>

      {/* CONVERSATION */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="flex items-center text-lg font-semibold text-white">
            <MessageSquare className="mr-2 h-5 w-5 text-sky-400" />
            Conversation
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Messages between you and the IT
            technician.
          </p>
        </div>

        {/* MESSAGES */}
        <div className="space-y-4 p-6">
          {!ticket.comments ||
          ticket.comments.length === 0 ? (
            <div className="py-8 text-center">
              <MessageSquare className="mx-auto mb-3 h-7 w-7 text-slate-600" />

              <p className="text-sm font-medium text-slate-300">
                No messages yet
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Messages from your technician
                will appear here.
              </p>
            </div>
          ) : (
            ticket.comments.map((comment) => {
              const mine =
                comment.userId === user.user_id;

              return (
                <div
                  key={comment.id}
                  className={`flex ${
                    mine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
                      mine
                        ? "bg-sky-500/15 ring-1 ring-sky-500/20"
                        : "bg-slate-950 ring-1 ring-slate-800"
                    }`}
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          mine
                            ? "text-sky-300"
                            : "text-slate-300"
                        }`}
                      >
                        {mine
                          ? "You"
                          : comment.author}
                      </span>

                      {!mine && (
                        <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                          IT
                        </span>
                      )}
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                      {comment.text}
                    </p>

                    <p className="mt-2 text-[11px] text-slate-500">
                      {formatDateTime(
                        comment.timestamp
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* REPLY */}
        {canReply ? (
          <form
            onSubmit={handleSend}
            className="border-t border-slate-800 bg-slate-950/30 p-4"
          >
            <p className="mb-2 text-xs font-medium text-slate-400">
              Reply to your technician
            </p>

            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                rows={2}
                placeholder="Type your message..."
                className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400"
              />

              <button
                type="submit"
                disabled={!message.trim()}
                className="flex items-center self-end rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-slate-800 bg-slate-950/30 px-6 py-4">
            <p className="text-center text-xs text-slate-500">
              {ticket.status === "pending" &&
                "Messaging will become available after your ticket is approved."}

              {ticket.status === "resolved" &&
                "This ticket has been resolved."}

              {ticket.status === "rejected" &&
                "This ticket was not approved."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ================================================
// USER DASHBOARD
// ================================================

export default function UserDashboard({
  user,
  tickets = [],
  onAddComment,
  onCreateTicket,
  onLogout,
}) {
  const [selectedTicketId, setSelectedTicketId] =
    useState(null);

  const selectedTicket =
    tickets.find(
      (ticket) =>
        ticket.id === selectedTicketId
    ) || null;

  const pendingCount = tickets.filter(
    (ticket) =>
      ticket.status === "pending"
  ).length;

  const openCount = tickets.filter(
    (ticket) =>
      ticket.status === "open"
  ).length;

  const inProgressCount = tickets.filter(
    (ticket) =>
      ticket.status === "in_progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) =>
      ticket.status === "resolved"
  ).length;

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

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
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

          <nav className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={() =>
                setSelectedTicketId(null)
              }
              className="flex items-center rounded-lg bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-400"
            >
              <LayoutDashboard className="mr-1.5 h-4 w-4" />
              Dashboard
            </button>

            <button
              type="button"
              onClick={onCreateTicket}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" />
              Create Ticket
            </button>
          </nav>

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

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {/* SHOW TICKET DETAILS */}
        {selectedTicket ? (
          <TicketDetails
            ticket={selectedTicket}
            user={user}
            onBack={() =>
              setSelectedTicketId(null)
            }
            onAddComment={onAddComment}
          />
        ) : (
          <>
            {/* DASHBOARD HEADER */}
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-1 text-sm font-medium text-sky-400">
                  Employee Dashboard
                </p>

                <h1 className="text-3xl font-bold text-white">
                  Welcome back,{" "}
                  {user?.firstName}
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  View your support requests,
                  communicate with technicians,
                  or submit a new ticket.
                </p>
              </div>

              <button
                type="button"
                onClick={onCreateTicket}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Ticket
              </button>
            </div>

            {/* STATS */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Clock}
                label="Pending Review"
                value={pendingCount}
                description="Waiting for admin approval"
              />

              <StatCard
                icon={CircleDot}
                label="Open"
                value={openCount}
                description="Waiting for a technician"
              />

              <StatCard
                icon={Wrench}
                label="In Progress"
                value={inProgressCount}
                description="Currently being worked"
              />

              <StatCard
                icon={CheckCircle2}
                label="Resolved"
                value={resolvedCount}
                description="Completed tickets"
              />
            </div>

            {/* MY TICKETS */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    My Tickets
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select a ticket to view
                    details and messages.
                  </p>
                </div>

                <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-slate-400 ring-1 ring-slate-800">
                  {tickets.length}{" "}
                  {tickets.length === 1
                    ? "Ticket"
                    : "Tickets"}
                </div>
              </div>

              {sortedTickets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/20 px-6 py-16 text-center">
                  <Ticket className="mx-auto mb-4 h-8 w-8 text-sky-400" />

                  <h3 className="text-lg font-semibold text-white">
                    No tickets yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Create a support ticket
                    when you need assistance.
                  </p>

                  <button
                    type="button"
                    onClick={onCreateTicket}
                    className="mt-5 rounded-xl bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-400 hover:bg-sky-500/20"
                  >
                    Create Your First Ticket
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedTickets.map(
                    (ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        onOpenTicket={
                          setSelectedTicketId
                        }
                      />
                    )
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-slate-600">
          Cloud IT Desk • Support Ticket
          Management System
        </div>
      </footer>
    </div>
  );
}