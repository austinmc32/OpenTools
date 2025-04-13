export function calculator(container) {
    container.innerHTML = `
        <style>
            .calculator {
                display: flex;
                flex-direction: column;
                align-items: center;
                /* Change fixed width to responsive max-width */
                max-width: 350px; /* Max width on larger screens */
                width: 100%;      /* Take full available width up to max-width */
                margin: 0 auto;   /* Keep auto margins for centering */
                border: 1px solid #bbb;
                padding: 10px;
                background-color: #eee;
                border-radius: 12px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .calc-display {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                margin-bottom: 10px;
                padding: 10px;
                background-color: #fff;
                border: 1px solid #ccc;
                width: 100%;
                border-radius: 8px;
                box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
                height: 80px;
                font-family: 'Arial', sans-serif;
            }
            #calc-expression {
                color: #888;
                font-size: 0.9em;
                min-height: 20px;
            }
            #calc-result {
                font-size: 1.8em;
                font-weight: bold;
            }
            .calc-buttons {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
                width: 100%;
            }
            .calc-btn {
                padding: 10px;
                font-size: 1.2em;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s, transform 0.1s;
            }
            .calc-btn:hover {
                opacity: 0.9;
            }
            .calc-btn:active {
                transform: translateY(2px);
            }
            .calc-btn {
                background-color: #4a86e8;
                color: white;
            }
            .calc-btn[data-action="clear"], .calc-btn[data-action="backspace"] {
                background-color: #e74c3c;
                color: white;
            }
            .calc-btn[data-action="operator"] {
                background-color: #3498db;
                color: white;
            }
            .calc-btn[data-action="calculate"] {
                background-color: #2ecc71;
                color: white;
                grid-column: span 2;
            }
            .calc-btn[data-action="number"], .calc-btn[data-action="decimal"] {
                background-color: #34495e;
                color: white;
            }
            @media (prefers-color-scheme: dark) {
                .calculator {
                    background-color: #2a2a2a;
                    border-color: #444;
                    color: #fff;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                .calc-display {
                    background-color: #3a3a3a;
                    border-color: #555;
                    box-shadow: inset 0 2px 5px rgba(0,0,0,0.3);
                }
                .calc-btn {
                    background-color: #3a6ea5;
                }
                .calc-btn[data-action="clear"], .calc-btn[data-action="backspace"] {
                    background-color: #a43f39;
                }
                .calc-btn[data-action="operator"] {
                    background-color: #2980b9;
                }
                .calc-btn[data-action="calculate"] {
                    background-color: #27ae60;
                }
                .calc-btn[data-action="number"], .calc-btn[data-action="decimal"] {
                    background-color: #2c3e50;
                }
            }
        </style>
        <div class="tool-interface calculator">
            <div class="calc-display">
                <div id="calc-expression"></div>
                <div id="calc-result">0</div>
            </div>
            <div class="calc-buttons">
                <button class="calc-btn" data-action="clear">C</button>
                <button class="calc-btn" data-action="backspace">⌫</button>
                <button class="calc-btn" data-action="operator">%</button>
                <button class="calc-btn" data-action="operator">/</button>
                
                <button class="calc-btn" data-action="number">7</button>
                <button class="calc-btn" data-action="number">8</button>
                <button class="calc-btn" data-action="number">9</button>
                <button class="calc-btn" data-action="operator">*</button>
                
                <button class="calc-btn" data-action="number">4</button>
                <button class="calc-btn" data-action="number">5</button>
                <button class="calc-btn" data-action="number">6</button>
                <button class="calc-btn" data-action="operator">-</button>
                
                <button class="calc-btn" data-action="number">1</button>
                <button class="calc-btn" data-action="number">2</button>
                <button class="calc-btn" data-action="number">3</button>
                <button class="calc-btn" data-action="operator">+</button>
                
                <button class="calc-btn" data-action="number">0</button>
                <button class="calc-btn" data-action="decimal">.</button>
                <button class="calc-btn calc-equals" data-action="calculate">=</button>
            </div>
        </div>
    `;

    const expression = document.getElementById('calc-expression');
    const result = document.getElementById('calc-result');
    const buttons = document.querySelectorAll('.calc-btn');
    
    let currentInput = '0';
    let currentExpression = '';
    let lastOperation = '';
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            const value = button.textContent;
            
            switch (action) {
                case 'number':
                    if (currentInput === '0') {
                        currentInput = value;
                    } else {
                        currentInput += value;
                    }
                    break;
                    
                case 'decimal':
                    if (!currentInput.includes('.')) {
                        currentInput += '.';
                    }
                    break;
                    
                case 'operator':
                    currentExpression += currentInput + ' ' + value + ' ';
                    currentInput = '0';
                    break;
                    
                case 'clear':
                    currentInput = '0';
                    currentExpression = '';
                    break;
                    
                case 'backspace':
                    if (currentInput.length > 1) {
                        currentInput = currentInput.slice(0, -1);
                    } else {
                        currentInput = '0';
                    }
                    break;
                    
                case 'calculate':
                    try {
                        const fullExpression = currentExpression + currentInput;
                        const calcResult = eval(fullExpression);
                        currentInput = Number.isInteger(calcResult) ? calcResult.toString() : calcResult.toFixed(2).toString();
                        currentExpression = '';
                    } catch (error) {
                        currentInput = 'Error';
                        setTimeout(() => {
                            currentInput = '0';
                            updateDisplay();
                        }, 1500);
                    }
                    break;
            }
            
            updateDisplay();
        });
    });
    
    function updateDisplay() {
        expression.textContent = currentExpression;
        result.textContent = currentInput;
    }
}
