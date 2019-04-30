const http = require('../../utils/request.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    payMethosList: [], //支付方式列表
    // userInfo: {}, //用户信息
    methodID: '', //支付方式id
    // checked: '', //控制默认选择什么支付！余额够->余额付
    // disabled: '', //控制radio的禁用
    buyNow: false, //从buyNow页面进入的
    vscrollHeig: '240',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userInfo = wx.getStorageSync("userInfo");
    var submitName = '立即支付';
    if (userInfo && userInfo.store){
      if (userInfo.store.type==1){
        submitName = '提交订单';
      }
    }
    if (options.hasOwnProperty("param")) {
      //从订单列表也跳转过来收到options参数
      this.setData({
        orderId: options.param,
        buyNow: true,
        amount: options.amount
      })
      let json = {
        methodID: wx.getStorageSync("userInfo").store.type,
        name: wx.getStorageSync("userInfo").store.type == 0 ? "微信支付" : "信用支付"
      }
      let arr = [];
      arr.push(json)
      this.setData({
        payMethosList: arr,
        submitName: submitName,
        methodID: userInfo.store.type
      })
    } else {
      //获取从提交传来的订单信息
      this.setData({
        orderInfo: JSON.parse(options.order),
        orderId: JSON.parse(options.order).id,
        methodID: JSON.parse(options.order).pay_method
      })
      let json = {
        methodID: this.data.orderInfo.pay_method,
        name: wx.getStorageSync("userInfo").store.type == 0 ? "微信支付" : "信用支付"
      }
      // debugger
      let arr = [];
      arr.push(json)
      this.setData({
        payMethosList: arr,
        submitName: submitName,
        methodID: userInfo.store.type
      })
    }
    // let json = {
    //   methodID: wx.getStorageSync("userInfo").current_store.type,
    //   name: wx.getStorageSync("userInfo").current_store.type == 0 ? "微信支付" : "信用支付"
    // }
    // let arr = [];
    // arr.push(json)
    // this.setData({
    //   payMethosList: arr,
    // })
    // this.getUserInfo();
    // this.getPayMethod();
    this.renderOrder()
    // this.getNowTime();

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

  //初始化取用户信息
  // getUserInfo() {
  //   http.request({
  //     apiName: '/users',
  //     method: 'GET',
  //     isShowProgress: true,
  //   }).then((res) => {
  //     // console.log(res)
  //     this.setData({
  //       userInfo: res
  //     })
  //     this.estimate()
  //   })
  // },
  //支付方式选择框
  // radioChange: function (e) {
  //   this.setData({
  //     methodID: e.detail.value
  //   })

  // },
  //判断是否能用余额支付
  // estimate() {
  //   let balance = Number(this.data.userInfo.balance)
  //   let amount;
  //   if (this.data.buyNow) {
  //     amount = Number(this.data.amount)
  //   } else {
  //     amount = Number(this.data.orderInfo.amount)
  //   }


  //   if (balance >= amount) {
  //     this.setData({
  //       checked: "1",
  //       methodID: '1'
  //     })
  //   } else {
  //     this.setData({
  //       disabled: "1",
  //       checked: "2",
  //       methodID: '2'
  //     })
  //   }
  // },

  //渲染该订单列表
  renderOrder() {
    http.request({
      apiName: '/orders/detail/' + this.data.orderId,
      method: 'GET',
      isShowProgress: true,
    }).then(res => {
      //根据订单量列表绘制 viewScroll高度
      let height;
      if (res.products.length == 1) {
        height = 240
      } else if (res.products.length == 2) {
        height = 480
      } else {
        height = 720
      }
      this.setData({
        list: res,
        vscrollHeig: height
      })
    })
  },
  //立即支付按钮
  pay() {
    http.request({
      apiName: '/pay',
      method: 'POST',
      data: {
        order_id: this.data.orderId,
        pay_method: this.data.methodID
      },
      isShowProgress: true,
    }).then(res => {
      //methodID=0 微信
      //methodID=1 先货后款
      if (this.data.methodID == 0) {
        // console.log("调用微信支付")
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
              icon: "none"
            })
          }
        })
      } else {
        wx.showToast({
          title: '支付成功',
        })
        app.globalData.tabIndex = "2"
        wx.switchTab({
          url: '../order/order',
        })
      }
    }, err => {
      wx.showToast({
        title: err,
        image: '../../assets/page/err.png'
      })
    })
  }
})