/**
 * Loads tool-specific styles at runtime
 */
export function loadToolStyles() {
    // Consolidated common base styles now reside in styles.css.
    // Only tool-specific overrides remain below:
    const toolSpecificStyles = `
        /* Tool-specific styles */
        .tool-interface .qrcode-preview {
            display: flex;
            justify-content: center;
            margin-bottom: 1.5rem;
            padding: 1.5rem;
            background-color: var(--card-color);
            border-radius: 5px;
        }
        
        .tool-interface .button-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 1.5rem;
        }
        
        .tool-interface .qrcode-settings,
        .tool-interface .qrcode-info {
            margin-bottom: 1.5rem;
        }
        
        .tool-interface .info-box {
            background-color: var(--card-color);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            padding: 1rem;
        }
    `;
    
    // Create and append style element
    const style = document.createElement('style');
    style.textContent = toolSpecificStyles;
    document.head.appendChild(style);
}