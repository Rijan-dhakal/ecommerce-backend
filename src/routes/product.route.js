import { Router } from "express";
import { addProduct, removeProduct, listProducts, singleProduct  } from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";

const productRouter = Router()

productRouter.post('/add', authorize, upload.fields([{name:'image1', maxCount: 1}, {name:'image2', maxCount: 1}, {name:'image3', maxCount: 1}, {name:'image4', maxCount: 1}]), addProduct)

productRouter.post('/remove', removeProduct)

productRouter.get('/list', listProducts)

productRouter.get('/single', singleProduct)

export default productRouter