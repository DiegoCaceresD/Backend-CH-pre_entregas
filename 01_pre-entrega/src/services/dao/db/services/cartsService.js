import { CartModel } from "../models/cart.model.js";

export default class cartService {
    constructor() { 
        console.log("Working courses with Database persistence in mongodb");
    }

    createCart = async () => {
    try {
        const response = await CartModel.create({products: []})
        return response;
    } catch (error) {
        throw new Error(error);
    }
    }

    getAllCarts = async () => {
        try {
            const response = await CartModel.find()
            return response;
        } catch (error) {
            throw new Error(error);
        }
    
    }
    getCartById = async (idCart) => {
        try {
            const response = await CartModel.findOne({_id: idCart}).populate('products.product');
            return response;
        } catch (error) {
            throw error;
        }
    }
    addProductTocartById = async (idCart, idProduct) => {
        try {
            let response = await CartModel.updateOne(
                { _id: idCart },
                { $push: { products: { product: idProduct } } }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
    updateCart = async (idCart, data) => {
        try {
            let response;
            if (data) {
              response =  await CartModel.findOneAndUpdate({_id:idCart}, {product:data}, {new:true})
            }
            return response
        } catch (error) {
            throw error;
        }
    }
    UpdateProductQuantity = async (idCart, idProduct, newQuantity) => {
        try {
            console.log(newQuantity);
            let response = CartModel.updateOne({ "_id": idCart, "products.id": idProduct }, { $set: { "products.stock": newQuantity} })
            return response;
        } catch (error) {
            throw error;
        }
    
    }
    deleteProductInCart = async (idCart, idProduct) => {
       try {
            let response = await CartModel.updateOne({_id: idCart}, {$pull: {products: {_id: idProduct}}});
            return response;
       } catch (error) {
        
       }
    }
    deleteAllProductsInCart = async (idCart) => {
        try {
            let response = await CartModel.updateOne({_id: idCart}, { $set: { products: []}});
            return response;
        } catch (error) {
            throw error;
        }
    
}

}

