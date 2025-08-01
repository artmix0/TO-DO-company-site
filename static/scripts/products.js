// Load all products from JSON
async function loadProducts() {
    try {
        console.log('Loading products...');
        const response = await fetch('http://localhost:5000/api/products', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        console.log('Products data:', data);

        if (!data.products || !Array.isArray(data.products)) {
            console.error('Invalid products data format:', data);
            return;
        }

        const productShowcase = document.querySelector('.product-showcase');
        if (!productShowcase) {
            console.error('Product showcase element not found');
            return;
        }

        // Clear existing products
        productShowcase.innerHTML = '';

        // Create a section for each product
        data.products.forEach(product => {
            const productSection = document.createElement('div');
            productSection.className = 'product-hero';
            productSection.innerHTML = `
                <div class="product-hero-image">
                    <img src="${product.image || '../static/images/Products_Images/' + product.id + '.png'}" 
                         alt="${product.name}" 
                         onerror="this.src='../static/images/Light.png';">
                </div>
                <div class="product-hero-info">
                    <h1>${product.name || 'Unnamed Product'}</h1>
                    <p class="price">${product.price || 'Price not set'}</p>
                    <div class="description">
                        <p>${product.description || 'No description available'}</p>
                        ${product.features ? `
                            <ul>
                                ${product.features.split(',').map(feature => 
                                    `<li>${feature.trim()}</li>`
                                ).join('')}
                            </ul>
                        ` : ''}
                    </div>
                    <aside class="product-actions">
                        ${product.sale ? `<span class="sale-badge">${product.sale}</span>` : ''}
                        <button class="buy-button click-effect add-to-cart-btn">Add to Cart</button>
                        <button class="buy-button click-effect buy-now-btn">Buy now</button>
                    </aside>
                </div>
            `;
            productShowcase.appendChild(productSection);

            // Add event listeners for the buttons
            const addToCartBtn = productSection.querySelector('.add-to-cart-btn');
            const buyNowBtn = productSection.querySelector('.buy-now-btn');

            addToCartBtn.addEventListener('click', () => {
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
                    image: product.image || '../static/images/Products_Images/' + product.id + '.png'
                });
            });

            buyNowBtn.addEventListener('click', () => {
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
                    image: product.image || '../static/images/Products_Images/' + product.id + '.png'
                });
                window.location.href = '/payment';
            });
        });

    } catch (error) {
        console.error('Error loading products:', error);
        const productShowcase = document.querySelector('.product-showcase');
        if (productShowcase) {
            productShowcase.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
        }
    }
}

function initializeRippleEffects() {
    document.querySelectorAll('.click-effect').forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// Load products when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts()
    initializeRippleEffects();
});

