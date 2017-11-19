# HPGLViewer
Javascript HPGL viewer using HTML5 Canvas.

**Warning:** This is an early release, only a
handful of HPGL code is handled. If you would like to 
contribute, please do !

The code (as well as the doc) is really simple and straightforward for now, 
the idea is to see if there are people interested in a library
to use in their own project, or just in an online viewer, or no one is interested
because HPGL is sooo old.

## Demo

https://drskullster.github.io/HPGLViewer

## Usage

Create a HTML Canvas element in your HTML page :

    <canvas id="hpgl-viewer"></canvas>

Download `HPGLViewer.js` file in `src/` folder 
then initialize with :

    var hpglViewer = new HPGLViewer({
        container: "hpgl-viewer", // ID of the HTML Canvas element
        canvasWidth: 900, // in px
        machineTravelWidth: 416, // in mm
        machineTravelHeight: 259 // in mm
    });
    
Feed HPGL content to viewer :

    hpglViewer.draw("PU0,0;PD4000,4000;")

## HPGL Commands

### Done

* `PU` Pen Up (simply move on canvas)
* `PD` Pen Down
* `AA` Arc
* `SP` Pen Select

### Ignored

* `IN` Initialize
* `VS` speed select
* `PA` Plot with absolute coordinates (like PD ?)

### Todo

* `CP` and other Text related commands
* `CI` Circles
* `PR` Position relative to next point ?

## Reference

See here for a list of HPGL commands :
* http://www.isoplotec.co.jp/HPGL/eHPGL.htm#-%20Plotter%20coordinate%20system
* http://paulbourke.net/dataformats/hpgl/ 