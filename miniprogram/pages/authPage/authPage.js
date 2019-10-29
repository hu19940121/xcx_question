import { getPageUrlWithArgs } from '../../util/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查看是否已经授权过
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.cloudLogin(res.userInfo)
            }
          })
        }
      }
    })
  },
  cloudLogin(userInfo) {
    wx.cloud.callFunction({
      name: 'login',
      data: { userInfo },
      success: res => {
        console.log('res',res)        
        wx.setStorageSync('userInfo', res.result.userInfo)
        console.log('getCurrentPages',getCurrentPages());
        
        const queuePages = getCurrentPages().filter( page => page.route !== "pages/authPage/authPage" )
        if (queuePages.length > 0 ) { 
          const url = getPageUrlWithArgs(queuePages[0])
          wx.reLaunch({ url })
        } else {
          wx.switchTab({ url: '../index/index' })
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      this.cloudLogin(e.detail.userInfo)
    }
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