import '../../common/env'
import l from '../../common/logger'
import * as mongoose from 'mongoose'
import * as firebase from 'firebase'

const dbUrl = process.env.FIREBASE_DATABASE_URL

const initializeFirebase = firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: dbUrl,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
})

initializeFirebase();
const db = mongoose.connect(dbUrl);
const connection = mongoose.connection;

db.on('error', l.error('MongoDB connection error'));
