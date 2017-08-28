import { Schema, mongoose } from '../util/db'

let InterfaceSchema = new Schema({
  url: {
    type: String,
    match: /^\//
  },
  name: {
    type: String,
    maxlength: 40,
  },
  version: String,
  desc: {
    type: String,
    maxlength: 200
  },
  timestamp: {
    type: Number,
    default: new Date
  },
  creatorId: String,
  editorId: String,
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
    enum: ['GET', 'POST', 'PUT', 'DELETE']
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
})

interface InterfaceInterface {
  url?: string,
  name?: string
  version?: string,
  desc?: string,
  timestamp?: number
  creatorId?: string,
  editorId?: string,
  delay?: number,
  state?: {
    id: number,
    name: string
  },
  method?: string,
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
      dataType: string,
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
      dataType: string,
      mockData: string,
      validator: string,
      desc: string
    }]
  }
}

export {
  InterfaceSchema,
  InterfaceInterface
}