//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    hidden:true,
    content:"正在获取用户信息...",
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShow:function(){
    if(app.globalData.if_register === 'not'){
      wx.redirectTo({
        url: '../login/login',
      })
    }
  },
  //事件处理函数
  onLoad: function () {
    let that = this
    that.setData({
      content: "正在尝试登陆..."
    })
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        console.log(app.globalData.userInfo)
      }
    })
    // 登录
    wx.login({
      complete: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var APPID = 'wxf763bf008cf92f50';
          var APPSECRET = '278b90b5afef6609a7d69d4cedb993c9';
          wx.request({
            method: "GET",
            url: "https://lgt1212.cn/api/account/wx_openid",
            data: {
              code: res.code,
              appid: APPID,
              secret: APPSECRET
            },
            complete: function (res) {
              that.setData({
                content: "正在检测是否注册..."
              })
              var opid = res.data.openid //返回openid
              app.globalData.openid = opid;
              app.globalData.session_key = res.data.session_key
              console.log(app.globalData.openid)
              wx.request({
                url: app.globalData.posttp + app.globalData.postdir + "/api/account/if_register",
                data: {
                  'openid': app.globalData.openid
                },
                method: "GET",
                success: function (result) {
                  result = result.data;
                  if (result.code == 0 || result.code == -1) {
                    //跳转到注册页面
                    that.setData({
                      content: "正在跳转到注册页..."
                    })
                    app.globalData.if_register = 'not'
                    wx.redirectTo({
                      url: '../login/login',
                    })
                  } else if(result.code == 1) {
                    that.setData({
                      content: "正在跳转到主页"
                    })
                    let token = result.data
                    app.globalData.if_register = 'yes'
                    wx.redirectTo({
                      url: '../main/main?token='+token,
                    })
                  } else{
                    that.setData({
                      content: "请求出错"
                    })
                  }
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
})
