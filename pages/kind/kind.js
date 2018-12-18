const http = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: '', //可用窗口高度
    clickIcon: false, //控制模态框的弹出
    menuList: [], //菜单列表
    num: 1, //菜单默认选中第一项,
    shoppingList: [], //购物车列表
    bubble: 0,
    total: 0, //合计金额
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
    wx.navigateTo({
      url: '../submitOrder/submitOrder',
    })
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
      console.log(res)
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
      //本地存json{id:'',quanlity:''}


    })
  },
  //清空购物车
  clearList() {
    http.request({
      apiName: '/carts',
      method: 'DELETE',
      isShowProgress: true,
    }).then((res) => {
      console.log(res)
      this.loadList()
    })
    
  },
  //获取屏幕高度设置viewscroll区域
  setArea() {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winHeight: res.windowHeight
        });
        // console.log(res)
      }
    })
  },
  //获取菜单列表
  getMenuList() {
    http.request({
      apiName: '/categories',
      method: 'GET',
      isShowProgress: true,
    }).then((res) => {
      this.setData({
        menuList: res
      })
    })
  },
  //点击菜单进行切换
  chooseMenu(e) {
    this.setData({
      num: e.currentTarget.dataset.num
    })
  },
  //切换菜单后请求该菜单下的商品列表
  goodList() {

  },
  //右边view-scroll触顶事件
  top() {
    var after = this.data.num - 1;
    if (after <= 1) {
      this.setData({
        num: 1
      })
    } else {
      this.setData({
        num: after
      })
    }

  },

  //右边view-scroll触底事件
  botttom() {
    var after = this.data.num + 1;
    console.log(this.data.menuList.length)
    if (after >= this.data.menuList.length) {
      this.setData({
        num: this.data.menuList.length
      })
    } else {
      this.setData({
        num: after += 1
      })
    }
  }
})