import { ProjectModel, ProjectInterface, role } from './model'
import { TestModel } from '../test/test.md'
import { MemberModel } from '../member/model'
import { InterfaceModel } from '../interface/model'
import { Observable } from 'rxjs/Rx'
import { Schema, mongoose } from '../util/db'
import exp from './export'
import BaseCtrl from '../util/Base.ctrl'

export default class ProjectCtrl extends BaseCtrl {
  /**
   * 项目成员可查看所属项目，管理员可查看所有项目
   */
   get(uId: string, isAdmin: boolean) {
    let gg = ProjectModel.aggregate()
    if (!isAdmin) {
      gg.append({
        $addFields: {
          memberList: { $concatArrays: ['$developerList', '$masterList', '$guestList'] }
        }
      })
        .match({ memberList: { $in: [mongoose.Types.ObjectId(uId)] } })
    }
    return Observable.fromPromise(gg
      .lookup({
        from: InterfaceModel.collection.collectionName,
        localField: '_id',
        foreignField: 'pid',
        as: 'list'
      })
      .project({
        id: '$_id',
        name: 1,
        api: {
          total: { $size: '$list' },
          pass: { $literal: 0 },
          untest: { $size: '$list' }
        }
      })
      .exec())
      .map((list: any) => ({ list }))
  }
   getById(id: string, uId: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, id, uId)
      .switchMap((authorized: boolean) => {
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
      })
  }
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
  }
   post(project: any) {
    try {
      return Observable.zip(Observable.of(project), this.devideMember(project.members), (x, y) => Object.assign(x, y))
        .switchMap((p: any) => {
          return Observable.fromPromise(ProjectModel.create(p))
            .map((proj: ProjectInterface) => ({ id: proj._id }))
        })
    } catch (e) {
      return Observable.throw(e)
    }
  }
   put(_id: string, project: any, uid: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, _id, uid, [role.master])
      .switchMap(() => {
        return Observable.zip(Observable.of(project), this.devideMember(project.members), (x, y) => Object.assign(x, y))
          .switchMap((p: any) => {
            return Observable.fromPromise(ProjectModel.updateOne({ _id }, { $set: p }).exec())
              .map((res: any) => ({ num: res.n }))
          })
      })
  }
   delete(id: string, uid: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, id, uid, [role.master])
      .switchMap((authorized: boolean) => {
        if (authorized) {
          return Observable.fromPromise(ProjectModel.remove({ _id: mongoose.Types.ObjectId(id) }))
            .map((res: any) => ({
              num: res.result.n
            }))
            .do(() =>  {
              InterfaceModel.remove({pid: mongoose.Types.ObjectId(id)}).exec()
            })
        } else {
          return Observable.throw({ status: 403, message: '没有访问权限' })
        }
      })
  }
   export(pid: string, uid: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, pid, uid)
      .switchMap((authorized: boolean) => {
        return exp.gen(pid)
          .map((url: any) => {
            return { url }
          })
      })
  }
   report(file: string) {
    return exp.readFile(file)
  }
  private devideMember (memberList: any = []) {
    return Observable.of(memberList)
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
  }
}

