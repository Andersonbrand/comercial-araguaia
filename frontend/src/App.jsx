import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Layout from "./components/Layout/Layout"
import ProtectedRoute from "./components/Routes/ProtectedRoute"
import AdminRoute from "./components/Routes/AdminRoute"

import Home from "./pages/Home/Home"
import Products from "./pages/Products/Products"
import ProductDetail from "./pages/Products/ProductDetail"
import Cart from "./pages/Cart/Cart"
import Quote from "./pages/Contato/Quote"
import Login from "./pages/Login/Login"
import Register from "./pages/Login/Register"
import Admin from "./pages/Admin/Admin"

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Routes>

      {/* AUTH SEM LAYOUT */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />

      {/* TODAS AS ROTAS PROTEGIDAS COM LAYOUT */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/produtos/:id" element={<ProductDetail />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/orcamento" element={<Quote />} />
      </Route>

      {/* ROTA EXCLUSIVA PARA ADMINS */}
      <Route
        element={
          <AdminRoute>
            <Layout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<Admin />} />
      </Route>

    </Routes>
    </>
  )
}
