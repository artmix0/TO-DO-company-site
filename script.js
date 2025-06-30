let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const sliderTrack = document.querySelector('.slider-track');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  sliderTrack.style.transform = `translateX(-${index * 25}%)`;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function previousSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
}

setInterval(nextSlide, 4000);

function toggleMenu() {
  const menu = document.querySelector('.menu');
  const toggle = document.querySelector('.menu-toggle');
  menu.classList.toggle('active');
  toggle.classList.toggle('active');
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const menu = document.querySelector('.menu');
    const toggle = document.querySelector('.menu-toggle');
    if (menu.classList.contains('active')) {
      menu.classList.remove('active');
      toggle.classList.remove('active');
    }
  });
});

function fadeInElements() {
  const elements = document.querySelectorAll('.service, .project');
  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 150) {
      el.classList.add('animate-fade-in');
    }
  });
}

window.addEventListener('scroll', fadeInElements);

document.addEventListener('DOMContentLoaded', () => {
  showSlide(0);
  fadeInElements();

  document.querySelectorAll('.quote-btn, .primary-btn').forEach(button => {
    button.addEventListener('click', () => {
      alert('Contact us at contact@todocompany.com or call +1 (555) 123-4567.');
    });
  });

  const viewPortfolio = document.querySelector('.secondary-btn');
  if (viewPortfolio) {
    viewPortfolio.addEventListener('click', () => {
      document.getElementById('projects').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }
});
