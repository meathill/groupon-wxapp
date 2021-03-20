import user from '../../mixins/user';
import {mix, alert} from '../../libs/Weixin';
import AV from "../../libs/av-weapp-min";
import {merge} from "../../helper/util";
import {PHOTO} from "../../model/Photo";
import {UPLOAD_API} from '../../config/av';

const init = mix(user, {
  data: {
    ...user.data,
    list: null,
    isLoading: false,
  },

  getReady() {
    this.refresh();
  },

  refresh(createdAt) {
    const query = new AV.Query(PHOTO)
      .descending('createdAt');
    if (createdAt) {
      query.lessThan('createdAt', createdAt);
    }
    query.limit(10);
    return query.find()
      .then(photos => {
        photos = photos.map(photo => {
          return {
            id: photo.id,
            url: UPLOAD_API.replace(/\/up\/?$/, '') + photo.get('url'),
            model: photo,
          };
        });
        const list = createdAt ? merge(this.data.list, photos) : photos;
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
  onPullDownRefresh() {
    this.refresh();
  },
  onReachBottom() {
    const last = this.data.list[this.data.list.length - 1];
    this.refresh(last.model.get('createdAt'));
  },
});

Page(init);
