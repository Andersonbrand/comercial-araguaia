import { Router } from "express"
import { upload } from "../utils/cloudinary.js"

import UserController from "../app/controllers/UserController.js"
import SessionController from "../app/controllers/SessionController.js"
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../app/controllers/productController.js"
import { createOrder } from "../app/controllers/orderController.js"
import { createQuote } from "../app/controllers/quoteController.js"

import auth from "../app/middlewares/authMiddleware.js"
import isAdmin from "../app/middlewares/isAdmin.js"

const routes = Router()

routes.post("/login/users", UserController.store)
routes.post("/login/sessions", SessionController.store)

routes.get("/users", auth, isAdmin, UserController.index)
routes.get("/me", auth, UserController.profile)

routes.get("/admin", auth, isAdmin, (req, res) => {
    res.json({ message: "Área admin liberada" })
})

routes.get("/products", getAllProducts)
routes.get("/products/:id", getProductById)
routes.post("/products", auth, isAdmin, upload.single("image"), createProduct)
routes.put("/products/:id", auth, isAdmin, upload.single("image"), updateProduct)
routes.delete("/products/:id", auth, isAdmin, deleteProduct)

routes.post("/orders", createOrder)

routes.post("/quotes", createQuote)

export default routes
