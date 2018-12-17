// pages/newAddress/newAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  //地区picker选择器
  changeRegin(e) {
    this.setData({
      region: e.detail.value
    });
    
  },
  //表单验证函数
  formValidation(param){
    console.log(param)
    if(param.region.length==0){
      this.showMsg("地区不能为空");
      return false;
    }
    if(param.address==""){
      this.showMsg("地址不能为空");
      return false;
    }
    if(param.name==""){
      this.showMsg("收货人不能为空");
      return false;
    }
    if(param.telphone==""){
      this.showMsg("电话不能为空");
      return false;
    }
    if(param.telphone.length!="11"){
      this.showMsg("手机号长度错误");
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(param.telphone))) {
      this.showMsg("手机号格式错误");
      return false;
    } 
    return true;
  },
  //表单输入状态弹框
  showMsg(err){
    wx.showToast({
      title: err,
      image:'../../assets/page/err.png'
    })
  } ,
  //提交表单
  formSubmit(e) {
    //组装数据
    var json = e.detail.value;
    json.region = this.data.region
    //表单验证
    if (!this.formValidation(json)){
      return false;
    }
    //最终提交
    console.log("通过验证,可以提交")
  },
})