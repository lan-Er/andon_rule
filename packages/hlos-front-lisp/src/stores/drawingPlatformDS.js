/*
 * @Description: 图纸平台-DataSet
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 16:11:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-19 16:13:30
 * @Copyright: Copyright (c) 2018, Hand
 */
import moment from 'moment';
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';

const preCode = 'lisp.drawingPlatform.model';
const url = `${HLOS_LISP}/v1/datas`;

const { loginName } = getCurrentUser();

export const headDS = () => {
  return {
    autoQuery: true,
    selection: false,
    queryFields: [
      {
        name: 'attribute2',
        type: 'string',
        lookupCode: 'LMDS.DRAWING',
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
                      meaning: item.attribute2,
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
        name: 'attribute1',
        type: 'string',
        lookupCode: 'LMDS.DRAWING_TYPE',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_TYPE',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute2`).d('图纸类型'),
      },
      {
        name: 'attribute6',
        type: 'string',
        lookupCode: 'LMDS.DRAWING_CATEGORY',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_CATEGORY',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute2`).d('图纸类别'),
      },
      {
        name: 'attribute23',
        type: 'string',
        lookupCode: 'HWFP.PROCESS_DEFINITION',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_WORKFLOW',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute2`).d('审核流程模板'),
      },
      {
        name: 'attribute22',
        type: 'string',
        lookupCode: 'LMDS.PRODUCT',
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
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute2`).d('产品'),
      },
      {
        name: 'attribute12',
        type: 'string',
        lookupCode: 'LMDS.CATEGORY',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_ITEM_CATEGORY',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute2`).d('物料类型'),
      },
      {
        name: 'attribute14',
        type: 'string',
        lookupCode: 'LMDS.ITEM',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_ITEM',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute2`).d('物料'),
      },
      {
        name: 'attribute16',
        type: 'string',
        lookupCode: 'LMDS.OPERATION',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_OPERATION',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute2`).d('工序'),
      },
      {
        name: 'attribute18',
        type: 'string',
        lookupCode: 'LMDS.SUPPLIER',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_SUPPLIER',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute2`).d('商业伙伴'),
      },
      {
        name: 'attribute19',
        type: 'string',
        label: intl.get(`${preCode}.attribute2`).d('项目'),
      },
      {
        name: 'attribute20',
        type: 'string',
        label: intl.get(`${preCode}.attribute2`).d('WBS号'),
      },
      {
        name: 'attribute21',
        type: 'string',
        label: intl.get(`${preCode}.attribute2`).d('外部ID'),
      },
      {
        name: 'attribute22',
        type: 'string',
        label: intl.get(`${preCode}.attribute2`).d('外部编号'),
      },
      {
        name: 'attribute24',
        type: 'boolean',
        label: intl.get(`${preCode}.attribute2`).d('是否有效'),
        defaultValue: '1',
        trueValue: '1',
        falseValue: '0',
      },
    ],
    fields: [
      {
        name: 'attribute1',
        label: intl.get(`${preCode}.attribute1`).d('图纸类型'),
      },
      {
        name: 'attribute2',
        label: intl.get(`${preCode}.attribute2`).d('图纸编码'),
      },
      {
        name: 'attribute3',
        label: intl.get(`${preCode}.attribute3`).d('图纸名称'),
      },
      {
        name: 'attribute4',
        label: intl.get(`${preCode}.attribute4`).d('图纸简称'),
      },
      {
        name: 'attribute5',
        label: intl.get(`${preCode}.attribute5`).d('图纸描述'),
      },
      {
        name: 'attribute6',
        label: intl.get(`${preCode}.attribute6`).d('图纸类别'),
      },
      {
        name: 'attribute7',
        label: intl.get(`${preCode}.attribute7`).d('图纸分组'),
      },
      {
        name: 'attribute8',
        label: intl.get(`${preCode}.attribute8`).d('关联图纸'),
      },
      {
        name: 'attribute9',
        label: intl.get(`${preCode}.attribute9`).d('图纸层级编码'),
      },
      {
        name: 'attribute10',
        label: intl.get(`${preCode}.attribute10`).d('产品'),
      },
      {
        name: 'attribute11',
        label: intl.get(`${preCode}.attribute11`).d('产品描述'),
      },
      {
        name: 'attribute12',
        label: intl.get(`${preCode}.attribute12`).d('物料类型'),
      },
      {
        name: 'attribute13',
        label: intl.get(`${preCode}.attribute13`).d('物料'),
      },
      {
        name: 'attribute14',
        label: intl.get(`${preCode}.attribute14`).d('物料描述'),
      },
      {
        name: 'attribute15',
        label: intl.get(`${preCode}.attribute15`).d('工序'),
      },
      {
        name: 'attribute16',
        label: intl.get(`${preCode}.attribute16`).d('工序名称'),
      },
      {
        name: 'attribute17',
        label: intl.get(`${preCode}.attribute17`).d('商业伙伴'),
      },
      {
        name: 'attribute18',
        label: intl.get(`${preCode}.attribute18`).d('商业伙伴名称'),
      },
      {
        name: 'attribute19',
        label: intl.get(`${preCode}.attribute19`).d('项目号'),
      },
      {
        name: 'attribute20',
        label: intl.get(`${preCode}.attribute20`).d('WBS号'),
      },
      {
        name: 'attribute21',
        label: intl.get(`${preCode}.attribute21`).d('外部ID'),
      },
      {
        name: 'attribute22',
        label: intl.get(`${preCode}.attribute22`).d('外部编号'),
      },
      {
        name: 'attribute23',
        label: intl.get(`${preCode}.attribute23`).d('审核流程模板'),
      },
      {
        name: 'attribute24',
        type: 'boolean',
        label: intl.get(`${preCode}.attribute2`).d('是否有效'),
        defaultValue: '1',
        trueValue: '1',
        falseValue: '0',
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

export const lineDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'attribute1',
        label: intl.get(`${preCode}.attribute1`).d('图纸编码'),
      },
      {
        name: 'attribute2',
        label: intl.get(`${preCode}.attribute2`).d('图纸版本'),
      },
      {
        name: 'attribute3',
        label: intl.get(`${preCode}.attribute1`).d('图纸版本描述'),
      },
      {
        name: 'attribute4',
        label: intl.get(`${preCode}.attribute2`).d('图纸版本状态'),
      },
      {
        name: 'attribute5',
        label: intl.get(`${preCode}.attribute1`).d('图纸文件'),
      },
      {
        name: 'attribute6',
        label: intl.get(`${preCode}.attribute2`).d('设计者'),
      },
      {
        name: 'attribute7',
        label: intl.get(`${preCode}.attribute1`).d('审核流程'),
      },
      {
        name: 'attribute8',
        label: intl.get(`${preCode}.attribute2`).d('审核人'),
      },
      {
        name: 'attribute9',
        type: 'date',
        label: intl.get(`${preCode}.attribute1`).d('签发日期'),
      },
      {
        name: 'attribute10',
        type: 'date',
        label: intl.get(`${preCode}.attribute2`).d('生效日期'),
        max: 'attribute11',
      },
      {
        name: 'attribute11',
        type: 'date',
        label: intl.get(`${preCode}.attribute1`).d('失效日期'),
        min: 'attribute10',
      },
      {
        name: 'attribute12',
        type: 'boolean',
        label: intl.get(`${preCode}.attribute2`).d('是否最新版本'),
        defaultValue: '1',
        trueValue: '1',
        falseValue: '0',
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
            dataType: 'DRAWING_EDIT_HEAD_LINE',
          },
          method: 'GET',
        };
      },
    },
  };
};

