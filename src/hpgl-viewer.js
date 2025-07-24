const HPGLViewer = (options) => {
  if (!options.container) {
    console.error("Please define a container in options");
  }

  if (!options.layerColors) {
    options.layerColors = ["black", "red", "blue", "green", "yellow", "pink", "orange", "turquoise"];
  }

  if (!options.machineRatio) {
    options.machineRatio = 40;
  }

  const canvas = document.getElementById(options.container),
      ctx = canvas.getContext("2d");

  let canvasWidth,
      canvasHeight;

  const _setCanvasSize = function () {
    canvas.width = options.canvasWidth;
    canvas.height = options.canvasWidth / (options.machineTravelWidth / options.machineTravelHeight);

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
  };

  _setCanvasSize();

  const _log = (msg) => {
    console.log("[HPGL Viewer]", msg);
  };

  const _logError = (cmd) => {
    _log("Could not parse line:" + cmd);
  };

  const _isInt = (value) => {
    if (isNaN(value)) {
      return false;
    }
    const x = parseFloat(value);
    return (x | 0) === x;
  };

  const _coordinates = (x, y) => {
    x = (x / options.machineRatio) / (options.machineTravelWidth / canvasWidth);
    y = canvasHeight - ((y / options.machineRatio) / (options.machineTravelHeight / canvasHeight));

    return [x, y];
  };

  const _length = (l) => {
    return (l / options.machineRatio) / (options.machineTravelWidth / canvasWidth);
  }

  /**
   * Get distance between two points
   * https://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
   */
  const _distance = (x1, x2, y1, y2) => {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.hypot(a, b);
  };

  const draw = (hpgl) => {
    hpgl = hpgl.replace(/(\r\n|\n|\r)/gm, "");
    const commands = hpgl.split(";");
    let currentColor = options.layerColors[0];
    let prevCoords = [0, 0];
    let isPenDown = false;

    _clear();
    ctx.lineWidth = .5;
    ctx.strokeStyle = currentColor;

    commands.forEach(function (cmd) {
      if (!cmd.length) {
        return;
      }

      cmd = cmd.toUpperCase();

      if (cmd.match(/^PU/)) {
        // PEN UP
        isPenDown = false;
        const subcmd = cmd.replace("PU", "").split(",");
        if (subcmd.length < 2) {
          return;
        }

        prevCoords = _move(subcmd);
      } else if (cmd.match(/^PD/)) {
        // PEN DOWN (PD400,0; or PD400,0,400,400;)
        isPenDown = true;
        const subcmd = cmd.replace("PD", "").split(",");
        if (subcmd.length < 2) {
          return;
        }

        prevCoords = _trace(subcmd);
      } else if (cmd.match(/^PA/)) {
        const subcmd = cmd.replace("PA", "").split(",");
        if (subcmd.length < 2) {
          return;
        }

        if (isPenDown) {
          prevCoords = _trace(subcmd);
        } else {
          prevCoords = _move(subcmd);
        }
      } else if (cmd.match(/^AA/)) {
        // ARC ABSOLUTE
        const subcmd = cmd.replace("AA", "").split(",");
        if (subcmd.length < 3) {
          _logError(cmd);
          return;
        }

        const coord = _coordinates(subcmd[0], subcmd[1]);
        const angle = subcmd[2] * (Math.PI / 180); // degrees to radian
        const radius = _distance(prevCoords[0], coord[0], prevCoords[1], coord[1]);
        const startAngle = Math.atan2(prevCoords[1] - coord[1], prevCoords[0] - coord[0]);

        ctx.beginPath();
        ctx.arc(coord[0], coord[1], radius, startAngle - angle, startAngle, true);
        ctx.stroke();
        prevCoords = coord;
      } else if (cmd.match(/^CI/)) {
        // CIRCLE
        const subcmd = cmd.replace("CI", "").split(",");
        const radius = _length(subcmd[0]);
        const resolution = subcmd[1]; // Ignored for now.
        ctx.beginPath();
        ctx.ellipse(prevCoords[0], prevCoords[1], radius, radius, 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (cmd.match(/^SP/)) {
        // PEN SELECT
        const layerNumber = parseInt(cmd.replace("SP", "")) - 1;
        if (layerNumber > 0) {
          currentColor = options.layerColors[layerNumber];
        } else {
          // SP0 or SP
          currentColor = null;
        }
        ctx.strokeStyle = currentColor;
      } else if (cmd.match(/^IN/)
          || cmd.match(/^VS/) // change Pen Speed
      ) {
        // Do nothing
      } else {
        _logError(cmd);
      }
    });

    _log("Finished parsing");
  };

  const setMachineTravelWidth = function (width) {
    if (_isInt(width)) {
      options.machineTravelWidth = width;
      _setCanvasSize();
    }
  };

  const setMachineTravelHeight = function (height) {
    if (_isInt(height)) {
      options.machineTravelHeight = height;
      _setCanvasSize();
    }
  };

  const _clear = function () {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  const _move = function (cmd) {
    ctx.beginPath();
    const coord = _coordinates(cmd[0], cmd[1]);
    ctx.moveTo(coord[0], coord[1]);
    return coord;
  };

  const _trace = function (cmd) {
    let prevCoords;
    while (cmd.length) {
      const subcmd = cmd.splice(0, 2);
      const coord = _coordinates(subcmd[0], subcmd[1]);
      ctx.lineTo(coord[0], coord[1]);
      prevCoords = coord;
    }
    ctx.stroke();
    return prevCoords;
  };

  return {
    draw,
    setMachineTravelWidth,
    setMachineTravelHeight,
  };
};

export { HPGLViewer };
