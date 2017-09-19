import { Schema, mongoose, Model } from '../util/db'

  let InterfaceSchemaObj = {
  pid: {
    type: Schema.Types.ObjectId,
    required: true,
    set: (v: string | any) => mongoose.Types.ObjectId(v)
  },
  url: {
    type: String,
    match: /^\//,
    required: true,
    unique: true
  },
  name: {
    type: String,
    maxlength: 40,
    required: true
  },
  version: {
    type: String,
    required: true
  },
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
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  editorId: {
    type: Schema.Types.ObjectId,
    required: true,
    alias: 'updateMember'
  },
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
  delay: Number,
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
    result: String,
    desc: String,
    probability: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  request: {
    headerList: [{
      _id: false,
      id: String,
      key: String,
      value: String
    }],
    paramList: [{
      _id: false,
      id: String,
      isNecessary: Boolean,
      dataType: {
        type: String,
        enum: ['String', 'Number', 'Boolean', 'Object', 'Array']
      },
      mockData: String,
      validator: String,
      desc: String
    }]
  },
  response: {
    headerList: [{
      _id: false,
      id: String,
      key: String,
      value: String
    }],
    paramList: [{
      _id: false,
      id: String,
      isNecessary: Boolean,
      dataType: {
        type: String,
        enum: ['String', 'Number', 'Boolean', 'Object', 'Array']
      },
      mockData: String,
      validator: String,
      desc: String
    }]
  }
}
let InterfaceSchema = new Schema(InterfaceSchemaObj)

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

interface InterfaceInterface {
  pid: string,
  id: string,
  url: string,
  name: string
  version: string,
  desc: string,
  createdTime: string,
  updateTime: string,
  creatorId: string,
  editorId: string,
  delay?: number,
  state?: {
    id: number,
    name: string
  },
  method: method,
  exceptionList?: [{
    enabled: boolean,
    result: string,
    desc: string,
    probability: number
  }],
  request?: {
    headerList: [{
      key: string,
      value: string
    }],
    paramList: [{
      id: string,
      isNecessary: boolean,
      dataType: dataType,
      mockData: string,
      validator: string,
      desc: string
    }]
  },
  response?: {
    headerList: [{
      key: string,
      value: string
    }],
    paramList: [{
      id: string,
      isNecessary: boolean,
      dataType: dataType,
      mockData: string,
      validator: string,
      desc: string
    }]
  }
}

const InterfaceModel = mongoose.model('interface', InterfaceSchema)

class Interface extends Model {
  name = this.random()
  url = '/' + this.random()
  method = method.get
  version = this.random(4)
}

export {
  InterfaceSchema,
  InterfaceInterface,
  InterfaceSchemaObj,
  InterfaceModel,
  method,
  dataType,
  Interface
}