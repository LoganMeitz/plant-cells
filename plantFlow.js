import { Plant, Cell } from './plantClasses.js';

const 
  rowCount = 60, 
  columnCount = 60,
  board = document.getElementById('board'),
  cells = [];

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

function plantSeed(){
  const 
    x = Math.floor(Math.random()*columnCount),
    y = Math.floor(Math.random()*rowCount);
  getCellAtCoords({x, y}).receiveSeed(firstSeed);
}

function infectPlant(){
  const livingCells = ([].concat(...cells).filter(cell=>cell.plant && cell.plant.alive))
  if (livingCells.length){
    livingCells[Math.floor(Math.random()*livingCells.length)].receiveInfection();
  }
}

const plantButton = document.getElementById('plant');
const infectButton = document.getElementById('infect');


plantButton.addEventListener("click",  plantSeed);
infectButton.addEventListener("click",  infectPlant);