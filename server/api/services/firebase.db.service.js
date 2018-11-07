import '../../common/env'
import l from '../../common/logger'

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

const byId = gameId => db.ref('games', {
  query: {
    equalTo: gameId
  }
}).on('value', dataSnapshot => dataSnapshot.toJSON())

const all = () => db.ref('games').on('value', data => data.toJSON())

const insert = game => db.ref('games').push(game, (success, err) => {
  if (err) {
    l.fatal('Fatal error creating game in Firebase.')
    return;
  }
  l.info('Added game successfully to firebase.', game)
})

module.exports = {
  byId,
  all,
  insert,
}
