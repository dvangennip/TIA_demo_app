'use strict';

const version = '0.0.1';

/**
some notes:
- spatial audio: perhaps use https://github.com/goldfire/howler.js#documentation
*/

// ----------------------------------------------------------------------------

function updateMessages (xhr, status, args) {
	//  data format: tracker1-tracker2-...-trackerN
	//  per tracker: 1,action,x_position,close_to_screen,area_code
	//      example: 1,a,7583,0,2
	let d = args.data;
	let td = d.split('-');
	for (var i = td.length - 1; i >= 0; i--) {
		td[i] = td[i].split(',')

		// convert to useful data format
		let trackerData = {
			'id'       : parseInt(td[i][0], 10),
			//'actionKey': td[i][1],
			'is_moving': (td[i][1] == 'c' || td[i][1] == 'd') ? true : false,
			'pointed'  : (td[i][1] == 'b' || td[i][1] == 'd') ? true : false,
			'x'        : parseInt(td[i][2], 10),
			'close'    : (td[i][3] == '1') ? true : false,
			'area'     : parseInt(td[i][4], 10)
		};

		// send out custom event to be subscribed to by other elements on the page
		let trackerEvent = new CustomEvent('tracker'+trackerData['id']+'update', {detail: trackerData});
		window.dispatchEvent(trackerEvent);
	}
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
		// initiate all tools
		this.tools = {
			'tm1': new Tool(1, 'tm1'),
			'tm2': new Tool(2, 'tm2'),
			'ts1': new Tool(3, 'ts1'),
			'ts2': new Tool(4, 'ts2'),
			'tr1': new Tool(5, 'tr1'),
			'tr2': new Tool(6, 'tr2'),
			'tw1': new Tool(7, 'tw1'),
			'tw2': new Tool(8, 'tw2')
		}

		// initiate all situations
		//this.environment = new Environment();
		this.sShip        = new SituationShipWreck(  1, 'ship_wreck',   this.tools);
		this.sAlienShock  = new SituationAlienShock( 2, 'alien_shock',  this.tools);
		this.sAlienBreath = new Situation(           3, 'alien_breath', this.tools);
		this.sGuide       = new Situation(           4, 'hitch_guide',  this.tools);

		// check existence of nextMessage function to avoid reference errors
		if (typeof nextMessage === 'function') {
			// from now on, call for updates
			setInterval(nextMessage, 1500); // update every x ms
		} else {
			console.log('WARNING: no nextMessage function exists, using a mock function instead');
			setInterval(this.nextMessageMock, 1500);
		}
	}

	nextMessageMock () {
		let request = new XMLHttpRequest();
		request.addEventListener("load", (e) => {
			if (request.status == 200) {
				updateMessages(request, request.status, JSON.parse(request.response));
			}
		});
		request.open("GET", 'http://localhost:3000/getdata');
		request.send();
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
			'src': 'assets/sound_ambient.mp3',
			'type': 'audio/wave'
		})
		this.ambientAudio.appendChild(this.ambientSource);
		document.getElementsByTagName('body')[0].appendChild(this.ambientAudio);
		this.ambientAudio.load();
	}
}

class Situation {
	constructor (inAreaCode, inName, inTools) {
		this.areaCode = inAreaCode;
		this.tools = inTools;

		// define onscreen element
		this.el = Element.make('div', {
			'class': inName.replace('_','-'), // just following convention of using - instead of _
			'id': inName,
			'innerHTML': inName
		})
		document.getElementsByTagName('body')[0].appendChild(this.el);

		// setup event listeners
		// window.addEventListener('txxupdate', this.update.bind(this), false);
	}

	update (inEvent) {
		// respond to any new action events?
		//console.log(inEvent);
	}

