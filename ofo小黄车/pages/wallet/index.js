// pages/wallet/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    money: 0,
    ticket: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 页面加载完，更新本地数据
   */
  onReady:function(){
    wx.getStorage({
      key: 'balance',
      success: (res) => {
        this.setData({
          money: res.data.money
        })
      }
    })
  },
  /**
   * 页面显示完成，获取本地数据
   */
  onShow:function(){
    wx.getStorage({
      key: 'balance',
      success: (res) => {
        this.setData({
          money: res.data.money
        })
      }
    })

  },
  //余额说明
  blanceIntro: function (e) {
    wx.showModal({
      title: "福利来袭",
      content: "充值余额100.00元,赠送余额100.00元",
      showCancel: false,
      confirmText: "我知道了",
    })
  },
  //充值跳转话费
  rechargeM: function (e) {
    wx.navigateTo({
      url: '../charge/index',
    })
  },
  //退回押金
  rebackCash:function(){
    wx.showModal({
      title: '真的要退押金嘛',
      content: '不要离开我呀',
      cancelText:'继续使用',
      cancelColor: "#fdec0d",
      confirmText: "押金退款",
      confirmColor: "#ccc",
      success:(res)=>{
        if(res.confirm){
          wx.showToast({
            title: '退款成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  //我的券
  myTickets:function(){
    if(this.data.ticket===0){
      this.setData({
        content:'您没有用车券了哟'
      })
    }else{
      this.setData({
        content: '您还有' + this.data.ticket+'张券哟'
      })
    }
    wx.showModal({
      title: '',
      content: this.data.content,
      showCancel: false,
      confirmText: '知道啦',
      success:(res)=>{
        console.log(res)
      }
    })

  },
  //关于ofo
  showOfo:function(){
    wx.showModal({
      title: '最有颜值的共享单车',
      content: '选择我的人都是小仙女，大帅哥',
      showCancel:false,
      confirmText:'呦呦哟',
      confirmColor:'#fdec0d'
    })
  }

})