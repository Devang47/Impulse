const CryptoJS = require('crypto-js')

export function encrypt(key: string, message: string) {
  let encrypted: string = message
  for (let i = 0; i < 5; i++) {
    encrypted = CryptoJS.AES.encrypt(encrypted, key).toString()
  }
  return encrypted
}

export function decrypt(key: string, message: string) {
  let decrypted: string = message
  for (let i = 0; i < 5; i++) {
    decrypted = CryptoJS.AES.decrypt(decrypted, key).toString(CryptoJS.enc.Utf8)
  }
  return decrypted
}
