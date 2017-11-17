import BaseCtrl from '../util/BaseCtrl'
import { MessageModel } from './model'

export default class MessageCtrl extends BaseCtrl {
  protected model = MessageModel
  /**
   * 通过用户id获取消息
   * @param uid 用户id
   * @param page 当前页
   * @param size 分页大小，最大50
   */
  get(uid: string, page: number = 1, size: number = 10) {
    const $limit = Math.min(size, 50)
    let total = 0
    let match = {
      $match: {
        readableUserList: {
          $in: [uid]
        }
      }
    }
    return this.aggregate([match, {
      $count: 'total'
    }])
      .switchMap((t: any) => {
        total = t[0] ? t[0].total : 0
        return this.aggregate([match, {
        $addFields: {
          id: '$_id',
          isRead: {
            $in: [uid, '$readUserList']
          },
          datetime: {
            $dateToString: {
              format: '%Y-%m-%d %H:%M:%S',
              date: '$createdTime'
            }
          }
        }
      }, {
          $sort: { createdTime: -1 }
        },
        { $limit },
        { $skip: page }
      ])
    })
    .map((list: any) => {
      return { list, total, page }
    })
  }
  put(uid: string, msgId: string[]) {
    return this.update({
      _id: { $in: this.objectId(msgId) }
    }, {
        $addToSet: {
          readUserList: uid
        }
      })
  }
}