# README for TIA demo

## Description
> A spaceship has crashed nearby and you are the first responders. Find out what the situation is and try to save any survivors…

The Tangible Interaction in Arena (TIA) project is a demo application for collaborative actions in a virtual reality space. This work demonstrates how two people can use tangible objects in a virtual reality space to accomplish tasks. It was developed to be run in the [UTS Data Arena][1], a large-scale (10m) 360º display.

We opted to focus on working together to provide first aid to aliens. We studied real life first aid scenarios but choose to represent a simpler and more forgiving situation in the final version. The aim is to showcase in the Data Arena how two people have to combine their tools (in action, location, and/or time) to accomplish tasks such as defibrillation of an alien and extinguishing a spaceship on fire.

**TBD link to some video evidence later on?**

## Credits
The project was funded by a UTS Data Arena Research Exhibit Grant 2017 for the creation and implementation of a tangible user interface in the UTS Data Arena (a 360-degree screen). This grant was awarded to Prof Dr Elise van den Hoven MTD and Dr Roberto Martinez-Maldonado. Development work was done by Iván Silva Feraud (programming and trackers) and Doménique van Gennip (animation and game logic).* 
During our research on first aid in clinical and surf lifesaving environments, we were assisted and advised by Evelyn Palominos Letelier and Dr Gaby Quintana Vigiola.

## Setup
The TIA demo runs as a webpage in any modern web browser. In the Data Arena, this webpage is stretched across the width and height of the large screen (roughly 10480px by 1200px). We use a custom web server to feed this webpage information from position trackers attached to the tools used to mend the aliens and spaceship. The IR markers are tracked by a system in the Data Arena to which our server subscribes, processing and sending on this data to the webpage where the main game logic translates it into actions onscreen.

## Running the software
There are two ways of running the code. The first assumes the use of a mock page to generate tracker input that is then fed to the arena view via an intermediary web server. The second way of running uses the Data Arena and cannot be replicated outside of that environment.

### Using the mock tracker page
Start the [node.js][2] server first with:

	$ node mock_server.js

Then open `[http://localhost:3000/mock.html][2]` in your web browser so you’re able to generate tracker data. Finally, open the arena view by using `[http://localhost:3000/index.html][3]`. By adjusting the tracker markers on the mock page, you influence the behaviour on the arena page.

### Using the Data Arena
This requires another web server codebase not included in this repository. This server, developed in Java, subscribes to the Data Arena’s streaming data of the IR tracker marker positions and sends these to the webpage running the game logic, similar to the mock server.

#### Opening a properly sized browser window
By default, a browser window in the arena doesn't fit the whole screen and requires manual resizing. There is however an easier way to get a window with the right size.

Open a new window and make sure you're not on a webpage (a blank page will do, like `about:blank`). These pages give additional privileges not affording to regular webpages. Then call the following command from the console terminal (needs the browser’s developer window to be open):

	> window.open('/', 'arena', 'left=50,top=0,width=10485,height=1200,titlebar=no');

There is also an `arena.html` file included which attempts to call the above, although reduced privileges may still result in a visible title bar and location bar. In Firefox, look for settings labelled `*window_open*` in `about:config` if you'd like to disable some preventive measures.

## Development notes

### Animating and rendering
We used Blender 2.8 for all animation work. Because it’s just used to generate a series of images, any software will do.

Here’s [a note to deal with View Layers in Blender 2.8][3] and how to exclude some from rendering (while still affecting the parts shown): set a collection’s View Layer option to `Set Holdout` to render it transparent. This only worked with Cycles, not EEVEE, at the time of writing.

Also, make sure the Film settings have transparency enabled and that the output is RGBA to include the alpha transparency value.

### Generating animated PNGs
Use [apngasm][4] to generate an animated PNG file from a sequence of still images (the most suitable output from your preferred animation software, like Blender).

On a Mac, it’s easy to install using homebrew:

	$ brew install apngasm

Using it goes as follows when the input files are intended as a 24 fps animation:

	$ apngasm -d 1:24 -o output.png *.png

If the final frame should persist for a longer period, simply specifying a delay at the end will apply to the last frame (that is, adding `1:1` at the end sets the last frame for 1 second). To avoid a looping animation, specify `-l 1` to get just a single loop of the animation.

## Limitations and known issues
- Responsiveness depends on refresh rate of the tracker data given that all logic is event-driven. Refresh rates should be less than one second, ideally under half a second.
- Tracker marker recognition is very sensitive to any disturbance or unideal angles, which both may generate spurious or missing tracker data. Good refresh rates can only compensate partially.
- The code isn’t checking whether tools are actually aimed at the aliens, etc. We didn’t get around to implementing those checks and most people aim for it anyway.
- Animations do not have transitions from one state to the next. This proved cumbersome and erratic and was removed.

## License
_TBD_

## Assets and code used from third parties
- [Javascript State Machine][5] by jakesgordon (MIT license)
- Audio samples from [Freesound.org][6] (CC0 license)
- [Audio from NASA’s Mars InSight pressure sensor while deployed on Mars][7]

[1]:	https://www.uts.edu.au/partners-and-community/data-arena/overview
[2]:	https://nodejs.org/en/
[3]:	https://blender.stackexchange.com/questions/126289/blender-2-8-multiple-view-layers
[4]:	https://github.com/apngasm/apngasm
[5]:	https://github.com/jakesgordon/javascript-state-machine
[6]:	https://freesound.org/
[7]:	https://www.nasa.gov/connect/sounds/index.html