<template lang="pug">
div
  div.wrap
    span.c-red {{errMsg}}
    div.editor.f-l
      table.p-r
        tr.va-t.line.p-r.ov-a
          td.col-1.bg-grey-1
            span(v-for='(line, index) in inputLineInfo') {{index}}
          td.col-2
            span(v-for='(line, index) in inputLineInfo', :class='{"bg-yellow":line.selectable}') {{line.selectable ? '可选' : ''}}
          td.col-3.bg-grey-2
            span(v-for='(line, index) in inputLineInfo') {{line.type || ''}}
          td.p-r.col-4
            el-input.inputText(type='textarea', @focus='onFocus', @keyup.enter='onEnter', @blur='1>0', :autofocus='true', autosize, :autosize='{minRows:1}' v-model='inputText', @input='onInput')
    pre.output.f-l {{ mockJsonStr }}
    pre.output.f-l {{ dataJsonStr }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Mock from 'mockjs'
@Component
export default class doc extends Vue {
  Mock:any
  inputText:string = '{\n\n}'
  inputLineInfo:any[] = [{}, {}, {}]
  mockJsonStr:string = ''
  dataJsonStr:string = ''
  mockJson:any = {}
  dataJson:any = {}
  errMsg:string = ''
  makeLineInfo(inputText:string) {
    let lines:string[] = inputText.split('\n')
    let infos:any[] = []
    lines.forEach((line:string, index:number) => {
      let info:any = {}
      line = line.trim()
      if (/^\?\S/.test(line)) { info.selectable = true }
      if (!line || /^\}|^\]/.test(line)) {
        info.type = ''
      } else if (/:?\[/.test(line) || /:@range/.test(line)) {
        info.type = 'Array'
      } else if (/:?{/.test(line)) {
        info.type = 'Object'
      } else if (/(^true|^false|:(true|false|@boolean))/.test(line)) {
        info.type = 'Boolean'
      } else if (/(^\d|:(@integer|@natural|@float|\d))/.test(line)) {
        info.type = 'Number'
      } else { info.type = 'String' }
      infos[index] = info
    })
    return infos
  }
  makeMockJsonStr(inputText:string) {
    let lines:string[] = []
    let newLines:string[] = []
    lines = inputText.replace(/\s+\/\/?(.+)?\n/g, '\n').split('\n') // 去掉注释，分行
    lines.forEach((line:string, index:number) => {
      line = line.trim()
      line = line[0] === '?' ? line.slice(1) : line // 去掉开头?
      line = line.replace(/(.+):/, '"$1":') // 给属性名加双引号
      line = line.replace(/:@(.+),$/, ':"@$1",') // 给mock属性值加双引号, 逗号结尾
      line = line.replace(/:@(.+)$/, ':"@$1"') // 给mock属性值加双引号
      newLines[index] = line
    })
    return newLines.join('\n')
  }
  onInput(e:any) {
    this.inputLineInfo = this.makeLineInfo(this.inputText)
    this.mockJsonStr = this.makeMockJsonStr(this.inputText)
    try {
      this.mockJson = JSON.parse(this.mockJsonStr)
      this.dataJson = Mock.mock(this.mockJson)
      this.dataJsonStr = JSON.stringify(this.dataJson)
      this.errMsg = ''
    } catch (err) { this.errMsg = '输入格式有误' }
  }
  onEnter(e:any) { if (e.keyCode === 13) { this.makeLineInfo(this.inputText) } }
  onFocus(e:any) { document.addEventListener('keypress', this.onEnter) }
}
</script>
<style lang="stylus">
.el-textarea
  textarea
    border 0 !important
    width 100%
    resize none
    padding 0
    font-family Arial, Helvetica, sans-serif
</style>

<style lang="stylus" scoped>
table, th, td
  border-collapse collapse
.bg-grey-1
  background-color #eee
.bg-grey-2
  background-color #ddd
.wrap
  margin 50px
.editor
  width 500px
  border 1px solid #ccc
.line
  height 498px
  min-height 498px
.col-1, .col-2, .col-3
  width 40px
  span
    display block
    height 21px
    font-size 14px
    line-height 1.5
.col-3
  width 50px
.output
  vertical-align top
  width 200px
  min-height 500px
  border 1px solid #ccc
</style>
