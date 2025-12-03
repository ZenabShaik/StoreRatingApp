// ========================= Login.jsx (WORLD-CLASS SHOWSTOPPER EDITION) =========================
import { useContext, useState } from "react";
import api from "../utils/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      login(res.data.token, res.data.role, res.data.email);

      if (res.data.role === "admin") navigate("/dashboard");
      else if (res.data.role === "owner") navigate("/my-store");
      else navigate("/stores");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-surface px-4">
      <div className="w-full max-w-md bg-glass glass rounded-2xl shadow-glow p-10 card animate-fadeIn">

        {/* BRAND HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-dark tracking-tight">
            Store<span className="text-primary">Rating</span>
          </h1>
          <p className="text-sm text-secondary mt-2">
            Premium Store Experience Platform
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 text-sm text-danger bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-1">
              Email Address
            </label>
            <input
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-1">
              Password
            </label>
            <input
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CTA */}
          <button
            className="w-full bg-primary glow-btn text-white py-3 rounded-xl font-bold tracking-wide hover:scale-105 transition-all"
            type="submit"
          >
            Enter Platform
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center text-sm text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-bold hover:underline"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
