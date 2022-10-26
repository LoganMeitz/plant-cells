import { Plant } from './plant.js'

class Cell {

  static plantClass = Plant;

  static setPlant(newPlantClass){
    Cell.plantClass = newPlantClass;
  }

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
    if (!this.plant || this.plant.plantable()) {
      this.plant = new Cell.plantClass(
        seed, 
        this.updatePlant.bind(this), 
        this.sendSeed.bind(this),
        this.sendInfection.bind(this),
      );
      this.updatePlant();
    }
  }

  receiveInfection(force = false){
    if (this.plant && (this.plant.infectable() || force)) this.plant.infect();
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

  clear(){
    if (this.plant) this.plant.decommission();
    this.setElementColour(null);
  }

}

export { Cell }