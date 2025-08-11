import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/product.model.js';
import { error } from '../utils/error.js';
import clearUploads from '../utils/clearUploads.js';

// list all products
export const listAllProducts = async (req, res, next) => {
    try {

        const products = await Product.find({});
        if(!products || products.length === 0) throw error("No products found", 404);

        return res.status(200).json({success: true, products});

    } catch (error) {
        next(error);
    }
};

// add product
export const addProduct = async (req, res, next) => {
    try{

        const user = req.user._id; 
        if (!user) {
            throw error("Unauthorized", 401);
        }

        const { name, price, description, category, subCategory, bestseller, stock } = req.body;

        if (!name || !price || !description || !category || !subCategory) throw error("All fields are required", 400);


        if (isNaN(price) || price < 0) throw error("Invalid price", 400);
        if(stock && (isNaN(stock) || stock < 0)) throw error("Invalid stock", 400);

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
            stock: Number(stock),
            description,
            category,
            subCategory,
            bestseller: bestseller === 'true',
            image: imagesUrl, 
            date: Date.now() 
        }
        
        const product = new Product(productData);
        const resp = await product.save();

        if (!resp) throw error("Product not added", 500);

        clearUploads(); 

        res.status(201).json({success: true, message: "Product added successfully", product: resp})

    } catch (error) {
        next(error);
    }
};

// list user products
export const listProducts = async (req, res, next) => {
    try {
        const {userId} = req.params
        if(!userId) throw error("User not found", 404)

        const userProducts = await Product.find({ user: userId });
        if (!userProducts || userProducts.length === 0) throw error("No products found for this user", 404);

        res.status(200).json({success: true, products: userProducts})

    } catch (error) {
        next(error)
    }
}

// remove product
export const removeProduct = async (req, res, next) => {
    try{
    const { id } = req.params;
    if (!id) throw error("Product ID is required", 400);
    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;

    if (!userId) throw error("Unauthorized", 401);

    // Check if product belongs to the user
    const productExists = await Product.findById(id);
    if (!productExists) throw error("Product not found or unauthorized", 404);

    if(!isAdmin && productExists.user.toString() !== userId.toString()) throw error("You are not authorized to delete this product", 403);

    const product = await Product.findByIdAndDelete(id);
    if (!product) throw error("Product not found", 404);


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

// update product
export const updateProduct = async (req, res, next) => {
    try {
        if(!req.body) throw error("No data provided for update", 400);

        const { id } = req.params;
        if (!id) throw error("Product ID is required", 400);
        const userId = req.user._id;
        const isAdmin = req.user.isAdmin;
        if (!userId) throw error("Unauthorized", 401);

        const productExists = await Product.findById(id);
        if (!productExists) throw error("Product not found or unauthorized", 404);
        
        if(!isAdmin && productExists.user.toString() !==  userId.toString()) throw error("You are not authorized to modify this product", 403);

        const { name, price, description, category, subCategory, bestseller, stock } = req.body;

        if (isNaN(price) || price < 0) throw error("Invalid price", 400);

        const image1 = req.files?.image1 ? req.files.image1[0].filename : null;
        const image2 = req.files?.image2 ? req.files.image2[0].filename : null;
        const image3 = req.files?.image3 ? req.files.image3[0].filename : null;
        const image4 = req.files?.image4 ? req.files.image4[0].filename : null;

        const images = [image1, image2, image3, image4].filter(item => item !== null); // Filter out null values

        let imagesUrl = await Promise.all(images.map(async (image) => {
            const result = await cloudinary.uploader.upload(`uploads/${image}`);
            return result.secure_url;
        }));

        const productData = {
            name: name ||productExists.name,
            price: Number(price) || productExists.price,
            stock: Number(stock) || productExists.stock,
            description: description || productExists.description,
            category: category || productExists.category,
            subCategory: subCategory || productExists.subCategory,
            bestseller: bestseller === 'true',
            image: imagesUrl.length > 0 ? imagesUrl : productExists.image, 
            date: Date.now()
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
        if (!updatedProduct) throw error("Product not found", 404);

        res.status(200).json({success: true, message: "Product updated successfully", product: updatedProduct});
    } catch (error) {
        next(error);
    }
};

// single product
export const singleProduct = async (req, res, next) => {
    try {
       const {id} = req.params;
       if (!id) throw error("Product ID is required", 400);
       const userId = req.user._id;
       const isAdmin = req.user.isAdmin

       if (!userId) throw error("Unauthorized", 401);

       const productExists = await Product.findById(id);
       if (!productExists) throw error("Product not found or unauthorized", 404);

       if(!isAdmin && productExists.user.toString() !== userId.toString()) throw error("You are not authorized", 403);

       res.status(200).json({success: true, productExists});
    } catch (error) {
        next(error);
    }
};    