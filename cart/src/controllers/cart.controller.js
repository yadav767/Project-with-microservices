import createCartValidationRules from "../middlewares/validator.middleware.js";
import cartModel from "../models/cart.model.js";

async function createCart(req, res) {
    try {
        const { productId, qty } = req.body;
        const userId = req.user.id

        let cart = await cartModel.findOne({ user: userId })

        if (!cart) {
            cart = new cartModel({ user: userId, items: [] })
        }

        const existingProductIndex = cart.items.findIndex(item => item.productId.toString() === productId)

        if (existingProductIndex >= 0) {
            cart.items[existingProductIndex].quantity += parseInt(qty)
        } else {
            cart.items.push({ productId, quantity: parseInt(qty) })
        }

        await cart.save()

        res.status(200).json({
            message: "Cart added succsssfully !",
            cart
        })
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({
            message: "Error occured while adding to cart !",
            error
        })
    }

}


async function updateItemQuantity(req, res) {
    const { productId } = req.params
    const { qty } = req.body
    const userId = req.user.id

    let cart = await cartModel.findOne({ user: userId })

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found !"
        })
    }

    const existingItenIndex = cart.items.findIndex(item => item.productId.toString() === productId)

    if (existingItenIndex < 0) {
        return res.status(404).json({
            message: "No product found !"
        })
    }
    cart.items[existingItenIndex].quantity = qty
    await cart.save()

    res.status(200).json({
        message: "Item updated successfully !",
        cart
    })

}


async function getCart(req, res) {
    const userId = req.user.id

    let cart = await cartModel.findOne({ user: userId })

    if (!cart) {
        cart = new cartModel.create({ user: userId, items: [] })
        await cart.save()
    }

    res.status(200).json({
        cart,
        totals: {
            totalCount: cart.items.length,
            totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0)
        }
    })
}


async function deleteItem(req, res) {
    try {
        const { productId } = req.params
        const userId = req.user.id

        let cart = await cartModel.findOne({ user: userId })

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found !"
            })
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId)

        if (itemIndex < 0) {
            return res.status(404).json({
                message: "No item found "
            })
        }

        cart.items.splice(itemIndex, 1)
        await cart.save()

        res.status(200).json({
            message: "Cart deleted successfully !",
            cart
        })


    } catch (error) {
        res.status(500).json({
            message: "Error deleting item ",
            error
        })
    }
}

async function removeAllItemFromCart(req, res) {
    try {
        const userId = req.user.id

        const cart = await cartModel.findOne({ user: userId })

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found "
            })
        }

        cart.items = []
        await cart.save()

        res.status(200).json({
            message: "Items removed successfully !"
        })
    } catch (error) {
        res.status(500).json({
            message:"Error removing the items from the cart ",
            error
        })
    }
}



export default { createCart, updateItemQuantity, getCart, deleteItem, removeAllItemFromCart }