class AnswerResult {
  constructor() {

  }
  getAnswerResult(bankId) {
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name: 'question',
        data: {
          action: 'getAnswerResult',
          bankId
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

export default AnswerResult