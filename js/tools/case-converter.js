export function caseConverter(container) {
    container.innerHTML = `
        <style>
            /* Retain only case-converter specific styles */
            .converter-result {
                margin-top: 15px;
                font-weight: bold;
            }
            /* Removed common UI styles already defined globally */
        </style>
        <div class="tool-interface">
            <h2>Case Converter</h2>
            <!-- Tool-specific markup -->
            <div class="form-group">
                <label for="input-text">Enter text:</label>
                <input type="text" id="input-text" placeholder="Type here...">
            </div>
            <button id="convert-btn" class="primary-button">Convert Case</button>
            <div id="converter-result" class="converter-result"></div>
        </div>
    `;

    // Get elements
    const input = document.getElementById('input-text');
    const result = document.getElementById('converter-result');
    const convertBtn = document.getElementById('convert-btn');

    // Add event listener for the convert button
    convertBtn.addEventListener('click', () => {
        const text = input.value;
        result.textContent = text.toUpperCase(); // Example conversion logic
    });
}
