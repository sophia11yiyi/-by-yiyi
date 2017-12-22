// pages/movies/movie-detail/movie-detail.js
var util = require('../../../utils/util.js')
var app = getApp();
//引用app
Page({
  data: {
 movie:{}
  },
  onLoad: function (options) {
    var movieId = options.id;
    var url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    util.http(url, this.GetDouBandata)
    //引用完接口 就得发请求 http
  },
  GetDouBandata: function (data) {
    if(!data){
      return;
    }
      var director={
        avatars:"",
          name:"",
          id:""
      }
      if (data.directors[0]!=null){
        if (data.directors[0].avatars!=null){
          director.avatars = data.directors[0].avatars.large;
        }
        director.name = data.directors[0].name;
        director.id = data.directors[0].id;
      }
      var movie={
        movieImg: data.images ? data.images.large : "",
        country: data.countries[0],
        title: data.title,
        originalTitle: data.original_title,
        wishCount: data.wish_count,
        commentCount: data.comments_count,
        year: data.year,
        generes: data.genres.join("、"),
        stars: util.convertTostarsArray(data.rating.stars),
        score: data.rating.average,
        director: director,
        casts: util.convertToCastString(data.casts),
        castsInfo: util.convertToCastInfos(data.casts),
        summary: data.summary
      }
  
      this.setData({  
        movie:movie
      })
  },
  viewMoviePostImg:function(e){
    var src=e.currentTarget.dataset.src;
    wx.previewImage({
      current: 'src', // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  }
})