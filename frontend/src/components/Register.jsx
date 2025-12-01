// src/components/Register.jsx
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

  // ---------- Validators ----------
  const validate = () => {
    const newErrors = {};

    // Name: 20–60 chars
    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (form.name.trim().length < 20 || form.name.trim().length > 60) {
      newErrors.name = "Name must be between 20 and 60 characters.";
    }

    // Email: basic pattern
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    // Address: required, max 400 chars
    if (!form.address.trim()) {
      newErrors.address = "Address is required.";
    } else if (form.address.trim().length > 400) {
      newErrors.address = "Address cannot be more than 400 characters.";
    }

    // Password rules
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else {
      if (form.password.length < 8 || form.password.length > 16) {
        newErrors.password =
          "Password must be between 8 and 16 characters long.";
      } else {
        const upper = /[A-Z]/;
        const lower = /[a-z]/;
        const digit = /\d/;
        const special = /[^A-Za-z0-9]/;

        if (!upper.test(form.password)) {
          newErrors.password = "Password must contain at least 1 uppercase letter.";
        } else if (!lower.test(form.password)) {
          newErrors.password = "Password must contain at least 1 lowercase letter.";
        } else if (!digit.test(form.password)) {
          newErrors.password = "Password must contain at least 1 number.";
        } else if (!special.test(form.password)) {
          newErrors.password =
            "Password must contain at least 1 special character.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Handlers ----------
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
      setServerError("");

      await api.post("/auth/register", form);

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setServerError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-blue-700">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Fill in your details to register as a user.
        </p>

        {serverError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name (20–60 characters)
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address (max 400 characters)
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                errors.address
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
              rows={3}
              placeholder="Enter your full address"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">{errors.address}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password (8–16 chars, upper, lower, number, special)
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
              placeholder="Create a strong password"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
