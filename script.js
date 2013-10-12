// Global variables for canvas/animations -------------------------------------

var canvas = null,
	ctx = null;

var animating = false,
	framerate = 1000/60,
	animationInterval = null;

var particleArray = [],
	particleColors = [
		'#FF0000',
		'#00FF00',
		'#0000FF'
	];

// Initializing everything on pageload ----------------------------------------

$(document).ready(function() {
	initialize();
});

function initialize() {
	canvas = document.getElementById("maincanvas");
	ctx = canvas.getContext('2d');
	resizeCanvas(window.innerWidth, window.innerHeight);
	//populateParticleArray(10);
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
	for (i=0; i<particleArray.length; i++) {
		particleArray[i].updateLocation();
	}
}

function drawScene() {
	// draw particles
	//clearCanvas();
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
	this.x = x;
	this.y = y;
	this.r = radius;
	
	var x = x;
	var y = y;
	var r = radius;

	var spawntime = Date.now();
	var life = lifetime;
	var killFlag = false;

	var color = color;

	var xRate = 0;
	var yRate = 0;

	this.draw = function() {
		drawCircle(x, y, r, color);
	}

	this.setMovementSpeed = function(xRateNew, yRateNew) {
		xRate = xRateNew;
		yRate = yRateNew;
	}

	this.adjustMovementSpeed = function(dXRate, dYRate) {
		xRate = xRate + dXRate;
		yRate = yRate + dYRate;
	}

	this.updateLocation = function() {
		x = x + xRate;
		y = y + yRate;
	}

	this.checkAge = function() {
		if (Date.now() < spawntime + life) {
			killFlag = true;
		}
	}
}

function addParticleToArray(x, y) {
	particleArray.push(new Particle(x, y, 20, 10000, particleColors[Math.floor(Math.random()*3)]));
	particleArray[particleArray.length -1].setMovementSpeed(5 - Math.random()*10, 5 - Math.random()*10);
}


function populateParticleArray(numberOfParticles) {
	for (i=0; i<numberOfParticles; i++) {
		particleArray.push(new Particle(25*i, 25*i, 20, 1000, particleColors[i%3]));
	}
}

// Event handlers -------------------------------------------------------------

$(document).click(function(e) {
	addParticleToArray(e.pageX, e.pageY);
})













