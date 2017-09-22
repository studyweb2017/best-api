import { Schema, mongoose, Model } from '../util/db'

export let SessionSchema = new Schema({
  session: String
})

export let SessionModel = mongoose.model('session', SessionSchema)