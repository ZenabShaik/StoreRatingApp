// ========================= Navbar.jsx (WORLD-CLASS EDITION) =========================
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-glass glass border-b border-slate-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-black text-primary">
          StoreRating
        </Link>

        {user && (
          <div className="hidden md:flex gap-8 font-semibold text-dark">
            {user.role === "admin" && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/stores">Stores</Link>
              </>
            )}
            {user.role === "owner" && <Link to="/my-store">My Store</Link>}
            {user.role === "user" && <Link to="/stores">Stores</Link>}
          </div>
        )}

        <div className="flex items-center gap-4">
          {user && (
            <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-black">
              {user.role.toUpperCase()}
            </span>
          )}

          {user && (user.role === "user" || user.role === "owner") && (
            <button
              onClick={() => navigate("/change-password")}
              className="bg-surface px-4 py-2 rounded-lg font-semibold"
            >
              Change Password
            </button>
          )}

          {user && (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="bg-danger text-white px-4 py-2 rounded-lg font-bold"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
