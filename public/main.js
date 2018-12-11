'use strict';

const version = '0.0.1';

class MainLogic {
	constructor () {
		// initiate tracker connector
		this.tc = new TrackerConnector();

		// initiate all situations
		// TODO
		
		// initiate all tools
		// TODO
	}
}

class TrackerConnector {
	constructor () {
		// setup server connection

		// setup event listeners
		window.addEventListener("beforeunload", this.close.bind(this));

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

class Situation {
	constructor () {
		// define position onscreen
		// setup event listeners
	}

	/**
	 * Update state of the simulation
	 */
	update () {
		// respond to any new action events?
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
