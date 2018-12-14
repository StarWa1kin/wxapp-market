// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '获取验证码', //按钮文字
    btnSwitch: false, //控制按钮(发送验证码)的禁用情况
    phone: '', //输入框中的手机号
    verificationC: '', //输入框中的验证码
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
  //键盘输入获取手机号
  getNumber(e) {
    this.setData({
      phone: e.detail.value
    })
    console.log(this.data.phone)
  },
  //点击发送验证码
  sendCode() {
    /* 验证手机号是否为空*/
    if (this.data.phone) {
      console.log(this.data.phone)
    } else {
      wx.showToast({
        image: '../../assets/page/err.png',
        title: '请填写手机号',
      })
      return false;
    }
    /* 验证手机是否符合正则*/
    let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!reg.test(this.data.phone)) {
      wx.showToast({
        image: '../../assets/page/err.png',
        title: '手机号格式错误',
      })
      return false;
    }
    /* 计时器部分*/
    this.setData({
      btnSwitch: true
    })
    let time = 60;
    let text = 's后重新发送';
    let countDown = setInterval(() => {
      time--;
      this.setData({
        code: time + text
      })
      if (time == 0) {
        clearInterval(countDown)
        this.setData({
          code: '获取验证码',
          btnSwitch: false
        })
      }
    }, 1000)
  },
  //键盘事件获取输入的验证码
  getCode(e) {
    this.setData({
      verificationC: e.detail.value
    })
  },
  //手机登陆
  login() {
    // console.log(this.data.verificationC)
    if (this.data.phone && this.data.verificationC) {
      console.log("验证成功")
      wx.switchTab({
        url: '../home/home',
      })
    } else {
      wx.showToast({
        image: '../../assets/page/err.png',
        title: '请填写表单信息',
      })
    }

  },
  //微信登录
  wxlogin(e){
    console.log(e.detail)
  }
})