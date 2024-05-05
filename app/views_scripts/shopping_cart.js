function getCart() {
    return JSON.parse(sessionStorage.getItem('cart'));
}

function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item._uuid !== productId);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
}

function loadShoppingCart() {
    const shoppingCartContainer = document.getElementById('shopping_container');
    shoppingCartContainer.id = 'container${product._uuid}';

    const cartProducts = JSON.parse(sessionStorage.getItem('cart'));

    shoppingCartContainer.innerHTML = '';

    cartProducts.forEach(product => {
        const mediaBox = document.createElement('div');
        mediaBox.classList.add('border', 'p-3');

        const row = document.createElement('div');
        row.classList.add('row');

        const col = document.createElement('div');
        col.classList.add('col-md-6');

        const media = document.createElement('div');
        media.id = 'media-box';
        media.classList.add('media');

        const mediaLeft = document.createElement('div');
        mediaLeft.classList.add('media-left', 'media-top');

        const productImage = document.createElement('img');
        productImage.id = 'img-prod';
        productImage.src = product._imageUrl;
        productImage.classList.add('media-object');
        productImage.style.width = '60px';

        mediaLeft.appendChild(productImage);

        const mediaBody = document.createElement('div');
        mediaBody.classList.add('media-body');

        const productTitle = document.createElement('h2');
        productTitle.classList.add('media-heading');
        productTitle.textContent = product._title;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.id = 'delete${product._title}'
        deleteButton.addEventListener('click', () => {
            removeFromCart(product._uuid);
            shoppingCartContainer.remove();
            location.reload();
        });

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-primary', 'edit-button');
        editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('btn', 'btn-secondary', 'mr-2');
        cancelButton.textContent = 'Cancelar';
        cancelButton.style.display = 'none;'
        cancelButton.addEventListener('click', () => {
            quantityInput.readOnly = true;
            quantityInput.value = product.quantity;
            editButton.style.display = 'inline';
            cancelButton.style.display = 'none';
            confirmButton.style.display = 'none';
        });

        const confirmButton = document.createElement('button');
        confirmButton.classList.add('btn', 'btn-primary');
        confirmButton.textContent = 'Confirmar';
        confirmButton.style.display = 'none;'
        confirmButton.addEventListener('click', () => {
            const newQuantity = parseInt(quantityInput.value);
            if (newQuantity >= 0) {
                product.quantity = newQuantity;
                quantityInput.readOnly = true;
                editButton.style.display = 'inline';
                cancelButton.style.display = 'none';
                confirmButton.style.display = 'none';
                editButton.style.display = '';

                if (!isNaN(newQuantity) && newQuantity >= 0) {
                    product.quantity = newQuantity;
                    let total = document.getElementById("total${product._title}");
                    total.innerHTML = `<b>${product._title}:</b> ${product.quantity} x $${product._pricePerUnit} `;
                    let total_final = document.getElementById('final_${product._title}');
                    const totalPrice = cartProducts.reduce((total, product) => total + product._pricePerUnit * product.quantity, 0);
                    total_final.innerHTML = `Total: $${totalPrice} MXN`;
                }
            } else {
                alert('La cantidad no puede ser negativa');
            }
        });

        editButton.addEventListener('click', () => {
            quantityInput.readOnly = false;
            quantityInput.focus();
            mediaBody.appendChild(cancelButton);
            mediaBody.appendChild(confirmButton);
            cancelButton.style.display = 'inline';
            confirmButton.style.display = 'inline';
        });

        productTitle.appendChild(deleteButton);
        productTitle.appendChild(editButton);
        mediaBody.appendChild(productTitle);

        const quantityInputGroup = document.createElement('div');
        quantityInputGroup.classList.add('input-group', 'mb-3');

        const quantityInputGroupText = document.createElement('span');
        quantityInputGroupText.classList.add('input-group-text');
        quantityInputGroupText.textContent = 'Cantidad';

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.classList.add('form-control');
        quantityInput.placeholder = 'Cantidad';
        quantityInput.min = 1;
        quantityInput.value = product.quantity;
        quantityInput.readOnly = true;

        quantityInputGroup.appendChild(quantityInputGroupText);
        quantityInputGroup.appendChild(quantityInput);
        quantityInputGroup.appendChild(editButton);
        mediaBody.appendChild(quantityInputGroup);

        const priceInputGroup = document.createElement('div');
        priceInputGroup.classList.add('input-group', 'mb-3');

        const priceInputGroupText = document.createElement('span');
        priceInputGroupText.classList.add('input-group-text');
        priceInputGroupText.textContent = 'Precio';

        const priceInput = document.createElement('input');
        priceInput.type = 'text';
        priceInput.classList.add('form-control');
        priceInput.placeholder = 'Precio';
        priceInput.min = 1;
        priceInput.value = product._pricePerUnit;
        priceInput.readOnly = true;

        const priceCurrency = document.createElement('span');
        priceCurrency.classList.add('input-group-text');
        priceCurrency.textContent = 'MXN';

        priceInputGroup.appendChild(priceInputGroupText);
        priceInputGroup.appendChild(priceInput);
        priceInputGroup.appendChild(priceCurrency);

        mediaBody.appendChild(priceInputGroup);

        media.appendChild(mediaLeft);
        media.appendChild(mediaBody);

        col.appendChild(media);
        row.appendChild(col);
        mediaBox.appendChild(row);
        shoppingCartContainer.appendChild(mediaBox);
    });
}

function createTotalContainer() {
    const shoppingCartContainer = document.getElementById('total_container');
    const cartProducts = JSON.parse(sessionStorage.getItem('cart'));

    shoppingCartContainer.innerHTML = '';

    const borderDiv = document.createElement('div');
    borderDiv.classList.add('border', 'p-3');
    borderDiv.id = "border"

    const mediaBox = document.createElement('div');
    mediaBox.id = 'media-box';
    mediaBox.classList.add('media');

    const mediaBody = document.createElement('div');
    mediaBody.classList.add('media-body');

    const title = document.createElement('h2');
    title.classList.add('media-heading');
    title.textContent = 'Total de compra:';
    mediaBody.appendChild(title);

    cartProducts.forEach(product => {
        const productInfo = document.createElement('p');
        productInfo.id = 'total${product._title}';
        productInfo.innerHTML = `<b>${product._title}:</b> ${product.quantity} x $${product._pricePerUnit} `;
        mediaBody.appendChild(productInfo);
    });

    const totalPrice = cartProducts.reduce((total, product) => total + product._pricePerUnit * product.quantity, 0);
    const total = document.createElement('h4');
    total.id = 'final_${product._title}';
    total.textContent = `Total: $${totalPrice} MXN`;
    mediaBody.appendChild(total);

    const payButton = document.createElement('button');
    payButton.classList.add('btn', 'btn-primary', 'btn-block');
    payButton.textContent = 'Pagar';

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn', 'btn-danger', 'btn-block', 'mt-2');
    cancelButton.textContent = 'Cancelar';
    cancelButton.style.marginLeft = '5px';
    cancelButton.style.marginBottom = '5px';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.width = '15%';
    buttonsContainer.appendChild(payButton);
    buttonsContainer.appendChild(cancelButton);

    mediaBody.appendChild(buttonsContainer);

    mediaBox.appendChild(mediaBody);
    borderDiv.appendChild(mediaBox);
    shoppingCartContainer.appendChild(borderDiv);

    return borderDiv;
}

loadShoppingCart();
createTotalContainer();