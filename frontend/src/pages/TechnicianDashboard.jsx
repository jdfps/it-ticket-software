import { useState } from "react";
import {
  CloudLightning,
  Inbox,
  ListChecks,
  LogOut,
  ChevronDown,
  MessageSquare,
  Send,
  CheckCircle2,
  Hand,
  Clock,
  AlertTriangle,
  ArrowLeft,
  UserRound,
  Calendar,
} from "lucide-react";

// ================================================
// HELPERS
// ================================================

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

function PriorityBadge({ days }) {
  if (!days) {
    return (
      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400 ring-1 ring-slate-700">
        No Priority
      </span>
    );
  }

  return (
    <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/30">
      P{days} · {days} {days === 1 ? "Day" : "Days"}
    </span>
  );
}

function StatusBadge({ status }) {
  const statusMap = {
    open: {
      label: "Open",
      style:
        "bg-sky-500/10 text-sky-300 ring-sky-400/30",
    },

    in_progress: {
      label: "In Progress",
      style:
        "bg-indigo-500/10 text-indigo-300 ring-indigo-400/30",
    },

    resolved: {
      label: "Resolved",
      style:
        "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30",
    },
  };

  const meta =
    statusMap[status] || statusMap.open;

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${meta.style}`}
    >
      {meta.label}
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
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <Icon className="mb-3 h-5 w-5 text-sky-400" />

      <p className="text-3xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {label}
      </p>
    </div>
  );
}

// ================================================
// OPEN QUEUE CARD
// ================================================

function OpenTicketCard({
  ticket,
  onGrabTicket,
}) {
  const [expanded, setExpanded] =
    useState(false);

  const pastDue =
    ticket.dueAt &&
    new Date(ticket.dueAt) < new Date();

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
          className={`h-4 w-4 text-slate-500 transition ${
            expanded ? "rotate-180" : ""
          }`}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">
              Ticket #{ticket.id}
            </span>

            <span className="text-xs text-slate-600">
              {ticket.category}
            </span>

            {pastDue && (
              <span className="flex items-center text-xs font-semibold text-rose-400">
                <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                Past Due
              </span>
            )}
          </div>

          <h3 className="font-semibold text-white">
            {ticket.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Submitted by {ticket.submittedBy}
          </p>
        </div>

        <PriorityBadge
          days={ticket.priorityDays}
        />
      </button>

      {expanded && (
        <div className="border-t border-slate-800 px-5 py-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
            {ticket.description}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-500">
                Submitted
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {formatDateTime(
                  ticket.createdAt
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-500">
                Priority
              </p>

              <p className="mt-1 text-sm text-slate-300">
                P{ticket.priorityDays}
              </p>
            </div>

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
                {formatDateTime(ticket.dueAt)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={() =>
                onGrabTicket(ticket.id)
              }
              className="flex items-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Hand className="mr-2 h-4 w-4" />
              Grab Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================================
// TECHNICIAN TICKET DETAILS
// ================================================

function TechnicianTicketDetails({
  ticket,
  user,
  onBack,
  onAddComment,
  onResolveTicket,
}) {
  const [message, setMessage] =
    useState("");

  const pastDue =
    ticket.dueAt &&
    new Date(ticket.dueAt) <
      new Date() &&
    ticket.status !== "resolved";

  const canReply =
    ticket.status === "in_progress";

  // --------------------------------
  // SEND MESSAGE
  // --------------------------------

  const handleSend = (event) => {
    event.preventDefault();

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      return;
    }

    onAddComment(
      ticket.id,
      trimmedMessage
    );

    setMessage("");
  };

  return (
    <div>
      {/* BACK */}
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center text-sm font-medium text-slate-400 transition hover:text-sky-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Tickets
      </button>

      {/* HEADER */}
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
              days={ticket.priorityDays}
            />

            <StatusBadge
              status={ticket.status}
            />
          </div>
        </div>

        {/* INFORMATION */}
        <div className="mt-6 grid gap-4 border-t border-slate-800 pt-5 sm:grid-cols-3">
          <div>
            <p className="flex items-center text-xs text-slate-500">
              <UserRound className="mr-1.5 h-3.5 w-3.5" />
              Submitted By
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {ticket.submittedBy}
            </p>
          </div>

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
              {formatDateTime(ticket.dueAt)}
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
            Messages between you and{" "}
            {ticket.submittedBy}.
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
                Send a message to the
                employee if you need more
                information.
              </p>
            </div>
          ) : (
            ticket.comments.map(
              (comment) => {
                const mine =
                  comment.userId ===
                  user.user_id;

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
                      <div className="mb-1 flex items-center gap-2">
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
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                            Employee
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
              }
            )
          )}
        </div>

        {/* MESSAGE BOX */}
        {canReply ? (
          <form
            onSubmit={handleSend}
            className="border-t border-slate-800 bg-slate-950/30 p-4"
          >
            <p className="mb-2 text-xs font-medium text-slate-400">
              Reply to {ticket.submittedBy}
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
              This ticket has been resolved.
            </p>
          </div>
        )}
      </div>

      {/* RESOLVE */}
      {ticket.status ===
        "in_progress" && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() =>
              onResolveTicket(
                ticket.id
              )
            }
            className="flex items-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark Ticket Resolved
          </button>
        </div>
      )}
    </div>
  );
}

// ================================================
// TECHNICIAN DASHBOARD
// ================================================

export default function TechnicianDashboard({
  user,
  tickets = [],
  onGrabTicket,
  onAddComment,
  onResolveTicket,
  onLogout,
}) {
  const [view, setView] =
    useState("queue");

  const [
    selectedTicketId,
    setSelectedTicketId,
  ] = useState(null);

  // --------------------------------
  // TICKET FILTERING
  // --------------------------------

  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "open" &&
        ticket.technicianId === null
    );

  const myTickets =
    tickets.filter(
      (ticket) =>
        ticket.technicianId ===
        user.user_id
    );

  const activeTickets =
    myTickets.filter(
      (ticket) =>
        ticket.status ===
        "in_progress"
    );

  const resolvedTickets =
    myTickets.filter(
      (ticket) =>
        ticket.status === "resolved"
    );

  // IMPORTANT:
  // Find the ticket from the CURRENT props.
  //
  // We do NOT store the whole ticket object
  // in state because App.jsx changes that
  // object whenever a comment is added.
  const selectedTicket =
    tickets.find(
      (ticket) =>
        ticket.id ===
        selectedTicketId
    ) || null;

  const initials =
    `${user?.firstName?.[0] || ""}${
      user?.lastName?.[0] || ""
    }`.toUpperCase();

  // --------------------------------
  // OPEN A TICKET
  // --------------------------------

  const openTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
  };

  // --------------------------------
  // GRAB
  // --------------------------------

  const grabTicket = (ticketId) => {
    onGrabTicket(ticketId);

    // Switch to My Tickets after claiming.
    setView("mine");

    // Open the claimed ticket.
    setSelectedTicketId(ticketId);
  };

  // ================================================
  // RENDER
  // ================================================

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
          <nav className="hidden gap-1 md:flex">
            <button
              type="button"
              onClick={() => {
                setView("queue");
                setSelectedTicketId(
                  null
                );
              }}
              className={`flex items-center rounded-lg px-3 py-2 text-sm ${
                view === "queue" &&
                !selectedTicket
                  ? "bg-sky-500/10 font-semibold text-sky-400"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Inbox className="mr-2 h-4 w-4" />

              Open Queue

              {openTickets.length > 0 && (
                <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 text-[10px] font-bold text-white">
                  {openTickets.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setView("mine");
                setSelectedTicketId(
                  null
                );
              }}
              className={`flex items-center rounded-lg px-3 py-2 text-sm ${
                view === "mine" &&
                !selectedTicket
                  ? "bg-sky-500/10 font-semibold text-sky-400"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <ListChecks className="mr-2 h-4 w-4" />
              My Tickets
            </button>
          </nav>

          {/* PROFILE */}
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-100">
                {user?.firstName}{" "}
                {user?.lastName}
              </p>

              <p className="text-xs text-slate-400">
                Logged in as: Technician
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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* SELECTED TICKET */}
        {selectedTicket ? (
          <TechnicianTicketDetails
            ticket={selectedTicket}
            user={user}
            onBack={() => {
              setSelectedTicketId(
                null
              );

              setView("mine");
            }}
            onAddComment={
              onAddComment
            }
            onResolveTicket={
              onResolveTicket
            }
          />
        ) : (
          <>
            {/* TITLE */}
            <div className="mb-8">
              <p className="mb-1 text-sm font-medium text-sky-400">
                Technician Dashboard
              </p>

              <h1 className="text-3xl font-bold text-white">
                {view === "queue"
                  ? "Open Ticket Queue"
                  : "My Tickets"}
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                {view === "queue"
                  ? "Admin-approved tickets available for technicians to claim."
                  : "View your assigned tickets and communicate with employees."}
              </p>
            </div>

            {/* STATS */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                icon={Inbox}
                label="Available"
                value={
                  openTickets.length
                }
              />

              <StatCard
                icon={Clock}
                label="In Progress"
                value={
                  activeTickets.length
                }
              />

              <StatCard
                icon={CheckCircle2}
                label="Resolved"
                value={
                  resolvedTickets.length
                }
              />
            </div>

            {/* OPEN QUEUE */}
            {view === "queue" && (
              <>
                {openTickets.length ===
                0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 px-6 py-16 text-center">
                    <Inbox className="mx-auto mb-4 h-8 w-8 text-sky-400" />

                    <h3 className="text-lg font-semibold text-white">
                      No open tickets
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      Admin-approved
                      tickets will appear
                      here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {openTickets.map(
                      (ticket) => (
                        <OpenTicketCard
                          key={
                            ticket.id
                          }
                          ticket={
                            ticket
                          }
                          onGrabTicket={
                            grabTicket
                          }
                        />
                      )
                    )}
                  </div>
                )}
              </>
            )}

            {/* MY TICKETS */}
            {view === "mine" && (
              <>
                {myTickets.length ===
                0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 px-6 py-16 text-center">
                    <ListChecks className="mx-auto mb-4 h-8 w-8 text-sky-400" />

                    <h3 className="text-lg font-semibold text-white">
                      No tickets
                      assigned to you
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      Grab a ticket from
                      the Open Queue to
                      begin working.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myTickets.map(
                      (ticket) => (
                        <button
                          type="button"
                          key={
                            ticket.id
                          }
                          onClick={() =>
                            openTicket(
                              ticket.id
                            )
                          }
                          className="flex w-full items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-left transition hover:border-sky-500/30 hover:bg-slate-900/70"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <span className="text-xs text-slate-500">
                                Ticket #
                                {
                                  ticket.id
                                }
                              </span>

                              <span className="text-xs text-slate-600">
                                {
                                  ticket.category
                                }
                              </span>
                            </div>

                            <h3 className="font-semibold text-white">
                              {
                                ticket.title
                              }
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              Submitted by{" "}
                              {
                                ticket.submittedBy
                              }
                            </p>

                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                              <MessageSquare className="h-3.5 w-3.5 text-sky-400" />

                              {ticket
                                .comments
                                ?.length ||
                                0}{" "}
                              Messages
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <PriorityBadge
                              days={
                                ticket.priorityDays
                              }
                            />

                            <StatusBadge
                              status={
                                ticket.status
                              }
                            />
                          </div>
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-slate-600">
          Cloud IT Desk • Technician
          Console
        </div>
      </footer>
    </div>
  );
}