const validateUsername = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('用户名不能为空'));
  } else {
    var reg = /^[a-zA-Z0-9_.-]+@(oocl|cargosmart)+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!reg.test(value)) {
      callback(new Error('用户名格式不正确'));
    }
    callback();
  }
};
const validatePwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('密码不能为空'));
  } else {
    var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{6,12}$/;
    if (!reg.test(value)) {
      callback(new Error('密码应包含至少一个大写字母、小写字母和数字，且长度为6-12个字符'));
    }
    callback();
  }
};
export {
  validateUsername,
  validatePwd
};
