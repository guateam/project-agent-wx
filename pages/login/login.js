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
  email_change:function(e){
    this.setData({
      email:e.detail.value
    })
  },
  password_change: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  confirm_password_change: function (e) {
    this.setData({
      confirm_password: e.detail.value
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
    var that = this
    if(this.data.email == ""){
      wx.showToast({
        title: '邮箱不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if( this.data.password != this.data.confirm_password || 
        this.data.password =="" || this.data.confirm_password == ""){
        wx.showToast({
          title: '密码不能为空或两次密码不一致',
          icon: 'none',
          duration: 2000
        })
      return 
    }
    if (!this.data.agree){
      return
    }
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      //拒绝授权的情况

    } else {
      let reg = /^[0-9a-zA-Z]{0,19}@[0-9a-zA-Z]{1,13}\.[com, cn, net]{1,3}$/
      let flag = reg.test(that.data.email)
      if(!flag){
        wx.showToast({
          title: '邮箱格式不正确',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (app.globalData.openid == ""){
        wx.showToast({
          title: '获取用户凭证失败，请重启小程序',
          icon: 'none',
          duration: 2000
        })
        return
      }
      that.setData({
        hidden: false,
        content: "正在注册..."
      })
      wx.request({
        url:  app.globalData.posttp + app.globalData.postdir + "/api/account/wx_register",
        data: {
          openid: app.globalData.openid,
          nickname: e.detail.userInfo.nickName,
          head: e.detail.userInfo.avatarUrl,
          email: that.data.email,
          password: that.data.password
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          res = res.data;
          if(res.code == 1){
            app.globalData.if_register = 'yes'
            let token = res.data
            wx.redirectTo({
              url: '../main/main?token=' + token
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


