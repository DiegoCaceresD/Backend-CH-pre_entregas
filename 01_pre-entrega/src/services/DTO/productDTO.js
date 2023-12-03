export default class ProductsDTO {
    constructor(product){
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.stock = product.stock;
        this.category = product.category;
    }
}