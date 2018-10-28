// pages/kind/kind.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: '',
    clickIcon: false, //控制模态框的弹出
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
  //跳转搜索页面
  goSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // 控制模态框
  openModal() {
    if(this.data.clickIcon==false){
      this.setData({
        clickIcon: true,
      })
    }else{
      this.setData({
        clickIcon: false,
      })
    }
    
  },

})