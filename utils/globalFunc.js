let app=getApp()
let http=require('./request.js')
const submitLocalCar=()=> {
  let carList = app.globalData.globalCar;
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
  let httpRequest=0;
  for (let index in carList) {
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
    } else if (carList[index].hasOwnProperty("id") && carList[index].quantity > 0) {
      console.log("修改quanj")
      http.request({
        apiName: '/carts/' + carList[index].id,
        method: 'PUT',
        data: {
          "quantity": carList[index].quantity
        },
      }).then((res) => {
        httpRequest++
        if (httpRequest == app.globalData.globalCar.length) {
          app.globalData.ajaxOk=true;
          app.globalData.globalCar = []
        }
      })
    }
    else {
      console.log("添加")
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
          app.globalData.globalCar=[]
        }
      })
    }
  }

 
  
}

module.exports = submitLocalCar;