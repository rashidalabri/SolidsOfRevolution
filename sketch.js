var axisLength = 500;
var axisLengthMin = 100
var axisLengthMax = 1000
var axisLengthStep = 100;

var leftBound = 0;
var rightBound = 150;

var leftBoundMin = -axisLength;
var leftBoundMax = rightBound;
var leftBoundStep = 10;

var rightBoundMin = leftBound;
var rightBoundMax = axisLength;
var rightBoundStep = 10;

var maxAngle = 0;
var maxAngleMin = 0 ;
var maxAngleMax = 360;
var maxAngleStep = 10;

var graphFunction = ['firstOrder', 'secondOrder', 'thirdOrder'];


var lineRes = 10;
var angleRes = 30;

var dx;

var settingsGui;
var graphGui;

var rotateSolid = false;

var horizontalDisplacement = 0;
var verticalDisplacement = 0;

var horizontalStretch = 1;
var horizontalStretchMin = 1/100000;
var horizontalStretchMax = 1;
var horizontalStretchStep = 1/100000;

var verticalStretch = 1;
var verticalStretchMin = 1/100000;
var verticalStretchMax = 1;
var verticalStretchStep = 1/100000;


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  
  sliderRange(10, 100, 5);

  dx = (rightBound - leftBound) / lineRes;

  settingsGui = createGui('Settings');
  settingsGui.addGlobals('axisLength', 'leftBound', 'rightBound', 'lineRes', 'maxAngle', 'angleRes');
  
  graphGui = createGui('Graph');
  graphGui.addGlobals('graphFunction', 'horizontalDisplacement', 'verticalDisplacement', 'horizontalStretch', 'verticalStretch');

}

function draw() {
  background(0);

  if(rotateSolid == true) {
    maxAngle += 1;
  }

  if(maxAngle == 360) {
    rotateSolid = false;
  }

  if(maxAngle > 360) {
    maxAngle = 0;
  }

  var locX = mouseX - height / 2;
  var locY = mouseY - width / 2;
  ambientLight(60, 60, 60);
  pointLight(255, 255, 255, locX, locY, 100);

  orbitControl();

  // Axis
  stroke(255, 0, 0);
  line(-axisLength, 0, 0, axisLength, 0, 0);

  stroke(0, 255, 0);
  line(0, -axisLength, 0, 0, axisLength, 0);

  var selectedFunction;

  switch(graphFunction) {
    case 'firstOrder':
      selectedFunction = first_order;
      break;

    case 'secondOrder':
      selectedFunction = second_order;
      break;

    case 'thirdOrder':
      selectedFunction = third_order;
      break;
  }

  var f = function (x) {
    return evaluateWithTransformations(selectedFunction, x, verticalStretch, horizontalStretch, horizontalDisplacement, verticalDisplacement);
  };

  // Draw function
  stroke(255);
  dx = (rightBound - leftBound) / lineRes;
  for(var x = leftBound; x <= rightBound - dx; x += dx) {
    line(x, -f(x), 0, x+dx, -f(x+dx), 0);
  }

  // Draw 3D shape
  if(maxAngle != 0) {
    dt = maxAngle / angleRes;
    for(var t = 0; t <= maxAngle - dt; t += dt) {
      for(var x = leftBound; x <= rightBound - dx; x += dx) {
        beginShape();
        fill(255, 255, 255);
        vertex(x, -f(x)*cos(t), f(x)*sin(t));
        vertex(x, -f(x)*cos(t+dt), f(x)*sin(t+dt));
        vertex(x+dx, -f(x+dx)*cos(t+dt), f(x+dx)*sin(t+dt));
        vertex(x+dx, -f(x+dx)*cos(t), f(x+dx)*sin(t));
        endShape(CLOSE);
      }
    }
  }
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (keyCode === 32 && rotateSolid == false && maxAngle == 0) {
    rotateSolid = true;
  } else if (keyCode === 32 && rotateSolid == true) {
    rotateSolid = false;
  } else if(keyCode === 32 && rotateSolid == false && maxAngle > 0) {
    maxAngle = 0;
  }
}

function first_order(x) {
  return x;
}

function second_order(x) {
  return x*x;
}

function third_order(x) {
  return x*x*x;
}

function evaluateWithTransformations(f, x, a, b, h, k) {
  return a * f(b * (x - h)) + k;
}

