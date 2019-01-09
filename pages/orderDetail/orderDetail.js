const http = require('../../utils/request.js');
var app=getApp()
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
    if(options.hasOwnProperty("param")){
      //从订单列表也跳转过来收到options参数
      this.setData({
        orderId: options.param
      })
    }else{
      //获取从提交传来的订单信息
      this.setData({
        orderInfo: JSON.parse(options.order),
        orderId: JSON.parse(options.order).id
      })
    }
    
    this.getUserInfo();
    this.getPayMethod();
    
    // console.log(this.data.orderInfo)
    this.renderOrder()

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
      apiName: '/orders/detail/'+this.data.orderId,
      method: 'GET',
      isShowProgress: true,
    }).then(res=>{
      this.setData({
        list:res
      })
    })
  },
  //立即支付按钮
  pay() {
    if (this.data.methodID == ""){
      // debugger
      wx.showToast({
        title: '请选择支付方式',
        image: '../../assets/page/err.png'
      })
      return
    }
    http.request({
      apiName: '/pay',
      method: 'POST',
      data: {
        order_id: this.data.orderInfo.id,
        pay_method: this.data.methodID
      },
      isShowProgress: true,
    }).then(res => {
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
          wx.showToast({
            title: '支付成功',
          })
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
      }else{
        wx.showToast({
          title: '支付成功',
        })
        app.globalData.tabIndex="2"
        wx.switchTab({
          url: '../order/order',
        })
      }
    },err=>{
      wx.showToast({
        title: err,
        image: '../../assets/page/err.png'
      })
    })
  }
})