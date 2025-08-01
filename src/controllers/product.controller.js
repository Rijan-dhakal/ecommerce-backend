import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/product.model.js';
import { error } from '../utils/error.js';

// add product
export const addProduct = async (req, res, next) => {
    try{

        const user = req.user._id; 
        if (!user) {
            throw error("Unauthorized", 401);
        }

        const { name, price, description, category, subCategory, bestseller } = req.body;

        if (!name || !price || !description || !category || !subCategory) throw error("All fields are required", 400);


        if (isNaN(price) || price < 0) throw error("Invalid price", 400);

        const image1 = req.files.image1 ? req.files.image1[0].filename : null;
        const image2 = req.files.image2 ? req.files.image2[0].filename : null;
        const image3 = req.files.image3 ? req.files.image3[0].filename : null;
        const image4 = req.files.image4 ? req.files.image4[0].filename : null;

        const images = [image1, image2, image3, image4].filter(item => item !== null); // Filter out null values

        let imagesUrl = await Promise.all(images.map(async (image) => {
            const result = await cloudinary.uploader.upload(`uploads/${image}`);
                return result.secure_url;
        })); 

        const productData = {
            user,
            name,
            price: Number(price),
            description,
            category,
            subCategory,
            bestseller: bestseller === 'true',
            image: imagesUrl, 
            date: Date.now() 
        }
        
        const product = new Product(productData);
        const resp = await product.save();

        if (!resp) throw error(500, "Failed to add products");

        res.status(201).json({success: true, message: "Product added successfully", product: resp})

    } catch (error) {
        next(error);
    }
};

// list product
export const listProducts = async (req, res, next) => {
    try {
        const userId = req.user._id;
        if (!userId) throw error("Unauthorized", 401);

        const products = await Product.find({user: userId});
        if(!products || products.length === 0) throw error("No products found", 404);

        return res.status(200).json({success: true, products});

    } catch (error) {
        next(error);
    }
};

// remove product
export const removeProduct = async (req, res, next) => {
    try{
    const { id } = req.params;
    if (!id) throw error("Product ID is required", 400);
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw error(404, "Product not found");


    // Check if product has images
    if (product.image && product.image.length > 0) {
        // Delete images from cloudinary
        for (const image of product.image) {
            const publicId = image.split('/').pop().split('.')[0]; // Extract public ID from URL
            await cloudinary.uploader.destroy(publicId);
        }
    }
  
    res.status(200).json({success: true, message: "Product removed successfully"});

} catch (error) {
    next(error);
}
};
// single product
export const singleProduct = async (req, res, next) => {
    try {
       const {id} = req.params;
       if (!id) throw error("Product ID is required", 400);
       const product = await Product.findById(id);
       if (!product) throw error("Product not found", 404);
       res.status(200).json({success: true, product});
    } catch (error) {
        next(error);
    }
}       