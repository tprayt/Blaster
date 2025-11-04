// Helper utility functions

// Generate random number between min and max
export function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Generate random integer between min and max (inclusive)
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Check if two rectangles collide
export function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Clamp a value between min and max
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Linear interpolation
export function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Choose random item from array
export function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Draw a triangle (for spaceship)
export function drawTriangle(ctx, x, y, width, height, color, rotation = 0) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    ctx.lineTo(-width / 2, height / 2);
    ctx.lineTo(width / 2, height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// Draw a rectangle with border
export function drawRect(ctx, x, y, width, height, fillColor, borderColor = null, borderWidth = 2) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, width, height);

    if (borderColor) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(x, y, width, height);
    }
}

// Draw text with shadow
export function drawText(ctx, text, x, y, size, color, align = 'center') {
    ctx.save();
    ctx.font = `${size}px 'Courier New', monospace`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillText(text, x, y);
    ctx.restore();
}

// Format number with commas
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
