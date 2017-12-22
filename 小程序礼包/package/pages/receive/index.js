var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packageDetail:null,
    codes:[],
    canIUse: wx.canIUse('button.open-type.share')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.data){
        app.packageDetail = JSON.parse(options.data)
      }
      this.setData({
        packageDetail: app.packageDetail
      })
      app.packageDetail = null;
  },
  tapHandle:function(e){
    this.url = e.target.dataset.url;
    this.receiveCode();
  },
  hidePopup:function(){
    this.setData({
      codes:[]
    })
  },
  copy:function(e){
    var index = e.target.dataset.index;
    wx.setClipboardData({
      data: this.data.codes[index],
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  changeCode:function(){
    this.receiveCode();
  },
  receiveCode:function(){
    if(this.isLoading){
      return;
    }
    this.isLoading = true;
    wx.showLoading({
      title: this.url === 'GetPackCode'?'领取中...':'淘号中...',
      mask:true 
    })
    var _self = this;
    wx.request({
      url: app.base + this.url,
      data: {
        id: this.data.packageDetail.PackPlaceInfo.PackID,
        sesstion3rd: app.sesstion_3rd
      },
      success: function (res) {
        var codes = []
        if (res.data.ResultCode === '0') {
          if (_self.url === 'GetPackCode'){
            codes.push(res.data.Data.PackCode)
          }else{
            res.data.Data.forEach(function(item,index){
              codes.push(item.PackCode);
            })
          }
          _self.setData({
              codes:codes
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.ResultMessage,
          })
        }
      },
      complete: function () {
        _self.isLoading = false;
        wx.hideLoading()
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '手游礼包大全',
      desc: '最新、最全的礼包',
      path: 'pages/receive/index?data=' + JSON.stringify(this.data.packageDetail)
    }
  }
})