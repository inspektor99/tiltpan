var PiServo = require('pi-servo');

var keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// pass the GPIO number
var top = new PiServo(18);
var bottom = new PiServo(23);

var MAX = 180;
var TOP_MIN = 0;
var MIN = 0;

var BASE_INC = MAX;
var TOP_INC = MAX - TOP_MIN;

top.open().then(function(){
	top.setDegree(MIN); // 0 - 180
});

bottom.open().then(function(){
	bottom.setDegree(MIN); // 0 - 180
});

var baseDeg = MIN;
var topDeg = TOP_MIN;

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
 	//console.log('got "keypress"', key);
	var doTop = false
	var doBottom = false;
	if (key.name === 'left' && baseDeg !== MIN) {
		baseDeg = baseDeg - BASE_INC;
		doBottom = true;
	}
	if (key.name === 'right' && baseDeg !== MAX) {
		baseDeg = baseDeg + BASE_INC;
		doBottom = true;
	}
	if (key.name === 'down' && topDeg !== TOP_MIN) {
		topDeg = topDeg - TOP_INC;
		doTop = true;
	}
	if (key.name === 'up' && topDeg !== MAX) {
		topDeg = topDeg + TOP_INC;
		doTop = true;
	}

	if (doTop) {
		top.open().then(function(){
			top.setDegree(topDeg);
		});
	}

	if (doBottom) {
		bottom.open().then(function(){
			bottom.setDegree(baseDeg);
		});
	}


	console.log('base: ' + baseDeg.toString() + '; top: ' + topDeg.toString());

	if (key && key.ctrl && key.name == 'c') {
		process.stdin.pause();
 	}
});

process.stdin.setRawMode(true);
process.stdin.resume();

// var piblaster = require('pi-blaster.js');

// piblaster.setPwm(18, 0.5 ); // 100% brightness
// piblaster.setPwm(23, 0.5 ); // off
