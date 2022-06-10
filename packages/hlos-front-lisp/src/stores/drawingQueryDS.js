/*
 * @Description: 图纸平台-DataSet
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 16:11:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-19 16:13:57
 * @Copyright: Copyright (c) 2018, Hand
 */
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';

const url = `${HLOS_LISP}/v1/datas`;
const preCode = 'lisp.drawingPlatform.model';

const { loginName } = getCurrentUser();

export const headDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'searchSetting',
        type: 'string',
        lookupCode: 'LMDS.DRAWING_SELECT',
        multiple: true,
        defaultValue: ['attribute2'],
        label: intl.get(`${preCode}.searchSetting`).d('查询设置'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            user: loginName,
            functionType: 'DRAWING',
            dataType: 'DRAWING_EDIT_HEAD',
          },
          method: 'GET',
        };
      },
    },
  };
};

export const listDS = () => {
  return {
    autoQuery: false,
    selection: false,
    queryFields: [
      {
        name: 'attribute2',
        type: 'string',
        lookupCode: 'LMDS.DRAWING_EDIT_HEAD',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_HEAD',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: `${item.attribute2}_${item.attribute3}`,
                    });
                  });
                }
              } else {
                newData = data;
              }
              return newData;
            },
          }),
        },
        label: intl.get(`${preCode}.attribute2`).d('图纸'),
      },
      {
        name: 'attribute10',
        type: 'string',
        lookupCode: 'LMDS.DRAWING_EDIT_PRODUCT_DRAWING_QUERY',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_PRODUCT',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: `${item.attribute1}_${item.attribute2}`,
                      meaning: `${item.attribute1}_${item.attribute2}`,
                    });
                  });
                }
              } else {
                newData = data;
              }
              return newData;
            },
          }),
        },
        label: intl.get(`${preCode}.attribute10`).d('产品'),
      },
      {
        name: 'attribute13',
        type: 'string',
        lookupCode: 'LMDS.DRAWING_EDIT_ITEM',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_ITEM',
              user: loginName,
              ids: 10,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute1,
                      meaning: `${item.attribute1}_${item.attribute2}`,
                    });
                  });
                }
              } else {
                newData = data;
              }
              return newData;
            },
          }),
        },
        label: intl.get(`${preCode}.attribute13`).d('物料'),
      },
      {
        name: 'attribute15',
        type: 'string',
        lookupCode: 'LMDS.DRAWING_EDIT_OPERATION',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_OPERATION',
              user: loginName,
              ids: 10,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute1,
                      meaning: `${item.attribute1}_${item.attribute2}`,
                    });
                  });
                }
              } else {
                newData = data;
              }
              return newData;
            },
          }),
        },
        label: intl.get(`${preCode}.attribute15`).d('工序'),
      },
      {
        name: 'attribute17',
        type: 'string',
        lookupCode: 'LMDS.DRAWING_EDIT_SUPPLIER',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_SUPPLIER',
              user: loginName,
              ids: 10,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute1,
                      meaning: `${item.attribute1}_${item.attribute2}`,
                    });
                  });
                }
              } else {
                newData = data;
              }
              return newData;
            },
          }),
        },
        label: intl.get(`${preCode}.attribute17`).d('供应商'),
      },
      {
        name: 'attribute19',
        label: intl.get(`${preCode}.attribute19`).d('项目'),
      },
      {
        name: 'attribute21',
        label: intl.get(`${preCode}.attribute21`).d('外部ID'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            user: loginName,
            functionType: 'DRAWING',
            dataType: 'DRAWING_EDIT_HEAD',
          },
          method: 'GET',
        };
      },
    },
  };
};
