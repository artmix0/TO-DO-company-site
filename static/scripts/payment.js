window.cart = JSON.parse(localStorage.getItem('cart') || '{}');
console.log(cart);

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');

    if (window.cart.length === 0) {
        // Hide cart summary section when cart is empty
        document.querySelector('.payment-grid').style.display = 'none';
        
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Browse our products and add some items to your cart!</p>
                <button class="browse-products-btn click-effect" onclick="window.location.href='/products'">Browse Products</button>
            </div>
        `;
        cartSummary.innerHTML = '';
        cartSummary.style.display = 'none';
        return;
    }

    // Display cart items
    cartItems.innerHTML = window.cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    Quantity: ${item.quantity}
                </div>
            </div>
            <button class="cart-item-remove click-effect" onclick="removeFromCart('${item.id}')">🗑️</button>
        </div>
    `).join('');

    // Show payment grid and cart summary when items exist
    document.querySelector('.payment-grid').style.display = 'grid';
    cartSummary.style.display = 'block';
    
    // Calculate and display total
    const total = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSummary.innerHTML = `
        <div class="cart-total">
            Total: $${total.toFixed(2)}
        </div>
        <button class="pay-button click-effect" onclick="proceedToCheckout()">Proceed to Checkout</button>
    `;
}

function removeFromCart(productId) {
    let product = window.cart.find(item => item.id == productId);
    console.log(product)
    if (product.quantity > 1){
        product.quantity -= 1
        localStorage.setItem('cart', JSON.stringify(window.cart))
    }
    else{
        window.cart = window.cart.filter(item => item != product)
        localStorage.setItem('cart', JSON.stringify(window.cart));
    }
    displayCart();
}

function proceedToCheckout() {
    
}

// Initialize cart display when page loads
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
});
