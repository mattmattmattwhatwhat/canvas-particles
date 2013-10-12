// Global variables for canvas/animations -------------------------------------

var canvas = null,
	ctx = null;

var animating = false,
	framerate = 1000/60,
	animationInterval = null;

var particleArray = [];
var emitterArray = [];

// Initializing everything on pageload ----------------------------------------

$(document).ready(function() {
	initialize();
});

function initialize() {
	canvas = document.getElementById("maincanvas");
	ctx = canvas.getContext('2d');
	resizeCanvas(window.innerWidth, window.innerHeight);
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
	for (i=0; i<emitterArray.length; i++) {
		
		emitter = emitterArray[i];
		emitter.emitParticle();

		for (j=0; j<emitter.particleArray.length; j++) {

			emitter.particleArray[j].age();

			if (emitter.particleArray[j].getKillStatus()) {
				
				emitter.particleArray.splice(j, 1);
				
				j--;
			}
		}
	}
}

function drawScene() {
	// draw particles
	for (i=0; i<emitterArray.length; i++) {
		for (j=0; j<emitterArray[i].particleArray.length; j++) {
			emitterArray[i].particleArray[j].draw();
		}
	}
	for (i=0; i<particleArray.length; i++) {
		particleArray[i].draw();
	}
}

function animateScene() {
	clearCanvas();
	updateScene();
	drawScene();
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
	var x = x;
	var y = y;
	var r = radius;

	var spawntime = Date.now();
	var life = lifetime;

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
		this.updateColor();
		this.updateLocation();
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
		return (Date.now() - spawntime > life)
	}

	this.checkOutOfBounds = function() {
		return (x + r < 0 ||
			x - r > canvas.width ||
			y + r < 0 ||
			y - r > canvas.height)
	}

	this.getKillStatus = function() {
		return (this.checkOutOfBounds() || this.checkAge())
	}
}

function addParticleToArray(x, y, particleArray) {
	r = Math.floor(Math.random()*255);
	g = Math.floor(Math.random()*255);
	b = Math.floor(Math.random()*255);
	a = 1.0;
	particleArray.push(new Particle(x, y, 20, 4000, r, g, b, a));
	particleArray[particleArray.length - 1].setMovementSpeed(2 - Math.random()*4, 2 - Math.random()*4);
}

ParticleEmitter = function(x, y, functioning) {
	this.x = x;
	this.y = y;
	this.isOn = functioning;
	this.particleArray = []

	this.emitParticle = function() {
		if (this.isOn) {
			addParticleToArray(this.x, this.y, this.particleArray);
		}
	}

	this.drawParticles = function() {
		for (i=0; i<this.particleArray.length; i++) {
			this.particleArray[i].draw();
		}
	}
}
// Event handlers -------------------------------------------------------------

$(document).mousemove(function(e) {
	var randomOffset = 10 - Math.floor(Math.random()*11)
	//addParticleToArray(e.pageX + randomOffset, e.pageY + randomOffset, particleArray);
})

$(document).click(function(e) {
	emitterArray.push(new ParticleEmitter(e.pageX, e.pageY, true));
})










