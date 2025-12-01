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
      const res = await axios.get("/admin/stores");
      setStores(res.data);
    } catch (err) {
      console.error("Error loading stores:", err);
    }
  };

  const loadOwners = async () => {
    try {
      const res = await axios.get("/admin/owners");
      setOwners(res.data);
    } catch (err) {
      console.error("Error loading owners:", err);
    }
  };

  // ✅ Sorting (All Columns)
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

  // ✅ Search Filter
  const filteredStores = stores.filter((s) =>
    (s.name + s.store_email + s.owner_email + s.address)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ✅ Add Store (Fully Document Compliant)
  const handleAddStore = async () => {
    if (!newStore.name || !newStore.storeEmail || !newStore.ownerId) {
      alert("Store Name, Store Email & Owner are required");
      return;
    }

    try {
      await axios.post("/admin/add-store", {
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
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Stores</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Add Store
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search stores..."
        className="border p-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ✅ Table Now Matches Document Exactly */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            {["id", "name", "store_email", "address", "average_rating"].map(
              (col) => (
                <th
                  key={col}
                  className="border p-2 cursor-pointer select-none"
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
            <tr key={s.id}>
              <td className="border p-2">{s.id}</td>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.store_email}</td>
              <td className="border p-2">{s.address}</td>
              <td className="border p-2">{s.average_rating}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Add Store Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Store</h2>

            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) =>
                setNewStore({ ...newStore, name: e.target.value })
              }
            />

            <input
              type="email"
              className="w-full border p-2 mb-2 rounded"
              placeholder="Store Email"
              value={newStore.storeEmail}
              onChange={(e) =>
                setNewStore({ ...newStore, storeEmail: e.target.value })
              }
            />

            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="Store Address"
              value={newStore.address}
              onChange={(e) =>
                setNewStore({ ...newStore, address: e.target.value })
              }
            />

            <select
              className="w-full border p-2 rounded mb-3"
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

            <button
              onClick={handleAddStore}
              className="bg-green-600 text-white w-full py-2 rounded mb-2"
            >
              Add Store
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
