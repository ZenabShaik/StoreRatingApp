// src/components/ChangePassword.jsx
import React, { useState } from "react";
import api from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const { role } = useAuth(); // not strictly needed, but nice for UI
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
        "New password must be 8–16 chars, include at least one uppercase letter and one special character."
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-1">
          Change Password
        </h1>
        {role && (
          <p className="text-center text-sm text-gray-500 mb-4 uppercase">
            Role: {role}
          </p>
        )}

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8–16 chars, 1 uppercase, 1 special"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={confirmNew}
              onChange={(e) => setConfirmNew(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-500">
          Password must be 8–16 characters and include at least one uppercase
          letter and one special character.
        </p>
      </div>
    </div>
  );
}
