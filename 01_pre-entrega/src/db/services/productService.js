import { ProductModel } from "../models/product.model.js";

export async function addProduct(data) {
    try {
        const response = await ProductModel.create(data);
        return response
    } catch (error) {
        throw new Error(error)
    }
}

export async function getProducts( optionsQuery, options){
    try {
        let data = await ProductModel.paginate(optionsQuery, options);
        if(data.docs.length == 0) return {status: "Success", msg: "No se encontro ningun producto con los parametros indicados"}
        let response = {
            status: 'success',
            payload: data.docs,
            totalPages: data.totalPages,
            prevPage: data.prePage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.hasPrevPage ? `http://localhost:8080/api/products?page=${data.prevPage}` : null,
            nextLink: data.hasNextPage ? `http://localhost:8080/api/products?page=${data.nextPage}` : null,
        }
        return response;
    } catch (error) {
        return{error: error, status: "error"}
    }
}