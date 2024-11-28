import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log('Database is live'));
    await mongoose.connect(`${process.env.MONGODB_URI}/JKL`)
}

export default connectDB;