const input = document.getElementById("input");
const output = document.getElementById("output");
const errorMsg = document.getElementById("error-message");

function showMessage(msg, type) {
    errorMsg.textContent = msg;
    errorMsg.className = "error " + type;
    if (type === "success") setTimeout(() => { errorMsg.textContent = ""; errorMsg.className = "error"; }, 3000);
}

document.getElementById("format-btn").onclick = () => {
    try {
        const json = JSON.parse(input.value);
        output.value = JSON.stringify(json, null, 4);
        showMessage("✓ 格式化成功", "success");
    } catch (e) {
        showMessage("✗ " + e.message, "fail");
    }
};

document.getElementById("minify-btn").onclick = () => {
    try {
        const json = JSON.parse(input.value);
        output.value = JSON.stringify(json);
        showMessage("✓ 压缩成功", "success");
    } catch (e) {
        showMessage("✗ " + e.message, "fail");
    }
};

document.getElementById("validate-btn").onclick = () => {
    try {
        JSON.parse(input.value);
        showMessage("✓ JSON 格式正确", "success");
    } catch (e) {
        showMessage("✗ " + e.message, "fail");
    }
};

document.getElementById("copy-btn").onclick = () => {
    output.select();
    document.execCommand("copy");
    showMessage("✓ 已复制到剪贴板", "success");
};

document.getElementById("clear-btn").onclick = () => {
    input.value = "";
    output.value = "";
    errorMsg.textContent = "";
};
