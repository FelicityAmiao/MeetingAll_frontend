import _ from 'lodash';

const roomOptions = [
  {
    value: 1,
    label: 'B5-3F',
    children: [
      { value: 1, label: 'Room1' },
      { value: 2, label: 'Room2' }
    ]
  }, {
    value: 2,
    label: 'B5-5F',
    children: [
      { value: 1, label: 'Room1' },
      { value: 2, label: 'Room2' }
    ]
  }, {
    value: 3,
    label: 'B6-3F',
    children: [
      { value: 1, label: 'Room1' },
      { value: 2, label: 'Room2' }
    ]
  }, {
    value: 4,
    label: 'B6-5F',
    children: [
      { value: 1, label: 'Room1' },
      { value: 2, label: 'Room2' }
    ]
  }];

const formatterRoomNum = (row) => {
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
  formatterRoomNum,
  roomOptions
};
