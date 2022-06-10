/**
 * @Description: 领料单接收--DS
 * @Author: jianjun.tan<jianjun.tan@hand-china.com>
 * @Date: 2020-10-08 14:21:41
 * @LastEditors: jianjun.tan
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const commonCode = 'lwms.common.model';
const preCode = 'lwms.issueRequestReceive.model';

const issueRequestDS = () => {
  return {
    selection: false,
    paging: false,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        lovCode: common.organization,
        label: intl.get(`${preCode}.receiveOrg`).d('接收组织'),
        ignore: 'always',
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        lovCode: common.warehouse,
        label: intl.get(`${commonCode}.receiveWarehouse`).d('接收仓库'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'warehouseId',
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'warehouseName',
        bind: 'warehouseObj.warehouseName',
      },
      {
        name: 'wmAreaObj',
        type: 'object',
        lovCode: common.wmArea,
        label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'wmAreaId',
        bind: 'wmAreaObj.wmAreaId',
      },
      {
        name: 'wmAreaName',
        bind: 'wmAreaObj.wmAreaName',
      },
      {
        name: 'requestTypeObj',
        type: 'object',
        lovCode: common.documentType,
        lovPara: {
          documentClass: 'WM_REQUEST',
        },
        label: intl.get(`${commonCode}.documentType`).d('单据类型'),
        ignore: 'always',
      },
      {
        name: 'requestTypeId',
        bind: 'requestTypeObj.documentTypeId',
      },
      {
        name: 'requestTypeName',
        bind: 'requestTypeObj.documentTypeName',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        lovCode: common.prodLine,
        label: intl.get(`${preCode}.prodLine`).d('申领地点'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'prodLineId',
        bind: 'prodLineObj.prodLineId',
      },
      {
        name: 'prodLineName',
        bind: 'prodLineObj.resourceName',
      },
      {
        name: 'workerObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${preCode}.worker`).d('执行人'),
        ignore: 'always',
      },
      {
        name: 'workerId',
        bind: 'workerObj.workerId',
      },
      {
        name: 'workerName',
        bind: 'workerObj.workerName',
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LWMS}/v1/${organizationId}/request-headers/issue/execute`,
          method: 'GET',
        };
      },
    },
  };
};
const receiveDS = () => {
  return {
    selection: false,
    paging: false,
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        lovCode: common.organization,
        label: intl.get(`${preCode}.receiveOrg`).d('接收组织'),
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationCode',
        bind: 'organizationObj.organizationCode',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        lovCode: common.warehouse,
        label: intl.get(`${commonCode}.receiveWarehouse`).d('接收仓库'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
        required: true,
      },
      {
        name: 'warehouseId',
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'warehouseCode',
        bind: 'warehouseObj.warehouseCode',
      },
      {
        name: 'warehouseName',
        bind: 'warehouseObj.warehouseName',
      },
      {
        name: 'wmAreaObj',
        type: 'object',
        lovCode: common.wmArea,
        label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'wmAreaId',
        bind: 'wmAreaObj.wmAreaId',
      },
      {
        name: 'wmAreaCode',
        bind: 'wmAreaObj.wmAreaCode',
      },
      {
        name: 'wmAreaName',
        bind: 'wmAreaObj.wmAreaName',
      },
    ],
  };
};

export { issueRequestDS, receiveDS };
