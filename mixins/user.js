import {User} from "../libs/av-weapp-min";

const app = getApp();

export default {
  data: {
    logging: false,
    logged: false,
    userInfo: null,
  },

  getReady() {

  },

  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    } else {
      app.userInfoReadyCallback = ({userInfo = null}) => {
        if (!userInfo) {
          return;
        }
        this.setData({
          userInfo,
        });
      }
    }
  },

  onGotUserInfo(event) {
    const {userInfo} = event.detail;
    this.setData({
      logging: true,
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
          userInfo,
        });
        this.getReady();
      })
      .catch(error => {
        console.error(error);
        alert(error.message || '登录失败');
      })
      .then(() => {
        this.setData({
          logging: false,
        });
      });
  },
}
