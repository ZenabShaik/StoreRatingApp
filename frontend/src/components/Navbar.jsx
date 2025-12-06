// ========================= Navbar.jsx (FINAL VISIBILITY FIX) =========================
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
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/stores">Stores</Link>
              </>
            )}
            {user.role === "owner" && <Link to="/my-store">My Store</Link>}
            {user.role === "user" && <Link to="/stores">Stores</Link>}
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
              className="hidden md:block bg-surface px-4 py-2 rounded-lg font-semibold"
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
              className="hidden md:block bg-danger text-white px-4 py-2 rounded-lg font-bold"
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

      {/* ✅ ✅ ✅ SOLID BACKGROUND MOBILE DRAWER */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/70 z-50 flex justify-end">
          <div className="w-[85%] h-full bg-white shadow-2xl p-6 flex flex-col animate-fadeIn">

            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <p className="font-black tracking-widest text-primary text-sm">
                {user?.role?.toUpperCase()} PANEL
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl font-bold text-dark"
              >
                ✕
              </button>
            </div>

            {/* ✅ MENU TABS WITH SOLID BACKGROUND */}
            <div className="flex flex-col gap-4 font-semibold">

              {user?.role === "admin" && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="bg-primary text-white px-5 py-3 rounded-xl shadow"
                  >
                    📊 Dashboard
                  </Link>

                  <Link
                    to="/admin/users"
                    onClick={() => setOpen(false)}
                    className="bg-slate-100 text-dark px-5 py-3 rounded-xl shadow"
                  >
                    👤 Users
                  </Link>

                  <Link
                    to="/admin/stores"
                    onClick={() => setOpen(false)}
                    className="bg-slate-100 text-dark px-5 py-3 rounded-xl shadow"
                  >
                    🏬 Stores
                  </Link>
                </>
              )}

              {user?.role === "owner" && (
                <>
                  <Link
                    to="/my-store"
                    onClick={() => setOpen(false)}
                    className="bg-primary text-white px-5 py-3 rounded-xl shadow"
                  >
                    🏪 My Store
                  </Link>

                  <Link
                    to="/change-password"
                    onClick={() => setOpen(false)}
                    className="bg-slate-100 text-dark px-5 py-3 rounded-xl shadow"
                  >
                    🔐 Change Password
                  </Link>
                </>
              )}

              {user?.role === "user" && (
                <>
                  <Link
                    to="/stores"
                    onClick={() => setOpen(false)}
                    className="bg-primary text-white px-5 py-3 rounded-xl shadow"
                  >
                    ⭐ Stores
                  </Link>

                  <Link
                    to="/change-password"
                    onClick={() => setOpen(false)}
                    className="bg-slate-100 text-dark px-5 py-3 rounded-xl shadow"
                  >
                    🔐 Change Password
                  </Link>
                </>
              )}
            </div>

            {/* ✅ LOGOUT FIXED AT BOTTOM */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="mt-auto bg-danger text-white py-3 rounded-xl font-black shadow-lg"
            >
              Logout
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}
