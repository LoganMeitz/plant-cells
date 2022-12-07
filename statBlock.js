import { getPercentage } from './common/helpers.js'
import { Cell } from './common/classes/cell.js'; // todo get rid of this dependency

class StatBlock {

  element;

  constructor(statElement){
    this.element = statElement;
  }

  initStatDisplay(defaultSeed){
    this.clearStatDisplay();
    this.buildStatHTML(defaultSeed);
    this.updateStatBlock(defaultSeed);
  }

  buildStatHTML(defaultSeed){
    Object.keys(defaultSeed).forEach(key=>{
      const 
        statRow = document.createElement('div'),
        label = document.createElement('div'),
        statDisplay = document.createElement('div'),
        statBarContainer = document.createElement('div'),
        statBar = document.createElement('div');
      
        statRow.id = `${key}-stat`;
        statRow.classList.add('stat-wrapper');
  
        label.innerText = key.slice(0,1).toUpperCase()+key.slice(1);
        label.classList.add('stat-label')
  
        statDisplay.classList.add('stat-display');
  
        statBarContainer.classList.add('stat-bar-container');
        statBar.classList.add('stat-bar');
  
        statRow.appendChild(label);
        statRow.appendChild(statDisplay);
        statRow.appendChild(statBarContainer);
        statBarContainer.appendChild(statBar);
        this.element.appendChild(statRow);
    })
  }

  updateStatBlock(statObject){
    Object.keys(statObject).forEach(key=>{
      const statRow = document.getElementById(`${key}-stat`);
      const statDisplay = Array.from(statRow.children).find(child=>child.classList.contains('stat-display'));
      const statBarContainer = Array.from(statRow.children).find(child=>child.classList.contains('stat-bar-container'));
      const statBar = Array.from(statBarContainer.children).find(child=>child.classList.contains('stat-bar'));
      statDisplay.innerText = statObject[key];
      const statPercentage = `${getPercentage(statObject[key], Cell.plantClass.seedData[key].min, Cell.plantClass.seedData[key].max)}%`
      statBar.style.width = statPercentage;
      statBar.innerText = statPercentage;
    })
  }

  crunchStats(cells){
    const livingCells = cells.filter(cell=>cell.plant && cell.plant.alive);
    const seeds = livingCells.map(cell=>cell.plant.baseSeed);
    const statObject = {}
    Object.keys(defaultSeed).forEach(key=>{
      const statAverage = !!seeds.length
        && seeds.map(seed=>seed[key])
          .reduce((previousValue, currentValue) => previousValue + currentValue)/seeds.length
        || defaultSeed[key];
      statObject[key] = Math.round(statAverage*100)/100
    })
    this.updateStatBlock(statObject);

  }

  clearStatDisplay(){
    this.element.innerHTML="";
  }
}

export { StatBlock }