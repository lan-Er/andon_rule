/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-03-08 21:30:51
 */

import { DataSet } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { lwmsCostcenterCreate, common } = codeConfig.code;
const intlPrefix = 'lwms.issueRequestPlatform.model';
const detailDS = () => ({
  autoCreate: true,
  children: {
    line: new DataSet({ ...lineListDS() }),
  },
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.organization,
      label: intl.get(`${intlPrefix}.model.organization`).d('组织'),
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
      name: 'costCenterObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: lwmsCostcenterCreate.costCenter,
      label: intl.get(`${intlPrefix}.costCenter`).d('成本中心'),
      required: true,
    },
    {
      name: 'costCenterId',
      bind: 'costCenterObj.costCenterId',
    },
    {
      name: 'costCenter',
      bind: 'organizationObj.costCenterCode',
    },
    {
      name: 'requestNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.issueRequestNum`).d('领料单号'),
    },
    {
      name: 'requestDepartmentObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.department,
      label: intl.get(`${intlPrefix}.requestDepartment`).d('申领部门'),
    },
    {
      name: 'requestDepartmentId',
      bind: 'requestDepartmentObj.departmentId',
    },
    {
      name: 'requestDepartment',
      bind: 'requestDepartmentObj.departmentCode',
    },
    {
      name: 'requestReason',
      type: 'string',
      label: intl.get(`${intlPrefix}.requestReason`).d('领料原因'),
    },
    {
      name: 'warehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('organizationId')) {
            return { organizationId: record.get('organizationId') };
          } else {
            return { organizationId: 'undefined' };
          }
        },
      },
      label: intl.get(`${intlPrefix}.fromWarehouse`).d('来源仓库'),
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('warehouseId')) {
            return {
              warehouseId: record.get('warehouseId'),
              organizationId: record.get('organizationId'),
            };
          } else {
            return { warehouseId: 'undefined', organizationId: record.get('organizationId') };
          }
        },
      },
      label: intl.get(`${intlPrefix}.fromArea`).d('来源货位'),
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'requestWorkerObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.worker,
      label: intl.get(`${intlPrefix}.requestWorker`).d('申领员工'),
    },
    {
      name: 'requestWorkerId',
      type: 'string',
      bind: 'requestWorkerObj.workerId',
    },
    {
      name: 'requestWorker',
      type: 'string',
      bind: 'requestWorkerObj.workerCode',
    },
    {
      name: 'projestNum',
      type: 'string',
      // 使用locale的lwms.issueRequestPlatform
      label: intl.get(`${intlPrefix}.projestNum`).d('项目号'),
    },
    {
      name: 'outerRequestNum',
      type: 'string',
      // 使用locale的lwms.issueRequestPlatform
      label: intl.get(`${intlPrefix}.outerNum`).d('申领单号'),
    },
    {
      name: 'requestGroup',
      type: 'string',
      label: intl.get(`${intlPrefix}.requestGroup`).d('领料单组'),
    },
  ],
  transport: {},
  events: {
    update: ({ name, record, dataSet }) => {
      if (name === 'organizationObj') {
        record.set('costCenterObj', null);
        record.set('requestDepartmentObj', null);
        record.set('warehouseObj', null);
        record.set('wmAreaObj', null);
        record.set('requestWorkerObj', null);
        record.set('requestNum', '');
        record.set('requestReason', '');
        record.set('projestNum', '');
        record.set('outerRequestNum', '');
        record.set('requestGroup', '');
        if (dataSet.children.line) {
          record.set('warehouseObj', null);
          dataSet.children.line.records.clear();
        }
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
        const fatherWarehouseObj = dataSet.data[0].data.warehouseObj;
        if (!fatherWarehouseObj) {
          // 如果不存在
          dataSet.children.line.fields.get('warehouseObj').set('disabled', false);
        } else {
          dataSet.children.line.forEach((i) => {
            i.set('warehouseObj', fatherWarehouseObj);
            i.set('wmAreaObj', null);
          });
          dataSet.children.line.fields.get('warehouseObj').set('disabled', true);
        }
      }
      if (name === 'wmAreaObj') {
        const fatherWmAreaObj = dataSet.data[0].data.wmAreaObj;
        if (!fatherWmAreaObj) {
          // 如果不存在
          dataSet.children.line.fields.get('wmAreaObj').set('disabled', false);
        } else {
          dataSet.children.line.forEach((i) => {
            i.set('wmAreaObj', fatherWmAreaObj);
          });
          dataSet.children.line.fields.get('wmAreaObj').set('disabled', true);
        }
      }
      if (name === 'costCenterObj') {
        const fatherCostCenter = dataSet.current.get('costCenterObj');
        dataSet.children.line.forEach((i) => {
          i.set('costCenterObj', fatherCostCenter);
        });
        dataSet.children.line.fields.get('costCenterObj').set('disabled', true);
      }
    },
  },
});

