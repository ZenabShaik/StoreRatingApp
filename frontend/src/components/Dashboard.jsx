import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    ratings: 0,
  });

  const [ownerData, setOwnerData] = useState({
    avg: 0,
    ratings: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (user.role === "admin") {
      loadAdminStats();
    }
    if (user.role === "owner") {
      loadOwnerMetrics();
    }

    setLoading(false);
  }, [user]);

  const loadAdminStats = async () => {
    try {
      const res = await axios.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error("Admin dashboard error:", err);
    }
  };

  const loadOwnerMetrics = async () => {
    try {
      const avgRes = await axios.get("/owner/my-store/average");
      const ratingRes = await axios.get("/owner/my-store");

      setOwnerData({
        avg: avgRes.data.average_rating,
        ratings: ratingRes.data,
      });
    } catch (err) {
      console.error("Owner data error:", err);
    }
  };

  if (!user) {
    return <div className="p-6 text-center text-xl">Not logged in</div>;
  }

  if (loading) {
    return <div className="p-6 text-center text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6">
        Welcome,{" "}
        <span className="text-blue-600">{user.role.toUpperCase()}</span>
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">

        {/* ADMIN VIEW */}
        {user.role === "admin" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-100 p-4 rounded-lg text-center shadow">
                <h2 className="text-lg font-semibold">Total Users</h2>
                <p className="text-3xl font-bold text-blue-700">{stats.users}</p>
              </div>

              <div className="bg-green-100 p-4 rounded-lg text-center shadow">
                <h2 className="text-lg font-semibold">Total Stores</h2>
                <p className="text-3xl font-bold text-green-700">
                  {stats.stores}
                </p>
              </div>

              <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
                <h2 className="text-lg font-semibold">Total Ratings</h2>
                <p className="text-3xl font-bold text-yellow-700">
                  {stats.ratings}
                </p>
              </div>
            </div>
          </>
        )}

        {/* USER VIEW */}
        {user.role === "user" && (
          <div className="text-center mt-8">
            <h2 className="text-xl font-semibold">User Panel</h2>
            <p className="text-gray-600">Browse stores and submit ratings.</p>

            <Link
              to="/stores"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              View Stores
            </Link>
          </div>
        )}

        {/* OWNER VIEW */}
        {user.role === "owner" && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Store Overview</h2>

            <div className="bg-yellow-100 p-6 rounded-lg text-center shadow mb-6">
              <p className="text-gray-700 text-lg font-medium">
                Average Rating
              </p>
              <p className="text-5xl font-bold text-yellow-600">
                ⭐ {ownerData.avg}
              </p>
            </div>

            <h2 className="text-xl font-semibold mb-4">Ratings Received</h2>

            {ownerData.ratings.length === 0 ? (
              <p className="text-gray-600">No ratings received yet.</p>
            ) : (
              <ul className="space-y-3">
                {ownerData.ratings.map((item) => (
                  <li
                    key={item.id}
                    className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between"
                  >
                    <span className="font-medium">{item.user_name}</span>
                    <span className="font-bold text-yellow-500">
                      ⭐ {item.rating}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
