let me;
let observers = []
let time = 0;
let waves = []

function preload() {
  bImg = loadImage("assets/bike-with-boom-blaster.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER)
  me = new SoundSource(200,200)
  for (i = 0; i < 5; i++) {
    
    observers.push(new Observer(3/4 * width + 30 * i, height/2))
  }
  let gui = new dat.GUI();

  gui.add(me, "vx", -5, 5, 0.1); // shorthand for min/max/step 
  gui.add(me, "x", 0, width, 10)

}

function draw() {
  background(220);
  me.show()
  me.update()

  for (observer of observers) {
    observer.show()
  }

  for (wave of waves) {
    if (wave.time < (10 * 60)) {
      wave.generateWave()
      wave.time += 1
    }
  }

  time += 1

  if (frameCount % 120 == 0) {
    me.appendWave()
  }

}

class SoundSource {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.vx = 0
    this.playing = true
    this.xList = []
  }


  show() {
    image(bImg, this.x, this.y)
  }

  update() {
    this.x += this.vx
  }

  appendWave() {
    waves.push(new SoundWave(this.x, this.y))
  }
  
}

class Observer {
  constructor(x,y) {
    this.x = x
    this.y = y
  }

  show() {
    push()
    fill(255)
    ellipse(this.x, this.y, 20)
    pop()
  }

}



class SoundWave {
  constructor(x,y) {
    this.x = x
    this.y = y
    this.time = 0
  }


  generateWave() {
    push()
    beginShape()
    noFill()
    stroke(0)
    for (i = 0; i < TWO_PI; i += 0.05) {
      vertex(this.x + cos(i)*this.time, this.y + sin(i)*this.time)
    }

    endShape(CLOSE)
    pop()


    
  }
}

function keyPressed() {
  if (key = " ") {
    me.appendWave()
  }
}