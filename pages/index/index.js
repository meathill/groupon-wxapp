//index.js
//获取应用实例
import {chooseImage, upload, alert} from '../../libs/Weixin';
import {UPLOAD_API} from '../../config/av';
import Photo from "../../model/Photo";
import {mix} from '../../libs/Weixin';
import user from '../../mixins/user';

/* global wx */

const app = getApp();

const init = mix(user, {
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
  },
  afterLogin() {
    this.doUpload();
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
    const {err, msg} = result;
    if (err) {
      wx.hideLoading();
      await alert('上传失败。' + msg);
      return;
    }
    const photo = new Photo();
    photo.set('url', '/static/' + msg);
    photo.set('owner', app.globalData.user);
    await photo.save();
    wx.navigateTo({
      url: '/pages/my/photo?id=' + photo.id,
    });
    wx.hideLoading();
  },
});
Page(init);