	handleAfterTransition (lifecycle) {
		// console.log(lifecycle.transition, lifecycle.from, lifecycle.to);
		// set new state info
		this.current_state_timestamp = (new Date()).getTime();

		// adjust visuals
		this.el.removeClass(lifecycle.from);
		this.el.addClass(lifecycle.to);

		// adjust audio
		// TODO
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

class SituationShipWreck extends Situation {
	constructor (inAreaCode, inName, inTools) {
		super(inAreaCode, inName, inTools);

		this.fsm = new StateMachine({
			init: 'fire',
			transitions: [
				{ name: 'extinguish',   from: 'fire',     to: 'halffire' },
				{ name: 'extinguished', from: 'halffire', to: 'calm'     },
				{ name: 'flareup',      from: 'halffire', to: 'fire'     },
				{ name: 'lightup',      from: 'calm',     to: 'halffire' }
			],
			methods: {
				// onExtinguish:      function () { console.log('Ship extinguishing') },
				// onExtinguished:    function () { console.log('Ship extinguished')  },
				// onFlareup:         function () { console.log('Ship flared up')     },
				// onLightup:         function () { console.log('Ship lighted up')    },
				onAfterTransition: this.handleAfterTransition.bind(this)
			}
		});

		// setup event listeners
		window.addEventListener('tw1update', this.update.bind(this), false);
		window.addEventListener('tw2update', this.update.bind(this), false);
		window.addEventListener('ts1update', this.update.bind(this), false);
		window.addEventListener('ts2update', this.update.bind(this), false);
	}

	update (inEvent) {
		// super(inEvent);
		let tw1 = this.tools['tw1'],
			tw2 = this.tools['tw2'],
			ts1 = this.tools['ts1'],
			ts2 = this.tools['ts2'];

		switch (this.fsm.state) {
			case 'fire':
				if (tw1.area == 1 && tw1.close_to_screen && tw1.pointed_at_screen && tw2.is_moving) {
					this.fsm.extinguish();
				}
				break;
			case 'halffire':
				if (tw1.area == 1 && tw1.close_to_screen && tw1.pointed_at_screen && tw2.is_moving) {
					// do nothing, unless we've been in this state for 5+ seconds
					if (this.current_state_timestamp + 5000 < (new Date().getTime())) {
						this.fsm.extinguished();
					}
				} else if (this.current_state_timestamp + 3000 < (new Date().getTime())) {
					this.fsm.flareup();
				}
				break;
			case 'calm':
				if (ts1.area == 1 && ts1.area == ts2.area && ts1.close_to_screen && ts2.close_to_screen && ts1.pointed_at_screen && ts2.pointed_at_screen) {
					this.fsm.lightup();
				}
				break;
			default: break;
		}
	}
}

class SituationAlienShock extends Situation {
	constructor (inAreaCode, inName, inTools) {
		super(inAreaCode, inName, inTools);

		this.fsm = new StateMachine({
			init: 'arrest',
			transitions: [
				{ name: 'shocked',       from: 'arrest',    to: 'sparking'  },
				{ name: 'doubleshocked', from: 'sparking',  to: 'heartrate' },
				{ name: 'arrested',      from: 'sparking',  to: 'arrest'    },
				{ name: 'halfarrested',  from: 'heartrate', to: 'sparking'  }
			],
			methods: {
				onAfterTransition: this.handleAfterTransition.bind(this)
			}
		});

		// setup event listeners
		window.addEventListener('ts1update', this.update.bind(this), false);
		window.addEventListener('ts2update', this.update.bind(this), false);
	}

	update (inEvent) {
		let ts1 = this.tools['ts1'],
			ts2 = this.tools['ts2'];

		switch (this.fsm.state) {
			case 'arrest':
				if ((ts1.area == 2 && ts1.close_to_screen && ts1.pointed_at_screen) || (ts2.area == 2 && ts2.close_to_screen && ts2.pointed_at_screen)) {
					this.fsm.shocked();
				}
				break;
			case 'sparking':
				if ((ts1.area == 2 && ts1.close_to_screen && ts1.pointed_at_screen) || (ts2.area == 2 && ts2.close_to_screen && ts2.pointed_at_screen)) {
					// if either, remain in state
					// if both, move on if in this state for some time
					if (ts1.area == 2 && ts1.close_to_screen && ts1.pointed_at_screen && ts2.area == 2 && ts2.close_to_screen && ts2.pointed_at_screen) {
						if (this.current_state_timestamp + 3000 < (new Date().getTime())) {
							this.fsm.doubleshocked();
						}
					}
				} else {
					this.fsm.arrested()
				}
				break;
			case 'heartrate':
				// continued shocks cause a new arrest
				if (ts1.area == 2 && ts1.close_to_screen && ts1.pointed_at_screen && ts2.area == 2 && ts2.close_to_screen && ts2.pointed_at_screen) {
					if (this.current_state_timestamp + 2000 < (new Date().getTime())) {
						this.fsm.halfarrested();
					}
				}
				break;
			default: break;
		}
	}
}

class Tool {
	constructor (inID, inName) {
		this.toolID            = (inID) ? inID : 0;
		this.toolName          = inName;
		this.pos               = 0;
		this.close_to_screen   = false;
		this.area              = 0;
		this.pointed_at_screen = false;
		this.is_moving         = false;

		// setup event listeners
		window.addEventListener('tracker'+this.toolID+'update', this.update.bind(this), false);
	}

	update (inEvent) {
		// update position from tracker
		let d = inEvent.detail;
		let change = false;

		if (this.pos != d.x) {
			this.pos = d.x;
			change = true;
		}
		if (this.close_to_screen != d.close) {
			this.close_to_screen = d.close;
			change = true;
		}
		if (this.area != d.area) {
			this.area = d.area;
			change = true;
		}
		if (this.pointed_at_screen != d.pointed) {
			this.pointed_at_screen = d.pointed;
			change = true;
		}
		if (this.is_moving != d.is_moving) {
			this.is_moving = d.is_moving;
			change = true;
		}

		// send out change event
		if (change) {
			let toolEvent = new CustomEvent(this.toolName+'update', {detail: this});
			window.dispatchEvent(toolEvent);
		}

		// update state representation on screen
		// TODO
	}
}

// ----------------------------------------------------------------------------

/**
 * Wait for whole page to load before setting up.
 * Prevents problems with objects not loaded yet while trying to assign these.
 */
window.addEventListener('pageshow', function () {
	window.main = new MainLogic();
}, false);
