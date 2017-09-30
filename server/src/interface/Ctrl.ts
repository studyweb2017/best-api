import { InterfaceModel, InterfaceHistoryModel } from './model'
import { ProjectModel, role } from '../project/model'
import { MemberInterface, MemberModel } from '../member/model'
import { Observable } from 'rxjs/Rx'
import BaseCtrl from '../util/Base.ctrl'
import { mongoose } from '../util/db'

export default class InterfaceCtrl extends BaseCtrl {
  /**
   * 查询项目下的接口列表
   * @param pid 项目id
   * @param uid 用户id
   * @param isAdmin 管理员权限
   */
   get(pid: string, uid: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, pid, uid)
      .switchMap((authorized: boolean) => {
        return Observable.fromPromise(ProjectModel.aggregate()
          .match({ _id: mongoose.Types.ObjectId(pid) })
          .lookup({
            from: InterfaceModel.collection.collectionName,
            localField: '_id',
            foreignField: 'pid',
            as: 'list'
          })
          .project({
            _id: 0,
            id: '$_id',
            name: 1,
            total: { $size: '$list' },
            apiList: {
              $map: {
                input: '$list',
                as: 'i',
                in: {
                  id: '$$i._id',
                  name: '$$i.name',
                  module: '$$i.module',
                  version: '$$i.version',
                  method: '$$i.method',
                  url: '$$i.url',
                  isTest: '$$i.isTest',
                  testStatusId: '$$i.testStatusId',
                  testStatusMsg: '$$i.testStatusMsg'
                }
              }
            }
          })
          .exec())
          .map((list: any) => list.pop() || {})
      })
  }
  /**
   * 查询某个接口
   * @param pid 项目id
   * @param iid 接口id
   * @param uid 用户id
   * @param isAdmin 管理员权限
   */
   getById(pid: string, iid: string, uid: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, pid, uid)
      .switchMap((authorized: boolean) => {
        return Observable.fromPromise(InterfaceModel.aggregate()
          .match({ _id: mongoose.Types.ObjectId(iid) })
          .append({
            $addFields: {
              id: '$_id'
            }
          })
          .project({ _id: 0 })
          .exec())
          .map((x: any) => x.pop())
      })
  }
  /**
   * 查询指定版本接口信息
   * @param iid 接口id
   * @param version 接口版本
   * @param uid 用户id
   * @param isAdmin 管理员权限
   */
   getHistoryById(pid: string, iid: string, version: string, uid: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, pid, uid)
      .switchMap((authorized: boolean) => {
        return Observable.fromPromise(InterfaceHistoryModel.aggregate()
          .match({ iid: mongoose.Types.ObjectId(iid), version })
          .append({
            $addFields: {
              id: '$_id',
              errConfig: '$exceptionList',
            }
          })
          .project({ _id: 0 })
          .exec())
          .map((res: any) => res.pop())
      })
  }
  /**
   * 查询接口历史版本列表
   * @param iid 接口id
   * @param uid 用户id
   * @param isAdmin 管理员权限
   */
   getVersionById(pid: string, iid: string, uid: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, pid, uid)
      .switchMap((authorized: boolean) => {
        return Observable.fromPromise(InterfaceHistoryModel.aggregate()
          .match({ iid: mongoose.Types.ObjectId(iid) })
          .project({
            version: 1,
            updateTime: { $dateToString: { format: '%Y-%m-%d %H:%M:%S', date: '$updateTime' } },
            updateMember: '$editor'
          })
          .exec())
          .map((versionList: any) => ({ versionList }))
      })
  }
  /**
   * 获取接口模块
   * @param pid 项目id
   * @param uid 用户id
   * @param isAdmin 管理员权限
   */
   getModule(pid: string, uid: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, pid, uid)
      .switchMap(() => {
        return Observable.fromPromise(InterfaceModel.aggregate()
          .match({ pid: mongoose.Types.ObjectId(pid) })
          .group({
            _id: null,
            moduleList: {
              $push: '$module'
            }
          })
          .project({
            _id: 0,
            moduleList: 1
          })
          .exec())
          .map((res: any) => res.pop())
      })
  }
  /**
   * 新增接口
   * @param pid 项目id
   * @param ifce接口数据
   */
   post(pid: string, ifc: any, uid: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, pid, uid, [role.developer, role.master])
      .switchMap(() => {
        ifc.pid = pid
        return Observable.fromPromise(InterfaceModel.create(ifc))
        .map((doc:any) => ({id: doc.id}))
      })
  }
  /**
   * 修改接口
   * @param pid 项目id
   * @param iid 接口id
   * @param ifc 接口数据
   * @param uid 用户id
   * @param isAdmin 管理员权限
   */
   put(pid: string, iid: string, ifc: any, uid: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, pid, uid, [role.developer, role.master])
      .switchMap(() => {
        return Observable.fromPromise(InterfaceModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(iid) }, { $set: ifc }).exec())
          .switchMap((doc: any) => {
            if (doc) {
              let log = doc.toObject()
              log.iid = iid
              delete log._id
              delete log.version
              return Observable.fromPromise(InterfaceHistoryModel.create(log))
            } else {
              return Observable.throw('更新接口失败')
            }
          })
      })
  }
  /**
   * 删除一个接口
   * @param pid 项目id
   * @param iid 接口id
   * @param uid 用户id
   * @param isAdmin 管理员权限
   */
   delete(pid: string, iid: string, uid: string, isAdmin: boolean) {
    return this.verifyAuth(isAdmin, pid, uid, [role.developer, role.master])
      .switchMap(() => {
        return Observable.fromPromise(InterfaceModel.remove({ _id: mongoose.Types.ObjectId(iid) }).exec())
          .do(() => InterfaceHistoryModel.remove({ iid: mongoose.Types.ObjectId(iid) }).exec())
      })
  }
}