let app = getApp()
let http = require('./request.js')
const submitLocalCar = () => {
  let carList = app.globalData.globalCar;
  if (!carList) {
    return
  }
  if (!carList.length) {
    return
  }
  let actNum = 0;
  for (let index in carList) {
    if (carList[index].quantity == 0) {
      actNum++
    }
  }
  app.globalData.bubble = carList.length - actNum;
  let httpRequest = 0; //发了几次请i去
  for (let index in carList) {
    //1-如果有购物车id 并且数量为0 -->调用删除
    if (carList[index].hasOwnProperty("id") && carList[index].quantity == 0) {
      http.request({
        apiName: '/carts/' + carList[index].id,
        method: 'DELETE',
      }).then((res) => {
        httpRequest++
        if (httpRequest == app.globalData.globalCar.length) {
          app.globalData.ajaxOk = true;
          app.globalData.globalCar = []
        }
      })
    }
    //2- 如果有购物车id 并且最终数量大于0 -->修改接口 
    else if (carList[index].hasOwnProperty("id") && carList[index].quantity > 0) {
      http.request({
        apiName: '/carts/' + carList[index].id,
        method: 'PUT',
        data: {
          "quantity": carList[index].quantity
        },
      }).then((res) => {
        httpRequest++
        if (httpRequest == app.globalData.globalCar.length) {
          app.globalData.ajaxOk = true;
          app.globalData.globalCar = []
        }
      })
    } else {

      //!!加0的情况
      if (carList[index].quantity==0){
        return
      }

      // console.log("添加")
      http.request({
        apiName: '/carts',
        method: 'POST',
        data: {
          "product_id": carList[index].product_id,
          "quantity": carList[index].quantity,
        },
      }).then((res) => {
        httpRequest++;
        if (httpRequest == app.globalData.globalCar.length) {
          app.globalData.ajaxOk = true;
          app.globalData.globalCar = []
        }
      },err=>{
        debugger
      })
    }
  }



}

const computed = () => {
  let localCar = app.globalData.globalCar;
  let sum = 0;
  for (let val of localCar) {
    if (val.hasOwnProperty("product")){
      sum += (val.quantity) * (val.product.extend.price)
    }else{
      sum += (val.quantity) * (val.price)
    }
  }
  sum=sum.toFixed(2)
  return sum
}


const getStoreName=()=>{
  wx.getStorage({
    key: 'userInfo',
    success: function (res) {
      wx.setNavigationBarTitle({
        title: `商品(${res.data.store.name})`
      })
    },
  })
}

export {
  submitLocalCar,
  computed,
  getStoreName
};