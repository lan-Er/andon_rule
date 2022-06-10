/**
 /*
 * @Description: 安灯履历
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-03 16:59:13
 * @LastEditors: Please set LastEditors
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const commonPrefix = 'lmes.common.model';
const intlPrefix = 'lmes.andonJournal.model';
const organizationId = getCurrentOrganizationId();
const { common, lmesAndonJournal } = codeConfig.code;
const queryJournalUrl = `${HLOS_LMES}/v1/${organizationId}/andon-journals/list`;
const queryDetailUrl = `${HLOS_LMES}/v1/${organizationId}/andon-journal-lines/list`;

export const andonQueryFieldsDS = () => ({
  autoCreate: true,
  events: {
    update({ record, name, value }) {
      if (!value) {
        if (name === 'organizationObj') {
          record.set('andonBinObj', null);
          record.set('andonObj', null);
          record.set('prodLineObj', null);
          record.set('sourceDocNumObj', null);
          record.set('triggeredByObj', null);
          record.set('respondedByObj', null);
          record.set('closedByObj', null);
          record.set('equipmentObj', null);
        } else if (name === 'andonBinId') {
          record.set('andonObj', null);
        } else if (name === 'prodLineId') {
          record.set('equipmentObj', null);
        } else if (name === 'workcellId') {
          record.set('equipmentObj', null);
        }
      }
    },
  },
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonPrefix}.organization`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'andonBinObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${intlPrefix}.andonBin`).d('安灯灯箱'),
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
      lovCode: lmesAndonJournal.andonBin,
    },
    {
      name: 'andonBinId',
      type: 'string',
      bind: 'andonBinObj.andonBinId',
    },
    {
      name: 'andonBinCode',
      type: 'string',
      bind: 'andonBinObj.andonBinCode',
    },
    {
      name: 'andonBinName',
      type: 'string',
      bind: 'andonBinObj.andonBinName',
    },
    {
      name: 'andonObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${intlPrefix}.andon`).d('安灯'),
      lovCode: lmesAndonJournal.andon,
      cascadeMap: {
        organizationId: 'organizationId',
        andonBinId: 'andonBinId',
      },
      ignore: 'always',
    },
    {
      name: 'andonId',
      type: 'string',
      bind: 'andonObj.andonId',
    },
    {
      name: 'andonCode',
      type: 'string',
      bind: 'andonObj.andonCode',
    },
    {
      name: 'andonName',
      type: 'string',
      bind: 'andonObj.andonName',
    },
    {
      name: 'status',
      type: 'string',
      lookupCode: lmesAndonJournal.andonStatus,
      label: intl.get(`${intlPrefix}.status`).d('状态'),
    },
    {
      name: 'prodLineObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonPrefix}.prodLine`).d('生产线'),
      lovCode: common.prodLine,
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: 'string',
      bind: 'prodLineObj.prodLineCode',
    },
    {
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLineObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'workcellObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonPrefix}.workcell`).d('工位'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      lovCode: common.workcell,
      ignore: 'always',
      cascadeMap: { prodLineId: 'prodLineId' },
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      type: 'string',
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'workcellName',
      type: 'string',
      bind: 'workcellObj.workcellName',
    },
    {
      name: 'andonClassObj',
      type: 'object',
      noCache: true,
      lovCode: common.andonClass,
      label: intl.get(`${commonPrefix}.andonClass`).d('安灯分类'),
      ignore: 'always',
    },
    {
      name: 'andonClassId',
      type: 'string',
      bind: 'andonClassObj.andonClassId',
    },
    {
      name: 'andonClassCode',
      type: 'string',
      bind: 'andonClassObj.andonClassCode',
    },
    {
      name: 'andonClassName',
      type: 'string',
      bind: 'andonClassObj.andonClassName',
    },
    {
      name: 'sourceDocNumObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单据号'),
      lovCode: common.document,
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      bind: 'sourceDocNumObj.documentNum',
    },
    {
      name: 'sourceDocId',
      type: 'string',
      bind: 'sourceDocNumObj.documentId',
    },
    {
      name: 'triggeredByObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${intlPrefix}.triggeredBy`).d('触发人员'),
      lovCode: common.worker,
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    {
      name: 'triggeredBy',
      type: 'string',
      bind: 'triggeredByObj.workerId',
    },
    {
      name: 'triggeredByName',
      type: 'string',
      bind: 'triggeredByObj.workerName',
      ignore: 'always',
    },
    {
      name: 'triggeredByCode',
      type: 'string',
      bind: 'triggeredByObj.workerCode',
    },
    {
      name: 'respondedByObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${intlPrefix}.respondedBy`).d('响应人员'),
      lovCode: common.worker,
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    {
      name: 'responsedBy',
      type: 'string',
      bind: 'respondedByObj.workerId',
    },
    {
      name: 'responsedByName',
      type: 'string',
      bind: 'respondedByObj.workerName',
      ignore: 'always',
    },
    {
      name: 'responsedByCode',
      type: 'string',
      bind: 'respondedByObj.workerCode',
    },
    {
      name: 'closedByObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${intlPrefix}.closedBy`).d('关闭人员'),
      lovCode: common.worker,
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    {
      name: 'closedBy',
      type: 'string',
      bind: 'closedByObj.workerId',
    },
    {
      name: 'closedByName',
      type: 'string',
      bind: 'closedByObj.workerName',
      ignore: 'always',
    },
    {
      name: 'closedByCode',
      type: 'string',
      bind: 'closedByObj.workerCode',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonPrefix}.equipment`).d('设备'),
      lovCode: common.equipment,
      cascadeMap: {
        organizationId: 'organizationId',
        prodLineId: 'prodLineId',
        workcellId: 'workcellId',
      },
      ignore: 'always',
    },
    {
      name: 'equipmentId',
      type: 'string',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentCode',
      type: 'string',
      bind: 'equipmentObj.equipmentCode',
    },
    {
      name: 'equipmentName',
      type: 'string',
      bind: 'equipmentObj.equipmentName',
    },
    {
      name: 'startTriggeredTime',
      type: 'dateTime',
      max: 'endTriggeredTime',
      format: 'YY-MM-DD HH:MM:SS',
      label: intl.get(`${intlPrefix}.startTriggeredTime`).d('触发时间>='),
    },
    {
      name: 'endTriggeredTime',
      type: 'dateTime',
      min: 'startTriggeredTime',
      format: 'YY-MM-DD HH:MM:SS',
      label: intl.get(`${intlPrefix}.endTriggeredTime`).d('触发时间<='),
    },
    {
      name: 'startResponsedTime',
      type: 'dateTime',
      max: 'endResponsedTime',
      format: 'YY-MM-DD HH:MM:SS',
      label: intl.get(`${intlPrefix}.startResponsedTime`).d('响应时间>='),
    },
    {
      name: 'endResponsedTime',
      type: 'dateTime',
      min: 'startResponsedTime',
      format: 'YY-MM-DD HH:MM:SS',
      label: intl.get(`${intlPrefix}.endResponsedTime`).d('响应时间<='),
    },
    {
      name: 'startClosedTime',
      type: 'dateTime',
      max: 'endClosedTime',
      format: 'YY-MM-DD HH:MM:SS',
      label: intl.get(`${intlPrefix}.startClosedTime`).d('关闭时间>='),
    },
    {
      name: 'endClosedTime',
      type: 'dateTime',
      min: 'startClosedTime',
      format: 'YY-MM-DD HH:MM:SS',
      label: intl.get(`${intlPrefix}.endClosedTime`).d('关闭时间<='),
    },
    {
      name: 'startResponseDuration',
      type: 'number',
      step: 1,
      min: 0,
      max: 'endResponseDuration',
      label: intl.get(`${intlPrefix}.startResponseDuration`).d('响应时长>='),
    },
    {
      name: 'endResponseDuration',
      type: 'number',
      step: 1,
      min: 'startResponseDuration',
      label: intl.get(`${intlPrefix}.endResponseDuration`).d('响应时长<='),
    },
    {
      name: 'startCloseDuration',
      type: 'number',
      step: 1,
      min: 0,
      max: 'endCloseDuration',
      label: intl.get(`${intlPrefix}.startCloseDuration`).d('关闭时长>='),
    },
    {
      name: 'endCloseDuration',
      step: 1,
      type: 'number',
      min: 'startCloseDuration',
      label: intl.get(`${intlPrefix}.endCloseDuration`).d('关闭时长<='),
    },
    {
      name: 'startTriggeredDuration',
      type: 'number',
      step: 1,
      min: 0,
      max: 'endTriggeredDuration',
      label: intl.get(`${intlPrefix}.startTriggeredDuration`).d('触发时长>='),
    },
    {
      name: 'endTriggeredDuration',
      type: 'number',
      min: 'startTriggeredDuration',
      label: intl.get(`${intlPrefix}.endTriggeredDuration`).d('触发时长<='),
    },
  ],
});

export const andonJournalDS = () => ({
  selection: false,
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.organization`).d('组织'),
    },
    {
      name: 'andonName',
      type: 'string',
      label: intl.get(`${intlPrefix}.andon`).d('安灯'),
    },
    {
      name: 'andonBinName',
      type: 'string',
      label: intl.get(`${intlPrefix}.andonBin`).d('灯箱'),
    },
    {
      name: 'prodLineName',
      type: 'string',
      label: intl.get(`${intlPrefix}.prodLine`).d('生产线'),
    },
    {
      name: 'workcellName',
      type: 'string',
      label: intl.get(`${intlPrefix}.workcell`).d('工位'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.location`).d('位置'),
    },
    {
      name: 'currentStatus',
      type: 'string',
      lookupCode: lmesAndonJournal.andonStatus,
      label: intl.get(`${intlPrefix}.currentStatus`).d('当前状态'),
    },
    {
      name: 'currentColor',
      type: 'string',
      label: intl.get(`${intlPrefix}.currentColor`).d('当前颜色'),
    },
    {
      name: 'andonClassName',
      type: 'string',
      label: intl.get(`${intlPrefix}.andonClass`).d('分类'),
    },
    {
      name: 'pressedTimes',
      type: 'string',
      label: intl.get(`${intlPrefix}.pressedTimes`).d('累计按压次数'),
    },
    {
      name: 'triggeredHour',
      type: 'string',
      label: intl.get(`${intlPrefix}.triggeredHour`).d('触发时长（h）'),
    },
    {
      name: 'triggeredTime',
      type: 'string',
      label: intl.get(`${intlPrefix}.triggeredTime`).d('触发时间'),
    },
    {
      name: 'triggeredByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.triggeredBy`).d('触发人员'),
    },
    {
      name: 'triggeredEventId',
      type: 'string',
      label: intl.get(`${intlPrefix}.triggeredEvent`).d('触发事件'),
    },
    {
      name: 'responseHour',
      type: 'string',
      label: intl.get(`${intlPrefix}.responseHour`).d('响应时长（h）'),
    },
    {
      name: 'responsedTime',
      type: 'string',
      label: intl.get(`${intlPrefix}.responsedTime`).d('响应时间'),
    },
    {
      name: 'responsedByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.responsedBy`).d('响应人员'),
    },
    {
      name: 'responsedEventId',
      type: 'string',
      label: intl.get(`${intlPrefix}.responsedEvent`).d('响应事件'),
    },
    {
      name: 'closeHour',
      type: 'string',
      label: intl.get(`${intlPrefix}.closeHour`).d('关闭时长（h）'),
    },
    {
      name: 'closedTime',
      type: 'string',
      label: intl.get(`${intlPrefix}.closedTime`).d('关闭时间'),
    },
    {
      name: 'closedByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.closedBy`).d('关闭人员'),
    },
    {
      name: 'closedEventId',
      type: 'string',
      label: intl.get(`${intlPrefix}.closedEventId`).d('关闭事件'),
    },
    {
      name: 'dataCollectType',
      type: 'string',
      lookupCode: lmesAndonJournal.dataCollectType,
      label: intl.get(`${intlPrefix}.dataCollectType`).d('数据采集类型'),
    },
    {
      name: 'equipmentName',
      type: 'string',
      label: intl.get(`${intlPrefix}.equipment`).d('所在设备'),
    },
    {
      name: 'andonRelTypeMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.andonRelType`).d('关联类型'),
    },
    {
      name: 'andonRelCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.andonRelObj`).d('关联对象'),
    },
    {
      name: 'responseRankCodeMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.responseRank`).d('级别'),
    },
    {
      name: 'andonRule',
      type: 'string',
      label: intl.get(`${intlPrefix}.andonRule`).d('安灯响应规则'),
    },
    {
      name: 'exceptionGroupName',
      type: 'string',
      label: intl.get(`${intlPrefix}.exceptionGroup`).d('异常组'),
    },
    {
      name: 'exceptionName',
      type: 'string',
      label: intl.get(`${intlPrefix}.exception`).d('异常'),
    },
    {
      name: 'quantity',
      type: 'string',
      label: intl.get(`${intlPrefix}.quantity`).d('物料数量'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'stopProductionFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.stopProductionFlag`).d('是否停产'),
    },
    {
      name: 'sourceDocTypeCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocType`).d('来源单据类型'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单据'),
    },
    {
      name: 'targetDocTypeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.targetDocType`).d('生成单据类型'),
    },
    {
      name: 'targetDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.targetDocNum`).d('生成单据'),
    },
    {
      name: 'picture',
      type: 'string',
      label: intl.get(`${intlPrefix}.picture`).d('图片'),
    },
    {
      name: 'processRule',
      type: 'string',
      label: intl.get(`${intlPrefix}.processRule`).d('安灯处理规则'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'andonJournalId',
      type: 'string',
      label: intl.get(`${intlPrefix}.andonJournal`).d('履历ID'),
    },
  ],
  transport: {
    read: () => ({
      url: queryJournalUrl,
      method: 'get',
    }),
  },
});

export const andonJournalDetailDS = (id) => ({
  autoQuery: true,
  selection: false,
  fields: [
    {
      name: 'andonRankName',
      type: 'string',
      label: intl.get(`${intlPrefix}.andonRankName`).d('安灯等级'),
    },
    {
      name: 'relatedPositionName',
      type: 'string',
      label: intl.get(`${intlPrefix}.relatedPositionName`).d('关联职位'),
    },
    {
      name: 'realName',
      type: 'string',
      label: intl.get(`${intlPrefix}.realName`).d('关联用户'),
    },
    {
      name: 'phoneNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.phoneNumber`).d('电话'),
    },
    {
      name: 'email',
      type: 'email',
      label: intl.get(`${intlPrefix}.email`).d('邮箱'),
    },
    {
      name: 'sendMsgStatus',
      type: 'string',
      lookupCode: lmesAndonJournal.msgStatus,
      label: intl.get(`${intlPrefix}.string`).d('消息状态'),
    },
    {
      name: 'sendedTime',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.sentTime`).d('发送时间'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
  ],
  transport: {
    read: () => ({
      url: `${queryDetailUrl}?andonJournalId=${id}`,
      method: 'get',
    }),
  },
});
