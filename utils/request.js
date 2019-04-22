const ipConfig = require('./ipConfig.js');;

const sendRequest = (config) => {
  let apiHost = ipConfig.apiHost; //取出要访问的接口ip地址
  let token;
  try {
    const value = wx.getStorageSync('token');
    if (value) {
      token = 'Bearer ' + JSON.parse(value).access_token
    }else{
      // 无token重定向登陆页面--!!正式环境请解放注释
      wx.navigateTo({
        url: '../login/login',
      })
    }
  } catch (e) {
    wx.showToast({
      title: e,
      image:'../../assets/page/err.png'
    })
  }
  let deaufltConfig = {
    apiName: '', //接口名称,
    method: 'get', //请求的方法
    data: {}, //将要传递的参数
    isShowProgress: false, //是否显示请求对话框
    progressTitle: '加载中...', //对话框文字
    header: {
      'content-type': 'application/json', //请求格式
      'Authorization': token, //签名为token
    },
    success: '', //成功callback
    fail: '', //失败callback

  }
  Object.assign(deaufltConfig, config);
  if (deaufltConfig.isShowProgress) {
    wx.showToast({
      title: deaufltConfig.progressTitle,
      icon: 'loading',
      duration: 3000
    })
  }
  let _url = apiHost + deaufltConfig.apiName;
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      header: deaufltConfig.header,
      data: deaufltConfig.data,
      method: deaufltConfig.method,
      success: res => {
        // console.log(res.data.message)
        /*取得响应后,与后台协商怎么样的状态码是成功,怎么的状态码是token失效。以及是否带有token请求后台？*/
        if(res.data.code==0){
          resolve(res.data.data)
        }else if(res.data.code==1){
          reject(res.data.message)
        } else if (res.data.code == "-1" && res.data.message=="Unauthenticated."){
          wx.showToast({
            title: '该账号授权失败',
            icon:'none'
          })
          wx.navigateTo({
            url: '../login/login',
          })
        }else{
          reject(res.data.message)
        }
      },
      fail: err => {
        console.log(`请求错误!错误接口:${deaufltConfig.apiName};错误信息:${err}`)
        reject(err)
      },
      complete: res => {
        /*无论请求失败与否 */
        if (deaufltConfig.isShowProgress) {
          wx.hideToast(); //隐藏对话框
        }
      }
    })
  })
}


module.exports = {
  request: sendRequest,
  interface: ipConfig
}