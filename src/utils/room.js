import _ from 'lodash';
const formatterRoomNum = (roomOptions,row) => {
  let val = '';
  roomOptions.map((item) => {
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
