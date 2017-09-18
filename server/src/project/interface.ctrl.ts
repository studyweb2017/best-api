import { InterfaceModel } from './interface.md'
import { InterfaceLogInterface, InterfaceLogModel } from './interfaceArchive.md'
import { ProjectModel } from './project.md'
import { MemberInterface, MemberModel } from '../team/member.md'
import { Observable } from 'rxjs/Rx'
import { mongoose } from '../util/db'
import { rename } from '../util/fun'
import  * as _  from 'lodash'

export interface version extends InterfaceLogInterface {
  version: string
  updateTime: string
  updateMember: string
  editorId: string
}

export const interfaceCtrl = {
  /**
   * 查询项目下的接口列表
   * @param pid 项目id
   */
  get(pid: string) {
    return Observable.fromPromise(ProjectModel.aggregate()
      .lookup({
        from: InterfaceModel.collection.collectionName,
        localField: '_id',
        foreignField: 'pid',
        as: 'apiList'
      })
      .append({
        $addFields: {
          id: '$_id',
          total: { $size: '$apiList' }
        }
      })
      .exec())
      .map((list: any) => {
        let result = list.pop() || {}
        result.apiList = rename(result.apiList, [['_id', 'id']])
        return result
      })
  },
  /**
   * 查询某个接口
   * @param pid 项目id
   * @param iid 接口id
   */
  getById(pid: string, iid: string) {
    return Observable.fromPromise(InterfaceModel.aggregate()
      .match({ _id: mongoose.Types.ObjectId(iid) })
      .append({
        $addFields: {
          id: '$_id',
          currentVersion: '$version',
          latestVersion: '$version',
        }
      })
      .exec())
      .map((x: any) => x.pop())
  },
  /**
   * 查询指定版本接口信息
   * @param iid 接口id
   * @param version 接口版本
   */
  getHistoryById(iid: string, version: string) {
    return Observable.fromPromise(InterfaceLogModel.aggregate()
      .match({ iid: mongoose.Types.ObjectId(iid), version })
      .append({
        $addFields: {
          id: '$_id',
          currentVersion: '$version' 
        }
      })
      .exec())
      .map((res:any) => res.pop())
  },
  /**
   * 查询接口历史版本列表
   * @param iid 接口id
   */
  getVersionById(iid: string) {
    return Observable.fromPromise(InterfaceLogModel.aggregate()
      .match({ iid: mongoose.Types.ObjectId(iid) })
      .lookup({
        from: MemberModel.collection.collectionName,
        localField: 'editorId',
        foreignField: '_id',
        as: 'm'
      })
      .unwind('$m')
      .project({
        version: 1,
        updateTime: { $dateToString: { format: '%Y-%m-%d %H:%M:%S', date: '$updateTime' } },
        updateMember: '$m.name'
      })
      .exec())
      .map((versionList: any) => ({ versionList }))
  },
  /**
   * 新增接口
   * @param pid 项目id
   * @param ifc 接口数据
   */
  post(pid: string, ifc: any) {
    ifc.pid = mongoose.Types.ObjectId(pid)
    return Observable.fromPromise(new InterfaceModel(ifc).save())
  },
  /**
   * 修改接口
   * @param pid 项目id
   * @param iid 接口id
   * @param ifc 接口数据
   */
  put(pid: string, iid: string, ifc: any) {
    return Observable.fromPromise(InterfaceModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(iid) }, {$set:ifc}).exec())
      .switchMap((doc: any) => {
        if(doc) {
          let log = doc.toObject()
          log.iid = iid
          delete log._id
          return Observable.fromPromise(new InterfaceLogModel(log).save()) 
        } else {
          return Observable.throw('更新接口失败')
        }
      })
  },
  /**
   * 删除一个接口
   * @param pid 项目id
   * @param iid 接口id
   */
  delete(pid: string, iid: string) {
    return Observable.fromPromise(InterfaceModel.remove({ _id: mongoose.Types.ObjectId(iid) }).exec())
      .do(() => InterfaceLogModel.remove({ iid: mongoose.Types.ObjectId(iid) }).exec())
      .do(() => ProjectModel.findByIdAndUpdate(mongoose.Types.ObjectId(pid), {
        $pull: {
          testInterfaceList: mongoose.Types.ObjectId(iid)
        }
      }))
  }
}