// import React, {
//   // createContext,
//   Component,
// } from 'react';
import { DataSet } from 'choerodon-ui/pro';
// import withProps from 'utils/withProps';

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lwmsReservation } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lwms.reservation.model';
const commonCode = 'lwms.common.model';

// const Reservation = createContext();

const reservationListDS = () => {
  return {
    selection: false,
    pageSize: 10,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organization',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
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
        ignore: 'always',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${commonCode}.warehouse`).d('仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organization'),
          }),
        },
      },
      {
        name: 'warehouseId',
        type: 'string',
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'warehouseName',
        type: 'string',
        bind: 'warehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${commonCode}.lot`).d('批次'),
      },
      {
        name: 'wmAreaObj',
        type: 'object',
        label: intl.get(`${commonCode}.wmArea`).d('货位'),
        lovCode: common.wmArea,
        ignore: 'always',
        cascadeMap: { warehouseId: 'warehouseId' },
        dynamicProps: {
          lovPara: ({ record }) => ({
            warehouseId: record.get('warehouseId'),
            organizationId: record.get('organization'),
          }),
        },
      },
      {
        name: 'wmAreaId',
        type: 'string',
        bind: 'wmAreaObj.wmAreaId',
      },
      {
        name: 'wmAreaName',
        type: 'string',
        bind: 'wmAreaObj.wmAreaName',
        ignore: 'always',
      },
      {
        name: 'wmUnit',
        type: 'string',
        label: intl.get(`${commonCode}.wmUnit`).d('货格'),
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${preCode}.tagCode`).d('标签'),
      },
      {
        name: 'reservationType',
        type: 'string',
        label: intl.get(`${preCode}.reservationType`).d('保留类型'),
        lookupCode: lwmsReservation.reservationType,
      },
      {
        name: 'reservationStatus',
        type: 'string',
        label: intl.get(`${preCode}.reservationStatus`).d('保留状态'),
        lookupCode: lwmsReservation.reservationStatus,
      },
      {
        name: 'documentObj',
        type: 'object',
        label: intl.get(`${preCode}.documentNum`).d('单据'),
        lovCode: lwmsReservation.document,
        ignore: 'always',
      },
      {
        name: 'documentNum',
        type: 'string',
        bind: 'documentObj.documentNum',
      },
      {
        name: 'sourceDocObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据'),
        lovCode: lwmsReservation.document,
        ignore: 'always',
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'sourceDocObj.documentId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocObj.documentNum',
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
        defaultValue: true,
      },
    ],
    fields: [
      {
        name: 'organization',
        label: intl.get(`${commonCode}.org`).d('组织'),
      },
      {
        name: 'item',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'itemDescription',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'uomName',
        label: intl.get(`${commonCode}.uom`).d('单位'),
      },
      {
        name: 'reservationQty',
        label: intl.get(`${preCode}.reservationQty`).d('保留数量'),
      },
      {
        name: 'lotNumber',
        label: intl.get(`${commonCode}.lotNumber`).d('批次'),
      },
      {
        name: 'tagCode',
        label: intl.get(`${preCode}.tagCode`).d('标签'),
      },
      {
        name: 'warehouse',
        label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      },
      {
        name: 'wmArea',
        label: intl.get(`${commonCode}.wmArea`).d('货位'),
      },
      {
        name: 'wmUnit',
        label: intl.get(`${commonCode}.wmUnit`).d('货格'),
      },
      {
        name: 'documentType',
        label: intl.get(`${preCode}.documentType`).d('单据类型'),
      },
      {
        name: 'documentNum',
        label: intl.get(`${preCode}.documentNum`).d('单据'),
      },
      {
        name: 'documentLineNum',
        label: intl.get(`${preCode}.documentLineNum`).d('单据行号'),
      },
      {
        name: 'sourceDocType',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据'),
      },
      {
        name: 'sourceDocLineNum',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'ownerTypeMeaning',
        label: intl.get(`${commonCode}.ownerType`).d('所有者类型'),
      },
      {
        name: 'ownerName',
        label: intl.get(`${commonCode}.owner`).d('所有者'),
      },
      {
        name: 'featureTypeMeaning',
        label: intl.get(`${commonCode}.featureType`).d('特征值类型'),
      },
      {
        name: 'featureValue',
        label: intl.get(`${commonCode}.featureValue`).d('特征值'),
      },
      {
        name: 'projectNum',
        label: intl.get(`${commonCode}.projectNum`).d('项目号'),
      },
      {
        name: 'sourceNum',
        label: intl.get(`${commonCode}.sourceNum`).d('关联单据'),
      },
      {
        name: 'secondUomName',
        label: intl.get(`${commonCode}.secondUomName`).d('辅助单位'),
      },
      {
        name: 'secondReservationQty',
        label: intl.get(`${commonCode}.secondReservationQty`).d('辅单位数量'),
      },
      {
        name: 'qcOkQty',
        label: intl.get(`${commonCode}.qcOkQty`).d('合格数量'),
      },
      {
        name: 'qcNgQty',
        label: intl.get(`${commonCode}.qcNgQty`).d('不合格数量'),
      },
      {
        name: 'reservationStatusMeaning',
        label: intl.get(`${preCode}.reservationStatus`).d('保留状态'),
      },
      {
        name: 'reservationTypeMeaning',
        label: intl.get(`${preCode}.reservationType`).d('保留类型'),
      },
      {
        name: 'reservationRule',
        label: intl.get(`${preCode}.reservationRule`).d('保留规则'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      },
      {
        name: 'externalId',
        label: intl.get(`${preCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        label: intl.get(`${preCode}.externalNum`).d('外部单号'),
      },
      {
        name: 'creationDate',
        label: intl.get(`${preCode}.creationDate`).d('保留时间'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_LWMS}/v1/${organizationId}/reservations`,
          params: {
            page: data.page || 0,
            size: data.size || 100,
          },
          method: 'GET',
        };
      },
    },
  };
};

const reservationJournalDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      {
        name: 'eventId',
        label: intl.get(`${preCode}.eventId`).d('事件ID'),
      },
      {
        name: 'eventType',
        label: intl.get(`${preCode}.eventTypeName`).d('事件类型'),
      },
      {
        name: 'eventTime',
        label: intl.get(`${preCode}.eventTime`).d('发生时间'),
      },
      {
        name: 'directTypeMeaning',
        label: intl.get(`${preCode}.directType`).d('变化方向'),
      },
      {
        name: 'eventQty',
        label: intl.get(`${preCode}.eventQty`).d('发生数量'),
      },
      {
        name: 'reservationQty',
        label: intl.get(`${preCode}.reservationQty`).d('保留数量'),
      },
      {
        name: 'reservationStatusMeaning',
        label: intl.get(`${preCode}.reservationStatusMeaning`).d('保留状态'),
      },
      {
        name: 'documentType',
        label: intl.get(`${preCode}.documentTypeName`).d('单据类型'),
      },
      {
        name: 'documentNum',
        label: intl.get(`${preCode}.documentNum`).d('单据'),
      },
      {
        name: 'documentLineNum',
        label: intl.get(`${preCode}.documentLineNum`).d('单据行号'),
      },
      {
        name: 'sourceDocType',
        label: intl.get(`${preCode}.sourceDocTypeName`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据'),
      },
      {
        name: 'sourceDocLineNum',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'ownerTypeMeaning',
        label: intl.get(`${commonCode}.ownerType`).d('所有者类型'),
      },
      {
        name: 'ownerName',
        label: intl.get(`${commonCode}.ownerName`).d('所有者'),
      },
      {
        name: 'featureTypeMeaning',
        label: intl.get(`${commonCode}.featureType`).d('特征值类型'),
      },
      {
        name: 'featureValue',
        label: intl.get(`${commonCode}.featureValue`).d('特征值'),
      },
      {
        name: 'projectNum',
        label: intl.get(`${commonCode}.projectNum`).d('项目号'),
      },
      {
        name: 'sourceNum',
        label: intl.get(`${commonCode}.sourceNum`).d('关联单据'),
      },
      {
        name: 'secondUomName',
        label: intl.get(`${commonCode}.secondUomName`).d('辅助单位'),
      },
      {
        name: 'secondReservationQty',
        label: intl.get(`${commonCode}.secondReservationQty`).d('辅单位数量'),
      },
      {
        name: 'qcOkQty',
        label: intl.get(`${commonCode}.qcOkQty`).d('合格数量'),
      },
      {
        name: 'qcNgQty',
        label: intl.get(`${commonCode}.qcNgQty`).d('不合格数量'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      },
      {
        name: 'externalId',
        label: intl.get(`${preCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        label: intl.get(`${preCode}.externalNum`).d('外部单号'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LWMS}/v1/${organizationId}/reservation-journals`,
          method: 'GET',
        };
      },
    },
  };
};

const recordsFromDS = () => {
  return {
    selection: false,
    pageSize: 1,
    fields: [
      {
        name: 'organization',
        label: intl.get(`${commonCode}.org`).d('组织'),
      },
      {
        name: 'item',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'uomName',
        label: intl.get(`${commonCode}.uom`).d('单位'),
      },
      {
        name: 'lotNumber',
        label: intl.get(`${commonCode}.lotNumber`).d('批次'),
      },
      {
        name: 'tagCode',
        label: intl.get(`${preCode}.tagCode`).d('标签'),
      },
      {
        name: 'warehouse',
        label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      },
      {
        name: 'wmArea',
        label: intl.get(`${commonCode}.wmArea`).d('货位'),
      },
      {
        name: 'wmUnit',
        label: intl.get(`${commonCode}.wmUnit`).d('货格'),
      },
      {
        name: 'reservationTypeMeaning',
        label: intl.get(`${preCode}.reservationType`).d('保留类型'),
      },
      {
        name: 'reservationRule',
        label: intl.get(`${preCode}.reservationRule`).d('保留规则'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LWMS}/v1/${organizationId}/reservations/query`,
          method: 'GET',
        };
      },
    },
  };
};

// const wrapValue = (Cmp) => {
//   return class extends Component {
//     render() {
//       const { value, children, history, match, location, ...restProps } = this.props;
//       return (
//         <Cmp {...restProps} value={{ ...value, history, match, location }}>
//           {' '}
//           {children}{' '}
//         </Cmp>
//       );
//     }
//   };
// };

// const WrappedComponent = wrapValue(Reservation.Provider);

const dataSet = new DataSet(reservationListDS());
const journalDS = new DataSet(reservationJournalDS());
const fromDS = new DataSet(recordsFromDS());
// const value = {
//   dataSet,
//   journalDS,
//   fromDS,
// };

export { dataSet, journalDS, fromDS };

// const Cmp = withProps(() => ({ value }), { cacheState: true })(WrappedComponent);

// export const ReservationProvider = (props) => {
//   const { children, ...restProps } = props;
//   // return <Reservation.Provider value={value}>{children}</Reservation.Provider>;
//   return <Cmp {...restProps}>{children}</Cmp>;
// };

// export default Reservation;
