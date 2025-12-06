// ========================= Navbar.jsx (PREMIUM MOBILE + DESKTOP) =========================
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-glass glass border-b border-slate-200 shadow-soft backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">

        {/* ✅ BRAND */}
        <Link to="/" className="text-2xl font-black tracking-tight text-primary">
          Store<span className="text-dark">Rating</span>
        </Link>

        {/* ✅ DESKTOP NAV */}
        {user && (
          <div className="hidden md:flex gap-10 font-semibold text-dark">
            {user.role === "admin" && (
              <>
                <Link to="/dashboard" className="hover:text-primary transition">Dashboard</Link>
                <Link to="/admin/users" className="hover:text-primary transition">Users</Link>
                <Link to="/admin/stores" className="hover:text-primary transition">Stores</Link>
              </>
            )}
            {user.role === "owner" && (
              <Link to="/my-store" className="hover:text-primary transition">My Store</Link>
            )}
            {user.role === "user" && (
              <Link to="/stores" className="hover:text-primary transition">Stores</Link>
            )}
          </div>
        )}

        {/* ✅ RIGHT CONTROLS */}
        <div className="flex items-center gap-3">

          {/* Role Badge */}
          {user && (
            <span className="hidden md:inline bg-primary text-white px-4 py-1 rounded-full text-xs font-black tracking-wide">
              {user.role.toUpperCase()}
            </span>
          )}

          {/* Change Password */}
          {user && (user.role === "user" || user.role === "owner") && (
            <button
              onClick={() => navigate("/change-password")}
              className="hidden md:block bg-surface px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
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
              className="hidden md:block bg-danger text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
            >
              Logout
            </button>
          )}

          {/* ✅ HAMBURGER (MOBILE) */}
          {user && (
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-3xl font-black text-primary"
            >
              ☰
            </button>
          )}
        </div>
      </div>

      {/* ✅ ✅ ✅ MOBILE DRAWER */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-10">
          <div className="absolute right-0 top-0 h-full w-[75%] bg-glass glass shadow-2xl rounded-l-3xl p-6 flex flex-col gap-6 animate-fadeIn">

            {/* HEADER */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <p className="font-black text-primary tracking-wide">
                {user?.role?.toUpperCase()}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl font-bold text-dark"
              >
                ✕
              </button>
            </div>

            {/* LINKS */}
            <div className="flex flex-col gap-4 font-semibold text-lg">

              {user?.role === "admin" && (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                  <Link to="/admin/users" onClick={() => setOpen(false)}>Users</Link>
                  <Link to="/admin/stores" onClick={() => setOpen(false)}>Stores</Link>
                </>
              )}

              {user?.role === "owner" && (
                <>
                  <Link to="/my-store" onClick={() => setOpen(false)}>My Store</Link>
                  <Link to="/change-password" onClick={() => setOpen(false)}>Change Password</Link>
                </>
              )}

              {user?.role === "user" && (
                <>
                  <Link to="/stores" onClick={() => setOpen(false)}>Stores</Link>
                  <Link to="/change-password" onClick={() => setOpen(false)}>Change Password</Link>
                </>
              )}
            </div>

            {/* LOGOUT */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="mt-auto bg-danger text-white py-3 rounded-xl font-black hover:scale-105 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
