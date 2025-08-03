import { Router } from "express";
import { placeOrder, allOrders, userOrders, updateStatus } from "../controllers/order.controller.js";
import { authorize, isAdmin } from "../middlewares/auth.middleware.js";

const orderRouter = Router()

orderRouter.post("/list", authorize, isAdmin, allOrders)

orderRouter.post("/status", authorize, isAdmin, updateStatus)

orderRouter.post("/place", authorize, placeOrder)

orderRouter.post("/userorders", authorize, userOrders)

export default orderRouter