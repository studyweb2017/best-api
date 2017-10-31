<template lang="pug">
div
  div.wrap
    span.c-red {{errMsg}}
    div.editor.f-l
      table.p-r
        tr.va-t.line.p-r.ov-h
          td.col-1.bg-grey-1
            span(v-for='(line, index) in inputLineInfo') {{index + 1}}
          td.col-2
            span(v-for='(line, index) in inputLineInfo', :class='{"bg-yellow":line.selectable}') {{line.selectable ? '可选' : ''}}
          td.col-3.bg-grey-2
            span(v-for='(line, index) in inputLineInfo') {{line.type || ''}}
          td.p-r.col-4
            el-input.inputText(type='textarea', @focus='onFocus', @blur='onBlur', :autofocus='true', autosize, :autosize='{minRows:25}' v-model='inputText', @keyup.up='onKeyup', @change='onChange')
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
  _inputText:string = '{\n\n}'
  inputLineInfo:any[] = [{}, {}, {}]
  mockJsonStr:string = ''
  dataJsonStr:string = ''
  mockJson:any = {}
  dataJson:any = {}
  errMsg:string = ''
  beforeMount() {
    this._inputText = '{\n\n}'
  }
  makeLineInfo(inputText:string) {
    let lines:string[] = inputText.trim().split('\n')
    let infos:any[] = []
    lines.forEach((line:string, index:number) => {
      let info:any = {}
      line = line.trim()
      if (/^\?/.test(line)) {
        info.selectable = true // 是否可选?
        line = line.slice(1)   // 清理问号
      }
      // line.replace(/(true|false|0|[1-9]\d*|@\w)(,?)(\s*\/\/.*?)$/, '$1$2')
      // if (/^{/.test(line)) {
      //   info.type = 'Object'
      // } else if (/^\[/.test(line)) {
      //   info.type = 'Array'
      // } else if (/^(true|false),?\s*(\/\/?.*)?$/.test(line)) {
      //   info.type = 'Boolean'
      // } else if (/(0|[1-9]\d*?),?\s*(\/\/?.*)?$/.test(line)) {
      //   info.type = 'Number'
      // } else if (/^".*?",?\s*(\/\/?.*)?/.test(line)) {
      //   info.type = 'String'
      // }
      // else if ()
      if (!line || /^(\}|\]|\/\/)/.test(line)) {
        info.type = ''
      } else if (/:?\[/.test(line) || /:@range/.test(line)) {
        info.type = 'Array'
      } else if (/:?{/.test(line)) {
        info.type = 'Object'
      } else if (/:(true|false|@boolean)/.test(line)) {
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
  onKeyup(e:any) {
    if (this.inputText !== this._inputText) {
      if (this.inputText.length > this._inputText.length) {
      }
      const pos = this.textElement.selectionEnd
      let letter:any = this.inputText[pos - 1]
      let str:any = ''
      let len:any = 0
      switch (letter) {
        case '{':
          str = '\n\t\n}'
          len = 2
          break
        case '[':
          str = '\n\t\n]'
          len = 2
          break
      }
      if (str) this.textElement.value = this.inputText.slice(0, pos) + str + this.inputText.slice(pos)
      this.textElement.setSelectionRange(pos + len, pos + len)
    }
    this._inputText = this.inputText
  }
  onChange(val:any) {
    this.inputLineInfo = this.makeLineInfo(this.inputText)
    this.mockJsonStr = this.makeMockJsonStr(this.inputText)
    try {
      this.mockJson = JSON.parse(this.mockJsonStr)
      this.dataJson = Mock.mock(this.mockJson)
      this.dataJsonStr = JSON.stringify(this.dataJson)
      this.errMsg = ''
    } catch (err) { this.errMsg = '输入格式有误' }
  }
  textElement:any
  onFocus(e:any) {
    this.textElement = e.target
    document.addEventListener('keyup', this.onKeyup)
  }
  onBlur(e:any) {
    document.removeEventListener('keyup', this.onKeyup)
  }
}
</script>
<style lang="stylus">
.el-textarea
  min-height 498px
  textarea
    border 0 !important
    width 100%
    height 498px
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
  height 500px
  overflow-y auto
  border 1px solid #ccc
// .line
//   height 498px
.col-1, .col-2, .col-3
  width 40px
  height 100%
  span
    display block
    height 21px
    width 40px
    font-size 14px
    line-height 1.5
.col-1
  span
    width 20px
.col-3
  span
    width 50px
.col-4
  width 100%
.output
  vertical-align top
  width 200px
  min-height 500px
  border 1px solid #ccc
</style>
