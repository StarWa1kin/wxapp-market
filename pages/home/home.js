const http = require('../../utils/request.js')
// const func=require('../../utils/globalFunc.js')
import {
  submitLocalCar,
  computed
} from '../../utils/globalFunc.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //Banner
    bannerList: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000, //切换时间
    duration: 1000, //滑动时长
    circular: true, //无缝轮播
    // 促销信息
    currentPage: 1,
    goodsList: [],
    isEnd: false,
    needReshow: false,
    bubble: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBanner();
    this.getList();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setScrollHeight()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //请求购物车 
    this.loadCar()
    // this.getList(); //请求商品列表
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    submitLocalCar();
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
    // debugger
    this.slideBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 自定义函数
   */
  //跳转搜索页面
  goSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // 跳转购物车页面
  toPay() {
    wx.navigateTo({
      url: '../submitOrder/submitOrder',
    })
  },
  //设置scroll组件的高度
  setScrollHeight() {
    wx.getSystemInfo({
      success: res => {
        let realHeight = (res.windowHeight * (750 / res.windowWidth) - 532);
        this.setData({
          //换算成rpx
          winHeight: realHeight
        })

      }
    })
  },
  //获取轮播图
  getBanner() {
    http.request({
      apiName: '/banners',
      method: 'GET',
    }).then((res) => {
      this.setData({
        bannerList: res
      })
    })
  },
  //初始化取促销商品列表
  getList() {
    http.request({
      apiName: '/products',
      method: 'GET',
      is_promotion: '1',
      data: {
        page: this.data.currentPage
      },
      isShowProgress: true,
    }).then(res => {
      //默认先回显为0
      res.forEach(function(item, index) {
        item.reshowNum = 0
      })
      if (res.length == 0) {
        //页码已经请求不出数据即数据已全部加载
        this.setData({
          isEnd: true
        })
      } else {
        //合并操作
        let conArr = this.data.goodsList.concat(res);
        this.setData({
          goodsList: conArr,
          needReshow: true
        })
      }
    })
  },

  //单纯加载购物车
  loadCar(goodsList) {
    http.request({
      apiName: '/carts',
      method: 'GET',
    }).then(res => {
      //请求购物车列表处理成本地全局变量
      // app.globalData.globalCar = res;
      //购物车无商品会显0
      if (res.length == 0) {
        this.setData({
          bubble: 0,
        })
      }
      //购物车有商品
      else {
        //存全局变量
        app.globalData.globalCar = [];
        for (let value of res) {
          let json = {};
          json.id = value.id;
          json.product_id = value.product_id;
          json.quantity = value.quantity;
          json.product == value.product;
          app.globalData.globalCar.push(json)
        }
        this.setData({
          bubble: res.length,
        })
      }
      this.reshow();
    })
  },
  //商品+1
  add(e) {
    let goosId = e.currentTarget.id;
    if (!app.globalData.globalCar.length) {
      let json = {};
      json.product_id = goosId;
      json.quantity = 1;
      app.globalData.globalCar.push(json)
    } else {
      //购物车有商品
      let swiCh = false;
      for (let index in app.globalData.globalCar) {
        if (app.globalData.globalCar[index].product_id == goosId) {
          app.globalData.globalCar[index].quantity += 1;
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
  //input修改
  changeNum(e) {
    let goodsId = e.currentTarget.dataset.id;
    let quantity = parseInt(e.detail.value);
    for (let index in app.globalData.globalCar) {
      if (app.globalData.globalCar[index].product_id == goodsId) {
        app.globalData.globalCar[index].quantity = quantity;
      }
    }
    this.setData({
      localCar: app.globalData.globalCar,
      bubble: app.globalData.globalCar.length
    })
    this.reshow()

  },
  reshow() {
    let goodsList = this.data.goodsList;
    let car = app.globalData.globalCar;
    if (car.length == 0) {
      goodsList.forEach(item => {
        item.reshowNum = 0
      })
    } else {
      for (let index in goodsList) {
        for (let i in app.globalData.globalCar) {
          if (app.globalData.globalCar[i].product_id == goodsList[index].id) {
            goodsList[index].reshowNum = app.globalData.globalCar[i].quantity
          }
        }
      }
    }

    this.setData({
      goodsList: goodsList
    })
  },
  //页面触底
  slideBottom() {
    //首先判断是否加载到末页
    if (this.data.isEnd) {
      return;
    }
    let page = this.data.currentPage + 1;
    this.setData({
      currentPage: page
    })
    this.getList();
    //每次下滑也要 触发回显函数
    if (this.data.needReshow) {
      this.reshow()
    }
  }

})