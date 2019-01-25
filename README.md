# README for TIA demo

## Description
**TBD what is it**

This demo was part of a small project into the use of tangible objects in a collaborative virtual reality space. It was developed to be run in the [UTS Data Arena][1], a large-scale (10m) 360º display.

**TBD link to some video evidence later on?**

## Credits
The project was funded by a UTS Data Arena Research Exhibit Grant 2017 for the creation and implementation of a tangible user interface in the UTS Data Arena (a 360-degree screen). This grant was awarded to Elise van den Hoven and Roberto Martinez-Maldonado.

**TBD mention those involved, who did what**

**TBD acknowledge input from everyone**

## Setup
**TBD**

## Running the software
There are two ways of running the code. The first assumes the use of a mock page to generate tracker input that is then fed to the arena view via an intermediary webserver. The second way of running uses the Data Arena and cannot be replicated outside of that environment.

### Using the mock tracker page
Start the [node.js][2] server first with

	$ node mock_server.js

Then open `[http://localhost:3000/mock.html][2]` in your webbrowser so you’re able to generate tracker data. Finally, open the arena view by using `[http://localhost:3000/index.html][3]`. By adjusting the tracker markers on the mock page, you influence the behaviour on the arena page.

### Using the Data Arena
**TBD**

#### Opening a properly sized browser window
By default, a browser window in the arena doesn't fit the whole screen and requires manual resizing. There is however an easier way to get a window with the right size.

Open a new window and make sure you're not on a webpage (a blank page will do, like `about:blank`). These pages give additional privileges not affording to regular webpages. Then call the following command from the console terminal (needs the developer window to be open):

    > window.open('/', 'arena', 'left=50,top=0,width=10485,height=1200,titlebar=no');

There is also an `arena.html` file included which attempts to call the above, although reduced privileges may still result in a visible title bar and location bar. Look for settings labelled `*window_open*` in `about:config` if you'd like to disable some preventive measures.

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

If the final frame should persist for a longer period, simply specifying a delay at the end will apply to the last frame (that is, adding `1:1` at the end sets the last frame for 1 second).

## Limitations and known issues
**TBD**

## License
**TBD**

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