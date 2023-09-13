const crypto = require('crypto');

class Encrypt {
  constructor(text) {
    this.data = {
      encSecKey: '01ec48cb405730aa77f993a988cc1f5bc1938511d75f49eddc581f2fe2aaf18988853200564b2d4b1312cf6e0bb344425addce5a4c81b38b89a5973900946bd100b0f1865d22d2a8e5dd8be208eb5d6eb2f71309a165daeffe95355e1e44edd65bdf28088fe4f5e835a7d9f7569fc2530f9d17c00b51cfafbe421eb462247ea3',
    };
    this.text = text;
    this.key = '0CoJUm6Qyw8W8jud';
  }

  getFormData() {
    const i = "4JknCzx6uEXUwxpU";
    const firstEncrypt = this.aesEncrypt(this.text, this.key);
    this.data.params = this.aesEncrypt(firstEncrypt, i);
    return this.data;
  }

  aesEncrypt(text, key) {
    const iv = Buffer.from('0102030405060708');
    let padding = 16 - text.length % 16;
    text += String.fromCharCode(padding).repeat(padding);
    const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'utf-8'), iv);
    return cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
  }
}

module.exports = Encrypt;
