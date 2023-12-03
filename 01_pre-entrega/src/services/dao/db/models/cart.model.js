import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';


const cartColection = 'cart';


const ArrayTypeSchemaNonUniqueRequired = {
    type: Array,
    required: true
};

const cartSchema = new mongoose.Schema({
    products: {
        type:[
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                }
            }
        ],
        default: []
    }
})
cartSchema.plugin(mongoosePaginate)

export const CartModel = mongoose.model(cartColection, cartSchema)