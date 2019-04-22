// pages/changeStore/changeStore.js
let http=require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeList:[],
    checked:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.renderStore()
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
  renderStore(){
    let _this=this
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        // debugger
        console.log(res.data)
        _this.setData({
          storeList:res.data.stores,
          checked: res.data.current_store.id
        })
      },
    })
  },
  radioChange(e){
    console.log(e.detail.value)
  
    wx.showModal({
      title: '提示',
      content: '请问是否确认要切换店铺',
      success:res=> {
        if (res.confirm) {
          this.changeStore(e.detail.value)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  changeStore(param){
    http.request({
      apiName:'/users/store/change/'+param,
      method:'post',
    }).then(res=>{
      debugger
    })
  }
  
  
  
})