import { Plant } from './common/classes/plant.js'
import { PlantModel1 } from './common/classes/model1.js'
import { PlantModel2 } from './common/classes/model2.js'
import { Cell } from './common/classes/cell.js';
import { getRandomInt, getPercentage } from './common/helpers.js'

const 
  rowCount = 60, 
  columnCount = 60,
  board = document.getElementById('board'),
  cells = [],
  statsBlock = document.getElementById('stats');

let statInterval;
let updateInterval;

const plantModels = [PlantModel1, PlantModel2];
const defaultModel = PlantModel2.title;

function getCellAtCoords({x, y}){
  const coordsInbounds = (x >= 0 && x < columnCount && y >= 0 && y < rowCount);
  return coordsInbounds ? cells[y][x] : null;
}

// create board and cell storage
for (let y = 0; y < rowCount; y++) {
  const 
    row = document.createElement('div'),
    cellRow = [];

  row.classList.add('row');

  for (let x = 0; x < rowCount; x++) {
    const cellElement = document.createElement('div');

    cellElement.classList.add('cell');

    row.appendChild(cellElement);
    cellRow.push(new Cell(cellElement, x, y, getCellAtCoords));
  }

  board.appendChild(row);
  cells.push(cellRow)
}

let defaultSeed = {};

// build model selection
const plantSelector = document.getElementById('plant-list');
const plantDescription = document.getElementById('selected-plant')
plantModels.forEach(plantModel=>{
  const option = document.createElement('option');
  option.innerText = plantModel.title;
  option.value = plantModel.title;
  if (plantModel.title === defaultModel) option.selected = true;
  plantSelector.appendChild(option);
});

plantSelector.addEventListener('change', (event)=>{
  changePlantModel(getModelFromTitle(event.target.value));
});

function getModelFromTitle(title){
  return plantModels.find(model=>model.title === title) || Plant;
}

function changePlantModel(plantModel){
  clear();
  Cell.setPlant(plantModel);
  defaultSeed = {};
  Object.keys(Cell.plantClass.seedData).forEach(key=>{
    defaultSeed[key] = Cell.plantClass.seedData[key].default;
  })
  plantDescription.innerText = plantModel.description;
  clearStatDisplay();
  initStatDisplay();
  updateStatBlock(defaultSeed);
}

function plantSeed(){
  const 
    x = getRandomInt(columnCount-1),
    y = getRandomInt(rowCount-1);
  getCellAtCoords({x, y}).receiveSeed(defaultSeed);

  if (!!statInterval) clearInterval(statInterval);
  statInterval = setInterval(getStats, 200);

  if (!!updateInterval) clearInterval(updateInterval);
  updateInterval = setInterval(updatePlants, 20);
}

function infectPlant(){
  const infectableCells = ([].concat(...cells).filter(cell=>!!cell.plant && cell.plant.infectable()))
  if (infectableCells.length){
    infectableCells[getRandomInt(infectableCells.length-1)].receiveInfection(true);
  }
}

function clear(){
  if (!!statInterval) clearInterval(statInterval);
  [].concat(...cells).filter(c=>(!!c.plant)).forEach(c=>{
    c.clear();
  });
}

function updatePlants(){
  [].concat(...cells).forEach(cell=>{
    cell.checkEvents();
  })
}

function clearStatDisplay(){
  statsBlock.innerHTML="";
}

function initStatDisplay(){
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
      statsBlock.appendChild(statRow);
  })
}

function getStats(){
  const livingCells = [].concat(...cells).filter(cell=>cell.plant && cell.plant.alive);
  const seeds = livingCells.map(cell=>cell.plant.baseSeed);
  const statObject = {}
  Object.keys(defaultSeed).forEach(key=>{
    const statAverage = !!seeds.length
      && seeds.map(seed=>seed[key])
        .reduce((previousValue, currentValue) => previousValue + currentValue)/seeds.length
      || defaultSeed[key];
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
    const statPercentage = `${getPercentage(statObject[key], Cell.plantClass.seedData[key].min, Cell.plantClass.seedData[key].max)}%`
    statBar.style.width = statPercentage;
    statBar.innerText = statPercentage;
  })
}

changePlantModel(PlantModel2);

// buttons
const plantButton = document.getElementById('plant-button');
const infectButton = document.getElementById('infect-button');
const clearButton = document.getElementById('clear-button');

plantButton.addEventListener("click",  plantSeed);
infectButton.addEventListener("click",  infectPlant);
clearButton.addEventListener("click",  clear);