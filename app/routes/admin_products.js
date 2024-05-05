const express = require("express");
const fs = require("fs");
const dataHandler = require("../controllers/data_handler");
const utils = require("../controllers/utils");
const Product = require("../controllers/products");

const router = express.Router();

function validateAdmin(req, res, next) {
    const authHeader = req.headers["x-auth"];
    if (!authHeader || authHeader !== "admin") {
        res.status(403).send("Acceso no autorizado, no se cuenta con privilegios de administrador!");
        return;
    }
    next();
}


router.use(express.json());


router.post("/", validateAdmin, (req, res) => {
    try {
        const {
            title,
            description,
            imageUrl,
            unit,
            stock,
            pricePerUnit,
            category
        } = req.body;
        if (!title || !description || !unit || !stock || !pricePerUnit ||!category || !imageUrl) {
            throw new Error("Faltan atributos en el body!");
        }
        
        let uuid = utils.generateUUID();
        const product = {
            uuid,
            title,
            description,
            imageUrl,
            unit,
            stock,
            pricePerUnit,
            category
        };
        const new_product = new Product(product);
        dataHandler.createProduct(new_product);
        res.status(201).send(new_product.title);
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }
    
});


router.put("/:id", validateAdmin, (req, res) => {
    try {
        const uuid = req.params.id;
        const product = dataHandler.getProductById(uuid);

        if (!product) {
            res.status(404).send("El producto con ID " + uuid + " no fue encontrado!");
            return;
        }

        const {
            title,
            description,
            imageUrl,
            unit,
            stock,
            pricePerUnit,
            category
        } = req.body;

        if (!title || !description || !unit || !stock || !pricePerUnit || !category || !imageUrl) {
            throw new Error("Faltan atributos en el body!");
        }

        const updated_product = {
            uuid: uuid,
            title,
            description,
            imageUrl,
            unit,
            stock,
            pricePerUnit,
            category
        };
        const new_product = new Product(updated_product);
        dataHandler.updateProduct(new_product);
        res.status(200).send(product.title);
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }
});


router.delete("/:id", validateAdmin, (req, res) => {
    const id = req.params.id;
    const product = dataHandler.getProductById(id);

    if (!product) {
        res.status(404).send("El producto con ID " + id + " no fue encontrado!");
        return;
    }
    dataHandler.deleteProduct(id);
    res.status(200).send(product.title);
});


module.exports = router;
