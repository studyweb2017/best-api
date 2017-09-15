import { GroupModel, GroupInterface } from './group.md'
import { Observable } from 'rxjs/Rx'
import { MemberModel } from './member.md'

export const groupCtrl = {
  get() {
    return Observable.fromPromise(GroupModel.aggregate([{
      $unwind: '$memberList'
    }, {
      $lookup: {
        from: MemberModel.collection.collectionName,
        localField: 'memberList',
        foreignField: '_id',
        as: 'members'
      }
    }, {
      $project: {
        id: '$_id',
        name: 1,
        members: 1
      }
    }]))
      .map((groups: GroupInterface[]) => ({ groups }))
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
  post(group: any) {
    return Observable.fromPromise(new GroupModel(group).save())
  },
  put(group: any) {
    return Observable.fromPromise(
      new Promise((res, rej) => {
        GroupModel.updateOne({ _id: group.id }, group, (e: any, r: any) => {
          e ? rej(e) : res(r.n)
        })
      }))
  },
  delete(id: string) {
    return Observable.fromPromise(GroupModel.remove({ _id: id }))
      .map(() => ({ num: 1 }))
  }
}