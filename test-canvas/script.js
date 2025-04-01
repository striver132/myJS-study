const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBtn');

// 设置画布大小
canvas.width = 800;
canvas.height = 600;

// 绘画状态
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// 初始化画布
function initCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 开始绘画
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// 绘画过程
function draw(e) {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// 停止绘画
function stopDrawing() {
    isDrawing = false;
}

// 清除画布
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initCanvas();
}

// 事件监听
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
clearBtn.addEventListener('click', clearCanvas);

// 初始化画布
initCanvas();