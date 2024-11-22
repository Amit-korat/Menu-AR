const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
