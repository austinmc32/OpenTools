import { toolsImplementation } from './tools/index.js';
import { loadToolStyles } from './css-loader.js';
import { initializeAnimations, animateToolOpen, animateToolClose } from './animations.js';
import './request-handler.js';

document.addEventListener('DOMContentLoaded', function() {
    // Load tool styles
    loadToolStyles();

    // Initialize animations
    initializeAnimations();

    // Google Analytics setup
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-47E938CZN4";
    document.head.appendChild(gaScript);

    gaScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-47E938CZN4');
    };

    // Elements
    const searchInput = document.getElementById('search-tools');
    const categorySelect = document.getElementById('category-select');
    const toolsCount = document.getElementById('tools-count');
    const toolContainer = document.getElementById('tool-container');
    const backButton = document.getElementById('back-button');
    const toolTitle = document.getElementById('tool-title');
    const toolContent = document.getElementById('tool-content');
    // This selector is now only used for initializing pin icons, not for counting
    const allToolCardsIncludingFeatured = document.querySelectorAll('.tool-card');
    const requestToolBtn = document.getElementById('request-tool-btn');
    const requestModal = document.getElementById('request-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const pinnedToolsContainer = document.getElementById('pinned-tools-container');
    const emptyPinsMessage = document.getElementById('empty-pins');
    const mainElement = document.querySelector('main'); // Get the main container for delegation

    // Tool registry - maps tool IDs to their loading functions
    // Using the consolidated import from index.js
    const toolRegistry = toolsImplementation;

    // Initialize animations
    animateElementsOnLoad();

    // Update tools count
    updateToolsCount();

    // Initialize pinned tools
    initializePinnedTools();

    // Category filter
    categorySelect.addEventListener('change', function() {
        filterTools();
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        filterTools();
    });

    // Tool card click handler using Event Delegation - enhanced for mobile
    mainElement.addEventListener('click', handleToolCardActivation);
    
    // Add explicit touchend handler for mobile devices
    mainElement.addEventListener('touchend', (event) => {
        // Prevent the simulated mouse click that would follow
        // Only if we're handling a tool card
        const clickedCard = event.target.closest('.tool-card');
        if (clickedCard) {
            event.preventDefault();
            handleToolCardActivation(event);
        }
    }, {passive: false}); // non-passive to allow preventDefault
    
    // Unified handler function for both click and touch
    function handleToolCardActivation(event) {
        const clickedCard = event.target.closest('.tool-card');
        if (clickedCard) {
            // Don't handle clicks on the pin button
            if (event.target.closest('.pin-tool')) {
                return;
            }
            
            const toolId = clickedCard.getAttribute('data-tool');
            if (toolId) {
                // Add active state visual feedback for mobile users
                clickedCard.classList.add('card-activated');
                setTimeout(() => {
                    clickedCard.classList.remove('card-activated');
                }, 300);
                
                loadTool(toolId);
            } else {
                console.warn("Clicked card is missing data-tool attribute:", clickedCard);
            }
        }
    }

    // Function to load a tool
    function loadTool(toolId) {
        // Clear previous tool content
        toolContent.innerHTML = '';

        // Get the tool title and category
        const toolCard = document.querySelector(`.tool-card[data-tool="${toolId}"]`);
        const title = toolCard ? toolCard.querySelector('h3').textContent : 'Tool';
        // Category is no longer needed for theming
        // const category = toolCard ? toolCard.getAttribute('data-category') : null;

        toolTitle.textContent = title;

        // REMOVE theme setting based on category
        // if (category) {
        //     setToolTheme(category);
        // }

        // Special handling for PHP language component if needed
        if (toolId === 'syntax-highlighter') {
            // Define our own PHP language definition if the PHP component is missing
            if (typeof Prism !== 'undefined' && !Prism.languages.php) {
                console.log('Adding fallback PHP language definition');
                // Simple definition that won't cause errors
                Prism.languages.php = {
                    'comment': /\/\/.*|\/\*[\s\S]*?\*\//,
                    'string': {
                        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
                        greedy: true
                    },
                    'keyword': /\b(?:and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
                    'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
                    'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
                    'punctuation': /[{}[\];(),.:]/,
                    'variable': /\$+[a-z_]\w*/i
                };
            }
        }

        // If the tool exists in the registry, load it
        if (toolRegistry[toolId]) {
            try {
                // Check if the tool is a function or an object with init method
                if (typeof toolRegistry[toolId] === 'function') {
                    // Original function-style implementation
                    toolRegistry[toolId](toolContent);
                    // Use animation to show tool container (only for sync tools)
                    animateToolOpen(toolContainer);
                } else if (typeof toolRegistry[toolId] === 'object' && toolRegistry[toolId].init) {
                    // New object-style implementation with init method
                    toolRegistry[toolId].init(toolContent);
                    // Use animation to show tool container (only for sync tools)
                    animateToolOpen(toolContainer);
                } else {
                    // Check for async init method (if tools are loaded dynamically)
                    if (typeof toolRegistry[toolId] === 'object' && typeof toolRegistry[toolId].load === 'function') {
                         toolRegistry[toolId].load().then(module => {
                            if (module && typeof module.init === 'function') {
                                module.init(toolContent);
                                animateToolOpen(toolContainer); // Animate after async init
                            } else {
                                throw new Error(`Tool module for ${toolId} does not have an init method.`);
                            }
                        }).catch(error => {
                             console.error(`Error dynamically loading tool ${toolId}:`, error);
                             showToolLoadError(error);
                        });
                         // Return early as loading is async
                         return;
                    } else {
                        throw new Error(`Invalid tool implementation for ${toolId}`);
                    }
                }

            } catch (error) {
                console.error(`Error executing tool ${toolId}:`, error); // Log execution error
                showToolLoadError(error); // Use helper function for error display
            }
        } else {
            console.warn(`Tool implementation NOT found in registry: ${toolId}`); // Log not found
            // Tool not available
            showToolNotFoundError(); // Use helper function
        }
    }

    // Helper function to display tool loading errors
    function showToolLoadError(error) {
        toolContent.innerHTML = `
            <div class="message error">
                <h3><i class="fas fa-exclamation-triangle"></i> Error Loading Tool</h3>
                <p>There was a problem loading this tool. Please try again later.</p>
                <p>Details: ${error.message}</p>
            </div>
        `;
        animateToolOpen(toolContainer); // Still open the container to show the error
    }

    // Helper function to display "tool not found" message
    function showToolNotFoundError() {
        toolContent.innerHTML = `
            <div class="tool-placeholder">
                <i class="fas fa-tools" style="font-size: 4rem; color: var(--accent-color); margin-bottom: 1rem;"></i>
                <h3>Tool Not Found</h3>
                <p>This tool implementation could not be found or is currently unavailable.</p>
            </div>
        `;
        animateToolOpen(toolContainer); // Still open the container to show the message
    }

    // Back button with layout preserved
    backButton.addEventListener('click', function() {
        // Use animation to hide tool container
        animateToolClose(toolContainer, () => {
            // REMOVE theme reset
            // setToolTheme('default');
            toolContent.innerHTML = ''; // Clear content when closing
        });
    });

    // Function to filter tools based on search and category
    function filterTools() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categorySelect.value;
        let visibleCount = 0;
        // Select only cards within the main grid for filtering and counting
        const mainGridToolCards = document.querySelectorAll('.all-tools-grid .tool-card');

        mainGridToolCards.forEach(card => {
            const toolName = card.querySelector('h3').textContent.toLowerCase();
            const toolDesc = card.querySelector('p').textContent.toLowerCase();
            const toolCategory = card.getAttribute('data-category');

            const matchesSearch = toolName.includes(searchTerm) || toolDesc.includes(searchTerm);
            const matchesCategory = category === 'all' || toolCategory === category;

            if (matchesSearch && matchesCategory) {
                card.classList.remove('hidden');
                card.classList.add('visible');
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.classList.remove('visible');
            }
        });

        // Update count based on visible tools in the main grid
        toolsCount.textContent = visibleCount;
    }

    // Update tools count to only reflect tools in the main grid
    function updateToolsCount() {
        // Select only cards within the main grid
        const mainGridToolCards = document.querySelectorAll('.all-tools-grid .tool-card');
        const totalTools = mainGridToolCards.length;
        toolsCount.textContent = totalTools;
        return totalTools; // Return the count for initial setting
    }

    // Animation functions
    function animateElementsOnLoad() {
        const toolsContainer = document.querySelector('.tools-container');

        if (toolsContainer) {
            toolsContainer.style.animation = `fadeIn 0.5s ease-out forwards`;
            toolsContainer.style.opacity = "0";
        }
    }

    // Request tool modal
    requestToolBtn.addEventListener('click', () => {
        requestModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        requestModal.classList.remove('active');
    });

    // Removed event listener for form submission as there is no form to be submitted now
    // toolRequestForm.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     toolRequestForm.classList.add('hidden');
    //     requestSuccess.classList.remove('hidden');
    // });

   //requestAnother.addEventListener('click', () => {
   //    toolRequestForm.reset();
   //    requestSuccess.classList.add('hidden');
   //    toolRequestForm.classList.remove('hidden');
   //});

    // Close modal when clicking outside
    requestModal.addEventListener('click', (e) => {
        if (e.target === requestModal) {
            requestModal.classList.remove('active');
        }
    });

    // Initialize the count of visible tools using the updated function
    // This line was previously using toolCards.length which included featured/pinned
    updateToolsCount(); // Call the function to set the initial count correctly

    // Function to initialize pinned tools
    function initializePinnedTools() {
        // Get pinned tools from localStorage
        const pinnedTools = JSON.parse(localStorage.getItem('pinnedTools')) || [];

        // Add pin icon to all tool cards (including featured)
        allToolCardsIncludingFeatured.forEach(card => {
            // Check if a pin button already exists to avoid duplicates
            if (card.querySelector('.pin-tool')) {
                return;
            }
            const toolId = card.getAttribute('data-tool');
            const isPinned = pinnedTools.includes(toolId);

            // Create pin button
            const pinButton = document.createElement('button');
            pinButton.className = `pin-tool ${isPinned ? 'pinned' : ''}`;
            pinButton.innerHTML = '<i class="fas fa-thumbtack"></i>';
            pinButton.setAttribute('title', isPinned ? 'Unpin tool' : 'Pin tool');

            // Add click event
            pinButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent the card click event
                togglePinnedTool(toolId, this);
            });

            card.appendChild(pinButton);
        });

        // Render pinned tools
        renderPinnedTools();
    }

    // Function to toggle a pinned tool
    function togglePinnedTool(toolId, pinButton) {
        let pinnedTools = JSON.parse(localStorage.getItem('pinnedTools')) || [];
        
        if (pinnedTools.includes(toolId)) {
            // Remove from pinned
            pinnedTools = pinnedTools.filter(id => id !== toolId);
            pinButton.classList.remove('pinned');
            pinButton.setAttribute('title', 'Pin tool');
        } else {
            // Add to pinned
            pinnedTools.push(toolId);
            pinButton.classList.add('pinned');
            pinButton.setAttribute('title', 'Unpin tool');
        }
        
        // Save to localStorage
        localStorage.setItem('pinnedTools', JSON.stringify(pinnedTools));
        
        // Re-render pinned tools
        renderPinnedTools();
    }
    
    // Function to render pinned tools
    function renderPinnedTools() {
        const pinnedTools = JSON.parse(localStorage.getItem('pinnedTools')) || [];
        const pinnedToolsSection = document.querySelector('.pinned-tools-section');
        
        // Clear current pinned tools (except the empty message)
        Array.from(pinnedToolsContainer.children).forEach(child => {
            if (child !== emptyPinsMessage) {
                child.remove();
            }
        });
        
        // Show/hide empty message and entire section
        if (pinnedTools.length === 0) {
            emptyPinsMessage.style.display = 'flex';
            pinnedToolsSection.classList.remove('has-pins'); // Hide section when no pins
            return;
        } else {
            emptyPinsMessage.style.display = 'none';
            pinnedToolsSection.classList.add('has-pins'); // Show section when there are pins
        }
        
        // Add pinned tool cards
        pinnedTools.forEach(toolId => {
            const originalCard = document.querySelector(`.all-tools-grid .tool-card[data-tool="${toolId}"], .featured-tools-container .tool-card[data-tool="${toolId}"]`); // Look in both grids
            if (!originalCard) {
                console.warn(`Original card not found for pinned tool: ${toolId}`);
                return; // Skip if original card not found
            }

            // Clone the card
            const clonedCard = originalCard.cloneNode(true);

            // Remove category label if present on cloned card
            const categoryLabel = clonedCard.querySelector('.category-label'); // Assuming a class for the label
            if (categoryLabel) categoryLabel.remove();

            // Ensure the pin icon exists before modifying
            const pinButton = clonedCard.querySelector('.pin-tool');
            if (pinButton) {
                pinButton.innerHTML = '<i class="fas fa-times"></i>'; // Change icon to 'remove'
                pinButton.setAttribute('title', 'Remove from pinned');
                pinButton.classList.add('pinned-remove-icon'); // Add a class for styling if needed

                // Add click event to the remove icon on the *cloned* card
                pinButton.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent the card click event

                    // Find the corresponding pin button on the *original* card and toggle it
                    const originalPinButton = originalCard.querySelector('.pin-tool');
                    if (originalPinButton) {
                        togglePinnedTool(toolId, originalPinButton); // This will trigger re-render
                    } else {
                         // Fallback if original button not found (shouldn't happen often)
                         let currentPinned = JSON.parse(localStorage.getItem('pinnedTools')) || [];
                         currentPinned = currentPinned.filter(id => id !== toolId);
                         localStorage.setItem('pinnedTools', JSON.stringify(currentPinned));
                         renderPinnedTools(); // Re-render directly
                    }
                });
            } else {
                 console.warn(`Pin button not found on cloned card for tool: ${toolId}`);
            }

            pinnedToolsContainer.appendChild(clonedCard);
        });
    }
});
