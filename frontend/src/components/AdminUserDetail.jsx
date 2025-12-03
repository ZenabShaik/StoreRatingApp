// ========================= AdminUserDetail.jsx (WORLD-CLASS EDITION) =========================
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../utils/axiosConfig";

export default function AdminUserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null); // { user, stores }
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
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-lg text-secondary">Loading user details...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center text-danger bg-rose-50 border border-rose-200 px-6 py-4 rounded-2xl shadow-soft">
          {error || "User not found"}
        </div>
      </div>
    );
  }

  const { user, stores } = data;

  return (
    <div className="min-h-screen bg-surface px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-secondary uppercase">
              Admin · User Profile
            </p>
            <h1 className="text-3xl font-black text-dark">
              {user.name}
            </h1>
          </div>

          <Link
            to="/admin/users"
            className="text-sm text-primary font-semibold hover:underline"
          >
            ← Back to Users
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-glass glass rounded-2xl shadow-soft p-8 card space-y-6">
          {/* Basic Info */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-secondary font-medium mb-1">Name</p>
                <p className="font-semibold text-dark break-words">
                  {user.name}
                </p>
              </div>
              <div>
                <p className="text-secondary font-medium mb-1">Email</p>
                <p className="text-dark break-words">{user.email}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-secondary font-medium mb-1">Address</p>
                <p className="text-dark">
                  {user.address || <span className="text-slate-400">—</span>}
                </p>
              </div>
              <div>
                <p className="text-secondary font-medium mb-1">Role</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-200 text-xs font-bold text-dark">
                  {user.role.toUpperCase()}
                </span>
              </div>
            </div>
          </section>

          {/* Owner-specific */}
          {user.role === "owner" && (
            <section className="pt-4 border-t border-slate-200">
              <h2 className="text-lg font-bold text-dark mb-4">
                Store & Rating Overview
              </h2>

              {(!stores || stores.length === 0) ? (
                <p className="text-sm text-secondary bg-surface border border-dashed border-slate-200 rounded-2xl px-4 py-3">
                  This owner does not have any linked stores yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className="rounded-2xl border border-slate-200 bg-surface shadow-soft p-4 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-sm text-dark">
                          {store.name}
                        </p>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-secondary">
                          ID: {store.id}
                        </span>
                      </div>

                      <p className="text-xs text-secondary">
                        Address:{" "}
                        <span className="text-dark">
                          {store.address || "—"}
                        </span>
                      </p>

                      <div className="mt-1">
                        <p className="text-xs text-secondary mb-1">
                          Average Rating
                        </p>
                        <p className="inline-flex items-center gap-1 text-sm font-bold text-accent bg-accent/10 rounded-full px-3 py-1">
                          {store.average_rating !== null &&
                          store.average_rating !== undefined
                            ? (
                              <>
                                <span>⭐</span>
                                <span>{store.average_rating}</span>
                              </>
                            )
                            : (
                              <span className="text-slate-400">
                                No ratings yet
                              </span>
                            )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
