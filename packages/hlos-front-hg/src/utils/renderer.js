import React from 'react';
import { Tag } from 'choerodon-ui';

import styles from './index.less';

/**
 * 渲染订单状态
 * @param value 订单状态值
 * @returns
 */
export function orderStatusRender(value) {
  let actionText;
  switch (value) {
    case '新建':
      actionText = (
        <Tag color="#ECF9FC">
          <span style={{ color: '#48CAE4' }}>{value}</span>
        </Tag>
      );
      break;
    case '已确认':
      actionText = (
        <Tag color="#E5F7FB">
          <span style={{ color: '#00B4D8' }}>{value}</span>
        </Tag>
      );
      break;
    case '已回复':
      actionText = (
        <Tag color="#E5F4F9">
          <span style={{ color: '#0396C7' }}>{value}</span>
        </Tag>
      );
      break;
    case '已计划':
      actionText = (
        <Tag color="#e7f1f6">
          <span style={{ color: '#0077B6' }}>{value}</span>
        </Tag>
      );
      break;
    case '已下达':
      actionText = (
        <Tag color="#FBFBE5">
          <span style={{ color: '#DDDF03' }}>{value}</span>
        </Tag>
      );
      break;
    case '运行中':
      actionText = (
        <Tag color="#F2F7E7">
          <span style={{ color: '#7FB818' }}>{value}</span>
        </Tag>
      );
      break;
    case '已完工':
    case '发运中':
      actionText = (
        <Tag color="#F6FFED">
          <span style={{ color: '#52C41A' }}>{value}</span>
        </Tag>
      );
      break;
    case '已发运':
      actionText = (
        <Tag color="#F6F9E5">
          <span style={{ color: '#ABCC02' }}>{value}</span>
        </Tag>
      );
      break;
    case '已接收':
      actionText = (
        <Tag color="#F2F7E7">
          <span style={{ color: ' #7FB818' }}>{value}</span>
        </Tag>
      );
      break;
    case '已退货':
      actionText = (
        <Tag color="#FFF1F0">
          <span style={{ color: '#F5222D' }}>{value}</span>
        </Tag>
      );
      break;
    case '已发布':
      actionText = (
        <Tag color="#E8FBFF">
          <span style={{ color: '#2BC0E5' }}>{value}</span>
        </Tag>
      );
      break;
    default:
      actionText = value;
  }
  return actionText;
}

/**
 * 获取随机颜色
 * @returns
 */
export function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g},${b})`;
}

/**
 * 设置姓氏颜色
 * @returns
 */
function setSurnamesBgColor() {
  // colors 键名为对应姓氏的 charCode，使用 string.charCodeAt() 即可获取。
  // 如需默认可在此添加对应姓氏颜色
  const colors = {
    24352: '#6186e1', // 张
    21016: '#f4b13e', // 刘
    36213: '#dc3b91', // 赵
    29579: '#60d3ba', // 王
    38472: '#386BD7', // 陈
  };
  return (charCode, callback) => {
    if (!colors[charCode]) {
      colors[charCode] = getRandomColor();
    }
    callback(colors[charCode]);
  };
}

const getSurnamesBgColor = setSurnamesBgColor();

/**
 * 姓氏背景及姓名渲染
 * @param {*} value 姓名
 * @returns 姓氏 姓名
 */
export function surnamesRender(value) {
  if (!value) return '';
  const surnames = value.substring(0, 1);
  let backgroundColor = '#386bd7';

  getSurnamesBgColor(surnames.charCodeAt(), (color) => {
    backgroundColor = color;
  });

  return (
    <div>
      <div className={styles.surnames} style={{ backgroundColor }}>
        {surnames}
      </div>
      {value}
    </div>
  );
}

/**
 * 金额千分符展示
 * @param {*} money
 */
export function moneyFormat(money) {
  return Number(money)
    .toFixed(2)
    .toString()
    .replace(/\d+/, function (n) {
      return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
        return `${$1},`;
      });
    });
}

/**
 * 获取行序号
 * @param {*} record 当前行记录
 */
export function getSerialNum(record) {
  const {
    dataSet: { currentPage, pageSize },
    index,
  } = record;
  return (currentPage - 1) * pageSize + index + 1;
}
