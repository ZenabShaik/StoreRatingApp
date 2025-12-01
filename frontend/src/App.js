import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import StoreList from "./components/StoreList";
import RatingForm from "./components/RatingForm";
import OwnerMyStore from "./components/OwnerMyStore";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import AdminUsers from "./components/AdminUsers";
import AdminStores from "./components/AdminStores";
import ChangePassword from "./components/ChangePassword";
import AdminUserDetail from "./components/AdminUserDetail";


function AppContent() {
  const location = useLocation();

  // Hide navbar on login & register pages
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowed={["admin", "user", "owner"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateRoute allowed={["admin"]}>
              <AdminUsers />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/stores"
          element={
            <PrivateRoute allowed={["admin"]}>
              <AdminStores />
            </PrivateRoute>
          }
        />

        <Route
  path="/admin/users/:id"
  element={
    <PrivateRoute allowed={["admin"]}>
      <AdminUserDetail />
    </PrivateRoute>
  }
/>


        <Route
          path="/stores"
          element={
            <PrivateRoute allowed={["user"]}>
              <StoreList />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-store"
          element={
            <PrivateRoute allowed={["owner"]}>
              <OwnerMyStore />
            </PrivateRoute>
          }
        />

        <Route
          path="/rate"
          element={
            <PrivateRoute allowed={["user"]}>
              <RatingForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <PrivateRoute allowed={["user", "owner"]}>
              <ChangePassword />
            </PrivateRoute>
          }
        />

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
