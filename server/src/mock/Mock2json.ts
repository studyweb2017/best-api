import * as Mock from 'mockjs'

export default class Mock2json {
  static makeJsonSchema(list: any[], rootId: string = 'root') {
    return Mock.toJSONSchema(this.makeMockJson(list, rootId))
  }

  static makeJson(list: any[], rootId: string = 'root') {
    return Mock.mock(this.makeMockJson(list, rootId))
  }

  static makeMockJson(list: any, pid: any, isArray?: boolean) {
    if (isArray) {
      let arr: any[] = []
      list.forEach((p: any) => {
        if (p.ancestor[p.ancestor.length - 1] === pid) {
          let t: any = p.type
          if (t === 'Number' || t === 'String' || t === 'Boolean') {
            arr.push(p.mock)
          } else if (t === 'Object') {
            arr.push(this.makeMockJson(list, p.id))
          } else if (t === 'Array') {
            arr.push(this.makeMockJson(list, p.id, true))
          }
        }
      })
      return arr
    } else {
      let obj: any = {}
      list.forEach((p: any) => {
        if (p.ancestor[p.ancestor.length - 1] === pid && p.name) {
          let t = p.type
          if (t === 'Number' || t === 'String' || t === 'Boolean') {
            let key: any = p.name + ((p.mock.split('|')[1] ? ('|' + p.mock.split('|')[1]) : ''))
            obj[key] = p.mock.split('|')[0]
          } else if (t === 'Object') {
            let key: any = p.name + (p.mock ? '|' + p.mock : '')
            obj[key] = this.makeMockJson(list, p.id)
          } else if (t === 'Array') {
            let key: any = p.name + (p.mock ? '|' + p.mock : '')
            obj[key] = this.makeMockJson(list, p.id, true)
          }
        }
      })
      return obj
    }
  }

  static valid(template:string, obj:any):any {
    return Mock.valid(template, obj)
  }
}