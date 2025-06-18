import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
    },
    rate: {
        type: Number,
        required: [true, "Please provide rate"],
    },
    unit: {
        type: String,
        enum: ["Mtr", "Coil", "Pcs"],
        required: [true, "Please provide unit"],
    },
    quantity: {
        type: Number,
        required: [true, "Please provide quantity"],
        default: 0
    },
    userId: {
        type: String,
        required: [true, "Please provide userId"]
    }
})

const Item = mongoose.models.items || mongoose.model("items", itemSchema);

export default Item;