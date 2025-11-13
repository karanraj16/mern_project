import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BoardsList from "./pages/BoardsList";
import BoardDetail from "./pages/BoardDetail";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { AuthContext } from "./context/AuthContext";

/* Protected layout: renders Navbar + Sidebar once around protected pages */
function ProtectedLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}

/* PrivateRoute checks if token (or user) exists in AuthContext (or localStorage fallback) */
function PrivateRoute({ children }) {
  const { token, user } = useContext(AuthContext);
  const isAuth = !!token || !!localStorage.getItem("token") || !!user;
  return isAuth ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected (wrapped in ProtectedLayout so Navbar+Sidebar render once) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                {/* placeholder children — Router will replace with nested routes */}
              </ProtectedLayout>
            </PrivateRoute>
          }
        >
          {/* The route above is only used to mount layout if you want nested routes.
              But React Router requires explicit routes for pages, so we'll also add them below. */}
        </Route>

        {/* Add protected routes individually (so they are accessible) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/boards"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <BoardsList />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/boards/:boardId"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <BoardDetail />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />

        {/* Fallback: send unknown routes to dashboard if logged in, otherwise login */}
        <Route
          path="*"
          element={
            !!localStorage.getItem("token") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
  );
}

export default App;
