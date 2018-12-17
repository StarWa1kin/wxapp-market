// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:'2U',
    avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erGh2JQt8g9L8EBowDpPMsLEwmg9bnRiayPyZwdfdHjiafdozKZhcwDJHLHRFXsWtyqkogjqUMlelNA/132"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  /*自定义函数*/
  enterAddress(){
    wx.navigateTo({
      url: '../addressManage/addressManage',
    })
  },
  enterContact(){
    wx.navigateTo({
      url: '',
    })
  },
  enterFeedback(){
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  enterSetting(){
    wx.navigateTo({
      url: '',
    })
  }
})