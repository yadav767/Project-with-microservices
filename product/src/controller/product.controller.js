import jwt from 'jsonwebtoken'
import uploadImage from '../services/imagekit.service.js'
import productModel from '../models/product.model.js'
import mongoose from 'mongoose'

async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency = 'INR', stock } = req.body
        const seller = req.user.id
        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency
        }
        let images = await Promise.all((req.files || []).map(file => uploadImage({ buffer: file.buffer })))


        console.log(images);
        const product = await productModel.create({
            title, description, price, seller, images, stock:Number(stock)
        })

        return res.status(201).json({
            message: "Product created successfully !",
            data: product
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error creating product !",
            error
        })
    }
}

async function getProducts(req, res) {
    const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query

    const filter = {}

    if (q) {
        filter.$text = { $search: q }
    }

    if (minprice) {
        filter['price.amount'] = { ...filter['price.amount'], $gte: Number(minprice) }
    }

    if (maxprice) {
        filter['price.amount'] = { ...filter['price.amount'], $lte: Number(minprice) }
    }

    const products = await productModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit), 20));

    return res.status(200).json({
        data: products
    })
}

async function getProductById(req, res) {
    try {
        const { id } = req.params

        const product = await productModel.findById(id)

        if (!product) {
            return res.status(404).json({
                message: 'Product not found !'
            })
        }
        res.status(200).json({ product: product })
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get the product !',
            product
        })
    }
}

async function updateProduct(req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid product id !"
        })
    }

    const product = await productModel.findOne({
        _id: id,
    })

    if (!product) {
        return res.status(404).json({
            message: "Product not found !"
        })
    }

    if (product.seller.toString() != req.user.id) {
        return res.status(403).json({
            message: "Forbidden : You can only access product you have created !"
        })
    }

    const allowedUpdated = ["title", "description", "price"]

    for (const key of Object.keys(req.body)) {
        if (allowedUpdated.includes(key)) {
            if (key == 'price' && typeof req.body.price === 'object') {
                if (req.body.price.amount != undefined) {
                    product.price.amount = Number(req.body.price.amount)
                }
                if (req.body.price.currency != undefined) {
                    product.price.currency = req.body.price.currency
                }
            }
            else {
                product[key] = req.body[key]
            }
        }
    }

    await product.save()
    res.status(200).json({
        message: "Product upadted !",
        product
    })
}

async function deleteProduct(req, res) {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid product id !"
        })
    }

    const product = await productModel.findOne({
        _id: id
    })

    if (!product) {
        return res.status(404).json({
            message: "Product Not Found !"
        })
    }

    if (product.seller.toString() != req.user.id) {
        return res.status(403).json({
            message: "Forbidden : You dont have access to delete this product !"
        })
    }

    await productModel.deleteOne({ _id: id })

    res.status(200).json({
        message: "Product deleted successfully !"
    })
}

async function getProductsBySeller(req, res) {
    const seller = req.user

    const { skip = 0, limit = 20 } = req.query

    const products = await productModel.find({ seller: seller.id }).skip(Number(skip)).limit(Math.min(Number(limit), 20))

    res.status(200).json({
        data: products
    })
}




export default { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsBySeller } 