var canvas = null;
var ctx = null;

function initialize() {
	canvas = document.getElementById("maincanvas");
	ctx = canvas.getContext('2d');
}

$(document).ready(function() {
	initialize();
});