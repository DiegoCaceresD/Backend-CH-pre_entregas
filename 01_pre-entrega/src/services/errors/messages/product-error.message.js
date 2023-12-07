export const cartErrorInfo = (data) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Lista de propiedades requeridas:
            -> idCart: type String, recibido: ${data.idCart}
            -> idProduct: type String, recibido: ${data.idProduct}
    `;
};