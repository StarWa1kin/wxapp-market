const http = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 0, //要切换的高度
    height_arr: [], //高度临界值
    winHeight: '', //可用窗口高度
    clickIcon: false, //控制模态框的弹出
    menuList: [], //菜单列表
    idIndex: 0, //菜单索引(用来确定当前选中菜单)
    lastIndex:0,//
    productList: [], //一级菜单对应下的商品列表
    shoppingList: [], //购物车列表
    bubble: 0,
    total: 0, //合计金额,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setArea();
    this.getMenuList();
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
    this.loadList();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    //小优化:如果模态框此时打开着切换页面,那么将自动关闭模态框
    if (this.data.clickIcon == true) {
      this.setData({
        clickIcon: false,
      })
    }
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
        title: '购物车无商品',
        image: '../../assets/page/err.png'
      })
    }
  },
  // 控制购物车模态框显示与隐藏
  openModal() {
    if (this.data.clickIcon == false) {
      this.setData({
        clickIcon: true,
      })
      // this.loadList()
    } else {
      this.setData({
        clickIcon: false,
      })
    }

  },
  //阻止遮罩层穿透滑动
  myCatchTouch() {
    console.log('stop user scroll it!');
    return;
  },
  //加载购物车
  loadList() {
    http.request({
      apiName: '/carts',
      method: 'GET',
      isShowProgress: true,
    }).then((res) => {
      //渲染数据
      this.setData({
        shoppingList: res
      })
      //气泡
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
          var price = value.product.price;
          var quantity = value.quantity;
          sum += (price * quantity)
        }
        this.setData({
          total: sum.toFixed(2)
        })
      }
      //分类列表回显数量
      let copyGoodList = this.data.productList;
      for (let index in copyGoodList) {
        copyGoodList[index].reshowNum = 0; //制空reshowNum属性
        for (var reshow of res) {
          if (copyGoodList[index].id == reshow.product.id) {
            copyGoodList[index].reshowNum = reshow.quantity; //添加字段用来回显数量
            copyGoodList[index].shoppingCarId = reshow.id; //添加字段控制减少购物车数量
          }
        }
        this.setData({
          productList: copyGoodList
        })
      }
    })
  },
  //商品+1
  add(e) {
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
      this.loadList()
    })

  },
  //商品-1
  subtract(e) {
    let id = e.currentTarget.dataset.id;
    let nowQuantity = e.currentTarget.dataset.quantity - 1
    http.request({
      apiName: '/carts/' + id,
      method: 'PUT',
      data: {
        "quantity": nowQuantity,
      },
      isShowProgress: true,
    }).then((res) => {
      this.loadList()
    })
  },
  //清除某一商品
  deleteIt(e) {
    let id = e.currentTarget.dataset.id;
    http.request({
      apiName: '/carts/' + id,
      method: 'DELETE',
      isShowProgress: true,
    }).then((res) => {
      this.loadList()
    })
  },
  //清空购物车
  clearList() {
    http.request({
      apiName: '/carts',
      method: 'DELETE',
      isShowProgress: true,
    }).then((res) => {
      this.loadList()
    })

  },
  //获取屏幕高度设置viewscroll区域
  setArea() {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          //换算成rpx
          winHeight: res.windowHeight * (750 / res.windowWidth)
        })
        
      }
    })
  },
  //获取一级菜单列表
  getMenuList() {
    http.request({
      apiName: '/categories',
      method: 'GET',
      // isShowProgress: true,
    }).then((res) => {
      this.setData({
        menuList: res,
      })
      this.getMenuGoods()
    })
  },
  //获取对应一级菜单下的商品列表
  getMenuGoods() {
    http.request({
      apiName: '/products',
      method: 'GET',
      data: {
        category_id: this.data.menuList[this.data.idIndex].id
      },
    }).then((res) => {
      let dyadicArr = []; //定义一个二维数组用于存放商品列表的json数组
      dyadicArr.push(res);
      let originalArr = this.data.productList; //复制
      let newArr = originalArr.concat(dyadicArr); //合并数组
      this.setData({
        productList: newArr
      })
      this.getHeightArr(this)
    })
  },
  //点击菜单进行渲染该分类下的商品
  chooseMenu(e) {
    this.setData({
      idIndex: e.currentTarget.dataset.index,
      toView: e.currentTarget.dataset.id
    })
    this.getMenuGoods()
    // http.request({
    //   apiName: '/products',
    //   method: 'GET',
    //   data: {
    //     category_id: this.data.menuList[this.data.idIndex].id
    //   },
    //   isShowProgress: true,
    // }).then((res) => {
    //   this.setData({
    //     productList: res
    //   })
    // })
  },
  getHeightArr(self) {
    let height = 0,//初始高度0
      height_arr = [],
      details = self.data.productList,//复制productlist
      winHeight = self.data.winHeight-204;
    for (let i = 0; i < details.length; i++) {
      var last_height = 60 + details[i].length * 90;
      if (i == details.length - 1) {
        
        console.log(last_height,winHeight)
        // debugger
        last_height = (last_height > winHeight ? last_height : winHeight+50 )
        
      }
      height += last_height;

      height_arr.push(height);
    }
    self.setData({
      height_arr: height_arr
    });
    

  },
  //view-scroll滚动触发
  scroll(e) {
    let self = this;
    let scrollTop = e.detail.scrollTop;
    wx.getSystemInfo({
      success: res => {
        scrollTop = scrollTop* (750 / res.windowWidth)
      }
    })
    self.scrollmove(self, scrollTop)
  },
  scrollmove(self, scrollTop) {
    /**
     * @{scrollTop}:当前滚动条高度(原单位是:px-->换成rpx)
    */
    // last_scrollTop=scrollTop;
    console.log(self.data.height_arr)
    console.log(scrollTop)
    let scrollArr = self.data.height_arr;
    if (scrollTop > scrollArr[scrollArr.length - 1] - self.data.winHeight -204) {
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
  }

})