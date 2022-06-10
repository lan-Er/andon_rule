/* eslint-disable no-nested-ternary */
/*
 * @Description: 通用工具方法
 * @Date: 2020-07-24 11:09:36
 * @author: zhangyongxuan <yongxuan.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2020, Hand
 */
import { createElement } from 'react';
import moment from 'moment';
import intl from 'utils/intl';
import { isEmpty, sortBy, uniq } from 'lodash';
import { getCurrentOrganizationId } from 'utils/utils';
import dynamic from 'dva/dynamic';

/**
 * 获取指定格式的日期
 * @param {要转换的日期} date
 * @param {日期格式} format
 */
export function getMomentDate(date = new Date(), format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(date).format(format);
}

// wrapper of dynamic
export const dynamicWrapper = (app, models, component) =>
  dynamic({
    app,
    models: () =>
      models
        .filter((model) => modelNotExisted(app, model))
        .map((m) => import(`../models/${m}.js`)) || [],
    // add routerData prop
    component: () =>
      // if (!routerDataCache) {
      //   routerDataCache = getRouterData(app);
      // }
      component().then((raw) => {
        const Component = raw.default || raw;
        return (props) =>
          createElement(Component, {
            ...props,
            // routerData: routerDataCache,
          });
      }),
  });

/**
 * 处理数据
 */
export function getDatas(data) {
  const itemData = {};
  for (const key in data) {
    // 日期数字 特殊处理
    if (data[key] instanceof Object && key.search('Date')) {
      Object.assign(itemData, data[key]);
    } else if (data[key] instanceof Object) {
      Object.assign(itemData, { ...data[key] });
    } else {
      Object.assign(itemData, { [key]: data[key] });
    }
  }
  return itemData;
}

/**
 * 字符串替换
 * @param {} str 字符串
 * @param {*} len 替换处长度
 */
export function beautySub(str, len) {
  const reg = /[\u4e00-\u9fa5]/g;
  const slice = str.substring(0, len);
  const chineseCharNum = ~~(slice.match(reg) && slice.match(reg).length);
  const realen = slice.length * 2 - chineseCharNum;
  return str.substr(0, realen) + (realen < str.length ? '...' : '');
}

/*
动态列组件渲染
*/
export function getFieldsConfig(item) {
  const {
    enabledFlag = 0, // 是否启用
    queryFlag = 0, // 是否作为查询条件
    requiredFlag = 0, // 是否必输
    componentType = 'INPUT', // 组件类型
    gridWidth = '240', // 列宽
    multipleFlag = 0, // 是否多选
    budgetItemCode = '', // 字段名
    budgetItemName, // 列名
    gridSeq = 0, // 位置
    displayField,
    valueField,
  } = item;
  const label = intl.get(`sbud.budgeting.model.budgeting.${budgetItemCode}`).d(budgetItemName);
  const name = budgetItemCode;
  let gridField = {};
  let queryField = {};
  const columnsConfig = {
    name,
    width: gridWidth,
    gridSeq,
  };

  if (!enabledFlag) {
    return {};
  }

  switch (componentType) {
    case 'LOV':
      {
        const { lovCode } = item;
        gridField = {
          name,
          label,
          type: 'object',
          required: requiredFlag,
          valueField,
          textField: displayField,
          lovCode,
          multiple: Number(multipleFlag) === 1,
          transformRequest: (value) =>
            value
              ? Number(multipleFlag) === 1
                ? value.map((i) => i[budgetItemCode]).join(',')
                : value[budgetItemCode]
              : null,
          transformResponse: (value, record) => {
            const {
              [valueField]: budgetItemCodes = null,
              [displayField]: budgetItemCodeMeaning = null,
            } = record;
            if (budgetItemCodes && budgetItemCodeMeaning) {
              return { [valueField]: budgetItemCodes, [displayField]: budgetItemCodeMeaning };
            } else {
              return null;
            }
          },
          dynamicProps: {
            lovPara: () => ({
              tenantId: getCurrentOrganizationId(),
            }),
          },
        };
        if (queryFlag) {
          queryField = {
            name,
            label,
            type: 'object',
            lovCode,
            multiple: false,
            transformRequest: (value) => (value ? value[budgetItemCode] : null),
            dynamicProps: {
              lovPara: () => ({
                tenantId: getCurrentOrganizationId(),
              }),
            },
          };
        }
      }
      break;
    case 'SELECT':
      {
        const { lovCode } = item;
        gridField = {
          name,
          label,
          type: 'string',
          required: requiredFlag,
          lookupCode: lovCode,
          multiple: Number(multipleFlag) === 1,
        };
        if (queryFlag) {
          queryField = {
            name,
            label,
            type: 'string',
            lookupCode: lovCode,
            multiple: false,
            transformRequest: (value) => (value ? value[budgetItemCode] : null),
          };
        }
      }
      break;
    default:
      gridField = {
        name,
        label,
        type: 'string',
      };
      if (queryFlag) {
        queryField = {
          name,
          label,
          type: 'string',
        };
      }
      break;
  }

  return {
    gridField,
    queryField,
    columnsConfig,
  };
}

