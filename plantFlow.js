import { Cell } from './plantClasses.js';

const 
  rowCount = 60, 
  columnCount = 60,
  board = document.getElementById('board'),
  cells = [],
  statsBlock = document.getElementById('stats');

let statInterval;

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


const firstSeed = {
  lifespan: 10,
  immunity: 1,
  spreadRate: 10,
}

function clear(){
  if (!!statInterval) clearInterval(statInterval);
  [].concat(...cells).filter(c=>(!!c.plant)).forEach(c=>{
    c.plant.die();
    //c.plant = null;
  });
}

function plantSeed(){
  const 
    x = Math.floor(Math.random()*columnCount),
    y = Math.floor(Math.random()*rowCount);
  getCellAtCoords({x, y}).receiveSeed(firstSeed);

  if (!!statInterval) clearInterval(statInterval);
  statInterval = setInterval(getStats, 200);
}

function infectPlant(){
  const infectableCells = ([].concat(...cells).filter(cell=>cell.plant && cell.plant.infectable()))
  if (infectableCells.length){
    infectableCells[Math.floor(Math.random()*infectableCells.length)].receiveInfection();
  }
}


function getStats(){
  const livingCells = [].concat(...cells).filter(cell=>cell.plant && cell.plant.alive);
  const seeds = livingCells.map(cell=>cell.plant.baseSeed);
  const statObject = {}
  Object.keys(firstSeed).forEach(key=>{
    const statAverage = seeds.map(seed=>seed[key]).reduce((previousValue, currentValue) => previousValue + currentValue)/seeds.length
    statObject[key] = Math.round(statAverage*100)/100
  })
  updateStatBlock(statObject);
}

function initStatDisplay(){
  Object.keys(firstSeed).forEach(key=>{
    const 
      statRow = document.createElement('tr'),
      label = document.createElement('td'),
      statDisplay = document.createElement('td');
    
      statRow.id = `${key}-stat`;
      statRow.classList.add('stat-wrapper');

      label.innerText = key.slice(0,1).toUpperCase()+key.slice(1);
      label.classList.add('stat-label')

      statDisplay.classList.add('stat-display');

      statRow.appendChild(label);
      statRow.appendChild(statDisplay);
      statsBlock.appendChild(statRow);
  })
}

function updateStatBlock(statObject){
  Object.keys(statObject).forEach(key=>{
    const statRow = document.getElementById(`${key}-stat`);
    const statDisplay = Array.from(statRow.children).find(child=>child.classList.contains('stat-display'))
    statDisplay.innerText = statObject[key];
  })
}

const plantButton = document.getElementById('plant-button');
const infectButton = document.getElementById('infect-button');
const statsButton = document.getElementById('stats-button');
const clearButton = document.getElementById('clear-button');

plantButton.addEventListener("click",  plantSeed);
infectButton.addEventListener("click",  infectPlant);
statsButton.addEventListener("click",  getStats);
clearButton.addEventListener("click",  clear);

initStatDisplay();