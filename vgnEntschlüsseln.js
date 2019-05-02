const gt = require(__dirname+"/text.json")

const gcd = (a, b) => b == 0 ? a : gcd(b, a % b)

const findBlocks = text => {
  const commons = {}

  for(let i = 2; i <= text.length/2; i++){
    for(let j = 0; j < text.length-i; j+=i){
      let chunk = text.substr(j,i)
      if(!commons[chunk]) commons[chunk] = []
      commons[chunk].push(j)
    }
  }

  for(let chunk in commons)
    if(commons[chunk].length <= 1)
      delete commons[chunk]

  return commons
}

const getDiffs = array => {
  const diffs = []
  for(let i = 0; i < array.length-1; i++){
    diffs.push(array[i+1]-array[i])
  }
  return diffs
}

const getGreatestDivisors = nrs => {
  const divisors = {}
  for(let i = 0; i < nrs.length; i++){
    for(let j = i; j < nrs.length; j++){
      if(i === j) continue
      const d = gcd(nrs[i],nrs[j])
      divisors[d] = !divisors[d] ? 1 : divisors[d] + 1
    }
  }
  return divisors
}

const findKeyLength = blocks => {
  let max = Object.keys(blocks)[0]
  for(let block in blocks)
    if(blocks[block].length > blocks[max].length) max = block
  const diffs = getDiffs(blocks[max])
  const divisors = getGreatestDivisors(diffs)
  return {
    max,
    entry: blocks[max],
    abstände: diffs,
    divisors: divisors,
  }
}

const blocks = findBlocks(gt)
const keyLength = findKeyLength(blocks)
console.log(blocks)
console.log(keyLength)
