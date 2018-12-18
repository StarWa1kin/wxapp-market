const http = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000, //切换时间
    duration: 1000, //滑动时长
    circular: true, //无缝轮播
    // 促销信息
    name: '精品五花肉1kg/份',
    goodsList: [],
    quantity:0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList()

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
  /**
   * 自定义函数
   */
  //跳转搜索页面
  goSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  // 跳转购物车页面
  toPay() {
    wx.navigateTo({
      url: '../submitOrder/submitOrder',
    })
  },
  //初始化取商品列表
  getList() {
    http.request({
      apiName: '/products',
      method: 'GET',
      data: {
        page: 1
      },
      isShowProgress: true,
    }).then((res) => {
      this.setData({
        goodsList: res
      })
    })
  },
  //商品+1
  add(e){
    let productId=e.currentTarget.id; 
    http.request({
      apiName: '/carts',
      method: 'POST',
      data: {
        "product_id": productId,
        "quantity": 1,
      },
      isShowProgress: true,
    }).then((res) => {
      
    })

  },
  //商品-1
  subtract(){
    var num = this.data.quantity;
    this.setData({
      quantity: num -= 1
    })
  }
})