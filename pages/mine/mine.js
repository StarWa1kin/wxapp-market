const http = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],//用户所有信息
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
    this.getUserInfo();
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
  //我的订单
  enterOrder() {
    wx.switchTab({
      url: '../order/order',
    })
  },
  //跳转地址管理页面
  enterAddress() {
    wx.navigateTo({
      url: '../newAddress/newAddress',
    })
  },
  //切换店铺
  enterStore() {
    wx.navigateTo({
      url: '../changeStore/changeStore',
    })

  },
  //联系客服
  enterContact() {
    let tel = http.interface.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  //意见反馈
  enterFeedback() {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  exitLogin() {
    //清除token,返回登陆页面
    wx.navigateTo({
      url: '../login/login',
    })
  },
  //初始化取用户信息
  getUserInfo() {
    http.request({
      apiName: '/users',
      method: 'GET',
      isShowProgress: true,
    }).then((res) => {
      wx.setStorage({
        key: 'userInfo',
        data: res,
      })
      this.setData({
        userInfo: res
      })
    })
  }
})