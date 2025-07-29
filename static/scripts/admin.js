// Handle file input changes and upload images
async function handleImageUpload(fileInput, productId) {
    const file = fileInput.files[0];
    if (!file) return null;

    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        fileInput.value = '';
        return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId);

    try {
        const response = await fetch('http://localhost:5000/api/upload-image', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Upload failed');

        const result = await response.json();
        if (result.success) {
            console.log('Image uploaded successfully:', result.url);
            return result.url;
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload image. Please try again.');
        fileInput.value = '';
    }
    return null;
}

// Load top announcements from API
async function loadAnnouncements() {
    try {
        const response = await fetch('http://localhost:5000/api/announcements', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const announcementList = document.querySelector('.announcement-list');
        announcementList.innerHTML = ''; // Clear existing announcements

        data.announcements.forEach(announcement => {
            const newAnnouncement = document.createElement('div');
            newAnnouncement.className = 'announcement-item';
            newAnnouncement.dataset.id = announcement.id;
            newAnnouncement.innerHTML = `
                <div class="announcement-content">
                    <input type="text" value="${announcement.text}" class="announcement-input">
                </div>
                <div class="announcement-actions">
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            announcementList.appendChild(newAnnouncement);
        });
    } catch (error) {
        console.error('Error loading announcements:', error);
    }
}

// Load hero slides from API
async function loadHeroSlides() {
    try {
        const response = await fetch('http://localhost:5000/api/hero-slides', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const heroSlides = document.querySelector('.hero-slides');
        heroSlides.innerHTML = ''; // Clear existing slides
        
        data.heroSlides.forEach(slide => {
            const newSlide = document.createElement('div');
            newSlide.className = 'hero-slide';
            newSlide.dataset.id = slide.id;
            newSlide.innerHTML = `
                <h3>Slide ${slide.id}</h3>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" placeholder="Slide Title" value="${slide.title}" class="slide-title-input">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea placeholder="Slide Description" class="slide-description-input">${slide.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Button Text</label>
                    <input type="text" placeholder="Button Text" value="${slide.buttonText}" class="slide-button-text-input">
                </div>
                <div class="form-group">
                    <label>Button Link</label>
                    <input type="text" placeholder="#" value="${slide.buttonLink}" class="slide-button-link-input">
                </div>
                <div class="slide-actions">
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            heroSlides.appendChild(newSlide);
        });
    } catch (error) {
        console.error('Error loading hero slides:', error);
    }
}

// Save announcements to JSON
async function saveAnnouncements() {
    const announcements = [];
    document.querySelectorAll('.announcement-item').forEach((item, index) => {
        announcements.push({
            id: parseInt(item.dataset.id) || index + 1,
            text: item.querySelector('.announcement-input').value
        });
    });

    try {
        const response = await fetch('http://localhost:5000/api/announcements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ announcements })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error saving announcements:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Save hero slides to JSON
    async function saveHeroSlides() {
        const heroSlides = [];
        document.querySelectorAll('.hero-slide').forEach((item, index) => {
            heroSlides.push({
                id: parseInt(item.dataset.id) || index + 1,
                title: item.querySelector('.slide-title-input').value || '',
                description: item.querySelector('.slide-description-input').value || '',
                buttonText: item.querySelector('.slide-button-text-input').value || '',
                buttonLink: item.querySelector('.slide-button-link-input').value || '#'
            });
        });

        try {
            const response = await fetch('http://localhost:5000/api/hero-slides', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ heroSlides })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error saving hero slides:', error);
        }
    }

    // Load existing content
    loadAnnouncements();
    loadHeroSlides();

    // Add New Announcement
    document.querySelector('.add-announcement-btn').addEventListener('click', () => {
        const announcementList = document.querySelector('.announcement-list');
        const newId = document.querySelectorAll('.announcement-item').length + 1;
        const newAnnouncement = document.createElement('div');
        newAnnouncement.className = 'announcement-item';
        newAnnouncement.dataset.id = newId;
        newAnnouncement.innerHTML = `
            <div class="announcement-content">
                <input type="text" placeholder="New Announcement" class="announcement-input">
            </div>
            <div class="announcement-actions">
                <button class="delete-btn">Delete</button>
            </div>
        `;
        announcementList.appendChild(newAnnouncement);
        saveAnnouncements();
    });

    // Load all products
    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            const productList = document.querySelector('.product-list');
            const featuredProductsList = document.querySelector('.featured-products-list');
            
            // Clear existing products in both lists
            productList.innerHTML = '';
            if (featuredProductsList) {
                featuredProductsList.innerHTML = '';
            }

            data.products.forEach((product, index) => {
                // Create product card for main product list
                const newProduct = document.createElement('div');
                newProduct.className = 'product-card fade-in';
                newProduct.dataset.id = product.id;
                newProduct.innerHTML = `
                    <div class="form-group">
                        <label>Sale Badge</label>
                        <input type="text" value="${product.sale}" class="sale-badge-input" placeholder="Sale Badge">
                    </div>
                    <div class="form-group">
                        <label>Product Image</label>
                        <input type="file" accept="image/*" class="product-image-input">
                        <div class="image-preview"></div>
                    </div>
                    <div class="product-info">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" value="${product.name}" class="product-name-input" placeholder="Product Name">
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <input type="text" value="${product.description}" class="product-description-input" placeholder="Product Description">
                        </div>
                        <div class="form-group">
                            <label>Features</label>
                            <input type="text" value="${product.features}" class="product-features-input placeholder="Feature 1, Feature 2">
                        </div>
                        <div class="form-group">
                            <label>Price</label>
                            <input type="text" value="${product.price}" class="product-price-input" placeholder="0.00">
                        </div>
                        <div class="admin-actions">
                            <button class="delete-btn">Delete</button>
                        </div>
                    </div>
                `;
                
                // Create product card for featured products selection
                if (featuredProductsList) {
                    const featuredProductCard = document.createElement('div');
                    featuredProductCard.className = 'featured-product-card';
                    featuredProductCard.dataset.id = product.id;
                    featuredProductCard.innerHTML = `
                        <div class="product-info">
                            <h4>${product.name}</h4>
                            <p>${product.description}</p>
                            <div class="price">${product.price}</div>
                        </div>
                        <div class="featured-actions">
                            <button class="toggle-feature-btn">Add to Featured</button>
                        </div>
                    `;
                    featuredProductsList.appendChild(featuredProductCard);
                }
                
                // Add event listener for image upload
                const imageInput = newProduct.querySelector('.product-image-input');
                const imagePreview = newProduct.querySelector('.image-preview');
                
                imagePreview.innerHTML = `<img src="${product.image}" alt="Product Image" style="max-width: 200px;">`;

                imageInput.addEventListener('change', async () => {
                    console.log('Image input changed');
                    const url = await handleImageUpload(imageInput, product.id);
                    imagePreview.innerHTML = `<img src="${url}" alt="Product Image" style="max-width: 200px;">`;
                    saveProducts();
                });

                productList.appendChild(newProduct);
            });
            
        }catch (error) {
            console.error('Error loading products:', error);
        }
    }

    // Add new product
    document.querySelector('.add-product-btn').addEventListener('click', () => {
        const productList = document.querySelector('.product-list');
        const newId = document.querySelectorAll('.product-card').length + 1;
        
        const newProduct = document.createElement('div');
        newProduct.className = 'product-card';
        newProduct.dataset.id = newId;
        newProduct.innerHTML = `
            <div class="form-group">
                <label>Product Image</label>
                <input type="file" accept="image/*" class="product-image-input">
                <div class="image-preview"></div>
            </div>
            <div class="form-group">
                <label>Product Name</label>
                <input type="text" class="product-name-input" placeholder="Product Name">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="product-description-input" placeholder="Product Description"></textarea>
            </div>
            <div class="form-group">
                <label>Features</label>
                <textarea class="product-features-input" placeholder="Product Features"></textarea>
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="text" class="product-price-input" placeholder="0.00">
            </div>
            <div class="form-group">
                <label>Sale Badge (optional)</label>
                <input type="text" class="sale-badge-input" placeholder="e.g., 20% OFF">
            </div>
            <div class="admin-actions">
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Add event listener for image upload
        const imageInput = newProduct.querySelector('.product-image-input');
        const imagePreview = newProduct.querySelector('.image-preview');
        const imageUrlInput = newProduct.querySelector('.product-image-url');

        imageInput.addEventListener('change', async () => {
            console.log('Image input changed for product ID:', newProduct.dataset.id);
            const url = await handleImageUpload(imageInput, newProduct.dataset.id);
            console.log('Image URL:', url);
            if (url) {
                imageUrlInput.value = url;
                imagePreview.innerHTML = `<img src="${url}" alt="Product Image" style="max-width: 200px;">`;
                saveProducts();
            }
        });

        productList.appendChild(newProduct);
        saveProducts();
    });

    // Save products to JSON
    async function saveProducts() {
        const products = [];
        document.querySelectorAll('.product-card').forEach((item, index) => {
            products.push({
                id: parseInt(item.dataset.id) || index + 1,
                name: item.querySelector('.product-name-input').value,
                description: item.querySelector('.product-description-input').value,
                features: item.querySelector('.product-features-input').value,
                price: item.querySelector('.product-price-input').value,
                sale: item.querySelector('.sale-badge-input').value,
                image: `../static/images/Products_Images/${item.dataset.id}.jpg`
            });
        });

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ products })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error saving products:', error);
        }
    }

    // Load existing products
    loadProducts();
    loadMainProducts();

    // Function to manage featured products
    async function loadMainProducts() {
        try {
            const response = await fetch('http://localhost:5000/api/main-products');
            const data = await response.json();
            const selectedIDs = data.selectedIDs || [];

            // Update UI to show selected products
            document.querySelectorAll('.featured-product-card').forEach(card => {
                // Ensure card has a dataset id
                const id = parseInt(card.dataset.id);
                const button = card.querySelector('.toggle-feature-btn');
                if (selectedIDs.includes(id)) {
                    button.classList.add('selected');
                    button.textContent = 'Remove from Featured';
                } else {
                    button.classList.remove('selected');
                    button.textContent = 'Add to Featured';
                }
            });
        } catch (error) {
            console.error('Error loading main products:', error);
        }
    }

    // Function to save featured products
    async function saveMainProducts() {
        const selectedIDs = [];
        document.querySelectorAll('.featured-product-card .toggle-feature-btn.selected').forEach(button => {
            const card = button.closest('.featured-product-card');
            selectedIDs.push(parseInt(card.dataset.id));
        });

        try {
            const response = await fetch('http://localhost:5000/api/main-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ selectedIDs })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error saving main products:', error);
        }
    }

    // Handle featured product selection
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-feature-btn')) {
            const selectedButtons = document.querySelectorAll('.toggle-feature-btn.selected');
            
            if (!e.target.classList.contains('selected') && selectedButtons.length >= 6) {
                alert('You can only select up to 6 featured products');
                return;
            }

            e.target.classList.toggle('selected');
            e.target.textContent = e.target.classList.contains('selected') ? 
                'Remove from Featured' : 'Add to Featured';
            
            saveMainProducts();
        }
    });

    // Add New Hero Slide
    document.querySelector('.add-slide-btn').addEventListener('click', () => {
        const heroSlides = document.querySelector('.hero-slides');
        const newId = document.querySelectorAll('.hero-slide').length + 1;
        const newSlide = document.createElement('div');
        newSlide.className = 'hero-slide';
        newSlide.dataset.id = newId;
        newSlide.innerHTML = `
            <h3>Slide ${newId}</h3>
            <div class="form-group">
                <label>Title</label>
                <input type="text" placeholder="Slide Title" class="slide-title-input">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea placeholder="Slide Description" class="slide-description-input"></textarea>
            </div>
            <div class="form-group">
                <label>Button Text</label>
                <input type="text" placeholder="Button Text" class="slide-button-text-input">
            </div>
            <div class="form-group">
                <label>Button Link</label>
                <input type="text" placeholder="#" class="slide-button-link-input">
            </div>
            <div class="slide-actions">
                <button class="delete-btn">Delete</button>
            </div>
        `;
        heroSlides.appendChild(newSlide);
        saveHeroSlides();
    });

    // Handle input changes
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('announcement-input')) {
            saveAnnouncements();
        } else if (e.target.classList.contains('slide-title-input') || 
                   e.target.classList.contains('slide-description-input') ||
                   e.target.classList.contains('slide-button-text-input') ||
                   e.target.classList.contains('slide-button-link-input')) {
            saveHeroSlides();
        } else if (e.target.classList.contains('product-name-input') ||
                   e.target.classList.contains('product-description-input') ||
                   e.target.classList.contains('product-features-input') ||
                   e.target.classList.contains('product-price-input') ||
                   e.target.classList.contains('sale-badge-input') ||
                   e.target.classList.contains('product-image-input')) {
            saveProducts();
        }
    });

    // Delete buttons functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this item?')) {
                const item = e.target.closest('.announcement-item, .hero-slide, .product-card');
                item.remove();
                if (item.classList.contains('announcement-item')) {
                    saveAnnouncements();
                } else if (item.classList.contains('hero-slide')) {
                    saveHeroSlides();
                } else if (item.classList.contains('product-card')) {
                    saveProducts();
                }
            }
        }
    });


});
