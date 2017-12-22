var postData=require("../../../data/post-data.js")
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})