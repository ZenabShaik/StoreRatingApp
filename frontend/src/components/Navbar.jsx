// ========================= Navbar.jsx (OUTSTANDING MOBILE UI FIXED) =========================
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
          {user && (
            <span className="hidden md:inline bg-primary text-white px-4 py-1 rounded-full text-xs font-black tracking-wide">
              {user.role.toUpperCase()}
            </span>
          )}

          {user && (user.role === "user" || user.role === "owner") && (
            <button
              onClick={() => navigate("/change-password")}
              className="hidden md:block bg-surface px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
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
              className="hidden md:block bg-danger text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
            >
              Logout
            </button>
          )}

          {/* ✅ HAMBURGER */}
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

      {/* ✅ ✅ ✅ PREMIUM HIGH-CONTRAST MOBILE DRAWER */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="w-[80%] h-full bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-2xl p-6 flex flex-col animate-fadeIn">

            {/* HEADER */}
            <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-6">
              <p className="font-black tracking-widest text-sm">
                {user?.role?.toUpperCase()} PANEL
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* LINKS */}
            <div className="flex flex-col gap-5 text-lg font-semibold">

              {user?.role === "admin" && (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="hover:underline">📊 Dashboard</Link>
                  <Link to="/admin/users" onClick={() => setOpen(false)} className="hover:underline">👤 Users</Link>
                  <Link to="/admin/stores" onClick={() => setOpen(false)} className="hover:underline">🏬 Stores</Link>
                </>
              )}

              {user?.role === "owner" && (
                <>
                  <Link to="/my-store" onClick={() => setOpen(false)} className="hover:underline">🏪 My Store</Link>
                  <Link to="/change-password" onClick={() => setOpen(false)} className="hover:underline">🔐 Change Password</Link>
                </>
              )}

              {user?.role === "user" && (
                <>
                  <Link to="/stores" onClick={() => setOpen(false)} className="hover:underline">⭐ Stores</Link>
                  <Link to="/change-password" onClick={() => setOpen(false)} className="hover:underline">🔐 Change Password</Link>
                </>
              )}
            </div>

            {/* LOGOUT */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="mt-auto bg-red-500 hover:bg-red-600 py-3 rounded-xl font-black transition"
            >
              Logout
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}