/**
 * 获取预算编制动态字段属性
 * @param {} item
 */

export function getBugetFieldsConfig(item) {
  const {
    enabledFlag = 0, // 是否启用
    queryFlag = 0, // 是否作为查询条件
    requiredFlag = 0, // 是否必输
    componentType = 'INPUT', // 组件类型
    gridWidth = '240', // 列宽
    multipleFlag = 0, // 是否多选
    budgetItemCode = '', // 字段名
    budgetItemName, // 列名
    gridSeq = 0, // 位置
  } = item;
  const label = intl.get(`sbud.budgeting.model.budgeting.${budgetItemCode}`).d(budgetItemName);
  const name = budgetItemCode;
  let gridField = {};
  let queryField = {};
  const columnsConfig = {
    name,
    width: gridWidth,
    gridSeq,
  };

  if (!enabledFlag) {
    return {};
  }

  switch (componentType) {
    case 'LOV':
      {
        const { lovCode } = item;
        gridField = {
          name: `${name}LOV`,
          label,
          type: 'object',
          required: requiredFlag,
          lovCode,
          multiple: Number(multipleFlag) === 1 ? ',' : false,
          dynamicProps: {
            lovPara: () => ({
              tenantId: getCurrentOrganizationId(),
            }),
          },
        };

        columnsConfig.name = `${name}LOV`;

        if (queryFlag) {
          queryField = {
            name,
            label,
            type: 'object',
            lovCode,
            multiple: false,
            transformRequest: (value) => (value ? value[budgetItemCode] : null),
            dynamicProps: {
              lovPara: () => ({
                tenantId: getCurrentOrganizationId(),
              }),
            },
          };
        }
      }
      break;
    case 'SELECT':
      {
        const { lovCode } = item;
        gridField = {
          name,
          label,
          type: 'string',
          required: requiredFlag,
          lookupCode: lovCode,
          multiple: Number(multipleFlag) === 1,
        };
        if (queryFlag) {
          queryField = {
            name,
            label,
            type: 'string',
            lookupCode: lovCode,
            multiple: false,
            transformRequest: (value) => (value ? value[budgetItemCode] : null),
          };
        }
      }
      break;
    default:
      gridField = {
        name,
        label,
        type: 'string',
      };
      if (queryFlag) {
        queryField = {
          name,
          label,
          type: 'string',
        };
      }
      break;
  }

  return {
    gridField,
    queryField,
    columnsConfig,
  };
}

const modelNotExisted = (app = {}, model) =>
  !(app._models || []).some(
    ({ namespace }) => namespace === model.substring(model.lastIndexOf('/') + 1)
  );

/**
 * 转换为千分位格式
 * @param {*} inputString 数字字符串
 */
export function numToMoneyField(inputString) {
  if (!inputString) {
    return 0;
  }
  const regExpInfo = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
  return inputString.toString().replace(regExpInfo, '$1,');
}

/* 因英文环境分页问题，单独处理
 * @Author: haixin.sun@hand-china.com
 * @Date: 2020-11-29 19:11:55
 * @Last Modified by:   haixin.sun
 * @Last Modified time: 2020-11-29 19:11:55
 */

export const resetPagination = (result) => ({
  size: 'small',
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  total: result && result.totalElements,
  showTotal: (total, range) => {
    // 设置显示一共几条数据
    // eslint-disable-next-line no-useless-concat
    return `${range[0]} - ${range[1]}` + ' / ' + `${total}`;
  },
});

/**
 * 解析查询参数
 * @author WH <haixin.sun@hand-china.com>
 * @param {Object} params
 * @returns {Object} 解析后的查询参数
 */
export function parseParameters(params) {
  const { page = {}, sort = {}, ...others } = params;
  const { current = 1, pageSize = 10 } = page;
  if (sort.order === 'ascend') {
    sort.order = 'asc';
  }
  if (sort.order === 'descend') {
    sort.order = 'desc';
  }
  if (sort.field) {
    if (sort.field.includes('Meaning')) {
      sort.field = sort.field.replace('Meaning', '');
    }
  }
  const sortObj = {};
  if (!isEmpty(sort)) {
    sortObj.sort = `${sort.field},${sort.order}`;
  }
  let size = pageSize;
  const sourceSize = [...['10', '20', '50', '100']];
  if (!sourceSize.includes(`${pageSize}`)) {
    const sizes = sortBy(uniq([...sourceSize, `${pageSize}`]), (i) => +i);
    const index = sizes.findIndex((item) => +item === pageSize);
    size = +sizes[index];
  }
  return {
    size,
    page: current - 1,
    ...others,
    ...sortObj,
  };
}

/* 数量千分位显示处理
 * @Author: haixin.sun@hand-china.com
 * @Date: 2020-11-15 18:22:34
 * @Last Modified by:   haixin.sun
 * @Last Modified time: 2020-11-15 18:22:34
 */

export const thousandsValue = (val) => val && `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
