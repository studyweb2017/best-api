import { Schema, mongoose, Model } from '../util/db'

let ParamSchema = new Schema({
  _id: false,
    headerList: [{
      _id: false,
      id: String,
      key: String,
      value: String
    }],
    urlParams: [],
    paramList: [{
      _id: false,
      id: String,
      name: String,
      required: Boolean,
      ancestor: [String],
      type: {
        type: String,
        enum: ['String', 'Number', 'Boolean', 'Object', 'Array'],
        set(v:string) {
          return `${v[0].toUpperCase()}${v.slice(1)}`
        }
      },
      mock: String,
      remark: String
    }]
})
let InterfaceSchemaObj = {
  iid: Schema.Types.ObjectId,
  pid: {
    type: Schema.Types.ObjectId,
    required: true,
    set: (v: string | any) => mongoose.Types.ObjectId(v)
  },
  url: {
    type: String,
    match: /^\//,
    required: true
  },
  name: {
    type: String,
    maxlength: 40,
    required: true
  },
  version: {
    type: String,
    required: true,
    default: new Date().getTime().toString(36)
  },
  module: String,
  desc: {
    type: String,
    maxlength: 200,
    default: ''
  },
  createdTime: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updateTime: {
    type: Date,
    required: true,
    default: new Date()
  },
  creator: String,
  editor: String,
  isTest: {
    type: Boolean,
    default: false
  },
  testStatusId: Boolean,
  testStatusMsg: String,
  needTest: {
    type: Boolean,
    default: false
  },
  delay: Number, //单位：毫秒
  state: {
    type: Object,
    enum: [{
      _id: false,
      id: 0,
      name: '待测试'
    }, {
      _id: false,
      id: -1,
      name: '测试不通过'
    }, {
      _id: false,
      id: 1,
      name: '测试通过'
    }]
  },
  method: {
    type: String,
    required: true,
    uppercase: true
  },
  exceptionList: [{
    _id: false,
    enabled: Boolean,
    response: String,
    desc: String,
    probability: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  request: ParamSchema,
  response: ParamSchema
}


enum method {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE'
}
enum dataType {
  string = 'String',
  number = 'Number',
  boolean = 'Boolean',
  object = 'Object',
  array = 'Array'
}

let InterfaceSchema = new Schema(InterfaceSchemaObj)
let InterfaceHistorySchema = new Schema(InterfaceSchemaObj)

let InterfaceModel = mongoose.model('interface', InterfaceSchema)
let InterfaceHistoryModel = mongoose.model('interfacehistory', InterfaceHistorySchema)

class Interface extends Model {
  name = this.random()
  url = '/' + this.random()
  method = method.get
  version = this.random(4)
}

export {
  InterfaceSchema,
  InterfaceHistorySchema,
  InterfaceModel,
  InterfaceHistoryModel,
  method,
  dataType,
  Interface
}