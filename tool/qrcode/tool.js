const QRCodeGenerator = {
    canvas: null,
    ctx: null,
    currentText: '',
    
    init() {
        this.canvas = document.getElementById('qr-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.bindEvents();
    },
    
    bindEvents() {
        document.getElementById('generate-btn').addEventListener('click', () => this.generate());
        document.getElementById('download-btn').addEventListener('click', () => this.download());
        
        document.getElementById('qr-size').addEventListener('input', (e) => {
            document.getElementById('size-value').textContent = e.target.value;
        });
        
        document.getElementById('qr-text').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.generate();
            }
        });
    },
    
    generate() {
        const text = document.getElementById('qr-text').value.trim();
        
        if (!text) {
            alert('请输入文本或网址');
            return;
        }
        
        this.currentText = text;
        const size = parseInt(document.getElementById('qr-size').value);
        const color = document.getElementById('qr-color').value;
        const bgColor = document.getElementById('qr-bg').value;
        
        this.canvas.width = size;
        this.canvas.height = size;
        
        QRCode.toCanvas(this.canvas, text, {
            width: size,
            margin: 2,
            color: {
                dark: color,
                light: bgColor
            }
        }, (error) => {
            if (error) {
                console.error(error);
                alert('生成失败，请重试');
                return;
            }
            
            document.getElementById('qr-canvas').classList.add('show');
            document.getElementById('qr-placeholder').style.display = 'none';
            document.getElementById('download-btn').disabled = false;
        });
    },
    
    download() {
        if (!this.currentText) return;
        
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    QRCodeGenerator.init();
});
