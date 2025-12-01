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
      const response = await axios.get("/stores");
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
      await axios.post("/ratings", {
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
      await axios.patch(`/ratings/${selectedStore}`, {
        rating,
      });

      setMessage("Rating updated successfully!");
    } catch (err) {
      setMessage("Failed to update rating.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Submit / Update Rating
        </h1>

        {/* STORE DROPDOWN */}
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        >
          <option value="">-- Choose a store --</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>

        {/* RATING DROPDOWN */}
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        >
          <option value="">-- Select rating (1–5) --</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Star{num > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <button
            onClick={handleSubmitRating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Rating
          </button>

          <button
            onClick={handleUpdateRating}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Update Rating
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-green-700 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
