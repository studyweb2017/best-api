import * as _ from 'lodash'
/**
 * 重命名属性
 * @param objOrArray 对象或数组
 * @param fields 需要重命名的key
 */
export const rename = (objOrArray: any, fields: [string, string][]) => {
  let modify = (obj: any, key: [string, string][]) => {
    key.forEach(([k1, k2]) => {
      obj[k2] = obj[k1]
    })
    return result
  }
  let result = _.cloneDeep(objOrArray)
  if (objOrArray && fields) {
    if ((typeof objOrArray).toString() === 'array') {
      result.forEach((it: any) => it = modify(it, fields))
    } else if ((typeof objOrArray).toString() === 'object') {
      result = modify(objOrArray, fields)
    }
  } else {
    console.error('Params error:%s, %s', objOrArray, fields)
  }
  return result
}
