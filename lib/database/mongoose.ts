import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);
    if(!process.env.MONGODB_URL) return console.log("Mongo URL not found");
    if(isConnected) return console.log("Alredy connected");
    try {
        await mongoose.connect(process.env.MONGODB_URL,{dbName:"square"});
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}