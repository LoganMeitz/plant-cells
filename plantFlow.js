import { Plant } from './common/classes/plant.js'
import { PlantModel1 } from './common/classes/model1.js'
import { Cell } from './common/classes/cell.js';
import { getRandomInt, getPercentage } from './common/helpers.js'

const 
  rowCount = 60, 
  columnCount = 60,
  board = document.getElementById('board'),
  cells = [],
  statsBlock = document.getElementById('stats');

let statInterval;

Cell.setPlant(PlantModel1);

function getCellAtCoords({x, y}){
  const coordsInbounds = (x >= 0 && x < columnCount && y >= 0 && y < rowCount);
  return coordsInbounds ? cells[y][x] : null;
}

// create board and cell storage
for (let y = 0; y < rowCount; y++) {
  const 
    row = document.createElement('tr'),
    cellRow = [];

  for (let x = 0; x < rowCount; x++) {
    const cellElement = document.createElement('td');
    row.appendChild(cellElement);
    cellRow.push(new Cell(cellElement, x, y, getCellAtCoords));
  }

  board.appendChild(row);
  cells.push(cellRow)
}

let defaultSeed = {};

Object.keys(Cell.plantClass.seedData).forEach(key=>{
  defaultSeed[key] = Cell.plantClass.seedData[key].default;
})

function plantSeed(){
  const 
    x = getRandomInt(columnCount-1),
    y = getRandomInt(rowCount-1);
  getCellAtCoords({x, y}).receiveSeed(defaultSeed);

  if (!!statInterval) clearInterval(statInterval);
  statInterval = setInterval(getStats, 200);
}

function infectPlant(){
  const infectableCells = ([].concat(...cells).filter(cell=>!!cell.plant && cell.plant.infectable()))
  if (infectableCells.length){
    infectableCells[getRandomInt(infectableCells.length-1)].receiveInfection();
  }
}


function clear(){
  if (!!statInterval) clearInterval(statInterval);
  [].concat(...cells).filter(c=>(!!c.plant)).forEach(c=>{
    c.clear();
  });
}

function initStatDisplay(){
  Object.keys(defaultSeed).forEach(key=>{
    const 
      statRow = document.createElement('tr'),
      label = document.createElement('td'),
      statDisplay = document.createElement('td'),
      statBarContainer = document.createElement('td'),
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
      statsBlock.appendChild(statRow);
  })
}

function getStats(){
  const livingCells = [].concat(...cells).filter(cell=>cell.plant && cell.plant.alive);
  const seeds = livingCells.map(cell=>cell.plant.baseSeed);
  const statObject = {}
  Object.keys(defaultSeed).forEach(key=>{
    const statAverage = seeds.map(seed=>seed[key]).reduce((previousValue, currentValue) => previousValue + currentValue)/seeds.length
    statObject[key] = Math.round(statAverage*100)/100
  })
  updateStatBlock(statObject);
}

function updateStatBlock(statObject){
  Object.keys(statObject).forEach(key=>{
    const statRow = document.getElementById(`${key}-stat`);
    const statDisplay = Array.from(statRow.children).find(child=>child.classList.contains('stat-display'));
    const statBarContainer = Array.from(statRow.children).find(child=>child.classList.contains('stat-bar-container'));
    const statBar = Array.from(statBarContainer.children).find(child=>child.classList.contains('stat-bar'));
    statDisplay.innerText = statObject[key];
    const statPercentage = `${getPercentage(statObject[key], PlantModel1.seedData[key].min, PlantModel1.seedData[key].max)}%`
    statBar.style.width = statPercentage;
    statBar.innerText = statPercentage;
  })
}

// buttons
const plantButton = document.getElementById('plant-button');
const infectButton = document.getElementById('infect-button');
const clearButton = document.getElementById('clear-button');

plantButton.addEventListener("click",  plantSeed);
infectButton.addEventListener("click",  infectPlant);
clearButton.addEventListener("click",  clear);

initStatDisplay();