let gId = (size?: number): string => {
  let t = (new Date()).getTime()
  let p = (Math.random().toString(16) + '00000000').substr(2,8)
  return   t + '-' + p.substr(0, size ? size : 4)
}

export class Param {
  id: string
  ancestor: string[]
  name: string
  type: string
  required: boolean
  isRoot?: boolean
  property?: string
  remark?: string
  className?: string
}

export const schema2list = (schemaObj: any): Param[] =>{
  let travel = (schema: any, list: Param[], ancestor: string[], required: boolean = false, noName: boolean = false) => {
    const exclude = ['id', 'name', 'type', 'required', 'description', 'properties', 'items']
    let row: any = {
      id: schema.id || gId(),
      name: schema.name,
      remark: schema.description,
      type: schema.type,
      required,
      ancestor,
      isRoot: ancestor.length === 0,
      className: 'bg-' + ancestor.length
    }
    noName ? row.noName = true : void 0
    let property: any = {}
    for (let p in schema) {
      if (exclude.indexOf(p) < 0) {
        property[p] = schema[p]
      }
    }
    if (Object.keys(property).length > 0) {
      row.property = JSON.stringify(property)
    }
    list.push(row)
    if (schema.type === 'array') {
      schema.items = schema.items || []
      schema.items.forEach((item: any, index: number) => {
        let min = schema.minItems || 0
        travel(item, list, ancestor.concat(schema.id), min > index, true)
      })
    } else if (schema.type === 'object') {
      schema.properties = schema.properties || {}
      for (let p in schema.properties) {
        schema.required = schema.required || []
        travel(schema.properties[p], list, ancestor.concat(schema.id), schema.required.indexOf(schema.properties[p].name) > -1)
      }
    }
  }
  let dataList: Param[] = []
  travel(schemaObj, dataList, [], false)
  return dataList
}

export const list2schema = (list: Param[]): any => {
  let append2parent = (ancestor: string[], origin: any, node: any, required: boolean): any => {
    if (ancestor.length === 0) {
      // 没有祖先，该节点为根节点
      for (let e in node) {
        origin[e] = node[e]
      }
    } else {
      const parentId = ancestor[ancestor.length - 1]
      if (origin.type === 'object') {
        origin.properties = origin.properties || {}
        if (origin.id === parentId) {
          origin.properties[node.name] = node
          if (required) {
            origin.required = origin.required || []
            origin.required.push(node.name)
          }
        } else if (ancestor.indexOf(origin.id) > -1) {
          for (let p in origin.properties) {
            let current = origin.properties[p]
            append2parent(ancestor, current, node, required)
          }
        }
      } else if (origin.type === 'array') {
        origin.items = origin.items || []
        if (origin.id === parentId) {
          origin.items.push(node)
          if (required) {
            origin.minItems = origin.minItems || 0
            origin.minItems++
          }
        } else if (ancestor.indexOf(origin.id) > -1) {
          origin.items.forEach((current: any) => {
            append2parent(ancestor, current, node, required)
          })
        }
      }
    }
  }
  let result = {}
  list.forEach((row: any) => {
    let node = {
      name: row.name,
      type: row.type,
      id: row.id,
      description: row.remark
    }
    if (row.property) {
      try {
        Object.assign(node, JSON.parse(row.property))
      } catch (e) {
        console.error('schema属性转换失败' + e)
      }
    }
    append2parent(row.ancestor, result, node, row.required)
  })
  return result
}