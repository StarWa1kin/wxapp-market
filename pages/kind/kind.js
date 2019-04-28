const http = require('../../utils/request.js')
import {
  submitLocalCar,
  computed
} from '../../utils/globalFunc.js'
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: '', //要切换的高度
    height_arr: [], //高度临界值
    winHeight: '', //可用窗口高度
    clickIcon: false, //控制模态框的弹出
    menuList: [], //菜单列表
    idIndex: 0, //菜单索引(用来确定当前选中菜单)
    lastIndex: 0, //
    productList: [], //一级菜单对应下的商品列表
    shoppingList: [], //购物车列表
    bubble: 0,
    total: 0, //合计金额,
    submitLocalCar: false, //是否提交过本地购物车
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setArea();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getMenuList();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //切换店铺后需要重新加载首页
    if (getApp().globalData.hasOwnProperty("changeStoreKind")) {
      //指控原来的所有的goodList并重新请求列表
      this.setData({
        menuList: [],
        productList:[]
      })
      this.getMenuList();
      delete getApp().globalData.changeStoreKind
      // debugger
    }
    /**回调成功后立即加载购物车否则延迟1s加载*/
    //每一秒实时监听是否回调成功,回调成功才加载购物车列表
    let listenSuc = setInterval(() => {
      if (app.globalData.ajaxOk) {
        this.loadList();
        clearInterval(listenSuc)
      }
    }, 1000)



  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // this.setData({
    //   productList: []
    // })
    //小优化:如果模态框此时打开着切换页面,那么将自动关闭模态框
    if (this.data.clickIcon == true) {
      this.setData({
        clickIcon: false,
      })
    }
    submitLocalCar()

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
  //去结算
  enterSubmit() {
    if (this.data.bubble > 0) {
      wx.navigateTo({
        url: '../submitOrder/submitOrder',
      })
    } else {
      wx.showToast({
        title: '购物车空空如也',
        icon: 'none'
      })
    }
  },
  // 控制购物车模态框显示与隐藏
  openModal() {

    if (this.data.clickIcon == false) {
      this.setData({
        clickIcon: true,
      })
      submitLocalCar();
      wx.showLoading({
        title: '加载中',
      })
      let listenSuc = setInterval(() => {
        if (app.globalData.ajaxOk) {
          this.loadList();
          clearInterval(listenSuc);
          wx.hideLoading()
        } else {
          wx.hideLoading()
        }
      }, 1000)

    } else {
      this.setData({
        clickIcon: false,
      })
    }

  },
  //阻止遮罩层穿透滑动
  myCatchTouch() {
    return;
  },
  //加载购物车
  loadList() {
    http.request({
      apiName: '/carts',
      method: 'GET',
    }).then((res) => {
      //========
      //请求购物车列表处理成本地全局变量
      app.globalData.globalCar = res;
      //购物车无商品会显0
      if (res.length == 0) {
        this.setData({
          bubble: 0,
        })
      }
      //购物车有商品
      else {
        app.globalData.globalCar = [];
        for (let value of res) {
          let json = {};
          json.id = value.id;
          json.product_id = value.product_id;
          json.quantity = value.quantity;
          json.product = value.product;
          app.globalData.globalCar.push(json)
        }
        this.setData({
          bubble: res.length,
        })
        //回显数量字段方法
        this.reshow()
      }

      //============
      //气泡
      this.setData({
        shoppingList: res
      })
      this.setData({
        bubble: res.length
      })
      //统计合计金额
      var sum = 0;
      if (res.length == 0) {
        this.setData({
          total: 0
        })

      } else {
        for (let value of res) {
          if (value.product.extend){
            var price = value.product.extend.price;
          }
          var quantity = value.quantity;
          sum += (price * quantity)
        }
        this.setData({
          total: sum.toFixed(2)
        })
      }

    })
  },
  //商品+1
  add(e) {
    let goosId = e.currentTarget.id;
    let price = e.currentTarget.dataset.price
    if (!app.globalData.globalCar.length) {
      let json = {};
      json.product_id = goosId;
      json.quantity = 1;
      json.price = price;
      app.globalData.globalCar.push(json)
    } else {
      //购物车有商品
      let swiCh = false;
      for (let index in app.globalData.globalCar) {
        if (app.globalData.globalCar[index].product_id == goosId) {
          // app.globalData.globalCar[index].quantity += 1;
          app.globalData.globalCar[index].quantity = parseInt(app.globalData.globalCar[index].quantity)+1
          debugger
          swiCh = true;
          break;
        } else {
          swiCh = false;
        }
      }
      if (!swiCh) {
        // push
        var json = {};
        json.product_id = goosId;
        json.quantity = 1;
        json.price = price;
        app.globalData.globalCar.push(json)
        // console.log('PUSH!!!')
      }
    }
    this.setData({
      bubble: app.globalData.globalCar.length
    })
    this.reshow()

  },
  //商品-1
  subtract(e) {
    let goodsId = e.currentTarget.id;
    let price = e.currentTarget.dataset.price
    for (let index in app.globalData.globalCar) {
      if (app.globalData.globalCar[index].product_id == goodsId) {
        app.globalData.globalCar[index].quantity -= 1;
      }
    }

    this.setData({
      bubble: app.globalData.globalCar.length
    })
    this.reshow()
  },

  inputChange(e) {
    let currentNum = e.detail.value;
    let price = e.currentTarget.dataset.price
    let goodsId = e.currentTarget.id;
    for (let index in app.globalData.globalCar) {
      if (app.globalData.globalCar[index].product_id == goodsId) {
        app.globalData.globalCar[index].quantity = currentNum;
      }
    }
    this.reshow()
  },
  reshow() {
    // debugger
    let productList = this.data.productList
    for (let value of productList) {
      for (let i in app.globalData.globalCar) {
        for (let index in value) {
          if (app.globalData.globalCar[i].product_id == value[index].id) {
            value[index].reshowNum = app.globalData.globalCar[i].quantity
          }
        }
      }
    }
    let comTotal = computed()
    this.setData({
      productList: productList,
      total: comTotal
    })

  },
  //清空购物车
  clearList() {
    http.request({
      apiName: '/carts',
      method: 'DELETE',
      isShowProgress: true,
    }).then((res) => {
      this.loadList();
      //本地购物车同样归0
      let productList = this.data.productList
      for (let value of productList) {
        for (let index in value) {
          value[index].reshowNum = 0
        }
      }
      this.setData({
        productList: productList,
        clickIcon: false
      })
    })

  },
  //获取屏幕高度设置viewscroll区域
  setArea() {
    wx.getSystemInfo({
      success: res => {
        let realHeight = (res.windowHeight * (750 / res.windowWidth)) - 204;
        this.setData({
          //换算成rpx
          winHeight: realHeight
        })

      }
    })

  },
  //获取一级菜单列表
  getMenuList() {
    http.request({
      apiName: '/categories',
      method: 'GET',
    }).then((res) => {
      this.setData({
        menuList: res,
      })
      for (let i of res) {
        this.getMenuGoods(i.id)
      }
    })
  },
  //获取对应一级菜单下的商品列表
  getMenuGoods(categoryId) {
    http.request({
      apiName: '/products',
      method: 'GET',
      data: {
        category_id: categoryId
      },
    }).then((res) => {
      //回显数量
      let reshowList = this.reshowNum(res)
      let dyadicArr = []; //定义一个二维数组用于存放商品列表的json数组
      dyadicArr.push(reshowList);
      let originalArr = this.data.productList; //复制
      let newArr = originalArr.concat(dyadicArr); //合并数组

      this.setData({
        productList: newArr
      })
      //捕获高度临界值
      this.getHeightArr(this)
    })
  },

  reshowNum(params) {
    let shoppingList = app.globalData.globalCar;
    if (shoppingList.length == 0) {
      for (let index in params) {
        params[index].reshowNum = 0
      }
    } else {
      for (let index in params) {
        for (let j in shoppingList) {
          if (shoppingList[j].product_id == params[index].id) {
            params[index].reshowNum = shoppingList[j].quantity
          }
        }
      }
    }
    return params;

  },
  //点击菜单进行渲染该分类下的商品
  chooseMenu(e) {
    this.setData({
      idIndex: e.currentTarget.dataset.index,
      toView: e.currentTarget.dataset.id
    })

  },
  getHeightArr(self) {
    let height = 0, //初始高度0
      height_arr = [],
      details = self.data.productList, //复制productlist
      winHeight = self.data.winHeight;
    for (let i = 0; i < details.length; i++) {
      var last_height = 60 + details[i].length * 250;
      if (i == details.length - 1) {
        last_height = (last_height > winHeight ? last_height : winHeight + 50)
      }
      height += last_height;
      height_arr.push(height);
    }
    self.setData({
      height_arr: height_arr
    })

  },
  //view-scroll滚动触发
  scroll(e) {
    let self = this;
    let scrollTop = e.detail.scrollTop;
    wx.getSystemInfo({
      success: res => {
        scrollTop = scrollTop * (750 / res.windowWidth)
        self.scrollmove(self, scrollTop)
      }
    })

  },
  scrollmove(self, scrollTop) {
    /**
     * @{scrollTop}:当前滚动条高度(原单位是:px-->换成rpx)
     */
    // last_scrollTop=scrollTop;

    let scrollArr = self.data.height_arr;
    if (scrollTop > scrollArr[scrollArr.length - 1] - self.data.winHeight) {
      return;
    } else {
      for (var i = 0; i < scrollArr.length; i++) {
        if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
          if (0 != self.data.lastIndex) {
            self.setData({
              idIndex: 0,
              lastIndex: 0
            });
          }
        } else if (scrollTop >= scrollArr[i - 1] && scrollTop <= scrollArr[i]) {
          if (i != self.data.lastIndex) {
            self.setData({
              idIndex: i,
              lastIndex: i
            });
          }
        }
      }
    }

  },
  //弹出层的添加
  modalAdd(e) {
    let goodsId = e.currentTarget.id;
    http.request({
      apiName: '/carts',
      method: 'POST',
      data: {
        product_id: goodsId,
        quantity: 1
      }
    }).then(res => {
      this.loadList()
    })
  },
  //弹出层的减去
  modalSubtract(e) {
    let cartsId = e.currentTarget.dataset.cartsid;
    let quantity = e.currentTarget.dataset.quantity - 1;
    if(quantity==0){
      this.deleteIt(e);
      return;
    }
    http.request({
      apiName: '/carts/' + cartsId,
      method: 'PUT',
      data: {
        quantity: quantity
      }
    }).then(res => {
      this.loadList()
    })
  },
  //清除某一商品
  deleteIt(e) {
    let id = e.currentTarget.dataset.cartsid;
    let goodsId = e.currentTarget.dataset.goodsid;
    http.request({
      apiName: '/carts/' + id,
      method: 'DELETE',
    }).then((res) => {
      this.loadList();
      //重置本地购物车
      let productList = this.data.productList
      for (let value of productList) {
        for (let index in value) {
          if (goodsId == value[index].id) {
            value[index].reshowNum = 0
          }
        }
      }
      this.setData({
        productList: productList
      })
    })
  },
  //模态输入框
  modalInput(e) {
    let id = e.currentTarget.dataset.cartsid;
    let quantity = e.detail.value;
    http.request({
      apiName: '/carts/' + id,
      method: 'PUT',
      data: {
        quantity: quantity
      }
    }).then(res => {
      this.loadList()
    })
  }

})