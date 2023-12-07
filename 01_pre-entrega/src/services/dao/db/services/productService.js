import { ProductModel } from "../models/product.model.js";

export default class productsService {
constructor(){
    console.log("Working courses with Database persistence in mongodb");
}

     addProduct = async (data) => {
        try {
            const response = await ProductModel.create(data);
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    getProducts = async ( optionsQuery, options) => {
        try {
            let data = await ProductModel.paginate(optionsQuery, options);
            if(data.docs.length === 0) return {status: "Success", msg: "No se encontro ningun producto con los parametros indicados"}
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
            return{error: error.message, status: "error"}
        }

    }

    getProductById = async (idProduct) => {
        try {
            const response = await ProductModel.findById(idProduct)
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    updateProduct = async (idProduct, data) => {
        try {
            let response;
            if (data) {
                response = await ProductModel.findByIdAndUpdate(idProduct, data, {new: true} )
            }
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }
}