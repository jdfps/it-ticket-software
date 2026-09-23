import { useState, useMemo } from "react";
import {
  CloudLightning,
  PieChart,
  PlusCircle,
  ListChecks,
  ShieldCheck,
  LogOut,
  Search,
  Inbox,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  UserCog,
  Flag,
  Send,
  X,
} from "lucide-react";

const STATUS_OPTIONS = ["Open", "In Progress", "Resolved", "Closed"];

const PRIORITY_OPTIONS = [
  { value: "Low", ring: "ring-slate-500/30", text: "text-slate-300", dot: "bg-slate-400" },
  { value: "Medium", ring: "ring-sky-500/30", text: "text-sky-300", dot: "bg-sky-400" },
  { value: "High", ring: "ring-amber-500/30", text: "text-amber-300", dot: "bg-amber-400" },
  { value: "Critical", ring: "ring-rose-500/30", text: "text-rose-300", dot: "bg-rose-400" },
];

const CATEGORY_OPTIONS = ["Hardware", "Software", "Network", "Account", "Other"];

const TECHNICIANS = ["Unassigned", "Alex Kim", "Priya Shah", "Devon Brooks"];

const STATUS_STYLE = {
  Open: "text-amber-300 bg-amber-500/10 ring-amber-500/25",
  "In Progress": "text-sky-300 bg-sky-500/10 ring-sky-500/25",
  Resolved: "text-emerald-300 bg-emerald-500/10 ring-emerald-500/25",
  Closed: "text-slate-400 bg-slate-500/10 ring-slate-500/25",
};

