export default {
  app: null,
  getUserInfo: function(e) {
    console.log(e)
    this.app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
}
