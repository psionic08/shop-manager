import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        unique: true,
    },
    userid: {
        type: String,
        required: [true, "Please provide userid"]
    }
})

const Buyer = mongoose.models.buyers || mongoose.model("buyers", buyerSchema);

export default Buyer;