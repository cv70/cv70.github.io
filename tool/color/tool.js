const ColorConverter = {
    init() {
        this.preview = document.getElementById('color-preview');
        this.picker = document.getElementById('color-picker');
        this.hexInput = document.getElementById('hex-input');
        this.rgbInput = document.getElementById('rgb-input');
        this.hslInput = document.getElementById('hsl-input');
        this.cssVar = document.getElementById('css-var');
        
        this.picker.addEventListener('input', (e) => this.fromPicker(e.target.value));
        this.hexInput.addEventListener('change', (e) => this.fromHex(e.target.value));
        
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => this.copy(btn));
        });
        
        this.fromPicker('#3498db');
    },
    
    fromPicker(hex) {
        this.updateAll(hex);
    },
    
    fromHex(hex) {
        if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
        this.updateAll(hex);
    },
    
    updateAll(hex) {
        hex = hex.toUpperCase();
        this.preview.style.background = hex;
        this.picker.value = hex;
        this.hexInput.value = hex;
        
        const rgb = this.hexToRgb(hex);
        this.rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        this.hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        
        this.cssVar.textContent = `--color: ${hex};`;
    },
    
    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    },
    
    rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    },
    
    copy(btn) {
        const target = document.getElementById(btn.dataset.target);
        navigator.clipboard.writeText(target.value || target.textContent).then(() => {
            btn.textContent = '已复制!';
            setTimeout(() => btn.textContent = '复制', 1500);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => ColorConverter.init());
