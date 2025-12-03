// ========================= Register.jsx (WORLD-CLASS EDITION) =========================
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

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.length < 20 || form.name.length > 60)
      newErrors.name = "Name must be 20–60 characters.";
    if (!form.email.trim()) newErrors.email = "Valid email required.";
    if (!form.address.trim()) newErrors.address = "Address required.";
    if (!form.password.trim())
      newErrors.password = "Password required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setServerError("Registration failed.");
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
          {["name", "email", "address", "password"].map((field) => (
            <input
              key={field}
              name={field}
              type={field === "password" ? "password" : "text"}
              placeholder={field.toUpperCase()}
              value={form[field]}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary glow-btn text-white py-3 rounded-xl font-bold hover:scale-105 transition-all"
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
