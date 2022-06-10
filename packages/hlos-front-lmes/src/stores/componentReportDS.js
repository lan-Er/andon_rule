/**
 * @Description: 构件报工报表-DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-05-06 12:28:27
 * @LastEditors: yu.na
 */

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesComponentReport } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.componentReport.model';
const commonCode = 'lmes.common.model';

const ComponentReportListDS = () => {
  return {
    selection: false,
    pageSize: 100,
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
        name: 'organizationId',
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
        name: 'projectNum',
        type: 'string',
        label: intl.get(`${preCode}.projectNum`).d('工程代号'),
      },
      {
        name: 'wbsNum',
        type: 'string',
        label: intl.get(`${preCode}.wbsNum`).d('子项名称'),
      },
      {
        name: 'itemType',
        type: 'string',
        lookupCode: lmesComponentReport.componentType,
        label: intl.get(`${preCode}.itemType`).d('构件类型'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${preCode}.itemCode`).d('构件号'),
      },
    ],
    fields: [
      {
        name: 'projectNum',
        label: intl.get(`${preCode}.projectNum`).d('工程代号'),
      },
      {
        name: 'wbsNum',
        label: intl.get(`${preCode}.wbsNum`).d('子项名称'),
      },
      {
        name: 'itemCode',
        label: intl.get(`${preCode}.itemCode`).d('构件号'),
      },
      {
        name: 'itemType',
        label: intl.get(`${preCode}.itemType`).d('构件类型'),
      },
      {
        name: 'quantity',
        label: intl.get(`${preCode}.quantity`).d('数量'),
      },
      // U型拼装
      {
        name: 'complatedStatus-1',
        label: intl.get(`${preCode}.complatedStatus`).d('完工状态'),
        bind: 'uxpzOperation.complatedStatus',
      },
      {
        name: 'confirmStatus-1',
        label: intl.get(`${preCode}.comfirmResult`).d('核验状态'),
        bind: 'uxpzOperation.confirmStatus',
      },
      {
        name: 'qcStatus-1',
        label: intl.get(`${preCode}.qcStatus`).d('质检状态'),
        bind: 'uxpzOperation.qcStatus',
      },
      {
        name: 'workerGroup-1',
        label: intl.get(`${preCode}.workerGroup`).d('班组'),
        bind: 'uxpzOperation.workerGroup',
      },
      {
        name: 'workcellCode-1',
        label: intl.get(`${preCode}.workcellCode`).d('工位编号'),
        bind: 'uxpzOperation.workcellCode',
      },
      {
        name: 'worker-1',
        label: intl.get(`${preCode}.worker`).d('小组报工'),
        bind: 'uxpzOperation.worker',
      },
      {
        name: 'executeTime-1',
        label: intl.get(`${preCode}.executeTime`).d('报工时间'),
        bind: 'uxpzOperation.executeTime',
      },
      {
        name: 'confirmWorker-1',
        label: intl.get(`${preCode}.confirmWorker`).d('核验人'),
        bind: 'uxpzOperation.confirmWorker',
      },
      {
        name: 'qcWorker-1',
        label: intl.get(`${preCode}.qcWorker`).d('质检员'),
        bind: 'uxpzOperation.qcWorker',
      },
      // U型焊接
      {
        name: 'complatedStatus-2',
        label: intl.get(`${preCode}.complatedStatus`).d('完工状态'),
        bind: 'uxhjOperation.complatedStatus',
      },
      {
        name: 'confirmStatus-2',
        label: intl.get(`${preCode}.comfirmResult`).d('核验状态'),
        bind: 'uxhjOperation.confirmStatus',
      },
      {
        name: 'qcStatus-2',
        label: intl.get(`${preCode}.qcStatus`).d('质检状态'),
        bind: 'uxhjOperation.qcStatus',
      },
      {
        name: 'workerGroup-2',
        label: intl.get(`${preCode}.workerGroup`).d('班组'),
        bind: 'uxhjOperation.workerGroup',
      },
      {
        name: 'workcellCode-2',
        label: intl.get(`${preCode}.workcellCode`).d('工位编号'),
        bind: 'uxhjOperation.workcellCode',
      },
      {
        name: 'worker-2',
        label: intl.get(`${preCode}.worker`).d('小组报工'),
        bind: 'uxhjOperation.worker',
      },
      {
        name: 'executeTime-2',
        label: intl.get(`${preCode}.executeTime`).d('报工时间'),
        bind: 'uxhjOperation.executeTime',
      },
      {
        name: 'confirmWorker-2',
        label: intl.get(`${preCode}.confirmWorker`).d('核验人'),
        bind: 'uxhjOperation.confirmWorker',
      },
      {
        name: 'qcWorker-2',
        label: intl.get(`${preCode}.qcWorker`).d('质检员'),
        bind: 'uxhjOperation.qcWorker',
      },
      // 本体焊接
      {
        name: 'complatedStatus-3',
        label: intl.get(`${preCode}.complatedStatus`).d('完工状态'),
        bind: 'bthjOperation.complatedStatus',
      },
      {
        name: 'confirmStatus-3',
        label: intl.get(`${preCode}.comfirmResult`).d('核验状态'),
        bind: 'bthjOperation.confirmStatus',
      },
      {
        name: 'qcStatus-3',
        label: intl.get(`${preCode}.qcStatus`).d('质检状态'),
        bind: 'bthjOperation.qcStatus',
      },
      {
        name: 'workerGroup-3',
        label: intl.get(`${preCode}.workerGroup`).d('班组'),
        bind: 'bthjOperation.workerGroup',
      },
      {
        name: 'workcellCode-3',
        label: intl.get(`${preCode}.workcellCode`).d('工位编号'),
        bind: 'bthjOperation.workcellCode',
      },
      {
        name: 'worker-3',
        label: intl.get(`${preCode}.worker`).d('小组报工'),
        bind: 'bthjOperation.worker',
      },
      {
        name: 'executeTime-3',
        label: intl.get(`${preCode}.executeTime`).d('报工时间'),
        bind: 'bthjOperation.executeTime',
      },
      {
        name: 'confirmWorker-3',
        label: intl.get(`${preCode}.confirmWorker`).d('核验人'),
        bind: 'bthjOperation.confirmWorker',
      },
      {
        name: 'qcWorker-3',
        label: intl.get(`${preCode}.qcWorker`).d('质检员'),
        bind: 'bthjOperation.qcWorker',
      },
      // 牛腿安装
      {
        name: 'complatedStatus-4',
        label: intl.get(`${preCode}.complatedStatus`).d('完工状态'),
        bind: 'ntazOperation.complatedStatus',
      },
      {
        name: 'confirmStatus-4',
        label: intl.get(`${preCode}.comfirmResult`).d('核验状态'),
        bind: 'ntazOperation.confirmStatus',
      },
      {
        name: 'qcStatus-4',
        label: intl.get(`${preCode}.qcStatus`).d('质检状态'),
        bind: 'ntazOperation.qcStatus',
      },
      {
        name: 'workerGroup-4',
        label: intl.get(`${preCode}.workerGroup`).d('班组'),
        bind: 'ntazOperation.workerGroup',
      },
      {
        name: 'workcellCode-4',
        label: intl.get(`${preCode}.workcellCode`).d('工位编号'),
        bind: 'ntazOperation.workcellCode',
      },
      {
        name: 'worker-4',
        label: intl.get(`${preCode}.worker`).d('小组报工'),
        bind: 'ntazOperation.worker',
      },
      {
        name: 'executeTime-4',
        label: intl.get(`${preCode}.executeTime`).d('报工时间'),
        bind: 'ntazOperation.executeTime',
      },
      {
        name: 'confirmWorker-4',
        label: intl.get(`${preCode}.confirmWorker`).d('核验人'),
        bind: 'ntazOperation.confirmWorker',
      },
      {
        name: 'qcWorker-4',
        label: intl.get(`${preCode}.qcWorker`).d('质检员'),
        bind: 'ntazOperation.qcWorker',
      },
      // 牛腿焊接
      {
        name: 'complatedStatus-5',
        label: intl.get(`${preCode}.complatedStatus`).d('完工状态'),
        bind: 'nthjOperation.complatedStatus',
      },
      {
        name: 'confirmStatus-5',
        label: intl.get(`${preCode}.comfirmResult`).d('核验状态'),
        bind: 'nthjOperation.confirmStatus',
      },
      {
        name: 'qcStatus-5',
        label: intl.get(`${preCode}.qcStatus`).d('质检状态'),
        bind: 'nthjOperation.qcStatus',
      },
      {
        name: 'workerGroup-5',
        label: intl.get(`${preCode}.workerGroup`).d('班组'),
        bind: 'nthjOperation.workerGroup',
      },
      {
        name: 'workcellCode-5',
        label: intl.get(`${preCode}.workcellCode`).d('工位编号'),
        bind: 'nthjOperation.workcellCode',
      },
      {
        name: 'worker-5',
        label: intl.get(`${preCode}.worker`).d('小组报工'),
        bind: 'nthjOperation.worker',
      },
      {
        name: 'executeTime-5',
        label: intl.get(`${preCode}.executeTime`).d('报工时间'),
        bind: 'nthjOperation.executeTime',
      },
      {
        name: 'confirmWorker-5',
        label: intl.get(`${preCode}.worker`).d('核验人'),
        bind: 'nthjOperation.confirmWorker',
      },
      {
        name: 'qcWorker-5',
        label: intl.get(`${preCode}.worker`).d('质检员'),
        bind: 'nthjOperation.qcWorker',
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/execute-lines/query-report`,
          method: 'GET',
        };
      },
    },
  };
};

const Store = createContext();

export default Store;

export const ComponentReportProvider = (props) => {
  const { children } = props;
  const listDS = useMemo(() => new DataSet(ComponentReportListDS()), []);
  const value = {
    ...props,
    listDS,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
