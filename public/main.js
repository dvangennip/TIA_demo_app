'use strict';

const version = '0.0.1';

// ----------------------------------------------------------------------------

function updateMessages(xhr, status, args) 
{
	//  data format: tracker1-tracker2-trackerN-...
	//  per tracker: 1,action,x,close_to_screen,area_code
	//      example: 1,a,7583,0,2
	let d = args.data;
	let td = d.split('-');
	for (var i = td.length - 1; i >= 0; i--) {
		td[i] = td[i].split(',')

		switch (td[i]) {
			case '1':
				// TODO send relevant event based on state
				break;
			case '2':
				// TODO send relevant event based on state
				break;
			case '3':
				// TODO send relevant event based on state
				break;
			case '4':
				// TODO send relevant event based on state
				break;
			case '5':
				// TODO send relevant event based on state
				break;
			case '6':
				// TODO send relevant event based on state
				break;
			case '7':
				// TODO send relevant event based on state
				break;
			case '8':
				// TODO send relevant event based on state
				break;
			default: // do nothing
				break;
		}
	}
	
	console.log(args.data);
}

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
		this.sShip        = new Situation('ship_wreck');
		this.sAlienShock  = new Situation('alien_shock');
		this.sAlienBreath = new Situation('alien_breath');
		this.sGuide       = new Situation('hitch_guide');
		
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
		// read and parse data from server?

		// send out updated position events for each tracker
		let tracker1Event = new CustomEvent('tracker1update', {detail: {x: 0, y: 0, z: 0}});
		window.dispatchEvent(tracker1Event);
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
	constructor (inName) {
		// define onscreen element
		this.el = Element.make('div', {
			'class': inName.replace('_','-'), // just following convention of using - instead of _
			'id': inName,
			'innerHTML': inName
		})
		document.getElementsByTagName('body')[0].appendChild(this.el);

		// setup event listeners
		this.el.addEventListener('mouseover', this.update.bind(this), false);
		this.el.addEventListener('mouseout', this.update.bind(this), false);
	}

	/**
	 * Update state of the simulation
	 */
	update (inEvent) {
		// respond to any new action events?
		//console.log(inEvent);
		this.state = (inEvent.type === 'mouseover') ? 'active' : 'default';
		
		this.el.addRemoveClass('active', this.state === 'active');

		// switch (this.state) {
		// 	case 'active':
		// 		break;
		// 	default:
		// 		break;
		// }
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

		
	}

	update (inEvent) {
		
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

	// define nextMessage function if it's not defined yet to avoid undefined function errors
	if (typeof nextMessage !== 'function') {
		console.log('WARNING: no nextMessage function exists');
		window.nextMessage = function () {
			console.log('call to nextMessage dummy function');
		}
	}

	// from now on, call for updates
	setInterval(nextMessage, 5000); // update every x ms 
}

/**
 * Wait for whole page to load before setting up.
 * Prevents problems with objects not loaded yet while trying to assign these.
 */
window.addEventListener('pageshow', function () {
	initialise();
}, false);
