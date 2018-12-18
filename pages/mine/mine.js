const http = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],//用户所有信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
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
  },
  //初始化取用户信息
  getUserInfo(){
    http.request({
      apiName:'/users',
      method:'GET',
      isShowProgress: true,
    }).then((res)=>{
      console.log(res)
      this.setData({
        userInfo:res
      })
    })
  }
})