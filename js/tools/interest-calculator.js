export function interestCalculator(container) {
    container.innerHTML = `
        <style>
            .interest-calculator {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .calculator-tabs {
                display: flex;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-color);
            }
            
            .calculator-tab {
                padding: 10px 20px;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.3s;
            }
            
            .calculator-tab.active {
                border-color: var(--accent-color);
                color: var(--accent-color);
            }
            
            .calculator-content {
                padding: 20px;
                border-radius: 8px;
                background: var(--card-bg-color);
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
            }
            
            .input-group {
                display: flex;
                align-items: center;
            }
            
            .input-group input {
                flex: 1;
                padding: 10px;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                background: var(--input-background);
                color: var(--text-color);
            }
            
            .input-group .input-addon {
                padding: 10px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid var(--border-color);
                border-left: none;
                border-radius: 0 4px 4px 0;
            }
            
            .result-container {
                margin-top: 30px;
                padding: 20px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.05);
            }
            
            .result-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .result-row:last-child {
                border-bottom: none;
            }
            
            .result-row.highlight {
                font-weight: bold;
                color: var(--accent-color);
            }
            
            .input-slider {
                width: 100%;
                margin-top: 10px;
            }
            
            .time-period-selector {
                display: flex;
                gap: 15px;
                margin-top: 10px;
            }
            
            .compound-frequency {
                margin-top: 15px;
            }
            
            .amortization-table {
                width: 100%;
                margin-top: 20px;
                border-collapse: collapse;
            }
            
            .amortization-table th, .amortization-table td {
                padding: 10px;
                text-align: right;
                border-bottom: 1px solid var(--border-color);
            }
            
            .amortization-table th {
                background: rgba(255, 255, 255, 0.05);
            }
            
            .table-container {
                max-height: 300px;
                overflow-y: auto;
                margin-top: 20px;
            }
            
            @media (max-width: 768px) {
                .result-row {
                    flex-direction: column;
                    gap: 5px;
                }
            }
        </style>
        
        <div class="tool-interface interest-calculator">
            <div class="calculator-tabs">
                <div class="calculator-tab active" data-tab="simple">Simple Interest</div>
                <div class="calculator-tab" data-tab="compound">Compound Interest</div>
            </div>
            
            <div class="calculator-content" id="simple-interest-calc">
                <div class="form-group">
                    <label for="simple-principal">Principal Amount</label>
                    <div class="input-group">
                        <input type="number" id="simple-principal" value="1000" min="0" step="100">
                        <span class="input-addon">$</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="simple-rate">Annual Interest Rate</label>
                    <div class="input-group">
                        <input type="number" id="simple-rate" value="5" min="0" max="100" step="0.1">
                        <span class="input-addon">%</span>
                    </div>
                    <input type="range" id="simple-rate-slider" class="input-slider" min="0" max="20" value="5" step="0.1">
                </div>
                
                <div class="form-group">
                    <label for="simple-time">Time Period</label>
                    <div class="input-group">
                        <input type="number" id="simple-time" value="5" min="0" step="0.5">
                        <span class="input-addon" id="simple-time-unit">years</span>
                    </div>
                    <div class="time-period-selector">
                        <label><input type="radio" name="simple-time-period" value="years" checked> Years</label>
                        <label><input type="radio" name="simple-time-period" value="months"> Months</label>
                    </div>
                </div>
                
                <button id="simple-calculate-btn" class="primary-button">Calculate</button>
                
                <div class="result-container" id="simple-result">
                    <div class="result-row">
                        <div>Principal Amount:</div>
                        <div id="simple-result-principal">$1,000.00</div>
                    </div>
                    <div class="result-row">
                        <div>Interest Earned:</div>
                        <div id="simple-result-interest">$250.00</div>
                    </div>
                    <div class="result-row highlight">
                        <div>Total Amount:</div>
                        <div id="simple-result-total">$1,250.00</div>
                    </div>
                </div>
            </div>
            
            <div class="calculator-content" id="compound-interest-calc" style="display: none;">
                <div class="form-group">
                    <label for="compound-principal">Principal Amount</label>
                    <div class="input-group">
                        <input type="number" id="compound-principal" value="1000" min="0" step="100">
                        <span class="input-addon">$</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="compound-rate">Annual Interest Rate</label>
                    <div class="input-group">
                        <input type="number" id="compound-rate" value="5" min="0" max="100" step="0.1">
                        <span class="input-addon">%</span>
                    </div>
                    <input type="range" id="compound-rate-slider" class="input-slider" min="0" max="20" value="5" step="0.1">
                </div>
                
                <div class="form-group">
                    <label for="compound-time">Time Period</label>
                    <div class="input-group">
                        <input type="number" id="compound-time" value="5" min="0" step="0.5">
                        <span class="input-addon" id="compound-time-unit">years</span>
                    </div>
                    <div class="time-period-selector">
                        <label><input type="radio" name="compound-time-period" value="years" checked> Years</label>
                        <label><input type="radio" name="compound-time-period" value="months"> Months</label>
                    </div>
                </div>
                
                <div class="form-group compound-frequency">
                    <label for="compound-frequency">Compounding Frequency</label>
                    <select id="compound-frequency" class="form-control">
                        <option value="1">Annually (1/year)</option>
                        <option value="2">Semi-Annually (2/year)</option>
                        <option value="4">Quarterly (4/year)</option>
                        <option value="12" selected>Monthly (12/year)</option>
                        <option value="26">Bi-weekly (26/year)</option>
                        <option value="52">Weekly (52/year)</option>
                        <option value="365">Daily (365/year)</option>
                        <option value="continuous">Continuous</option>
                    </select>
                </div>
                
                <button id="compound-calculate-btn" class="primary-button">Calculate</button>
                
                <div class="result-container" id="compound-result">
                    <div class="result-row">
                        <div>Principal Amount:</div>
                        <div id="compound-result-principal">$1,000.00</div>
                    </div>
                    <div class="result-row">
                        <div>Interest Earned:</div>
                        <div id="compound-result-interest">$276.28</div>
                    </div>
                    <div class="result-row highlight">
                        <div>Total Amount:</div>
                        <div id="compound-result-total">$1,276.28</div>
                    </div>
                    
                    <div class="table-container">
                        <table class="amortization-table" id="compound-table">
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Starting Balance</th>
                                    <th>Interest</th>
                                    <th>Ending Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Table rows will be added here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Get elements
    const tabs = container.querySelectorAll('.calculator-tab');
    const simpleTab = container.querySelector('#simple-interest-calc');
    const compoundTab = container.querySelector('#compound-interest-calc');
    
    // Simple interest elements
    const simplePrincipal = container.querySelector('#simple-principal');
    const simpleRate = container.querySelector('#simple-rate');
    const simpleRateSlider = container.querySelector('#simple-rate-slider');
    const simpleTime = container.querySelector('#simple-time');
    const simpleTimePeriod = container.querySelectorAll('input[name="simple-time-period"]');
    const simpleTimeUnit = container.querySelector('#simple-time-unit');
    const simpleCalculateBtn = container.querySelector('#simple-calculate-btn');
    const simpleResultPrincipal = container.querySelector('#simple-result-principal');
    const simpleResultInterest = container.querySelector('#simple-result-interest');
    const simpleResultTotal = container.querySelector('#simple-result-total');
    
    // Compound interest elements
    const compoundPrincipal = container.querySelector('#compound-principal');
    const compoundRate = container.querySelector('#compound-rate');
    const compoundRateSlider = container.querySelector('#compound-rate-slider');
    const compoundTime = container.querySelector('#compound-time');
    const compoundTimePeriod = container.querySelectorAll('input[name="compound-time-period"]');
    const compoundTimeUnit = container.querySelector('#compound-time-unit');
    const compoundFrequency = container.querySelector('#compound-frequency');
    const compoundCalculateBtn = container.querySelector('#compound-calculate-btn');
    const compoundResultPrincipal = container.querySelector('#compound-result-principal');
    const compoundResultInterest = container.querySelector('#compound-result-interest');
    const compoundResultTotal = container.querySelector('#compound-result-total');
    const compoundTable = container.querySelector('#compound-table tbody');
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.dataset.tab === 'simple') {
                simpleTab.style.display = 'block';
                compoundTab.style.display = 'none';
            } else {
                simpleTab.style.display = 'none';
                compoundTab.style.display = 'block';
            }
        });
    });
    
    // Sync range slider with input
    simpleRateSlider.addEventListener('input', () => {
        simpleRate.value = simpleRateSlider.value;
    });
    
    simpleRate.addEventListener('input', () => {
        if (parseFloat(simpleRate.value) <= 20) {
            simpleRateSlider.value = simpleRate.value;
        }
    });
    
    compoundRateSlider.addEventListener('input', () => {
        compoundRate.value = compoundRateSlider.value;
    });
    
    compoundRate.addEventListener('input', () => {
        if (parseFloat(compoundRate.value) <= 20) {
            compoundRateSlider.value = compoundRate.value;
        }
    });
    
    // Time period unit switching
    simpleTimePeriod.forEach(radio => {
        radio.addEventListener('change', () => {
            simpleTimeUnit.textContent = radio.value;
        });
    });
    
    compoundTimePeriod.forEach(radio => {
        radio.addEventListener('change', () => {
            compoundTimeUnit.textContent = radio.value;
        });
    });
    
    // Calculate simple interest
    simpleCalculateBtn.addEventListener('click', calculateSimpleInterest);
    
    function calculateSimpleInterest() {
        // Get values
        const principal = parseFloat(simplePrincipal.value) || 0;
        const rate = parseFloat(simpleRate.value) / 100 || 0;
        let time = parseFloat(simpleTime.value) || 0;
        
        // Convert time to years if needed
        const timeUnit = document.querySelector('input[name="simple-time-period"]:checked').value;
        if (timeUnit === 'months') {
            time = time / 12;
        }
        
        // Calculate interest
        const interest = principal * rate * time;
        const total = principal + interest;
        
        // Display results
        simpleResultPrincipal.textContent = formatCurrency(principal);
        simpleResultInterest.textContent = formatCurrency(interest);
        simpleResultTotal.textContent = formatCurrency(total);
    }
    
    // Calculate compound interest
    compoundCalculateBtn.addEventListener('click', calculateCompoundInterest);
    
    function calculateCompoundInterest() {
        // Get values
        const principal = parseFloat(compoundPrincipal.value) || 0;
        const rate = parseFloat(compoundRate.value) / 100 || 0;
        let time = parseFloat(compoundTime.value) || 0;
        
        // Convert time to years if needed
        const timeUnit = document.querySelector('input[name="compound-time-period"]:checked').value;
        if (timeUnit === 'months') {
            time = time / 12;
        }
        
        const freqValue = compoundFrequency.value;
        let amount = 0;
        
        // Calculate compound interest
        if (freqValue === 'continuous') {
            // A = P * e^(rt)
            amount = principal * Math.exp(rate * time);
        } else {
            // A = P(1 + r/n)^(nt)
            const n = parseInt(freqValue);
            amount = principal * Math.pow(1 + (rate / n), n * time);
        }
        
        const interest = amount - principal;
        
        // Display results
        compoundResultPrincipal.textContent = formatCurrency(principal);
        compoundResultInterest.textContent = formatCurrency(interest);
        compoundResultTotal.textContent = formatCurrency(amount);
        
        // Generate amortization table
        generateCompoundTable(principal, rate, time, freqValue);
    }
    
    function generateCompoundTable(principal, rate, time, frequency) {
        compoundTable.innerHTML = '';
        
        const years = Math.ceil(time);
        let balance = principal;
        
        for (let year = 1; year <= years; year++) {
            const row = document.createElement('tr');
            
            // Calculate year-end balance
            let yearEndBalance = 0;
            
            if (frequency === 'continuous') {
                yearEndBalance = principal * Math.exp(rate * Math.min(year, time));
            } else {
                const n = parseInt(frequency);
                yearEndBalance = principal * Math.pow(1 + (rate / n), n * Math.min(year, time));
            }
            
            const yearInterest = yearEndBalance - balance;
            
            // Add row data
            row.innerHTML = `
                <td>${year}</td>
                <td>${formatCurrency(balance)}</td>
                <td>${formatCurrency(yearInterest)}</td>
                <td>${formatCurrency(yearEndBalance)}</td>
            `;
            
            compoundTable.appendChild(row);
            
            // Update balance for next year
            balance = yearEndBalance;
            
            // Stop if we've reached the time limit
            if (year >= time) break;
        }
    }
    
    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }
    
    // Initialize with default calculations
    calculateSimpleInterest();
    calculateCompoundInterest();
}
