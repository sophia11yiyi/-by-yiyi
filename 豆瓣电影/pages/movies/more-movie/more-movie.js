// pages/movies/more-movie/more-movie.js
var app = getApp()
//引用app 全局变量
var util = require('../../../utils/util.js')
//调用公用方法
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navagateTitle: "",
    movies: [],
    requestUrl: "",
    totalCount: 0,
    isEmpty:true,
    //指定当前的数据是空的
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var categery = options.categery;
    var dataUrl;
    this.data.navagateTitle = categery;
    switch (categery) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.GetDouBandata)
    //在两个不同的函数中记得加this
  },
  onReachBottom: function (event) {
    //加载底部更多数据
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.GetDouBandata)
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh:function(event){
    //下拉刷新
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    //将数据清空，防止累加
    this.data.movies={};
    this.data.isEmpty=true;
    this.data.totalCount=0;
    util.http(refreshUrl, this.GetDouBandata)
    wx.showNavigationBarLoading();
  },
  GetDouBandata: function (moviesdouban) {
    var movies = [];
    for (var idx in moviesdouban.subjects) {
      //遍历数组对象。
      var subject = moviesdouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 5) + '...';
      }
      var temp = {
        title: title,
        stars: util.convertTostarsArray(subject.rating.stars),
        average: subject.rating.average,
        coverImage: subject.images.large,
        movieid: subject.id,
        sub_title: moviesdouban.title
      }
      // console.log(temp)
      movies.push(temp);
    }
    var totalMovies = [];
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
      //旧数据加上新数据
    } else {
      totalMovies = movies;
      //第一次加载时，将数据赋值进去；
      this.data.isEmpty = false;
    }
    this.data.totalCount += 20;
    //在数据绑定之前，加20然后在data里面初始化
    this.setData({
      //绑定数据 也是将总的数据绑定进去
      movies: totalMovies
    })
    wx.hideNavigationBarLoading()
    //数据加载完之后设置loading结束
    //设置loading开始

  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navagateTitle
    })
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  }
})