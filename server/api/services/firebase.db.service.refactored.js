import l from '../../common/logger'

const fs = require('fs')
const Path = require('path')
const Empty = require('empty-folder')
const _ = require('lodash')
const firebase = require('firebase')
const axios = require('axios')

const dbUrl = process.env.FIREBASE_DATABASE_URL

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: dbUrl,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
})

const db = firebase.database();
axios.defaults.baseURL = process.env.IGDB_V3_BASE_URL
const axiosOptions = {
  headers: {
    accept: 'application/json',
    'user-key': process.env.IGDB_V3_USER_KEY
  }
}

class FirebaseDatabase {
  all() {
    return axios.get('games', axiosOptions)
      .then(response => {
        l.info(response.data)
        return response
      })
      .then(response => [].concat(_.map(response.data)))
      .catch(err => `Error: ${err}`)
  }

  byId(id) {
    return axios.get(`games/${id}`, axiosOptions)
      .then(response => response.data)
      .then(data => _.first(data))
      .then(game => this.pickGame(game))
      .catch(err => `Couldn't fetch game with id ${id}, ${err}`)
  }

  insert(game) {
    db.ref('games').push(game, (success, err) => {
      if (err) {
        l.fatal(`Fatal error creating game in database:${err}`)
        return
      }
      l.info(`Added game successfully to database: ${success}`)
    })
    return Promise.resolve(game)
  }

  pickGame(game) {
    const interested = _.pick(game, [
      'name', 'slug', 'created_at', 'updated_at', 'summary',
      'publishers', 'cover', 'screenshots', 'alternative_names', 'artworks'
    ])
    Empty(Path.resolve(__dirname, `../../../img/artworks`), false, o => o.error ? l.error(o.error) : l.info(`Artworks removed.`))
    if (interested.artworks) {
      _.map(interested.artworks, work => this.downloadArtwork(work.url))
    }
    if (interested.screenshots) {
      _.map(interested.screenshots, work => this.downloadArtwork(work.url))
    }
    this.downloadImage(interested.cover.url)
    return interested
  }

  platformImgGenerated(game) {
    const url = game.cover.url;
    const hiresUrl = url.replace(/t_thumb/, 't_720p')
    this.downloadImage(hiresUrl)
    return _.toPlainObject(game)
  }

  async downloadArtwork(url) {
    let identifier = _.last(url.split('/'))
    const path = Path.resolve(__dirname, `../../../img/artworks`, `prefix_${identifier}`)
    const response = await axios({
      method: `GET`,
      url: `https:${url.replace(/t_thumb/, 't_720p')}`,
      responseType: `stream`
    })
    response.data.pipe(fs.createWriteStream(path))
    return new Promise((resolve, reject) => {
      response.data.on('end', () => resolve())
      response.data.on('error', (err) => reject(`Got error: ${err}`))
    })

  }

  async downloadImage(url) {
    const path = Path.resolve(__dirname, '../../../img', 'game.jpg')
    const response = await axios({
      method: 'GET',
      url: `https:${url.replace(/t_thumb/, 't_720p')}`,
      responseType: 'stream'
    })

    // pipe the result stream into a file on disc
    response.data.pipe(fs.createWriteStream(path))

    // return a promise and resolve when download finishes
    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve()
      })

      response.data.on('error', () => {
        reject()
      })
    })
  }


}

export default new FirebaseDatabase();
