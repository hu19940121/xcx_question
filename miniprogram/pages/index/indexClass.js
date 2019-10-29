class Index {
  constructor() {

  }
  getQuestionBank() {
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name: 'question',
        data: {
          action: 'getQuestionBank'
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

export default Index