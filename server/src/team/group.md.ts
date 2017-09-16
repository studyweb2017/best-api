import { Schema, mongoose, Model } from '../util/db'

let GroupSchema = new Schema({
  name: {
    type: String,
    maxlength: 20,
    required: true
  },
  memberList: [Schema.Types.ObjectId]
})

let GroupModel = mongoose.model('group', GroupSchema)

// 用于限制返回值
interface GroupInterface {
  id: string,
  name: string,
  memberList: string[]
}

// 用于生成数据
class Group extends Model{
  name: string = this.random()
  memberList: string[] = []
}

export {
  GroupSchema,
  GroupModel,
  GroupInterface,
  Group
}