/**
 * @Description: 仓库执行明细--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-05 14:48:53
 * @LastEditors: yiping.liu
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';

// import codeConfig from '@/common/codeConfig';

// const { lwmsTicketReport } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lwms.warehouseExecution.model';
// const commonCode = 'lwms.common.model';

const TicketReportDS = () => {
  return {
    selection: false,
    pageSize: 100,
    queryFields: [
      {
        name: 'carPlate',
        type: 'string',
        label: intl.get(`${preCode}.carPlate`).d('车牌号'),
      },
      {
        name: 'shipOrderNum',
        type: 'string',
        label: intl.get(`${preCode}.shipOrderNum`).d('发货单号'),
      },
      {
        name: 'shipDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.shipDate`).d('发货时间'),
        format: 'YYYY-MM-DD',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'documentNum',
        type: 'string',
        label: intl.get(`${preCode}.documentNum`).d('子订单号'),
      },
      {
        name: 'attributeString2',
        type: 'string',
        label: intl.get(`${preCode}.attributeString2`).d('送货单号'),
      },
    ],
    fields: [
      {
        name: 'attributeString2',
        type: 'string',
        label: intl.get(`${preCode}.attributeString2`).d('送货单号'),
      },
      {
        name: 'carPlate',
        type: 'string',
        label: intl.get(`${preCode}.carPlate`).d('车牌号'),
      },
      {
        name: 'shipOrderNum',
        type: 'string',
        label: intl.get(`${preCode}.shipOrderNum`).d('发货单号'),
      },
      {
        name: 'documentNum',
        type: 'string',
        label: intl.get(`${preCode}.documentNum`).d('子订单号'),
      },
      {
        name: 'shipDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.shipDate`).d('发货时间'),
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${preCode}.tagCode`).d('包件号'),
      },
      {
        name: 'outerTagCode',
        type: 'string',
        label: intl.get(`${preCode}.outerTagCode`).d('托盘号'),
      },
      {
        name: 'featureValue',
        type: 'string',
        label: intl.get(`${preCode}.featureValue`).d('长*宽*高'),
      },
      {
        name: 'volume',
        type: 'string',
        label: intl.get(`${preCode}.volume`).d('体积'),
        // dynamicProps: {
        //   defaultValue: ({ record }) => {
        //     return record.get('bomUsage')*record.get('bomUsage')*record.get('bomUsage');
        //   },
        // },
      },
      {
        name: 'grossWeight',
        type: 'string',
        label: intl.get(`${preCode}.grossWeight`).d('重量'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LWMSS}/v1/${organizationId}/raumplus/ship-order-lists`,
          method: 'GET',
        };
      },
    },
  };
};

export { TicketReportDS };
