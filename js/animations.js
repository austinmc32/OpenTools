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
    const starfieldContainer = document.createElement('div');
    starfieldContainer.className = 'starfield-container';
    document.body.appendChild(starfieldContainer);
    
    // Number of stars based on screen size
    const width = window.innerWidth;
    const height = window.innerHeight;
    const starCount = Math.floor((width * height) / 10000); // More stars (1 per 10000px)
    
    // Star properties
    const stars = [];
    const starSizes = [1.2, 1.5, 2, 2.5, 3]; // Larger sizes for better visibility
    const starColors = [
        'rgba(190, 205, 240, 0.7)',  // Bright blue
        'rgba(200, 220, 255, 0.8)',  // Brighter blue
        'rgba(210, 225, 255, 0.85)',  // Very bright blue
        'rgba(220, 235, 255, 0.9)'   // Extremely bright blue
    ];
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        const x = Math.random() * width;
        const y = Math.random() * height;
        
        // Random size, color, and opacity
        const size = starSizes[Math.floor(Math.random() * starSizes.length)];
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const opacity = 0.5 + Math.random() * 0.5; // Higher opacity range
        
        // Set star properties
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.background = color;
        star.style.opacity = opacity;
        
        // Add brightness class with adjusted probability to favor brighter stars
        const brightnessRoll = Math.random();
        const brightnessClass = brightnessRoll < 0.3 ? 'dim' : 
                              brightnessRoll < 0.6 ? 'medium' : 'bright';
        star.classList.add(brightnessClass);
        
        // Store original position for gravity calculations
        star.dataset.originalX = x;
        star.dataset.originalY = y;
        
        // Add to container and store in array
        starfieldContainer.appendChild(star);
        stars.push({element: star, x, y, size});
    }
    
    // Add mouse interaction
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Update each star position based on mouse gravity
        stars.forEach(star => {
            const originalX = parseFloat(star.element.dataset.originalX);
            const originalY = parseFloat(star.element.dataset.originalY);
            
            // Calculate distance from mouse
            const dx = mouseX - originalX;
            const dy = mouseY - originalY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Gravity effect decreases with distance
            const gravityRadius = 300;
            
            if (distance < gravityRadius) {
                // Calculate gravity effect - stronger for closer stars
                const force = (1 - distance / gravityRadius) * 20;
                
                // Apply gravity - stars move away from mouse
                const angle = Math.atan2(dy, dx);
                const offsetX = Math.cos(angle) * force * (star.size / 2);
                const offsetY = Math.sin(angle) * force * (star.size / 2);
                
                // Move star
                star.element.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;
            } else {
                // Reset position if outside gravity radius
                star.element.style.transform = 'translate(0, 0)';
            }
        });
    });
    
    // Handle window resizing
    window.addEventListener('resize', () => {
        // Remove and recreate the starfield on resize
        starfieldContainer.remove();
        initStarfield();
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

// Tool container transitions
export function animateToolOpen(toolContainer) {
    toolContainer.style.opacity = '0';
    toolContainer.style.transform = 'scale(0.95)';
    
    toolContainer.classList.remove('hidden');
    
    // Trigger animation
    setTimeout(() => {
        toolContainer.style.opacity = '1';
        toolContainer.style.transform = 'scale(1)';
        toolContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }, 10);
}

export function animateToolClose(toolContainer, callback) {
    toolContainer.style.opacity = '0';
    toolContainer.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        toolContainer.classList.add('hidden');
        toolContainer.style.transition = '';
        if (callback) callback();
    }, 300);
}

// Create a dynamic color gradient based on tool category
export function setToolTheme(category) {
    const themes = {
        'text': {
            primary: '#2c6ca5', // Darker blue
            secondary: '#1e5482', 
            accent: '#3498db'
        },
        'number': {
            primary: '#c0392b',
            secondary: '#a93226',
            accent: '#e74c3c'
        },
        'converters': {
            primary: '#7d3c98',
            secondary: '#6c3483',
            accent: '#9b59b6'
        },
        'network': {
            primary: '#1e8449',
            secondary: '#196f3d',
            accent: '#27ae60'
        },
        'generators': {
            primary: '#d4ac0d',
            secondary: '#b7950b',
            accent: '#f1c40f'
        }
    };
    
    const defaultTheme = {
        primary: '#2980b9', // Darker blue
        secondary: '#1e6091',
        accent: '#3498db'
    };
    
    const theme = themes[category] || defaultTheme;
    
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
}
