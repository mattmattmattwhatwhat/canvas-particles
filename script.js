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
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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
	clearCanvas();
	for (i=0; i<particleArray.length; i++) {
		particleArray[i].draw();
	}
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
	var x = x;
	var y = y;
	var r = radius;

	var spawntime = Date.now();
	var life = lifetime;

	var color = color;

	var xRate = 0;
	var yRate = 0;

	this.draw = function() {
		drawCircle(this.x, this.y, this.r, this.color);
	}

	this.setMovementSpeed = function(xRate, yRate) {
		this.xRate = xRate;
		this.yRate = yRate;
	}

	this.adjustMovementSpeed = function(dXRate, dYRate) {
		this.xRate = this.xRate + dXRate;
		this.yRate = this.yRate + dYRate;
	}

	this.updateLocation = function() {
		this.x = this.x + this.xRate;
		this.y = this.y + this.yRate;
	}

}

function populateParticleArray(numberOfParticles) {
	for (i=0; i<numberOfParticles; i++) {
		particleArray.push(new Particle(25*i, 25*i, 20, 1000, '#ff0000'));
	}
}















