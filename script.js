// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }
    
    lastScroll = currentScroll;
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, observerOptions);

// Observe all sections and project cards
document.querySelectorAll('section, .project-card, .skill-category').forEach(element => {
    observer.observe(element);
});

// Dynamic year for copyright
const currentYear = new Date().getFullYear();
document.querySelector('.footer p').textContent = `© ${currentYear} Masood Nazari. All rights reserved.`;

// GitHub Projects Integration (Optional)
// You can fetch your GitHub repositories dynamically
async function loadGitHubProjects() {
    try {
        const username = 'MichaelTheAnalyst';
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        const projectsContainer = document.getElementById('projects-container');
        
        // Clear existing placeholder projects
        projectsContainer.innerHTML = '';
        
        repos.forEach(repo => {
            const projectCard = createProjectCard(repo);
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.log('Using default project cards');
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Determine icon based on language
    const iconMap = {
        'Python': 'fa-python',
        'JavaScript': 'fa-js',
        'Java': 'fa-java',
        'HTML': 'fa-html5',
        'CSS': 'fa-css3-alt',
        'TypeScript': 'fa-code',
        'default': 'fa-code'
    };
    
    const icon = iconMap[repo.language] || iconMap['default'];
    
    card.innerHTML = `
        <div class="project-icon">
            <i class="fas ${icon}"></i>
        </div>
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description available'}</p>
        <div class="project-tags">
            ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
            ${repo.topics ? repo.topics.slice(0, 2).map(topic => `<span class="tag">${topic}</span>`).join('') : ''}
        </div>
        <div class="project-links">
            <a href="${repo.html_url}" target="_blank" class="project-link">
                <i class="fab fa-github"></i> View Code
            </a>
            ${repo.homepage ? `
                <a href="${repo.homepage}" target="_blank" class="project-link">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Uncomment the line below to automatically load GitHub projects
// loadGitHubProjects();

// Typing effect for hero subtitle
const subtitleElement = document.querySelector('.hero-subtitle');
const subtitleText = subtitleElement.textContent;
subtitleElement.textContent = '';

let charIndex = 0;
function typeText() {
    if (charIndex < subtitleText.length) {
        subtitleElement.textContent += subtitleText.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 100);
    }
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeText, 500);
});

// Modal functionality for project screenshots
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (!modal) {
        // Create modal if it doesn't exist
        const modalHTML = `
            <div id="imageModal" class="modal">
                <span class="modal-close" onclick="closeModal()">&times;</span>
                <div class="modal-content">
                    <img id="modalImage" src="" alt="Project Screenshot">
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    const newModal = document.getElementById('imageModal');
    const newModalImg = document.getElementById('modalImage');
    newModalImg.src = imageSrc;
    newModal.classList.add('active');
    
    // Close on background click
    newModal.addEventListener('click', function(e) {
        if (e.target === newModal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Hero Carousel Functionality
let currentSlide = 0;
let slides = [];
let dots = [];
let totalSlides = 0;

function updateCarousel() {
    slides = document.querySelectorAll('.carousel-slide');
    dots = document.querySelectorAll('.dot');
    totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Update track position
    const track = document.querySelector('.carousel-track');
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

function moveCarousel(direction) {
    slides = document.querySelectorAll('.carousel-slide');
    totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    currentSlide += direction;
    
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Auto-play carousel (optional)
let carouselInterval;
function startCarousel() {
    carouselInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000); // Change slide every 5 seconds
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

// Touch/Swipe support
let touchStartX = 0;
let touchEndX = 0;

function initCarouselEvents() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopCarousel();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startCarousel();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                moveCarousel(1);
            } else {
                // Swipe right - previous slide
                moveCarousel(-1);
            }
        }
    }
    
    // Mouse drag support for desktop
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    
    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - carousel.offsetLeft;
        stopCarousel();
    });
    
    carousel.addEventListener('mouseleave', () => {
        isDragging = false;
        startCarousel();
    });
    
    carousel.addEventListener('mouseup', () => {
        isDragging = false;
        startCarousel();
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        
        if (Math.abs(walk) > 100) {
            if (walk > 0) {
                moveCarousel(-1);
            } else {
                moveCarousel(1);
            }
            isDragging = false;
        }
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
}

// Initialize carousel after page loads
window.addEventListener('load', () => {
    updateCarousel();
    startCarousel();
    initCarouselEvents();
});

