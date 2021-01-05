const languageTypes = [
  { name: '普通话+英文', value: 1 },
  { name: '粤语+普通话+英文', value: 2 }
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