const lineListDS = () => ({
  primaryKey: 'requestId',
  fields: [
    {
      name: 'requestLineNum',
      type: 'number',
      label: intl.get(`${intlPrefix}.requestLineNum`).d('行号'),
      disabled: true,
    },
    {
      name: 'itemObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.item,
      label: intl.get(`${intlPrefix}.item`).d('物料'),
      required: true,
      dynamicProps: {
        lovPara: ({ dataSet }) => {
          if (dataSet.parent.current.get('organizationId')) {
            return { meOuId: dataSet.parent.current.get('organizationId') };
          } else {
            return { meOuId: 'undefined' };
          }
        },
      },
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'description',
      type: 'string',
      bind: 'itemObj.description',
      label: intl.get(`${intlPrefix}.description`).d('描述'),
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'itemObj.uomName',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'itemObj.uomId',
    },
    {
      name: 'secondUomId',
      type: 'string',
      bind: 'itemObj.secondUomId',
    },
    {
      name: 'secondUom',
      type: 'string',
      bind: 'itemObj.secondUom',
    },
    {
      name: 'applyQty',
      type: 'number',
      required: true,
      label: intl.get(`${intlPrefix}.applyQty`).d('申请数量'),
    },
    {
      name: 'availableQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.availableQty`).d('可用量'),
      min: 0,
    },
    {
      name: 'onhandQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.onhandQty`).d('现有量'),
      min: 0,
    },
    {
      name: 'warehouseObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.warehouse,
      dynamicProps: {
        lovPara: ({ dataSet }) => {
          if (dataSet.parent.current.get('organizationId')) {
            return { organizationId: dataSet.parent.current.get('organizationId') };
          } else {
            return { organizationId: 'undefined' };
          }
        },
      },
      label: intl.get(`${intlPrefix}.fromWarehouse`).d('来源仓库'),
      required: true,
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.wmArea,
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('warehouseId')) {
            return {
              warehouseId: record.get('warehouseId'),
              organizationId: record.get('organizationId'),
            };
          } else {
            return {
              warehouseId: 'undefined',
              organizationId: 'undefined',
            };
          }
        },
      },
      label: intl.get(`${intlPrefix}.fromArea`).d('来源货位'),
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'costCenterObj',
      type: 'object',
      noCache: true,
      disabled: true,
      ignore: 'always',
      lovCode: 'LMDS.COST_CENTER_CODE',
      label: intl.get(`${intlPrefix}.costCenter`).d('成本中心'),
    },
    {
      name: 'projectNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.projectNum`).d('项目号'),
    },
    {
      name: 'secondUom',
      type: 'string',
      bind: 'itemObj.secondUomName',
      label: intl.get(`${intlPrefix}.secondUOM`).d('辅单位'),
    },
    {
      name: 'secondApplyQty',
      type: 'number',
      cascadeMap: { secondUom: 'secondUom' },
      label: intl.get(`${intlPrefix}.secondApplyQty`).d('辅单位数量'),
    },
    {
      name: 'pickRuleObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.rule,
      lovPara: {
        ruleType: 'PICK',
      },
      label: intl.get(`${intlPrefix}.pickRule`).d('拣料规则'),
    },
    {
      name: 'pickRuleId',
      type: 'string',
      bind: 'pickRuleObj.ruleId',
    },
    {
      name: 'pickRule',
      type: 'string',
      bind: 'pickRuleObj.ruleCode',
    },
    {
      name: 'reservationRuleObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.reservationRule`).d('预留规则'),
      lovCode: common.rule,
      lovPara: {
        ruleType: 'RESERVATION',
      },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'reservationRuleId',
      type: 'string',
      bind: 'reservationRuleObj.ruleId',
    },
    {
      name: 'reservationRule',
      type: 'string',
      bind: 'reservationRuleObj.ruleCode',
    },
    {
      name: 'fifoRuleObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.fifoRule`).d('FIFO规则'),
      lovCode: common.rule,
      lovPara: {
        ruleType: 'FIFO',
      },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'fifoRuleId',
      type: 'string',
      bind: 'fifoRuleObj.ruleId',
    },
    {
      name: 'fifoRule',
      type: 'string',
      bind: 'fifoRuleObj.ruleCode',
    },
    {
      name: 'wmInspectRuleObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.wmInspectRule`).d('仓库检验规则'),
      lovCode: common.rule,
      lovPara: {
        ruleType: 'WM_INSPECT',
      },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'applyPackQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.applyPackQty`).d('申请包装数量'),
    },
    {
      name: 'applyWeight',
      type: 'number',
      label: intl.get(`${intlPrefix}.applyWeight`).d('申请重量'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.lotNumber`).d('指定批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.tag`).d('指定标签'),
    },
    {
      name: 'itemControlType',
      type: 'string',
      label: '物料控制类型',
      lookupCode: common.itemControlType,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
  ],
  transport: {},
  events: {
    update: ({ name, record }) => {
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'itemObj') {
        record.set('secondApplyQty', '');
      }
    },
  },
});

export default detailDS;
