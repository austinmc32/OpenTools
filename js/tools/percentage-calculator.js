export function percentageCalculator(container) {
    container.innerHTML = `
        <style>
            .tool-interface {
                width: 95%;
                max-width: 800px;
                margin: 0 auto;
                border: 1px solid #ccc;
                border-radius: 12px;
                padding: 20px;
                background-color: #f5f5f5;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                font-family: 'Arial', sans-serif;
            }
            
            .percentage-tabs {
                display: flex;
                margin-bottom: 20px;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid #ddd;
                gap: 2px;
                background-color: #ddd;
            }
            
            .percentage-tab {
                flex: 1;
                padding: 8px 0;
                background-color: #e9e9e9;
                border: none;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 0.85em;
                line-height: 1.2;
                margin: 1px;
                border-radius: 4px;
            }
            
            .percentage-tab.active {
                background-color: #5c9eff;
                color: white;
                font-weight: bold;
            }
            
            .percentage-panel {
                display: none;
                animation: fadeIn 0.3s;
            }
            
            .percentage-panel.active {
                display: block;
            }
            
            .input-group {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: space-between;
            }
            
            .input-group label {
                margin: 0 5px;
                color: #555;
                white-space: nowrap;
            }
            
            input[type="number"] {
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 6px;
                font-size: 1em;
                background-color: white;
                flex: 1;
                min-width: 120px;
                transition: border-color 0.3s;
            }
            
            input[type="number"]:focus {
                outline: none;
                border-color: #5c9eff;
                box-shadow: 0 0 0 2px rgba(92, 158, 255, 0.2);
            }
            
            .primary-button {
                display: block;
                width: 100%;
                padding: 12px;
                background-color: #5c9eff;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1.1em;
                font-weight: bold;
                margin: 15px 0;
                transition: background-color 0.2s, transform 0.1s;
            }
            
            .primary-button:hover {
                background-color: #4a8def;
            }
            
            .primary-button:active {
                transform: translateY(2px);
            }
            
            .result-display {
                background-color: #fff;
                padding: 15px;
                margin: 15px 0;
                border-radius: 8px;
                text-align: center;
                border: 1px solid #ddd;
                box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
            }
            
            #percent-of-result, #percent-change-result, #percent-is-result {
                font-size: 1.8em;
                font-weight: bold;
                color: #333;
            }
            
            #percent-change-type {
                display: block;
                font-size: 1em;
                color: #666;
                margin-top: 5px;
            }
            
            .info-box {
                background-color: #eef4ff;
                padding: 12px 15px;
                border-radius: 8px;
                margin-top: 15px;
                border-left: 4px solid #5c9eff;
            }
            
            .info-box h3 {
                margin-top: 0;
                color: #4a6491;
                font-size: 1.1em;
            }
            
            .info-box p {
                margin: 8px 0;
                color: #555;
                font-size: 0.9em;
                line-height: 1.4;
            }
            
            .message {
                padding: 10px;
                margin-bottom: 15px;
                border-radius: 6px;
                text-align: center;
            }
            
            .message.error {
                background-color: #ffe0e0;
                color: #d83030;
                border: 1px solid #ffb8b8;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @media (prefers-color-scheme: dark) {
                .tool-interface {
                    background-color: #2a2a2a;
                    border-color: #444;
                    color: #eee;
                }
                
                .percentage-tabs {
                    border-color: #444;
                    background-color: #444;
                }
                
                .percentage-tab {
                    background-color: #3a3a3a;
                    color: #ddd;
                }
                
                .percentage-tab.active {
                    background-color: #3a6ea5;
                }
                
                input[type="number"] {
                    background-color: #3a3a3a;
                    border-color: #555;
                    color: #eee;
                }
                
                input[type="number"]:focus {
                    border-color: #3a6ea5;
                    box-shadow: 0 0 0 2px rgba(58, 110, 165, 0.2);
                }
                
                .primary-button {
                    background-color: #3a6ea5;
                }
                
                .primary-button:hover {
                    background-color: #2d5a8a;
                }
                
                .result-display {
                    background-color: #3a3a3a;
                    border-color: #555;
                }
                
                #percent-of-result, #percent-change-result, #percent-is-result {
                    color: #eee;
                }
                
                #percent-change-type {
                    color: #bbb;
                }
                
                .info-box {
                    background-color: #333844;
                    border-left-color: #3a6ea5;
                }
                
                .info-box h3 {
                    color: #a8c1e6;
                }
                
                .info-box p {
                    color: #ccc;
                }
                
                .message.error {
                    background-color: #4a2a2a;
                    color: #ff9a9a;
                    border-color: #633636;
                }
            }
        </style>
        
        <div class="tool-interface">
            <div class="percentage-tabs">
                <button class="percentage-tab active" data-tab="percent-of">Percentage of Value</button>
                <button class="percentage-tab" data-tab="percent-change">Percentage Change</button>
                <button class="percentage-tab" data-tab="percent-is">Value is What Percent</button>
            </div>
            
            <div class="percentage-content">
                <!-- Percentage of Value -->
                <div class="percentage-panel active" id="percent-of">
                    <div class="input-group">
                        <label>What is</label>
                        <input type="number" id="percent-of-percent" placeholder="Enter percentage">
                        <label>% of</label>
                        <input type="number" id="percent-of-value" placeholder="Enter value">
                        <label>?</label>
                    </div>
                    <button id="calculate-percent-of" class="primary-button">Calculate</button>
                    <div class="result-display">
                        <span id="percent-of-result">0</span>
                    </div>
                    <div class="info-box">
                        <h3>How it works</h3>
                        <p>This calculator finds a percentage of a number. For example, to calculate 20% of 80, enter 20 as the percentage and 80 as the value.</p>
                        <p>Formula: (Percentage ÷ 100) × Value</p>
                    </div>
                </div>
                
                <!-- Percentage Change -->
                <div class="percentage-panel" id="percent-change">
                    <div class="input-group">
                        <label>From</label>
                        <input type="number" id="from-value-pc" placeholder="Initial value">
                        <label>to</label>
                        <input type="number" id="to-value-pc" placeholder="Final value">
                    </div>
                    <button id="calculate-percent-change" class="primary-button">Calculate</button>
                    <div class="result-display">
                        <span id="percent-change-result">0%</span>
                        <span id="percent-change-type"></span>
                    </div>
                    <div class="info-box">
                        <h3>How it works</h3>
                        <p>This calculator finds the percentage change between two values.</p>
                        <p>Formula: ((Final Value - Initial Value) ÷ |Initial Value|) × 100%</p>
                    </div>
                </div>
                
                <!-- Value is What Percent -->
                <div class="percentage-panel" id="percent-is">
                    <div class="input-group">
                        <input type="number" id="part-value" placeholder="Part value">
                        <label>is what % of</label>
                        <input type="number" id="whole-value" placeholder="Whole value">
                        <label>?</label>
                    </div>
                    <button id="calculate-percent-is" class="primary-button">Calculate</button>
                    <div class="result-display">
                        <span id="percent-is-result">0%</span>
                    </div>
                    <div class="info-box">
                        <h3>How it works</h3>
                        <p>This calculator finds what percentage one value is of another value.</p>
                        <p>Formula: (Part Value ÷ Whole Value) × 100%</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Setup tabs
    const tabs = document.querySelectorAll('.percentage-tab');
    const panels = document.querySelectorAll('.percentage-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
    
    // Percentage of Value calculation
    document.getElementById('calculate-percent-of').addEventListener('click', () => {
        const percent = parseFloat(document.getElementById('percent-of-percent').value);
        const value = parseFloat(document.getElementById('percent-of-value').value);
        
        if (!isNaN(percent) && !isNaN(value)) {
            const result = (percent / 100) * value;
            document.getElementById('percent-of-result').textContent = result.toFixed(2);
        } else {
            showMessage('error', 'Please enter valid numbers');
        }
    });
    
    // Percentage Change calculation
    document.getElementById('calculate-percent-change').addEventListener('click', () => {
        const fromValue = parseFloat(document.getElementById('from-value-pc').value);
        const toValue = parseFloat(document.getElementById('to-value-pc').value);
        
        if (!isNaN(fromValue) && !isNaN(toValue) && fromValue !== 0) {
            const change = ((toValue - fromValue) / Math.abs(fromValue)) * 100;
            document.getElementById('percent-change-result').textContent = Math.abs(change).toFixed(2) + '%';
            document.getElementById('percent-change-type').textContent = change >= 0 ? 'increase' : 'decrease';
        } else {
            showMessage('error', 'Please enter valid numbers (initial value cannot be zero)');
        }
    });
    
    // Value is What Percent calculation
    document.getElementById('calculate-percent-is').addEventListener('click', () => {
        const partValue = parseFloat(document.getElementById('part-value').value);
        const wholeValue = parseFloat(document.getElementById('whole-value').value);
        
        if (!isNaN(partValue) && !isNaN(wholeValue) && wholeValue !== 0) {
            const result = (partValue / wholeValue) * 100;
            document.getElementById('percent-is-result').textContent = result.toFixed(2) + '%';
        } else {
            showMessage('error', 'Please enter valid numbers (whole value cannot be zero)');
        }
    });
    
    // Function to show messages
    function showMessage(type, message) {
        // Remove any existing message
        const existingMessage = container.querySelector('.message');
        if (existingMessage) existingMessage.remove();
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Add message at the top of the tool interface
        const toolInterface = container.querySelector('.tool-interface');
        toolInterface.insertBefore(messageDiv, toolInterface.firstChild);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}
