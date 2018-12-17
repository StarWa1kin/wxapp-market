const baseUrl = require('./request.js');;


const sendRequest = (config) => {
  let token = wx.getStorageSync('token'); //先读取token
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
        console.log(res)
        /*取得响应后,与后台协商怎么样的状态码是成功,怎么的状态码是token失效。以及是否带有token请求后台？*/
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
  interface: baseUrl
}