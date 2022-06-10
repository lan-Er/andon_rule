import intl from 'utils/intl';
/**
 * @param {String} number
 * 自然数校验
 */

function naturalNumberValidator(value) {
  // if (!(value === null) && value <= 1 && (value%1 === 0)) {
  //   return intl.get('zplan.common.validation.naturalNumber').d('请输入大于等于1的自然数');
  // }
  if (value === null || value < 1 || value % 1 !== 0) {
    return intl.get('zplan.common.validation.naturalNumber').d('请输入大于等于1的自然数');
  }

  return true;
}

// 将方法暴露出去
export { naturalNumberValidator };
