import { CartModel } from "../db/models/cart.model.js";

export async function createCart(){
try {
    const response = await CartModel.create({products: []})
    return response;
} catch (error) {
    throw new Error(error);
}
}
export async function getAllCarts(){
    try {
        const response = await CartModel.find()
        return response;
    } catch (error) {
        throw new Error(error);
    }

}
export async function getCartById(idCart){
    try {
        const response = await CartModel.findOne({_id: idCart}).populate('products.product');
        return response;
    } catch (error) {
        throw error;
    }
}
export async function addProductTocartById(idCart, idProduct){
    try {
        let cart = await CartModel.findOne({_id: idCart})
            cart.products.push({product: idProduct})
            let response = CartModel.updateOne(cart)
        return response;
    } catch (error) {
        throw error;
    }
}
export async function updateCart(idCart, data){
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
export async function UpdateProductQuantity(idCart, idProduct, newQuantity){
    try {
        console.log(newQuantity);
        let response = CartModel.updateOne({ "_id": idCart, "products.id": idProduct }, { $set: { "products.stock": newQuantity} })
        return response;
    } catch (error) {
        throw error;
    }

}
export async function deleteProductInCart(idCart, idProduct){
   try {
        let response = await CartModel.updateOne({_id: idCart}, {$pull: {products: {_id: idProduct}}});
        return response;
   } catch (error) {
    
   }
}
export async function deleteAllProductsInCart(idCart){
    try {
        let response = await CartModel.updateOne({_id: idCart}, { $set: { products: []}});
        return response;
    } catch (error) {
        throw error;
    }

}

