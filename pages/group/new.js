import {File} from '../../libs/av-weapp-min';
import {alert, chooseImage} from "../../libs/Weixin";
import Group from "../../model/Group";

/* global wx */

Page({
  data: {
    title: '',
    description: '',
    price: 100,
    thumbnail: '',
  },

  doUpload() {
    chooseImage({
      count: 1,
    })
      .then(({tempFilePaths}) => {
        const [thumbnail] = tempFilePaths;
        this.setData({
          thumbnail,
        });
        return thumbnail;
      })
      .then(uri => {
        const file = new File('thumbnail', {
          blob: {
            uri,
          },
        });
        return file.save();
      })
      .then(file => {
        console.log('uploaded');
        const thumbnail = file.url();
        this.setData({
          thumbnail,
        });
      });
  },

  onSubmit({detail}) {
    const {value} = detail;
    value.thumbnail = this.data.thumbnail;
    const group = new Group();
    for (const key in value) {
      group[key] = value[key];
    }
    group.save()
      .then(saved => {
        alert('创建成功');
        wx.navigateTo({
          url: '/pages/group/group?id=' + saved.id,
        });
      });
  },
});
