import mongoose from "mongoose";
import User from "../models/user.model.js"
import { error } from "../utils/error.js"
import Product from "../models/product.model.js";


export const addToCart = async (req, res, next) => {
    try {
        const {itemId} = req.body
        const userId = req.user._id

        if(!itemId || !mongoose.Types.ObjectId.isValid(itemId)) throw error("All fields are required OR Invalid itemId", 401)

        if(!userId) throw error("Unauthorized", 401)
        
        const userData = await User.findById(userId)
        if(!userData) throw error("User not found", 400)

        const isProductExists = await Product.findById(itemId)
        if(!isProductExists ) throw error("Product not found", 404)

        if(isProductExists.stock <= 0) throw error("Product is out of stock", 400)

        let cartData = await userData.cartData

        if(!cartData) throw error("Cart not found", 400)

        // Check if item already exists in cart
        cartData[itemId] ? cartData[itemId] +=1 : cartData[itemId] = 1

       const response =  await User.findByIdAndUpdate(userId, { cartData }, { new: true })
        if(!response) throw error("Failed to update cart", 500)


        res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            data: response.cartData
        })

    } catch (error) {
        next(error)
    }
};

export const updateCart = async (req, res, next) => {
    try {
        const {itemId, quantity} = req.body
        const userId = req.user._id

        if(!itemId || !quantity) throw error("All fields are required", 401)

        if(!userId) throw error("Unauthorized", 401)

        const userData = await User.findById(userId)
        if(!userData) throw error("User not found", 400)

        let cartData = await userData.cartData

        if(!cartData || !cartData[itemId]) throw error("Item not found in cart", 404)

        const product = await Product.findById(itemId)

        if(quantity > product.stock) throw error(`Insufficient stock. Only ${product.stock} left`, 400)

        // Update item quantity in cart
        if(quantity <= 0) {
            delete cartData[itemId]
        } else {
            cartData[itemId] = quantity
        }

        const response = await User.findByIdAndUpdate(userId, { cartData }, { new: true })
        if(!response) throw error("Failed to update cart", 500)

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: response.cartData
        })
    } catch (error) {
        next(error);
    }
};

export const getUserCart = async (req, res, next) => {
    try {
        const userId = req.user._id

        if(!userId) throw error("Unauthorized", 401)

        const userData = await User.findById(userId)
        if(!userData) throw error("User not found", 400)

        let cartData = await userData.cartData

        if(!cartData) throw error("Cart not found", 404)

        res.status(200).json({
            success: true,
            message: "Cart retrieved successfully",
            data: cartData
        })
    } catch (error) {
        next(error);
    }
};

export const removeAllProductsFromCart = async (req, res, next) => {
    try {
        const userId = req.user._id

        if (!userId) throw error("Unauthorized", 401)

        const userData = await User.findById(userId)
        if (!userData) throw error("User not found", 400)

        let cartData = await userData.cartData

        if (!cartData) throw error("Cart not found", 404)

        cartData = {} 

        const response = await User.findByIdAndUpdate(userId, { cartData }, { new: true })
        if (!response) throw error("Failed to update cart", 500)

        res.status(200).json({
            success: true,
            message: "All products have been removed from the cart",
            data: response.cartData
        })
    } catch (error) {
        next(error);
    }
};

