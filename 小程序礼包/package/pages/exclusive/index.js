//index.js
//获取应用实例
var app = getApp();
var {Package} = require('../common/Package');
Page(new Package({
  url: 'GetPackList',
  route: 'pages/exclusive/index',
  'type':'only'
}))
