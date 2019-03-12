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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    email:"",
    password:"",
    confirm_password:"",
    agree:false,
  },
  bindagreechange: function (e) {
    this.data.agree = !this.data.agree;
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
    var that = this
    if(this.data.email == "")return
    if( this.data.password != this.data.confirm_password || 
        this.data.password =="" || this.data.confirm_password == ""){
      return 
    }
    if (!this.data.agree){
      return
    }
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      //拒绝授权的情况

    } else {
      that.setData({
        hidden: false,
        content: "正在注册..."
      })
      wx.request({
        url: app.globalData.posttp + app.globalData.postdir + "/api/account/wx_register",
        data: {
          openid: app.globalData.openid,
          username: e.detail.userInfo.nickName,
          head: e.detail.userInfo.avatarUrl,
          emali: that.email,
          password: that.password
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          res = res.data;
          if(res.code == 1){
            app.globalData.if_register = 'yes'
            wx.navigateTo({
              url: '../main/main'
            })
          }else if (res.code == -1) {
            wx.showToast({
              title: '新建账户失败',
              icon: 'none',
              duration: 2000
            })

          } else if (res.code == -2) {
            wx.showToast({
              title: '账户绑定微信失败',
              icon: 'none',
              duration: 2000
            })

          } else if (res.code == -3){
            wx.showToast({
              title: '该邮箱已经被绑定',
              icon: 'none',
              duration: 2000
            })
          } else if (res.code == -4) {
            wx.showToast({
              title: '账户密码错误',
              icon: 'none',
              duration: 2000
            })
          }

        }
      })
    }
  }
})


