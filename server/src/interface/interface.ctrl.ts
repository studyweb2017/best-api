import { InterfaceInterface, InterfaceModel } from './interface.md'
import { InterfaceLogInterface, InterfaceLogModel } from './interfaceArchive.md'
import { MemberInterface, MemberModel } from '../member/member.md'
import { Observable } from 'rxjs/Rx'

export interface version extends InterfaceLogInterface {
  version: string
  updateTime: string
  updateMember: string
  editorId: string
}

let MemberMap = Observable.fromPromise(MemberModel.find({}, { _id: 1, nickName: 1 }))
  .map((x: MemberInterface[]) => {
    let map: any = {}
    x.forEach((item: MemberInterface) => {
      map[item.id] = item.nickName
    });
    return map
  })

export const interfaceCtrl = {
  getVersionById(pid: string, iid: string) {
    let versionList = Observable.fromPromise(InterfaceLogModel.find({ pid, iid }, { version: 1, updateTime: 1, creatorId: 1 }))
      .switchMap((x: InterfaceLogInterface[]) => Observable.of(x))
    return versionList.combineLatest(MemberMap, (version: version, map: any) => {
      version.updateMember = map[version.editorId].nickName
      delete version.editorId
      return version
    }).toArray()
      .map((x: any) => ({ versionList: x }))
  },
  post(ifc: InterfaceInterface) {
    return Observable.fromPromise((new InterfaceModel(ifc)).save())
  },
  del(id: string) {
    return Observable.fromPromise(InterfaceModel.remove({_id: id}))
      .switchMap(() => Observable.fromPromise(InterfaceLogModel.remove({iid: id})))
  }
}