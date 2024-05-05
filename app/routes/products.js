const express = require("express");
const router = express.Router();
const dataHandler = require("../controllers/data_handler");

router.get("/", (req, res) => {
    const products = dataHandler.getProducts();
    res.json(products);
});

router.get("/", (req, res) => {
    const products = dataHandler.getProducts();
    if (req.query.category || req.query.title) {
        const filteredProducts = dataHandler.findProduct(
            req.query.category + ":" + req.query.title
        );
        res.json(filteredProducts);
    } else {
        res.json(products);
    }
});

router.post("/cart", (req, res) => {
    if (!Array.isArray(req.body)) {
        res.status(400).send("El body recibido debe ser de tipo arreglo!");
        return;
    }
    let products = [];
    const body = req.body;
    for (let i = 0; i < body.length; i++) {
        const productFound = dataHandler.getProductById(body[i].uuid);
        if (!productFound) {
            res.status(404).send("El producto con ID " + body[i].uuid + " no fue encontrado!");
            return;
        }
        products.push(productFound);
    }
    res.status(200).json(products);
});

router.get("/:id", (req, res) => {
    let id = req.params.id;
    const product = dataHandler.getProductById(id);
    if (!product) {
        res.status(404).send("El producto con ID " + id + " no fue encontrado");
        return;
    }
    res.status(200).json(product);
});

module.exports = router;
