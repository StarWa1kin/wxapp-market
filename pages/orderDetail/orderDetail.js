const http = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    payMethosList:[],//支付方式列表
    userInfo: {}, //用户信息
    methodID:'',//支付方式id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo();
    this.getPayMethod();
    //获取从上个页面传来的订单信息
    this.setData({
      orderInfo: JSON.parse(options.order)
    })
    console.log(this.data.orderInfo)
    this.renderOrder()
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
    //取得methodID
    console.log(e.detail.value)
    this.setData({
      methodID: e.detail.value
    })
    
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
      // this.estimate()
    })
  },
  //获取支付方式列表
  getPayMethod(){
    http.request({
      apiName: '/pay/methods',
      method: 'GET',
    }).then(res => {
      this.setData({
        payMethosList:res
      })
    })
  },
  //判断是否能用余额支付
  estimate() {
    
  },
  //渲染该订单列表
  renderOrder(){
    http.request({
      apiName: '/orders/detail/'+this.data.orderInfo.id,
      method: 'GET',
      isShowProgress: true,
    }).then(res=>{
      debugger
      this.setData({
        list:res
      })
    })
  },
  //立即支付按钮
  pay() {
    http.request({
      apiName: '/pay',
      method: 'POST',
      data: {
        order_id: this.data.orderInfo.id,
        pay_method: this.data.methodID
      },
      isShowProgress: true,
    }).then(res => {
      debugger
      //methodID=1 余额支付
      //methodID=2 微信
      //methodID=3 先货后款
      if (res.hasOwnProperty("nonceStr") && res.hasOwnProperty("package")){
        console.log("调用微信支付")
        wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success(res) {
          debugger
          wx.switchTab({
            url: '../order/order',
          })
        },
        fail(res) {
          wx.showToast({
            title: "支付失败",
            icon:"none"
          })
        }
      })
      }
    },err=>{
      debugger
      wx.showToast({
        title: err,
        image: '../../assets/page/err.png'
      })
    })
  }
})