// pages/map/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {
      longitude: 0,
      latitude: 0,
      scale: 18
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断是否在用车
    this.timer = options.timer
    // console.log(options.timer)
    var that = this
    //1,获取并设置当前的经纬度
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        // console.log(res)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
    });
    //2,设置地图控件的位置大小 ,通过设备宽高来定义
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          controls: [{
            id: 1,
            iconPath: '/images/location.png',
            position: {
              left: 20,
              width: 50,
              height: 50,
              top: res.windowHeight - 100
            },
            clickable: true
          }, {
            id: 5,
            iconPath: '/images/avatar.png',
            position: {
              width: 45,
              height: 45,
              top: res.windowHeight - 175,
              left: res.windowWidth - 68
            },
            clickable: true
          }, {
            id: 3,
            iconPath: '/images/warn.png',
            position: {
              left: res.windowWidth - 70,
              width: 50,
              height: 50,
              top: res.windowHeight - 100
            },
            clickable: true
          },
          {
            id: 4,
            iconPath: '/images/marker.png',
            position: {
              left: res.windowWidth / 2 - 11,
              top: res.windowHeight / 2 - 45,
              width: 22,
              height: 45,
            },
            clickable: true
          },
          {
            id: 2,
            iconPath: '/images/use.png',
            position: {
              left: res.windowWidth / 2 - 45,
              width: 90,
              height: 90,
              top: res.windowHeight - 120
            },
            clickable: true
          }
          ]
        })
      },
    });
    //3.请求服务器，获取附近的小黄车，用marker标记
    wx.request({
      url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
      data: {},
      method: 'GET',
      success: (res) => {
        this.setData({
          markers: res.data.data
        })
      }
    })

  },
  // 页面显示    // 1.创建地图上下文，移动当前位置到地图中心
  onShow: function () {
    this.mapCtx = wx.createMapContext("ofoMap");
    this.moveToLocation()
  },
  //地图控件点击事件
  bindcontroltap: function (e) {
    console.log(e.controlId)
    switch (e.controlId) {
      case 1: this.moveToLocation();
        break;
      //点击立即用车，得判断是否在使用，计费
      case 2: if (this.timer === '' || this.timer === undefined) {

        //没有用车就扫码
        wx.scanCode({
          success: (res) => {
            wx.showLoading({
              title: '正在获取密码',
              mask: true
            })
            //请求服务器获取接口
            wx.request({
              url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/password',
              data: {},
              method: 'GET',
              success: function (res) {
                console.log(res)
                //关闭loading
                wx.hideLoading();
                //跳转到车号密码页
                wx.redirectTo({
                  url: '../scanresult/index?password=' + res.data.data.password + '&number=' + res.data.data.number,
                  success: function (res) {
                    console.log(res);
                    wx.showToast({
                      title: '获取密码成功',
                      duration: 2000
                    })
                  }
                })

              }

            })
          }
        })
      } else {
        //当前已经在计费，退回计费页
        wx.navigateBack({
          delta: 1
        })
      }
        break;
      //保障控件，跳转到故障页
      case 3: wx.navigateTo({
        url: '../warn/index'
      });
        break;
      //点击头像到个人主页 
      case 5: wx.navigateTo({
        url: '../my/index'
      });
        break;
      default: break;
    }
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation();
  },
  //视野变化触发事件
  bindregionchange: function (e) {
    var that = this
    if (e.type === 'begin') {
      //获取附近得自行车
      wx.request({
        url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
        data: {},
        success: function (res) {
          console.log(res)
          that.setData({
            _markers: res.data.data
          })
        }
      })
    } else if (e.type === 'end') {
      that.setData({
        markers: this.data._markers
      })
    }
  },
  //地图标记点触发
  bindmarkertap: function (e) {
    console.log(e)
    let _markers = this.data.markers;
    let markerId = e.markerId;
    let currentMarker = _markers[markerId];
    this.setData({
      //坐标点连线获取
      polyline: [{
        points: [{
          longitude: this.data.longitude,
          latitude: this.data.latitude
        },
        {
          longitude: currentMarker.longitude,
          latitude: currentMarker.latitude
        }],
        color: "#FF0000DD",
        width: 2,
        dottedLine: true
      }],
      scale: 18
    })
  }

})