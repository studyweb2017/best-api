import { ProjectModel, ProjectInterface, role } from './project.md'
import { TestModel } from '../test/test.md'
import { MemberModel } from '../team/member.md'
import { InterfaceModel } from './interface.md'
import { GroupModel } from '../team/group.md'
import { Observable } from 'rxjs/Rx'
import { Schema, mongoose } from '../util/db'

export const projectCtrl = {
  get() {
    return Observable.fromPromise(ProjectModel.aggregate()
      .lookup({
        from: TestModel.collection.collectionName,
        localField: '_id',
        foreignField: 'pid',
        as: 'testList'
      })
      .lookup({
        from: InterfaceModel.collection.collectionName,
        localField: '_id',
        foreignField: 'pid',
        as: 'interfaceList'
      })
      .exec())
      .map((res: any) => {
        let result:any = {
          total: res.length,
          list: []
        }
        res.forEach((p:any) => {
          let test = p.testList.pop() || {}
          let api:any = {
            total: p.interfaceList.length,
            pass: test.successTest || 0,
          }
          api.untest = api.total - api.pass
          result.list.push({
            id: p._id,
            name: p.name,
            api
          })
        })
        return result
      })
  },
  getById(id: string) {
    return Observable.fromPromise(ProjectModel.aggregate()
      .match({ _id: mongoose.Types.ObjectId(id) })
      .lookup({
        from: MemberModel.collection.collectionName,
        localField: 'memberList.id',
        foreignField: '_id',
        as: 'members'
      })
      .project({
        _id: 0,
        id: '$_id',
        name: 1,
        description: '$desc',
        testUrl: 1,
        openTest: 1,
        apiChangedInform: 1,
        testFailedInform: 1,
        'members.id': '$$CURRENT._id',
        'members.name': 1,
        'members.role': 1
      })
      .exec())
      .map((res: any) => res.pop() || {})
  },
  post(project: any) {
    return Observable.fromPromise((new ProjectModel(project)).save())
      .map((proj: ProjectInterface) => ({ id: proj._id }))
  },
  put(_id:string, project: any) {
    try {
      return Observable.fromPromise(ProjectModel.updateOne({ _id}, project).exec())
        .map((res:any) => ({num: res.n})) 
    } catch(e) {
      return Observable.throw(e)
    }
  },
  delete(id: string) {
    return Observable.fromPromise(ProjectModel.remove({ _id: mongoose.Types.ObjectId(id) }))
      .map((res: any) => ({
        num: res.result.n
      }))
  }
}