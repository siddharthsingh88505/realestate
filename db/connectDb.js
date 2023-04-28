import mongoose from "mongoose";

// options for the connection
const options = {
    dbName: "dummy",
}

// helper function for connection
const connectDb = async (databaseUrl) => {
    try {
        await mongoose.connect(databaseUrl, options);
        console.log("Connected Successfully")
    }
    catch (error) {
        console.log("Error catched in connectDb.js")
    }
}

export { connectDb };