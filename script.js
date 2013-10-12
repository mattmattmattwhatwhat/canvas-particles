var canvas = null;
var ctx = null;

$(document).ready(function() {
	initialize();
});

function initialize() {
	canvas = document.getElementById("maincanvas");
	ctx = canvas.getContext('2d');
	resizeCanvas(window.innerWidth, window.innerHeight);
	//drawCircle(100, 100, 50, "rgba(10,100,200,1)");
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