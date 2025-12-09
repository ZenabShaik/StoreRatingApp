// ========================= AdminStores.jsx (WORLD-CLASS EDITION) =========================
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");

  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [showModal, setShowModal] = useState(false);

  const [newStore, setNewStore] = useState({
    name: "",
    storeEmail: "",
    address: "",
    ownerId: "",
  });

  useEffect(() => {
    loadStores();
    loadOwners();
  }, []);

  const loadStores = async () => {
    try {
      const res = await axios.get("/api/admin/stores");
      setStores(res.data);
    } catch (err) {
      console.error("Error loading stores:", err);
    }
  };

  const loadOwners = async () => {
    try {
      const res = await axios.get("/api/admin/owners");
      setOwners(res.data);
    } catch (err) {
      console.error("Error loading owners:", err);
    }
  };

  const sortData = (column) => {
    const order =
      column === sortColumn && sortOrder === "asc" ? "desc" : "asc";

    setSortColumn(column);
    setSortOrder(order);

    const sorted = [...stores].sort((a, b) => {
      if (a[column] < b[column]) return order === "asc" ? -1 : 1;
      if (a[column] > b[column]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setStores(sorted);
  };

  const filteredStores = stores.filter((s) =>
    (s.name + s.store_email + s.owner_email + s.address)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleAddStore = async () => {
    if (!newStore.name || !newStore.storeEmail || !newStore.ownerId) {
      alert("Store Name, Store Email & Owner are required");
      return;
    }

    try {
      await axios.post("/api/admin/add-store", {
        name: newStore.name,
        storeEmail: newStore.storeEmail,
        address: newStore.address,
        ownerId: newStore.ownerId,
      });

      setShowModal(false);
      setNewStore({
        name: "",
        storeEmail: "",
        address: "",
        ownerId: "",
      });

      loadStores();
    } catch (err) {
      console.error("Add store error:", err);
      alert(err.response?.data?.message || "Failed to add store");
    }
  };

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-7xl mx-auto bg-glass glass rounded-2xl shadow-soft p-8 card">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-secondary font-semibold">
              Admin
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-dark">
              Store Management
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-success glow-btn text-white px-5 py-2.5 rounded-xl font-semibold hover:scale-105 transition-all"
          >
            + Add Store
          </button>
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search stores by name, email, address..."
            className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-surface">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100">
              <tr>
                {["id", "name", "store_email", "address", "average_rating"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 cursor-pointer select-none font-semibold text-dark"
                      onClick={() => sortData(col)}
                    >
                      {col.replace("_", " ").toUpperCase()}
                      {sortColumn === col &&
                        (sortOrder === "asc" ? " ▲" : " ▼")}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">{s.id}</td>
                  <td className="px-4 py-3 font-semibold text-dark">
                    {s.name}
                  </td>
                  <td className="px-4 py-3">{s.store_email}</td>
                  <td className="px-4 py-3">{s.address}</td>
                  <td className="px-4 py-3 font-bold text-accent">
                    {s.average_rating !== null &&
                    s.average_rating !== undefined
                      ? `⭐ ${s.average_rating}`
                      : "No ratings"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Store Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-glass glass w-full max-w-md rounded-2xl shadow-glow p-6 animate-fadeIn">
            <h2 className="text-xl font-black text-dark mb-4">
              Add New Store
            </h2>

            <input
              className="w-full border border-slate-300 rounded-xl px-3 py-2 mb-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) =>
                setNewStore({ ...newStore, name: e.target.value })
              }
            />

            <input
              type="email"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 mb-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Store Email"
              value={newStore.storeEmail}
              onChange={(e) =>
                setNewStore({ ...newStore, storeEmail: e.target.value })
              }
            />

            <input
              className="w-full border border-slate-300 rounded-xl px-3 py-2 mb-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Store Address"
              value={newStore.address}
              onChange={(e) =>
                setNewStore({ ...newStore, address: e.target.value })
              }
            />

            <select
              className="w-full border border-slate-300 rounded-xl px-3 py-2 mb-4 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              value={newStore.ownerId}
              onChange={(e) =>
                setNewStore({ ...newStore, ownerId: e.target.value })
              }
            >
              <option value="">Select Store Owner</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleAddStore}
                className="flex-1 bg-success text-white py-2.5 rounded-xl font-semibold hover:scale-105 transition-all"
              >
                Add Store
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-300 py-2.5 rounded-xl font-semibold bg-surface"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
