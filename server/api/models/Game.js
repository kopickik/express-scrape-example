import {
  Schema, Mongoose
} from 'mongoose'

const GameSchema = new Schema({
  name: {
    type: Schema.Types.ObjectId,
    required: true,
    max: 231
  },
  year: {
    type: String,
    max: 18
  },
  _internalId: {
    type: Schema.Types.ObjectId
  }
})

export default Mongoose.model('Game', GameSchema)
