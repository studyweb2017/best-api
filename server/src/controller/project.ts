import { ProjectModel, ProjectInterface } from '../model/project'
import { InterfaceInterface } from '../model/interface'

interface projectGet extends ProjectInterface{
  name: string,
  totalTest?: number,
  successTest?: number,
  testList: [{
    successTest: number,
    totalTest: number
  }]
}

interface projectPost extends ProjectInterface{
  name: string,
  memberList: [string]
  interfaceList: [InterfaceInterface]
}

export default {
  async get():Promise<[projectGet]> {
    let projList:[projectGet] = await ProjectModel.find({
      id: '',
      name: '',
      testList: {
        successTest: '',
        totalTest: '',
        $limit: 1,
        $sort: 1
      }
    })
    projList.forEach(p => {
      if(p.testList.length>0) {
        p.successTest = p.testList[0].successTest
        p.totalTest = p.testList[0].totalTest
      } else {
        p.successTest = p.totalTest = 0
      }
      delete p.testList
    })
    return projList
  },
  async post(project:projectPost):Promise<string> {
    let proj = new ProjectModel(project)
    await proj.save()
    return proj._id
  },
  async remove(id: string):Promise<boolean> {
    try {
      await ProjectModel.remove({_id: id}) 
      return true
    } catch(e) {
      console.error(e); 
      return false
    }
  }
}