import _ from 'lodash'
import http from '../../service/http'

export default class Api {
  proId: string = ''
  constructor(proId: string) {
    this.proId = proId
  }
  async get(id: string, params: any) {
    return await http.get(`/api/project/${this.proId}/api/${id}`, {
      params
    })
  }
  async getVersion(id: string) {
    return await http.get(`/api/project/${this.proId}/api/${id}/version`)
  }
  async delete(id: string) {
    return await http.delete(`/api/project/${this.proId}/api/${id}`)
  }
  async deleteModule(moduleName: string) {
    return await http.delete(`/api/project/${this.proId}/api/?module=${moduleName}`)
  }
}