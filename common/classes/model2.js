import { Plant } from './plant.js'

class PlantModel2 extends Plant {

  static decayTime = 250;
  static seedData = {
    lifespan: {
      min: 1,
      max: 20,
      default: 10,
    },
    resistence: {
      min: 1,
      max: 50,
      default: 1,
    },
    spreadRate: {
      min: 1,
      max: 20,
      default: 10,
    },
  }

  static title = 'Resistence Model';
  static description = 'This type of plant has a sliding scale of resistence to infection. The higher the resistence, the less likely a plant is to be infected. Higher resistence plants are darker green.'

  decayed = false;

  lifespan;
  spreadTime;
  resistence;

  deathTimeout;

  constructor(seed, updateCallback, spreadCallback, infectCallback) {

    super();

    // Common things
    this.setCallbacks(updateCallback, spreadCallback, infectCallback)
    this.saveSeed(seed);



    this.lifespan = seed.lifespan;
    this.spreadTime = Math.ceil((this.constructor.cycleLength*10)/seed.spreadRate)

    this.resistence = seed.resistence;

    this.queueEvent(this.spreadTime, this.spreadEvent.bind(this));
    this.queueEvent(this.lifespan*this.constructor.cycleLength, this.die.bind(this));

  }

  spreadEvent(){
    if (this.alive) {
      this.spread();
      this.queueEvent(this.spreadTime, this.spreadEvent.bind(this));
    }
  }

  die(){
    if (this.alive) {
      this.alive = false;
      this.update();
      this.queueEvent(this.constructor.cycleLength*6, this.decay.bind(this));
    }
  }

  decay(){
    this.decayed = true;
    this.update();
  }

  infect(){
    this.infected = true;
    this.spreadTime = Math.min(this.constructor.cycleLength/4)
    this.queueEvent(this.constructor.cycleLength*2, this.die.bind(this));
    this.update();
  }

  infectable(){
    return this.alive && !this.infected && (this.resistence*2) < Math.ceil(Math.random()*100)
  }

  plantable(){
    return this.decayed || (!this.alive && !this.infected);
  }

  getColour(){
    let 
      red = 0, 
      green = 170-this.resistence*2, 
      blue = 0;
    
    if (!this.alive) {
      red += Math.round(green/3)
    }
    
    if (this.infected || this.decayed) {
      green = Math.round(green/2);
      blue += Math.round(green/2);
      red += green;
      if (this.alive) {
        blue += Math.round(green/2);
        green = 0;
      }
    }

    return `rgb(${red}, ${green}, ${blue})`
  }

  decommission(){
    this.alive = false;
    this.decayed = true;
    this.queueEvent = [];
  }
}

export { PlantModel2 }