import {GROUP} from "../../model/Group";
import Member from "../../model/Member";
import {Query} from "../../libs/av-weapp-min";
import {alert} from '../../libs/Weixin';

const app = getApp();

Page({
  data: {
    logged: false,
    isLoggingIn: false,
    isLoaded: false,
    isSaving: false,

    id: '',
    thumbnail: '',
    description: '',
    price: null,
    me: null,
  },

  doLoad() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    const query = new Query(GROUP);
    query.get(this.data.id)
      .then(group => {
        this.group = group;
        group = group.toJSON();
        this.setData({
          isLoaded: true,
          ...group,
        });
      })
      .then(() => {
        wx.hideLoading();
      });
  },
  doStart() {
    if (app.globalData.user) {
      this.setData({
        logged: true,
      });
    }
  },
  doSubmit({detail}) {
    const {value} = detail;
    this.setData({
      isSaving: true,
    });
    const member = new Member();
    member.number = value;
    member.group = this.group;
    member.save()
      .then(() => {
        alert('接龙成功');
        this.set({
          me: value,
        });
      })
      .then(() => {
        this.setData({
          isSaving: false,
        });
      });
  },

  onLoad(options) {
    let {id, scene} = options;
    if (scene) {
      scene = decodeURIComponent(scene);
      id = scene;
    }
    this.setData({
      id,
    });
    this.doLoad();
    if (app.userInfoReadyCallback) {
      this.doStart();
    } else {
      app.userInfoReadyCallback = () => {
        this.doStart();
      };
    }
  },
  onShareAppMessage() {
    return {
      title: '我发现了一个好活动，大家来看看：',
      path: '/pages/detail/detail?id=' + this.data.id,
    };
  },
});
