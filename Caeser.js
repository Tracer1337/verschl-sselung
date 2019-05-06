const args = process.argv.map((a,i) => i>1?a:null).filter(e => e)
args[0] = args[0].toString(); args[1] = parseInt(args[1])

const crypt = (text, key) => text.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0)-65+key)%26+65))
const decrypt = (text, key) => text.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0)-65-key < 0 ? c.charCodeAt(0)-65+26-key : c.charCodeAt(0)-65-key)%26+65))

console.log(crypt(args[0], args[1]))
console.log(decrypt(args[0], args[1]))
