// components/bankCard/bankCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bankInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    linkToBankDetail(e) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/bankDetail/bankDetail?id=${id}`
      });
      // console.log(e);
      
    }
  }
})
