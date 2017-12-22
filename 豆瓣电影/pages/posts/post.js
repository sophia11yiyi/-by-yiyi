var postData=require("../../data/post-data.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: ["/images/vr.png", "/images/iqiyi.png", "/images/wx.png"],
    // inner:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({inner:postData.postlist});
      // this.data.inner=postData.postlist;  不懂为什么这个不行
  },
  onPostTap: function (event) {
    // 自定义的属性事件都会有一个event
    var postId=event.currentTarget.dataset.postid;
    // console.log(postId);
    wx.navigateTo({
      url: 'post-detail/detail?id='+postId,
      //进入这个地址的参数是我定义数据里的postId
    })
  },
  onSwiperItem: function (event) {
    // 自定义的属性事件都会有一个event
    var postId = event.currentTarget.dataset.postid;
    // console.log(postId);
    wx.navigateTo({
      url: 'post-detail/detail?id=' + postId,
      //进入这个地址的参数是我定义数据里的postId
    })
  }
  // },
  // onSwiperTap:function(){
  //   //target指的是当前点击的组件 currentTarget事件捕获的组件
  //   //这边target指的是image 而currentTarget指的是Swiper组件
  //   var postId = event.target.dataset.postid;
  //   // console.log(postId);
  //   wx.navigateTo({
  //     url: 'post-detail/detail?id=' + postId,
  //     //进入这个地址的参数是我定义数据里的postId
  //   })
  // }
})