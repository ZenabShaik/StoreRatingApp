// ========================= OwnerMyStore.jsx (WORLD-CLASS EDITION) =========================
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";

export default function OwnerMyStore() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
    fetchAverage();
  }, []);

  const fetchRatings = async () => {
    const response = await axios.get("/owner/my-store");
    setRatings(response.data);
  };

  const fetchAverage = async () => {
    const response = await axios.get("/owner/my-store/average");
    setAverage(response.data.average_rating);
    setLoading(false);
  };

  if (loading)
    return <div className="p-10 text-center text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-surface p-10">
      <div className="max-w-5xl mx-auto space-y-10">

        <div className="bg-glass glass rounded-2xl shadow-glow p-10 text-center card">
          <p className="text-secondary mb-2">Average Store Rating</p>
          <p className="text-6xl font-black text-accent">⭐ {average}</p>
        </div>

        <div className="bg-glass glass rounded-2xl shadow-soft p-8 card">
          <h2 className="text-2xl font-black text-dark mb-6">
            Customer Feedback
          </h2>

          {ratings.length === 0 ? (
            <p className="text-secondary text-center">
              No ratings received yet.
            </p>
          ) : (
            <div className="space-y-4">
              {ratings.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between bg-surface p-4 rounded-xl shadow-soft"
                >
                  <span className="font-bold">{item.user_name}</span>
                  <span className="font-black text-accent">
                    ⭐ {item.rating}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
