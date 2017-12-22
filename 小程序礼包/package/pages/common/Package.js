var app = getApp();
function Package(options) {
  var options = options || {};
  this.loadingTxt = '正在加载中...';
  this.loadingMore = '上拉加载更多！';
  this.loadingNo = '没有更多礼包了！';
  this.page = 1;
  this.data = {
    loadingTxt: this.loadingTxt,
    packageLists:[],
    canIUse:wx.canIUse('button.open-type.share'),
    keyword:'',
    isShowColse:false
  }
  this.isLoading = false;
  this.isNext = true;
  Object.assign(this, options);
}
Package.prototype.onLoad = function () {
  this.getData()
}
Package.prototype.onReachBottom = function () {
    this.getData();
}
Package.prototype.searchTap = function (e) {
  var keyword =  e.detail.value.trim();
  if ( keyword === '' ){
    wx.showToast({
      title:'请输入礼包名称',
      image:'../../images/tip.png',
      duration:1000
    })
    this.setData({
      keyword:''
    })
      return;
  }
  wx.navigateTo({
    url: '../search/index?keyword=' + keyword
  })
}
Package.prototype.bindinput = function (e) {
  var keyword = e.detail.value.trim();
  if (keyword == ''){
    this.data.isShowColse && this.setData({isShowColse:false})
  }else{
    !this.data.isShowColse && this.setData({ isShowColse: true })
  }
}
Package.prototype.clear = function () {
  this.setData({
    keyword: '',
    isShowColse:false
  })
}
Package.prototype.getParam = function(){
    return {
      type:this.type || 'all',
      Platform: app.platform,
      Page:this.page,
    }
}

Package.prototype.onShareAppMessage = function () {
  return {
    title: '手游礼包大全',
    desc: '最新、最全的礼包',
    path: this.route
  }
}

Package.prototype.getData = function () {
  if (this.isLoading || !this.isNext){
    return;
  }
  this.setData({
    loadingTxt: this.loadingTxt
  })
  this.isLoading = true;
  var _self = this;
  wx.request({
    url: app.base + this.url,
    data: this.getParam(),
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      _self.success(res)
    },
    complete:function(){
      _self.isLoading = false;
    }
  })
}
Package.prototype.success = function(res){
  if (res.data.ResultCode === '0') {
    var _data = res.data.Data;
    this.isNext = _data.RecordCount - this.page * 10 > 0;
    this.setData({
      packageLists: this.data.packageLists.concat(_data.PackResultInfoList),
      loadingTxt: this.isNext ? this.loadingMore : this.loadingNo
    })
    this.page++;
  }else{
    res.data.Data === null && this.noData && this.noData();
  }
}
Package.prototype.receiveCode = function (e) {
  var index = e.target.dataset.index;
  app.packageDetail = this.data.packageLists[index];
  wx.navigateTo({
    url: '../receive/index'
  })
}
Package.prototype.getApp = function (e) {
  return app;
}
module.exports.Package = Package;