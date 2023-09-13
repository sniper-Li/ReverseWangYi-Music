const axios = require('axios');
const fs = require('fs');
const Encrypt = require('./Encrypt');
const config = require('./headerConfig');

class NeteaseCloudMusic {
  constructor(song) {
    this.url = 'https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token=';
    this.headers = config.headers;
    this.text = `{"ids":"[${song.song_id}]","level":"standard","encodeType":"aac","csrf_token":""}`;
    this.name = song.song_name;
    this.singer = song.singer;
  }

  async music() {
    const data = new Encrypt(this.text).getFormData();
    try {
      const res = await axios.post(this.url, data, { headers: this.headers });
      const songUrl = res.data.data[0].url;
      console.log(songUrl);

      if (!songUrl) {
        throw new Error('会员歌曲，没有链接');
      }

      const content = await this.download(songUrl);
      this.save(content);
    } catch (error) {
      console.error(error);
      throw error; // 抛出错误让外层的 catch 块捕获
    }
  }

  async download(url) {
    try {
      const res = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer', // 说明我们期望得到一个二进制的buffer
      });
      return res.data;
    } catch (error) {
      console.error('Error downloading the song: ', error);
      throw error;
    }
  }

  save(content) {
    if (content) {
      const path = __dirname;
      if (!fs.existsSync(`${path}/musicDownLoad`)) {
        fs.mkdirSync(`${path}/musicDownLoad`);
      }
      const musicPath = `${path}/musicDownLoad/${this.name} ${this.singer}.m4a`;
      if (!fs.existsSync(musicPath)) {
        fs.writeFileSync(musicPath, content);
      }
    }
  }

}

module.exports = NeteaseCloudMusic;