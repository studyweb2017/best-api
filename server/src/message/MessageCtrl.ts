import BaseCtrl from '../util/BaseCtrl'
import { MessageModel } from './model'

export default class MessageCtrl extends BaseCtrl {
  protected model = MessageModel
  /**
   * 通过用户id获取消息
   * @param uid 用户id
   */
  get(uid: string) {
    return this.aggregate([{
      $match: {
        readableUserList: {
          $in: [uid]
        }
      }
    }, {
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
    }])
      .map((list: any) => {
        return { list }
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