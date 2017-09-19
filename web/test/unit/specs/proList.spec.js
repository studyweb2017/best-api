import Vue from 'vue'
import proList from '@/components/project/proList'

describe('proList.vue', () => {
  it('projects', () => {
    const Constructor = Vue.extend(proList)
    const vm = new Constructor().$mount()
    expect(typeof vm.data).toBe('function')
  })
})
