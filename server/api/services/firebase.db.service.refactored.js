import l from '../../common/logger'

const _ = require('lodash')
const firebase = require('firebase')

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

class FirebaseDatabase {
  constructor() {
    this._games = [];
    this._loadCounter = 0;
  }

  all() {
    return new Promise((resolve, reject) => {
      db.ref('games').on('value', snapshot => {
        const result = _.map(snapshot.val(), game => game)
        if (this._games === result) {
          return resolve(this._games, this._loadCounter)
        }
        this._loadCounter += 1
        this._games = _.map(snapshot.val(), game => game)
        l.info(`loadcounter:${this._loadCounter}`)
        return resolve(this._games, this._loadCounter)
      })
    }).catch(err => `Something went wrong:${err}`)
  }

  byId(id) {
    return Promise.resolve(this._games[id]);
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
