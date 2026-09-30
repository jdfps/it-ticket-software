import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import UserDashboard from "./pages/UserDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTicket from "./pages/CreateTicket";
import CreateUser from "./pages/CreateUser";

import {
  login,
  setPassword,
  createUser,
  getUsers,
  getCategories,
  createTicket,
  getTickets,
  approveTicket,
  rejectTicket,
  claimTicket,
  resolveTicket,
  getComments,
  createComment,
} from "./api/api";

// ================================================
// SETTINGS
// ================================================

// Check FastAPI every 3 seconds for ticket/message changes.
const REFRESH_INTERVAL = 3000;

// Automatically log out after 5 minutes with no activity.
const INACTIVITY_LIMIT = 5 * 60 * 1000;

// sessionStorage survives F5/refresh, but is removed
// when the browser tab/window session is closed.
const SESSION_USER_KEY = "cloudItDeskUser";

// ================================================
// MAP BACKEND USER -> FRONTEND USER
// ================================================

function mapUser(user) {
  if (!user) {
    return null;
  }

  return {
    user_id: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role,
    mustChangePassword:
      user.must_change_password,
  };
}

// ================================================
// GET SAVED USER
// ================================================

function getSavedUser() {
  try {
    const savedUser =
      sessionStorage.getItem(
        SESSION_USER_KEY
      );

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch {
    sessionStorage.removeItem(
      SESSION_USER_KEY
    );

    return null;
  }
}

// ================================================
// APP
// ================================================

export default function App() {
  // Restore the user after F5/refresh.
  const [currentUser, setCurrentUser] =
    useState(() => getSavedUser());

  const [currentPage, setCurrentPage] =
    useState(() => {
      const savedUser = getSavedUser();

      if (!savedUser) {
        return "login";
      }

      if (
        savedUser.mustChangePassword
      ) {
        return "set-password";
      }

      if (
        savedUser.role === "admin"
      ) {
        return "admin-dashboard";
      }

      if (
        savedUser.role ===
        "technician"
      ) {
        return "technician-dashboard";
      }

      return "user-dashboard";
    });

  const [tickets, setTickets] =
    useState([]);

  const [loginError, setLoginError] =
    useState("");

  const [
    loadingTickets,
    setLoadingTickets,
  ] = useState(false);

  // Prevent overlapping polling requests.
  const loadingRef = useRef(false);

  // Stores the time of the user's last activity.
  const lastActivityRef = useRef(
    Date.now()
  );

  // ================================================
  // SAVE CURRENT USER
  // ================================================

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(
        SESSION_USER_KEY,
        JSON.stringify(currentUser)
      );
    } else {
      sessionStorage.removeItem(
        SESSION_USER_KEY
      );
    }
  }, [currentUser]);

  // ================================================
  // ROUTE USER BASED ON ROLE
  // ================================================

  const routeUserToDashboard =
    useCallback((user) => {
      if (!user) {
        setCurrentPage("login");
        return;
      }

      if (user.role === "admin") {
        setCurrentPage(
          "admin-dashboard"
        );
        return;
      }

      if (
        user.role === "technician"
      ) {
        setCurrentPage(
          "technician-dashboard"
        );
        return;
      }

      setCurrentPage(
        "user-dashboard"
      );
    }, []);

  const goToDashboard = () => {
    routeUserToDashboard(
      currentUser
    );
  };

  // ================================================
  // LOGOUT
  // ================================================

  const handleLogout =
    useCallback(() => {
      sessionStorage.removeItem(
        SESSION_USER_KEY
      );

      setCurrentUser(null);
      setTickets([]);
      setCurrentPage("login");
      setLoginError("");
    }, []);

  // ================================================
  // 5 MINUTE INACTIVITY LOGOUT
  // ================================================

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const recordActivity = () => {
      lastActivityRef.current =
        Date.now();
    };

    // These events count as activity.
    const activityEvents = [
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    activityEvents.forEach(
      (eventName) => {
        window.addEventListener(
          eventName,
          recordActivity,
          {
            passive: true,
          }
        );
      }
    );

    // Start inactivity clock when logged in.
    lastActivityRef.current =
      Date.now();

    const inactivityChecker =
      setInterval(() => {
        const inactiveFor =
          Date.now() -
          lastActivityRef.current;

        if (
          inactiveFor >=
          INACTIVITY_LIMIT
        ) {
          handleLogout();
        }
      }, 1000);

    return () => {
      clearInterval(
        inactivityChecker
      );

      activityEvents.forEach(
        (eventName) => {
          window.removeEventListener(
            eventName,
            recordActivity
          );
        }
      );
    };
  }, [
    currentUser,
    handleLogout,
  ]);

  // ================================================
  // LOAD TICKETS FROM FASTAPI
  // ================================================

  const loadTickets =
    useCallback(
      async (
        showLoading = false
      ) => {
        if (
          !currentUser ||
          loadingRef.current
        ) {
          return;
        }

        loadingRef.current = true;

        if (showLoading) {
          setLoadingTickets(true);
        }

        try {
          const [
            ticketData,
            userData,
            categoryData,
          ] = await Promise.all([
            getTickets(),
            getUsers(),
            getCategories(),
          ]);

          const userMap = new Map(
            userData.map((user) => [
              user.user_id,
              user,
            ])
          );

          const categoryMap =
            new Map(
              categoryData.map(
                (category) => [
                  category.category_id,
                  category.category_name,
                ]
              )
            );

          const mappedTickets =
            await Promise.all(
              ticketData.map(
                async (ticket) => {
                  let commentData =
                    [];

                  try {
                    commentData =
                      await getComments(
                        ticket.ticket_id
                      );
                  } catch (error) {
                    console.error(
                      `Could not load comments for ticket ${ticket.ticket_id}:`,
                      error
                    );
                  }

                  const submitter =
                    userMap.get(
                      ticket.user_id
                    );

                  const technician =
                    ticket.tech_id
                      ? userMap.get(
                          ticket.tech_id
                        )
                      : null;

                  const mappedComments =
                    commentData.map(
                      (comment) => {
                        const author =
                          userMap.get(
                            comment.author_id
                          );

                        return {
                          id:
                            comment.comment_id,

                          userId:
                            comment.author_id,

                          author: author
                            ? `${author.first_name} ${author.last_name}`
                            : "Unknown User",

                          text:
                            comment.comment_text,

                          timestamp:
                            comment.created_at,
                        };
                      }
                    );

                  return {
                    id:
                      ticket.ticket_id,

                    userId:
                      ticket.user_id,

                    submittedBy:
                      submitter
                        ? `${submitter.first_name} ${submitter.last_name}`
                        : "Unknown User",

                    title:
                      ticket.title,

                    category:
                      categoryMap.get(
                        ticket.category_id
                      ) || "Unknown",

                    description:
                      ticket.description,

                    status:
                      ticket.status,

                    priorityDays:
                      ticket.priority,

                    technicianId:
                      ticket.tech_id,

                    technicianName:
                      technician
                        ? `${technician.first_name} ${technician.last_name}`
                        : null,

                    createdAt:
                      ticket.created_at,

                    dueAt:
                      ticket.due_date,

                    resolvedAt:
                      ticket.resolved_at,

                    comments:
                      mappedComments,
                  };
                }
              )
            );

          mappedTickets.sort(
            (a, b) =>
              new Date(
                b.createdAt
              ) -
              new Date(
                a.createdAt
              )
          );

          setTickets(
            mappedTickets
          );
        } catch (error) {
          console.error(
            "Unable to load tickets:",
            error
          );
        } finally {
          loadingRef.current =
            false;

          if (showLoading) {
            setLoadingTickets(
              false
            );
          }
        }
      },
      [currentUser]
    );

  // ================================================
  // INITIAL TICKET LOAD
  // ================================================

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    loadTickets(true);
  }, [
    currentUser,
    loadTickets,
  ]);

  // ================================================
  // AUTO REFRESH / MESSAGE POLLING
  // ================================================

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const refreshTimer =
      setInterval(() => {
        // Don't waste requests when the
        // browser tab isn't visible.
        if (
          document.visibilityState ===
          "visible"
        ) {
          loadTickets(false);
        }
      }, REFRESH_INTERVAL);

    // If they leave the tab and come back,
    // refresh immediately instead of waiting
    // for the next 3-second interval.
    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          loadTickets(false);
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      clearInterval(
        refreshTimer
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    currentUser,
    loadTickets,
  ]);

  // ================================================
  // LOGIN
  // ================================================

  const handleLogin = async (
    credentials
  ) => {
    try {
      setLoginError("");

      const response =
        await login(
          credentials.email.trim(),
          credentials.password
        );

      const loggedInUser =
        mapUser(
          response.user
        );

      setCurrentUser(
        loggedInUser
      );

      lastActivityRef.current =
        Date.now();

      sessionStorage.setItem(
        SESSION_USER_KEY,
        JSON.stringify(
          loggedInUser
        )
      );

      if (
        loggedInUser
          .mustChangePassword
      ) {
        setCurrentPage(
          "set-password"
        );
      } else {
        routeUserToDashboard(
          loggedInUser
        );
      }

      return {
        success: true,
      };
    } catch (error) {
      setLoginError(
        error.message
      );

      return {
        success: false,
        message:
          error.message,
      };
    }
  };

  // ================================================
  // FIRST LOGIN PASSWORD CHANGE
  // ================================================

  const handlePasswordSet =
    async (newPassword) => {
      if (!currentUser) {
        throw new Error(
          "No user is currently signed in."
        );
      }

      const response =
        await setPassword(
          currentUser.user_id,
          newPassword
        );

      const updatedUser =
        mapUser(response);

      setCurrentUser(
        updatedUser
      );

      sessionStorage.setItem(
        SESSION_USER_KEY,
        JSON.stringify(
          updatedUser
        )
      );

      lastActivityRef.current =
        Date.now();

      routeUserToDashboard(
        updatedUser
      );

      return true;
    };

  // ================================================
  // ADMIN - CREATE USER
  // ================================================

  const handleCreateUser =
    async (newUserData) => {
      if (
        !currentUser ||
        currentUser.role !==
          "admin"
      ) {
        throw new Error(
          "Only administrators can create users."
        );
      }

      const response =
        await createUser({
          first_name:
            newUserData.firstName.trim(),

          last_name:
            newUserData.lastName.trim(),

          email:
            newUserData.email
              .trim()
              .toLowerCase(),

          role:
            newUserData.role,

          temporary_password:
            newUserData.temporaryPassword,
        });

      return {
        ...mapUser(response),

        temporaryPassword:
          newUserData.temporaryPassword,
      };
    };

  // ================================================
  // EMPLOYEE - CREATE TICKET
  // ================================================

  const handleCreateTicket =
    async (ticketData) => {
      if (!currentUser) {
        throw new Error(
          "You must be signed in."
        );
      }

      await createTicket(
        ticketData
      );

      await loadTickets(false);

      routeUserToDashboard(
        currentUser
      );

      return true;
    };

  // ================================================
  // ADMIN - APPROVE
  // ================================================

  const handleApproveTicket =
    async (
      ticketId,
      priorityDays
    ) => {
      const days =
        Number(priorityDays);

      if (
        !Number.isInteger(days) ||
        days < 1 ||
        days > 30
      ) {
        throw new Error(
          "Priority must be between P1 and P30."
        );
      }

      await approveTicket(
        ticketId,
        days
      );

      await loadTickets(false);
    };

  // ================================================
  // ADMIN - REJECT
  // ================================================

  const handleRejectTicket =
    async (ticketId) => {
      await rejectTicket(
        ticketId
      );

      await loadTickets(false);
    };

  // ================================================
  // TECHNICIAN - GRAB TICKET
  // ================================================

  const handleGrabTicket =
    async (ticketId) => {
      if (
        !currentUser ||
        currentUser.role !==
          "technician"
      ) {
        return;
      }

      await claimTicket(
        ticketId,
        currentUser.user_id
      );

      await loadTickets(false);
    };

  // ================================================
  // COMMENTS / MESSAGES
  // ================================================

  const handleAddComment =
    async (
      ticketId,
      text
    ) => {
      if (!currentUser) {
        return;
      }

      const trimmedText =
        text.trim();

      if (!trimmedText) {
        return;
      }

      await createComment(
        ticketId,
        currentUser.user_id,
        trimmedText
      );

      // Refresh immediately for the sender.
      // The other user's browser will pick
      // it up on its next 3-second poll.
      await loadTickets(false);
    };

  // ================================================
  // TECHNICIAN - RESOLVE
  // ================================================

  const handleResolveTicket =
    async (ticketId) => {
      if (
        !currentUser ||
        currentUser.role !==
          "technician"
      ) {
        return;
      }

      await resolveTicket(
        ticketId,
        currentUser.user_id
      );

      await loadTickets(false);
    };

  // ================================================
  // LOGIN SCREEN
  // ================================================

  if (!currentUser) {
    return (
      <Login
        onLogin={handleLogin}
        loginError={
          loginError
        }
      />
    );
  }

  // ================================================
  // FORCE FIRST LOGIN PASSWORD CHANGE
  // ================================================

  if (
    currentUser
      .mustChangePassword ||
    currentPage ===
      "set-password"
  ) {
    return (
      <SetPassword
        user={currentUser}
        onPasswordSet={
          handlePasswordSet
        }
        onLogout={
          handleLogout
        }
      />
    );
  }

  // ================================================
  // CREATE USER - ADMIN ONLY
  // ================================================

  if (
    currentUser.role ===
      "admin" &&
    currentPage ===
      "create-user"
  ) {
    return (
      <CreateUser
        user={currentUser}
        onCreateUser={
          handleCreateUser
        }
        onDashboard={() =>
          setCurrentPage(
            "admin-dashboard"
          )
        }
        onLogout={
          handleLogout
        }
      />
    );
  }

  // ================================================
  // CREATE TICKET - EMPLOYEE ONLY
  // ================================================

  if (
    currentUser.role ===
      "employee" &&
    currentPage ===
      "create-ticket"
  ) {
    return (
      <CreateTicket
        user={currentUser}
        onSubmitTicket={
          handleCreateTicket
        }
        onDashboard={
          goToDashboard
        }
        onLogout={
          handleLogout
        }
      />
    );
  }

  // ================================================
  // ADMIN DASHBOARD
  // ================================================

  if (
    currentUser.role ===
    "admin"
  ) {
    return (
      <AdminDashboard
        user={currentUser}
        tickets={tickets}
        loading={
          loadingTickets
        }
        onApproveTicket={
          handleApproveTicket
        }
        onRejectTicket={
          handleRejectTicket
        }
        onAddComment={
          handleAddComment
        }
        onCreateUser={() =>
          setCurrentPage(
            "create-user"
          )
        }
        onLogout={
          handleLogout
        }
      />
    );
  }

  // ================================================
  // TECHNICIAN DASHBOARD
  // ================================================

  if (
    currentUser.role ===
    "technician"
  ) {
    return (
      <TechnicianDashboard
        user={currentUser}
        tickets={tickets}
        loading={
          loadingTickets
        }
        onGrabTicket={
          handleGrabTicket
        }
        onAddComment={
          handleAddComment
        }
        onResolveTicket={
          handleResolveTicket
        }
        onLogout={
          handleLogout
        }
      />
    );
  }

  // ================================================
  // EMPLOYEE DASHBOARD
  // ================================================

  return (
    <UserDashboard
      user={currentUser}
      tickets={tickets.filter(
        (ticket) =>
          ticket.userId ===
          currentUser.user_id
      )}
      loading={
        loadingTickets
      }
      onAddComment={
        handleAddComment
      }
      onCreateTicket={() =>
        setCurrentPage(
          "create-ticket"
        )
      }
      onLogout={
        handleLogout
      }
    />
  );
}