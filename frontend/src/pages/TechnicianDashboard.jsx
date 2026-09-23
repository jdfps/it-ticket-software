import { useState, useRef } from "react";
import {
  CloudLightning,
  PieChart,
  PlusCircle,
  ListChecks,
  LogOut,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Inbox,
  X,
  Send,
  CheckCircle2,
  MessageSquare,
  CalendarPlus,
  CalendarCheck,
} from "lucide-react";

const PRIORITY_META = {
  P1: { label: "P1 · Urgent", dot: "bg-rose-400", text: "text-rose-300", ring: "ring-rose-400/30", bg: "bg-rose-500/10" },
  P2: { label: "P2 · High", dot: "bg-orange-400", text: "text-orange-300", ring: "ring-orange-400/30", bg: "bg-orange-500/10" },
  P3: { label: "P3 · Medium", dot: "bg-amber-400", text: "text-amber-300", ring: "ring-amber-400/30", bg: "bg-amber-500/10" },
  P4: { label: "P4 · Low", dot: "bg-sky-400", text: "text-sky-300", ring: "ring-sky-400/30", bg: "bg-sky-500/10" },
  P5: { label: "P5 · Minimal", dot: "bg-slate-400", text: "text-slate-300", ring: "ring-slate-400/30", bg: "bg-slate-500/10" },
};

const STATUS_META = {
  Open: { label: "Open", text: "text-sky-300", bg: "bg-sky-500/10", ring: "ring-sky-400/30" },
  "In Progress": { label: "In Progress", text: "text-indigo-300", bg: "bg-indigo-500/10", ring: "ring-indigo-400/30" },
  Resolved: { label: "Resolved", text: "text-emerald-300", bg: "bg-emerald-500/10", ring: "ring-emerald-400/30" },
};

function PriorityBadge({ priority }) {
  if (!priority) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-700/50 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-600/40">
        Priority not set
      </span>
    );
  }
  const meta = PRIORITY_META[priority];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${meta.bg} ${meta.text} ${meta.ring}`}
    >
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Open;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${meta.bg} ${meta.text} ${meta.ring}`}
    >
      {meta.label}
    </span>
  );
}

function formatDateTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function NewTicketModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("");
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim() || title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters long.";
    }
    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      priority: priority || null,
    });
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-700/80 p-6 shadow-2xl sm:p-7"
        style={{ background: "rgba(15, 23, 42, 0.97)" }}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">
              Create Ticket
            </h2>
            <p className="mt-0.5 text-sm text-slate-400">
              Log a ticket on a user&rsquo;s behalf.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cannot connect to VPN"
              className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-slate-50 placeholder-slate-500 transition focus:outline-none focus:ring-[3px] ${
                errors.title
                  ? "border-rose-400 focus:ring-rose-400/15"
                  : "border-slate-700 focus:border-sky-400 focus:ring-sky-400/15"
              }`}
            />
            {errors.title && (
              <span className="mt-1 block text-xs text-rose-400">{errors.title}</span>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's happening, and what have you already tried?"
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Priority{" "}
              <span className="text-xs font-normal text-slate-400">
                (admin sets or confirms this)
              </span>
            </label>
            <div className="relative">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-700 bg-slate-950 py-3 pl-4 pr-10 text-sm text-slate-50 transition focus:border-sky-400 focus:outline-none focus:ring-[3px] focus:ring-sky-400/15"
              >
                <option value="">Not set yet</option>
                {Object.entries(PRIORITY_META).map(([value, meta]) => (
                  <option key={value} value={value}>
                    {meta.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-400 hover:to-blue-500 active:scale-95"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TicketRow({ ticket, expanded, onToggle, onAddComment, onMarkComplete }) {
  const [draft, setDraft] = useState("");
  const isResolved = ticket.status === "Resolved";
  const showPastDue = ticket.pastDue && !isResolved;

  const submitComment = () => {
    if (!draft.trim()) return;
    onAddComment(ticket.id, draft.trim());
    setDraft("");
  };

  return (
    <div
      className={`rounded-2xl border transition ${
        showPastDue
          ? "border-rose-500/30 bg-rose-500/[0.03]"
          : "border-slate-700/80 bg-slate-900/40"
      }`}
    >
      <button
        onClick={() => onToggle(ticket.id)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-slate-500 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {showPastDue && (
              <span title="Past due">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-rose-400" />
              </span>
            )}
            <span className="truncate text-sm font-semibold text-slate-100">
              {ticket.title}
            </span>
          </div>
          <span className="mt-0.5 flex items-center text-xs text-slate-500">
            <CalendarPlus className="mr-1 h-3 w-3" />
            Created {formatDateTime(ticket.createdAt)}
          </span>
        </div>

        <div className="hidden flex-shrink-0 items-center gap-2 sm:flex">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-800 px-5 py-5">
            {/* mobile-only badges */}
            <div className="mb-4 flex items-center gap-2 sm:hidden">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>

            <p className="text-sm leading-relaxed text-slate-300">
              {ticket.description}
            </p>

            {isResolved && (
              <div className="mt-4 flex items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
                <CalendarCheck className="mr-2 h-4 w-4 flex-shrink-0" />
                Resolved {formatDateTime(ticket.resolvedAt)}
              </div>
            )}

            {/* Comments */}
            <div className="mt-5">
              <h4 className="mb-3 flex items-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                Comments &amp; updates
              </h4>

              {ticket.comments.length === 0 ? (
                <p className="mb-4 text-sm text-slate-500">
                  No comments yet — post an update below.
                </p>
              ) : (
                <div className="mb-4 space-y-3">
                  {ticket.comments.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">
                          {c.author}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(c.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-2">
                <textarea
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Post an update for the requester..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-50 placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-[3px] focus:ring-sky-400/15"
                />
                <button
                  onClick={submitComment}
                  disabled={!draft.trim()}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400 transition hover:bg-sky-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Post comment"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            {!isResolved && (
              <div className="mt-5 flex justify-end border-t border-slate-800 pt-4">
                <button
                  onClick={() => onMarkComplete(ticket.id)}
                  className="flex items-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-95"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Ticket Complete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  const toneMap = {
    sky: "text-sky-400",
    indigo: "text-indigo-400",
    rose: "text-rose-400",
    emerald: "text-emerald-400",
  };
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
      <div className={`text-2xl font-bold ${toneMap[tone]}`}>{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

export default function TechnicianView({ technicianName = "Alex Rivera" }) {
  const [tickets, setTickets] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const nextId = useRef(1);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCreate = ({ title, description, priority }) => {
    const ticket = {
      id: nextId.current++,
      title,
      description,
      status: "Open",
      priority,
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      pastDue: false,
      comments: [],
    };
    setTickets((prev) => [ticket, ...prev]);
    setModalOpen(false);
    setExpandedId(ticket.id);
  };

  const handleAddComment = (ticketId, text) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: t.status === "Open" ? "In Progress" : t.status,
              comments: [
                ...t.comments,
                {
                  id: t.comments.length + 1,
                  author: technicianName,
                  text,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : t
      )
    );
  };

  const handleMarkComplete = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: "Resolved", resolvedAt: new Date().toISOString(), pastDue: false }
          : t
      )
    );
  };

  const counts = {
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    pastDue: tickets.filter((t) => t.pastDue && t.status !== "Resolved").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
  };

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
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
              <CloudLightning className="h-5 w-5" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-white">
              Cloud IT <span className="text-sky-400">Desk</span>
            </span>
          </div>

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
              <ListChecks className="mr-1.5 h-4 w-4 text-sky-400" /> Assigned
              Tickets
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-sm font-semibold text-slate-200">
                {technicianName}
              </span>
              <span className="text-xs text-slate-400">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400 align-middle" />
                Logged in as:{" "}
                <strong className="font-normal text-slate-300">
                  Technician
                </strong>
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-bold text-sky-400">
              {technicianName
                .split(" ")
                .map((n) => n[0])
                .join("")}
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

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <nav className="mb-2 flex text-sm text-slate-400" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li>
                <a href="#" className="transition hover:text-slate-200">
                  Home
                </a>
              </li>
              <li>
                <ChevronRight className="mx-1 h-3 w-3 text-slate-600" />
              </li>
              <li className="font-medium text-sky-400">Assigned Tickets</li>
            </ol>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-white">
                Assigned Tickets
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                View your queue, post updates, and resolve tickets.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-400 hover:to-blue-500 active:scale-95"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Ticket
            </button>
          </div>
        </div>

        {tickets.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Open" value={counts.open} tone="sky" />
            <StatCard label="In Progress" value={counts.inProgress} tone="indigo" />
            <StatCard label="Past Due" value={counts.pastDue} tone="rose" />
            <StatCard label="Resolved" value={counts.resolved} tone="emerald" />
          </div>
        )}

        {tickets.length === 0 ? (
          <div
            className="flex flex-col items-center rounded-2xl border border-dashed border-slate-700 px-6 py-16 text-center"
            style={{ background: "rgba(30, 41, 59, 0.4)" }}
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sky-400">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-white">
              No tickets assigned yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              When a ticket is created and assigned to you, it will show up
              here. You can also log one yourself below.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-5 flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-400 hover:to-blue-500 active:scale-95"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                expanded={expandedId === ticket.id}
                onToggle={toggleExpand}
                onAddComment={handleAddComment}
                onMarkComplete={handleMarkComplete}
              />
            ))}
          </div>
        )}
      </main>

      <NewTicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
