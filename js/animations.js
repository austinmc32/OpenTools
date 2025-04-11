export function initializeAnimations() {
    // Add class for gradient background
    document.body.classList.add('gradient-bg');
    
    // Initialize starfield
    initStarfield();
    
    // Add sequential fade-in to containers
    document.querySelectorAll('.tools-container, .featured-tools-section, .pinned-tools-section').forEach(
        container => container.classList.add('fade-in-sequence')
    );
    
    // Add animation delays to featured cards
    document.querySelectorAll('.featured-card').forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
    
    // Add animation to tool cards on page scroll
    initScrollAnimations();
}

// Create and initialize starfield background
function initStarfield() {
    let starfieldContainer = document.createElement('div');
    starfieldContainer.className = 'starfield-container';
    // Ensure it's added to the body if it wasn't already guaranteed
    if (!document.querySelector('.starfield-container')) {
        document.body.appendChild(starfieldContainer);
    } else {
        // If it exists, clear it before adding new stars
        document.querySelector('.starfield-container').innerHTML = '';
        starfieldContainer = document.querySelector('.starfield-container');
    }

    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    const starCount = Math.floor((currentWidth * currentHeight) / 15000); // Adjusted density slightly

    const stars = [];
    const starBaseSize = 0.15; // Base size in vmin
    const starSizeVariance = 0.2; // Max additional size in vmin

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Position using viewport percentages
        const xPercent = Math.random() * 100;
        const yPercent = Math.random() * 100;

        // Size using vmin for relative scaling
        const size = starBaseSize + Math.random() * starSizeVariance;

        // Use fixed, low-opacity colors for subtlety
        const color = `rgba(220, 235, 255, ${0.3 + Math.random() * 0.3})`; // Opacity between 0.3 and 0.6

        star.style.left = `${xPercent}vw`;
        star.style.top = `${yPercent}vh`;
        star.style.width = `${size}vmin`;
        star.style.height = `${size}vmin`;
        star.style.background = color;
        // Opacity is now part of the color rgba

        // Store percentage positions and size for interaction
        star.dataset.originalXPercent = xPercent;
        star.dataset.originalYPercent = yPercent;
        star.dataset.size = size; // Store vmin size

        starfieldContainer.appendChild(star);
        stars.push({ element: star }); // Only need element reference now
    }

    // Add mouse interaction
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const baseStarSize = 0.15 + starSizeVariance / 2; // Average vmin size

        stars.forEach(starData => {
            const star = starData.element;
            const originalXPercent = parseFloat(star.dataset.originalXPercent);
            const originalYPercent = parseFloat(star.dataset.originalYPercent);
            const starSize = parseFloat(star.dataset.size);

            // Calculate current pixel position based on viewport and percentage
            const currentVPWidth = window.innerWidth;
            const currentVPHeight = window.innerHeight;
            const originalXpx = (originalXPercent / 100) * currentVPWidth;
            const originalYpx = (originalYPercent / 100) * currentVPHeight;

            // Calculate distance from mouse in pixels
            const dx = mouseX - originalXpx;
            const dy = mouseY - originalYpx;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const gravityRadius = 250; // Radius in pixels

            if (distance < gravityRadius) {
                const baseForce = 15; // Reduced base force
                // Adjust force based on star size relative to average size
                const sizeFactor = starSize / baseStarSize;
                const force = (1 - distance / gravityRadius) * baseForce * sizeFactor;

                const angle = Math.atan2(dy, dx);
                // Keep offset in pixels for translation
                const offsetX = Math.cos(angle) * force;
                const offsetY = Math.sin(angle) * force;

                star.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;
            } else {
                star.style.transform = 'translate(0, 0)';
            }
        });
    });

    // Handle window resizing - still useful for density/recalculation
    window.addEventListener('resize', () => {
        const existingContainer = document.querySelector('.starfield-container');
        if (existingContainer) {
            existingContainer.remove(); // Remove old container
        }
        // Debounce or throttle this if performance becomes an issue
        initStarfield(); // Recreate with new dimensions
    });
}

// Initialize scroll-triggered animations
function initScrollAnimations() {
    const cards = document.querySelectorAll('.tool-card:not(.featured-card)');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('load-animation');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Tool container transitions (Slide-up + Fade-in)
export function animateToolOpen(toolContainer) {
    toolContainer.style.opacity = '0'; // Start transparent
    toolContainer.style.transform = 'translateY(30px)'; // Start slightly lower
    toolContainer.style.visibility = 'visible'; // Make it visible but transparent/translated

    toolContainer.classList.remove('hidden'); // Ensure display is not none

    // Trigger transition
    requestAnimationFrame(() => { // Use requestAnimationFrame for smoother start
        toolContainer.style.opacity = '1';
        toolContainer.style.transform = 'translateY(0)'; // Slide up to final position
    });
}

export function animateToolClose(toolContainer, callback) {
    toolContainer.style.opacity = '0'; // Fade out
    toolContainer.style.transform = 'translateY(30px)'; // Slide down

    // Wait for transition to finish before hiding and calling callback
    setTimeout(() => {
        toolContainer.classList.add('hidden');
        toolContainer.style.visibility = 'hidden'; // Hide after transition
        // Reset transform and opacity for next open
        toolContainer.style.transform = ''; // Reset transform
        toolContainer.style.opacity = ''; // Reset opacity
        if (callback) {
            callback();
        }
    }, 300); // Match transition duration in CSS (default is 0.3s)
}
