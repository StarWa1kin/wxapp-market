const http = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    // tab切换
    currentTab: 0,
    allOrder:[],//全部
    waitPay:[],//待付款
    waitReceive:[],//待收货
    already:[],//已完成

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winHeight: res.windowHeight
        });
      }
    })
    
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
    this.getOrderList(this.data.currentTab)
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
  //获取订单列表
  getOrderList(current) { 
    http.request({
      apiName: '/orders',
      method: 'GET',
      data:{
        status: current
      },
      isShowProgress: true,
    }).then((res) => {
      if(res.length>0){
        //全部订单
        if(current==0){
          console.log(0)
          this.setData({
            allOrder: res
          })
        }
        //待付款订单
        else if(current==1){
          console.log(1)
          this.setData({
            waitPay: res
          })
        }
        //代收货订单
        else if(current==2){
          this.setData({
            waitReceive: res
          })
        }
        //已完成订单
        else if(current==3){
          this.setData({
            already: res
          })
        }
      }else{
        wx.showToast({
          title:"无订单信息",
          icon:"none",
        })
      }
    })
  },
  // 滑动切换选项卡
  bindChange: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    // console.log(`滑动-确定当前tabIndex,${this.data.currentTab}`)
    this.getOrderList(this.data.currentTab)
  },
  //点击切换选项卡
  swichNav: function(e) {
    /*注释：e.target.dataset.current--点击传递过来的tabIndex*/
    // console.log(`点击-确定当前currentTab,${this.data.currentTab}`)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
  
})