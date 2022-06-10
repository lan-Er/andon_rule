/**
 * @date: 2019-11-11
 * @author: jianjun.tan@hand-china.com
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { CODE } from 'utils/regExp';
import intl from 'utils/intl';
import { getCurrentUserId } from 'utils/utils';

/**
 * @param {String} code
 * 编码校验
 */
function codeValidator(value) {
  if (!CODE.test(value)) {
    return intl
      .get('hzero.common.validation.code')
      .d('大小写及数字，必须以字母、数字开头,可包含“-”、“_”、“.”、“/”');
  }
  return true;
}

/**
 * @param {String} code
 * 编码校验
 */
function descValidator(value) {
  if (value?.length > 240) {
    return intl.get('lmds.common.validation.desc').d('长度不可超过240个字符');
  }
  return true;
}

/**
 *
 * @param {*} data
 * 多语言json转换
 */
function getTlsRecord(data, fieldName) {
  try {
    const jsonData = JSON.parse(data);
    if (jsonData && !jsonData.faied) {
      const tlsRecord = {};
      jsonData.forEach((intlRecord) => {
        tlsRecord[intlRecord.code] = intlRecord.value;
      });
      return [{ [fieldName]: tlsRecord }];
    }
  } catch (e) {
    // do nothing, use default error deal
  }
  return data;
}

/**
 *
 * @param {*} name
 * @param {*} module
 * @param {*} type
 *
 * 字符串替换
 */
function convertFieldName(name, module, type) {
  if (name === 'description') {
    return `${type}Description`;
  }
  return name.replace(module, type);
}

/**
 * @param {String} number
 * 正数校验
 */
function positiveNumberValidator(value) {
  if (!(value === null) && value <= 0) {
    return intl.get('lmds.common.validation.positiveNumber').d('请输入大于0的数字');
  }
  return true;
}

/**
 * @param {String} value
 * 根据fileUrl截取文件名称
 */
function getFileName(value) {
  const fileArr = value.split('@');
  const fileName = fileArr[fileArr.length - 1];
  return fileName;
}

/**
 * 去除空格
 * @param {string} str
 * @param {string} isGlobal
 */
function trim(str, isGlobal) {
  let result;
  result = str.replace(/(^\s+)|(\s+$)/g, '');
  if (isGlobal.toLowerCase() === 'g') {
    result = result.replace(/\s/g, '');
  }
  return result;
}

/**
 * @description: 数据类型检测
 * @param {*} params  any
 * @return {*} type string
 */
function typeDetection(params) {
  if (params == null) {
    // null==undefined,用来检测null和undefined
    return params;
  }
  const typeList = new Map(); // typeof检测Object不可靠，建立对象字典。
  const ownType = ['Array', 'RegExp', 'Object', 'Date', 'Error'];
  ownType.forEach((item) => {
    typeList.set(`[object ${item}]`, item.toLowerCase());
  });
  if (typeof params === 'object') {
    const typeResult = Object.prototype.toString.call(params);
    if (typeList.has(typeResult)) {
      return typeList.get(typeResult);
    }
  } else {
    // 基本数据类型以及函数使用typeof检测,由于null和undefined使用typeof不可靠排除在外
    return typeof params;
  }
}

/**
 * 获取防重复提交lockKey(userId + 时间戳)
 *
 */
function getLockKey() {
  const userId = getCurrentUserId();
  const nowDate = Date.now();
  return userId + nowDate;
}

export {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  positiveNumberValidator,
  getFileName,
  trim,
  descValidator,
  typeDetection,
  getLockKey,
};
