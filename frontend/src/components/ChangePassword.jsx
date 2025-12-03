// ========================= ChangePassword.jsx (WORLD-CLASS EDITION) =========================
import React, { useState } from "react";
import api from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const { role } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    // 8–16 chars, at least 1 uppercase, 1 special char
    const regex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmNew) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmNew) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be 8–16 characters, include at least one uppercase letter and one special character."
      );
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      setSuccess(res.data.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNew("");
    } catch (err) {
      console.error("Update password error:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to update password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-glass glass rounded-2xl shadow-glow p-10 card animate-fadeIn">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-widest text-secondary font-semibold mb-1">
            Security Center
          </p>
          <h1 className="text-3xl font-black text-dark">
            Change Password
          </h1>
          {role && (
            <p className="mt-1 text-xs text-secondary">
              Role: <span className="font-semibold">{role}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="mb-3 text-sm text-danger bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 text-sm text-success bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8–16 chars, 1 uppercase, 1 special"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              value={confirmNew}
              onChange={(e) => setConfirmNew(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary glow-btn text-white py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="mt-4 text-xs text-secondary text-center">
          Password must be 8–16 characters and include at least one uppercase
          letter and one special character.
        </p>
      </div>
    </div>
  );
}

