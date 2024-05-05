class ProductException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

class Product {
    constructor(data) {
        this._uuid = data.uuid;
        this._title = data.title;
        this._description = data.description;
        this._imageUrl = data.imageUrl;
        this._unit = data.unit;
        this._stock = data.stock;
        this._pricePerUnit = data.pricePerUnit;
        this._category = data.category;
    }

    set uuid(value) {
        throw new ProductException("El uuid del producto no puede ser establecido por el usuario.")
    }

    get uuid() {
        return this._uuid;
    }

    set title(title) {
        if (!title || typeof title !== "string")
            throw new ProductException("El título no puede estar vacío y tiene que ser un string.");
        this._title = title;
    }

    get title() {
        return this._title;
    }

    set description(description) {
        if (!description || typeof description !== "string")
            throw new ProductException("La descripcion no puede estar vacío y tiene que ser un string.");
        this._description = description;
    }

    set imageUrl(imageUrl) {
        if (!imageUrl || typeof imageUrl !== "string")
            throw new ProductException("La url de la imagen no puede estar vacío y tiene que ser un string.");
        this._imageUrl = imageUrl;
    }

    get imageUrl() {
        return this._imageUrl;
    }

    set unit(unit) {
        if (!unit || typeof unit !== "number" || unit < 0)
            throw new ProductException("Las unidades no pueden estar vacías y tiene que ser un numero positivo.");
        this._unit = unit;
    }

    get unit() {
        return this._unit;
    }

    set stock(stock) {
        if (!stock || typeof stock !== "number" || stock < 0)
            throw new ProductException("El stock no puede estar vacío y tiene que ser un numero positivo.");
        this._stock = stock;
    }

    get stock() {
        return this._stock;
    }

    set pricePerUnit(pricePerUnit) {
        if (!pricePerUnit || typeof pricePerUnit !== "number" || pricePerUnit < 0)
            throw new ProductException("El precio por unidad no puede estar vacío y tiene que ser un numero positivo.");
        this._pricePerUnit = pricePerUnit;
    }

    get pricePerUnit() {
        return this._pricePerUnit;
    }

    set category(category) {
        if (!category || typeof category !== "string")
            throw new ProductException("La categoria no puede estar vacía y tiene que ser un string.");
        this._category = category;
    }

    get category() {
        return this._category;
    }

    static createFromJson(jsonValue) {
        const productData = JSON.parse(jsonValue);
        return new Product(productData);
    }

    static createFromObject(obj) {
        const productData = {};
        for (const key in obj) {
            if (Product.prototype.hasOwnProperty(key)) {
                productData[key] = obj[key];
            }
        }
        return new Product(productData);
    }

    static cleanObject(obj) {
        const productData = {};
        for (const key in obj) {
            if (Product.prototype.hasOwnProperty(key)) {
                productData[key] = obj[key];
            }
        }
        return productData;
    }
}

module.exports = Product;
