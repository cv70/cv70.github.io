const TimestampTool = {
    init() {
        document.getElementById('timestamp-convert-btn').addEventListener('click', () => this.convertTimestamp());
        document.getElementById('datetime-convert-btn').addEventListener('click', () => this.convertDatetime());
        document.getElementById('copy-timestamp').addEventListener('click', () => this.copy('current-timestamp'));
        document.getElementById('copy-datetime').addEventListener('click', () => this.copy('current-datetime'));
        
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
    },
    
    convertTimestamp() {
        let ts = parseInt(document.getElementById('timestamp-input').value);
        if (isNaN(ts)) { alert('请输入有效的时间戳'); return; }
        
        const unit = document.getElementById('timestamp-unit').value;
        if (unit === '毫秒') ts = Math.floor(ts / 1000);
        
        const date = new Date(ts * 1000);
        const result = this.formatDate(date);
        document.getElementById('timestamp-result').innerHTML = `
            <strong>结果:</strong> ${result}<br>
            <strong>相对时间:</strong> ${this.getRelativeTime(date)}
        `;
    },
    
    convertDatetime() {
        const datetime = document.getElementById('datetime-input').value;
        if (!datetime) { alert('请选择日期时间'); return; }
        
        const date = new Date(datetime);
        const timestamp = Math.floor(date.getTime() / 1000);
        
        document.getElementById('datetime-result').innerHTML = `
            <strong>秒级时间戳:</strong> ${timestamp}<br>
            <strong>毫秒级时间戳:</strong> ${date.getTime()}
        `;
    },
    
    updateCurrentTime() {
        const now = new Date();
        document.getElementById('current-timestamp').textContent = Math.floor(now.getTime() / 1000);
        document.getElementById('current-datetime').textContent = this.formatDate(now);
    },
    
    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    },
    
    getRelativeTime(date) {
        const diff = Date.now() - date.getTime();
        const abs = Math.abs(diff);
        const seconds = Math.floor(abs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (diff > 0) {
            if (days > 0) return `${days}天前`;
            if (hours > 0) return `${hours}小时前`;
            if (minutes > 0) return `${minutes}分钟前`;
            return `${seconds}秒前`;
        } else {
            if (days > 0) return `${days}天后`;
            if (hours > 0) return `${hours}小时后`;
            if (minutes > 0) return `${minutes}分钟后`;
            return `${seconds}秒后`;
        }
    },
    
    copy(id) {
        const text = document.getElementById(id).textContent;
        navigator.clipboard.writeText(text);
    }
};

document.addEventListener('DOMContentLoaded', () => TimestampTool.init());
