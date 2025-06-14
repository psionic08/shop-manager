import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
    },
    userId: {
        type: String,
        required: [true, "Please provide userId"]
    }
})

const Buyer = mongoose.models.buyers || mongoose.model("buyers", buyerSchema);

export default Buyer;