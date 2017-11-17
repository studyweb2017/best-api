<template lang="pug">
  div
    el-form.setting(ref='setting', :model='setting', label-position='right', label-width='100px')
      el-row
        el-col(:span='12')
          el-form-item.ta-l.mb-10(label='')
            img.company-logo.d-ib(:src='setting.companyLogo', alt='公司logo')
            el-upload.d-ib(action='/api/upload/img', :headers='headers', :show-file-list='false', :on-success='uploadSuccess', :on-err='uploadFail') 上传图片
          el-form-item.ta-l.mb-10(label='公司名称')
            el-input.w-200(v-model='setting.companyName', size='small')
          el-form-item.ta-l.mb-10(label='备份大小')
            el-input.w-200(v-model='setting.backupSize', size='small')
            span MB
          el-form-item.ta-l.mb-10(label='钉钉URL')
            el-input.w-200(v-model='setting.dingInformUrl', size='small')
          el-form-item.ta-l.mb-10(label='钉钉通知')
            el-checkbox-group(v-model='setting.dingInformOperation')
              el-checkbox(label='addInterface', size='small') 添加接口
              el-checkbox(label='deleteInterface', size='small') 删除接口
              el-checkbox(label='editInterface', size='small') 编辑接口
              el-checkbox(label='autoTestInterface', size='small') 自动测试接口
          el-form-item.ta-l.mb-10(label='towerURL')
            el-input.w-200(v-model='setting.towerInformUrl', size='small')
          el-form-item.ta-l.mb-10(label='tower通知')
            el-checkbox-group(v-model='setting.towerInformOperation')
              el-checkbox(label='addInterface', size='small') 添加接口
              el-checkbox(label='deleteInterface', size='small') 删除接口
              el-checkbox(label='editInterface', size='small') 编辑接口
              el-checkbox(label='autoTestInterface', size='small') 自动测试接口
          el-form-item.ta-l.mb-10(label='自动测试')
            el-switch(v-model='setting.testAuto', on-text='是', off-text='否', size='small')
          el-form-item.ta-l.mb-10(label='测试时间')
            el-time-select.w-200(v-model='setting.testTime', size='small', :picker-options="{start: '00:00', step: '00:30', end: '24:00'}")
          el-form-item.ta-l.mb-10(label='测试间隔')
            el-radio-group(v-model='setting.testInterval')
              el-radio(label='hourly', size='small') 每时
              el-radio(label='daily', size='small') 每天
              el-radio(label='weekly', size='small') 每周
              el-radio(label='monthly', size='small') 每月
        // el-col.template(:span='12')
        //     span 接口导出模板
        //     el-input(type='textarea', :rows='7', v-model='setting.reportTemplate')
        //     span 自定义样式
        //     el-input(type='textarea', :rows='7', v-model='setting.reportStyle', @change='previewApiTemplate')
        //     span 预览
        //     el-row
        //       span(:style='style.name') {{'接口名称:' + api.name}}
        //       span(:style='style.url') {{'url:' + api.url}}
        //       span(:style='style.method') {{'method' + api.method}}
      div.ta-c
        el-button.mr-10(@click='$router.go(-1)') 返 回
        el-button(type="primary", @click='save()') 保 存
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../service/http'
import cache from '../service/cache'

@Component
export default class Set extends Vue {
  $message: any
  api:any = {
    name: '示例接口',
    url: '/example.com/xx',
    method: 'POST',
    request: [{
    }]
  }
  headers: any = {
    'Authorization': cache.get('token') || ''
  }
  setting: any = {
    companyLogo: '',
    companyName: '',
    backupSize: '',
    testAuto: true,
    testInterval: 'hourly',
    testTime: '',
    dingInformOperation: [],
    towerInformOperation: [],
    towerInformUrl: '',
    dingInformUrl: '',
    reportStyle: '',
    reportTemplate: ''
  }
  style:any = {}
  // previewApiTemplate() { this.style = JSON.parse(this.setting.reportStyle) }
  async beforeMount() {
    let resp:any = await http.get('/api/setting')
    this.setting = resp || this.setting
    this.setting.reportTemplate = this.setting.reportTemplate || `
    span(:style='style.name') {{'接口名称:' + api.name}}
    span(:style='style.url') {{'url:' + api.url}}
    span(:style='style.method') {{'method' + api.method}}
    `
    this.setting.reportStyle = this.setting.reportStyle || JSON.stringify({
      name: {
        display: 'block',
        color: 'red',
        fontSize: '25px'
      },
      method: {
        float: 'left'
      },
      url: {
        color: 'blue'
      }
    }, null, 4)
    // this.previewApiTemplate()
  }
  async save() {
    let resp:any = await http.put('/api/setting', this.setting)
    resp.errCode === 0 ? this.$message({type: 'success', message: '保存成功'}) : this.$message({type: 'error', message: resp.errMsg || '保存失败'})
  }
  uploadSuccess(res:any, file:any) { this.setting.companyLogo = res.imgUrl }
  uploadFail(err:any, file:any, fileList:any) { this.$message({type: 'error', message: err || '上传失败'}) }
}
</script>

<style lang="stylus" scoped>
.setting
  margin 50px auto 0
  padding 20px 20px
  width 1200px
  border 1px solid #ddd
.company-logo
  width 100px
  height 100px
  border 1px solid #ddd
.template
  .el-row
    margin 10px 0
    height 200px
    border 1px solid #ddd
</style>
