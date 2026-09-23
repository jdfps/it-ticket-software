import { useState } from "react";
import {
  CloudLightning,
  PieChart,
  PlusCircle,
  ListChecks,
  LogOut,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  CalendarPlus,
  Inbox,
  ArrowRight,
} from "lucide-react";

const INITIAL_TICKETS = [
  {
    id: 1042,
    title: "Unable to connect to company VPN",
    category: "Network",
    status: "In Progress",
    priority: "P2",
    createdAt: "2026-09-21T09:30:00",
    description:
      "I am unable to connect to the company VPN from my laptop. The connection times out after entering my credentials.",
    technician: "Alex Rivera",
    comments: [
      {
        id: 1,
        author: "Alex Rivera",
        text: "I am looking into the VPN issue now. Please confirm whether this happens on both Wi-Fi and Ethernet.",
        timestamp: "2026-09-21T10:15:00",
      },
    ],
  },
  {
    id: 1038,
    title: "Microsoft Office activation error",
    category: "Software",
    status: "Open",
    priority: "P3",
    createdAt: "2026-09-20T14:10:00",
    description:
      "Microsoft Word is showing an activation error when I open the application.",
    technician: null,
    comments: [],
  },
  {
    id: 1029,
    title: "Monitor flickering intermittently",
    category: "Hardware",
    status: "Resolved",
    priority: "P4",
    createdAt: "2026-09-16T11:45:00",
    resolvedAt: "2026-09-17T13:20:00",
    description:
      "My second monitor flickers every few minutes while connected through the docking station.",
    technician: "Jordan Lee",
    comments: [
      {
        id: 1,
        author: "Jordan Lee",
        text: "The docking station cable was replaced and the monitor is now functioning normally.",
        timestamp: "2026-09-17T13:20:00",
      },
    ],
  },
];

const PRIORITY_META = {
  P1: {
    label: "P1 · Urgent",
    dot: "bg-rose-400",
    text: "text-rose-300",
    bg: "bg-rose-500/10",
    ring: "ring-rose-400/30",
  },
  P2: {
    label: "P2 · High",
    dot: "bg-orange-400",
    text: "text-orange-300",
    bg: "bg-orange-500/10",
    ring: "ring-orange-400/30",
  },
  P3: {
    label: "P3 · Medium",
    dot: "bg-amber-400",
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    ring: "ring-amber-400/30",
  },
  P4: {
    label: "P4 · Low",
    dot: "bg-sky-400",
    text: "text-sky-300",
    bg: "bg-sky-500/10",
    ring: "ring-sky-400/30",
  },
  P5: {
    label: "P5 · Minimal",
    dot: "bg-slate-400",
    text: "text-slate-300",
    bg: "bg-slate-500/10",
    ring: "ring-slate-400/30",
  },
};

const STATUS_META = {
  Open: {
    text: "text-sky-300",
    bg: "bg-sky-500/10",
    ring: "ring-sky-400/30",
  },

  "In Progress": {
    text: "text-indigo-300",
    bg: "bg-indigo-500/10",
    ring: "ring-indigo-400/30",
  },

  Resolved: {
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-400/30",
  },
};

