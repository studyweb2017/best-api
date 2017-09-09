import { Schema, mongoose } from '../util/db'

let GroupSchema = new Schema({
  name: {
    type: String,
    maxlength: 20
  },
  memberList: [Schema.Types.ObjectId]
})

let GroupModel = mongoose.model('group', GroupSchema)

interface GroupInterface {
  _id?: string,
  id: string,
  name: string,
  memberList: string[]
}

export {
  GroupSchema,
  GroupModel,
  GroupInterface
}