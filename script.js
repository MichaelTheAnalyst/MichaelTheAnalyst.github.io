// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
    
    // Keyboard support for hamburger menu
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
        }
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

// Modal functionality for project screenshots with swipe support
let modalImages = [];
let currentModalIndex = 0;
let modalCarouselId = null;

function openModal(imageSrc, imgElement) {
    // Find which carousel this image belongs to (if any)
    let clickedImg = imgElement;
    if (!clickedImg && event?.target) {
        clickedImg = event.target.tagName === 'IMG' ? event.target : null;
    }
    if (!clickedImg) {
        clickedImg = document.querySelector(`img[src="${imageSrc}"]`);
    }
    
    // Check for project carousel
    const projectCarousel = clickedImg?.closest('.project-carousel');
    // Check for certificate carousel
    const certificateTrack = clickedImg?.closest('.certifications-track');
    // Check for recommendation images
    const isRecommendation = imageSrc.includes('rec1.png') || imageSrc.includes('rec2.png') || imageSrc.includes('rec3.png');
    
    if (projectCarousel) {
        modalCarouselId = projectCarousel.getAttribute('data-carousel');
        const slides = projectCarousel.querySelectorAll('.carousel-slide img');
        modalImages = Array.from(slides).map(img => img.src);
        currentModalIndex = modalImages.indexOf(imageSrc);
    } else if (certificateTrack) {
        // Handle certificate carousel
        modalCarouselId = 'certifications';
        const certificateCards = certificateTrack.querySelectorAll('.certificate-card img');
        modalImages = Array.from(certificateCards).map(img => img.src);
        currentModalIndex = modalImages.indexOf(imageSrc);
    } else if (isRecommendation) {
        // Handle recommendation images - load all 3 recommendations
        modalCarouselId = 'recommendations';
        modalImages = ['assets/rec1.png', 'assets/rec2.png', 'assets/rec3.png'];
        currentModalIndex = modalImages.indexOf(imageSrc);
        // If imageSrc not found (e.g., from button click), find by index
        if (currentModalIndex === -1) {
            if (imageSrc.includes('rec1.png')) currentModalIndex = 0;
            else if (imageSrc.includes('rec2.png')) currentModalIndex = 1;
            else if (imageSrc.includes('rec3.png')) currentModalIndex = 2;
            else currentModalIndex = 0;
        }
    } else {
        // Fallback for non-carousel images
        modalImages = [imageSrc];
        currentModalIndex = 0;
        modalCarouselId = null;
    }
    
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (!modal) {
        // Create modal if it doesn't exist
        const modalHTML = `
            <div id="imageModal" class="modal">
                <span class="modal-close" onclick="closeModal()">&times;</span>
                <button class="modal-nav modal-prev" onclick="navigateModal(-1)" aria-label="Previous">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="modal-nav modal-next" onclick="navigateModal(1)" aria-label="Next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="modal-content">
                    <img id="modalImage" src="" alt="Project Screenshot">
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        initModalSwipe();
    }
    
    const newModal = document.getElementById('imageModal');
    const newModalImg = document.getElementById('modalImage');
    newModalImg.src = imageSrc;
    newModal.classList.add('active');
    
    updateModalNavigation();
    
    // Close on background click
    newModal.addEventListener('click', function(e) {
        if (e.target === newModal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Arrow key navigation
    const arrowHandler = function(e) {
        if (e.key === 'ArrowLeft') {
            navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
            navigateModal(1);
        }
    };
    document.addEventListener('keydown', arrowHandler);
    
    // Store handler for cleanup
    newModal._arrowHandler = arrowHandler;
}

function navigateModal(direction) {
    if (modalImages.length <= 1) return;
    
    currentModalIndex += direction;
    
    if (currentModalIndex < 0) {
        currentModalIndex = modalImages.length - 1;
    } else if (currentModalIndex >= modalImages.length) {
        currentModalIndex = 0;
    }
    
    const modalImg = document.getElementById('modalImage');
    if (modalImg) {
        modalImg.src = modalImages[currentModalIndex];
    }
    
    updateModalNavigation();
}

function updateModalNavigation() {
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    
    if (prevBtn && nextBtn) {
        // Show/hide buttons based on number of images
        if (modalImages.length > 1) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }
}

function initModalSwipe() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleModalSwipe();
    }, { passive: true });
    
    function handleModalSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                navigateModal(1); // Swipe left - next
            } else {
                navigateModal(-1); // Swipe right - previous
            }
        }
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        // Clean up event listeners
        if (modal._arrowHandler) {
            document.removeEventListener('keydown', modal._arrowHandler);
        }
    }
    modalImages = [];
    currentModalIndex = 0;
    modalCarouselId = null;
}

// Project Carousel Functionality (Multiple Carousels)
const projectCarousels = {};

function initProjectCarousel(carouselId) {
    const carousel = document.querySelector(`[data-carousel="${carouselId}"]`);
    if (!carousel) return;
    
    projectCarousels[carouselId] = {
        currentSlide: 0,
        slides: carousel.querySelectorAll('.carousel-slide'),
        dots: carousel.querySelectorAll('.dot'),
        track: carousel.querySelector('.carousel-track')
    };
    
    updateProjectCarousel(carouselId);
}

function updateProjectCarousel(carouselId) {
    const carousel = projectCarousels[carouselId];
    if (!carousel) return;
    
    const { slides, dots, currentSlide, track } = carousel;
    const totalSlides = slides.length;
    
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
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

function moveProjectCarousel(carouselId, direction) {
    const carousel = projectCarousels[carouselId];
    if (!carousel) return;
    
    const { slides } = carousel;
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    carousel.currentSlide += direction;
    
    if (carousel.currentSlide < 0) {
        carousel.currentSlide = totalSlides - 1;
    } else if (carousel.currentSlide >= totalSlides) {
        carousel.currentSlide = 0;
    }
    
    updateProjectCarousel(carouselId);
}

function goToProjectSlide(carouselId, index) {
    const carousel = projectCarousels[carouselId];
    if (!carousel) return;
    
    carousel.currentSlide = index;
    updateProjectCarousel(carouselId);
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

// Touch/Swipe support for project carousels
function initProjectCarouselEvents() {
    const projectCarousels = document.querySelectorAll('.project-carousel');
    
    projectCarousels.forEach(carousel => {
        const carouselId = carousel.getAttribute('data-carousel');
        if (!carouselId) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Touch events
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(carouselId);
        }, { passive: true });
        
        function handleSwipe(id) {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    moveProjectCarousel(id, 1);
                } else {
                    moveProjectCarousel(id, -1);
                }
            }
        }
        
        // Mouse drag support
        let isDragging = false;
        let startX = 0;
        
        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - carousel.offsetLeft;
        });
        
        carousel.addEventListener('mouseleave', () => {
            isDragging = false;
        });
        
        carousel.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            
            if (Math.abs(walk) > 100) {
                if (walk > 0) {
                    moveProjectCarousel(carouselId, -1);
                } else {
                    moveProjectCarousel(carouselId, 1);
                }
                isDragging = false;
            }
        });
    });
}

// Initialize all project carousels
function initAllProjectCarousels() {
    initProjectCarousel('fraud-detection');
    initProjectCarousel('bank-marketing');
    initProjectCarouselEvents();
}

// Initialize on page load
window.addEventListener('load', () => {
    initAllProjectCarousels();
    initRecommendationCarousel();
    initCertificateCarousel();
});

// ===================================
// RECOMMENDATION CAROUSEL
// ===================================
let recommendationCarousel = {
    currentSlide: 0,
    totalSlides: 3,
    track: null,
    dots: []
};

function initRecommendationCarousel() {
    const carousel = document.querySelector('.recommendations-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.recommendations-track');
    const dots = carousel.querySelectorAll('.recommendation-dot');
    
    recommendationCarousel = {
        currentSlide: 0,
        totalSlides: 3,
        track: track,
        dots: dots
    };
    
    updateRecommendationCarousel();
    setupRecommendationSwipe();
}

function updateRecommendationCarousel() {
    const { track, dots, currentSlide } = recommendationCarousel;
    
    if (!track) return;
    
    // Calculate translateX based on screen size
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile: show one card at a time
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
    } else {
        // Desktop: show all 3 cards, navigation just updates focus (no shift)
        track.style.transform = `translateX(0%)`;
        
        // Add focus effect to active card
        const cards = track.querySelectorAll('.recommendation-card');
        cards.forEach((card, index) => {
            // Reset all cards first
            card.style.opacity = '';
            card.style.transform = '';
            card.style.zIndex = '';
            
            if (index === currentSlide) {
                card.style.opacity = '1';
                card.style.transform = 'scale(1.02)';
                card.style.zIndex = '2';
            } else {
                card.style.opacity = '0.92';
                card.style.transform = 'scale(0.98)';
                card.style.zIndex = '1';
            }
        });
    }
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function moveRecommendationCarousel(direction) {
    const { totalSlides, currentSlide } = recommendationCarousel;
    
    recommendationCarousel.currentSlide += direction;
    
    if (recommendationCarousel.currentSlide < 0) {
        recommendationCarousel.currentSlide = totalSlides - 1;
    } else if (recommendationCarousel.currentSlide >= totalSlides) {
        recommendationCarousel.currentSlide = 0;
    }
    
    updateRecommendationCarousel();
}

function goToRecommendationSlide(index) {
    recommendationCarousel.currentSlide = index;
    updateRecommendationCarousel();
}

// Swipe support for recommendation carousel
function setupRecommendationSwipe() {
    const carousel = document.querySelector('.recommendations-carousel');
    if (!carousel) return;
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTranslate = 0;
    let currentTranslate = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        const { track, currentSlide } = recommendationCarousel;
        const isMobile = window.innerWidth <= 768;
        startTranslate = isMobile ? -currentSlide * 100 : 0;
        track.style.transition = 'none';
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            const cardWidth = carousel.offsetWidth;
            currentTranslate = startTranslate + (diff / cardWidth * 100);
            if (recommendationCarousel.track) {
                recommendationCarousel.track.style.transform = `translateX(${currentTranslate}%)`;
            }
        }
        // Desktop: don't show drag, just detect swipe direction
    });
    
    carousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        recommendationCarousel.track.style.transition = '';
        
        const isMobile = window.innerWidth <= 768;
        const threshold = isMobile ? 30 : 50; // Minimum swipe distance (pixels for desktop)
        
        if (isMobile) {
            const diff = currentTranslate - startTranslate;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    moveRecommendationCarousel(-1); // Swipe right = previous
                } else {
                    moveRecommendationCarousel(1); // Swipe left = next
                }
            } else {
                updateRecommendationCarousel(); // Snap back
            }
        } else {
            // Desktop: detect swipe direction from pixel difference
            const diff = currentX - startX;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    moveRecommendationCarousel(-1); // Swipe right = previous
                } else {
                    moveRecommendationCarousel(1); // Swipe left = next
                }
            }
        }
    });
    
    // Mouse drag support
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        const { track, currentSlide } = recommendationCarousel;
        const isMobile = window.innerWidth <= 768;
        startTranslate = isMobile ? -currentSlide * 100 : 0;
        track.style.transition = 'none';
        carousel.style.cursor = 'grabbing';
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            currentX = e.clientX;
            const diff = currentX - startX;
            const cardWidth = carousel.offsetWidth;
            currentTranslate = startTranslate + (diff / cardWidth * 100);
            
            if (recommendationCarousel.track) {
                recommendationCarousel.track.style.transform = `translateX(${currentTranslate}%)`;
            }
        }
        // Desktop: don't show drag, just track for swipe detection
        currentX = e.clientX;
    });
    
    carousel.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        recommendationCarousel.track.style.transition = '';
        carousel.style.cursor = '';
        
        const isMobile = window.innerWidth <= 768;
        const threshold = isMobile ? 30 : 50; // pixels for desktop
        
        if (isMobile) {
            const diff = currentTranslate - startTranslate;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    moveRecommendationCarousel(-1);
                } else {
                    moveRecommendationCarousel(1);
                }
            } else {
                updateRecommendationCarousel();
            }
        } else {
            // Desktop: detect swipe direction from pixel difference
            const diff = currentX - startX;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    moveRecommendationCarousel(-1);
                } else {
                    moveRecommendationCarousel(1);
                }
            }
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            recommendationCarousel.track.style.transition = '';
            carousel.style.cursor = '';
            updateRecommendationCarousel();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const carouselElement = document.querySelector('.recommendations-carousel');
        if (!carouselElement) return;
        
        const rect = carouselElement.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                moveRecommendationCarousel(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                moveRecommendationCarousel(1);
            }
        }
    });
    
    // Update on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateRecommendationCarousel();
        }, 250);
    });
}

// ===================================
// CERTIFICATE CAROUSEL
// ===================================
let certificateCarousel = {
    currentSlide: 0,
    totalSlides: 12,
    track: null,
    dots: []
};

function initCertificateCarousel() {
    const carousel = document.querySelector('.certifications-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.certifications-track');
    const dots = carousel.querySelectorAll('.certificate-dot');
    
    certificateCarousel = {
        currentSlide: 0,
        totalSlides: 12,
        track: track,
        dots: dots
    };
    
    updateCertificateCarousel();
    setupCertificateSwipe();
}

function updateCertificateCarousel() {
    const { track, dots, currentSlide } = certificateCarousel;
    
    if (!track) return;
    
    // Calculate translateX based on screen size
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile: show one card at a time
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
    } else {
        // Desktop: show 3 cards, navigation shifts them
        const cardWidth = 100 / 3; // Each card is 33.33% of container
        const gapPercent = (2 * 16) / track.offsetWidth * 100; // Convert gap to percentage
        const translateX = -currentSlide * (cardWidth + gapPercent);
        track.style.transform = `translateX(${translateX}%)`;
        
        // Add focus effect to visible cards
        const cards = track.querySelectorAll('.certificate-card');
        cards.forEach((card, index) => {
            // Reset all cards first
            card.style.opacity = '';
            
            // Show cards that are in view
            if (index >= currentSlide && index < currentSlide + 3) {
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0.3';
            }
        });
    }
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function moveCertificateCarousel(direction) {
    const { totalSlides, currentSlide } = certificateCarousel;
    const isMobile = window.innerWidth <= 768;
    const maxSlide = isMobile ? totalSlides - 1 : totalSlides - 3;
    
    certificateCarousel.currentSlide += direction;
    
    if (certificateCarousel.currentSlide < 0) {
        certificateCarousel.currentSlide = maxSlide;
    } else if (certificateCarousel.currentSlide > maxSlide) {
        certificateCarousel.currentSlide = 0;
    }
    
    updateCertificateCarousel();
}

function goToCertificateSlide(index) {
    const isMobile = window.innerWidth <= 768;
    const maxSlide = isMobile ? certificateCarousel.totalSlides - 1 : certificateCarousel.totalSlides - 3;
    
    certificateCarousel.currentSlide = Math.min(index, maxSlide);
    updateCertificateCarousel();
}

// Swipe support for certificate carousel
function setupCertificateSwipe() {
    const carousel = document.querySelector('.certifications-carousel');
    if (!carousel) return;
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTranslate = 0;
    let currentTranslate = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        const { track, currentSlide } = certificateCarousel;
        const isMobile = window.innerWidth <= 768;
        startTranslate = isMobile ? -currentSlide * 100 : -currentSlide * (100 / 3 + (2 * 16) / track.offsetWidth * 100);
        track.style.transition = 'none';
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            const cardWidth = carousel.offsetWidth;
            currentTranslate = startTranslate + (diff / cardWidth * 100);
            if (certificateCarousel.track) {
                certificateCarousel.track.style.transform = `translateX(${currentTranslate}%)`;
            }
        }
        // Desktop: don't show drag, just track for swipe detection
    });
    
    carousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        certificateCarousel.track.style.transition = '';
        
        const isMobile = window.innerWidth <= 768;
        const threshold = isMobile ? 30 : 50; // Minimum swipe distance
        
        if (isMobile) {
            const diff = currentTranslate - startTranslate;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    moveCertificateCarousel(-1); // Swipe right = previous
                } else {
                    moveCertificateCarousel(1); // Swipe left = next
                }
            } else {
                updateCertificateCarousel(); // Snap back
            }
        } else {
            // Desktop: detect swipe direction from pixel difference
            const diff = currentX - startX;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    moveCertificateCarousel(-1);
                } else {
                    moveCertificateCarousel(1);
                }
            }
        }
    });
    
    // Mouse drag support
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        const { track, currentSlide } = certificateCarousel;
        const isMobile = window.innerWidth <= 768;
        startTranslate = isMobile ? -currentSlide * 100 : -currentSlide * (100 / 3 + (2 * 16) / track.offsetWidth * 100);
        track.style.transition = 'none';
        carousel.style.cursor = 'grabbing';
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            currentX = e.clientX;
            const diff = currentX - startX;
            const cardWidth = carousel.offsetWidth;
            currentTranslate = startTranslate + (diff / cardWidth * 100);
            
            if (certificateCarousel.track) {
                certificateCarousel.track.style.transform = `translateX(${currentTranslate}%)`;
            }
        }
        // Desktop: don't show drag, just track for swipe detection
        currentX = e.clientX;
    });
    
    carousel.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        certificateCarousel.track.style.transition = '';
        carousel.style.cursor = '';
        
        const isMobile = window.innerWidth <= 768;
        const threshold = isMobile ? 30 : 50;
        
        if (isMobile) {
            const diff = currentTranslate - startTranslate;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    moveCertificateCarousel(-1);
                } else {
                    moveCertificateCarousel(1);
                }
            } else {
                updateCertificateCarousel();
            }
        } else {
            // Desktop: detect swipe direction from pixel difference
            const diff = currentX - startX;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    moveCertificateCarousel(-1);
                } else {
                    moveCertificateCarousel(1);
                }
            }
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            certificateCarousel.track.style.transition = '';
            carousel.style.cursor = '';
            updateCertificateCarousel();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const carouselElement = document.querySelector('.certifications-carousel');
        if (!carouselElement) return;
        
        const rect = carouselElement.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                moveCertificateCarousel(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                moveCertificateCarousel(1);
            }
        }
    });
    
    // Update on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCertificateCarousel();
        }, 250);
    });
}

// ===================================
// COOKIE CONSENT BANNER
// ===================================
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

function updateConsentMode(analyticsConsent, adConsent) {
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': analyticsConsent ? 'granted' : 'denied',
            'ad_storage': adConsent ? 'granted' : 'denied'
        });
    }
}

function showConsentBanner() {
    const consentBanner = document.getElementById('cookieConsent');
    if (consentBanner) {
        consentBanner.style.display = 'block';
    }
}

function hideConsentBanner() {
    const consentBanner = document.getElementById('cookieConsent');
    if (consentBanner) {
        consentBanner.style.display = 'none';
    }
}

function handleConsent(accepted) {
    // Store consent preference
    setCookie('cookie_consent', accepted ? 'accepted' : 'rejected', 365);
    setCookie('cookie_consent_date', new Date().toISOString(), 365);
    
    // Update Google Analytics consent mode
    updateConsentMode(accepted, false); // Analytics consent, no ad consent (no ads on portfolio)
    
    // Hide banner
    hideConsentBanner();
    
    // If accepted, reload GA config to start tracking
    if (accepted && typeof gtag !== 'undefined') {
        gtag('config', 'G-NT8JFEDV4M', {
            'anonymize_ip': true
        });
    }
}

// Initialize consent banner on page load
document.addEventListener('DOMContentLoaded', () => {
    const consent = getCookie('cookie_consent');
    
    // If no consent cookie exists, show banner
    if (!consent) {
        // Small delay to ensure page is loaded
        setTimeout(() => {
            showConsentBanner();
        }, 1000);
    } else {
        // If consent was previously given, update consent mode
        const wasAccepted = consent === 'accepted';
        updateConsentMode(wasAccepted, false);
    }
    
    // Add event listeners to buttons
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => handleConsent(true));
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => handleConsent(false));
    }
    
    // ===================================
    // KEYBOARD NAVIGATION ENHANCEMENTS
    // ===================================
    // Make clickable images keyboard accessible
    document.querySelectorAll('img[role="button"]').forEach(img => {
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                img.click();
            }
        });
    });
    
    // Add keyboard support for carousel dots
    document.querySelectorAll('.dot, .recommendation-dot, .certificate-dot').forEach(dot => {
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dot.click();
            }
        });
    });
    
    // Update aria-selected when dots are clicked
    document.querySelectorAll('.carousel-dots, .recommendation-carousel-dots, .certificate-carousel-dots').forEach(container => {
        const dots = container.querySelectorAll('[role="tab"]');
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                dots.forEach(d => {
                    d.setAttribute('aria-selected', 'false');
                    d.classList.remove('active');
                });
                dot.setAttribute('aria-selected', 'true');
                dot.classList.add('active');
            });
        });
    });
    
    // ===================================
    // CONTACT FORM HANDLING
    // ===================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim() || 'Portfolio Contact Form';
            const message = document.getElementById('contactMessage').value.trim();
            
            // Get button elements
            const submitBtn = contactForm.querySelector('.form-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';
            submitBtn.style.cursor = 'not-allowed';
            
            // Create mailto link
            const mailtoSubject = encodeURIComponent(subject);
            const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:Michaelnazary@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
            
            // Simulate a brief delay for better UX, then open email client
            setTimeout(() => {
                window.location.href = mailtoLink;
                
                // Show success state
                btnLoading.style.display = 'none';
                btnText.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
                btnText.style.display = 'flex';
                submitBtn.style.background = 'var(--accent-teal)';
                submitBtn.style.opacity = '1';
                
                // Reset form and button after delay
                setTimeout(() => {
                    contactForm.reset();
                    btnText.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    submitBtn.style.cursor = 'pointer';
                }, 3000);
            }, 500);
        });
    }
});

