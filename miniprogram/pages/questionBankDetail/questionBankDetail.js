// miniprogram/pages/questionBankDetail/questionBankDetail.js
import questionBankDetail from './questionBankDetailClass'
const questionBankDetailDB = new questionBankDetail()
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
    this.getQuestionBankDetail(options.id)
  },
  //获取题库详情
  async getQuestionBankDetail(id) {
    let res = await questionBankDetailDB.getQuestionBankDetail(id)
    this.setData({ bankDetail: res.data })
    console.log(res);
  },
  //开始做题
  async start(e) {
    console.log(e);
    const id = e.currentTarget.dataset.id
    let res = await questionBankDetailDB.startWork(id)
    console.log('res',res);
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