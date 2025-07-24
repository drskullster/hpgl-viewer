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

https://drskullster.github.io/hpgl-viewer/demo

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

## Development

Library is packaged into a UMD module with webpack.

You can run a development server that will watch changes
and reload the demo page with `npm run dev`.

## HPGL Commands

### Done

* `PU` Pen Up (simply move on canvas)
* `PD` Pen Down
* `PA` Plot with absolute coordinates
* `AA` Arc
* `SP` Pen Select
* `CI` Circles

### Ignored

* `IN` Initialize
* `VS` speed select

### Todo

* `CP` and other Text related commands
* `CI` Circles resolution parameter
* `PR` Position relative to next point ?
* `IP` and `SC` machine scale ?

## Reference

See here for a list of HPGL commands :
* http://www.isoplotec.co.jp/HPGL/eHPGL.htm#-%20Plotter%20coordinate%20system
* http://paulbourke.net/dataformats/hpgl/ 
