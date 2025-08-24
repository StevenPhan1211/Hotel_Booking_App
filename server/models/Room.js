import mongoose from "mongoose";

// Define roomSchema (its like u're defining a table in SQL Server but not that true in this noSQL style here)
const roomSchema = new mongoose.Schema({
    hotel: {type: String, ref: "Hotel", required: true},
    roomType: {type: String, required: true},
    pricePerNight: {type: Number, required: true},
    amenities: {type: Array, required: true},
    images: [{ type: String }],
    isAvailable: {type: Boolean, default: true}
}, {timestamps: true});

// function to define a name to save on mongoDB
const Room = mongoose.model("Room", roomSchema);

export default Room;
