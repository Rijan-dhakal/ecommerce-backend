import mongoose from "mongoose"

export const connectDB = async () => {
    try{
    // const resp = await mongoose.connect(`${process.env.MONGO_URI}`)
    const resp = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)

    console.log(`Database connected successfully: ${resp.connection.host}`);

    }catch(err){
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
    
}