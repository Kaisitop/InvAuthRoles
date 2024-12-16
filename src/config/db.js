import mongoose from "mongoose";


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Base de datos conectada")
    } catch (err) {
        console.error('error al conectar la base de datos:', err.message);
        process.exit(1);
    }
}

export default connectDB;
