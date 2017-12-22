//index.js
//获取应用实例
var app = getApp();
var {Package} = require('../common/Package');
Page(new Package({
  url: 'searchpacklist',
  route: 'pages/search/index',
  onLoad: function (options) {
    this.setData({
      keyword: options.keyword,
      isShowColse: options.keyword === '' ? false : true
    });

    this.getData();
  },
  searchTap: function (e) {
    var keyword = e.detail.value.trim();
    if (keyword === '') {
      wx.showToast({
        title: '请输入礼包名称',
        image: '../../images/tip.png',
        duration: 1000
      })
      this.setData({
        keyword: ''
      })
      return;
    }
    this.setData({
      keyword: keyword,
    })
    this.data.packageLists = [];
    this.page = 0;
    this.isNext = true;
    this.getData()
  },
  getParam: function () {
    return {
      Key: this.data.keyword,
      Platform: this.getApp().platform,
      Page: this.page
    }
  },
  onShareAppMessage: function () {
    return {
      title: '手游礼包大全',
      desc: '最新、最全的礼包',
      path: 'pages/search/index?keyword=' + this.data.keyword
    }
  },
  noData: function () {
    this.setData({
      loadingTxt: '没有搜索到礼包！',
      packageLists:[]
    })
  }
}))
