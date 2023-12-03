import ProductsDTO from "../services/DTO/productDTO.js";
import { productsService } from "../services/factory.js";


export async function addProduct(req, res) {
    try {
        const { body } = req;
        const response = await productsService.addProduct(body);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error.message)
    }
}

export async function getProducts(req,res){
    try {
        let { limit, page, sort ,category, availability, query }  = req.query;

        let optionsQuery = {};
        if ( query ) optionsQuery.title = { $regex: new RegExp(query, "i") };
        if( category ) optionsQuery.category = category;
        if ( availability ) optionsQuery.status = availability;

        const options = {
            page: page? parseInt(page): 1,
            limit: limit? parseInt(limit): 10,
        }
        if(sort) options.sort = {price:sort}    

        
        let products = await productsService.getProducts(optionsQuery, options);
        console.log("products: ", products.payload);
        const productsDTO = products.payload.map(product => new ProductsDTO(product));
        console.log("productsDTO: ", productsDTO);
        res.status(200).send(productsDTO);
    } catch (error) {
        res.status(400).json(error.message)
    }
}