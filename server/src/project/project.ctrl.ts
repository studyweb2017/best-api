import { ProjectModel, ProjectInterface, role } from './project.md'
import { TestModel } from '../test/test.md'
import { MemberModel } from '../team/member.md'
import { InterfaceModel } from './interface.md'
import { GroupModel } from '../team/group.md'
import { Observable } from 'rxjs/Rx'
import { Schema, mongoose } from '../util/db'
import { rename } from '../util/fun'

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
        localField: 'masterList',
        foreignField: '_id',
        as: 'm'
      })
      .lookup({
        from: MemberModel.collection.collectionName,
        localField: 'developerList',
        foreignField: '_id',
        as: 'd'
      })
      .lookup({
        from: MemberModel.collection.collectionName,
        localField: 'guestList',
        foreignField: '_id',
        as: 'g'
      })
      .append({
        $addFields: {
          m: {
            $map: {
              input: '$m',
              as: 'ml',
              in: {id: '$$ml._id', name: '$$ml.name', role: 'master'}
            }
          },
          d: {
            $map: {
              input: '$d',
              as: 'dl',
              in: {id: '$$dl._id', name: '$$dl.name', role: 'developer'}
            }
          },
          g: {
            $map: {
              input: '$g',
              as: 'gl',
              in: {id: '$$gl._id', name: '$$gl.name', role: 'guest'}
            }
          }
        }
      })
      .project({
        _id:0,
        id: '$_id',
        name: 1,
        descriptions: '$desc',
        openTest: 1,
        testFailedInform: 1, 
        apiChangedInform: 1,
        members: {$concatArrays:['$m', '$d', '$g']}
      })
      .exec())
      .map((res: any) => {
        return res.pop()
      })
  },
  post(project: any) {
    project.masterList = []
    project.developerList = []
    project.guestList = []
    project.members.forEach((it:any) => project[it.role+'List'].push(it))
    return Observable.fromPromise(ProjectModel.create(project))
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