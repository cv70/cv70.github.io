const UnitConverter = {
    units: {
        length: {
            meter: { name: '米 (m)', rate: 1 },
            kilometer: { name: '千米 (km)', rate: 1000 },
            centimeter: { name: '厘米 (cm)', rate: 0.01 },
            millimeter: { name: '毫米 (mm)', rate: 0.001 },
            inch: { name: '英寸 (in)', rate: 0.0254 },
            foot: { name: '英尺 (ft)', rate: 0.3048 },
            yard: { name: '码 (yd)', rate: 0.9144 },
            mile: { name: '英里 (mi)', rate: 1609.344 },
            nautical_mile: { name: '海里 (nmi)', rate: 1852 }
        },
        weight: {
            gram: { name: '克 (g)', rate: 1 },
            kilogram: { name: '千克 (kg)', rate: 1000 },
            milligram: { name: '毫克 (mg)', rate: 0.001 },
            tonne: { name: '吨 (t)', rate: 1000000 },
            pound: { name: '磅 (lb)', rate: 453.592 },
            ounce: { name: '盎司 (oz)', rate: 28.3495 },
            carat: { name: '克拉 (ct)', rate: 0.2 }
        },
        temperature: {
            celsius: { name: '摄氏度 (°C)' },
            fahrenheit: { name: '华氏度 (°F)' },
            kelvin: { name: '开尔文 (K)' }
        },
        area: {
            square_meter: { name: '平方米 (m²)', rate: 1 },
            square_kilometer: { name: '平方千米 (km²)', rate: 10000000000 },
            square_centimeter: { name: '平方厘米 (cm²)', rate: 0.0001 },
            square_millimeter: { name: '平方毫米 (mm²)', rate: 0.000001 },
            square_inch: { name: '平方英寸 (in²)', rate: 0.00064516 },
            square_foot: { name: '平方英尺 (ft²)', rate: 0.092903 },
            square_yard: { name: '平方码 (yd²)', rate: 0.836127 },
            square_mile: { name: '平方英里 (mi²)', rate: 25899881100 },
            acre: { name: '英亩 (ac)', rate: 40468564 },
            hectare: { name: '公顷 (ha)', rate: 10000 }
        },
        volume: {
            liter: { name: '升 (L)', rate: 1 },
            milliliter: { name: '毫升 (mL)', rate: 0.001 },
            cubic_meter: { name: '立方米 (m³)', rate: 1000 },
            cubic_centimeter: { name: '立方厘米 (cm³)', rate: 0.000001 },
            cubic_inch: { name: '立方英寸 (in³)', rate: 0.0163871 },
            cubic_foot: { name: '立方英尺 (ft³)', rate: 0.0283168 },
            gallon_us: { name: '加仑 (gal)', rate: 3.78541 },
            quart_us: { name: '夸脱 (qt)', rate: 0.946353 },
            pint_us: { name: '品脱 (pt)', rate: 0.473171 },
            cup_us: { name: '杯 (cup)', rate: 0.236588 },
            fluid_ounce_us: { name: '液盎司 (fl oz)', rate: 0.0295735 },
            imperial_gallon: { name: '英制加仑', rate: 4.54609 }
        },
        speed: {
            meter_per_second: { name: '米/秒 (m/s)', rate: 1 },
            kilometer_per_hour: { name: '千米/小时 (km/h)', rate: 0.277778 },
            mile_per_hour: { name: '英里/小时 (mph)', rate: 0.44704 },
            knot: { name: '节 (kn)', rate: 0.514444 },
            foot_per_second: { name: '英尺/秒 (ft/s)', rate: 0.3048 }
        }
    },

    init() {
        this.bindEvents();
        this.updateUnitOptions('length');
    },

    bindEvents() {
        document.getElementById('category').addEventListener('change', (e) => {
            this.updateUnitOptions(e.target.value);
        });
        document.getElementById('input-value').addEventListener('input', () => this.convert());
        document.getElementById('from-unit').addEventListener('change', () => this.convert());
        document.getElementById('convert-btn').addEventListener('click', () => this.convert());
        document.getElementById('swap-btn').addEventListener('click', () => this.swap());
        document.getElementById('clear-btn').addEventListener('click', () => this.clear());
        document.getElementById('clear-history-btn').addEventListener('click', () => this.clearHistory());
    },

    updateUnitOptions(category) {
        const unitSelect = document.getElementById('from-unit');
        const resultDiv = document.getElementById('result');
        
        unitSelect.innerHTML = '';
        
        const units = this.units[category];
        let defaultUnit = Object.keys(units)[0];
        
        if (category === 'temperature') {
            this.updateTemperatureOptions();
        } else {
            Object.keys(units).forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = units[key].name;
                unitSelect.appendChild(option);
            });
            resultDiv.innerHTML = '<span class="result-value">等待输入...';
        }
    },

    updateTemperatureOptions() {
        const unitSelect = document.getElementById('from-unit');
        const units = [
            { key: 'celsius', value: '摄氏度 (°C)' },
            { key: 'fahrenheit', value: '华氏度 (°F)' },
            { key: 'kelvin', value: '开尔文 (K)' }
        ];
        
        unitSelect.innerHTML = '';
        units.forEach(u => {
            const option = document.createElement('option');
            option.value = u.key;
            option.textContent = u.value;
            unitSelect.appendChild(option);
        });
        
        document.getElementById('result').innerHTML = '<span class="result-value">等待输入...');
    },

    convert() {
        const category = document.getElementById('category').value;
        const inputVal = parseFloat(document.getElementById('input-value').value);
        const fromUnit = document.getElementById('from-unit').value;
        
        if (isNaN(inputVal)) {
            this.showResult('请输入有效数值');
            return;
        }

        const result = this.calculate(category, inputVal, fromUnit);
        this.showResult(result);
        this.addToHistory(category, inputVal, fromUnit, result);
    },

    calculate(category, inputVal, fromUnit) {
        if (category === 'temperature') {
            return this.convertTemperature(inputVal, fromUnit);
        } else {
            const toUnit = fromUnit === 'meter' ? 'foot' : 'meter';
            return this.convertStandard(category, inputVal, fromUnit, toUnit);
        }
    },

    convertTemperature(value, fromUnit) {
        let celsius;
        switch (fromUnit) {
            case 'celsius': celsius = value; break;
            case 'fahrenheit': celsius = (value - 32) * 5 / 9; break;
            case 'kelvin': celsius = value - 273.15; break;
        }
        return {
            text: `${value} ${this.getUnitName('temperature', fromUnit)} = ${celsius} ${this.getUnitName('temperature', 'celsius')}`,
            celsius: celsius,
            units: { from: fromUnit, to: 'celsius' }
        };
    },

    convertStandard(category, value, fromUnit, toUnit) {
        const fromRate = this.units[category][fromUnit].rate;
        const toRate = this.units[category][toUnit].rate;
        const result = value * fromRate / toRate;
        
        return {
            text: `${value} ${this.getUnitName(category, fromUnit)} = ${result.toFixed(4)} ${this.getUnitName(category, toUnit)}`,
            value: result,
            units: { from: fromUnit, to: toUnit }
        };
    },

    getUnitName(category, unit) {
        if (category === 'temperature') {
            return this.units.temperature[unit].name;
        } else {
            return this.units[category][unit] ? this.units[category][unit].name : unit;
        }
    },

    showResult(result) {
        const resultDiv = document.getElementById('result');
        if (typeof result === 'string') {
            resultDiv.innerHTML = `<span class="result-value">${result}</span>';
        } else {
            resultDiv.innerHTML = `<span class="result-value">${result.text}</span>';
        }
    },

    swap() {
        const fromUnit = document.getElementById('from-unit').value;
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `<span class="result-value">等待输入...';
    },

    clear() {
        document.getElementById('input-value').value = '';
        document.getElementById('result').innerHTML = '<span class="result-value">等待输入...';
    },

    addToHistory(category, inputVal, fromUnit, result) {
        const historyList = document.getElementById('history-list');
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `${inputVal} ${fromUnit} = ${typeof result === 'string' ? result : result.text}';
        historyList.prepend(historyItem);
        
        // Limit history items
        if (historyList.children.length > 20) {
            historyList.lastChild.remove();
        }
    },

    clearHistory() {
        document.getElementById('history-list').innerHTML = '';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    UnitConverter.init();
});
