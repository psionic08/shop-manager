import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        unique: true,
    },
    rate: {
       type: Number,
       required: [true, "Please provide rate"],
    },
    unit: {
        type: String,
        enum: ["Mtr","Bdl","Pcs"],
        required: [true, "Please provide unit"],
    },
    userid: {
        type: String,
        required: [true, "Please provide userid"]
    }
})

const Item = mongoose.models.items || mongoose.model("items", itemSchema);

export default Item;