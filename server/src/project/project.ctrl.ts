import { ProjectModel, ProjectInterface } from './project.md'
import { TestModel } from '../test/test.md'
import { MemberModel } from '../team/member.md'
import { GroupModel } from '../team/group.md'
import { Observable } from 'rxjs/Rx'
import { Schema, mongoose } from '../util/db'

export interface projectGet extends ProjectInterface {
  _id?: string,
  id: string,
  name: string,
  api: {
    total: number,
    pass: number,
    untest: number
  }
}

export enum role {
  g = 'guest',
  m = 'master',
  d = 'developer',
}

export interface projectPost extends ProjectInterface {
  name: string,
  description?: string,
  testAddress: string,
  members: [{
    id: string,
    name: string,
    role: role
  }]
}

export interface projectPut {
  id: string,
  name?: string
}

export const projectCtrl = {
  get() {
    return Observable.fromPromise(ProjectModel.aggregate()
      .lookup({
        from: TestModel.collection.collectionName,
        localField: '_id',
        foreignField: 'pid',
        as: 'testList'
      })
      .project({
        name:1,
        interfaceList: 1,
        test:{
            $arrayElemAt: ['$testList', -1]
        },
        total: {$size: '$interfaceList'}
      })
      .project({
        id: '$_id',
        _id: 0,
        name: 1,
        api: {
            total: '$total',
            pass: '$test.successTest',
            untest: {
                $subtract: ['$total', '$test.totalTest']
            }
        }
      })
      .exec())
      .map((res: any) => ({ total: res.length, list: res }))
  },
  getById(id: string) {
    return Observable.fromPromise(ProjectModel.aggregate()
      .match({ _id: mongoose.Types.ObjectId(id) })
      .unwind('$memberList')
      .lookup({
        from: MemberModel.collection.collectionName,
        localField: 'memberList.id',
        foreignField: '_id',
        as: 'member'
      })
      .lookup({
        from: GroupModel.collection.collectionName,
        localField: 'memberList.groupId',
        foreignField: '_id',
        as: 'group'
      })
      .unwind('$member', '$group')
      .project({
        name: 1,
        description: '$desc',
        testUrl: 1,
        openTest: 1,
        apiChangedInform: 1,
        testFailedInform: 1,
        members: {
          id: '$member._id',
          name: '$member.name',
          groupId: '$group._id',
          groupName: '$group.name',
          role: '$memberList.role'
        }
      })
      .group({
        _id: '$_id',
        members: { $push: '$members' },
        name: { $first: '$name' },
        description: { $first: '$desc' },
        testUrl: { $first: '$testUrl' },
        openTest: { $first: '$openTest' },
        apiChangedInform: { $first: '$apiChangedInform' },
        testFailedInform: { $first: '$testFailedInform' }
      })
      .exec())
      .map((res: any) => res.pop() || {})
  },
  post(project: any) {
    return Observable.fromPromise((new ProjectModel(project)).save())
      .map((proj: ProjectInterface) => ({ id: proj._id }))
  },
  put(project: projectPut) {
    return Observable.fromPromise(
      new Promise((res, rej) => {
        ProjectModel.updateOne({ _id: project.id }, project, (e: any, r: any) => {
          e ? rej(e) : res(r.n)
        })
      }))
  },
  delete(id: string) {
    return Observable.fromPromise(ProjectModel.remove({ _id: mongoose.Types.ObjectId(id) }))
      .map((res: any) => ({
        num: res.result.n
      }))
  }
}