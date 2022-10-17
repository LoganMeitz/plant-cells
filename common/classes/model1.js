import { getRandomInt, getPercentage } from '../helpers.js'
import { Plant } from './plant.js'

class PlantModel1 extends Plant {

  static decayTime = 250;
  static seedData = {
    lifespan: {
      min: 1,
      max: 20,
      default: 10,
    },
    immunity: {
      min: 1,
      max: 30,
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
  immune;

  spreadInterval;
  deathTimeout;

  constructor(seed, updateCallback, spreadCallback, infectCallback) {

    super();

    // Common things
    this.setCallbacks(updateCallback, spreadCallback, infectCallback)
    this.saveSeed(seed);



    this.lifespan = seed.lifespan;
    this.spreadTime = Math.ceil((this.constructor.cycleLength*10)/seed.spreadRate)

    this.immune = (seed.immunity*2) > Math.ceil(Math.random()*100);
    
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
    if(this.infectable()) {
      this.infected = true;
      this.spreadTime = Math.min(this.constructor.cycleLength/4)
      clearInterval(this.spreadInterval);
      this.spreadInterval = setInterval(this.spread.bind(this), this.spreadTime);
      this.timeouts.push(setTimeout(this.die.bind(this), this.constructor.cycleLength*2));
      this.update();
    }
  }

  infectable(){
    return this.alive && !this.immune && !this.infected 
  }

  plantable(){
    return this.decayed;
  }

  getColour(){
    return (
    !!this.alive 
      ? !!this.infected 
        ? 'purple' 
        : !!this.immune
          ? 'rgb(0, 90, 0)'
          : 'rgb(0, 150, 0)' 
      : '#59402a' 
    )
  }

  decommission(){
    this.alive = false;
    this.decayed = true;
    if (this.spreadInterval) clearInterval(this.spreadInterval);
    this.timeouts.forEach(timeout=>clearTimeout(timeout));
  }
}

export { PlantModel1 }