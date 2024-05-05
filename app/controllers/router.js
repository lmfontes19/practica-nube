const express = require("express");
const path = require("path");
const productRouter = require("../routes/products");
const adminProductRouter = require("../routes/admin_products");


const router = express.Router();


function validateAdmin(req, res, next) {
    const authHeader = req.headers["x-auth"];
    if (!authHeader || authHeader !== "admin") {
        res.status(403).send("Acceso no autorizado, no se cuenta con privilegios de administrador!");
        return;
    }
    next();
}


router.use("/products", productRouter);
router.use("/admin/products", validateAdmin, adminProductRouter);


router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/home.html"));
});


router.get("/home.html", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/home.html"));
});


router.get("/shopping_cart.html", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/shopping_cart.html"));
});

router.get("/about_us.html", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/about_us.html"));
});

router.get("/cat_A.html", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/cat_A.html"));
});

router.get("/cat_B.html", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/cat_B.html"));
});


module.exports = router
