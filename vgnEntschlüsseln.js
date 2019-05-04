const gt = require(__dirname+"/text.json")

const gcd = (a, b) => b == 0 ? a : gcd(b, a % b)

const getMostFrequent = array => {
  let mf = 1, m = 0, item
  array.forEach((n1) => {
    array.forEach((n2) => {
      if (n1==n2) m++
      if (mf<m){
        mf=m
        item=n1
      }
    })
    m=0
  })
  return item
}

const findBlocks = text => {
  const commons = {}

  for(let cl = 2; cl <= text.length/2; cl++){

    for(let i = 0; i < text.length-cl; i+=cl){
      const chunk = text.substr(i, cl)
      let lastIndex = i
      commons[chunk] = []
      while(text.indexOf(chunk, lastIndex+cl) !== -1){
        const index = text.indexOf(chunk, lastIndex+cl)
        commons[chunk].push(index - lastIndex)
        lastIndex = index
      }
      if(commons[chunk].length === 0)
        delete commons[chunk]
    }

  }

  return commons
}

const findDivisor = blocks => {
  const nrs = []
  for(let block in blocks)
    nrs.push(...blocks[block])

  return getMostFrequent(nrs.map((n, i, nrs) => {
    if(i == nrs.length-1) return
    return gcd(n,nrs[i+1])
  }))
}

const blocks = findBlocks(gt)
const divisor = findDivisor(blocks)
console.log(blocks)
console.log(divisor)
