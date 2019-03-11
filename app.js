//app.js
App({
  globalData: {
    postdir: 'lgt1212.cn:4000',
    posttp: "https://",
    personInfo: "",
    openid: "",
    session_key: "",
    userinfo_success: "",
    appid: "wx77fddbff5a867762",
    appsecret: "d3ed78e1e541f44b47f6e4a3e948fa82",
  },
  onLaunch: function () {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      complete: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var APPID = 'wx77fddbff5a867762';
          var APPSECRET = 'd3ed78e1e541f44b47f6e4a3e948fa82';
          wx.request({
            method: "GET",
            url: "https://www.lgt1212.cn:4000/api/account/wx_openid",
            data: {
              code: res.code,
              appid: APPID,
              secret: APPSECRET
            },
            complete: function (res) {
              var opid = res.data.openid //返回openid
              that.globalData.openid = opid;
              that.globalData.session_key = res.data.session_key
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})