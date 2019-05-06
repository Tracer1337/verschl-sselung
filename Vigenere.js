// Entschlüsselung
const gt = process.argv[2] ? process.argv[2] : require(__dirname+"/text.json")

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
      const block = text.substr(i, cl)
      let lastIndex = i
      commons[block] = []
      while(text.indexOf(block, lastIndex+cl) !== -1){
        const index = text.indexOf(block, lastIndex+cl)
        commons[block].push(index - lastIndex)
        lastIndex = index
      }
      if(commons[block].length === 0)
        delete commons[block]
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

const decryptChar = (char, key) => {
  char = char.toUpperCase()
  return String.fromCharCode(char.charCodeAt(0) - key < 65 ? char.charCodeAt(0) + 26 - key : char.charCodeAt(0) - key)
}

const decryptText = text => {
  text = text.toUpperCase()
  text = text.replace(/\W/g, "")
  const blocks = findBlocks(text)
  const keyLength = findDivisor(blocks)
  const seperatedTexts = seperateText(text, keyLength)
  const key = seperatedTexts.map(text => findKeyChar(text)).join("")
  return {
    key,
    text: text.split("").map((letter, i) => decryptChar(letter, alphabetPos(key[i%key.length]))).join("")
  }
}

const decrypted = decryptText(gt)
console.log(`Klartext:\n${decrypted.text}\n\nSchlüssel:\n${decrypted.key}`)

// Verschlüsselung
const cryptText = (text, key) => text.toUpperCase().replace(/[A-Z]/g, (c,i) => String.fromCharCode((c.charCodeAt(0)-65+key[i%key.length].charCodeAt(0)-65)%26+65))
