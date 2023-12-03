import  config from "./config.js";
import mongoose from "mongoose";


export default class MongoSingleton {
    static #instance

    constructor(){
        this.#connectMongoDB()
    }

    static getInstance() {
        if(this.#instance){
            console.log("Ya se ha abierto una conexión a mongoDB");
        }else{
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {
        try {
            await mongoose.connect(config.mongoUrl)
            console.log("Conectado con éxito a la DB");
        } catch (error) {
            console.error("No se ha podido conectar a la DB usando Mongoose: ", error);
            process.exit(1);
        }
    }
}