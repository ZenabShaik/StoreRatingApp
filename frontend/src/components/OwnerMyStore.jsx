import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";

export default function OwnerMyStore() {
  const { user } = useAuth(); // contains {token, role}
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch ratings + average on page load
  useEffect(() => {
    fetchRatings();
    fetchAverage();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await axios.get("/owner/my-store");
      setRatings(response.data);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  const fetchAverage = async () => {
    try {
      const response = await axios.get("/owner/my-store/average");
      setAverage(response.data.average_rating);
    } catch (err) {
      console.error("Error fetching average rating:", err);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center p-8 text-xl">Loading store data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6">

        {/* Header */}
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          My Store Ratings
        </h1>

        {/* Average Rating */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-blue-800">
            ⭐ Average Rating: {average}
          </h2>
        </div>

        {/* Ratings List */}
        <h3 className="text-xl font-semibold mb-3">User Ratings</h3>

        {ratings.length === 0 ? (
          <p className="text-gray-500">No ratings received yet.</p>
        ) : (
          <div className="space-y-4">
            {ratings.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <p className="text-lg font-medium">
                  👤 {item.user_name}
                </p>
                <p className="text-yellow-700 font-bold">
                  ⭐ Rating: {item.rating}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
