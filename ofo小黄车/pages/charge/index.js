// pages/charge/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  inputValue:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  bindinput:function(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  //充值跳转成功显示 返回上一页
  charge:function(){
    if (this.data.inputValue <= 0 || isNaN(this.data.inputValue)){
      wx.showModal({
        title: '哎呀输错啦',
        content: '我要的是钱呀',
        showCancel:false,
        confirmText:'给钱哟'
      })
    }else{
      wx.redirectTo({
        url: '../wallet/index',
        success:(res)=>{
          wx.showToast({
            title: '恭喜你充值成功啦',
            icon:'success',
            duration:2000
          })
        }
      })
    }
  },
  //页面关闭，更新本地金额
  onUnload:function(e){
    var that=this
    wx.getStorage({
      key: 'balance',
      success: function(res) {
        wx.setStorage({
          key: 'balance',
          data: { money: parseInt(res.data.money) + parseInt(that.data.inputValue)}
        })
      },
           // 如果没有本地金额，则设置本地金额
      fail:(res)=>{
        wx.setStorage({
          key: 'balance',
          data: { money:parseInt(this.data.inputValue) }
        })
      }
    })
  }


})