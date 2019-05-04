const gt = require(__dirname+"/text.json")

const gcd = (a, b) => b == 0 ? a : gcd(b, a % b)

const alphabetPos = char => char.toUpperCase().charCodeAt(0) - 65

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

const seperateText = (text, n) => {
  const newTexts = new Array(n).fill(0).map(() => [])
  for(let i = 0; i < text.length; i++)
    newTexts[i%n].push(text[i])
  return newTexts.map(array => array.join(""))
}

const frequencyAnalysis = text => {
  const letters = text.split("").reduce((res, letter) => {
    !res[letter] ? res[letter] = 1 : res[letter]++
    return res
  }, {})
  return letters
}

const findKey = text => {
  const lf = frequencyAnalysis(text)
  let max = Object.keys(lf)[0]
  for(let letter in lf)
    if(lf[letter] > lf[max])
      max = letter
  return Math.abs(alphabetPos(max) - alphabetPos("e"))
}

const findKeyChar = text => String.fromCharCode(findKey(text)+65)

const blocks = findBlocks(gt)
const keyLength = findDivisor(blocks)
const seperatedTexts = seperateText(gt, keyLength)
const key = seperatedTexts.map(text => findKeyChar(text)).join("")
console.log(key)
