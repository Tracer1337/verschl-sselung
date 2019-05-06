const crypt = (text, key) => text.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0)-65+key)%26+65))
const decrypt = (text, key) => text.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0)-65-key < 0 ? c.charCodeAt(0)-65+26-key : c.charCodeAt(0)-65-key)%26+65))

module.exports = {crypt, decrypt}
