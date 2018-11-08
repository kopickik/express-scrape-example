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
        this._games = _.map(snapshot.val(), game => game)
        return resolve(_.flatten(this._games))
      })
    }).catch(err => `Something happened:${err}`)
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
