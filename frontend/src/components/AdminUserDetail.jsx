import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../utils/axiosConfig";

export default function AdminUserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);   // { user, stores }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await axios.get(`/admin/users/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("User detail fetch error:", err);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg">
        Loading user details...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center text-red-600">
        {error || "User not found"}
      </div>
    );
  }

  const { user, stores } = data;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Header + back link */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">User Details</h1>
          <Link
            to="/admin/users"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Users
          </Link>
        </div>

        {/* Basic user info */}
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">
            Basic Information
          </h2>

          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {user.address || "—"}
            </p>
            <p>
              <span className="font-semibold">Role:</span>{" "}
              {user.role.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Owner-specific section */}
        {user.role === "owner" && (
          <div className="border rounded-lg p-4 bg-indigo-50">
            <h2 className="text-lg font-semibold mb-3">
              Store & Rating Overview
            </h2>

            {(!stores || stores.length === 0) ? (
              <p className="text-sm text-gray-600">
                This owner does not have any linked stores yet.
              </p>
            ) : (
              <div className="space-y-4">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="border rounded-md p-3 bg-white shadow-sm"
                  >
                    <p className="font-semibold text-sm mb-1">
                      Store: {store.name}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      Address: {store.address || "—"}
                    </p>
                    <p className="text-sm">
                      Average Rating:{" "}
                      <span className="font-bold text-yellow-600">
                        {store.average_rating !== null &&
                        store.average_rating !== undefined
                          ? `⭐ ${store.average_rating}`
                          : "No ratings yet"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
