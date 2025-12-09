// ========================= RatingForm.jsx (WORLD-CLASS EDITION) =========================
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function RatingForm() {
  const { user } = useAuth();

  const location = useLocation();
  const storeIdFromList = location.state?.storeId || null;

  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(storeIdFromList);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const response = await axios.get("/api/stores");
      setStores(response.data);
    } catch (err) {
      console.error("Error loading stores:", err);
    }
  };

  const handleSubmitRating = async () => {
    if (!selectedStore || !rating) {
      setMessage("Please select a store and rating.");
      return;
    }

    try {
      await axios.post("/api/ratings", {
        store_id: selectedStore,
        rating,
      });

      setMessage("Rating submitted successfully!");
    } catch (err) {
      if (err.response?.status === 400) {
        setMessage("You already submitted a rating. Try updating it.");
      } else {
        setMessage("Failed to submit rating.");
      }
    }
  };

  const handleUpdateRating = async () => {
    if (!selectedStore || !rating) {
      setMessage("Select store and rating first.");
      return;
    }

    try {
      await axios.patch(`/api/ratings/${selectedStore}`, {
        rating,
      });

      setMessage("Rating updated successfully!");
    } catch (err) {
      setMessage("Failed to update rating.");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-glass glass rounded-2xl shadow-glow p-10 card animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-secondary font-semibold mb-1">
            Feedback
          </p>
          <h1 className="text-3xl font-black text-dark">
            Submit / Update Rating
          </h1>
        </div>

        {/* Store Selector */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-dark mb-2">
            Select Store
          </label>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">-- Choose a store --</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-dark mb-2">
            Rating (1–5)
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">-- Select rating (1–5) --</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} Star{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <button
            onClick={handleSubmitRating}
            className="bg-primary glow-btn text-white py-3 rounded-xl font-bold hover:scale-105 transition-all"
          >
            Submit Rating
          </button>
          <button
            onClick={handleUpdateRating}
            className="bg-accent text-white py-3 rounded-xl font-bold hover:scale-105 transition-all"
          >
            Update Rating
          </button>
        </div>

        {/* Status */}
        {message && (
          <div className="mt-2 text-center text-sm font-semibold px-4 py-3 rounded-xl border bg-surface">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
