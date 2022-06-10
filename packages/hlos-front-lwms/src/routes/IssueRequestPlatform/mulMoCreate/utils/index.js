/**
 * @description: 分类辅助函数
 * @param {Array} array 需要分类的数组
 * @param {string} keywords 按这个关键字段分类
 * @return Object.values(groups)
 */
export default (array, keyWords) => {
  const groups = {};
  array.forEach((item) => {
    const temp = JSON.stringify(item[keyWords]);
    groups[temp] = groups[temp] || [];
    groups[temp].push(item);
  });
  return Object.values(groups);
};