const INITIAL_TICKETS = [
  {
    id: 1042,
    title: "Laptop screen flickers during Zoom video calls",
    category: "Hardware",
    submittedBy: "Maria Lopez",
    status: "Open",
    priority: "Medium",
    technician: "Unassigned",
    createdAt: "2026-09-19T09:12:00",
    pastDue: false,
    description:
      "Screen flickers intermittently whenever the camera turns on during video calls. Doesn't happen otherwise.",
    comments: [],
  },
  {
    id: 1041,
    title: "Cannot connect to VPN from home network",
    category: "Network",
    submittedBy: "James Carter",
    status: "In Progress",
    priority: "High",
    technician: "Alex Kim",
    createdAt: "2026-09-18T14:03:00",
    pastDue: true,
    description:
      "VPN client fails to authenticate since yesterday morning. Error code 809 shows on connect attempt.",
    comments: [
      { author: "Alex Kim", text: "Looking into it, can you confirm your VPN client version?", createdAt: "2026-09-18T15:10:00" },
    ],
  },
  {
    id: 1040,
    title: "Excel crashes immediately after opening",
    category: "Software",
    submittedBy: "Devon Brooks",
    status: "Resolved",
    priority: "Medium",
    technician: "Priya Shah",
    createdAt: "2026-09-16T11:00:00",
    pastDue: false,
    description: "Excel closes right after the splash screen appears, every time.",
    comments: [
      { author: "Priya Shah", text: "Reinstalled the corrupted add-in, confirmed fixed after restart.", createdAt: "2026-09-16T13:25:00" },
    ],
  },
  {
    id: 1039,
    title: "Need access to Finance shared drive",
    category: "Account",
    submittedBy: "Sarah Nguyen",
    status: "Closed",
    priority: "Low",
    technician: "Alex Kim",
    createdAt: "2026-09-10T13:45:00",
    pastDue: false,
    description: "Requesting read/write access to the Finance shared drive for Q3 reporting.",
    comments: [
      { author: "Alex Kim", text: "Access granted, confirmed with user they can reach the drive.", createdAt: "2026-09-11T10:00:00" },
    ],
  },
  {
    id: 1038,
    title: "Office wifi drops every 10 minutes on 3rd floor",
    category: "Network",
    submittedBy: "Maria Lopez",
    status: "Open",
    priority: "Critical",
    technician: "Unassigned",
    createdAt: "2026-09-20T08:30:00",
    pastDue: true,
    description: "Wifi disconnects repeatedly, affecting the whole 3rd floor since this morning.",
    comments: [],
  },
];

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function PriorityDot({ value }) {
  const meta = PRIORITY_OPTIONS.find((p) => p.value === value) ?? PRIORITY_OPTIONS[0];
  return <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />;
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [draftComment, setDraftComment] = useState("");

  const stats = useMemo(() => {
    return {
      open: tickets.filter((t) => t.status === "Open").length,
      inProgress: tickets.filter((t) => t.status === "In Progress").length,
      resolved: tickets.filter((t) => t.status === "Resolved").length,
      pastDue: tickets.filter((t) => t.pastDue && t.status !== "Resolved" && t.status !== "Closed").length,
    };
  }, [tickets]);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        !search.trim() ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        String(t.id).includes(search);
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tickets, search, statusFilter, categoryFilter]);

  const updateTicket = (id, patch) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const addComment = (id) => {
    if (!draftComment.trim()) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              comments: [
                ...t.comments,
                { author: "Admin (you)", text: draftComment.trim(), createdAt: new Date().toISOString() },
              ],
            }
          : t
      )
    );
    setDraftComment("");
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
            <a href="#" className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
              <PieChart className="mr-1.5 h-4 w-4 text-slate-400" /> Dashboard
            </a>
            <a href="#" className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
              <PlusCircle className="mr-1.5 h-4 w-4 text-slate-400" /> Create Ticket
            </a>
            <a href="#" className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
              <ListChecks className="mr-1.5 h-4 w-4 text-slate-400" /> My Tickets
            </a>
            <a href="#" className="flex items-center rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-400">
              <ShieldCheck className="mr-1.5 h-4 w-4 text-sky-400" /> Admin Dashboard
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-sm font-semibold text-slate-200">Devon Brooks</span>
              <span className="text-xs text-slate-400">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400 align-middle" />
                Logged in as: <strong className="font-normal text-slate-300">Admin</strong>
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-bold text-sky-400">
              DB
            </div>
            <button title="Log Out" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-rose-400">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Review submitted tickets, assign priority, and track resolution across the queue.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<Inbox className="h-4 w-4" />} label="Open" value={stats.open} tone="amber" />
          <StatCard icon={<Loader2 className="h-4 w-4" />} label="In Progress" value={stats.inProgress} tone="sky" />
          <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Resolved" value={stats.resolved} tone="emerald" />
          <StatCard icon={<AlertTriangle className="h-4 w-4" />} label="Past Due" value={stats.pastDue} tone="rose" />
        </div>

        {/* Filter Bar */}
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-700/80 bg-slate-800/40 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or ticket #..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-50 placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-[3px] focus:ring-sky-400/15"
            />
          </div>

          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={["All", ...STATUS_OPTIONS]} />
          <FilterSelect value={categoryFilter} onChange={setCategoryFilter} options={["All", ...CATEGORY_OPTIONS]} />
        </div>

        {/* Ticket List */}
        <div className="overflow-hidden rounded-2xl border border-slate-700/80" style={{ background: "rgba(30, 41, 59, 0.5)" }}>
          <div className="hidden grid-cols-[80px_1fr_140px_150px_160px_100px_36px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
            <span>Ticket</span>
            <span>Title</span>
            <span>Priority</span>
            <span>Technician</span>
            <span>Status</span>
            <span>Age</span>
            <span />
          </div>

          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              No tickets match these filters.
            </div>
          )}

          {filtered.map((t) => (
            <TicketRow
              key={t.id}
              ticket={t}
              expanded={expandedId === t.id}
              onToggle={() => setExpandedId(expandedId === t.id ? null : t.id)}
              onUpdate={(patch) => updateTicket(t.id, patch)}
              draftComment={expandedId === t.id ? draftComment : ""}
              setDraftComment={setDraftComment}
              onAddComment={() => addComment(t.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, tone }) {
  const toneMap = {
    amber: "text-amber-400 bg-amber-500/10",
    sky: "text-sky-400 bg-sky-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    rose: "text-rose-400 bg-rose-500/10",
  };
  return (
    <div
      className="rounded-2xl border border-slate-700/80 p-4"
      style={{ background: "rgba(30, 41, 59, 0.6)" }}
    >
      <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${toneMap[tone]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-4 pr-9 text-sm text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-[3px] focus:ring-sky-400/15"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

function TicketRow({ ticket, expanded, onToggle, onUpdate, draftComment, setDraftComment, onAddComment }) {
  const priorityMeta = PRIORITY_OPTIONS.find((p) => p.value === ticket.priority) ?? PRIORITY_OPTIONS[0];

  return (
    <div className="border-b border-slate-800 last:border-b-0">
      <div
        onClick={onToggle}
        className="grid cursor-pointer grid-cols-2 gap-3 px-5 py-3.5 text-sm transition hover:bg-slate-800/40 md:grid-cols-[80px_1fr_140px_150px_160px_100px_36px] md:items-center md:gap-4"
      >
        <span className="font-mono text-xs text-slate-500">#{ticket.id}</span>

        <div className="col-span-2 md:col-span-1">
          <p className="font-medium text-slate-100">{ticket.title}</p>
          <p className="text-xs text-slate-500">
            {ticket.category} &middot; {ticket.submittedBy}
            {ticket.pastDue && ticket.status !== "Resolved" && ticket.status !== "Closed" && (
              <span className="ml-2 inline-flex items-center gap-1 text-rose-400">
                <AlertTriangle className="h-3 w-3" /> Past due
              </span>
            )}
          </p>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <select
              value={ticket.priority}
              onChange={(e) => onUpdate({ priority: e.target.value })}
              className={`w-full cursor-pointer appearance-none rounded-lg border border-slate-700 bg-slate-950 py-1.5 pl-7 pr-7 text-xs font-medium ${priorityMeta.text} focus:border-sky-400 focus:outline-none focus:ring-[3px] focus:ring-sky-400/15`}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value} className="text-slate-100">
                  {p.value}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
              <PriorityDot value={ticket.priority} />
            </span>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <select
              value={ticket.technician}
              onChange={(e) => onUpdate({ technician: e.target.value })}
              className="w-full cursor-pointer appearance-none rounded-lg border border-slate-700 bg-slate-950 py-1.5 pl-7 pr-7 text-xs text-slate-300 focus:border-sky-400 focus:outline-none focus:ring-[3px] focus:ring-sky-400/15"
            >
              {TECHNICIANS.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
            <UserCog className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500" />
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <select
              value={ticket.status}
              onChange={(e) =>
                onUpdate({
                  status: e.target.value,
                  ...(e.target.value === "Resolved" || e.target.value === "Closed" ? { pastDue: false } : {}),
                })
              }
              className={`w-full cursor-pointer appearance-none rounded-full border-0 py-1.5 pl-3 pr-7 text-xs font-semibold ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-sky-400/40 ${STATUS_STYLE[ticket.status]}`}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-slate-100">
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-70" />
          </div>
        </div>

        <span className="text-xs text-slate-500">{timeAgo(ticket.createdAt)}</span>

        <ChevronRight
          className={`hidden h-4 w-4 text-slate-500 transition-transform md:block ${expanded ? "rotate-90" : ""}`}
        />
      </div>

      {expanded && (
        <div className="border-t border-slate-800 bg-slate-950/40 px-5 py-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-1.5 flex items-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Flag className="mr-1.5 h-3.5 w-3.5" /> Description
              </h4>
              <p className="text-sm leading-relaxed text-slate-300">{ticket.description}</p>
            </div>

            <div>
              <h4 className="mb-1.5 flex items-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Resolution Notes
              </h4>

              <div className="mb-3 max-h-40 space-y-2 overflow-y-auto pr-1">
                {ticket.comments.length === 0 && (
                  <p className="text-xs text-slate-500">No notes yet.</p>
                )}
                {ticket.comments.map((c, i) => (
                  <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-xs">
                    <div className="mb-0.5 flex items-center justify-between">
                      <span className="font-semibold text-slate-300">{c.author}</span>
                      <span className="text-slate-500">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-slate-400">{c.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={draftComment}
                  onChange={(e) => setDraftComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onAddComment()}
                  placeholder="Describe what was done to fix this..."
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-[3px] focus:ring-sky-400/15"
                />
                <button
                  onClick={onAddComment}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white transition hover:from-sky-400 hover:to-blue-500"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="mt-4 flex items-center text-xs font-medium text-slate-500 hover:text-slate-300"
          >
            <X className="mr-1 h-3 w-3" /> Collapse
          </button>
        </div>
      )}
    </div>
  );
}
