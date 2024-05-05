// Cart_handler
function initializeCart() {
    if (!sessionStorage.getItem('cart')) {
        const initialCart = [];
        sessionStorage.setItem('cart', JSON.stringify(initialCart));
    }
}

function getCart() {
    return JSON.parse(sessionStorage.getItem('cart'));
}

function addToCart(product, quantity) {
    let cart = getCart() || [];

    const existingProduct = cart.find(item => item._uuid === product._uuid);
    if (existingProduct) {
        existingProduct.quantity += parseInt(quantity);
    } else {
        const newProduct = { ...product, quantity: parseInt(quantity) };
        cart.push(newProduct);
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item._uuid !== productId);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
}

function clearCart() {
    sessionStorage.removeItem('cart');
}

// Load_products
function getProducts() {
    const endpoint = '/products';

    fetch(endpoint)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(products => {
            console.log('Lista de productos:', products);
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error cargando productos:', error);
        });
}

function addToCartClicked(event) {
    const productId = event.target.getAttribute('data-product-id');
    const quantityModal = new bootstrap.Modal(document.getElementById('quantityModal'));

    quantityModal.show();

    document.getElementById('confirmQuantity').addEventListener('click', async function () {
        const quantity = document.getElementById('quantityInput').value;
        if (quantity > 0) {
            try {
                const response = await fetch(`/products/${productId}`);
                if (response.ok) {
                    const product = await response.json();
                    // console.log('Producto:', product, 'Cantidad:', quantity);
                    addToCart(product, quantity);
                    quantityModal.hide();
                } else {
                    throw new Error('Network response was not ok.');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        } else {
            alert('Por favor, ingresa una cantidad válida.');
        }
    });
}

function displayProducts(products) {
    const productsContainer = document.querySelector('.container .row.row-cols-1');

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
    }

    productsContainer.innerHTML = '';

    const productsToDisplay = 8;
    let productsDisplayed = 0;

    products.forEach(product => {
        if (productsDisplayed < productsToDisplay && product._category === 'CPUs') {
            const productCard = document.createElement('div');
            productCard.classList.add('col', 'mb-4');
            productCard.innerHTML = `
            <div class="card h-100">
                <img class="card-img-top img-fluid" src="${product._imageUrl}" alt="${product._title}">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h4 class="card-title">${product._title}</h4>
                    <p class="card-text">${product._description}</p>
                    <button id="add_to_cart" class="btn btn-primary add-to-cart" data-product-id="${product._uuid}">Añadir al carrito</button>
                </div>
            </div>
            `;
            productsContainer.appendChild(productCard);
            productsDisplayed++;
        }
    });

    const addToCartButtons = productsContainer.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCartClicked);
    });
}

function redirectToCart() {
    const cartProducts = JSON.parse(sessionStorage.getItem('cart'));
    
    if (!cartProducts || cartProducts.length === 0) {
        console.log('No hay productos en el carrito.');
        return;
    }

    const uuids = cartProducts.map(product => ({ uuid: product._uuid }));

    fetch('/products/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uuids)
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/shopping_cart.html';
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .catch(error => {
        console.error('Error fetching cart products:', error);
    });
}

//const cartButton = document.getElementById('cartButton');
//cartButton.addEventListener('click', redirectToCart);

getProducts()