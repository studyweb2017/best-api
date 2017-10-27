import { InterfaceModel, InterfaceHistoryModel } from './model'
import { ProjectModel, role } from '../project/model'
import { MemberInterface, MemberModel } from '../member/model'
import { Observable } from 'rxjs/Rx'
import BaseCtrl from '../util/BaseCtrl'
import { mongoose } from '../util/db'
import ProjectCtrl from '../project/ProjectCtrl'
import engine from '../thirdparty/ThirdPartyEngine'

let projectCtrl = new ProjectCtrl()

export default class InterfaceCtrl extends BaseCtrl {
  module = '接口'
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
              id: '$_id',
              'request.dataList': '$request.paramList',
              'response.dataList': '$response.paramList',
              'request.paramList': '$request.urlParams'
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
              'request.dataList': '$request.paramList',
              'response.dataList': '$response.paramList',
              'request.paramList': '$request.urlParams'
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
        return Observable.fromPromise(InterfaceModel.find({ pid: mongoose.Types.ObjectId(pid) })
          .distinct('module')
          .exec())
          .map((moduleList) => {
            return { moduleList }
          })
      })
  }
  /**
   * 新增接口
   * @param pid 项目id
   * @param ifce接口数据
   */
  post(pid: string, ifc: any, uid: string, isAdmin: boolean, uname: string) {
    return this.verifyAuth(isAdmin, pid, uid, [role.developer, role.master])
      .switchMap(() => {
        ifc.pid = pid
        ifc.request.urlParams = ifc.request.paramList
        ifc.request.paramList = ifc.request.dataList
        ifc.response.paramList = ifc.response.dataList
        return Observable.fromPromise(InterfaceModel.create(ifc))
          .do((ifc: any) => {
            projectCtrl.getMemberList(pid)
            .subscribe((memberList:any) => {
              engine.notify(engine.c, ifc)
              this.newCreateMessage(ifc.id, ifc.name, uname, memberList, ifc.url + ' ' + ifc.method) 
            })
          })
          .map((doc: any) => ({ id: doc.id }))
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
  put(pid: string, iid: string, ifc: any, uid: string, isAdmin: boolean, uname: string) {
    ifc.request.urlParams = ifc.request.paramList
    ifc.request.paramList = ifc.request.dataList
    ifc.response.paramList = ifc.response.dataList
    return this.verifyAuth(isAdmin, pid, uid, [role.developer, role.master])
      .switchMap(() => {
        return Observable.fromPromise(InterfaceModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(iid) }, { $set: ifc }).exec())
          .switchMap((doc: any) => {
            if (doc) {
              let log = doc.toObject()
              log.iid = this.objectId(iid)
              delete log._id
              delete log.version
              projectCtrl.getMemberList(pid)
              .subscribe((memberList:any) => {
                engine.notify(engine.u, ifc)
                this.newUpdateMessage(iid, ifc.name, uname, memberList, ifc.url + ' ' + ifc.method)
              })
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
  delete(pid: string, iid: string, uid: string, isAdmin: boolean, uname: string) {
    return this.verifyAuth(isAdmin, pid, uid, [role.developer, role.master])
      .switchMap(() => {
        return Observable.fromPromise(InterfaceModel.findOneAndRemove({ _id: mongoose.Types.ObjectId(iid) }).exec())
          .do((doc: any) => {
            projectCtrl.getMemberList(pid)
            .subscribe((memberList:any) => {
              engine.notify(engine.d, doc)
              this.newDeleteMessage(iid, doc.name, uname, memberList, doc.url + ' ' + doc.method)
            })
            InterfaceHistoryModel.remove({ iid: mongoose.Types.ObjectId(iid) }).exec()
          })
      })
  }
}