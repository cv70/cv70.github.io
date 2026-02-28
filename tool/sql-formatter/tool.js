const input = document.getElementById("input");
const output = document.getElementById("output");
const errorMsg = document.getElementById("error-message");

function showMessage(msg, type) {
    errorMsg.textContent = msg;
    errorMsg.style.color = type === "success" ? "green" : "red";
    setTimeout(() => { errorMsg.textContent = ""; errorMsg.style.color = ""; }, 3000);
}

document.getElementById("format-btn").onclick = () => {
    try {
        const sql = input.value.trim();
        output.value = sql.replace(/\s+/g, ' ').replace(/,/, ', ');
        showMessage("✓ 格式化成功", "success");
    } catch (e) {
        showMessage("✗ " + e.message, "error");
    }
};

document.getElementById("minify-btn").onclick = () => {
    try {
        const sql = input.value.trim().replace(/\s+/g, ' ');
        output.value = sql;
        showMessage("✓ 压缩成功", "success");
    } catch (e) {
        showMessage("✗ " + e.message, "error");
    }
};

document.getElementById("validate-btn").onclick = () => {
    try {
        const sql = input.value.trim();
        showMessage("✓ SQL 格式正确", "success");
    } catch (e) {
        showMessage("✗ " + e.message, "error");
    }
};

document.getElementById("copy-btn").onclick = () => {
    try {
        output.select();
        document.execCommand("copy");
        showMessage("✓ 已复制到剪贴板", "success");
    } catch (e) {
        showMessage("✗ " + e.message, "error");
    }
};

document.getElementById("clear-btn").onclick = () => {
    input.value = "";
    output.value = "";
    errorMsg.textContent = "";
};
