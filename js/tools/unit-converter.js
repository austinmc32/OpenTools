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
                // Simple conversion using ratios (for demo purposes)
                result = value * 10; 
                if (from === to) {
                    result = value;
                }
                break;
        }
        
        // Update display
        toValue.value = result.toFixed(4);
        formulaText.textContent = `1 ${from} = ${(result/value).toFixed(4)} ${to}`;
    }
    
    // Initial conversion
    convert();
}
