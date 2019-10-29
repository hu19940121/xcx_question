// miniprogram/pages/answerPage/answerpage.js
import answerPage from './answerPageClass'
const answerPageDB = new answerPage()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    letter: {
      0: 'A',
      1: 'B',
      2: 'C',
      3: 'D',
      4: 'E',
    },
    currentQuestionIndex: 0,
    questionList: [],
    currentQuestion: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bankId: options.bankId
    })
    this.getUserQuestionList(options.bankId)
  },
  radioChange(e) {
    let chooseQuestionId = e.detail.value
    let { currentQuestion } = this.data
    currentQuestion.isDone = true //说明已经做了
    currentQuestion.options.map(option=>{
      option.isCheck = false
      if (option._id === chooseQuestionId) {
        option.isCheck = true
      }
    })
  },
  //提交更新答题信息
  async submit() {
    await this.updateUserQuestion()
    this.next()
  },
  //切换到下一题
  next() {
    let currentQuestionIndex = ++ this.data.currentQuestionIndex
    let currentQuestion = this.data.questionList[currentQuestionIndex]   
    this.setData({
      currentQuestionIndex,
      currentQuestion,
    })
  },
  //切换到上一题
  prev() {
    let currentQuestionIndex = -- this.data.currentQuestionIndex
    let currentQuestion = this.data.questionList[currentQuestionIndex]   
    this.setData({
      currentQuestionIndex,
      currentQuestion,
    }) 
  },
  //根据题库id获取当前用户已生成的题目列表
  async getUserQuestionList(bankId) {
    const { currentQuestionIndex } = this.data
    const res = await answerPageDB.getUserQuestionList(bankId)
    let list = res.data
    this.setData({
      questionList: this.initList(list),
      currentQuestion: res.data[currentQuestionIndex]
    })    
  },
  //更新正在答的题的答案
  async updateUserQuestion() {
    const { currentQuestion } = this.data
    if ( currentQuestion.question_type === 1 ) { //单选题
      let option = currentQuestion.options.find((option)=>option.isCheck === true)   //找到用户回答的答案
      option && await answerPageDB.updateUserQuestion({ 
        _id: currentQuestion._id, 
        question_id: currentQuestion.question_id, 
        reply: option.preanswer 
      }) //更新到对应用户的试卷
    }   
  },
  //初始化试卷（若返回的列表中reply有值 则自动匹配上答案）
  initList(list) {
    list.forEach(e => {
      switch (e.question_type) {
        case 1: //选择题
          if (e.reply) { //如果有值
            e.isDone = true //说明已经做过了
            e.options.map((option)=>{
              if (option.preanswer == e.reply) {
                option.isCheck = true
              }
            })
          }
          break;
        default:
          break;
      }
    });
    return list
  },
  //交卷
  async handPaper() {
    //先检查有几道题还没有做
    let notDidSum = this.check()
    if (notDidSum === 0) {
      await this.updateUserQuestion()
      await answerPageDB.handPaper(this.data.bankId)
      wx.redirectTo({
        url: `/pages/answerResult/answerResult?bankId=${this.data.bankId}`,
      })
      //TODO:下面是交卷
    } else {
      let that = this
      wx.showModal({
        title: '提示',
        content: `您还有${notDidSum}道题没有做，确认交卷吗？`,
        async success (res) {
          if (res.confirm) {
            console.log('queding');
            
            await answerPageDB.handPaper(that.data.bankId)
            wx.redirectTo({
              url: `/pages/answerResult/answerResult?bankId=${that.data.bankId}`,
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //检查还有几道题没做
  check() {
    let { questionList } = this.data
    let sum = 0
    questionList.forEach(element => {
      if (!element.isDone) {
        sum = sum + 1
      }  
    });
    return sum
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})