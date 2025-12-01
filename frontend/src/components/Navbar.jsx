import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Left: Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        StoreRating
      </Link>

      {/* Center Menu */}
      {user && (
        <div className="flex gap-6 text-sm">
          {user.role === "admin" && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/stores">Stores</Link>
            </>
          )}

          {user.role === "owner" && (
            <>
              <Link to="/my-store">My Store</Link>
            </>
          )}

          {user.role === "user" && (
            <>
              <Link to="/stores">Stores</Link>
            </>
          )}
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* 🔥 Show Role Badge */}
        {user && (
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold
            bg-purple-500">
            {user.role.toUpperCase()}
          </span>
        )}

        {/* 🔒 Only USER & OWNER see Change Password */}
        {user && (user.role === "user" || user.role === "owner") && (
          <button
            onClick={() => navigate("/change-password")}
            className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
          >
            Change Password
          </button>
        )}

        {/* 🔴 Logout for all roles */}
        {user && (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

