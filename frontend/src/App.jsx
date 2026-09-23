import { useState } from "react";

import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import UserDashboard from "./pages/UserDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTicket from "./pages/CreateTicket";
import CreateUser from "./pages/CreateUser";

// ================================================
// TEST USERS
// ================================================

const INITIAL_USERS = [
  {
    user_id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    password: "password123",
    role: "employee",
    mustChangePassword: false,
  },
  {
    user_id: 2,
    firstName: "Alex",
    lastName: "Rivera",
    email: "alex.rivera@company.com",
    password: "password123",
    role: "technician",
    mustChangePassword: false,
  },
  {
    user_id: 3,
    firstName: "Devon",
    lastName: "Brooks",
    email: "devon.brooks@company.com",
    password: "password123",
    role: "admin",
    mustChangePassword: false,
  },
  {
    user_id: 4,
    firstName: "New",
    lastName: "Employee",
    email: "new.employee@company.com",
    password: "Temp123!",
    role: "employee",
    mustChangePassword: true,
  },
];

// ================================================
// TEST TICKETS
// ================================================

const INITIAL_TICKETS = [
  {
    id: 1042,
    userId: 1,
    submittedBy: "John Doe",

    title: "Unable to connect to company VPN",
    category: "Network",

    description:
      "I am unable to connect to the company VPN. The connection attempts to start but eventually times out.",

    status: "pending",

    priorityDays: null,

    technicianId: null,
    technicianName: null,

    createdAt: new Date().toISOString(),

    approvedAt: null,
    assignedAt: null,
    dueAt: null,
    resolvedAt: null,

    comments: [],
  },
];

// ================================================
// APP
// ================================================

