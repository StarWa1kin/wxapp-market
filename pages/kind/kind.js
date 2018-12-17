const http = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: '',
    clickIcon: false, //控制模态框的弹出
    menuList: [], //菜单列表
    num: '1', //菜单默认选中第一项
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setArea();
    this.getMenuList();
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
    if (this.data.clickIcon == false) {
      this.setData({
        clickIcon: true,
      })
    } else {
      this.setData({
        clickIcon: false,
      })
    }

  },
  //获取屏幕高度设置viewscroll区域
  setArea() {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winHeight: res.windowHeight
        });
      }
    })
  },
  //获取菜单列表
  getMenuList() {
    http.request({
      apiName: '/categories',
      method: 'GET',
      isShowProgress: true,
    }).then((res) => {
      console.log(res)
      this.setData({
        menuList: res
      })
    })
  },
  //点击菜单进行切换
  chooseMenu(e) {
    this.setData({
      num: e.currentTarget.dataset.num
    })
  },
  //切换菜单后请求该菜单下的商品列表
  goodList(){

  }

})