import {User} from "../libs/av-weapp-min";

const app = getApp();

export default {
  getReady() {

  },

  onGotUserInfo(event) {
    const {userInfo} = event.detail;
    this.setData({
      isLoggingIn: true,
    });

    app.globalData.userInfo = userInfo;
    User.loginWithWeapp()
      .then(me => {
        app.globalData.user = me;
        if (!me.get('nickName')) {
          me.set(userInfo);
          return me.save();
        }
        return me;
      })
      .then(() => {
        this.setData({
          logged: true,
        });
        this.getReady();
      })
      .catch(error => {
        console.error(error);
        alert(error.message || '登录失败');
      })
      .then(() => {
        this.setData({
          isLogin: false,
        });
      });
  },
}
