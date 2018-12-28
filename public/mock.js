'use strict';

class MockTrackers {
	constructor () {
		// link tracker objects
		this.trackers = [
			new Tracker(this, 1, 'tm1'),
			new Tracker(this, 2, 'tm2'),
			new Tracker(this, 3, 'ts1'),
			new Tracker(this, 4, 'ts2'),
			new Tracker(this, 5, 'tr1'),
			new Tracker(this, 6, 'tr2'),
			new Tracker(this, 7, 'tw1'),
			new Tracker(this, 8, 'tw2')
		];

		this.activeElements = [];

		// setup event listeners
		window.addEventListener('mousedown', this.dragHandler.bind(this), true);
		window.addEventListener('mousemove', this.dragHandler.bind(this), true);
		window.addEventListener('mouseup',   this.dragHandler.bind(this), true);

		// set up updates
		setInterval(this.sendPositions.bind(this), 500); // update every x ms
	}

	sendPositions () {
		let compiledData = [];
		for (var i = this.trackers.length - 1; i >= 0; i--) {
			compiledData.push(this.trackers[i].getData());
		}
		compiledData = compiledData.join('-');

		var request = new XMLHttpRequest();
		request.open("GET", 'http://localhost:3000/setdata?data=' + compiledData);
		request.send();
	}

	addRemoveActiveElement (element, addState) {
		if (addState && this.activeElements.indexOf(element) == -1) {
			this.activeElements.push(element);
		} else {
			let index = this.activeElements.indexOf(element);
			if (index != -1) {
				this.activeElements.splice(index, 1);
			}
		}
	}

	dragHandler (inEvent) {
		for (var i = this.activeElements.length - 1; i >= 0; i--) {
			this.activeElements[i].dragHandler(inEvent);
		}
	}
}

class Tracker {
	constructor (parent, num, id) {
		this.parent = parent;
		this.num = num;
		this.ID = id;
		this.position = {
			'x' : 0,
			'y' : 0,
			'nx': 0, // normalised x position relative to arena [-1,1]
			'ny': 0, // normalised y positive relative to arena [-1,1]
			's' : 0, // s represents position relative to screen [0-10080)
			'r' : 0, // r represents radius from centre
			'ap': 0  // angle in polar coordinates (radians)
		},
		this.actionKey = 'a',
		this.close_to_screen = false,
		this.area = 1

		// setup display element
		this.el = document.getElementById(id);
		this.el.innerHTML = id;
		this.dragActive = false;

		// setup event listeners
		this.el.addEventListener('mousedown', this.dragHandler.bind(this), true);
	}

	dragHandler (inEvent) {
		if (!this.dragActive && inEvent.type === 'mousedown') {
			this.dragActive = true;
			this.parent.addRemoveActiveElement(this, true);
			this.dragOffset = {
				x: this.position.x - inEvent.clientX,
				y: this.position.y - inEvent.clientY
			};
			this.is_moving = true;
		}
		if (this.dragActive && inEvent.type === 'mouseup') {
			this.dragActive = false;
			this.parent.addRemoveActiveElement(this, false);

			// cancel is_moving some time after last movement was recorded
			setTimeout(function () {
				this.is_moving = false;
			}.bind(this), 3500);
		}
		if (this.dragActive && inEvent.type === 'mousemove') {
			this.position.x = inEvent.clientX + this.dragOffset.x;
			this.position.y = inEvent.clientY + this.dragOffset.y;

			this.el.style.transform = 'translate(' + this.position.x + 'px, ' + this.position.y + 'px)';

			// update all data to be current
			this.position.nx = this.mapValue(this.position.x, 137, 805, -1, 1);
			this.position.ny = this.mapValue(this.position.y, -8, 660, -1, 1);
			this.position.r  = Math.sqrt(Math.pow(this.position.nx, 2) + Math.pow(this.position.ny, 2));
			// calc angle in range [0,2PI) with 0 at the center top
			this.position.ap = Math.atan2(this.position.ny, this.position.nx) + Math.PI/2;
			if (this.position.ap < 0) {
				this.position.ap += 2*Math.PI;
			}
			
			if (this.position.ap < Math.PI/2) {
				this.area = 1;
			} else if (this.position.ap < Math.PI) {
				this.area = 2;
			} else if (this.position.ap < 3*Math.PI/2) {
				this.area = 3;
			} else if (this.position.ap <= 2*Math.PI) {
				this.area = 4;
			}
			this.close_to_screen = (this.position.r > 0.59 && this.position.r < 1.02) ? 1 : 0;

			this.position.s = Math.round(this.position.ap / (2*Math.PI) * 10080);

			// update actionKey
			let pointed = (this.position.r > 0.75 && this.position.r < 1.02); // very rough approximation
			if (!this.is_moving && !pointed) {
				this.actionKey = 'a';
			} else if (!this.is_moving && pointed) {
				this.actionKey = 'b';
			} else if (this.is_moving && !pointed) {
				this.actionKey = 'c';
			} else if (this.is_moving && pointed) {
				this.actionKey = 'd';
			}
		}
	}

	getData () {
		return [this.num, this.actionKey, this.position.s, this.close_to_screen, this.area].join(',');
	}

	mapValue (inValue, inMin, inMax, outMin, outMax) {
		return (inValue - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
	}
}

// ----------------------------------------------------------------------------

/**
 * Starting point of the script
 * Call any class or function here that needs to ready from the start
 */
var initialise = function () {
	var mock = new MockTrackers();
}

/**
 * Wait for whole page to load before setting up.
 * Prevents problems with objects not loaded yet while trying to assign these.
 */
window.addEventListener('pageshow', function () {
	initialise();
}, false);
