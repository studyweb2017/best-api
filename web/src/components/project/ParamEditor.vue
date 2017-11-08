<template lang="pug">
div.param-editor(:id="id")
  el-tabs(v-model="activeTabName", type="border-card", @tab-click="tabClick(activeTabName)")
    el-tab-pane(label="表格", name="table")  
      el-table.data-list-table(:data='data', border)
        el-table-column.d-f(prop='name', label='参数名', header-align='left')
          template(scope='scope')
            span.d-ib.icon-node(v-if='scope.row.ancestor.length>0', :class="scope.row.className")
            span.c-silver.root(v-if="scope.row.isRoot") {{scope.row.name}} 
            el-input.d-ib.f-1.param-name(:disabled="scope.row.noName", v-if="!scope.row.isRoot", v-model='scope.row.name', 
            :class="scope.row.className", size='small')
            el-select.data-select(:disabled="scope.row.isRoot", v-model='scope.row.type', 
            :key='scope.row.id', size='small', @change='changeType(data, scope.row, scope.$index)')
              el-option(v-for='(t, index) in types', :value='t', :key='index', :label='t')
            i.el-icon-plus.plus-btn.c-blue.cu-p(v-if='scope.row.type.toLowerCase()==="object" || scope.row.type.toLowerCase() === "array"', @click='addData(data, scope.row, scope.$index)')
            i.el-icon-close.c-red.cu-p.plus-btn.ml-10(size='mini', v-if="!scope.row.isRoot", @click='delData(data, scope.row, scope.$index)', icon='close', type='danger')
        el-table-column(prop='remark', label='说明', header-align='center', min-width='100')
          template(scope='scope')
            el-input(v-if="!scope.row.isRoot", v-model='scope.row.remark', size='small')
        el-table-column(prop='required', label='必须', width='50', align='center')
          template(scope='scope')
            el-checkbox(v-if="!scope.row.isRoot", v-model='scope.row.required', size='normal')
        el-table-column(prop='property', label='JSONSchema属性', header-align='center', width='250')
          template(scope='scope')
            el-input(v-model='scope.row.property', size='small')
    el-tab-pane(label="JSON", name="json")
      pre.json
    el-tab-pane(label="Schema", name="schema")
      pre.schema(contenteditable="", @keyup='schemaChanged($event, index)')
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {Prop, NoCache} from 'vue-property-decorator'
import jsf from 'json-schema-faker'

let gId = (size?: number): string => {
  let t = (new Date()).getTime()
  let p = (Math.random().toString(16) + '00000000').substr(2,8)
  return   t + '-' + p.substr(0, size ? size : 4)
}

class Param {
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

@Component
export default class ParamEditor extends Vue {
  @Prop
  data: any
  @NoCache
  get id() {
    return Math.random().toString(36).substring(2, 10)
  }
  activeTabName: string
  $confirm: any

  async delData(data:any, row:any, index:any) {
    let len:any = 1
    if (row.type.toLowerCase() === 'object' || row.type.toLowerCase() === 'array') {
      await this.$confirm('对象或数组将会同时删除全部子元素, 继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      data.forEach((p:any, idx:any) => {
        if (p.ancestor.indexOf(row.id) > -1) {
          len++
        }
      })
      data.splice(index, len)
    } else {
      data.splice(index, len)
    }
  }
  addData(data:any, row?:any, index?:any) {
    let ancestor: string[] = row.ancestor.concat([row.id])
    data.splice(row ? index + 1 : data.length, 0, {
      id: gId(),
      ancestor,
      name: '',
      type: 'string',
      required: row.type !== 'array',
      remark: '',
      noName: row.type === 'array', // 数组元素无属性名
      className: 'bg-' + ancestor.length
    })
  }
  changeType(data:any, row:any, index:any) {
    let len:any = 0
    data.forEach((p:any, idx:any) => {
      if (p.ancestor.indexOf(row.id) > -1) { len++ }
    })
    data.splice(index + 1, len)
    if (row.type === 'String') {
      row.mock = '@string'
    } else if (row.type === 'Boolean') {
      row.mock = '@boolean'
    } else if (row.type === 'Number') {
      row.mock = '@integer(0,0)'
    } else if (row.type === 'Array') {
      row.mock = '1-5'
    }
  }
  async tabClick(tabName: string) {
    if (tabName === 'schema') {
      try {
        let preDom: any = document.querySelectorAll('#' + this.id + ' pre.schema')[index]
        this.data.dataSchema = list2schema(JSON.parse(JSON.stringify(this.data.dataList)))
        preDom.innerText = JSON.stringify(this.data.dataSchema, null, 2)
      } catch (e) {
        console.error('转换schema失败：' + e)
      }
    } else if (tabName === 'table') {
      this.data.dataList = schema2list(this.data.dataSchema)
    } else if (tabName === 'json') {
      this.data.dataSchema = list2schema(JSON.parse(JSON.stringify(this.data.dataList)))
      let preJson: any = document.querySelectorAll(t'#' + his.id + 'p re.json')[index]
      preJson.innerText = JSON.stringify(await this.getJson(this.data.dataSchema), null, 2)
    }
  }
  async getJson(schema: any) {
    return await jsf.resolve(schema)
  }
  schema2list (schemaObj: any): Param[] {
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
  list2schema (list: Param[]): any {
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
}
</script>
<style scoped lang="stylus">
  
</style>
