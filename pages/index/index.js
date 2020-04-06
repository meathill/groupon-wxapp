//index.js
//获取应用实例
import AV from "../../libs/av-weapp-min";
import {GROUP} from "../../model/Group";
import {merge} from "../../helper/util";
import user from '../../mixins/user';

/* global wx */

const app = getApp();

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logged: true,
    isLoggingIn: false,

    list: [],
    current: -1,
  },
  getReady() {
    if (!app.globalData.user) {
      this.setData({
        logged: false,
      });
    }
    if (this.data.list.length === 0) {
      this.refresh();
    }
    wx.hideLoading();
  },
  refresh(createdAt, greater = true) {
    const query = new AV.Query(GROUP)
      .descending('status')
      .descending('createdAt');
    if (createdAt) {
      if (greater) {
        query.greaterThan('createdAt', createdAt);
      } else {
        query.lessThan('createdAt', createdAt);
      }
    }
    query.limit(10);
    return query.find()
      .then(groups => {
        groups = groups.map(group => {
          return {
            id: group.id,
            ...group.toJSON(),
          };
        });
        const list = merge(this.data.list, groups);
        this.setData({
          list,
        });
        wx.stopPullDownRefresh();
      })
      .catch(error => {
        console.error(error.message);
        alert(error.message);
      });
  },

  onGotUserInfo(event) {
    const {userInfo} = event.detail;
    this.setData({
      isLoggingIn: true,
    });

    app.globalData.userInfo = userInfo;
    AV.User.loginWithWeapp()
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
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  onShow() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    if (app.userInfoReadyCallback) {
      this.getReady();
    } else {
      app.userInfoReadyCallback = () => {
        this.getReady();
      };
    }
  },
  onPullDownRefresh() {
    this.refresh();
  },
  onReachBottom() {
    this.refresh(this.data.list[this.data.list.length - 1].createdAt, false);
  },
});
