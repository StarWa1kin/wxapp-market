// pages/submitOrder/submitOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioChoose1:true,
    radioChoose2:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //支付方式选择框
  radioChange: function(e) {
    if (e.detail.value=="余额"){
      this.setData({
        radioChoose2: false,
        radioChoose1:true
      })
    }
    if (e.detail.value == "微信") {
      this.setData({
        radioChoose1: false,
        radioChoose2: true,
      })
    }
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  }
})