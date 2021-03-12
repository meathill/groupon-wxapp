import user from '../../mixins/user';
import {mix} from '../../libs/Weixin';
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
      .descending('status')
      .descending('createdAt');
    if (createdAt) {
      query.greaterThan('createdAt', createdAt);
    }
    query.limit(10);
    return query.find()
      .then(photos => {
        photos = photos.map(photo => {
          const json = photo.toJSON();
          return {
            id: photo.id,
            ...json,
            url: UPLOAD_API.replace(/\/u$/, '') + json.url,
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
    this.refresh(this.data.list[this.data.list.length - 1].createdAt, false);
  },
});

Page(init);
