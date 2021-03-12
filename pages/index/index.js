//index.js
//获取应用实例
import AV from "../../libs/av-weapp-min";
import {chooseImage, upload} from '../../libs/Weixin';
import {UPLOAD_API} from '../../config/av';
import Photo from "../../model/Photo";

/* global wx */

const app = getApp();

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logged: true,
    isLoggingIn: false,
    isUploading: false,
  },
  getReady() {
    if (!app.globalData.user) {
      this.setData({
        logged: false,
      });
    }
    wx.hideLoading();
  },
  async doUpload() {
    const image = await chooseImage({
      count: 1,
    });
    const [filePath] = image.tempFilePaths;
    if (!filePath) {
      return;
    }

    wx.showLoading({
      title: '上传中',
      mask: true,
    });

    const result = await upload({
      url: UPLOAD_API,
      filePath,
    });
    const photo = Photo();
    photo.set('url', result.data);
    photo.set('owner', app.globalData.user);
    await photo.save();
    wx.navigateTo({
      url: '/pages/my/photo?id=' + photo.id,
    });
    wx.hideLoading();
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
});
