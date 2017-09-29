import { InterfaceModel } from './interface.md'
import { InterfaceLogInterface, InterfaceLogModel } from './interfaceArchive.md'
import { ProjectModel } from './project.md'
import { MemberInterface, MemberModel } from '../team/member.md'
import { Observable } from 'rxjs/Rx'
import BaseCtrl from '../util/Base.ctrl'
import { mongoose } from '../util/db'

export default class InterfaceCtrl extends BaseCtrl {
  /**
   * 查询项目下的接口列表
   * @param pid 项目id
   */
  static get(pid: string) {
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
  }
  /**
   * 查询某个接口
   * @param pid 项目id
   * @param iid 接口id
   */
  static getById(pid: string, iid: string) {
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
  }
  /**
   * 查询指定版本接口信息
   * @param iid 接口id
   * @param version 接口版本
   */
  static getHistoryById(iid: string, version: string) {
    return Observable.fromPromise(InterfaceLogModel.aggregate()
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
  }
  /**
   * 查询接口历史版本列表
   * @param iid 接口id
   */
  static getVersionById(iid: string) {
    return Observable.fromPromise(InterfaceLogModel.aggregate()
      .match({ iid: mongoose.Types.ObjectId(iid) })
      .project({
        version: 1,
        updateTime: { $dateToString: { format: '%Y-%m-%d %H:%M:%S', date: '$updateTime' } },
        updateMember: '$editor'
      })
      .exec())
      .map((versionList: any) => ({ versionList }))
  }
  /**
   * 获取接口模块
   * @param pid 项目id
   */
  static getModule(pid: string) {
    return Observable.fromPromise(InterfaceModel.aggregate()
      .match({pid: mongoose.Types.ObjectId(pid)})
      .group({
        _id: null,
        moduleList: {
          $push: '$$CURRENT.module'
        }
      })
      .project({
        _id: 0,
        moduleList: 1
      })
      .exec())
      .map((res: any) => res.pop())
  }
  /**
   * 新增接口
   * @param pid 项目id
   * @param ifce接口数据
   */
  static post(pid: string, ifc: any) {
    ifc.pid = pid
    return Observable.fromPromise(InterfaceModel.create(ifc))
  }
  /**
   * 修改接口
   * @param pid 项目id
   * @param iid 接口id
   * @param ifc 接口数据
   */
  static put(pid: string, iid: string, ifc: any) {
    return Observable.fromPromise(InterfaceModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(iid) }, { $set: ifc }).exec())
      .switchMap((doc: any) => {
        if (doc) {
          let log = doc.toObject()
          log.iid = iid
          delete log._id
          return Observable.fromPromise(InterfaceLogModel.create(log))
        } else {
          return Observable.throw('更新接口失败')
        }
      })
  }
  /**
   * 删除一个接口
   * @param pid 项目id
   * @param iid 接口id
   */
  static delete(pid: string, iid: string) {
    return Observable.fromPromise(InterfaceModel.remove({ _id: mongoose.Types.ObjectId(iid) }).exec())
      .do(() => InterfaceLogModel.remove({ iid: mongoose.Types.ObjectId(iid) }).exec())
  }
}