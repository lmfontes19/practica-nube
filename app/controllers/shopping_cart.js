class ShoppingCart {
    constructor() {
        this._proxies = [];
        this._products = [];
    };

    addItem(productUuid, amount) {
        if (this._existProduct(productUuid)) {
            this.updateItem(productUuid, amount);
        } else {
            this._proxies.push(new ProductProxy(productUuid, amount));
            this._products.push(this._getProductUuid(productUuid));
        }
    }

    updateItem(productUuid, newAmount) {
        const index = this._getProxyIndex(productUuid);
        const proxy = this._proxies[index];
        proxy.amount += newAmount;

        if (proxy.amount === 0) {
            this.removeItem(productUuid);
        }
    }

    removeItem(productUuid) {
        const index = this._getProxyIndex(productUuid);
        this._proxies.splice(index, 1);
        this._products.splice(index, 1);
    }

    _existProduct(productUuid) {
        return this._proxies.some((proxy) => proxy.productUuid === productUuid);
    }

    _getProxyIndex(productUuid) {
        return this._proxies.findIndex((proxy) => proxy.productUuid === productUuid);
    }

    _getProductUuid(productUuid) {
        return this._products.find((product) => product.uuid === productUuid);
    }

    calculateTotal() {
        const total = this._proxies.reduce((acc, proxy) => acc + proxy.amount * proxy.product.pricePerUnit, 0);
        return total;
    }
}


class ProductProxy {
    constructor(uuid, cantidad) {
        this._ProductUuid = uuid;
        this._cantidad = cantidad;
    };

    set productUuid(productUuid) {
        throw new ShoppingCartException("El uuid del producto no puede ser establecido por el usuario.");
    }

    get productUuid() {
        return this._productUuid;
    }

    set amount(amount) {
        if (amount < 0) {
            throw new ShoppingCartException("La cantidad no puede ser negativa.");
        }

        this._amount = amount;
    }

    get amount() {
        return this._amount;
    }
}


class ShoppingCartException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

module.exports = ShoppingCart;
