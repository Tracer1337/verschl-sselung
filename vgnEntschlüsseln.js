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
  for(let block in array){
    for(let i = 0; i < array[block].length-1; i++){
      diffs.push(array[block][i+1]-array[block][i])
    }
  }
  return Array.from(new Set(diffs))
}

const getGreatestDivisors = nrs => {
  const divisors = {}
  for(let i = 0; i < nrs.length; i++){
    for(let j = i; j < nrs.length; j++){
      if(i === j || nrs[i] === nrs[j]) continue
      const d = gcd(nrs[i],nrs[j])
      divisors[d] = !divisors[d] ? 1 : divisors[d] + 1
    }
  }
  return divisors
}

const findKeyLength = blocks => {
  const diffs = getDiffs(blocks)
  const greatestDivisors = getGreatestDivisors(diffs)
  return greatestDivisors
}

const blocks = findBlocks(gt)
const keyLength = findKeyLength(blocks)
console.log(blocks)
console.log(keyLength)
