// 引用后端云服务(const常量声明，通常大写)
const AV = require('../../utils/av-weapp-min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //车牌号,备注
    inputValue: {
      num: 0,
      desc: ""
    },
    //拍照，相册
    actionText: '拍照/相册',
    //选择了的加一个背景颜色
    submitColor: '#fff',
    submitText: '提交',
    //选择的故障内容
    checkdedValue: [],
    //拍照图片列表
    imageLists: [],
    items: [
      { checkded: false, value: '轮胎坏了', name: '轮胎坏了' },
      { checkded: false, value: '车锁坏了', name: '车锁坏了' },
      { checkded: false, value: '违规停车', name: '违规停车' },
      { checkded: false, value: '密码错误', name: '密码错误' },
      { checkded: false, value: '刹车坏了', name: '刹车坏了' },
      { checkded: false, value: '其他错误', name: '其他错误' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 多选框事件
   */
  checkboxChange: function (e) {
    let type = e.detail.value;
    // console.log(e)
    if (type.length == 0) {
      this.setData({
        submitColor: '#fff'
      })
    } else {
      this.setData({
        checkdedValue: type,
        submitColor: '#fdec0d'
      })
      // console.log(this.data.checkdedValue)
    }
  },

  /**
   *拍照接口
   */
  takePicture: function () {
    if (this.data.imageLists.length > 7) {
      wx.showModal({
        title: '哎呀呀',
        content: '只能传8张图片哟',
        showCancel: false,
        confirmText: '好的啦',
        confirmColor: '#fdec0d'
      })
      console.log('只能传八张图片哟');
      return
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imageList = res.tempFilePaths;
        var images = this.data.imageLists;
        for (let i of imageList) {
          images.push(i);
          this.setData({
            imageLists: images
          })
          // console.log(this.data.imageLists)
          //得找个地方存起来选择的图片，LeanCloud 为小程序提供一站式后端云服务，
          var tempFilePath = res.tempFilePaths[0];
          new AV.File('file-name', {
            blob: {
              uri: tempFilePath,
            },
          }).save().then(
            file => console.log(file.url())
            ).catch(console.error);
        }
      }
    })
  },
  /**
   * 车牌号
   */
  numberChange: function (e) {
    console.log(e)
    this.setData({
      inputValue: {
        num: e.detail.value,
        desc: this.data.inputValue.desc
      }
    })
  },
  /**
 * 备注
 */
  descChange: function (e) {

    this.setData({
      inputValue: {
        desc: e.detail.value,
        num: this.data.inputValue.num
      }
    })
  },
  /**
   * 提交数据
   */
  submit: function (e) {
    if (this.data.checkdedValue.length > 0 && this.data.imageLists.length > 0) {
      e
      wx.request({
        url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/msg',
        data: {

        },
        method: 'get',
        success: function (res) {
          wx.showToast({
            title: res.data.data.msg,
            icon: 'success',
            duration: 2000
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },2000)
        }
      })
    } else {
      wx.showModal({
        title: "请填写反馈信息",
        content: '看什么看，赶快填反馈信息啊',
        confirmText: "填填填",
        cancelText: "劳资不填",
        success: (res) => {
          if (res.confirm) {
            // 继续填
          } else {
            console.log("back")
            wx.navigateBack({
              delta:1 // 回退前 delta(默认为1) 页面
            })
          }
        }
      })
    }
  },
  delPic: function (e) {
    let index = e.target.dataset.index;
    let images = this.data.imageLists;
    images.splice(index, 1);
    this.setData({
      imageLists: images
    })

  }
})