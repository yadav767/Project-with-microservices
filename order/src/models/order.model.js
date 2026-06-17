import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    isDefault: { type: Boolean, default: false }
})


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        },
        price: {
            amount: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                required: true,
                enum: ["INR", "USD"]
            }
        }
    }],
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED", "SHIPPED", "DELIVERED", "RETURNED", "COMPLETED"],
    },
    totalAmount: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true,
            enum: ["INR", "USD"]
        }
    },
    shippingAddress: {
        type:addressSchema,
        required:true
    }

}, { timestamps: true })

const orderModel = mongoose.model("order", orderSchema)

export default orderModel