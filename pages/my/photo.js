import AV from '../../libs/av-weapp-min';
import {PHOTO} from "../../model/Photo";
import {UPLOAD_API} from '../../config/av';

Page({
  data: {
    url: '',
  },

  async onLoad(query) {
    const {id} = query;
    this.id = id;
    const photo = AV.Object.createWithoutData(PHOTO, id);
    await photo.fetch();
    let url = photo.get('url');
    url = UPLOAD_API.replace(/\/up$/, '') + url;
    this.setData({
      url,
    });
  },

  onShareAppMessage() {
    return {
      title: '我制作了一张卡通头像，看看怎么样，你也来试试吧！',
      path: '/pages/my/photo?id=' + this.id,
    };
  },
});
