// Global variables for canvas/animations -------------------------------------

var canvas = null,
	ctx = null;

var animating = false,
	framerate = 1000/10,
	animationInterval = null;

var particleArray = [];

// Initializing everything on pageload ----------------------------------------

$(document).ready(function() {
	initialize();
});

function initialize() {
	canvas = document.getElementById("maincanvas");
	ctx = canvas.getContext('2d');
	resizeCanvas(window.innerWidth, window.innerHeight);
	populateParticleArray(10);
	toggleAnimation();
}

// Full canvas manipulation ---------------------------------------------------

function resizeCanvas(width, height) {
	canvas.width = width;
	canvas.height = height;
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.w, canvas.h);
}

// Animation functions --------------------------------------------------------

function animateScene() {
	clearCanvas();
	updateScene();
	drawScene();
}

function toggleAnimation() {
	if (animating) {
		animationInterval = null;
	} else {
		animationInterval = setInterval(animateScene, framerate);
	}
	animating = !animating;
}

function updateScene() {
	// update particles
}

function drawScene() {
	// draw particles
	for (i=0; i<particleArray.length; i++) {
		particleArray[i].draw();
	}
	drawCircle(100, 100, 50, "#0000FF");
}

// Drawing functions ----------------------------------------------------------

function drawCircle(x, y, r, color) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI, false);
	ctx.fillStyle = color;
	ctx.fill();
}

// Particle section -----------------------------------------------------------

Particle = function(x, y, radius, lifetime, color) {
	this.x = x;
	this.y = y;
	this.r = radius;

	this.spawntime = Date.now();
	this.life = lifetime;

	this.color = color;

	this.draw = function() {
		drawCircle(this.x, this.y, this.r, this.color);
	}
}

function populateParticleArray(numberOfParticles) {
	for (i=0; i<numberOfParticles; i++) {
		particleArray.push(new Particle(25*i, 25*i, 20, 1000, '#ff0000'));
	}
}















