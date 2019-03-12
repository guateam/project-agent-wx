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
    userInfo: null,
    is_register:'unknown',
  },
  onLaunch: function () {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
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
})