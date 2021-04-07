let me;
let observers = []
let waves = []

function preload() {
  cyclistImg = loadImage("assets/bike-with-boom-blaster.png")
  observerImg = loadImage("assets/listener.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER)
  me = new SoundSource(200, 200)
  for (let i = 0; i < 2; i++) {

    observers.push(new Observer(i * width + 150 - 300 * i, 3 * height / 4))
  }
  let gui = new dat.GUI();

  gui.add(me, "period", 0, 5, 0.25)
  gui.add(me, "waveSpeed", 0, 10, 0.5)
  gui.add(me, "listeningDistance", 0, height, 10)
  gui.add(me, "vx", -5, 5, 0.1).listen()
  gui.add(me, "x", 0, width, 10).listen()
  gui.add(me, "drawGraphs")
  gui.add(me, "playPause")

}

function draw() {
  if (me.playing == false) {
    noLoop()
  } else {
    loop()
  }
  background(84, 162, 204);
  me.show()
  me.update()


  for (wave of waves) {
    if (wave.time < (50 * 60)) {
      wave.generateWave()
      wave.time += me.waveSpeed
    } else {
      waves.shift()
    }

  }

  for (observer of observers) {
    observer.show()
    if (me.drawGraphs == true) {
      observer.update()
    }
  }
  me.time += 1

  if ((me.time / 60) % me.period == 0) {
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
    this.period = 0.75
    this.time = 0
    this.waveSpeed = 2
    this.listeningDistance = height / 2
    this.drawGraphs = true
  }

  playPause() {
    if (this.playing == true) {
      this.playing = false
      noLoop()
    } else {
      this.playing = true
      loop()
    }
  }



  show() {
    image(cyclistImg, this.x, this.y)
  }

  update() {
    this.x += this.vx
  }

  appendWave() {
    waves.push(new SoundWave(this.x, this.y))
  }

}

class Observer {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.pixels = []
    this.maxima = []
  }

  show() {
    image(observerImg, this.x, this.y)
  }

  update() {
    this.pixels = []
    this.maxima = []
    let dirVector = createVector(me.x - this.x, me.y - this.y)
    let angle = dirVector.heading()
    dirVector.normalize()
    for (let i = 0; i < me.listeningDistance; i++) {
      push()
      fill(0)
      // ellipse(this.x+i*cos(angle), this.y+ i*sin(angle), 5)
      pop()
      let px = get(this.x + i * cos(angle), this.y + i * sin(angle))
      this.pixels.push(px)
      if (px[0] == 0) {
        if ((i - this.maxima[this.maxima.length - 1]) > 20 || this.maxima.length == 0) {
          this.maxima.push(i)
        }
      }

    }
    if (this.maxima.length > 1) {
      push()
      noFill()
      stroke(220, 0, 220)
      strokeWeight(2)
      beginShape()
      let xint = me.listeningDistance / (this.maxima.length - 1)
      for (let i = 0; i < this.maxima.length - 1; i++) {
        for (let j = i * xint; j < (i + 1) * xint; j++) {
          vertex(this.x + j - 140, this.y + 120 + 30 * sin(TWO_PI / (this.maxima[i + 1] - this.maxima[i]) * j))
        }
      }
      // sin(maxima[0])
      endShape()
      pop()
    }

  }

}



class SoundWave {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.time = 0
  }


  generateWave() {
    push()
    beginShape()
    noFill()
    stroke(0)
    strokeWeight(3)
    for (let i = 0; i < TWO_PI; i += 0.05) {
      vertex(this.x + cos(i) * this.time + 5, this.y + sin(i) * this.time - 85)
    }

    endShape(CLOSE)
    pop()



  }
}

function keyPressed() {
  if (key == " ") {
    me.playPause()
  } else if (keyCode == LEFT_ARROW) {
    me.vx -= 0.5
  } else if (keyCode == RIGHT_ARROW) {
    me.vx += 0.5
  }
}

function touchStarted() {
  if (mouseX > 3 * width / 4 && mouseY > 200) {
    me.vx += 0.5
  } else if (mouseX < width / 4 && mouseY > 200) {
    me.vx -= 0.5
  } else if (mouseY > 200) {
    me.playPause()
  }
}
