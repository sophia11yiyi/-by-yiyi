
var {Package} = require('../common/Package');
Page(new Package({
  url: 'PackGetInfo',
  route: 'pages/index/index',
  page:0,
  getParam: function () {
    return {
      sesstion3rd: this.getApp().sesstion_3rd,
      Page: this.page,
    }
  },
  success: function (res) {
    if (res.data.ResultCode === 'Success') {
      this.page++;
      var _data = res.data.Data;
      this.isNext = _data.pageCount - this.page * 10 > 0;
      this.setData({
        packageLists: this.data.packageLists.concat(_data.MyList),
        loadingTxt: this.isNext ? this.loadingMore : this.loadingNo
      })
    }else{
      if (res.data.Data ===null){
        this.setData({
          loadingTxt: '您还没有领取礼包！'
        })
      }
    }
  },
  onload:function(){},
  onShow:function(){
    this.page = 0;
    this.isNext = true;
    this.data.packageLists=[];
    this.getData()
  },
  copy:function(e){
    var code = e.target.dataset.code;
    wx.setClipboardData({
      data: code,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  }
}))