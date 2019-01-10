const app = getApp()

Page({
  data: {
    scrollTop: 0,
    last_scrollTop: 0,
    toView: 0,
    navActive: 0,
    lastActive: 0,
    s_height: '',
    height_arr: [],
    category: [{
        categoryName: '零食'
      },
      {
        categoryName: '饮料'
      },
      {
        categoryName: '日常'
      },
      {
        categoryName: '电器'
      }
    ],
    detail: [
      [{
        goodsName: '可比克薯片',
        goodsPrice: '3.8'
      }, {
        goodsName: '巧克力',
        goodsPrice: '10.8'
      }, {
        goodsName: '旺仔小馒头',
        goodsPrice: '8.0'
      }, {
        goodsName: '烤馍片',
        goodsPrice: '1.0'
      }],
      [{
        goodsName: '可口可乐',
        goodsPrice: '2.5'
      }, {
        goodsName: '脉动',
        goodsPrice: '4.5'
      }, {
        goodsName: '7喜',
        goodsPrice: '3.0'
      }, {
        goodsName: '康师傅矿泉水',
        goodsPrice: '1.0'
      }],
      [{
        goodsName: '牙刷',
        goodsPrice: '2.5'
      }, {
        goodsName: '拖鞋',
        goodsPrice: '8.0'
      }, {
        goodsName: '胶带',
        goodsPrice: '3.0'
      }, {
        goodsName: '笔记本',
        goodsPrice: '3.0'
      }],
      [{
        goodsName: '小米6',
        goodsPrice: '2499.0'
      }, {
        goodsName: '华为p10',
        goodsPrice: '2099.0'
      }, {
        goodsName: '荣耀20',
        goodsPrice: '1699.0'
      }, {
        goodsName: '红米6',
        goodsPrice: '899.0'
      }],
    ]
  },
  tap: function(e) {
    debugger
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      toView: id,
      navActive: index
    });
  },
  scroll: function(e) {
    var self = this;

    //self.setData({scrollTop:e.detail.scrollTop});
    //console.log("sd:",self.data.scrollTop);


    //setTimeout(function(){

    //if(self.data.last_scrollTop!=self.data.scrollTop){
    //console.log(self.data.last_scrollTop);
    //self.setData({last_scrollTop:self.data.scrollTop});
    self.scrollmove(self, e, e.detail.scrollTop);
    //}
    // },1000);

  },
  scrollmove: function(self, e, scrollTop) {
    // last_scrollTop=scrollTop;
    var scrollArr = self.data.height_arr;
    if (scrollTop > scrollArr[scrollArr.length - 1] - self.data.s_height) {
      return;
    } else {
      for (var i = 0; i < scrollArr.length; i++) {
        debugger
        if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
          if (0 != self.data.lastActive) {
            self.setData({
              navActive: 0,
              lastActive: 0
            });
          }
        } else if (scrollTop >= scrollArr[i - 1] && scrollTop <= scrollArr[i]) {
          debugger
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
    var s_height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      s_height: s_height
    });
    this.getHeightArr(this);
  },
  getHeightArr: function(self) {
    debugger
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