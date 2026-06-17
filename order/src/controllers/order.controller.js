import mongoose from "mongoose";
import orderModel from "../models/order.model.js";
import axios from "axios";

async function createOrder(req, res) {

    try {

        const user = req.user
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1]

        //Fetch the user cart data 
        const cartResponse = await axios.get("http://localhost:3002/api/cart", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const cartData = cartResponse.data.cart.items

        const products = await Promise.all(cartData.map(async (item) => {
            return (await axios.get(`http://localhost:3001/api/product/${item.productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })).data
        }))
        let totalPrice = 0;

        const orderItem = cartData.map((item) => {
            let product = products.find(p => p.product._id === item.productId)
            // in stock check and throw new error if not in stock
            if (!product.product.stock || product.product.stock < item.quantity) {
                throw new Error(`Product ${product.product.title} is out of stock or not enough quantity available !`)
            }

            let itemTotal = product.product.price.amount * item.quantity
            totalPrice += itemTotal

            return {
                product: item.productId,
                quantity: item.quantity,
                price: {
                    amount: itemTotal,
                    currency: product.product.price.currency
                }
            }
        })

        const order = await orderModel.create({
            user: user.id,
            items: orderItem,
            status: "PENDING",
            totalAmount: {
                amount: totalPrice,
                currency: "INR"
            },
            shippingAddress: req.body.shippingAddress
        })

        res.status(200).json({
            message: "Order created successfully !",
            order
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to create order !",
            error: error.message
        })
    }

}


async function getMyOrders(req, res) {
    const user = req.user
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    try {

        const order = await orderModel.find({ user: user.id })
        const totalOrder = await orderModel.countDocuments({ user: user.id })

        if (!order || totalOrder === 0) {
            return res.status(404).json({
                message: "No orders found for the user !"
            })
        }

        res.status(200).json({
            message: "Orders fetched successfully !",
            order,
            meta: {
                total: totalOrder,
                page,
                limit
            }
        })


    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch all the orders from the DB !",
            error
        })
    }
}


async function getMyOrderById(req, res) {
    try {
        const userId = req.user.id;
        const orderId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid order id !"
            })
        }

        const order = await orderModel.findById(orderId)

        if (order.user.toString() != userId) {
            res.status(403).json({
                message: "Forbidden : You are not authorized to access this order !"
            })
        }
        res.status(200).json({
            message: "Order fetched successfully !",
            order
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch the order from the DB !",
            error
        })
    }
}

async function cancelOrderById(req, res) {
    try {
        const userId = req.user.id
        const orderId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid order ID !"
            })
        }

        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({
                message: "Order not found !"
            })
        }

        if (order.user.toString() != userId) {
            return res.status(403).json({
                message: "Forbidden this is not you order !"
            })
        }

        if(order.status != "PENDING" || order.status != "CONFIRMED"){
            return res.status(400).json({
                message: "Order cannot be cancelled as it is already processed !"
            })
        }

        order.status = "CANCELLED"

        await order.save()

        res.status(200).json({
            message: "Order cancelled successfully !",
            order
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel the order !",
            error
        })
    }
}

async function updateOrderAddress(req,res){
    try {
        const userId = req.user.id
         const orderId = req.params.id

        if(! mongoose.Types.ObjectId.isValid(orderId)){
            return res.status(400).json({
                message:"Invalid order ID !"
            })
        }

        const order = await orderModel.findById(orderId)

        if(!order){
            return res.status(404).json({
                message:"Order not found !"
            })
        }

        if(order.user.toString() != userId){
            return res.status(403).json({
                message:"Forbidden : you don't have access to update address !"
            })
        }

        if(order.status != "PENDING" || order.status != "CONFIRMED"){
            if(order.status === "SHIPPED"){
                return res.status(400).json({
                    message:"Cannot update address — order is already shipped"
                })
            }
            if(order.status === "DELIVERED"){
                return res.status(400).json({
                    message:"Cannot update address — order is already delivered"
                })
            }
            if(order.status === "CANCELLED"){
                return res.status(400).json({
                    message:"Cannot update address — order is already cancelled"
                })
            }
        }

        order.shippingAddress = {
            street : req.body.shippingAddress.street,
            city : req.body.shippingAddress.city,
            state : req.body.shippingAddress.state,
            pincode : req.body.shippingAddress.pincode,
            country : req.body.shippingAddress.country
        }
        await order.save()

        res.status(200).json({
            message:"Shipping address updated successfully !",
            order
        })

    } catch (error) {
        res.status(500).json({
            message:"Failed to upadate the shippingaddress !",
            error
        })
    }
}




export default { createOrder, getMyOrders, getMyOrderById, cancelOrderById, updateOrderAddress }