// Global variables for canvas/animations -------------------------------------

var canvas = null,
	ctx = null;

var animating = false,
	framerate = 1000/60,
	animationInterval = null;

var particleArray = [];
var emitterArray = [];

// Initializing everything on pageload ----------------------------------------

//$(document).ready(function() {
window.onload = function() {
	initialize();
};

function initialize() {
	canvas = document.getElementById("maincanvas");
	ctx = canvas.getContext('2d');
	resizeCanvas(window.innerWidth, window.innerHeight);
	//createSlider();
	toggleAnimation();
	for (i=0; i<5; i++) {
		for (j=0; j<5; j++) {
			emitterArray.push(new ParticleEmitter(j*canvas.width/5 + canvas.width/10, i*canvas.height/5 + canvas.height/10, 5000, -1, 80));
		}
	}
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
		//emitter = emitterArray[i];
		emitterArray[i].emitParticle();
		for (j=0; j<emitterArray[i].particleArray.length; j++) {
			emitterArray[i].particleArray[j].age();
			if (emitterArray[i].particleArray[j].getKillStatus()) {
				emitterArray[i].particleArray.splice(j, 1);
				j--;
			}
		}
		emitterArray[i].checkUsefulness();
		if (!emitterArray[i].isOn && emitterArray[i].particleArray.length < 1) {
			emitterArray.splice(i, 1);
			i--;
		}
	}
}

function drawScene() {
	// draw particles
	for (i=emitterArray.length-1; i>=0; i--) {
		for (j=emitterArray[i].particleArray.length-1; j>=0; j--) {
			emitterArray[i].particleArray[j].draw();
		}
	}
	for (i=0; i<sliderArray.length; i++) {
		sliderArray[i].draw();
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

function drawRectangle(x, y, w, h, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
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
		//colorA = .5 - (Date.now() - spawntime)/life/2;
		if ((Date.now() - spawntime)/life > .5) {
			colorA = .5 - (Date.now() - spawntime)/life/2;
		} else {
			colorA = (Date.now() - spawntime)/life/2;
		}
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

ParticleEmitter = function(x, y, emissionDelay, particleLimit, particleSize) {
	this.x = x;
	this.y = y;

	this.isOn = true;
	this.particleArray = [];

	this.delay = emissionDelay;
	this.lastParticleTime = Date.now() - emissionDelay;

	this.particleCount = 0;
	this.particleLimit = particleLimit;
	this.particleSize = particleSize;
	this.particleOffset = function(scale) {
		return scale - Math.random()*scale*2;
	}

	this.emitParticle = function() {
		if (this.isOn && (Date.now() - this.lastParticleTime) > this.delay) {
			addParticleToArray(this.x + this.particleOffset(20), this.y+this.particleOffset(20), this.particleArray, 1+Math.floor(Math.random()*this.particleSize/2+this.particleSize/2));
			this.lastParticleTime = Date.now();
			this.particleCount++;
		}
	}

	this.checkUsefulness = function() {
		if (this.particleCount >= this.particleLimit && this.particleLimit != -1) {
			this.isOn = false;
		}
	}
	this.drawParticles = function() {
		for (i=0; i<this.particleArray.length; i++) {
			this.particleArray[i].draw();
		}
	}

	function addParticleToArray(x, y, particleArray, radius) {
		r = Math.floor(Math.random()*255);
		g = Math.floor(Math.random()*255);
		b = Math.floor(Math.random()*255);
		a = 0;
		particleArray.push(new Particle(x, y, radius, 20000, r, g, b, a));
		particleArray[particleArray.length - 1].setMovementSpeed(.5 - Math.random(), .5 - Math.random()*1);
	}
}
// Event handlers -------------------------------------------------------------
/*
$(document).mousemove(function(e) {
	var randomOffset = 5 - Math.floor(Math.random()*11)
	emitterArray.push(new ParticleEmitter(e.pageX + randomOffset, e.pageY + randomOffset, 10, 30, 6));
})
*/
//$(window).resize(function() {
window.onresize = function() {
	resizeCanvas(window.innerWidth, window.innerHeight);
};

//$(document).click(function(e) {
document.onclick = function(e) {
	emitterArray.push(new ParticleEmitter(e.pageX, e.pageY, 100, -1, 30));
};

function determineClickIntent(e) {
	// if click is within slider area, adjust slider
	// else add particle emitter
}

// Creating a slider ----------------------------------------------------------

Slider = function(x, y, width, height, sliderPercent) {
	this.x = x;
	this.y = y;
	this.w = width;
	this.h = height;

	this.sliderW = width/10;
	this.sliderH = height;
	this.sliderPercent = sliderPercent;
	this.sliderX = this.x + (this.w * this.sliderPercent);

	this.backgroundColor = "#999999";
	this.sliderColor = "#9999FF";

	this.draw = function() {
		drawRectangle(this.x, this.y, this.w, this.h, this.backgroundColor);
		drawRectangle(this.sliderX, this.y, this.sliderW, this.sliderH, this.sliderColor);
	}
}

sliderArray = [];

function createSlider() {
	sliderArray.push(new Slider(100, 100, 100, 50, .5));
}







