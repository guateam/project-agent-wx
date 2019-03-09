//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    hidden: true,
    content: "",
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  toast: function () {
    wx.navigateTo({
      url: '../main/main'
    })
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  UserInfo: function (e) {
    console.log(e)
    that.setData({
      hidden: false
    })
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      //拒绝授权的情况
      that.setData({
        hidden: true
      })
    } else {
      that.setData({
        content: "检查是否注册"
      })
      getApp().globalData.userinfo = e.detail.userinfo;
      wx.request({
        url: app.globalData.posttp + app.globalData.postdir + "/api/if_register",
        header: {
          'openid': app.globalData.openid
        },
        method: "GET",
        success: function (result) {
          result = result.data;
          if (result.code == 0) {
            //保存用户信息到数据库
            that.setData({
              content: "正在注册"
            })
            wx.request({
              url: app.globalData.posttp + app.globalData.postdir + "/api/account/register",
              data: {
                openid: app.globalData.openid,
                username: e.detail.userInfo.nickName,
                gender: e.detail.userInfo.gender,
                head: e.detail.userInfo.avatarUrl
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: "POST",
              success: function (res) {
                res = res.data;
                wx.switchTab({
                  url: '../index/index'
                })
              }
            })
          } else {
            that.setData({
              content: "正在跳转到主页"
            })
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      })
    }
  }
})
