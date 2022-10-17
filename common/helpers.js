/**
 * Generates random integer from provided range. 
 * Min and Max values may be specified in any order.
 * When called with one parameter will generate a value between 0 and the provided number
 * @param {*} n1 one bound of int range
 * @param {*} bound2 other bound of int range, defaults to zero
 * @returns random integer within range, inclusive
 */
function getRandomInt(bound1, bound2 = 0){
  const 
    max = Math.max(bound1, bound2), 
    min = Math.min(bound1, bound2);
  return min + Math.floor(Math.random()*(max + 1 - min))
}

function getPercentage(value, bound1, bound2 = 0){
  const 
    max = Math.max(bound1, bound2), 
    min = Math.min(bound1, bound2);
  return Math.round(((value-min)/(max-min))*100)
}

export { getRandomInt, getPercentage }
