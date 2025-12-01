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
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  // Sorting logic
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

  // Add user
  const handleAddUser = async () => {
    try {
      await axios.post("/admin/add-user", newUser);
      setShowModal(false);
      loadUsers();
    } catch (err) {
      console.error("Add user error:", err);
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) =>
    (u.email + u.name + u.address + u.role)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Users</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search users..."
        className="border p-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* User Table */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            {["id", "name", "email", "address", "role"].map((col) => (
              <th
                key={col}
                className="border p-2 cursor-pointer select-none"
                onClick={() => sortData(col)}
              >
                {col.toUpperCase()}
                {sortColumn === col && (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              {/* ID */}
              <td className="border p-2">{u.id}</td>

              {/* NAME → CLICKABLE */}
              <td className="border p-2">
                <Link
                  to={`/admin/users/${u.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {u.name}
                </Link>
              </td>

              {/* Email */}
              <td className="border p-2">{u.email}</td>

              {/* Address */}
              <td className="border p-2">{u.address}</td>

              {/* Role */}
              <td className="border p-2 capitalize">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>

            {["name", "email", "address", "password"].map((f) => (
              <input
                key={f}
                className="w-full border p-2 mb-2 rounded"
                placeholder={f.toUpperCase()}
                type={f === "password" ? "password" : "text"}
                value={newUser[f]}
                onChange={(e) =>
                  setNewUser({ ...newUser, [f]: e.target.value })
                }
              />
            ))}

            <select
              className="w-full border p-2 rounded mb-3"
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={handleAddUser}
              className="bg-blue-600 text-white w-full py-2 rounded mb-2"
            >
              Add User
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
