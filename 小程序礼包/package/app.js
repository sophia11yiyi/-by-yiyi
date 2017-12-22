//app.js
App({
  onLaunch: function () {
    this.base = 'https://httpsinterface.gao7.com/pack/';
    var sesstion_3rd = wx.getStorageSync('sesstion_3rd');//获取本地缓存
   
    if (sesstion_3rd === '') {
      this.login();//获取登录界面
    } else {
      this.sesstion_3rd = sesstion_3rd;
      this.checkLogin();
    }
    this.platform = wx.getSystemInfoSync().system.indexOf('Android') > -1 ? 'andriod' : 'ios';
  },
  login: function () {
    var _self = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          _self.getSesstion(res.code)
        } else {
          _self.sesstion_3rd = '';
          console.log('获取用户登录态失败！' + res.data.errMsg)
        }
      }
    });
  },
  getSesstion: function (code) {
    var _self = this;
    wx.request({
      url: this.base + 'WxLogin',
      data: {
        "code":code
      },
      method: 'Get',
      success: function (res) {
        console.log(res)
        if (res.data.ResultCode == '0') {
          wx.setStorage({
            key: "sesstion_3rd",
            data: res.data.Data
          })
          _self.sesstion_3rd = res.data.Data;
        }
      }
    })
  },
  checkLogin: function () {
    var _self = this;
    wx.checkSession({
      success: function () {
        console.log('登录态未过期')
        //登录态未过期
      },
      fail: function () {
        //登录态过期
        _self.login();
      }
    })
  }
})