import _ from 'lodash';
import store from '../store';
const formatterRoomNum = (row) => {
  let val = '';
  store.getters.roomOptions.map((item) => {
    if (item.value === row[0]) {
      val += item.label;
      val += '-';
      val += _.find(item.children, ['value', row[1]]).label;
    }
  });
  return val;
};

export {
  formatterRoomNum
};
