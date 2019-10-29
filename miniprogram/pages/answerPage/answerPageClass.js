class AnswerPage {
  constructor() {

  }
  getUserQuestionList(bankId) {
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name: 'question',
        data: {
          action: 'getUserQuestionList',
          bankId
        },
        success: res => {
          resolve(res.result)
        },
        fail: err => {
          reject(err)
          console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
        }
      })
    })
  }
  updateUserQuestion({ _id,reply,question_id }) {
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name: 'question',
        data: {
          action: 'updateUserQuestion',
          _id,
          reply,
          question_id
        },
        success: res => {
          resolve(res.result)
        },
        fail: err => {
          reject(err)
          console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
        }
      })
    })
  }
  //交卷打分
  handPaper(bankId) {
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name: 'question',
        data: {
          action: 'handPaper',
          bankId
        },
        success: res => {
          resolve(res.result)
        },
        fail: err => {
          reject(err)
          console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
        }
      })
    })
  }
}

export default AnswerPage