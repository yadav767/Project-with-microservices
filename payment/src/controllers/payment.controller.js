import mongoose from 'mongoose';
import paymentModel from '../models/payment.model.js';
import axios from 'axios';
import Razorpay from 'razorpay';
import { validatePaymentVerification } from '../../node_modules/razorpay/dist/utils/razorpay-utils.js'
import crypto from 'crypto';

import 'dotenv/config'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


async function createPayment(req, res) {
    try {


        const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1]

        const orderId = req.params.orderId

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid object ID"
            })
        }

        const orderDetails = await axios.get(`http://localhost:3003/api/order/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const price = orderDetails.data.order.totalAmount

        const order = await razorpay.orders.create(price);

        const payment = await paymentModel.create({
            order: orderId,
            paymentOrderId: order.id,
            user: req.user.id,
            price: {
                amount: order.amount,
                currency: order.currency
            }
        })

        res.status(200).json({
            message: "Payment initiated successfully ",
            payment
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to create payment !",
            error
        })
    }
}


async function verifyPayment(req, res) {


    // const secret = process.env.RAZORPAY_KEY_SECRET; // from .env
    // const orderId = "order_T3LwanH315ym9A";   // from Step 1
    // const paymentId = "pay_T360bLw1mHFj7n";   // from Step 2

    // const signature = crypto
    //     .createHmac('sha256', secret)
    //     .update(`${orderId}|${paymentId}`)
    //     .digest('hex');

    // console.log("Signature:", signature); // 👈 Copy this
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;



    try {
        const result = validatePaymentVerification(
            {
                order_id: razorpayOrderId,
                payment_id: razorpayPaymentId,
            },
            signature,
            secret
        );

        console.log(result);
        if (result) {
            const payment = await paymentModel.findOne({ razorpayOrderId, status: 'PENDING' });
            payment.paymentId = razorpayPaymentId;
            payment.signature = signature;
            payment.status = 'COMPLETED';
            await payment.save();
            res.json({ status: 'success' ,payment});
        } else {

            res.status(400).send('Invalid signature');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error verifying payment');
    }
}



export default { createPayment, verifyPayment }