class QuestionBankDetail {
  constructor() {

  }
  getQuestionBankDetail(id) {
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name: 'question',
        data: {
          action: 'getQuestionBankDetail',
          id
        },
        success: res => {
          resolve(res.result)
          // return res.result
        },
        fail: err => {
          reject(err)
          console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
        }
      })
    })
  }
  //开始做题
  startWork(id) {
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name: 'question',
        data: {
          action: 'startWork',
          id //题库id
        },
        success: res => {
          resolve(res.result)
          // return res.result
        },
        fail: err => {
          reject(err)
          console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
        }
      })
    })

  }
}

export default QuestionBankDetail