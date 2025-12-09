import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [ownerData, setOwnerData] = useState({ avg: 0, ratings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") loadAdminStats();
    if (user.role === "owner") loadOwnerMetrics();

    setLoading(false);
  }, [user]);

  const loadAdminStats = async () => {
    const res = await axios.get("/api/admin/dashboard");
    setStats(res.data);
  };

  const loadOwnerMetrics = async () => {
    const avgRes = await axios.get("/api/owner/my-store/average");
    const ratingRes = await axios.get("/api/owner/my-store");

    setOwnerData({
      avg: avgRes.data.average_rating,
      ratings: ratingRes.data,
    });
  };

  if (!user) {
    return <div className="p-10 text-center text-xl">Not logged in</div>;
  }

  if (loading) {
    return <div className="p-10 text-center text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-surface p-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <p className="text-sm uppercase tracking-widest text-secondary font-semibold">
            Control Center
          </p>
          <h1 className="text-4xl font-black text-dark">
            Welcome,{" "}
            <span className="text-primary">{user.role.toUpperCase()}</span>
          </h1>
        </div>

        {/* ADMIN VIEW */}
        {user.role === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Total Users", value: stats.users },
              { label: "Total Stores", value: stats.stores },
              { label: "Total Ratings", value: stats.ratings },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-glass glass rounded-2xl shadow-glow p-8 text-center card"
              >
                <p className="text-sm text-secondary mb-2">{item.label}</p>
                <p className="text-5xl font-black text-primary">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* USER VIEW */}
        {user.role === "user" && (
          <div className="bg-glass glass rounded-2xl shadow-glow p-12 text-center card">
            <h2 className="text-3xl font-bold text-dark mb-3">User Hub</h2>
            <p className="text-secondary mb-6">
              Browse stores and drop your ratings.
            </p>

            <Link
              to="/stores"
              className="bg-primary glow-btn text-white px-10 py-4 rounded-xl font-semibold hover:scale-105 transition-all"
            >
              Explore Stores
            </Link>
          </div>
        )}

        {/* OWNER VIEW */}
        {user.role === "owner" && (
          <>
            <div className="bg-glass glass rounded-2xl shadow-glow p-12 text-center card">
              <p className="text-secondary mb-2">Average Rating</p>
              <p className="text-6xl font-black text-accent">
                ⭐ {ownerData.avg}
              </p>
            </div>

            <div className="bg-glass glass rounded-2xl shadow-soft p-8 card">
              <h2 className="text-2xl font-bold text-dark mb-6">
                Recent Feedback
              </h2>

              {ownerData.ratings.length === 0 ? (
                <p className="text-secondary text-center">
                  No ratings received yet.
                </p>
              ) : (
                <ul className="space-y-4">
                  {ownerData.ratings.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between bg-surface p-5 rounded-xl shadow-soft"
                    >
                      <span className="font-semibold text-dark">
                        {item.user_name}
                      </span>
                      <span className="font-bold text-accent">
                        ⭐ {item.rating}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
