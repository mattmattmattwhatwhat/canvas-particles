// Global variables for canvas/animations -------------------------------------

var canvas = null,
	ctx = null;

var animating = false,
	framerate = 1000/60,
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
		particleArray[i].age();
		particleArray[i].updateColor();
		particleArray[i].updateLocation();
		if (particleArray[i].killFlag) {
			particleArray.splice(i, 1);
			i--;
		}
	}
}

function drawScene() {
	// draw particles
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

Particle = function(x, y, radius, lifetime, r, g, b, a) {
/*	this.x = x;
	this.y = y;
	this.r = radius;
*/
	
	var x = x;
	var y = y;
	var r = radius;

	var spawntime = Date.now();
	var life = lifetime;
	this.killFlag = false;

	var color = null;
	var colorR = r;
	var colorG = g;
	var colorB = b;
	var colorA = a;

	var xRate = 0;
	var yRate = 0;

	this.draw = function() {
		drawCircle(x, y, r, color);
	}

	this.updateColor = function() {
		color = "rgba(" + colorR.toString() +
			"," + colorG.toString() +
			"," + colorB.toString() +
			"," + colorA.toString() +
			")";
	}

	this.fadeOverTime = function() {
		colorA = 1 - (Date.now() - spawntime)/life;
	}

	this.age = function() {
		this.fadeOverTime();
		this.checkAge();
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
		if (Date.now() - spawntime > life) {
			this.killFlag = true;
		}
	}
}

function addParticleToArray(x, y) {
	r = Math.floor(Math.random()*255);
	g = Math.floor(Math.random()*255);
	b = Math.floor(Math.random()*255);
	a = 1.0;
	particleArray.push(new Particle(x, y, 20, 4000, r, g, b, a));
	particleArray[particleArray.length -1].setMovementSpeed(2 - Math.random()*4, 2 - Math.random()*4);
}


function populateParticleArray(numberOfParticles) {
	for (i=0; i<numberOfParticles; i++) {
		particleArray.push(new Particle(25*i, 25*i, 20, 1000, particleColors[i%3]));
	}
}

// Event handlers -------------------------------------------------------------

$(document).mousemove(function(e) {
	addParticleToArray(e.pageX, e.pageY);
})













