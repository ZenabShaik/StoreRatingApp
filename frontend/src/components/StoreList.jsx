// ========================= StoreList.jsx (WORLD-CLASS SHOWCASE EDITION) =========================
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

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get("/api/stores/user-list");
      setStores(response.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter((store) => {
    return (
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-lg font-semibold text-secondary">
          Loading premium stores...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* HERO HEADER */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-secondary font-semibold">
            Discover Experiences
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-dark mt-2">
            Explore Elite Stores
          </h1>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search by store name or location..."
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-glass glass shadow-soft focus:outline-none focus:ring-2 focus:ring-primary transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STORE GRID */}
        {filteredStores.length === 0 ? (
          <div className="bg-glass glass rounded-2xl shadow-soft p-12 text-center text-secondary card">
            No stores matched your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-glass glass rounded-2xl shadow-soft p-8 flex flex-col justify-between card"
              >
                {/* TOP */}
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-bold text-dark leading-tight">
                      {store.name}
                    </h2>

                    <span className="inline-flex items-center gap-1 bg-accent/10 text-accent font-black px-3 py-1 rounded-full text-xs">
                      ⭐ {store.average_rating}
                    </span>
                  </div>

                  <p className="text-sm text-secondary leading-relaxed line-clamp-3">
                    {store.address}
                  </p>

                  {store.user_rating && (
                    <div className="mt-4 text-sm text-dark font-semibold">
                      Your Rating:{" "}
                      <span className="text-accent font-black">
                        ⭐ {store.user_rating}
                      </span>
                    </div>
                  )}
                </div>

                {/* ACTION */}
                <div className="mt-8">
                  <button
                    className="w-full bg-primary glow-btn text-white py-3 rounded-xl font-bold tracking-wide hover:scale-105 transition-all"
                    onClick={() =>
                      navigate("/rate", { state: { storeId: store.id } })
                    }
                  >
                    {store.user_rating ? "Modify Rating" : "Rate This Store"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
