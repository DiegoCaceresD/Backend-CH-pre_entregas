import * as CartsService from "../services/cartsService.js"

export async function createCart(req,res) {
    try {
        await CartsService.createCart()
        return res.send({ status: "success", msg:"carrito creado exitosamente"});
      } catch (error) {
        res.status(500).send({ status: "error", msg: error });
      }
}
export async function getAllCarts(req,res) {
    try {
        let carts = await CartsService.getAllCarts();
        return res.send({ status: "succes", payload: carts});
    } catch (error) {
        res.status(500).send({ status: "error", msg: error });
    }
}
export async function getCartById(req,res) {
    try {
        let idCart = req.params.cid;
        let cart = await CartsService.getCartById(idCart);
        return res.send({ status: "success", payload: cart});
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", msg: error });
    }
}
//agrego un producto existente al carrito indicado
export async function addProductTocartById(req,res) {
    try {
        let idCart = req.params.cid;
        let idProduct = req.params.pid;
        let response = await CartsService.addProductTocartById(idCart, idProduct);
        return res.send({ status: "success", msg:"producto agregado exitosamente", response: response});
    } catch (error) {
        console.log("error en Controller: ", error);
        res.status(500).send({ status: "error", msg: error });
    }
}
export async function updateCart(req,res) {
    let idCart = req.params.cid;
    let data = req.body
    try {
       let cartUpdated = await CartsService.updateCart(idCart, data)
        return res.send({ status: "success", response: cartUpdated});
        } catch (error) {
            console.log(error);
        return res.status(500).send({ status: "error", msg: error });
    }
}
export async function UpdateProductQuantity(req,res) {
    let idCart = req.params.cid;
    let idProduct = req.params.pid;
    let newQuantity = req.body
    try {
        await CartsService.UpdateProductQuantity(idCart, idProduct, newQuantity)
        return res.send({ status: "success", msg:"Cantidad del producto actualizado exitosamente!"});
    } catch (error) {
        return res.status(error.status).send({ status: "error", msg: error.msg });
    }
}
export async function deleteProductInCart(req,res) {
    try {
        let idCart = req.params.cid;
        let idProduct = req.params.pid;
        await CartsService.deleteProductInCart(idCart, idProduct);
        return res.send({ status: "succes", msg:`Producto ${idProduct}, fue elminidao del carrito ${idCart} exitosamente!`});
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", msg: error });
    }
}
export async function deleteAllProductsInCart(req,res) {
    try {
        let idCart = req.params.cid;
        await CartsService.deleteProductInCart(idCart);
        return res.send({ status: "succes", msg:`El carrito ${idCart} fue eliminado exitosamente!`});
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", msg: error });
    }
}

