const axios = require('axios');
const Encrypt = require('./Encrypt'); // Assuming Encrypt class is in 'Encrypt.js' file
const config = require('./headerConfig');

class SearchMusic {
    constructor(text) {
        this.url = 'https://music.163.com/weapi/cloudsearch/get/web?csrf_token=';
        this.headers = config.headers;
        this.text = text;
    }

    async search() {
        const data = new Encrypt(this.text).getFormData();
        try {
            const res = await axios.post(this.url, data, { headers: this.headers });
            const songList = res.data.result.songs.map(song => ({
                song_id: song.id,
                song_name: song.name,
                singer: song.ar[0].name,
            }));
            return songList;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = SearchMusic;
