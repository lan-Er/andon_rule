import React from 'react';

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

/**
 * 资源计划限制状态是否拖动
 * @param {*} key
 */
export function statusEnable(key) {
  const status = ['RELEASED', 'DISPATCHED', 'PAUSE', 'RUNNING'];
  return !status.includes(key);
}

/**
 * 状态对应颜色
 * @param {*} key
 */
export function statusColor(key) {
  const colors = {
    RELEASED: '#FABE32',
    DISPATCHED: '#9AD50E',
    PAUSE: '#D8D8D8',
    RUNNING: '#3BB54E',
    NEW: '#329DFA',
    QUEUING: '#20D4C2',
  };
  return colors[key];
}

// 检验单状态渲染
export function statusRender(value, meaning) {
  let style = {};
  // 558B2F
  // E64A19
  // FF9800
  // 999999
  // 合格：  OK ，不合格： NG ，让步接收： CONCESSION  ，待定： PENDING
  switch (value) {
    case 'NEW':
      style = {
        backgroundColor: '#FFF3E0',
        border: '1px solid #FF9800',
        color: '#FF9800',
      };
      break;
    case 'COMPLETED':
    case 'OK':
      style = {
        backgroundColor: '#E8F5E9',
        border: '1px solid #558B2F',
        color: '#558B2F',
      };
      break;
    case 'CONCESSION': // 让步接收
      style = {
        backgroundColor: '#FF9800',
      };
      break;
    case 'ONGOING':
      style = {
        backgroundColor: '#E3F2FD',
        border: '1px solid #039BE5',
        color: '#039BE5',
      };
      break;
    case 'CANCELLED':
    case 'NG':
      style = {
        backgroundColor: '#FBE9E7',
        border: '1px solid #E64A19',
        color: '#E64A19',
      };
      break;
    default:
      break;
  }
  return (
    <span
      style={{
        ...style,
        display: 'inline-block',
        width: '56px',
        height: '26px',
        lineHeight: '24px',
        textAlign: 'center',
        borderRadius: '4px',
      }}
    >
      {meaning}
    </span>
  );
}

// 检验单判定结果渲染
export function resultRender(value, meaning) {
  let style = {};
  switch (value) {
    case 'FAILED': // 不合格
      style = {
        backgroundColor: '#E64A19',
      };
      break;
    case 'PENDING':
      style = {
        backgroundColor: '#E3F2FD',
        border: '1px solid #039BE5',
        color: '#039BE5',
      };
      break;
    case 'NG':
      style = {
        backgroundColor: '#E64A19',
      };
      break;
    case 'PASS': // 合格
    case 'OK': // 合格
      style = {
        backgroundColor: '#558B2F',
      };
      break;
    case 'CONCESSION': // 让步接收
      style = {
        backgroundColor: '#FF9800',
      };
      break;
    default:
      break;
  }
  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          ...style,
          width: '7px',
          height: '7px',
          marginTop: '15px',
          borderRadius: '4px',
        }}
      />
      <span style={{ marginLeft: '10px' }}>{meaning}</span>
    </div>
  );
}

// SMD状态渲染
export function smdStatusRender(value, meaning) {
  let style = {};
  switch (value) {
    case 'PREPARING':
      style = {
        backgroundColor: '#E3F2FD',
        border: '1px solid #039BE5',
        color: '#039BE5',
      };
      break;
    case 'PREPARED':
      style = {
        backgroundColor: '#F9FBE7',
        border: '1px solid #AFB42B',
        color: '#AFB42B',
      };
      break;
    case 'USING':
      style = {
        backgroundColor: '#E8F5E9',
        border: '1px solid #558B2F',
        color: '#558B2F',
      };
      break;
    case 'INVALID':
      style = {
        backgroundColor: '#DDDDDD',
        border: '1px solid #999999',
        color: '#999999',
      };
      break;
    default:
      break;
  }
  return (
    <span
      style={{
        ...style,
        display: 'inline-block',
        width: '56px',
        height: '26px',
        lineHeight: '24px',
        textAlign: 'center',
        borderRadius: '4px',
      }}
    >
      {meaning}
    </span>
  );
}

// 浮点数相加
export function accAdd(arg1, arg2) {
  let r1 = 0;
  let r2 = 0;
  let m = 0;
  let c = 0;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  if (Math.abs(r1 - r2) > 0) {
    const cm = 10 ** Math.abs(r1 - r2);
    if (r1 > r2) {
      c = Number(arg1.toString().replace('.', ''));
      m = Number(arg2.toString().replace('.', '')) * cm;
    } else {
      c = Number(arg1.toString().replace('.', '')) * cm;
      m = Number(arg2.toString().replace('.', ''));
    }
  } else {
    c = Number(arg1.toString().replace('.', ''));
    m = Number(arg2.toString().replace('.', ''));
  }
  return (c + m) / 10 ** Math.max(r1, r2);
}
