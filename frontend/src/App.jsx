import { useState } from "react";

import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import UserDashboard from "./pages/UserDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTicket from "./pages/CreateTicket";
import CreateUser from "./pages/CreateUser";

/*
  Temporary users for frontend testing.

  Later, FastAPI + MySQL will replace this.
*/
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

  /*
    Test account for the first-login password flow.
  */
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

function App() {
  const [users, setUsers] = useState(INITIAL_USERS);

  const [currentUser, setCurrentUser] = useState(null);

  const [currentPage, setCurrentPage] = useState("login");

  const [loginError, setLoginError] = useState("");

  /*
    LOGIN
  */
  const handleLogin = ({ email, password }) => {
    const user = users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (!user) {
      setLoginError("Invalid email or password.");
      return;
    }

    setLoginError("");
    setCurrentUser(user);

    if (user.mustChangePassword) {
      setCurrentPage("set-password");
      return;
    }

    goToDashboard(user);
  };

  /*
    SEND USER TO THE CORRECT DASHBOARD
  */
  const goToDashboard = (user = currentUser) => {
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

  /*
    FIRST LOGIN PASSWORD CHANGE
  */
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
        user.user_id === updatedUser.user_id
          ? updatedUser
          : user
      )
    );

    setCurrentUser(updatedUser);

    goToDashboard(updatedUser);
  };

  /*
    LOGOUT
  */
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("login");
    setLoginError("");
  };

  /*
    LOGIN PAGE
  */
  if (!currentUser || currentPage === "login") {
    return (
      <>
        <Login onLogin={handleLogin} />

        {loginError && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-rose-500/30 bg-slate-900 px-5 py-3 text-sm text-rose-400 shadow-2xl">
            {loginError}
          </div>
        )}
      </>
    );
  }

  /*
    FIRST LOGIN / SET PASSWORD
  */
  if (currentPage === "set-password") {
    return (
      <SetPassword
        user={currentUser}
        onPasswordSet={handlePasswordSet}
      />
    );
  }

  /*
    CREATE TICKET
  */
  if (currentPage === "create-ticket") {
    return (
      <CreateTicket
        user={currentUser}
        onDashboard={() => goToDashboard()}
        onLogout={handleLogout}
      />
    );
  }

  /*
    CREATE USER
  */
  if (currentPage === "create-user") {
    return (
      <CreateUser
        user={currentUser}
        onDashboard={() => goToDashboard()}
        onLogout={handleLogout}
      />
    );
  }

  /*
    ADMIN DASHBOARD
  */
  if (currentPage === "admin-dashboard") {
    return (
      <AdminDashboard
        user={currentUser}
        onCreateTicket={() => setCurrentPage("create-ticket")}
        onCreateUser={() => setCurrentPage("create-user")}
        onLogout={handleLogout}
      />
    );
  }

  /*
    TECHNICIAN DASHBOARD
  */
  if (currentPage === "technician-dashboard") {
    return (
      <TechnicianDashboard
        user={currentUser}
        technicianName={`${currentUser.firstName} ${currentUser.lastName}`}
        onCreateTicket={() => setCurrentPage("create-ticket")}
        onLogout={handleLogout}
      />
    );
  }

  /*
    EMPLOYEE DASHBOARD
  */
  return (
    <UserDashboard
      user={currentUser}
      onCreateTicket={() => setCurrentPage("create-ticket")}
      onLogout={handleLogout}
    />
  );
}

export default App;