import { cartsService } from "../services/factory.js";
import { ticketService } from "../services/factory.js";

export async function createCart(req, res) {
  try {
    await cartsService.createCart();
    return res.send({ status: "success", msg: "carrito creado exitosamente" });
  } catch (error) {
    res.status(500).send({ status: "error", msg: error });
  }
}
export async function getAllCarts(req, res) {
  try {
    let carts = await cartsService.getAllCarts();
    return res.send({ status: "succes", payload: carts });
  } catch (error) {
    res.status(500).send({ status: "error", msg: error });
  }
}
export async function getCartById(req, res) {
  try {
    let idCart = req.params.cid;
    let cart = await cartsService.getCartById(idCart);
    return res.send({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", msg: error });
  }
}
//agrego un producto existente al carrito indicado
export async function addProductTocartById(req, res) {
  try {
    let idCart = req.params.cid;
    let idProduct = req.params.pid;
    console.log("cartID", idCart);
    console.log("productID", idProduct);
    let response = await cartsService.addProductToCartById(idCart, idProduct);
    return res.send({
      status: "success",
      msg: "producto agregado exitosamente",
      response: response,
    });
  } catch (error) {
    console.log("error en Controller: ", error);
    res.status(500).send({ status: "error", msg: error });
  }
}
export async function updateCart(req, res) {
  let idCart = req.params.cid;
  let data = req.body;
  try {
    let cartUpdated = await cartsService.updateCart(idCart, data);
    return res.send({ status: "success", response: cartUpdated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "error", msg: error });
  }
}
export async function UpdateProductQuantity(req, res) {
  let idCart = req.params.cid;
  let idProduct = req.params.pid;
  let newQuantity = req.body;
  try {
    await cartsService.UpdateProductQuantity(idCart, idProduct, newQuantity);
    return res.send({
      status: "success",
      msg: "Cantidad del producto actualizado exitosamente!",
    });
  } catch (error) {
    return res.status(error.status).send({ status: "error", msg: error.msg });
  }
}
export async function deleteProductInCart(req, res) {
  try {
    let idCart = req.params.cid;
    let idProduct = req.params.pid;
    await cartsService.deleteProductInCart(idCart, idProduct);
    return res.send({
      status: "success",
      msg: `Producto ${idProduct}, fue elminidao del carrito ${idCart} exitosamente!`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", msg: error });
  }
}
export async function deleteAllProductsInCart(req, res) {
  try {
    let idCart = req.params.cid;
    await cartsService.deleteAllProductsInCart(idCart);
    return res.send({
      status: "succes",
      msg: `El carrito ${idCart} fue vaciado exitosamente!`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", msg: error });
  }
}

// todo terminar de implementar
export async function purchase(req, res) {
  try {
    const cartId = req.params.cid;
    const cart = await cartsService.getCartById(cartId);

    // Verificar el stock y realizar la compra
    const purchaseResult = await ticketService.performPurchase(cart);

    return res.status(200).json(purchaseResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const purchaseCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    let purchaserEmail = req.user.email ? req.user.email : "user@example.com";
    const cart = await cartsService.getCartById(cartId);
    // Verificar el stock y realizar la compra
    const purchaseResult = await ticketService.generateTicket(
      cart,
      purchaserEmail
    );

    // Manejar la respuesta del TicketService
    if (purchaseResult.status === "success") {
      return res
        .status(200)
        .json({
          status: "success",
          msg: "Compra realizada con éxito",
          ticketId: purchaseResult.ticketId,
        });
    } else {
      return res
        .status(400)
        .json({
          status: "error",
          msg: "No se pudo completar la compra",
          failedProductIds: purchaseResult.failedProductIds,
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: error.message });
  }
};
