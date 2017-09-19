import { ProjectModel, ProjectInterface, role } from './project.md'
import { TestModel } from '../test/test.md'
import { MemberModel } from '../team/member.md'
import { InterfaceModel } from './interface.md'
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
        let result: any = {
          total: res.length,
          list: []
        }
        res.forEach((p: any) => {
          let test = p.testList.pop() || {}
          let api: any = {
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
              in: { id: '$$ml._id', name: '$$ml.name', role: 'master' }
            }
          },
          d: {
            $map: {
              input: '$d',
              as: 'dl',
              in: { id: '$$dl._id', name: '$$dl.name', role: 'developer' }
            }
          },
          g: {
            $map: {
              input: '$g',
              as: 'gl',
              in: { id: '$$gl._id', name: '$$gl.name', role: 'guest' }
            }
          }
        }
      })
      .project({
        _id: 0,
        id: '$_id',
        name: 1,
        description: '$desc',
        openTest: 1,
        testUrl: 1,
        testFailedInform: 1,
        apiChangedInform: 1,
        members: { $concatArrays: ['$m', '$d', '$g'] }
      })
      .exec())
      .map((res: any) => {
        return res.pop()
      })
  },
  getRole() {
    return Observable.of({
      "roleList": [
        {
          "name": "master",
          "editProject": true,
          "editApi": true,
          "readApi": true
        },
        {
          "name": "developer",
          "editProject": false,
          "editApi": true,
          "readApi": true
        },
        {
          "name": "guest",
          "editProject": false,
          "editApi": false,
          "readApi": true
        }
      ]
    })
  },
  post(project: any) {
    try {
      return Observable.zip(Observable.of(project), devideMember(project.members), (x, y) => Object.assign(x, y))
        .switchMap((p: any) => {
          return Observable.fromPromise(ProjectModel.create(p))
            .map((proj: ProjectInterface) => ({ id: proj._id }))
        })
    } catch (e) {
      return Observable.throw(e)
    }
  },
  put(_id: string, project: any) {
    try {
      return Observable.zip(Observable.of(project), devideMember(project.members), (x, y) => Object.assign(x, y))
        .switchMap((p: any) => {
          return Observable.fromPromise(ProjectModel.updateOne({ _id }, {$set:p}).exec())
            .map((res: any) => ({ num: res.n }))
        })
    } catch (e) {
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

let devideMember = (memberList: any=[]) => Observable.of(memberList)
  .map((list: any) => {
    let obj: any = {
      masterList: [],
      developerList: [],
      guestList: []
    }
    memberList.forEach((it: any) => {
      obj[it.role + 'List'].push(mongoose.Types.ObjectId(it.id))
    })
    return obj
  })