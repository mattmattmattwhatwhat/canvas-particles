var canvas = null,
	ctx = null;

var animating = false,
	framerate = 1000/60,
	animationInterval = null;

$(document).ready(function() {
	initialize();
});

function initialize() {
	canvas = document.getElementById("maincanvas");
	ctx = canvas.getContext('2d');
	resizeCanvas(window.innerWidth, window.innerHeight);
	animationInterval = setInterval(animateScene, framerate);
	animating = true;
}

function resizeCanvas(width, height) {
	canvas.w = width;
	canvas.h = height;
}

function drawCircle(x, y, r, color) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI, false);
	ctx.fillStyle = color;
	ctx.fill();
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.w, canvas.h);
}

function animateScene() {
	clearCanvas();
	drawCircle(100, 100, 50, "#0000FF");
}