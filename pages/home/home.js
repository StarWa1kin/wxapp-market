const http = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000, //切换时间
    duration: 1000, //滑动时长
    circular: true, //无缝轮播
    // 促销信息
    name: '精品五花肉1kg/份',
    goodsList: [],
    bubble:0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList();

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
    this.getBanner();
    this.loadList();
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
  //跳转搜索页面
  goSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  // 跳转购物车页面
  toPay() {
    if(this.data.bubble>0){
      wx.navigateTo({
        url: '../submitOrder/submitOrder',
      })
    }else{
      wx.showToast({
        title: '购物车无商品',
        image:'../../assets/page/err.png'
      })
    }
  },
  //获取轮播图
  getBanner(){
    http.request({
      apiName: '/banners',
      method: 'GET',
    }).then((res) => {
      this.setData({
        bannerList:res
      })
    })
  },
  //初始化取商品列表
  getList() {
    http.request({
      apiName: '/products',
      method: 'GET',
      data: {
        page: 1
      },
      isShowProgress: true,
    }).then((res) => {
      for(var index in res){
        res[index].reshowNum=0
      }
      this.setData({
        goodsList: res
      })
    })
  },
  //加载购物车渲染bubble
  loadList() {
    http.request({
      apiName: '/carts',
      method: 'GET',
    }).then((res) => {
      // debugger
      if(res.length==0){
        console.log("购物车没有商品")
        var copyList = this.data.goodsList
        for (var item of copyList){
          item.reshowNum=0
        }
        this.setData({
          goodsList:copyList
        })
      }else{
        let copyGoodList = this.data.goodsList;
        for (var index in copyGoodList) {
          copyGoodList[index].reshowNum=0;//制空reshowNum属性
          for (var reshow of res) {
            if (copyGoodList[index].id == reshow.product.id) {
              copyGoodList[index].reshowNum = reshow.quantity;//添加字段用来回显数量
              copyGoodList[index].shoppingCarId=reshow.id;//添加字段控制减少购物车数量
            }
          }
        }
        this.setData({
          goodsList: copyGoodList
        })
      }
      
      //气泡
      this.setData({
        bubble: res.length
      })
    })
  },
  //商品+1
  add(e){
    let productId=e.currentTarget.id;//商品id
    let reshowIndex = e.currentTarget.dataset.index;//所添加的index索引
    let copydata=this.data.goodsList;//复制goodList
    copydata[reshowIndex].reshowNum+=1;
    this.setData({
      goodsList:copydata
    })
    // debugger

    http.request({
      apiName: '/carts',
      method: 'POST',
      data: {
        "product_id": productId,
        "quantity": 1,
      },
    }).then((res) => {
      // this.loadList()
    })
  },
  //商品-1
  subtract(e) {
    let productId = e.currentTarget.id;
    let reshowIndex = e.currentTarget.dataset.index;
    let copydata = this.data.goodsList
    copydata[reshowIndex].reshowNum -= 1
    this.setData({
      goodsList: copydata
    })
    // debugger
    let id = e.currentTarget.dataset.id; //购物车id
    // let nowQuantity = e.currentTarget.dataset.quantity - 1;
    http.request({
      apiName: '/carts/' + id,
      method: 'PUT',
      data: {
        "quantity": copydata[reshowIndex].reshowNum,
      },
    }).then((res) => {
      // this.loadList()
    })
  }
})