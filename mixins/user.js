import {User} from "../libs/av-weapp-min";
import {alert} from '../libs/Weixin';

const app = getApp();

export default {
  data: {
    logging: false,
    logged: false,
    userInfo: null,
  },

  getReady() {

  },
  afterLogin() {

  },

  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
      this.getReady();
    } else {
      app.userInfoReadyCallback = ({userInfo = null}) => {
        if (!userInfo) {
          return;
        }
        this.setData({
          userInfo,
        });
        this.getReady();
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
        if (this.afterLogin) {
          this.afterLogin();
        }
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
