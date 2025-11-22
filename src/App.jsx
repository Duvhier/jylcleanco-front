// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componentes
import Navbar from "./components/Navbar/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Páginas
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Products from "./pages/Products/Products";
import Cart from "./pages/Cart/Cart";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import SuperUserDashboard from "./pages/SuperUserDashboard/SuperUserDashboard";
import AddProduct from "./pages/AddProduct/AddProduct";
import ManageProducts from "./pages/ManageProducts/ManageProducts";
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import Sales from "./pages/Sales/Sales";
import EditProduct from "./pages/EditProduct/EditProduct";

import Footer from "./components/Footer/Footer";

// ... existing imports

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <ToastContainer />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />

          {/* Rutas protegidas */}
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["Admin", "SuperUser"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/add-product"
            element={
              <PrivateRoute roles={["Admin", "SuperUser"]}>
                <AddProduct />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/manage-products"
            element={
              <PrivateRoute roles={["Admin", "SuperUser"]}>
                <ManageProducts />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/manage-users"
            element={
              <PrivateRoute roles={["Admin", "SuperUser"]}>
                <ManageUsers />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/sales"
            element={
              <PrivateRoute roles={["Admin", "SuperUser"]}>
                <Sales />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/edit-product/:productId"
            element={
              <PrivateRoute roles={["Admin", "SuperUser"]}>
                <EditProduct />
              </PrivateRoute>
            }
          />

          <Route
            path="/superuser"
            element={
              <PrivateRoute roles={["SuperUser"]}>
                <SuperUserDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;