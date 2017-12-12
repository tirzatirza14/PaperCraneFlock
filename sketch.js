"use strict"

var cranes = []
var floor_level = -200
var floor_size = 300
var c_gravity = 20
var gravity_B = false

var attractors = []

var rotY = 0
var canvas

var addWind = false;

var gui
var control = {
   numOfCranes: 3,
   distanceBetweenDots: 15,
   outlineColour: '#000000',
   wingSpeed: 0.4,
   craneSize: 0.3,
   waveHeight: 0.5,
   addWind: false
}

function preload() {
   gui = new dat.GUI()
   gui.add(control, 'addWind')
   gui.addColor(control, 'outlineColour')
   gui.add(control, 'numOfCranes', 3, 20).step(1)
   gui.add(control, 'distanceBetweenDots', 5, 25).step(1)
   gui.add(control, 'wingSpeed', 0.005, 0.5).step(0.01)
   gui.add(control, 'craneSize', 0.2, 1).step(0.005)
   gui.add(control, 'waveHeight', 0, 1).step(0.01)
}

function setup() {
   canvas = createCanvas(600, 600, WEBGL)

   //gui.style('z-index', '1')
   // gui.position (0,0)

   var edgeX = width / 4
   var edgeY = height / 4

   makeCrane()

   //attractors 
   for (var i = 0; i < 20; i++) {
      attractors[i] = new Particle()
         //.position(0, 0, 0)
         .position(random(-600, 600), random(-600, 600), random(-600, 600))
   }
}

function draw() {
   //background(255)  

   //rotating the object with mouse
   // var rotX = map(mouseY, 0, width, radians(-180), radians(180))
   // var rotY = map(mouseX, 0, width, radians(-180), radians(180)) //rotate when you move the mouse
   //rotateX(radians(rotX)
   rotateY(radians(rotY))

   dotClouds()

   // for (var a = 0; a < attractors.length; a++) {
   //    var attr = attractors[a]
   //       //noFill()
   //    attr.mass = 1000
   //    attr.rad = 20
   //    attr.update()
   //    attr.display()
   // }

   ambientLight(control.outlineColour)

   var scaleFactor = control.craneSize
   scale(-scaleFactor, -scaleFactor, -scaleFactor)

   //cranes!
   push()
   for (var i = 0; i < control.numOfCranes; i++) {
      var c = cranes[i]
         //c.varySpeed = control.wingSpeed
         // if (c.pos.y < floor_level) {
         // }
         
      // var mouseMove = map(mouseX, 0, width, -100, 100)
      // var target = createVector(mouseMove)
      // c.seek(target)
      
      c.align(cranes)
      
      if (control.addWind) {
         var windSize = 4
         var wind = createVector(-windSize);
         c.applyForce(wind);
      }

      if (!gravity_B) {
         c.checkFloorxWall()
      } else {

      }
      c.update()
      c.wingL()
      c.wingR()
      c.body()
   }
   pop()

   rotY += -0.4
}

function makeCrane() {
   //cranes 
   for (var i = 0; i < 30; i++) {
      var rand = random(-600, 600)
      cranes.push(new Crane(rand, rand + i * 100, rand, 30))
         // for (var j = 0; j < control.numOfCranes; j++) {
         //    var rand = random(-600, 600)
         //    cranes.push(new Crane(rand, rand + j * 100, rand, 30, random(0.005, 0.5)))
         // }
   }
}

function dotClouds() {
   rotateY(frameCount * 0.01);
   var waveSpeedL = control.waveHeight
   var res = control.distanceBetweenDots; //resolution
   for (var z = -width / 1.8; z < width/1.8; z += res) {
      for (var x = -width /1.8 ; x < width/1.8  ; x += res) {
         var amplfreq = 0.005 * waveSpeedL
         var freq1 = (frameCount + x) * amplfreq;
         var freq2 = (frameCount + z) * amplfreq;
         var amp = -120;
         var noiseVal = noise(freq1, freq2) * amp;
         var y = -floor_level + noiseVal;
         drawBox(x, y, z, 0.5);
      }
   }
}

function drawBox(x, y, z, s) {
   push();
   translate(x, y, z);
   sphere(s);
   pop();
}

//think about 
function gravitationalForce() {
   var gravity = createVector(0, 5);
   gravity.mult(c.mass);
   gravity_B = true;
   c.applyForce(gravity);
}

function attractionForce() {
   for (var j = 0; j < attractors.length; j++) {
      c.applyAttraction(attractors[j])
   }
}