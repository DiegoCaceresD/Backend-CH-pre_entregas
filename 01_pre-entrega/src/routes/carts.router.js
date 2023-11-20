import express from "express"
import { uploader } from "../utils.js";
import * as CartsController from "../controllers/cartsController.js"
// import { Router } from "express"
// import CarritoManager from "../fileSystem/Carrito.js";
// const carritoManager = new CarritoManager;

const router = express.Router();

router.post("/", CartsController.createCart);

router.get("/", CartsController.getAllCarts);

router.get("/:cid", CartsController.getCartById);

router.post("/:cid/product/:pid", CartsController.addProductTocartById);

//elminia del carrito el producto seleccionado
router.delete("/:cid/products/:pid", CartsController.deleteProductInCart);

//actualiza el carrito con un arreglo de productos con el formato especificado
router.put("/:cid", CartsController.updateCart);

//actualiza SOLO la cantidad de ejemplares del producto por cualquier cantidad pasada en el req.body
router.put("/:cid/products/:pid", CartsController.UpdateProductQuantity);

//elimina todos los productos del carrito
router.delete("/:cid", CartsController.deleteAllProductsInCart);

function fileSystem(){
    router.post("/", async (req, res)=>{
        try {
          await carritoManager.addCarrito()
           return res.send({
            status: "success",
            msg: "Carrito creado exitosamente!",
        });
        } catch (error) {
            console.log("error en router: ", error);
        }
    })
    
    router.get("/:cid", async (req,res)=>{
        try {
            let idCart = parseInt(req.params.cid);
            let carrito = await carritoManager.getCarritoById(idCart);
            return res.send({ status: "succes", payload: carrito});
        } catch (error) {
            res.status(500).send({ status: "error", msg: error });
        }
    })
    
    router.post("/:cid/product/:pid", async(req,res)=>{
        try {
            let idCart = parseInt(req.params.cid);
            let idProduct = parseInt(req.params.pid);
            await carritoManager.addProductTocartById(idCart, idProduct);
            return res.send({
                status: "success",
                msg: "Producto añadido al carrito exitosamente!",
            });
        } catch (error) {
            console.log("error en router: ", error);
            return res.status(error.status).send({ status: "error", msg: error.msg });
        }
    })
}
export default router