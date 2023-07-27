import { Router } from "express"
import CarritoManager from "../Carrito.js";

const router = Router();
const carritoManager = new CarritoManager;

export default router

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