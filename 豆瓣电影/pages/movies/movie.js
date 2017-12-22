var utils=require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    inTheaters:{},
    commingSoon:{},
    top50:{},
    searchResult:{},
    containershow:true,
    searchpannel:false,
  },
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';
    var commingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
    var top50Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';
    this.getMovieList(inTheatersUrl,"inTheaters",'正在热映');
    this.getMovieList(commingSoonUrl,"commingSoon",'即将上映');
    this.getMovieList(top50Url,"top50",'豆瓣Top250');
    // 异步调用 所以显示的加载顺序不一样
  },
  getMovieList: function (url, setkey, categrytitle){
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        console.log(res);
        that.GetDouBandata(res.data, setkey, categrytitle);
      },
      header: {
        "Content-Type": 'application'
      },
      fail: function () {
        console.log("fail");
      }
    })
  },
  onCancelImageTap:function(){
    this.setData({
      containershow: true,
      searchpannel: false,
      searchResult: {},
      // 清空搜索记录
    })
  },
  onBindFocus:function(){
this.setData({
  containershow: false, 
  searchpannel: true,
})
  },
  //触发搜索
  onBindBlur:function(event){
    var text=event.detail.value;
    var searchUrl = app.globalData.doubanBase +'/v2/movie/search?q='+text;
    this.getMovieList(searchUrl,"searchResult","")
    // console.log(text)


  },
  GetDouBandata: function (moviesdouban, setkey,categrytitle) {
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
        average: subject.rating.average,
        coverImage: subject.images.large,
        movieid: subject.id,
        sub_title: moviesdouban.title,
        //获取不进去
        stars: utils.convertTostarsArray(subject.rating.stars)
      }
      console.log(temp)
      movies.push(temp);
    }
    var readyData={};
    readyData[setkey] ={
      movies:movies,
      categrytitle:categrytitle
    }
    ;
    this.setData(readyData);
    // console.log(this.data.categrytitle);
  },
  onMoreTap:function(event){
    console.log(event)
    var categery=event.currentTarget.dataset.categery;
    wx.navigateTo({
    url: 'more-movie/more-movie?categery='+categery,
  })
  },
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId,
    })
  }
})