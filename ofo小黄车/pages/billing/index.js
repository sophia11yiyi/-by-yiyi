// pages/billing/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hours:0,
    minuters:0,
    seconds:0,
    billing:'正在计费'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    //获取车牌号，设置定时器
    this.setData({
      number:options.number,
      timer:this.timer
    })
    let s=0,m=0,h=0;
    // 计时开始
    this.timer = setInterval(() => {
      this.setData({
        seconds: s++
      })
      if (s == 60) {
        s = 0;
        m++;
        setTimeout(() => {
          this.setData({
            minuters: m
          });
        }, 1000)
        if (m == 60) {
          m = 0;
          h++
          setTimeout(() => {
            this.setData({
              hours: h
            });
          }, 1000)
        }
      };
    }, 1000)  
  },
  endRide:function(){
    clearInterval(this.timer);
    this.timer='';
    this.setData({
      billing: "本次骑行耗时",
      disabled: true
    })
  },
  backMap:function(){
    if(this.timer==''){
        wx.redirectTo({
          url: '../map/index',
        })
    }else{
      //没有关闭行程就回到首页就带着计时器回到首页
      wx.navigateTo({
        url: '../map/index?timer=' + this.timer
      })

    }
  }

})