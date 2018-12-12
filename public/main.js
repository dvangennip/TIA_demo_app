'use strict';

const version = '0.0.1';

// ----------------------------------------------------------------------------

/**
 * Extends Element to ease working with classes (based on EnyoJS v1)
 */
Element.make = function (_nodeType, _attributes) { // my own concoction
	var nodeType = (_nodeType !== undefined && typeof _nodeType === 'string') ? _nodeType : 'div',
		attr = (_attributes !== undefined && typeof _attributes === 'object') ? _attributes : {},
		el = document.createElement(nodeType),
		key, skey;
	for (key in attr) {
		if (key === 'innerHTML')
			el.innerHTML = attr[key];
		else if (key === 'events' && typeof attr[key] === 'object')
			for (skey in attr[key])
				el.addEventListener(skey, attr[key][skey], false);
		else el.setAttribute(key, attr[key]);
	}
	return el;
};
Element.prototype.setClassName = function(a) {
	this.className = a;
};
Element.prototype.getClassName = function() {
	return this.className || "";
};
Element.prototype.hasClass = function (a) {
	return a && (" " + this.getClassName() + " ").indexOf(" " + a + " ") >= 0;
};
Element.prototype.addClass = function (a) {
	if (a && !this.hasClass(a)) {
		var b = this.getClassName();
		this.setClassName(b + (b ? " " : "") + a);
	}
};
Element.prototype.removeClass = function (a) {
	if (a && this.hasClass(a)) {
		var b = this.getClassName();
		b = (" " + b + " ").replace(" " + a + " ", " ").slice(1, -1), this.setClassName(b);
	}
};
Element.prototype.addRemoveClass = function (a, b) {
	this[b ? "addClass" : "removeClass"](a);
};
Element.prototype.insertAfter = function (newchild) {
	// if no nextSibling is available it returns null
	// newChild will then be appended to the parentNode (essentially after this element)
	this.parentNode.insertBefore(newchild, this.nextSibling);
};

// ----------------------------------------------------------------------------

class MainLogic {
	constructor () {
		// initiate tracker connector
		this.tc = new TrackerConnector();

		// initiate all situations
		//this.environment = new Environment();
		this.sAlienShock = new SituationAlienShock();
		
		// initiate all tools
		// TODO
	}
}

class TrackerConnector {
	constructor () {
		// setup server connection

		// setup event listeners
		window.addEventListener('beforeunload', this.close.bind(this));

		// setup repeated calls to update function
	}

	connect () {
		// connect to server
	}

	disconnect () {
		// disconnect from server
	}

	close (inEvent) {
		// make sure we've disconnected first
		this.disconnect();

		// clean up server connection
	}

	update () {
		// read data from server?

		// send out updated position events for each tracker
		let tracker1Event = new CustomEvent('tracker1update', {detail: {x: 0, y: 0, z: 0}});
		window.dispatchEvent(tracker1Event);
	}
}

class Position {
	/**
	 * @x  : x coordinate in meters
	 * @y  : y coordinate in meters
	 * @z  : z coordinate in meters (+z is up)
	 * @rx : rotation around x-axis
	 * @ry : rotation around y-axis
	 * @rz : rotation around z-axis
	 * @m  : magnitude (m/s)
	 * @t  : timestamp of position
	 */
	constructor (x,y,z,rx,ry,rz,m,t) {
		this.x = (x) ? x : 0;
		this.y = (y) ? y : 0;
		this.z = (z) ? z : 0;
		this.rx = (rx) ? rx : 0;
		this.ry = (ry) ? ry : 0;
		this.rz = (rz) ? rz : 0;
		this.m = (m) ? m : 0;
		this.t = (t) ? t : (new Date()).getTime();

		// use event listeners to get position updates?
	}

	/**
	 * @t: timestamp of new position
	 */
	update_pos (x,y,z, t) {
		// also update magnitude of change
		let dt = t - this.t;
		let ds = Math.sqrt(Math.pow(x - this.x,2) + Math.pow(y - this.y,2) + Math.pow(z - this.z,2))
		this.m = ds / (dt/1000); // divided by 1000 to convert millis to seconds

		// TODO also update direction of change
		// calculate angle between two vectors
		// cos theta = dot product of v1*v2 / (length of v1 * length of v2)
		// ds is the length of v2, so only v1 left to calculate
		// let thisVectorLength = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2))
		// let theta = Math.acos( (this.x * x) + (this.y * y) + (this.z * z) / (thisVectorLength * ds) )

		// finally, update position to new data
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Environment {
	constructor () {
		this.ambientAudio = Element.make('audio', {
			'id': 'environment-audio',
			'autoplay': true,
			'loop': true
		})
		this.ambientSource = Element.make('source', {
			'src': 'assets/sound_ambient_mars_insight.wav',
			'type': 'audio/wave'
		})
		this.ambientAudio.appendChild(this.ambientSource);
		document.getElementsByTagName('body')[0].appendChild(this.ambientAudio);
		this.ambientAudio.load();
	}
}

class Situation {
	constructor () {
		// define position onscreen
	}

	/**
	 * Update state of the simulation
	 */
	update () {
		// respond to any new action events?
	}

	playSound (name) {
		// TODO create the necessary element before playing, only when necessary
		
		switch (name) {
			case 'gurgle-weak':
				break;
			case 'gurgle-strong':
				break;
			case 'zap-weak':
				break;
			case 'zap-strong':
				break;
			default:
				break;
		}
	}
}

class SituationAlienShock extends Situation {
	constructor () {
		super();

		// define position onscreen
		this.el = Element.make('div', {
			'class': 'alien-shock',
			'id': 'alien_shock'
		})
		document.getElementsByTagName('body')[0].appendChild(this.el);

		// setup event listeners
		this.el.addEventListener('mouseover', this.update.bind(this), false);
		this.el.addEventListener('mouseout', this.update.bind(this), false);
	}

	update (inEvent) {
		console.log(inEvent);
		this.state = (inEvent.type === 'mouseover') ? 'shocking' : 'default';
		
		this.el.addRemoveClass('shocking', this.state === 'shocking');

		// switch (this.state) {
		// 	case 'shocking':
		// 		break;
		// 	default:
		// 		break;
		// }
	}
}

class Tool {
	constructor (trackerID) {
		this.tracker = (trackerID) ? trackerID : 0;
		this.pos     = new Position();
		this.active  = False;

		// setup event listeners
		window.addEventListener('tracker1update', this.handleTrackerEvent.bind(this), false);
	}

	/**
	 * Update state of the simulation
	 */
	update () {
		// update position from tracker?
		// figure out active state?
		// send out action event?

		// if state is x, do something
		// else if state is y, do something else
	}

	handleTrackerEvent (inEvent) {
		console.log(inEvent.detail);
	}
}

/**
 * Starting point of the script
 * Call any class or function here that needs to ready from the start
 */
var initialise = function () {
	var main = new MainLogic ();
}

/**
 * Wait for whole page to load before setting up.
 * Prevents problems with objects not loaded yet while trying to assign these.
 */
window.addEventListener('pageshow', function () {
	initialise();
}, false);
