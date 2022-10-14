class Plant {

  static cycleLength = 120
  static decayTime = 250

  alive = true;
  decayed = false;
  infected = false;
  age = 0;
  timeouts = [];

  baseSeed;
  lifespan;
  spreadTime;
  immune;

  updateCallback;
  spreadCallback;

  spreadInterval;
  deathTimeout;

  constructor(seed, updateCallback, spreadCallback, infectCallback) {
    this.lifespan = seed.lifespan;
    this.spreadTime = Math.ceil((Plant.cycleLength*10)/seed.spreadRate)
    this.baseSeed = seed;

    this.immune = (seed.immunity*2) > Math.ceil(Math.random()*100);
    this.updateCallback = updateCallback;
    this.spreadCallback = spreadCallback;
    this.infectCallback = infectCallback;
    
    this.spreadInterval = setInterval(this.spread.bind(this), this.spreadTime);
    this.timeouts.push(setTimeout(this.decay.bind(this), this.lifespan*Plant.cycleLength));
  }

  static mutateScore(score, min, max){
    const scoreChange = Math.floor(Math.random()*5)-2;
    return Math.min(Math.max(score + scoreChange, min), max);
  }

  die(){
    this.alive = false;
    clearInterval(this.spreadInterval);
    this.timeouts.forEach(timeout=>clearTimeout(timeout));
    this.timeouts = [setTimeout(this.decay.bind(this), Plant.decayTime)];
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
      this.spreadTime = Math.min(Plant.cycleLength/4)
      clearInterval(this.spreadInterval);
      this.spreadInterval = setInterval(this.spread.bind(this), this.spreadTime);
      this.timeouts.push(setTimeout(this.die.bind(this), Plant.cycleLength*2));
      this.update();
    }
  }

  spread(){
    if (this.infected) {
      this.infectCallback();
    } else {
      this.spreadCallback(this.makeSeed(this.baseSeed));
    }
  }

  makeSeed(){
    const seed = { 
      lifespan: Plant.mutateScore(this.baseSeed.lifespan, 1, 20),
      immunity: Plant.mutateScore(this.baseSeed.immunity, 1, 30),
      spreadRate: Plant.mutateScore(this.baseSeed.spreadRate, 1, 20)
    };
    return seed
  }

  infectable(){
    return this.alive && !this.immune && !this.infected 
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

  update(){

    this.updateCallback();
  }
}

class Cell {
  element;
  plant = null;

  coords = {
    x: null,
    y: null
  }

  getCellAtCoords;

  constructor(element, x, y, getCellAtCoords){
    this.element = element;
    this.coords = { x, y };

    this.getCellAtCoords = getCellAtCoords;
  }

  receiveSeed(seed){
    if (!this.plant || this.plant.decayed) {
      this.plant = new Plant(
        seed, 
        this.updatePlant.bind(this), 
        this.sendSeed.bind(this),
        this.sendInfection.bind(this),
      );
      this.updatePlant();
    }
  }

  receiveInfection(){
    if (this.plant && this.plant.infectable()) this.plant.infect();
  }

  sendSeed(seed){
    const newCoords = this.getNearbyCoords();
    const cellToSpread = this.getCellAtCoords(newCoords);
    if (!!cellToSpread) cellToSpread.receiveSeed(seed);
  }

  sendInfection(){
    const newCoords = this.getNearbyCoords();
    const cellToSpread = this.getCellAtCoords(newCoords);
    if (!!cellToSpread) cellToSpread.receiveInfection();
  }

  updatePlant(){
    const colour = this.plant.getColour()
    if (!!this.plant) this.setElementColour(colour)
  }

  getNearbyCoords(){
    const 
      {x, y} = this.coords,
      direction = Math.floor(Math.random()*4);
    switch(direction){
      case 0:
        return {x:x+1, y};
      case 1:
        return {x:x-1, y}
      case 2:
        return {x, y:y+1}
      case 3:
        return {x, y:y-1}
    }
  }

  setElementColour(colour){
    this.element.style.backgroundColor = colour;
  }

}

export { Plant, Cell }