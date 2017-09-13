import { InterfaceInterface } from './interface.md'
import { ProjectModel } from './project.md'
import { InterfaceLogInterface, InterfaceLogModel } from './interfaceArchive.md'
import { MemberInterface, MemberModel } from '../team/member.md'
import { Observable } from 'rxjs/Rx'
import { mongoose } from '../util/db'

export interface version extends InterfaceLogInterface {
  version: string
  updateTime: string
  updateMember: string
  editorId: string
}

let MemberMap = Observable.fromPromise(MemberModel.find({}, { _id: 1, name: 1 }))
  .map((x: MemberInterface[]) => {
    let map: any = {}
    x.forEach((item: MemberInterface) => {
      map[item.id] = item.name
    });
    return map
  })

export const interfaceCtrl = {
  /**
   * 查询项目下的接口列表
   * @param pid 项目id
   */
  get(pid: string) {
    return Observable.fromPromise(ProjectModel.aggregate()
      .match({ _id: mongoose.Types.ObjectId(pid) })
      .unwind('$interfaceList')
      .sort({ 'interfaceList.url': -1 })
      .project({
        name: 1,
        'interfaceList.id': '$interfaceList._id',
        'interfaceList.name': 1,
        'interfaceList.version': 1,
        'interfaceList.method': 1,
        'interfaceList.url': 1
      })
      .group({
        _id: '$_id',
        name: { $first: '$name' },
        apiList: { $push: '$interfaceList' }
      })
      .exec())
      .map((res:any) => res.pop())
  },
  /**
   * 查询某个接口
   * @param pid 项目id
   * @param iid 接口id
   */
  getById(pid: string, iid: string) {
    return Observable.fromPromise(ProjectModel.aggregate()
      .match({ _id: mongoose.Types.ObjectId(pid) })
      .project({
        interfaceList: {
          $filter: {
            input: '$interfaceList._id',
            as: 'a',
            cond: { $eq: ['$$a._id', mongoose.Types.ObjectId(iid)] }
          }
        }
      })
      .unwind('$ifc')
      .exec())
  },
  /**
   * 查询指定版本接口信息1
   * @param iid 接口id
   * @param version 接口版本
   */
  getHistoryById(iid: string, version: string) {
    return Observable.fromPromise(InterfaceLogModel.aggregate()
      .match({ iid: mongoose.Types.ObjectId(iid), version })
      .lookup({
        from: ProjectModel.collection.collectionName,
        localField: 'pid',
        foreignField: '_id',
        as: 'project'
      })
      .unwind('$project', '$project.interfaceList')
      .match({ 'project.interfaceList._id': mongoose.Types.ObjectId(iid) })
      .project({
        _id: 0,
        id: '$_id',
        name: 1,
        currentVersion: '$version',
        latestVersion: '$project.interfaceList.version'
      })
      .exec())
  },
  /**
   * 查询接口历史版本列表
   * @param iid 接口id
   */
  getVersionById(iid: string) {
    return Observable.fromPromise(InterfaceLogModel.aggregate()
      .match({ iid: mongoose.Types.Object(iid) })
      .lookup({
        from: MemberModel.collection.collectionName,
        localField: 'editorId',
        foreignField: '_id',
        as: 'm'
      })
      .unwind('$m')
      .project({
        _id: 0,
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
  post(pid: string, ifc: InterfaceInterface) {
    const id = mongoose.Types.ObjectId()
    ifc._id = id
    return Observable.fromPromise(new Promise((res, rej) => ProjectModel.update({
      _id: mongoose.Types.ObjectId(pid),
    }, {
        $push: {
          'interfaceList': ifc
        }
      }, (e: any, doc: any) => e ? rej(e) : res({ id }))))
  },
  /**
   * 修改接口
   * @param pid 项目id
   * @param iid 接口id
   * @param ifc 接口数据
   */
  put(pid: string, iid: string, ifc: InterfaceInterface) {
    return Observable.fromPromise(new Promise((res, rej) => ProjectModel.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(pid),
      interfaceList: {
        $elementMatch: {
          _id: mongoose.Types.ObjectId(iid)
        }
      }
    }, {
        $set: {
          'interfaceList.$': ifc
        }
      }, (e: any, doc: any) => {
        if (e) {
          rej(e)
        } else {
          // 接口归档
          let ifc = doc.interfaceList.filter((x: any) => x._id == iid).pop()
          ifc.iid = iid
          ifc.pid = pid
          new InterfaceLogModel(ifc).save((e: any, r: any) => e ? rej(e) : res(r))
        }
      })))
  },
  /**
   * 删除一个接口
   * @param pid 项目id
   * @param iid 接口id
   */
  delete(pid: string, iid: string) {
    return Observable.fromPromise(new Promise((res, rej) => ProjectModel.update({
      _id: mongoose.Types.ObjectId(pid)
    }, {
        $pull: {
          'interfaceList.$._id': mongoose.Types.ObjectId(iid)
        }
      }, (e: any) => e ? rej(e) : res())))
      .do(() => Observable.fromPromise(InterfaceLogModel.remove({ iid: mongoose.Types.ObjectId(iid) })))
  }
}