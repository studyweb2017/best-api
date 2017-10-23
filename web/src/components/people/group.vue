<template lang="pug">
  div.group.p-r
    el-button.mb-10.f-l(type='primary', icon='plus', @click='dialogFormVisible=true') 添加分组
    el-dialog.dialog-form(:title='group.id?"编辑分组":"添加分组"', :visible.sync="dialogFormVisible")
      el-form.group-add-form(ref='group', :model='group', :rules='rules', label-position='right', label-width='100px')
        el-form-item.ta-l(label='组名', prop='name')
          el-input.w-200(size='small', v-model='group.name', placeholder="前端")
        el-form-item.ta-l
          el-button.mr-50(@click='cancel()') 取消
          el-button(type='primary', @click='submit()') {{ group.id ? '保存' : '添加' }}
        el-form-item
    el-table.group-list-table(:data='groupList', border, fit, style='width:100%')
      el-table-column(prop='name', label='组名', align='center')
      el-table-column(label='操作', align='center')
        template(scope='scope')
          el-button(@click.native.prevent='delgroup(scope.$index, scope.row.id)', type='text', size='small') 删除
          el-button(@click.native.prevent='editgroup(scope.$index)', type='text', size='small') 编辑
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
@Component
export default class group extends Vue {
  $refs: any
  $message: any
  $confirm: any
  dialogFormVisible: boolean = false
  group:any = {
    id: '',
    name: ''
  }
  rules: any = {
    name: [{required: true}]
  }
  groupList: any[] = []
  async beforeMount () {
    let resp: any = await http.get('/api/group')
    this.groupList = resp.groupList
    let resp2: any = await http.get('/api/group')
    this.groupList = resp2.groupList
  }
  async delgroup(index: number, id: string) {
    try {
      await this.$confirm('确认删除此分组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      let resp:any = await http.delete('/api/group/' + id)
      if (resp.data.errCode === 0) {
        this.$message({type: 'success', message: '删除成功'})
        this.groupList.splice(index, 1)
      } else {
        this.$message({type: 'error', message: '删除失败'})
      }
    } catch (err) {}
  }
  editgroup(index: number) {
    this.group = this.groupList[index]
    this.dialogFormVisible = true
  }
  addgroup() {
    this.group = {
      id: '',
      name: ''
    }
    this.dialogFormVisible = true
  }
  cancel() {
    this.group = {
      group: {}
    }
    this.dialogFormVisible = false
  }
  submit() {
    let that = this
    this.$refs.group.validate(async (valid:boolean) => {
      if (valid) {
        let resp:any = that.group.id
        ? await http.put('/api/group/' + that.group.id, that.group)
        : await http.post('/api/group', that.group)
        if (resp.data.errCode === 0) {
          if (!that.group.id) { that.groupList.push(that.group) }
          that.$message({type: 'success', message: resp.data.errMsg || '添加成功'})
          that.dialogFormVisible = false
          that.group = {
            id: '',
            name: ''
          }
        } else {
          that.$message({type: 'error', message: resp.data.errMsg || '添加失败'})
        }
      }
      return false
    })
  }
}
</script>

<style lang="stylus" scoped>
.group
  margin 50px
  width 100%
  height 100%
.group-add-form
  margin 20px auto
  padding 20px 50px
  background-color #fff
  border 1px solid $borderColorTable
.group-list-table
  min-width 500px
</style>
