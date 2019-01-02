const http = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioChoose1:true,
    radioChoose2:false,
    hasAddress:false,
    shoppingList:[],//购物车列表
    total:0,//购物车商品合计
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("购物车页面")
    this.getShoppingList();
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
  //跳转地址页面
  enterAddress(){
    wx.navigateTo({
      url: '../newAddress/newAddress',
    })
  },
  //取回保存的地址
  getAddress(){
    http.request({
      apiName: '',
      method: 'GET',
      isShowProgress: false,
    }).then((res) => {
      if(res){
        this.setData({
          hasAddress:true
        })
      }
    })
  },
  //初始化加载购物车列表
  getShoppingList() {
    http.request({
      apiName: '/carts',
      method: 'GET',
      isShowProgress: true,
    }).then((res) => {
      console.log(res)
      //统计合计金额
      var sum = 0;
      if (res.length == 0) {
        this.setData({
          total: 0
        })
      } else {
        for (let index in res) {
          var price = res[index].product.price;
          var quantity = res[index].quantity;
          sum += (price * quantity)
          res[index]["littleSum"] = (price * quantity).toFixed(2)
        }
        this.setData({
          total: sum.toFixed(2)
        })
      }
      this.setData({
        shoppingList: res
      })

    })
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