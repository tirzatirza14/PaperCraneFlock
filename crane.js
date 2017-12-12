"use strict"

class Crane {

   constructor(x, y, z, a) {
      this.pos = createVector(x, y, z)
      this.vel = createVector(random(-2, 2), random(-1, 1), random(-2, 2))
      this.acc = createVector(0, 0, 0)

      this.mass = random(10,30)
      this.col = color(30, 0, 0)

      this.varyAmp = a
      this.varySpeed = random(control.wingSpeed)

      this.maxSpeed = 10; // max speed;
      this.maxSteerForce = 0.05; // max steering force

      this.separateDistance = 50
      this.neighbourDistance = 30

   }

   applyForce(force) {
      force.div(this.mass)
      this.acc.add(force)

      this.angle = this.vel.heading()
   }

   update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
   }

   applyAttraction(other) {
      var distance = this.pos.dist(other.pos);
      var magnitude = (c_gravity * this.mass * other.mass) / (distance * distance);
      var force = p5.Vector.sub(other.pos, this.pos);
      force.normalize();
      force.mult(magnitude);
      force.mult(-1); //make it repulsion
      this.applyForce(force);


   }

   align(others) {
      //sum
      var velocity = createVector()
      var count = 0
      for (var i = 0; i < others.length; i++) {
         var other = others[i]
         var distance = this.pos.dist(other.pos)
         if (distance < this.neighbourDistance && distance > 0) {
            velocity.add(other.vel)
            count++
         }
      }
      //avg
      if (count > 0) {
         velocity.div(count)
         velocity.setMag(this.maxSpeed)
         var steer = p5.Vector.sub(velocity, this.vel)
            //steer.limit(this.maxSteerForce)
         this.applyForce(steer)
         return steer
      }
      return velocity * -1
   }

   seek(target) {
      var desired = p5.Vector.sub(target, this.pos)
      desired.setMag(this.maxSpeed)
      var steer = p5.Vector.sub(desired, this.vel)
      steer.limit(this.maxSteerForce)
      this.applyForce(steer)
      return steer
   }

   wingR() {
      var value = sin(frameCount * this.varySpeed) * this.varyAmp;
      //rightWing
      beginShape()
      vertex(this.pos.x + 10, this.pos.y, this.pos.z)
      vertex(this.pos.x + 80, this.pos.y, this.pos.z)
      vertex(this.pos.x, this.pos.y - 60 + value, this.pos.z + 130)
      endShape(CLOSE)
   }

   wingL() {
      var value = sin(frameCount * this.varySpeed) * this.varyAmp;
      //leftWing
      beginShape()
      vertex(this.pos.x + 10, this.pos.y, this.pos.z)
      vertex(this.pos.x + 80, this.pos.y, this.pos.z)
      vertex(this.pos.x, this.pos.y - 60 + value, this.pos.z - 130)
      endShape(CLOSE)
   }

   body() { //body
      //0,0 is in the middle of the 3D world 
      //body
      var value = sin(frameCount * 0.01) * (this.varyAmp / 3);

      push()
      beginShape()
      vertex(this.pos.x, this.pos.y, this.pos.z)
      vertex(this.pos.x + 70, this.pos.y - 20, this.pos.z)
      vertex(this.pos.x + 80, this.pos.y, this.pos.z)
      endShape(CLOSE)

      //tail
      beginShape()
      vertex(this.pos.x - 20 + value, this.pos.y - 100, this.pos.z)
      vertex(this.pos.x + 20, this.pos.y, this.pos.z)
      vertex(this.pos.x, this.pos.y, this.pos.z)
      endShape(CLOSE)

      //neck
      beginShape()
      vertex(this.pos.x + 60, this.pos.y, this.pos.z)
      vertex(this.pos.x + 80 + value, this.pos.y - 60, this.pos.z)
      vertex(this.pos.x + 80, this.pos.y, this.pos.z)
      endShape(CLOSE)

      //head
      beginShape()
      vertex(this.pos.x + 80 + value, this.pos.y - 60, this.pos.z)
      vertex(this.pos.x + 90, this.pos.y - 40, this.pos.z)
      vertex(this.pos.x + 75 + value * 0.5, this.pos.y - 50, this.pos.z)
      endShape()

      pop()
   }

   checkDistance() {

   }

   checkFloorxWall() {
      var limitWalls = floor_size * 3.5
         //x 
      if (this.pos.x < -limitWalls || this.pos.x > limitWalls) {
         this.vel.x *= -0.3
      }

      //z
      if (this.pos.z < -limitWalls || this.pos.z > limitWalls) {
         this.vel.z *= -0.3
      }

      this.pos.x = constrain(this.pos.x, -limitWalls, limitWalls)
      this.pos.z = constrain(this.pos.z, -limitWalls, limitWalls)

      //if in the floor area 
      //they bounce

      //floor or y 
      if (this.pos.y < limitWalls) {
         //this.pos.y = limitWalls
         this.vel.y *= -0.3
            //restitution 
            // var co_res = map(this.mass, 1, 5, 0.99, 0.80)
            // this.vel.y *= co_res
      }

      //roof
      if (this.pos.y > -limitWalls) {
         //this.pos.y = -limitWalls
         this.vel.y *= -0.3
            //restitution 
            // var co_res = map(this.mass, 1, 5, 0.99, 0.80)
            // this.vel.y *= co_res
      }
   }
   
   
}
