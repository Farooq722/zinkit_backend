const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    orderId: {
        type: String,
        required: [true, "Provide order id"],
        unique: true
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    },
    product_details: {
        name: String,
        image: Array,
    },
    paymentId: {
        type: String,
        default: ""
    },
    payment_status: {
        type: String,
        default: ""
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: 'Address'
    },
    subTotalAmt: {
        type: Number,
        default: null
    },
    totalAmt: {
        type: Number,
        default: null   
    },
    invoice_receipt: {
        type: String,
        default: ""
    },
},{
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;