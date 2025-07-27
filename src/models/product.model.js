import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name:{type:String, required:true, trim: true},
    description:{type:String, required:true, trim: true},
    price:{type:Number, required:true, min:0},
    image:{type:Array, required:true},
    category:{type:String, required:true, trim: true},
    subCatefory:{type:String, required:true, trim: true},
    bestseller: {type:Boolean, default:false},
    date:{type:Number, required: true}

}, {timestamps:true})

const Product = mongoose.model("Product", productSchema);

export default Product;