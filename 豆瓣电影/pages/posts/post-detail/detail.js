var postsData = require("../../../data/post-data.js")
var app=getApp();
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  data: {
    displaymusic:false
  },
  onLoad: function (options) {
    // console.log(options);
    //options就是detail地址后面的参数
    var globalData = app.globalData;
    var postId = options.id;
    this.data.currentpostid = postId;
    //加载获取的数据列表
    var postData = postsData.postlist[postId];
    // console.log(postData);
    //添加数据 对视图层渲染
    this.setData({ postData });
    //设置缓存 （缓存限制不超过10M）
    wx.setStorageSync('key', "1111");

    // var postsCollection={
    //   1:"false",
    //   1: "true",
    //   1: "false",
    //   1: "true",
    // }
    var postsCollected = wx.getStorageSync("postsCollection");
    // console.log(postsCollected)
    //拿到所有的缓存状态
    if (postsCollected) {
      //判断是否有缓存，有缓存时才能获取
      var postcollected = postsCollected[postId];
      this.setData({
        collected: postcollected
        //布尔值开始默认false
      })
    } else {
      //如果没有缓存 就将值默认为false
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("postsCollection", postsCollected)
    }
  },

  collectionTab: function (event) {
    //点击先获取所有缓存，再拿到所需要的当前缓存值
    var postsCollected = wx.getStorageSync("postsCollection");
    var postCollected = postsCollected[this.data.currentpostid];
    //收藏变为不收藏（取反）
    postCollected = !postCollected;
    // 再赋值给当前值
    postsCollected[this.data.currentpostid] = postCollected;
  // 不自动关闭的模态弹窗
    this.showToast(postCollected, postsCollected);
},
shareTab:function(){
  var itemList = ['分享到微信好友', '分享到qq', '分享到微博', '分享到朋友圈'];
    wx.showActionSheet({
      itemList:itemList,
      itemColor:"#405f80",
      success: function (res) {
        //reg.cancel 用户是否点击了取消按钮
        //res.tapIndex 数组元素从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '现在无法分享' + res.cancel,
        })
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
},
  showModal: function (postCollected, postsCollected) {
    var that=this;
    //这边this是指page;用一个变量保存
    wx.showModal({
      title: '来来来！！！收藏哟',
      content: postCollected?'收藏该文章':'取消收藏',
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#000",
      confirmText: "确定",
      confirmColor: "#000",
      success: function (res){
        if(res.confirm){
          //更新文章是否收藏的缓存值
          wx.setStorageSync("postsCollection", postsCollected);
          //更新数据绑定切换图片
          that.setData({
            //这边this是指success函数中的，而不是所需要的page
            collected: postCollected
          })
        }

      }
    })
  },
  showToast: function (postCollected, postsCollected) {
    //更新文章是否收藏的缓存值
    wx.setStorageSync("postsCollection", postsCollected);
    //更新数据绑定切换图片
    this.setData({
      collected: postCollected
    })
    //消息弹窗
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })
  },
  onMusicTap:function(){
    var displaymusic = this.data.displaymusic;
    var currentpostid = this.data.currentpostid;
    // console.log(postsData)
    var postData = postsData.postlist[currentpostid].music;
    if (displaymusic){
      wx.pauseBackgroundAudio();
      this.setData({
        displaymusic:false
      })
    }else{
      wx.playBackgroundAudio({
        dataUrl: postData.url,
        //图片和封面都只能用网上的
        title: postData.title,
        coverImgUrl: postData.coverImg
      })
      this.setData({
        displaymusic: true
      })
    }
    if (app.globalData.g_isPlayingMusic){
      // this.data.displaymusic=false;
      this.setData({
        displaymusic:false,
      })
    }
    this.setMusicStation();
  },
  setMusicStation:function(){
    var that = this;

    //监听播放器的播放（去调用自己本地数据）
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        displaymusic: true
      })
      app.globalData.g_isPlayingMusic=true;
    });
    //监听播放器的停止
    wx.onBackgroundAudioPause(function () {
      that.setData({
        displaymusic: false
      })
      app.globalData.g_isPlayingMusic=false;
    })
  }
})