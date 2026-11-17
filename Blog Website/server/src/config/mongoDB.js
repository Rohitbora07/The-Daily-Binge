import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("Database connected");
    });
    mongoose.connection.on("error", (err) => {
        console.error("Database connection error:", err.message);
    });
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
    }
};

export default connectDB;