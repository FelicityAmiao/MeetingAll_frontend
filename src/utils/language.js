const languageTypes = [
  { name: '普通话', value: 1 },
  { name: '英文', value: 2 },
  { name: '普通话+英文', value: 3 }
];

const formatterLanguage = (index) => {
  let val = '';
  languageTypes.map((item) => {
    if (item.value === index) {
      val = item.name;
    }
  });
  return val;
};

export {
  formatterLanguage,
  languageTypes
};
