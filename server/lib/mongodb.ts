import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const MONGODB_URL = process.env.MONGODB_URL;
console.log(`MongoDB URL: ${MONGODB_URL}`);

export async function connectToDatabase() {
    try {
        if (mongoose.connection.readyState >= 1) {
            return
        }

        await mongoose.connect(MONGODB_URL!)
    }catch(err){
        console.error(err)
    }
}