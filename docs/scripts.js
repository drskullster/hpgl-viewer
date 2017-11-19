var fileInput = document.getElementById("hpgl-upload-input");
var machineWidthInput = document.getElementById("hpgl-machine-width");
var machineHeightInput = document.getElementById("hpgl-machine-height");
var hpgl;

var hpglViewer = new HPGLViewer({
  container: "hpgl-viewer-canvas",
  canvasWidth: 900, // in px
  machineTravelWidth: 416, // in mm
  machineTravelHeight: 259, // in mm
  machineRatio: 40
});

fileInput.addEventListener("change", function (e) {
  e.preventDefault();
  var file = fileInput.files[0];
  if (!file) {
    alert('Select a file');
    return;
  }
  var fileReader = new FileReader();
  fileReader.onload = function (e) {
    hpgl = e.target.result;
    hpglViewer.draw(hpgl);
  };
  fileReader.readAsText(file);
});

machineWidthInput.addEventListener("change", function(e) {
  hpglViewer.setMachineTravelWidth(e.target.value);
  if(hpgl) {
    hpglViewer.draw(hpgl);
  }
});

machineHeightInput.addEventListener("change", function(e) {
  hpglViewer.setMachineTravelHeight(e.target.value);
  if(hpgl) {
    hpglViewer.draw(hpgl);
  }
});


