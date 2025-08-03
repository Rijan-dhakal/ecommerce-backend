import { Router } from "express";
import { addToCart, getUserCart, updateCart, removeAllProductsFromCart } from "../controllers/cart.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const cartRouter = Router()

cartRouter.post('/get', authorize, getUserCart)

cartRouter.post('/add', authorize, addToCart)

cartRouter.post('/update', authorize, updateCart)

cartRouter.post('/remove', authorize, removeAllProductsFromCart)

export default cartRouter