import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StoreList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch stores when page loads
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get("/stores/user-list");  // FIXED
      setStores(response.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      setLoading(false); // IMPORTANT
    }
  };

  // Search filter
  const filteredStores = stores.filter((store) => {
    return (
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return <div className="text-center p-8 text-xl">Loading stores...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Store List</h1>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search by name or address..."
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* STORE LIST */}
        {filteredStores.length === 0 ? (
          <p className="text-gray-500 text-center">No stores found.</p>
        ) : (
          <div className="space-y-4">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="p-4 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold">{store.name}</h2>
                <p className="text-gray-600">{store.address}</p>

                <div className="flex justify-between mt-3">
                  <span className="text-yellow-600 font-bold">
                    ⭐ {store.average_rating}
                  </span>

                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    onClick={() =>
                      navigate("/rate", { state: { storeId: store.id } })
                    }
                  >
                    {store.user_rating ? "Modify Rating" : "Rate Store"}
                  </button>
                </div>

                {/* YOUR RATING DISPLAY */}
                {store.user_rating && (
                  <p className="mt-2 text-sm text-gray-700">
                    Your Rating: ⭐ {store.user_rating}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
