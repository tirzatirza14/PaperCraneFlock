"use strict"

class Particle {
   constructor(x,y,z) {
      this.pos = createVector(x,y,z)
      this.vel = createVector(0,0,0)
      this.acc = createVector(0,0,0)

      this.mass = random(1,3)
      this.rad = this.mass * 3

      //colour
      this.r = random(255)
      this.g = random(255)
      this.b = random(255)
      this.a = 100;
   }
   
   applyAttraction(other) {
      var distance = this.pos.dist(other.pos);
      var magnitude = (c_gravity * this.mass * other.mass) / (distance * distance);
      var force = p5.Vector.sub(other.pos, this.pos);
      force.normalize();
      force.mult(magnitude);
      //force.mult(-1); //make it repulsion
      this.applyForce(force);
   }
   
   position(x, y, z) {
      this.pos = createVector(x, y, z)
      return this
   }

   velocity(x, y, z) {
      this.vel = createVector(x, y, z)
      return this
   }

   colour(r, g, b, a) {
      this.r = r
      this.g = g
      this.b = b
      this.a = a
      return this
   }

   update() {
      this.vel.mult(0.8)
      this.vel.add(this.acc)
      this.pos.add(this.vel)
      this.acc.mult(0)
   }

   display() {
      push()
      translate(this.pos.x, this.pos.y, this.pos.z)
      //fill(this.r, this.g, this.b, this.a)
      sphere(this.rad)
      pop()
   }

   checkFloor() {
      if (this.pos.x > -floor_size / 2 && this.pos.x < floor_size / 2 &&
         this.pos.z > -floor_size / 2 && this.pos.z < floor_size / 2) {
         //if in the floor area 
         //they bounce
         if (this.pos.y - this.rad < floor_size) {
            this.pos.y = floor_size + this.rad
            this.vel.y *= -1
               //restitution 
            var co_res = map(this.mass, 1, 5, 0.99, 0.80)
            this.vel.y *= co_res
         }
      }
   }

   checkFloorxWall() {
      //x 
      if (this.pos.x < -floor_size / 2 || this.pos.x > floor_size / 2) {
         this.vel.x *= -1
      }

      //z
      if (this.pos.z < -floor_size / 2 || this.pos.z > floor_size / 2) {
         this.vel.z *= -1
      }

      this.pos.x = constrain(this.pos.x, -floor_size / 2, floor_size / 2)
      this.pos.z = constrain(this.pos.z, -floor_size / 2, floor_size / 2)

      //if in the floor area 
      //they bounce

      //floor or y 
      if (this.pos.y - this.rad < floor_size) {
         this.pos.y = floor_size + this.rad
         this.vel.y *= -1
         //restitution 
         var co_res = map(this.mass, 1, 5, 0.99, 0.80)
         this.vel.y *= co_res
      }

      //roof
      if (this.pos.y + this.rad > -floor_size) {
         this.pos.y = -floor_size - this.rad
         this.vel.y *= -1
         //restitution 
         var co_res = map(this.mass, 1, 5, 0.99, 0.80)
         this.vel.y *= co_res
      }

   }

   applyForce(force) {
      force.div(this.mass)
      this.acc.add(force)
   }

   checkCollision(other) {
      var distance = this.pos.dist(other.pos)
      if (distance < this.rad + other.rad) {
         //collided! 

         //this. particle
         var force = p5.Vector.sub(other.pos, this.pos)
         force.normalize()
         force.mult(this.vel.mag() * 0.8)
         other.applyForce(force)

         //other particle
         force.mult(-1)
         force.normalize()
         force.mult(other.vel.mag() * 0.8)
         this.applyForce(force)
      }
   }
}