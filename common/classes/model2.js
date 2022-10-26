import { getRandomInt, getPercentage } from '../helpers.js'
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

  decayed = false;
  timeouts = [];

  lifespan;
  spreadTime;
  resistence;

  spreadInterval;
  deathTimeout;

  constructor(seed, updateCallback, spreadCallback, infectCallback) {

    super();

    // Common things
    this.setCallbacks(updateCallback, spreadCallback, infectCallback)
    this.saveSeed(seed);



    this.lifespan = seed.lifespan;
    this.spreadTime = Math.ceil((this.constructor.cycleLength*10)/seed.spreadRate)

    this.resistence = seed.resistence;
    //this.immune = (seed.immunity*2) > Math.ceil(Math.random()*100);
    
    this.spreadInterval = setInterval(this.spread.bind(this), this.spreadTime);
    this.timeouts.push(setTimeout(this.decay.bind(this), this.lifespan*this.constructor.cycleLength));
  }

  die(){
    this.alive = false;
    clearInterval(this.spreadInterval);
    this.timeouts.forEach(timeout=>clearTimeout(timeout));
    this.timeouts = [setTimeout(this.decay.bind(this), this.constructor.decayTime)];
    this.update();
  }

  decay(){
    clearInterval(this.spreadInterval);
    this.timeouts.forEach(timeout=>clearTimeout(timeout));
    this.alive = false;
    this.decayed = true;
    this.update();
  }

  infect(){
    this.infected = true;
    this.spreadTime = Math.min(this.constructor.cycleLength/4)
    clearInterval(this.spreadInterval);
    this.spreadInterval = setInterval(this.spread.bind(this), this.spreadTime);
    this.timeouts.push(setTimeout(this.die.bind(this), this.constructor.cycleLength*2));
    this.update();
  }

  infectable(){
    return this.alive && !this.infected && (this.resistence*2) < Math.ceil(Math.random()*100)
  }

  plantable(){
    return this.decayed;
  }

  // getColour(){
  //   return (
  //     this.infected 
  //       ? this.alive 
  //         ? 'purple'
  //         : '#59402a' 
  //       : `rgb(0, ${170-this.resistence*2}, 0)`
  //   )
  // }

  getColour(){
    let 
      red = 0, 
      green = 170-this.resistence*2, 
      blue = 0;
    
    if (!this.alive) {
      red += Math.round(green/3)
    }
    
    if (this.infected) {
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
    if (this.spreadInterval) clearInterval(this.spreadInterval);
    this.timeouts.forEach(timeout=>clearTimeout(timeout));
  }
}

export { PlantModel2 }