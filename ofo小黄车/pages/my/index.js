// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '未登录'
    },
    actionText: "登录",
    lock: false//登陆状态按钮 false是未登录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取本地缓存用户信息数据
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        that.setData({
          userInfo: {
            avatarUrl: res.data.userInfo.avatarUrl,
            nickName: res.data.userInfo.nickName
          },
          actionText: res.data.actionText,
          lock: true
        })

      },
    })
  },
  //按钮 点击登陆退出
  bindAction: function (e) {
    //如果没登录，点击登陆
    if (!this.data.lock) {
      wx.showLoading({
        title: '登陆中',
      });
      wx.login({
        success: (res) => {
          wx.hideLoading();
          wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
              console.log(res)
              this.setData({
                userInfo: {
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl
                },
                actionText: '退出登录',
                lock: true
              });
              //存储信息到本地
              wx.setStorage({
                key: 'userInfo',
                data: {
                  userInfo: {
                    nickName: res.userInfo.nickName,
                    avatarUrl: res.userInfo.avatarUrl
                  },
                  actionText: '退出登录',
                  lock: true
                },
                success:function(){
                  console.log('存储成功')
                }
              })
            }
          })

        }
      })

    }else{
      //登陆了点击退出登陆
      wx.showModal({
        title: '确定退出？',
        content: '退出了就不能使用ofo啦',
        success:(res)=>{
          if(res.confirm){
            console.log('退出登陆')
            wx.removeStorageSync('userInfo')
            this.setData({
              userInfo: {
                avatarUrl: '',
                nickName: '未登录'
              },
              actionText: "登录",
              lock: false
            })
          }else{
            console.log('取消退出登陆')
            lock: true
          }

        }
      })

    }
  },
  movetoWallet:function(e){
    wx.navigateTo({
      url: '../wallet/index',
    })

  }
})