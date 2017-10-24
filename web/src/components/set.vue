<template lang="pug">
  div
    el-form.setting(ref='setting', :model='setting', label-position='right', label-width='100px')
<<<<<<< HEAD
      el-row
        el-col(:span='12')
          el-form-item.ta-l(label='')
            img.company-logo.d-ib(:src='setting.companyLogo', alt='公司logo')
            el-upload.d-ib(action='/api/upload/img', :headers='headers', :show-file-list='false', :on-success='uploadSuccess', :before-upload='beforeUpload', :on-err='uploadFail') 上传图片
          el-form-item.ta-l(label='公司名称')
            el-input.w-200(v-model='setting.companyName')
          el-form-item.ta-l(label='备份大小')
            el-input.w-200(v-model='setting.backupSize')
            span MB
          el-form-item.ta-l(label='钉钉URL')
            el-input.w-200(v-model='setting.dingInformUrl')
          el-form-item.ta-l(label='钉钉通知')
            el-checkbox-group(v-model='setting.dingInformOperation')
              el-checkbox(label='addInterface') 添加接口
              el-checkbox(label='deleteInterface') 删除接口
              el-checkbox(label='editInterface') 编辑接口
              el-checkbox(label='autoTestInterface') 自动测试接口
          el-form-item.ta-l(label='towerURL')
            el-input.w-200(v-model='setting.towerInformUrl')
          el-form-item.ta-l(label='tower通知')
            el-checkbox-group(v-model='setting.towerInformOperation')
              el-checkbox(label='addInterface') 添加接口
              el-checkbox(label='deleteInterface') 删除接口
              el-checkbox(label='editInterface') 编辑接口
              el-checkbox(label='autoTestInterface') 自动测试接口
          el-form-item.ta-l(label='自动测试')
            el-switch(v-model='setting.testAuto', on-text='是', off-text='否')
          el-form-item.ta-l(label='测试时间')
            el-time-select.w-200(v-model='setting.testTime', :picker-options="{start: '00:00', step: '00:30', end: '24:00'}")
          el-form-item.ta-l(label='测试间隔')
            el-radio-group(v-model='setting.testInterval')
              el-radio(label='hourly') 每时
              el-radio(label='daily') 每天
              el-radio(label='weekly') 每周
              el-radio(label='monthly') 每月
        el-col.template(:span='12')
            span 接口导出模板
            el-input(type='textarea', rows='7', v-model='setting.reportTemplate')
            span 自定义样式
            el-input(type='textarea', rows='7', v-model='setting.reportStyle', @change='previewApiTemplate')
            span 预览
            el-row
              span(:style='style.name') {{'接口名称:' + api.name}}
              span(:style='style.url') {{'url:' + api.url}}
              span(:style='style.method') {{'method' + api.method}}
      el-button(@click='$router.go(-1)') 返回
=======
      el-form-item.ta-l(label='公司logo')
        el-upload(action='/setting/upload/img', :show-file-list='false', :on-success='afterUpload', :before-upload='beforeUpload') 上传图片
          img.company-logo(v-if='setting.companyLogo', :src='setting.companyLogo', alt='公司logo')
          i.el-icon-upload
      el-form-item.ta-l(label='公司名称')
        el-input.w-200(v-model='setting.companyName')
      el-form-item.ta-l(label='备份大小')
        el-input.w-200(v-model='setting.backupSize')
        span MB
      el-form-item.ta-l(label='钉钉通知')
        el-switch(v-model='setting.dingInform', on-text='是', off-text='否')
        span.ml-15 (接口增删改测)
      el-form-item.ta-l(label='tower通知')
        el-switch(v-model='setting.towerInform', on-text='是', off-text='否')
        span.ml-15 (接口增删改测)
      el-form-item.ta-l(label='自动测试')
        el-switch(v-model='setting.testAuto', on-text='是', off-text='否')
      el-form-item.ta-l(label='测试时间')
        el-time-select.w-200(v-model='setting.testTime', :picker-options="{start: '00:00', step: '00:30', end: '24:00'}")
      el-form-item.ta-l(label='测试间隔')
        el-radio-group(v-model='setting.testInterval')
          el-radio(label='perHour') 每时
          el-radio(label='perDay') 每天
          el-radio(label='perWeek') 每周
          el-radio(label='perMonth') 每月
      el-form-item.ta-l(label='接口导出格式')
      el-button 取消
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
      el-button(@click='save()') 保存
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../service/http.ts'
<<<<<<< HEAD
import cache from '../service/cache.ts'
@Component
export default class set extends Vue {
  $message: any
  $router: any
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
=======
@Component
export default class set extends Vue {
  $message: any
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
  setting: any = {
    companyLogo: '',
    companyName: '',
    backupSize: '',
    testAuto: true,
<<<<<<< HEAD
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
  previewApiTemplate() {
    this.style = JSON.parse(this.setting.reportStyle)
  }
  async beforeMount() {
    let resp:any = await http.get('/api/setting')
    this.setting = resp || this.setting
    this.setting.reportTemplate = this.setting.reportTemplate || JSON.stringify({

    })
    if (!this.setting.reportStyle) {
      this.setting.reportStyle = JSON.stringify({
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
    }
    this.previewApiTemplate()
  }
  async save() {
    let resp:any = await http.put('/api/setting', this.setting)
    if (resp.errCode === 0) {
      this.$message({type: 'success', message: '保存成功'})
    } else {
      this.$message({type: 'error', message: resp.errMsg || '保存失败'})
=======
    testInterval: 'perHour',
    testTime: '',
    dingInform: false,
    towerInform: false,
    apiTemplate: ''
  }
  async beforeMount() {
    let resp:any = await http.get('/api/setting')
    this.setting = resp
  }
  async save() {
    let resp:any = await http.put('/api/setting', this.setting)
    if (resp.data.errCode === 0) {
      this.$message({type: 'success', message: resp.data.errMsg || '保存成功'})
    } else {
      this.$message({type: 'error', message: resp.data.errMsg || '保存失败'})
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
    }
  }
  beforeUpload() {
  }
<<<<<<< HEAD
  uploadSuccess(res:any, file:any) {
    // this.setting.companyLogo = URL.createObjectURL(file.raw)
    this.setting.companyLogo = res.imgUrl
  }
  uploadFail(err:any, file:any, fileList:any) {
    this.$message({type: 'error', message: err || '上传失败'})
=======
  afterUpload() {
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
  }
}
</script>

<style lang="stylus" scoped>
.setting
<<<<<<< HEAD
  margin 50px auto 0
  padding 20px 20px
  width 1200px
=======
  margin 20px auto
  padding 20px 50px
  width 800px
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
  border 1px solid #ddd
.company-logo
  width 100px
  height 100px
<<<<<<< HEAD
  border 1px solid #ddd
.template
  .el-row
    margin 10px 0
    height 200px
    border 1px solid #ddd
=======
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
</style>
