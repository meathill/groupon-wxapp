import {File} from '../../libs/av-weapp-min';
import {chooseImage} from "../../libs/Weixin";

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

  onSubmit(event) {

  },
});
