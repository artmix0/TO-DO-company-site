// Load hero slides from JSON
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
        const sliderContainer = document.querySelector('.announcement-slider-container');

        // Clear existing slides
        sliderContainer.innerHTML = '';

        data.heroSlides.forEach((slide, index) => {
            const newSlide = document.createElement('div');
            newSlide.className = `slide ${index === 0 ? 'active' : ''}`;
            newSlide.innerHTML = `
                <div class="slide-content">
                    <h1 class="slide-title">${slide.title}</h1>
                    <p class="slide-description">${slide.description}</p>
                    <button class="slide-button click-effect" onclick="location.href='${slide.buttonLink}'">${slide.buttonText}</button>
                </div>
            `;
            sliderContainer.appendChild(newSlide);
        });

        // Update dots for hero slider
        const dotsContainer = document.querySelector('.slider-dots');


        dotsContainer.innerHTML = '';

        for (let i = 0; i < data.heroSlides.length; i++) {
            const dot = document.createElement('span');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => currentSlide(i + 1);
            dotsContainer.appendChild(dot);
        }
    } catch (error) {
        console.error('Error loading hero slides:', error);
    }
}

// Load products from JSON
async function loadProducts() {
    try {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) {
            console.error('Product grid element not found! Ensure the HTML has a .product-grid element.');
            return;
        }

        // Load all products
        console.log('Fetching products from API...');
        const productsResponse = await fetch('http://localhost:5000/api/products', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const productsData = await productsResponse.json();
        
        // Load selected product indexes
        console.log('Fetching main products configuration...');
        const mainProductsResponse = await fetch('http://localhost:5000/api/main-products', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const mainProductsData = await mainProductsResponse.json();
        
        productGrid.innerHTML = '';

        // Check if we have selected indexes, if not show all products (up to 6)
        const IDs = mainProductsData.selectedIDs || 
                       Array.from({ length: Math.min(6, productsData.products.length) }, (_, i) => i);
    
        console.log('Displaying products with IDs:', productsData.products);
        // Display products
        IDs.forEach(id => {
           const product = productsData.products.find(p => p.id === id);
            
            const newProduct = document.createElement('div');
            newProduct.className = 'product-card';
            newProduct.style.display = 'flex';
            newProduct.style.flexDirection = 'column';
            newProduct.innerHTML = `
                ${product.sale ? `<div class="sale-badge">${product.sale}</div>` : ''}
                <div class="product-image" style="width: 100%; min-height: 200px;">
                    <img src="${product.image}" alt="Product Image">
                </div>
                <div class="product-info" style="padding: 15px;">
                    <h3 class="product-name" style="margin: 0 0 10px 0;">${product.name || 'Unnamed Product'}</h3>
                    <p class="product-description" style="margin: 0 0 10px 0;">${product.description || 'No description available'}</p>
                    ${product.features ? `<p class="product-features">${product.features}</p>` : ''}
                    <div class="product-price" style="font-weight: bold; margin: 10px 0;">${product.price || 'Price not set'}</div>
                    <button class="product-button click-effect">View product</button>
                </div>
            `;
            productGrid.appendChild(newProduct);
            console.log('Product card added to grid:', newProduct);
        });

        console.log('Total products rendered:', productGrid.children.length);
    } catch (error) {
        console.error('Error loading products:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('Network error - Is the server running at http://localhost:5000?');
        }
    }
}

// Load announcements from JSON
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
        const newsSliderContainer = document.querySelector('.news-slider-container');

        // Clear existing announcements
        newsSliderContainer.innerHTML = '';

        data.announcements.forEach((announcement, index) => {
            const newSlide = document.createElement('div');
            newSlide.className = `news-slide ${index === 0 ? 'active' : ''}`;
            newSlide.innerHTML = `
                <div class="news-slide-content">
                    ${announcement.text}
                </div>
            `;
            newsSliderContainer.appendChild(newSlide);
        });

        // Update dots
        const dotsContainer = document.querySelector('.news-slider-dots');
        dotsContainer.innerHTML = '';
        for (let i = 0; i < data.announcements.length; i++) {
            const dot = document.createElement('span');
            dot.className = `news-dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => currentNewsSlide(i + 1);
            dotsContainer.appendChild(dot);
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
    }
}

function initializeRippleEffects() {
    document.querySelectorAll('.click-effect').forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load data
        await loadTopAnnouncements();
        await loadHeroSlides();
        await loadProducts();
        
        // Initialize ripple effects
        initializeRippleEffects();
    } catch (error) {
        console.error('Error initializing page:', error);
    }

    // Smooth scrolling
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Product card hover effects
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            card.style.transform = 'translateY(-8px) scale(1.02)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            card.style.transform = '';
        }
    });

    // Hero Slider functionality
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function changeSlide(direction) {
        currentSlideIndex += direction;
        if (currentSlideIndex >= totalSlides) currentSlideIndex = 0;
        if (currentSlideIndex < 0) currentSlideIndex = totalSlides - 1;
        showSlide(currentSlideIndex);
    }

    function currentSlide(index) {
        currentSlideIndex = index - 1;
        showSlide(currentSlideIndex);
    }

    // Auto-advance hero slides
    setInterval(() => {
        changeSlide(1);
    }, 5000);

    document.querySelector('.slider-nav.prev').addEventListener('click', () => changeSlide(-1));
    document.querySelector('.slider-nav.next').addEventListener('click', () => changeSlide(1));
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Product card hover effects
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.product-card')) {
        const card = e.target.closest('.product-card');
        card.style.transform = 'translateY(-8px) scale(1.02)';
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.product-card')) {
        const card = e.target.closest('.product-card');
        card.style.transform = '';
    }
});
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(-5px) scale(1)';
    });
});

// Newsletter form submission
document.querySelector('.newsletter-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('.newsletter-input').value;
    if (email) {
        alert('Thank you for subscribing! You\'ll receive your $10 off coupon soon.');
        this.reset();
    }
});