export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);

  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  const [currentUser, setCurrentUser] = useState(null);

  const [currentPage, setCurrentPage] = useState("login");

  const [loginError, setLoginError] = useState("");

  // ================================================
  // ROUTE USER BASED ON ROLE
  // ================================================

  const routeUserToDashboard = (user) => {
    if (!user) {
      setCurrentPage("login");
      return;
    }

    if (user.role === "admin") {
      setCurrentPage("admin-dashboard");
      return;
    }

    if (user.role === "technician") {
      setCurrentPage("technician-dashboard");
      return;
    }

    setCurrentPage("user-dashboard");
  };

  const goToDashboard = () => {
    routeUserToDashboard(currentUser);
  };

  // ================================================
  // LOGIN
  // ================================================

  const handleLogin = (credentials) => {
    const email = credentials?.email || "";
    const password = credentials?.password || "";

    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        user.password === password
    );

    if (!foundUser) {
      setLoginError("Invalid email or password.");
      return false;
    }

    setLoginError("");
    setCurrentUser(foundUser);

    // IMPORTANT:
    // Use foundUser here instead of currentUser.
    // React state does not update immediately.
    if (foundUser.mustChangePassword) {
      setCurrentPage("set-password");
    } else {
      routeUserToDashboard(foundUser);
    }

    return true;
  };

  // ================================================
  // FIRST LOGIN PASSWORD CHANGE
  // ================================================

  const handlePasswordSet = (newPassword) => {
    if (!currentUser) {
      return;
    }

    const updatedUser = {
      ...currentUser,
      password: newPassword,
      mustChangePassword: false,
    };

    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.user_id === currentUser.user_id
          ? updatedUser
          : user
      )
    );

    setCurrentUser(updatedUser);

    routeUserToDashboard(updatedUser);
  };

  // ================================================
  // LOGOUT
  // ================================================

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("login");
    setLoginError("");
  };

  // ================================================
  // CREATE TICKET
  // ================================================

  const handleCreateTicket = ({
    title,
    category,
    description,
  }) => {
    if (!currentUser) {
      return;
    }

    const newTicket = {
      id: Date.now(),

      userId: currentUser.user_id,

      submittedBy: `${currentUser.firstName} ${currentUser.lastName}`,

      title,
      category,
      description,

      status: "pending",

      priorityDays: null,

      technicianId: null,
      technicianName: null,

      createdAt: new Date().toISOString(),

      approvedAt: null,
      assignedAt: null,
      dueAt: null,
      resolvedAt: null,

      comments: [],
    };

    setTickets((previousTickets) => [
      newTicket,
      ...previousTickets,
    ]);

    routeUserToDashboard(currentUser);
  };

  // ================================================
  // ADMIN - APPROVE TICKET
  // ================================================

  const handleApproveTicket = (
    ticketId,
    priorityDays
  ) => {
    const days = Number(priorityDays);

    if (
      !Number.isInteger(days) ||
      days < 1 ||
      days > 30
    ) {
      return;
    }

    const approvedAt = new Date();

    const dueAt = new Date(approvedAt);

    dueAt.setDate(dueAt.getDate() + days);

    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,

              status: "open",

              priorityDays: days,

              approvedAt:
                approvedAt.toISOString(),

              dueAt: dueAt.toISOString(),
            }
          : ticket
      )
    );
  };

  // ================================================
  // ADMIN - REJECT TICKET
  // ================================================

  const handleRejectTicket = (ticketId) => {
    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: "rejected",
            }
          : ticket
      )
    );
  };

  // ================================================
  // TECHNICIAN - GRAB TICKET
  // ================================================

  const handleGrabTicket = (ticketId) => {
    if (
      !currentUser ||
      currentUser.role !== "technician"
    ) {
      return;
    }

    setTickets((previousTickets) =>
      previousTickets.map((ticket) => {
        if (ticket.id !== ticketId) {
          return ticket;
        }

        if (
          ticket.status !== "open" ||
          ticket.technicianId !== null
        ) {
          return ticket;
        }

        return {
          ...ticket,

          status: "in_progress",

          technicianId: currentUser.user_id,

          technicianName: `${currentUser.firstName} ${currentUser.lastName}`,

          assignedAt: new Date().toISOString(),
        };
      })
    );
  };

  // ================================================
  // COMMENTS / MESSAGES
  // ================================================

  const handleAddComment = (ticketId, text) => {
    if (!currentUser) {
      return;
    }

    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    const newComment = {
      id: Date.now(),

      userId: currentUser.user_id,

      author: `${currentUser.firstName} ${currentUser.lastName}`,

      text: trimmedText,

      timestamp: new Date().toISOString(),
    };

    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,

              comments: [
                ...(ticket.comments || []),
                newComment,
              ],
            }
          : ticket
      )
    );
  };

  // ================================================
  // TECHNICIAN - RESOLVE TICKET
  // ================================================

  const handleResolveTicket = (ticketId) => {
    if (
      !currentUser ||
      currentUser.role !== "technician"
    ) {
      return;
    }

    setTickets((previousTickets) =>
      previousTickets.map((ticket) => {
        if (ticket.id !== ticketId) {
          return ticket;
        }

        if (
          ticket.technicianId !== currentUser.user_id
        ) {
          return ticket;
        }

        return {
          ...ticket,

          status: "resolved",

          resolvedAt: new Date().toISOString(),
        };
      })
    );
  };

  // ================================================
  // LOGIN SCREEN
  // ================================================

  if (!currentUser) {
    return (
      <Login
        onLogin={handleLogin}
        loginError={loginError}
      />
    );
  }

  // ================================================
  // FORCE FIRST LOGIN PASSWORD CHANGE
  // ================================================

  if (
    currentUser.mustChangePassword ||
    currentPage === "set-password"
  ) {
    return (
      <SetPassword
        user={currentUser}
        onPasswordSet={handlePasswordSet}
        onLogout={handleLogout}
      />
    );
  }

  // ================================================
  // CREATE USER
  // ADMIN ONLY
  // ================================================

  if (
    currentUser.role === "admin" &&
    currentPage === "create-user"
  ) {
    return (
      <CreateUser
        onDashboard={() =>
          setCurrentPage("admin-dashboard")
        }
      />
    );
  }

  // ================================================
  // CREATE TICKET
  // EMPLOYEE ONLY
  // ================================================

  if (
    currentUser.role === "employee" &&
    currentPage === "create-ticket"
  ) {
    return (
      <CreateTicket
        user={currentUser}
        onSubmitTicket={handleCreateTicket}
        onDashboard={goToDashboard}
        onLogout={handleLogout}
      />
    );
  }

  // ================================================
  // ADMIN DASHBOARD
  //
  // IMPORTANT:
  // This checks ROLE instead of currentPage.
  // Therefore an admin cannot accidentally render
  // UserDashboard.
  // ================================================

  if (currentUser.role === "admin") {
    return (
      <AdminDashboard
        user={currentUser}
        tickets={tickets}
        onApproveTicket={handleApproveTicket}
        onRejectTicket={handleRejectTicket}
        onAddComment={handleAddComment}
        onCreateUser={() =>
          setCurrentPage("create-user")
        }
        onLogout={handleLogout}
      />
    );
  }

  // ================================================
  // TECHNICIAN DASHBOARD
  // ================================================

  if (currentUser.role === "technician") {
    return (
      <TechnicianDashboard
        user={currentUser}
        tickets={tickets}
        onGrabTicket={handleGrabTicket}
        onAddComment={handleAddComment}
        onResolveTicket={handleResolveTicket}
        onLogout={handleLogout}
      />
    );
  }

  // ================================================
  // EMPLOYEE DASHBOARD
  //
  // Only employees can reach this point.
  // ================================================

  return (
    <UserDashboard
      user={currentUser}
      tickets={tickets.filter(
        (ticket) =>
          ticket.userId === currentUser.user_id
      )}
      onAddComment={handleAddComment}
      onCreateTicket={() =>
        setCurrentPage("create-ticket")
      }
      onLogout={handleLogout}
    />
  );
}