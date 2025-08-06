async function loadTopAnnouncements() {
    try {
        const response = await fetch('/api/announcements', {
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

        // Update dots for news slider
        const dotsContainer = document.querySelector('.news-slider-dots');
        dotsContainer.innerHTML = '';
        for (let i = 0; i < data.announcements.length; i++) {
            const dot = document.createElement('span');
            dot.className = `news-dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => currentNewsSlide(i + 1);
            dotsContainer.appendChild(dot);
        }
    } catch (error) {
        console.error('Error loading top announcements:', error);
    }
}

// Theme Toggle Functionality
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isNight = document.body.classList.contains('dark-theme');
    favicon.setAttribute('href', isNight ? '../static/images/Dark.png' : '../static/images/Light.png');
    localStorage.setItem('darkTheme', isNight);
}

// Check for saved theme preference and apply it
function initializeTheme() {
    if (localStorage.getItem('darkTheme') === 'true') {
        document.body.classList.add('dark-theme');
        favicon.setAttribute('href', '../static/images/Dark.png');
    }
}

function initializeRippleEffects() {
    document.querySelectorAll('.click-effect').forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// Ripple effect for buttons
function createRipple(event) {
    const button = event.currentTarget;
    
    // Remove any existing ripple
    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }

    // Create new ripple
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    // Get click position relative to button
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;

    // Create and style the ripple
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.classList.add('ripple');

    // Add ripple to button
    button.appendChild(circle);

    // Remove ripple after animation
    circle.addEventListener('animationend', () => circle.remove());
}

// Add ripple styles
function addRippleStyles() {
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            .click-effect {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple-effect 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }
            
            @keyframes ripple-effect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    // Close dropdowns on outside click (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.dropdown').forEach(d => {
                if (!d.contains(e.target)) d.classList.remove('open');
            });
        }
    });

    // Dropdown menu click for mobile/touch
    document.querySelectorAll('.dropdown > a').forEach(anchor => {
        if (!anchor.dataset.hasMenuHandler) {
            anchor.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parent = this.parentElement;
                    parent.classList.toggle('open');
                    // Close others
                    document.querySelectorAll('.dropdown').forEach(d => {
                        if (d !== parent) d.classList.remove('open');
                    });
                }
            });
            anchor.dataset.hasMenuHandler = 'true';
        }
    });
}

// Category card hover effects
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Cart functionality
function initializeCart() {
    // Initialize cart from localStorage or create empty cart
    window.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    updateCartBadge();

    document.querySelector('.cart-icon').addEventListener('click', () => window.location.href = '/payment')
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

function showCartNotification(product) {
    const notification = document.querySelector('.cart-notification');
    notification.innerHTML = `
        <div><strong>${product.name}</strong> added to cart!</div>
        <button class="click-effect" onclick="window.location.href='/payment'">View Cart</button>
    `;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

function addToCart(product) {
    // Check if product already exists in cart
    const existingItem = window.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        window.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(window.cart));
    
    // Update UI
    updateCartBadge();
    showCartNotification(product);
}

// Initialize all general functionality
document.addEventListener('DOMContentLoaded', async () => {
    addRippleStyles();
    initializeTheme();

    if (document.querySelector('title').innerText!='Checkout - TO DO company'){
        console.log("hfh")
        initializeCart();
    }
    
    initializeMobileMenu();

    await loadTopAnnouncements();

    // News Slider functionality
    let currentNewsSlideIndex = 0;
    const newsSlides = document.querySelectorAll('.news-slide');
    const newsDots = document.querySelectorAll('.news-dot');
    const totalNewsSlides = newsSlides.length;

    function showNewsSlide(index) {
        newsSlides.forEach(slide => slide.classList.remove('active'));
        newsDots.forEach(dot => dot.classList.remove('active'));

        newsSlides[index].classList.add('active');
        newsDots[index].classList.add('active');
    }

    function changeNewsSlide(direction) {
        currentNewsSlideIndex += direction;
        if (currentNewsSlideIndex >= totalNewsSlides) currentNewsSlideIndex = 0;
        if (currentNewsSlideIndex < 0) currentNewsSlideIndex = totalNewsSlides - 1;
        showNewsSlide(currentNewsSlideIndex);
    }

    // Auto-advance news slides
    setInterval(() => {
        changeNewsSlide(1);
    }, 4000);

    document.querySelector('.news-slider-nav.prev').addEventListener('click', () => changeNewsSlide(-1));
    document.querySelector('.news-slider-nav.next').addEventListener('click', () => changeNewsSlide(1));

    document.querySelector('.logo').addEventListener('click', () => window.location.href = '/');    
    
});
