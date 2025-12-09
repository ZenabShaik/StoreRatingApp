// ========================= Register.jsx (UPDATED & SAFE) =========================
import React, { useState } from "react";
import api from "../utils/axiosConfig";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ UPDATED VALIDATION (3–60 for name + visible errors)
  const validate = () => {
    const newErrors = {};

    // ✅ NAME: 3–20 characters
    if (!form.name.trim() || form.name.length < 3 || form.name.length > 20) {
      newErrors.name = "Name must be between 3 and 20 characters.";
    }

    // ✅ EMAIL
    if (!form.email.trim()) {
      newErrors.email = "Valid email required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Enter a valid email address.";
      }
    }

    // ✅ ADDRESS
    if (!form.address.trim()) {
      newErrors.address = "Address required.";
    }

    // ✅ PASSWORD
    if (!form.password.trim()) {
      newErrors.password = "Password required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await api.post("/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      setServerError(
        err?.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-surface px-4">
      <div className="w-full max-w-md bg-glass glass rounded-2xl shadow-glow p-10 card animate-fadeIn">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-dark">
            Create <span className="text-primary">Account</span>
          </h1>
          <p className="text-sm text-secondary mt-2">
            Join the premium store ecosystem
          </p>
        </div>

        {serverError && (
          <div className="mb-4 text-sm text-danger bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <input
              name="name"
              type="text"
              placeholder="NAME"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="EMAIL"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <input
              name="address"
              type="text"
              placeholder="ADDRESS"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1">{errors.address}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              placeholder="PASSWORD"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary glow-btn text-white py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
