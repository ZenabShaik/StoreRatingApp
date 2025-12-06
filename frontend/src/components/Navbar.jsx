// ========================= Navbar.jsx (MOBILE-RESPONSIVE FIXED EDITION) =========================
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-glass glass border-b border-slate-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* BRAND */}
        <Link to="/" className="text-2xl font-black text-primary">
          StoreRating
        </Link>

        {/* DESKTOP MENU */}
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* Role Badge */}
          {user && (
            <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-black hidden md:inline">
              {user.role.toUpperCase()}
            </span>
          )}

          {/* Change Password */}
          {user && (user.role === "user" || user.role === "owner") && (
            <button
              onClick={() => navigate("/change-password")}
              className="bg-surface px-4 py-2 rounded-lg font-semibold hidden md:block"
            >
              Change Password
            </button>
          )}

          {/* Desktop Logout */}
          {user && (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="bg-danger text-white px-4 py-2 rounded-lg font-bold hidden md:block"
            >
              Logout
            </button>
          )}

          {/* ✅ MOBILE HAMBURGER */}
          {user && (
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-3xl font-bold"
            >
              ☰
            </button>
          )}
        </div>
      </div>

      {/* ✅ ✅ ✅ MOBILE SLIDE MENU */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40">
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-6 flex flex-col gap-6">

            <div className="flex justify-between items-center">
              <span className="font-black text-primary">
                {user?.role?.toUpperCase()}
              </span>
              <button onClick={() => setOpen(false)} className="text-xl">✕</button>
            </div>

            {/* ADMIN LINKS */}
            {user?.role === "admin" && (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                <Link to="/admin/users" onClick={() => setOpen(false)}>Users</Link>
                <Link to="/admin/stores" onClick={() => setOpen(false)}>Stores</Link>
              </>
            )}

            {/* OWNER */}
            {user?.role === "owner" && (
              <>
                <Link to="/my-store" onClick={() => setOpen(false)}>My Store</Link>
                <Link to="/change-password" onClick={() => setOpen(false)}>Change Password</Link>
              </>
            )}

            {/* USER */}
            {user?.role === "user" && (
              <>
                <Link to="/stores" onClick={() => setOpen(false)}>Stores</Link>
                <Link to="/change-password" onClick={() => setOpen(false)}>Change Password</Link>
              </>
            )}

            {/* LOGOUT */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="bg-danger text-white py-2 rounded-lg font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
