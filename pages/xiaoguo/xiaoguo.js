const app = getApp()
const http = require('../../utils/request.js')


Page({
  data: {
    scrollTop: 0,
    last_scrollTop: 0,
    toView: 0,
    navActive: 0,
    lastActive: 0,
    s_height: '',
    height_arr: [],
    category:[],
    detail:[]
    // category: [{
    //     categoryName: '零食'
    //   },
    //   {
    //     categoryName: '饮料'
    //   },
    //   {
    //     categoryName: '日常'
    //   },
    //   {
    //     categoryName: '电器'
    //   }
    // ],
    // detail: [
    //   [{
    //     goodsName: '可比克薯片',
    //     goodsPrice: '3.8'
    //   }, {
    //     goodsName: '巧克力',
    //     goodsPrice: '10.8'
    //   }, {
    //     goodsName: '旺仔小馒头',
    //     goodsPrice: '8.0'
    //   }, {
    //     goodsName: '烤馍片',
    //     goodsPrice: '1.0'
    //   }],
    //   [{
    //     goodsName: '可口可乐',
    //     goodsPrice: '2.5'
    //   }, {
    //     goodsName: '脉动',
    //     goodsPrice: '4.5'
    //   }, {
    //     goodsName: '7喜',
    //     goodsPrice: '3.0'
    //   }, {
    //     goodsName: '康师傅矿泉水',
    //     goodsPrice: '1.0'
    //   }],
    //   [{
    //     goodsName: '牙刷',
    //     goodsPrice: '2.5'
    //   }, {
    //     goodsName: '拖鞋',
    //     goodsPrice: '8.0'
    //   }, {
    //     goodsName: '胶带',
    //     goodsPrice: '3.0'
    //   }, {
    //     goodsName: '笔记本',
    //     goodsPrice: '3.0'
    //   }],
    //   [{
    //     goodsName: '小米6',
    //     goodsPrice: '2499.0'
    //   }, {
    //     goodsName: '华为p10',
    //     goodsPrice: '2099.0'
    //   }, {
    //     goodsName: '荣耀20',
    //     goodsPrice: '1699.0'
    //   }, {
    //     goodsName: '红米6',
    //     goodsPrice: '899.0'
    //   }],
    // ]
  },
  //获取一级菜单列表
  getMenuList() {
    http.request({
      apiName: '/categories',
      method: 'GET',
      // isShowProgress: true,
    }).then((res) => {
      this.setData({
        category: res,
      })
      for(let index in res){
        this.getMenuGoods(res[index].id,this)
      }
    })
  },
  //获取对应一级菜单下的商品列表
  getMenuGoods(param,self) {
    
    http.request({
      apiName: '/products',
      method: 'GET',
      data: {
        category_id: param
      },
    }).then((res) => {
      let dyadicArr = []; //定义一个二维数组用于存放商品列表的json数组
      dyadicArr.push(res);
      let originalArr = self.data.detail; //复制
      let newArr = originalArr.concat(dyadicArr); //合并数组
      self.setData({
        detail: newArr
      })
      console.log(self.data.detail)
      
    })
  },
  tap: function(e) {
    // debugger
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      toView: id,
      navActive: index
    });
  },
  scroll: function(e) {
    var self = this;
    self.scrollmove(self, e, e.detail.scrollTop);
    
  },
  scrollmove: function(self, e, scrollTop) {
    // last_scrollTop=scrollTop;
    var scrollArr = self.data.height_arr;
    if (scrollTop > scrollArr[scrollArr.length - 1] - self.data.s_height) {
      return;
    } else {
      for (var i = 0; i < scrollArr.length; i++) {
        // debugger
        if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
          if (0 != self.data.lastActive) {
            self.setData({
              navActive: 0,
              lastActive: 0
            });
          }
        } else if (scrollTop >= scrollArr[i - 1] && scrollTop <= scrollArr[i]) {
          // debugger
          if (i != self.data.lastActive) {
            self.setData({
              navActive: i,
              lastActive: i
            });
          }
        }
      }
    }
  },
  onLoad: function() {
    this.getMenuList()
    var s_height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      s_height: s_height
    });
    this.getHeightArr(this);
  },
  getHeightArr: function(self) {
    var height = 0,
      height_arr = [],
      details = self.data.detail,
      s_height = self.data.s_height;
    for (var i = 0; i < details.length; i++) {
      var last_height = 30 + details[i].length * 90;
      if (i == details.length - 1) {
        last_height = last_height > s_height ? last_height : s_height + 50;
      }
      height += last_height;

      height_arr.push(height);
    }
    self.setData({
      height_arr: height_arr
    });
  }
})