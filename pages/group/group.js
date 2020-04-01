import {GROUP} from "../../model/Group";
import Member from "../../model/Member";
import {Query} from "../../libs/av-weapp-min";
import {alert} from '../../libs/Weixin';
import user from "../../mixins/user";

const app = getApp();

const config = Object.assign({
  data: {
    logged: false,
    isLoggingIn: false,
    isLoaded: false,
    isSaving: false,
    isLoadingList: true,

    id: '',
    thumbnail: '',
    description: '',
    price: null,
    me: null,
    list: null,
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
        const list = new Query(Member);
        list
          .equalTo('group', this.group)
          .include('user');
        return list.find();
      })
      .then(list => {
        list = list.map(item => {
          item = item.toJSON();
          if (item.user.objectId === app.globalData.user.id) {
            this.setData({
              me: item.number,
            });
          }
          return item;
        });
        this.setData({
          list,
          isLoadingList: false,
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
    const {number} = value;
    this.setData({
      isSaving: true,
    });
    const member = new Member();
    member.number = number;
    member.group = this.group;
    member.user = app.globalData.user;
    member.save()
      .then(() => {
        alert('接龙成功');
        this.set({
          me: number,
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
}, user);
Page(config);
