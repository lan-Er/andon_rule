import React from 'react';
import { Badge, Tag } from 'choerodon-ui';
import intl from 'utils/intl';

/**
 * 返回 是/否 多语言 并加上对应的状态
 * @param {1|any} v 值
 * @return 1 -> yes(多语言), other -> no(多语言)
 */
export function yesOrNoRender(v = {}) {
  let value = false;
  if (v.rowData) {
    value = v.rowData[v.dataIndex];
  } else {
    value = v?.value;
  }
  return (
    <Badge
      status={value ? 'success' : 'error'}
      text={
        value
          ? intl.get('hzero.common.status.yes').d('是')
          : intl.get('hzero.common.status.no').d('否')
      }
    />
  );
}

/**
 * 渲染商业实体状态
 * @author TJ <jianjun.tan@hand-china.com>
 * @param {json} o - 状态
 */
export function partyStatusRender(o = {}) {
  let actionText = o.text;
  switch (o.value) {
    case 'ENABLED':
      actionText = <Tag color="green">{actionText}</Tag>;
      break;
    case 'REVIEWED':
      actionText = <Tag color="gold">{actionText}</Tag>;
      break;
    case 'DISABLED':
      actionText = <Tag color="gray">{actionText}</Tag>;
      break;
    case 'WAITING':
      actionText = <Tag color="gold">{actionText}</Tag>;
      break;
    case 'REWORK':
      actionText = <Tag color="gold">{actionText}</Tag>;
      break;
    default:
      break;
  }
  return actionText;
}

/**
 * 渲染订单状态
 * @param value
 * @param meaning
 */
export function orderStatusRender(value, meaning) {
  let actionText = meaning;
  switch (value) {
    case 'NEW': // 浅蓝色
      actionText = <Tag color="#2db7f5">{meaning}</Tag>;
      break;
    case 'PLANNED': // 黄绿色
    case 'DISPATCHED':
    case 'PICKED':
      actionText = <Tag color="#7FFF00">{meaning}</Tag>;
      break;
    case 'APPROVING': // 蓝色
    case 'QUEUING':
    case 'SCHEDULED':
      actionText = <Tag color="#108ee9">{meaning}</Tag>;
      break;
    case 'PAUSE':
      actionText = <Tag color="orange">{meaning}</Tag>;
      break;

    case 'RECEIVED':
    case 'APPROVED': // 黄色
    case 'PENDING':
    case 'RELEASED':
      actionText = <Tag color="yellow">{meaning}</Tag>;
      break;
    case 'SHIPPING': // 浅绿色
    case 'EXECUTED':
    case 'RUNNING':
    case 'RECEIVING':
      actionText = <Tag color="#87d068">{meaning}</Tag>;
      break;
    case 'COMPLETED': // 绿色
    case 'PASS':
      actionText = <Tag color="green">{meaning}</Tag>;
      break;
    case 'CLOSED': // 灰色
      actionText = <Tag color="gray">{meaning}</Tag>;
      break;
    case 'CANCELLED': // 浅红色
    case 'FAILED': // 浅红色
      actionText = <Tag color="#f50">{meaning}</Tag>;
      break;
    case 'SHIPPED': // 紫色
      actionText = <Tag color="purple">{meaning}</Tag>;
      break;
    case 'REFUSED':
      actionText = <Tag color="red">{meaning}</Tag>;
      break;
    default:
      break;
  }
  return actionText;
}

/**
 * 返回 启用/禁用 对应的多语言 并加上状态
 * @param {0|1} v 启用状态
 * return 1 ? enable(多语言) : disabled(多语言)
 */
export function enableRender(v = {}) {
  const actionText = v.text;
  switch (v.value) {
    case 'ENABLED':
      return <Badge status="success" text={actionText} />;
    case 'ENABLED_NO':
      return <Badge status="error" text={actionText} />;
    default:
      return actionText;
  }
}

/**
 * 渲染订单状态
 * @param value
 * @param meaning
 */
export function statusRender(value, meaning) {
  let style = {};
  switch (value) {
    case 'NEW':
    case 'TAKEN':
      style = {
        backgroundColor: '#E3F2FD',
        border: '1px solid #039BE5',
        color: '#039BE5',
      };
      break;
    case 'PENDING':
    case 'WIP':
      style = {
        backgroundColor: '#F3E5F5',
        border: '1px solid #6A1B9A',
        color: '#6A1B9A',
      };
      break;
    case 'INSPECTED':
    case 'PICKED':
    case 'APPROVED':
    case 'APPROVING':
    case 'PLANNED':
    case 'SCHEDULED':
    case 'EMPTY':
      style = {
        backgroundColor: '#F9FBE7',
        border: '1px solid #AFB42B',
        color: '#AFB42B',
      };
      break;
    case 'RECEIVED':
    case 'QUEUING':
      style = {
        backgroundColor: '#FFF8E1',
        border: '1px solid #FBC02D',
        color: '#FBC02D',
      };
      break;
    case 'RECEIVING':
    case 'RUNNING':
      style = {
        backgroundColor: '#E0F2F1',
        border: '1px solid #00897B',
        color: '#00897B',
      };
      break;
    case 'RELEASED':
    case 'PAUSE':
      style = {
        backgroundColor: '#FFF3E0',
        border: '1px solid #FF9800',
        color: '#FF9800',
      };
      break;
    case 'EXECUTED':
    case 'SHIPPING':
    case 'DISPATCHED':
      style = {
        backgroundColor: '#E0F7FA',
        border: '1px solid #00ACC1',
        color: '#00ACC1',
      };
      break;
    case 'COMPLETED':
      style = {
        backgroundColor: '#E8F5E9',
        border: '1px solid #43A047',
        color: '#43A047',
      };
      break;
    case 'CLOSED':
      style = {
        backgroundColor: '#DDD',
        border: '1px solid #666',
        color: '#666',
      };
      break;
    case 'CANCELLED':
      style = {
        backgroundColor: '#FBE9E7',
        border: '1px solid #E64A19',
        color: '#E64A19',
      };
      break;
    case 'REFUSED':
      style = {
        backgroundColor: '#FFEBEE',
        border: '1px solid #B71C1C',
        color: '#B71C1C',
      };
      break;
    case 'STOCKED':
      style = {
        backgroundColor: '#E8EAF6',
        border: '1px solid #3949AB',
        color: '#3949AB',
      };
      break;
    case 'END':
      style = {
        backgroundColor: '#DDDDDD',
        border: '1px solid #666666',
        color: '#666666',
      };
      break;
    case 'FROZEN':
      style = {
        backgroundColor: '#F3E5F5',
        border: '1px solid #6A1B9A',
        color: '#6A1B9A',
      };
      break;
    case 'COUNTING':
      style = {
        backgroundColor: '#E0F7FA',
        border: '1px solid #00ACC1',
        color: '#00ACC1',
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

/**
 * 获取行序号
 * @param {*} record 当前行记录
 */
export function getSerialNum(record, name) {
  const {
    dataSet: { currentPage, pageSize },
    index,
  } = record;
  record.set(name, (currentPage - 1) * pageSize + index + 1);
  return (currentPage - 1) * pageSize + index + 1;
}
