/*
 * @Description: 图纸查询
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-12-16 11:11:33
 */
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

const url = `${HLOS_LMDS}/v1/${organizationId}/drawing-versions/get-file-urls`;
const preCode = 'lisp.drawingPlatform.model';

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
        label: intl.get(`${preCode}.searchSetting`).d('查询设置'),
      },
    ],
  };
};

export const listDS = () => {
  return {
    autoQuery: false,
    selection: false,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        lovCode: 'LMDS.ORGANIZATION',
        label: '组织',
        ignore: 'always',
      },
      { name: 'organizationId', type: 'string', bind: 'organizationObj.organizationId' },
      { name: 'organizationCode', type: 'string', bind: 'organizationObj.organizationCode' },
      {
        name: 'drawingObj',
        type: 'object',
        lovCode: 'LMDS.DRAWING',
        label: '图纸',
        ignore: 'always',
        // required: true,
      },
      { name: 'drawingId', type: 'string', bind: 'drawingObj.drawingId' },
      { name: 'drawingCode', type: 'string', bind: 'drawingObj.drawingCode' },
      {
        name: 'productObj',
        type: 'object',
        lovCode: 'LMDS.ITEM',
        label: '产品',
        ignore: 'always',
      },
      { name: 'productId', type: 'string', bind: 'productObj.itemId' },
      { name: 'productCode', type: 'string', bind: 'productObj.itemCode' },
      {
        name: 'itemObj',
        type: 'object',
        lovCode: 'LMDS.ITEM',
        label: '物料',
        ignore: 'always',
      },
      { name: 'itemId', type: 'string', bind: 'itemObj.itemId' },
      { name: 'itemCode', type: 'string', bind: 'itemObj.itemCode' },
      {
        name: 'operationObj',
        type: 'object',
        lovCode: 'LMDS.OPERATION',
        label: '工序',
        ignore: 'always',
      },
      { name: 'operationId', type: 'string', bind: 'operationObj.operationId' },
      { name: 'operationCode', type: 'string', bind: 'operationObj.operationCode' },
      {
        name: 'projectNum',
        type: 'string',
        label: '项目',
      },
      {
        name: 'partyObj',
        type: 'object',
        lovCode: 'LMDS.PARTY',
        label: '商业伙伴',
        ignore: 'always',
      },
      { name: 'partyId', type: 'string', bind: 'partyObj.partyId' },
      { name: 'partyNumber', type: 'string', bind: 'partyObj.partyNumber' },
    ],
    transport: {
      read: () => {
        return {
          url,
          method: 'GET',
        };
      },
    },
  };
};
