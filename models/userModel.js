const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Must provide an email"],
        unique: [true, "Email must be unique"]
    },
    password: {
        type: String,
        required: [true, "Must provide an password"]
    },
    avatar: {
        type: String,
        default: ""
    },
    number: {
        type: Number,
        default: null,
    },
    refresh_token: {
        type: String,
        default: ""
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    last_login_date: {
        type: Date,
        default: ""
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Address"
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Types.ObjectId,
            ref: "CartProduct"
        }
    ],
    order_history: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Order"
        }
    ],
    forget_password_otp: {
        type: String,
        default: null
    },
    forget_password_expiry: {
        type: Date,
        default: ""
    },
    role: {
        type: String,
        enum: ["ADMIN","USER"],
        default: "USER"
    },
},{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;