const http = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    radioChoose1: true, //余额支付
    radioChoose2: false, //微信支付
    control: false, //用来控制余额支付开个是否禁用
    userInfo: {}, //用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo();
    //获取从上个页面传来的订单信息
    this.setData({
      orderInfo: JSON.parse(options.order)
    })
    // debugger

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
  /**自定义函数 */
  //支付方式选择框
  radioChange: function(e) {
    /*先判断是否能使用余额支付*/
    debugger
    if (this.data.control) {
      return
    }
    if (e.detail.value == "余额") {
      this.setData({
        radioChoose2: false,
        radioChoose1: true
      })
    }
    if (e.detail.value == "微信") {
      this.setData({
        radioChoose1: false,
        radioChoose2: true,
      })
    }
  },
  //初始化取用户信息
  getUserInfo() {
    http.request({
      apiName: '/users',
      method: 'GET',
      isShowProgress: true,
    }).then((res) => {
      console.log(res)
      this.setData({
        userInfo: res
      })
      //判断余额是否能支付该订单
      this.estimate()
    })
  },
  //判断是否能用余额支付
  estimate() {
    debugger
    if (Number(this.data.userInfo.balance) >= Number(this.data.orderInfo.amount)) {
      console.log("可以余额支付")
    } else {
      console.log("不能余额支付")
      this.setData({
        control: true,
        radioChoose2: true,
        radioChoose1: false
      })
    }
  },
  //立即支付按钮
  pay() {
    // 判断支付方式
    let payMethod;
    if (this.data.radioChoose1) {
      payMethod = "0";
    } else {
      payMethod = "1";
    }
    http.request({
      apiName: '/pay',
      method: 'POST',
      data: {
        order_id: this.data.orderInfo.id,
        pay_method: payMethod
      },
      isShowProgress: true,
    }).then(res => {
      debugger
    })
  }
})