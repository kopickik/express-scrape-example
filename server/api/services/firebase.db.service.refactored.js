import l from '../../common/logger'

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
axios.defaults.baseURL = process.env.FIREBASE_DATABASE_URL

class FirebaseDatabase {
  all() {
    return axios.get('games.json?print=pretty')
      .then(response => {
        l.info(response.data)
        return response
      })
      .then(response => [].concat(_.map(response.data)))
      .catch(err => `Error: ${err}`)
  }

  byId(id) {
    return axios.get(`games/${id}.json?print=pretty`)
      .then(response => {
        l.info(response.data)
        return response
      })
      .then(response => response.data)
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
}

export default new FirebaseDatabase();
