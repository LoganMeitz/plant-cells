import { getRandomInt, getPercentage } from '../helpers.js'
import { Plant } from './plant.js'

class PlantModel1 extends Plant {

  static decayTime = 250;
  static seedData = {
    lifespan: {
      min: 1,
      max: 20,
      default: 5,
    },
    immunity: {
      min: 1,
      max: 30,
      default: 1,
    },
    spreadRate: {
      min: 1,
      max: 20,
      default: 5,
    },
  };

  static title = 'Immunity Model';
  static description = 'The first plant version. Plants have a chance to be immune to infection, based on their immunity stat. Immune plants are dark green, while vulnerable plants are a lighter colour'

  decayed = false;

  lifespan;
  spreadTime;
  immune;

  constructor(seed, updateCallback, spreadCallback, infectCallback) {

    super();

    // Common things
    this.setCallbacks(updateCallback, spreadCallback, infectCallback)
    this.saveSeed(seed);



    this.lifespan = seed.lifespan;
    this.spreadTime = Math.ceil((this.constructor.cycleLength*10)/seed.spreadRate)

    this.immune = (seed.immunity*2) > Math.ceil(Math.random()*100);
    
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
    this.alive = false;
    this.decayed = true;
    this.update();
  }

  infect(){
    if(this.infectable()) {
      this.infected = true;
      this.spreadTime = Math.min(this.constructor.cycleLength/4)
      this.queueEvent(this.constructor.cycleLength*2, this.die.bind(this));
      this.update();
    }
  }

  infectable(){
    return this.alive && !this.immune && !this.infected 
  }

  plantable(){
    return this.decayed || (!this.alive && !this.infected);
  }

  getColour(){
    return (
    !this.decayed 
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
    this.queueEvent = [];
  }
}

export { PlantModel1 }