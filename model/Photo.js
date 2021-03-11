import AV from '../libs/av-weapp-min';

export const PHOTO = 'photo';

class Photo extends AV.Object {
  constructor() {
    super();
  }
}

AV.Object.register(Photo, PHOTO);

export default Photo;
