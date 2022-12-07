import { getPercentage } from '../helpers.js'
import { Plant } from './plant.js'

class PlantModel3 extends Plant {

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
  }

  static title = 'Spread vs Resistence';
  static description = 'This type of plant has the same type of resistence as the resistence model, but its spread rate is inversely correlated to its resistence. This means that the plant should gravitate to low resistence when there is not an active outbreak.'

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

    const spreadRate = 1 + seed.resistence/10;

    this.lifespan = seed.lifespan*2;
    this.spreadTime = Math.round((this.constructor.cycleLength/2)+(this.constructor.cycleLength/2)*spreadRate)

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
      this.queueEvent(this.constructor.cycleLength*4, this.decay.bind(this));
    }
  }

  decay(){
    this.decayed = true;
    this.update();
  }

  infect(){
    this.infected = true;
    this.spreadTime = Math.min(this.constructor.cycleLength/4)
    this.queueEvent(this.constructor.cycleLength*3, this.die.bind(this));
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

export { PlantModel3 }