export const historyDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'attribute1',
        type: 'string',
        label: '图纸编码',
      },
      {
        name: 'attribute2',
        type: 'string',
        label: '图纸版本',
      },
      {
        name: 'attribute3',
        type: 'string',
        label: '图纸文件',
      },
      {
        name: 'attribute4',
        type: 'date',
        label: '创建日期',
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
            dataType: 'DRAWING_EDIT_HEAD_LINE_HISTORY',
          },
          method: 'GET',
        };
      },
    },
  };
};

export const detailHeadDS = () => {
  return {
    autoQuery: false,
    selection: false,
    autoCreate: true,
    fields: [
      {
        name: 'attribute1',
        type: 'string',
        lookupCode: 'LMDS.DRAWING_TYPE',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_TYPE',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute1`).d('图纸类型'),
        required: true,
      },
      {
        name: 'attribute2',
        type: 'string',
        label: intl.get(`${preCode}.attribute2`).d('图纸编码'),
        required: true,
      },
      {
        name: 'attribute3',
        type: 'string',
        label: intl.get(`${preCode}.attribute3`).d('图纸名称'),
        required: true,
      },
      {
        name: 'attribute4',
        type: 'string',
        label: intl.get(`${preCode}.attribute4`).d('图纸简称'),
      },
      {
        name: 'attribute5',
        type: 'string',
        label: intl.get(`${preCode}.attribute5`).d('图纸描述'),
      },
      {
        name: 'attribute6',
        type: 'string',
        lookupCode: 'LMDS.DRAWING_CATEGORY',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_CATEGORY',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute6`).d('图纸类别'),
      },
      {
        name: 'attribute7',
        type: 'string',
        label: intl.get(`${preCode}.attribute7`).d('图纸分组'),
      },
      {
        name: 'attribute8',
        type: 'string',
        label: intl.get(`${preCode}.attribute8`).d('关联图纸'),
      },
      {
        name: 'attribute9',
        type: 'string',
        label: intl.get(`${preCode}.attribute9`).d('图纸层级编码'),
      },
      {
        name: 'attributeName',
        type: 'object',
        lookupCode: 'LMDS.PRODUCT_DRAWING_PLATFORM',
        valueFiled: 'meaning',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_PRODUCT',
              user: loginName,
              ids: 100,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute1,
                      meaning: item.attribute1,
                      desc: item.attribute2,
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
        ignore: 'always',
      },
      {
        name: 'attribute10',
        type: 'string',
        bind: 'attributeName.value',
      },
      {
        name: 'attribute11',
        label: '产品描述',
        type: 'string',
        bind: 'attributeName.desc',
      },
      {
        name: 'attribute12',
        type: 'string',
        lookupCode: 'LMDS.PRODUCT',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_ITEM_CATEGORY',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute12`).d('物料类别'),
      },
      {
        name: 'attributeName13',
        type: 'object',
        lookupCode: 'LMDS.PRODUCT',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_ITEM',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute1,
                      meaning: item.attribute1,
                      desc: item.attribute2,
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
        label: intl.get(`${preCode}.attribute12`).d('物料'),
        ignore: 'always',
      },
      {
        name: 'attribute13',
        type: 'string',
        bind: 'attributeName13.value',
      },
      {
        name: 'attribute14',
        type: 'string',
        label: intl.get(`${preCode}.attribute14`).d('物料描述'),
        bind: 'attributeName13.desc',
      },
      {
        name: 'attributeName15',
        type: 'object',
        lookupCode: 'LMDS.PRODUCT',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_OPERATION',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute1,
                      meaning: item.attribute1,
                      name: item.attribute2,
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
        ignore: 'always',
      },
      {
        name: 'attribute15',
        type: 'string',
        bind: 'attributeName15.value',
      },
      {
        name: 'attribute16',
        type: 'string',
        label: intl.get(`${preCode}.attribute16`).d('工序名称'),
        bind: 'attributeName15.name',
      },
      {
        name: 'attribute17',
        type: 'string',
        label: intl.get(`${preCode}.attribute17`).d('项目'),
      },
      {
        name: 'attribute18',
        type: 'string',
        label: intl.get(`${preCode}.attribute18`).d('WBS号'),
      },
      {
        name: 'attributeName19',
        type: 'object',
        lookupCode: 'LMDS.PRODUCT',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_SUPPLIER',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute1,
                      meaning: item.attribute1,
                      name: item.attribute2,
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
        label: intl.get(`${preCode}.attribute19`).d('商业伙伴'),
        ignore: 'always',
      },
      {
        name: 'attribute19',
        type: 'string',
        bind: 'attributeName19.value',
      },
      {
        name: 'attribute20',
        type: 'string',
        label: intl.get(`${preCode}.attribute20`).d('商业伙伴名称'),
        bind: 'attributeName19.name',
      },
      {
        name: 'attribute21',
        type: 'string',
        label: intl.get(`${preCode}.attribute21`).d('外部ID'),
      },
      {
        name: 'attribute22',
        type: 'string',
        label: intl.get(`${preCode}.attribute22`).d('外部编号'),
      },
      {
        name: 'attribute23',
        label: intl.get(`${preCode}.attribute23`).d('审核流程模板'),
        type: 'string',
        lookupCode: 'LMDS.DRAWING_EDIT_WORKFLOW',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_WORKFLOW',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
      },
      {
        name: 'attribute24',
        type: 'boolean',
        label: intl.get(`${preCode}.attribute2`).d('是否有效'),
        defaultValue: '1',
        trueValue: '1',
        falseValue: '0',
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
      update: ({ data }) => {
        return {
          url,
          data: data.map((item) => ({
            ...item,
            user: loginName,
            functionType: 'DRAWING',
            dataType: 'DRAWING_EDIT_HEAD',
          })),
          method: 'PUT',
        };
      },
      submit: ({ data }) => {
        return {
          url,
          data: data.map((item) => ({
            ...item,
            user: loginName,
            functionType: 'DRAWING',
            dataType: 'DRAWING_EDIT_HEAD',
          })),
          method: 'POST',
        };
      },
    },
    events: {
      submitSuccess: ({ dataSet }) => dataSet.query(),
    },
  };
};

export const detailLineDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'attribute1',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('图纸编码'),
      },
      {
        name: 'attribute2',
        type: 'string',
        label: intl.get(`${preCode}.attribute2`).d('图纸版本'),
      },
      {
        name: 'attribute3',
        type: 'string',
        label: intl.get(`${preCode}.attribute3`).d('图纸版本描述'),
      },
      {
        name: 'attribute4',
        type: 'string',
        lookupCode: 'LMDS.DRAWING_EDIT_VERSION_STATUS',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_VERSION_STATUS',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
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
        label: intl.get(`${preCode}.attribute4`).d('图纸版本状态'),
      },
      {
        name: 'attribute5',
        type: 'string',
        label: intl.get(`${preCode}.attribute5`).d('图纸文件'),
      },
      {
        name: 'attribute6',
        type: 'string',
        label: intl.get(`${preCode}.attribute6`).d('设计者'),
      },
      {
        name: 'attribute7',
        type: 'string',
        lookupCode: 'LMDS.PRODUCT',
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_AUDIT_WORKFLOW',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
                      reviewer: item.attribute3,
                    });
                  });
                }
              } else {
                newData = data;
              }
              if (newData) {
                const localNewData = JSON.stringify(newData);
                localStorage.setItem('drawingPlatformLocal', localNewData);
              }
              return newData;
            },
          }),
        },
        label: intl.get(`${preCode}.attribute7`).d('审核流程'),
      },
      {
        name: 'attribute8',
        type: 'string',
        label: intl.get(`${preCode}.attribute8`).d('审核人'),
      },
      {
        name: 'attribute9',
        type: 'date',
        label: intl.get(`${preCode}.attribute9`).d('签发日期'),
        defaultValue: moment(),
      },
      {
        name: 'attribute10',
        type: 'date',
        label: intl.get(`${preCode}.attribute10`).d('生效日期'),
        max: 'attribute11',
      },
      {
        name: 'attribute11',
        type: 'date',
        label: intl.get(`${preCode}.attribute11`).d('失效日期'),
        min: 'attribute10',
      },
      {
        name: 'attribute12',
        type: 'boolean',
        label: intl.get(`${preCode}.attribute12`).d('是否最新版本'),
        defaultValue: '1',
        trueValue: '1',
        falseValue: '0',
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
            dataType: 'DRAWING_EDIT_HEAD_LINE',
          },
          method: 'GET',
          transformResponse: (value) => {
            const newValue = JSON.parse(value);
            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = newValue.content.map((item, index) => ({ ...item, key: index }));
            }
            return { ...value, content };
          },
        };
      },
      update: ({ data, dataSet }) => {
        dataSet.map((item) => item.set('attribute12', '0'));
        return {
          url,
          data: [
            {
              ...data[0],
              user: loginName,
              functionType: 'DRAWING',
              dataType: 'DRAWING_EDIT_HEAD_LINE',
            },
          ],
          method: 'PUT',
        };
      },
      submit: ({ data }) => {
        return {
          url,
          data: data.map((item) => ({
            ...item,
            user: loginName,
            functionType: 'DRAWING',
            dataType: 'DRAWING_EDIT_HEAD_LINE',
          })),
          method: 'POST',
        };
      },
    },
    events: {
      update: ({ record, name, value }) => {
        if (name === 'attribute7') {
          const drawingPlatformLocal = localStorage.getItem('drawingPlatformLocal');
          const localNewDatas =
            typeof drawingPlatformLocal === 'string' ? JSON.parse(drawingPlatformLocal) : '';
          const reviewerObj = localNewDatas.filter((item) => item.value === value);
          record.set('attribute8', reviewerObj[0].reviewer);
        }
      },
      submitSuccess: ({ dataSet }) => dataSet.query(),
    },
  };
};
