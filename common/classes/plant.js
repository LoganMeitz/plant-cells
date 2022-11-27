import { getRandomInt, getPercentage } from '../helpers.js'

// concept, a generic plant class that other plant models can inherit and change

class Plant {

  static mutateScore(score, min, max){
    const scoreChange = getRandomInt(-2, 2);
    return Math.min(Math.max(score + scoreChange, min), max);
  }

  static cycleLength = 120
  static seedData = {}

  alive = true;
  infected = false;

  updateCallback;
  spreadCallback;
  infectCallback;

  baseSeed;

  eventQueue = [];
  
  constructor(){}

  setCallbacks(updateCallback, spreadCallback, infectCallback){
    this.updateCallback = updateCallback;
    this.spreadCallback = spreadCallback;
    this.infectCallback = infectCallback;
  }

  saveSeed(seed){
    this.baseSeed = seed;
  }

  spread(){
    if (this.infected) {
      this.infectCallback();
    } else {
      this.spreadCallback(this.makeSeed());
    }
  }

  update(){
    this.updateCallback();
  }

  makeSeed(){
    let seed = {};

    Object.keys(this.constructor.seedData).forEach(stat=>{
      seed[stat] = this.constructor.mutateScore(
        this.baseSeed[stat], 
        this.constructor.seedData[stat].min, 
        this.constructor.seedData[stat].max,
      )
    })

    return seed;
  }

  queueEvent(time, executable){
    const event = {
      time: Date.now() + time,
      execute: executable,
    }
    this.eventQueue.push(event);
    this.eventQueue.sort((a, b)=>a.time-b.time);
  }

  checkEvents(){
    while (this.eventQueue.length && this.eventQueue[0].time < Date.now()) {
      const eventToExecute = this.eventQueue.shift();
      eventToExecute.execute();
    }
  }


  die(){
    console.error('DEFAULT PLANT LOGIC die(), LIKELY CALLED IN ERROR');
  }

  infectable(){
    console.error('DEFAULT PLANT LOGIC infectable(), LIKELY CALLED IN ERROR');
  }

  infect(){
    console.error('DEFAULT PLANT LOGIC infect(), LIKELY CALLED IN ERROR');
  }

  plantable(){
    console.error('DEFAULT PLANT LOGIC plantable(), LIKELY CALLED IN ERROR');
  }

  getColour(){
    console.error('DEFAULT PLANT LOGIC getColour(), LIKELY CALLED IN ERROR');
  }

  decommission(){
    console.error('DEFAULT PLANT LOGIC decommission(), LIKELY CALLED IN ERROR');
  }
}

export { Plant }