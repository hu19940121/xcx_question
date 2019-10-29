// miniprogram/pages/questionBank/questionBank.js
import questionBank from './questionBankClass'
const questionBankDB = new questionBank()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const res = await questionBankDB.getQuestionBank()
    console.log(res.data);
    this.setData({
      list: res.data
    })
    
  },
  linkToBankDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/questionBankDetail/questionBankDetail?id=${id}`,
    })
  },
  // async getQuestions(e) {
  //   console.log(e);
  //   const id = e.currentTarget.dataset.id
  //   const res = await questionBankDB.getQuestions(id)
  //   console.log('列表',res);
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