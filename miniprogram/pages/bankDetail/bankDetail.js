// miniprogram/pages/bankDetail/bankDetail.js
import bankDetail from './bankDetailClass'
const bankDetailDB = new bankDetail()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  //获取题库详情
  async getQuestionBankDetail(id) {
    let res = await bankDetailDB.getQuestionBankDetail(id)
    this.setData({ bankDetail: res.data })
  },
  async restart() { //重新做题
    let res = await bankDetailDB.restart(this.data.bankDetail._id) //先重新生成用户对应试卷
    wx.navigateTo({
      url: `/pages/answerPage/answerPage?bankId=${this.data.bankDetail._id}`,
    })
  },
  start() { //开始做题
    wx.navigateTo({
      url: `/pages/answerPage/answerPage?bankId=${this.data.bankDetail._id}`,
    });
  },
  //开始做题
  // async start(e) {
  //   console.log(e);
  //   const id = e.currentTarget.dataset.id
  //   let res = await bankDetailDB.startWork(id)
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getQuestionBankDetail(this.data.id)
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