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
            totalAmount:{
                amount:totalPrice,
                currency:"INR"
            },
            shippingAddress:req.body.shippingAddress
        })

        res.status(200).json({
            message:"Order created successfully !",
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




export default { createOrder }