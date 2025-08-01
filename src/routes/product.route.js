import { Router } from "express";
import { addProduct, removeProduct, listProducts, listAllProducts, singleProduct, updateProduct  } from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";

const productRouter = Router()

// list all products from the DB
productRouter.get("/list", listAllProducts)

productRouter.post('/add', authorize, upload.fields([{name:'image1', maxCount: 1}, {name:'image2', maxCount: 1}, {name:'image3', maxCount: 1}, {name:'image4', maxCount: 1}]), addProduct)

productRouter.delete('/remove/:id', authorize, removeProduct)

productRouter.patch('/update/:id', authorize, upload.fields([{name:'image1', maxCount: 1}, {name:'image2', maxCount: 1}, {name:'image3', maxCount: 1}, {name:'image4', maxCount: 1}]), updateProduct)

productRouter.get('/list/:userId', listProducts)

productRouter.get('/single/:id', singleProduct)

export default productRouter