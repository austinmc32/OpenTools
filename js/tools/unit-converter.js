export function unitConverter(container) {
    container.innerHTML = `
        <div class="tool-interface">
            <div class="converter-select">
                <label for="conversion-type">Conversion Type:</label>
                <select id="conversion-type" class="full-width">
                    <option value="length">Length</option>
                    <option value="weight">Weight/Mass</option>
                    <option value="temperature">Temperature</option>
                    <option value="area">Area</option>
                    <option value="volume">Volume</option>
                    <option value="time">Time</option>
                </select>
            </div>
            
            <div class="converter-inputs">
                <div class="converter-input">
                    <input type="number" id="from-value" class="full-width" value="1">
                    <select id="from-unit" class="full-width"></select>
                </div>
                
                <div class="converter-equals">=</div>
                
                <div class="converter-input">
                    <input type="number" id="to-value" class="full-width" readonly>
                    <select id="to-unit" class="full-width"></select>
                </div>
            </div>
            
            <div class="conversion-formula">
                <h3>Formula:</h3>
                <p id="formula-text">1 meter = 100 centimeters</p>
            </div>
        </div>
    `;

    // Add some custom styling for better spacing
    const style = document.createElement('style');
    style.textContent = `
        .converter-inputs {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 20px 0;
            gap: 15px;
        }
        .converter-input {
            flex: 1;
        }
        .converter-equals {
            font-size: 24px;
            margin: 0 10px;
            font-weight: bold;
        }
        .converter-input input,
        .converter-input select {
            margin-bottom: 10px;
        }
        .conversion-formula {
            margin-top: 20px;
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 5px;
            color: inherit;
        }
    `;
    container.appendChild(style);

    // DOM elements
    const conversionType = document.getElementById('conversion-type');
    const fromValue = document.getElementById('from-value');
    const fromUnit = document.getElementById('from-unit');
    const toValue = document.getElementById('to-value');
    const toUnit = document.getElementById('to-unit');
    const formulaText = document.getElementById('formula-text');
    
    // Conversion units by category
    const units = {
        length: [
            'meter', 'kilometer', 'centimeter', 'millimeter',
            'inch', 'foot', 'yard', 'mile'
        ],
        weight: [
            'kilogram', 'gram', 'milligram', 'pound', 
            'ounce', 'ton'
        ],
        temperature: [
            'celsius', 'fahrenheit', 'kelvin'
        ],
        area: [
            'square meter', 'square kilometer', 'square centimeter', 
            'square inch', 'square foot', 'acre', 'hectare'
        ],
        volume: [
            'cubic meter', 'liter', 'milliliter', 
            'gallon', 'quart', 'pint', 'cup'
        ],
        time: [
            'second', 'minute', 'hour', 
            'day', 'week', 'month', 'year'
        ]
    };
    
    // Define conversion factors relative to base unit for each category
    const conversionFactors = {
        length: {
            meter: 1,
            kilometer: 1000,
            centimeter: 0.01,
            millimeter: 0.001,
            inch: 0.0254,
            foot: 0.3048,
            yard: 0.9144,
            mile: 1609.344
        },
        weight: {
            kilogram: 1,
            gram: 0.001,
            milligram: 0.000001,
            pound: 0.45359237,
            ounce: 0.02834952,
            ton: 1000
        },
        area: {
            'square meter': 1,
            'square kilometer': 1000000,
            'square centimeter': 0.0001,
            'square inch': 0.00064516,
            'square foot': 0.09290304,
            'acre': 4046.8564224,
            'hectare': 10000
        },
        volume: {
            'cubic meter': 1,
            'liter': 0.001,
            'milliliter': 0.000001,
            'gallon': 0.00378541,
            'quart': 0.000946353,
            'pint': 0.000473176,
            'cup': 0.000236588
        },
        time: {
            'second': 1,
            'minute': 60,
            'hour': 3600,
            'day': 86400,
            'week': 604800,
            'month': 2592000, // 30-day month
            'year': 31536000  // 365-day year
        }
    };

    // Populate initial units and set up event listeners
    populateUnits('length');
    
    conversionType.addEventListener('change', () => {
        populateUnits(conversionType.value);
        convert();
    });
    
    fromValue.addEventListener('input', convert);
    fromUnit.addEventListener('change', convert);
    toUnit.addEventListener('change', convert);
    
    /**
     * Populates the unit selection dropdowns based on the conversion type
     * @param {string} type - The conversion type to populate units for
     */
    function populateUnits(type) {
        // Clear existing options
        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';
        
        // Add new options based on type
        units[type].forEach(unit => {
            fromUnit.appendChild(new Option(unit, unit));
            toUnit.appendChild(new Option(unit, unit));
        });
        
        // Set default unit selections
        if (type === 'length') {
            fromUnit.value = 'meter';
            toUnit.value = 'centimeter';
        } else if (type === 'temperature') {
            fromUnit.value = 'celsius';
            toUnit.value = 'fahrenheit';
        } else {
            toUnit.selectedIndex = 1; // Select second option for other types
        }
    }
    
    /**
     * Performs the unit conversion and updates the result
     */
    function convert() {
        const type = conversionType.value;
        const from = fromUnit.value;
        const to = toUnit.value;
        const value = parseFloat(fromValue.value);
        
        if (isNaN(value)) {
            toValue.value = '';
            return;
        }
        
        let result;
        let baseValue;
        
        switch (type) {
            case 'temperature':
                // Convert to base unit (celsius)
                if (from === 'celsius') {
                    baseValue = value;
                } else if (from === 'fahrenheit') {
                    baseValue = (value - 32) * 5/9;
                } else if (from === 'kelvin') {
                    baseValue = value - 273.15;
                }
                
                // Convert from base unit to target unit
                if (to === 'celsius') {
                    result = baseValue;
                } else if (to === 'fahrenheit') {
                    result = (baseValue * 9/5) + 32;
                } else if (to === 'kelvin') {
                    result = baseValue + 273.15;
                }
                break;
                
            default:
                // Convert using defined conversion factors
                if (from === to) {
                    result = value;
                } else {
                    // Convert from source to base unit, then to target unit
                    const fromFactor = conversionFactors[type][from];
                    const toFactor = conversionFactors[type][to];
                    result = value * (fromFactor / toFactor);
                }
                break;
        }
        
        // Update display with appropriate precision
        const precision = result < 0.01 ? 6 : result < 1 ? 4 : 2;
        toValue.value = result.toFixed(precision);
        
        // Update formula text with the actual conversion rate
        let conversionRate;
        if (type === 'temperature') {
            if (from === to) {
                conversionRate = '1';
            } else {
                conversionRate = '...custom conversion...';
            }
        } else {
            conversionRate = (conversionFactors[type][from] / conversionFactors[type][to]).toFixed(precision);
        }
        
        formulaText.textContent = `1 ${from} = ${conversionRate} ${to}`;
    }
    
    // Initial conversion
    convert();
}
