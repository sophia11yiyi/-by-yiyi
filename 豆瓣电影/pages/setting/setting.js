var app = getApp();
Page({
  data: {
    cache: [{
      iconUrl: '../../images/icon/wx_app_clear.png',
      title: '缓存清理',
      tap: 'clearCache'
    }],
    device: [
      {
        iconUrl: '../../images/icon/wx_app_cellphone.png',
        title: '系统信息',
        tap: 'showSystemInfo'
      },
      {
        iconUrl: '../../images/icon/wx_app_network.png',
        title: '网络状态',
        tap: 'showNetWork'
      },
      {
        iconUrl: '../../images/icon/wx_app_location.png',
        title: '地图显示',
        tap: 'showMap'
      },
      {
        iconUrl: '../../images/icon/wx_app_compass.png',
        title: '指南针',
        tap: 'showCompass'
      },
      {
        iconUrl: '../../images/icon/wx_app_lonlat.png',
        title: '当前位置、速度',
        tap: 'showLonLat'
      },
      {
        iconUrl: '../../images/icon/wx_app_shake.png',
        title: '摇一摇',
        tap: 'shake'
      },
      {
        iconUrl: '../../images/icon/wx_app_scan_code.png',
        title: '二维码',
        tap: 'scanQRCode'
      }
    ],
    api: [{
      iconUrl: '/images/icon/wx_app_list.png', title: '下载pdf、word文档', tap: 'downloadDocumentList'
    }]

  },
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.g_userInfo
    })
  },
  //清除缓存
  clearCache: function () {
    wx.showModal({
      title: '缓存清理',
      content: '确定要清除本地缓存吗?',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorage({
            success: function () {
              wx.showToast({
                title: "缓存清理成功",
                duration: 1000,
                mask: true,
                icon: "success"
              })
            }
          })
        } else {
          wx.showToast({
            title: "取消缓存清理",
            duration: 1000,
            mask: true,
          })
        }
      }
    })
  },
  //系统信息
  showSystemInfo: function () {
    wx.navigateTo({
      url: 'device/device',
    })
  },
  //网络状态
  showNetWork: function () {
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        var networkType = res.networkType;
        wx.showModal({
          title: '网络状态',
          content: '您当前的网络：' + networkType,
        })
      }
    })
  },
  //地图上显示位置
  showMap: function () {
    var that = this;
    this.getlonlat(function (lon, lat) {
      wx.openLocation({
        latitude: lat,
        longitude: lon,
        scale: 10,
        name: '海底捞',
        address: "xx街xx号",
        fail: function () {
          wx.showToast({
            title: "地图打开失败",
            duration: 1000,
            icon: "cancel"
          });
        }
      })
    })
  },
  //获取东西经 速度
  getlonlat: function (callback) {
    wx.getLocation({
      success: function (res) {

        callback(res.longitude, res.altitude, res.speed);
      },
    })
  },
  //获取当前位置速度
  showLonLat: function () {
    var that = this;
    this.getlonlat(function (lon, lat, speed) {
      var lonStr = lon >= 0 ? '东经' : '西经', latstr = lat >= 0 ? '北纬' : '南纬';
      lon = lon.toFixed(2);
      lat = lat.toFixed(2);
      lonStr += lon;
      latstr += lat;
      speed = (speed || 0).toFixed(2);
      wx.showModal({
        title: '当前位置和速度',
        content: '当前位置：' + lonStr + ',' + latstr + '速度：' + speed + 'm/s',
      })
    })
  },
  //摇一摇核心代码
  shake: function () {
    var that = this;
    //启动摇一摇
    this.gravityModalConfirm(true);
    //判断手机晃动幅度
    wx.onAccelerometerChange(function (res) {
      //摇动完之后的偏移
      var x = res.x.toFixed(4), y = res.y.toFixed(4), z = res.z.toFixed(4);
      //四舍五入
      var flagx = getFlag(x, that.data.shakeData.x), flagy = getFlag(y, that.data.shakeData.y), flagz = getFlag(z, that.data.shakeData.z);
      that.data.shakeData = {
        x: res.x.toFixed(4),
        y: res.y.toFixed(4),
        z: res.z.toFixed(4)
      }
      if (flagx && flagy || flagx && flagz || flagy && flagz) {
        //如果幅度大就摇晃成功
        if (that.data.shakeInfo.enabled) {
          //播放音乐
          that.playShakeAudio();
          wx.showModal({
            title: '摇一摇',
            content: '次数' + that.data.shakeInfo.num,
          })
          that.data.shakeInfo.enabled = false;
        }
      }
    })

  },
  //启动停止摇一摇
  gravityModalConfirm: function (flag) {
    if (flag !== true) {
      flag = false;
    }
    var that = this;
    this.setData({
      shakeInfo: {
        num: 0,
        enabled: flag,
        gravityModalHidden: false,
      }
    })
  },
  //计算摇一摇偏移量
  getFlag: function (f2, f1) {
    return (Math.abs(f2 - f1) >= 1)
  },
  //摇动成功后播放音乐并增加次数
  playShakeAudio: function () {
    var that = this;
    wx.playBackgroundAudio({
      dataUrl: 'http://7xqnxu.com1.z0.glb.clouddn.com/wx_app_shake.mp3',
      title: '',
      coverImgUrl: ''
    });
    //音乐停止的回掉
    wx.onBackgroundAudioPause(function () {
      that.data.shakeInfo.num++;
      that.setData({
        shakeInfo: {
          num: that.data.shakeInfo.num,
          enabled: true,
          gravityModalHidden: false
        }
      })

    })

  },



  //二维码功能
  scanQRCode: function () {
    var that = this;
    wx.showModal({
      title: '扫描二维码啦',
      content: '哦耶',
      success: function (res) {
        if (res.confirm) {
          wx.scanCode({
            success: function (res) {
              console.log('成功')
            },
            fail: function (res) {
              console.log('扫描二维码失败')
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


})