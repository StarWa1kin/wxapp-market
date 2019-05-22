const http = require('../../utils/request.js')
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
  },
  //点击发送验证码
  sendCode() {
    /* 验证手机号是否为空*/
    if (this.data.phone) {
      // console.log(this.data.phone)
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

    wx.request({
      url: http.interface.apiHost + '/auth/sms',
      method: 'POST',
      data: {
        mobile: this.data.phone
      },
      dataType: 'json',
      success(res) {
        console.log(res)
        if (res.data.code == 0) {
          wx.showToast({
            title: '发送成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '短信发送失败，请稍后重试',
            image: '../../assets/page/err.png'
          })
        }
      }
    })
  },
  //键盘事件获取输入的验证码
  getCode(e) {
    this.setData({
      verificationC: e.detail.value
    })
  },
  //手机登陆
  login() {
    if (this.data.phone && this.data.verificationC) {
      // 微信登录取回code
      wx.login({
        success: result => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: http.interface.apiHost + '/auth/sms/login',
            method: 'POST',
            data: {
              mobile: this.data.phone,
              code: this.data.verificationC,
              js_code: result.code
            },
            dataType: 'json',
            success(res) {
              if (res.data.code == 0) {
                wx.setStorage({
                  key: 'token',
                  data: JSON.stringify(res.data.data),
                });
                wx.switchTab({
                  url: '../kind/kind',
                })
              } else if (res.data.code == 1) {
                wx.showToast({
                  title: res.data.message,
                  image: '../../assets/page/err.png'
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: "none"
                })
              }
            },
          })
        }
      })


    } else {
      wx.showToast({
        image: '../../assets/page/err.png',
        title: '请填写表单信息',
      })
    }

  },
  //微信登录
  wxlogin(e) {
    /*交互*/
    wx.showLoading({
      title: '正在登陆',
      mask: true
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 2000)
    //调用wxApi获取code
    wx.login({
      success(res) {
        if (res.code) {
          /*1-向服务器传递code-->后台用code去换openId,并检查数据库是否含有此openId?有->就登陆成功！无->返回->openid,sessionKey
            2-调用解密登陆获取用户手机号->检查手机号是否会员,是那么就将openId存入数据同手机号绑定,下次登陆微信登陆不需要解密,否则阻止登陆*/
          wx.request({
            url: http.interface.apiHost + '/auth/code/login',
            method: 'POST',
            data: {
              js_code: res.code
            },
            success: function(res) {
              // 判断是否有返回openid,sessionKey,有-->解密登陆，直接返回token->就算登陆成功 否则不是会员
              if (res.data.data.hasOwnProperty('session_key')) {
                let openid = res.data.data.openid;
                let session_key = res.data.data.session_key;
                wx.checkSession({
                  success() {
                    // session_key 未过期，并且在本生命周期一直有效
                    let encrypted_data = e.detail.encryptedData;
                    let iv = e.detail.iv;
                    wx.request({
                      url: http.interface.apiHost + '/auth/decrypt/login',
                      method: 'POST',
                      data: {
                        openid,
                        session_key,
                        encrypted_data,
                        iv
                      },
                      success: res => {
                        //解密失败
                        if (res.data.code == "-1") {
                          wx.hideLoading();
                          wx.showToast({
                            title: res.data.message,
                            icon: "none"
                          })
                        } else {
                          wx.setStorage({
                            key: 'token',
                            data: JSON.stringify(res.data.data),
                          })
                          wx.hideLoading()
                          // 存储token跳转首页
                          wx.switchTab({
                            url: '../kind/kind',
                          })
                        }
                      }
                    })

                  },
                  fail() {
                    // session_key 已经失效，需要重新执行登录流程
                    wx.login() // 重新登录
                  }
                })
              }
              //后台绑定好openId会直接返回token 
              else if (res.data.data.hasOwnProperty('access_token')) {
                wx.setStorage({
                  key: 'token',
                  data: JSON.stringify(res.data.data),
                })
                // 存储token跳转首页
                wx.switchTab({
                  url: '../kind/kind',
                })
              } else {
                wx.showToast({
                  title: '仅限会员登陆',
                  image: '../../assets/page/err.png'
                })
              }

            },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  },

})