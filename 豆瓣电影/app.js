//app.js
App({
  onLaunch:function(){
    //获取本地缓存数据
    var storageData = wx.getStorageSync('postlist');
    if (!storageData){
      var dataObj=require("data/post-data.js");
      wx.clearStorageSync();
      //清除本地缓存数据
      wx.setStorageSync('postList', dataObj.postList);
    }
    this._getUserInfo();


  },

  _getUserInfo:function(){
    var userInfoStorage = wx.getStorageSync('user');
    if (!userInfoStorage){
      var that=this;
      wx.login({
        success: function (){
          wx.getUserInfo({
            success: function (res){
              console.log(res);
              that.globalData.g_userInfo = res.userInfo
              wx.setStorageSync('user', res.userInfo);
            },
            fail:function(res){
              console.log(res);
            }
          })
        }
      })
    }else{
      this.globalData.g_userInfo=userInfoStorage;
    }
  },
  globalData: {
    g_isPlayingMusic: false,
    doubanBase: 'https://api.douban.com',
    g_userInfo:null
  },

})