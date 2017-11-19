HPGLViewer = function(options) {
  if(!options.container) {
    console.error("Please define a container in options");
  }

  if(!options.layerColors) {
    options.layerColors = ["black", "red", "blue", "green", "yellow", "pink", "orange", "turquoise"];
  }

  if(!options.machineRatio) {
    options.machineRatio = 40;
  }

  var canvas = document.getElementById(options.container),
      ctx = canvas.getContext("2d");

  var canvasWidth,
      canvasHeight;

  var setCanvasSize = function() {
    canvas.width = options.canvasWidth;
    canvas.height = options.canvasWidth / (options.machineTravelWidth / options.machineTravelHeight);

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
  };

  setCanvasSize();

  var logError = function(cmd) {
    console.log("[HPGL Viewer] Could not parse line: ", cmd);
  };

  var isInt = function(value) {
    if (isNaN(value)) {
      return false;
    }
    var x = parseFloat(value);
    return (x | 0) === x;
  }

  var coordinates = function(x, y) {
    var x = (x / options.machineRatio) / (options.machineTravelWidth / canvasWidth);
    var y = canvasHeight - ((y / options.machineRatio) / (options.machineTravelHeight / canvasHeight));

    return [x, y];
  };

  /**
   * Get distance between two points
   * https://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
   */
  var distance = function(x1, x2, y1, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.hypot(a, b);
  };

  this.draw = function(hpgl) {
    hpgl = hpgl.replace(/(\r\n|\n|\r)/gm,"");
    var commands = hpgl.split(";");
    var currentColor = options.layerColors[0];
    var prevCoords = [0, 0];

    this.clear();
    ctx.lineWidth = .5;
    ctx.strokeStyle = currentColor;

    commands.forEach(function(cmd) {
      if(!cmd.length) {
        return;
      }

      var cmd = cmd.toUpperCase();

      if(cmd.match(/^PU/)) {
        // PEN UP
        var subcmd = cmd.replace("PU", "").split(",");
        if(subcmd.length < 2) {
          return;
        }

        ctx.beginPath();
        var coord = coordinates(subcmd[0], subcmd[1]);
        ctx.moveTo(coord[0], coord[1]);
        prevCoords = coord;
      } else if(cmd.match(/^PD/)) {
        // PEN DOWN (PD400,0; or PD400,0,400,400;)
        var subcmd = cmd.replace("PD", "").split(",");
        if(subcmd.length < 2) {
          return;
        }

        while(subcmd.length) {
          var subsubcmd = subcmd.splice(0, 2);
          var coord = coordinates(subsubcmd[0], subsubcmd[1]);
          ctx.lineTo(coord[0], coord[1]);
          prevCoords = coord;
        }
        ctx.stroke();
      } else if(cmd.match(/^AA/)) {
        // ARC ABSOLUTE
        var subcmd = cmd.replace("AA", "").split(",");
        if(subcmd.length < 3) {
          logError(cmd);
          return;
        }

        var coord = coordinates(subcmd[0], subcmd[1]);
        var angle = subcmd[2] * (Math.PI/180); // degrees to radian
        var radius = distance(prevCoords[0], coord[0], prevCoords[1], coord[1]);
        var startAngle = Math.atan2(prevCoords[1] - coord[1], prevCoords[0] - coord[0]);

        ctx.beginPath();
        ctx.arc(coord[0], coord[1], radius, startAngle - angle, startAngle, true);
        ctx.stroke();
        prevCoords = coord;
      } else if(cmd.match(/^SP/)) {
        // PEN SELECT
        var layerNumber = parseInt(cmd.replace("SP", "")) - 1;
        if(layerNumber > 0) {
          currentColor = options.layerColors[layerNumber];
        } else {
          // SP0 or SP
          currentColor = null;
        }
        ctx.strokeStyle = currentColor;
      } else if(cmd.match(/^IN/)
          || cmd.match(/^VS/ ) // change Pen Speed
          || cmd.match(/^PA/ ) // Position absolute
      ) {
        // Do nothing
      } else {
        logError(cmd);
      }
    });
  };

  this.setMachineTravelWidth = function(width) {
    if(isInt(width)) {
      options.machineTravelWidth = width;
      setCanvasSize();
    }
  };

  this.setMachineTravelHeight = function(height) {
    if(isInt(height)) {
      options.machineTravelHeight = height;
      setCanvasSize();
    }
  };

  this.clear = function() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }
};