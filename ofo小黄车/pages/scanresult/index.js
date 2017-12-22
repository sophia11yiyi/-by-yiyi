// pages/scanresult/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    //初始解锁密码
    this.setData({
      password: options.password,
    })
    let num = 10;
    that.timer=setInterval(function () {
      that.setData({
        num: --num,
      });
      if (num <= 0) {
        clearInterval(that.timer)
        wx.redirectTo({
          url: '../billing/index?number=' + options.number
        })
      }
    }, 1000);
  },
//点击回到首页去报障
  moveToWarn:function(){
    clearInterval(this.timer);
    wx.redirectTo({
      url: '../map/index'
    })
  }
})