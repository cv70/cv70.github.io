const ImageToBase64 = {
    init() {
        this.fileInput = document.getElementById('file-input');
        this.previewImage = document.getElementById('preview-image');
        this.previewSection = document.getElementById('preview-section');
        this.outputText = document.getElementById('output-text');
        
        document.getElementById('copy-btn').addEventListener('click', () => this.copy());
        document.getElementById('download-btn').addEventListener('click', () => this.download());
        document.getElementById('clear-btn').addEventListener('click', () => this.clear());
        
        this.createDropZone();
    },
    
    createDropZone() {
        const dropZone = document.getElementById('drop-zone');
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.background = '#e3f2ff';
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.background = 'transparent';
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.processFile(e.dataTransfer.files[0]);
            dropZone.style.background = 'transparent';
        });
        
        this.fileInput.addEventListener('change', () => {
            this.processFile(this.fileInput.files[0]);
        });
    },
    
    processFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.outputText.value = e.target.result;
                this.previewImage.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border: 1px solid #ddd;" onerror="this.style.display=\'none\'" oncontextmenu="alert(\'右键菜单被禁用\')" ondragstart="return false;">
                <p style="margin-top: 5px;">${file.name} (${Math.round(file.size / 1024)} KB)</p>`;
                this.previewSection.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            alert('请选择有效的图片文件 (JPG, PNG, GIF, BMP)');
        }
    },
    
    copy() {
        const text = this.outputText.value;
        if (!text) return;
        
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-btn');
            btn.textContent = '已复制!';
            setTimeout(() => btn.textContent = '复制', 1500);
        });
    },
    
    download() {
        const text = this.outputText.value;
        if (!text) return;
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image_base64.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    clear() {
        this.fileInput.value = '';
        this.outputText.value = '';
        this.previewSection.style.display = 'none';
        this.previewImage.innerHTML = '<p>拖放图片或点击选择</p>';
        this.fileInput.style.background = 'transparent';
        this.fileInput.style.border = '1px dashed #ccc';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ImageToBase64.init();
});