function formatDateTime(date) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority];

  if (!meta) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-700/50 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-600/40">
        Pending Priority
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${meta.bg} ${meta.text} ${meta.ring}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${meta.dot}`}
      />

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
      {status}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, tone }) {
  const toneMap = {
    sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    indigo:
      "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    emerald:
      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-3xl font-bold text-white">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${toneMap[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function TicketRow({ ticket, expanded, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/40 transition hover:border-slate-600">
      <button
        type="button"
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
            <span className="truncate text-sm font-semibold text-slate-100">
              {ticket.title}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>Ticket #{ticket.id}</span>

            <span>•</span>

            <span>{ticket.category}</span>

            <span className="flex items-center">
              <CalendarPlus className="mr-1 h-3 w-3" />
              {formatDateTime(ticket.createdAt)}
            </span>
          </div>
        </div>

        <div className="hidden flex-shrink-0 items-center gap-2 sm:flex">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-800 px-5 py-5">
            {/* Mobile badges */}
            <div className="mb-4 flex flex-wrap items-center gap-2 sm:hidden">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>

            {/* Description */}
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </h4>

              <p className="text-sm leading-relaxed text-slate-300">
                {ticket.description}
              </p>
            </div>

            {/* Technician */}
            <div className="mt-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Assigned Technician
              </h4>

              {ticket.technician ? (
                <p className="text-sm font-medium text-slate-200">
                  {ticket.technician}
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Waiting for technician assignment
                </p>
              )}
            </div>

            {/* Resolution */}
            {ticket.status === "Resolved" &&
              ticket.resolvedAt && (
                <div className="mt-5 flex items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0" />

                  Resolved {formatDateTime(ticket.resolvedAt)}
                </div>
              )}

            {/* Comments */}
            <div className="mt-6 border-t border-slate-800 pt-5">
              <h4 className="mb-3 flex items-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                Comments & Updates
              </h4>

              {ticket.comments.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No updates have been posted yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {ticket.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                    >
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200">
                          {comment.author}
                        </span>

                        <span className="text-xs text-slate-500">
                          {formatDateTime(comment.timestamp)}
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed text-slate-300">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard({
  user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    role: "employee",
  },
  onCreateTicket,
  onLogout,
}) {
  const [tickets] = useState(INITIAL_TICKETS);
  const [expandedId, setExpandedId] = useState(null);

  const openCount = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressCount = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const toggleTicket = (id) => {
    setExpandedId((current) =>
      current === id ? null : id
    );
  };

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-50 antialiased">
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 10%, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%)",
        }}
      />

      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Branding */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
              <CloudLightning className="h-5 w-5" />
            </div>

            <span className="font-heading text-xl font-bold tracking-tight text-white">
              Cloud IT <span className="text-sky-400">Desk</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center space-x-1 md:flex">
            <button
              type="button"
              className="flex items-center rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-400"
            >
              <PieChart className="mr-1.5 h-4 w-4" />
              Dashboard
            </button>

            <button
              type="button"
              onClick={onCreateTicket}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <PlusCircle className="mr-1.5 h-4 w-4 text-slate-400" />
              Create Ticket
            </button>

            <button
              type="button"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <ListChecks className="mr-1.5 h-4 w-4 text-slate-400" />
              My Tickets
            </button>
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-sm font-semibold text-slate-200">
                {user.firstName} {user.lastName}
              </span>

              <span className="text-xs text-slate-400">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400 align-middle" />

                Logged in as:{" "}

                <strong className="font-normal capitalize text-slate-300">
                  {user.role}
                </strong>
              </span>
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

      {/* Main */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-sky-400">
              Employee Dashboard
            </p>

            <h1 className="font-heading text-3xl font-bold tracking-tight text-white">
              Welcome back, {user.firstName}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Track your support requests and view updates from the IT
              team.
            </p>
          </div>

          <button
            type="button"
            onClick={onCreateTicket}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-400 hover:to-blue-500 active:scale-95"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Open Tickets"
            value={openCount}
            icon={AlertCircle}
            tone="sky"
          />

          <StatCard
            label="In Progress"
            value={inProgressCount}
            icon={Clock}
            tone="indigo"
          />

          <StatCard
            label="Resolved"
            value={resolvedCount}
            icon={CheckCircle2}
            tone="emerald"
          />
        </div>

        {/* Tickets */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30">
          <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Recent Tickets
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                View the status and latest updates for your support
                requests.
              </p>
            </div>

            <button
              type="button"
              className="flex items-center text-sm font-medium text-sky-400 transition hover:text-sky-300"
            >
              View All Tickets
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sky-400">
                  <Inbox className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  No tickets yet
                </h3>

                <p className="mt-1 max-w-md text-sm text-slate-400">
                  You haven't submitted any support requests yet.
                </p>

                <button
                  type="button"
                  onClick={onCreateTicket}
                  className="mt-5 flex items-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-blue-500"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <TicketRow
                    key={ticket.id}
                    ticket={ticket}
                    expanded={expandedId === ticket.id}
                    onToggle={toggleTicket}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}