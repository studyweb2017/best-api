import { GroupModel, GroupInterface } from './group.md'
import { Observable } from 'rxjs/Rx'
import { MemberModel } from './member.md'

export const groupCtrl = {
  get() {
    return Observable.fromPromise(GroupModel.aggregate()
      .lookup({
        from: MemberModel.collection.collectionName,
        localField: 'memberList',
        foreignField: '_id',
        as: 'members'
      })
      .project({
        _id: 0,
        id: '$_id',
        name: 1,
        'members.id': '$$CURRENT._id',
        'members.name': 1
      })
      .exec())
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
    return Observable.fromPromise(GroupModel.updateOne({ _id: group.id }, group).exec())
      .switchMap((res: any) => res.n > 0 ? Observable.of({ num: res.n }) : Observable.throw('更新小组失败'))
  },
  delete(id: string) {
    return Observable.fromPromise(GroupModel.remove({ _id: id }))
      .map(() => ({ num: 1 }))
  }
}