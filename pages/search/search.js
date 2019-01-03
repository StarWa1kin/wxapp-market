
const http = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText:'',
    searchList:[],//关键字搜索-->商品列表
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
  /**自定义函数 */
  //取消
  cancel(){
    wx.navigateBack({
      // delta: 1,
    })
  },
  //键盘事件获取input text
  getKeyword(e){
    this.setData({
      inputText: e.detail.value
    })
  },
  //搜索
  search(){
    http.request({
      apiName: '/products',
      method: 'GET',
      data: {
        name: this.data.inputText
      },
      isShowProgress: true,
    }).then((res) => {
      console.log(res)
      if(res.length==0){
        wx.showToast({
          title: '无此商品',
          image:'../../assets/page/err.png'
        })
      }else{
        this.setData({
          searchList: res
        })
      }

    })
  },
  //添加商品
  add(e){
    let productId = e.currentTarget.id;
    http.request({
      apiName: '/carts',
      method: 'POST',
      data: {
        "product_id": productId,
        "quantity": 1,
      },
      isShowProgress: true,
    }).then((res) => {
      wx.showToast({
        title: '添加至购物车',
      })
    })
  }
})