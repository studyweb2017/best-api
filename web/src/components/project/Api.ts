import _ from 'lodash'
import http from '../../service/http'

export default class Api {
  proId: string = ''
  constructor(proId: string) {
    this.proId = proId
  }
  async get(id: string, params: any) {
    if (id) {
      return await http.get(`/api/project/${this.proId}/api/${id}`, {
        params
      })
    } else {
      return new Promise((resolve) => resolve({}))
    }
  }
  async getVersion(id: string) {
    if (id) {
      return await http.get(`/api/project/${this.proId}/api/${id}/version`)
    } else {
      return new Promise((resolve) => resolve({}))
    }
  }
  async delete(id: string) {
    return await http.delete(`/api/project/${this.proId}/api/${id}`)
  }
  async deleteModule(moduleName: string) {
    return await http.delete(`/api/project/${this.proId}/api/?module=${moduleName}`)
  }
}