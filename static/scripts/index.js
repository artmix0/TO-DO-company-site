// Smooth scrolling for navigation links
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

// Product card interaction
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(-5px) scale(1)';
    });
});

// Button click effects
document.querySelectorAll('.click-effect').forEach(button => {
    button.addEventListener('click', function (e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    position: absolute;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);

// Newsletter form submission
document.querySelector('.newsletter-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('.newsletter-input').value;
    if (email) {
        alert('Thank you for subscribing! You\'ll receive your $10 off coupon soon.');
        this.reset();
    }
});

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

function currentNewsSlide(index) {
    currentNewsSlideIndex = index - 1;
    showNewsSlide(currentNewsSlideIndex);
}

// Auto-advance news slides
setInterval(() => {
    changeNewsSlide(1);
}, 4000);

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

// Dropdown menu click for mobile/touch
document.querySelectorAll('.dropdown > a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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
});
// Close dropdowns on outside click (mobile)
document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.dropdown').forEach(d => {
            if (!d.contains(e.target)) d.classList.remove('open');
        });
    }
});

// Theme Toggle Functionality
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isNight = document.body.classList.contains('dark-theme');
    favicon.setAttribute('href', isNight ? '../static/images/Dark.png' : '../static/images/Light.png');
    localStorage.setItem('darkTheme', isNight);
}

// Check for saved theme preference
if (localStorage.getItem('darkTheme') === 'true') {
    document.body.classList.add('dark-theme');
    favicon.setAttribute('href', '../static/images/Dark.png');
}