import AV from '../libs/av-weapp-min';

export const GROUP = 'group';

class Group extends AV.Object {
  constructor() {
    super();
  }

  get title() {
    return this.get('title');
  }
  set title(value) {
    this.set('title', value);
  }

  get description() {
    return this.get('description');
  }
  set description(value) {
    this.set('description', value);
  }

  get price() {
    return this.get('price');
  }
  set price(value) {
    this.set('price', value);
  }

  get thumbnail() {
    return this.get('thumbnail');
  }
  set thumbnail(value) {
    this.set('thumbnail', value);
  }
}

AV.Object.register(Group, GROUP);

export default Group;
