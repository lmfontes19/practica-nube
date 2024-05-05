const ProductException = require("./products");
const path = require("path");
const fs = require("fs");
const dbpath = path.join(__dirname, "../data/products.json");


function loadProducts() {
    const productsData = fs.readFileSync(dbpath);
    try {
        return JSON.parse(productsData);
    } catch (error) {
        console.log(error);
        return;
    }
}


function getProducts() {
    return loadProducts();
}


function getProductById(uuid) {
    const products = loadProducts();
    for(let i = 0; i < products.length; i++) {
        if(products[i]._uuid === uuid)
            return products[i]
    }
}


function createProduct(product) {
    try {
        const new_list = []
        const products = loadProducts();
        if (products.length === 0) {
            new_list.push(product);
        } else {
            for(let i = 0; i < products.length; i++)
                new_list.push(products[i]);
            new_list.push(product);
        }
        fs.writeFileSync(dbpath, JSON.stringify(new_list), "utf8");
        
    } catch {
        throw new ProductException("No se han podido crear el producto!");
    }
}


function updateProduct(product) {
    const product_up = getProductById(product.uuid);
    if (!product_up) {
        throw new ProductException("Producto no encontrado.");
    }

    deleteProduct(product_up._uuid);
    createProduct(product)
}


function deleteProduct(uuid) {
    const product_del = getProductById(uuid);
    let products = loadProducts();

    if (!product_del) {
        throw new ProductException("Producto no encontrado.");
    }

    const index = products.indexOf(product_del);
    products.splice(index, 1);
    saveProducts(products);
}


function saveProducts(products) {
    const productsJson = JSON.stringify(products);
    fs.writeFileSync(dbpath, productsJson, "utf8");
}


function findProduct(query) {
    const parts = query.split(":");
    const category = parts[0];
    const title = parts[1];

    const products = loadProducts();
    if (parts.length === 1) {
        return products.filter((product) => product.category.includes(category));
    } else {
        return products.filter((product) => product.category.includes(category) && product.title.includes(title));
    }
}


exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.findProduct = findProduct;
