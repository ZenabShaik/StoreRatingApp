// ========================= AdminUsers.jsx (WORLD-CLASS EDITION) =========================
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const sortData = (column) => {
    const order =
      column === sortColumn && sortOrder === "asc" ? "desc" : "asc";

    setSortColumn(column);
    setSortOrder(order);

    const sorted = [...users].sort((a, b) => {
      if (a[column] < b[column]) return order === "asc" ? -1 : 1;
      if (a[column] > b[column]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sorted);
  };

  const handleAddUser = async () => {
    try {
      await axios.post("/api/admin/add-user", newUser);
      setShowModal(false);
      setNewUser({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "user",
      });
      loadUsers();
    } catch (err) {
      console.error("Add user error:", err);
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.email + u.name + u.address + u.role)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
              User Management
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary glow-btn text-white px-5 py-2.5 rounded-xl font-semibold hover:scale-105 transition-all"
          >
            + Add User
          </button>
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search users by name, email, role..."
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
                {["id", "name", "email", "address", "role"].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 cursor-pointer select-none font-semibold text-dark"
                    onClick={() => sortData(col)}
                  >
                    {col.toUpperCase()}
                    {sortColumn === col &&
                      (sortOrder === "asc" ? " ▲" : " ▼")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3 font-semibold text-primary">
                    <Link to={`/admin/users/${u.id}`} className="hover:underline">
                      {u.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{u.address}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 capitalize">
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-glass glass w-full max-w-md rounded-2xl shadow-glow p-6 animate-fadeIn">
            <h2 className="text-xl font-black text-dark mb-4">
              Add New User
            </h2>

            {["name", "email", "address", "password"].map((f) => (
              <input
                key={f}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 mb-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={f.toUpperCase()}
                type={f === "password" ? "password" : "text"}
                value={newUser[f]}
                onChange={(e) =>
                  setNewUser({ ...newUser, [f]: e.target.value })
                }
              />
            ))}

            <select
              className="w-full border border-slate-300 px-3 py-2 rounded-xl mb-4 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleAddUser}
                className="flex-1 bg-primary glow-btn text-white py-2.5 rounded-xl font-semibold hover:scale-105 transition-all"
              >
                Save User
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
