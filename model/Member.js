import AV from '../libs/av-weapp-min';

export const MEMBER = 'member';

class Member extends AV.Object {
  constructor() {
    super();
  }

  get number() {
    return this.get('number');
  }
  set number(value) {
    this.set('number', value);
  }

  get group() {
    return this.get('group');
  }
  set group(value) {
    this.set('group', value);
  }
}

AV.Object.register(Member, MEMBER);

export default Member;
