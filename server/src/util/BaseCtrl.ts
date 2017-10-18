import { ProjectModel, role } from '../project/model'
import { Observable } from 'rxjs/Rx'
import { mongoose } from './db'

export default class BaseCtrl {
  /**
   * 数据模型
   */
  protected  objectId(id: string) {
    if (id) {
      return id.length === 24 ? mongoose.Types.ObjectId(id) : mongoose.Types.ObjectId()
    } else {
      return id
    }
  }
  /**
   * 根据项目id和用户id查询对应角色
   * @param pid 项目id
   * @param uid 用户id
   */
  protected  getProjectRole(pid: string, uid: string): Observable<string> {
    return Observable.from(ProjectModel.aggregate()
      .match({ _id: mongoose.Types.ObjectId(pid) })
      .project({
        m: {
          $map: {
            input: '$masterList',
            as: 'ml',
            in: { id: '$$ml', role: 'master' }
          }
        },
        d: {
          $map: {
            input: '$developerList',
            as: 'dl',
            in: { id: '$$dl', role: 'developer' }
          }
        },
        g: {
          $map: {
            input: '$guestList',
            as: 'gl',
            in: { id: '$$gl', role: 'guest' }
          }
        }
      })
      .project({ members: { $concatArrays: ['$m', '$d', '$g'] } })
      .exec())
      .map((projectList: any = []) => {
        let project = projectList.pop() || { members: [] }
        let member = project.members.filter((x: { id: string, role: string }) => x.id.toString() == uid.toString()).pop() || {}
        return member.role
      })
  }
  /**
   * 根据项目id和用户id，查询是否属于该角色是否具有对应权限
   * @param pid 项目id
   * @param uid 用户id
   * @param roleList 角色列表
   */
  protected  verifyProjectRole(pid: string, uid: string, roleList?: role[]) {
    return this.getProjectRole(pid, uid)
      .map((r: role) => r ? (roleList || [r]).includes(r) : false)
  }
  /**
   * 查询用户是否具有权限
   * @param isAdmin 是否管理员
   * @param pid 项目id
   * @param uid 用户id
   * @param roleList 角色列表
   */
  protected  verifyAuth(isAdmin: boolean, pid: string, uid: string, roleList?: role[]) {
    return Observable.from(isAdmin ? Observable.of(true) : this.verifyProjectRole(pid, uid, roleList))
      .switchMap((authorized:boolean) => authorized ? Observable.of(true): Observable.throw({status: 403, message: '访问权限不够'}))
  }
}
