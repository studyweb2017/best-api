import { InterfaceInterface, InterfaceModel } from './interface.md'
import { InterfaceLogInterface, InterfaceLogModel } from './interfaceArchive.md'
import { ProjectModel } from './project.md'
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
    return Observable.fromPromise(InterfaceModel.aggregate()
      .facet({
        apiList: [
          { $match: { pid: mongoose.Types.ObjectId(pid) } },
          { $sort: { url: -1 } },
          {
            $project: {
              _id: 0,
              id: '$_id',
              name: 1,
              version: 1,
              method: 1,
              url: 1,
              pid: 1
            }
          }
        ],
        project: [
          { $match: { pid: mongoose.Types.ObjectId(pid) } },
          { $limit: 1 },
          { $lookup: { from: 'projects', localField: 'pid', foreignField: '_id', as: 'p' } },
          { $unwind: '$p' },
          { $project: { _id: 0, id: '$p._id', name: '$p.name' } }
        ]
      })
      .unwind('$project')
      .project({
        id: '$project.id',
        name: '$project.name',
        apiList: 1
      })
      .exec())
      .map((res: any) => res.pop())
  },
  /**
   * 查询某个接口
   * @param pid 项目id
   * @param iid 接口id
   */
  getById(pid: string, iid: string) {
    return Observable.fromPromise(InterfaceModel.aggregate()
      .match({ _id: mongoose.Types.ObjectId(iid) })
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
    ifc.pid = mongoose.Types.ObjectId(pid)
    return Observable.fromPromise(new InterfaceModel(ifc).save())
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
    return Observable.fromPromise(InterfaceModel.remove({ _id: mongoose.Types.ObjectId(iid) }).exec())
      .do(() => InterfaceLogModel.remove({ iid: mongoose.Types.ObjectId(iid) }).exec())
      .do(() => ProjectModel.findByIdAndUpdate(mongoose.Types.Object(pid), {
        $pull: {
          testInterfaceList: mongoose.Types.ObjectId(iid)
        }
      }))
  }
}