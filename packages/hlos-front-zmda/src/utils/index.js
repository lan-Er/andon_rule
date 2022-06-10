/**
 * get请求拼接字符串
 * @param data 传递的对象
 * @return String
 */
const spellString = (data) => {
  const paramsArray = Object.keys(data);
  let paramsString = '';
  if (paramsArray && paramsArray.length) {
    paramsArray.forEach((element, index) => {
      if (index === 0) {
        paramsString += `?${element}=${data[element]}`;
      } else {
        paramsString += `&${element}=${data[element]}`;
      }
    });
  }
  return paramsString;
};

export { spellString };
