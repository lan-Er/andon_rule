/*
 * @Descripttion: VMI申请单审核详情
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-02-22 09:46:34
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-11 17:04:49
 */

import React, { useEffect, Fragment, useState } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { Button as HButton } from 'hzero-ui';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import queryString from 'query-string';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  deleteRepairsOrders,
  submitRepairsOrders,
  repushToSAP,
} from '@/services/maintenanceMonitor';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import statusConfig from '@/common/statusConfig';
import { listDS } from '../store/MaintenanceMonitorDS';
import styles from './index.less';

const {
  importTemplateCode: { maintenanceMonitorImport },
} = statusConfig.statusValue.zcom;
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'zcom.vmiApplyReview';
const ListDS = new DataSet(listDS());

function ZcomMaintenanceMonitor() {
  const [receiveLoading, setReceiveLoading] = useState(false);

  useEffect(() => {
    ListDS.query();
  }, []);

  /**
   * 重推至极米SAP
   */
  async function handleRepushToSAP() {
    const list = [];
    setReceiveLoading(true);
    return new Promise(async (resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
        });
        resolve(setReceiveLoading(false));
        return;
      }
      ListDS.selected.forEach((item) => {
        list.push(item.toData());
      });

      repushToSAP(list).then((res) => {
        resolve(setReceiveLoading(false));
        if (res && res.failed) {
          notification.error({
            message: res.message,
          });
        } else {
          notification.success({
            message: '操作成功！',
          });
          ListDS.query();
        }
      });
    });
  }

  /**
   * 删除/提交
   */
  async function handleDelete(api) {
    let validateFlag = true;
    const arr = [];

    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }

    ListDS.selected.forEach(async (v) => {
      arr.push(v.data);

      if (v.data.repairsOrderStatus !== 'CREATED' && v.data.repairsOrderStatus !== 'REFUSED') {
        validateFlag = false;
      }
    });

    if (!validateFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.select`)
          .d('存在不是新建或审核拒绝状态的维修履历！'),
      });
      return;
    }

    try {
      const res = await api(arr);
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        ListDS.query();
      } else {
        notification.error({
          message: res.message,
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
    // ListDS.delete();
  }

  const columns = [
    {
      name: 'repairsOrderNum',
      align: 'center',
      width: 150,
      lock: 'left',
    },
    {
      name: 'moNum',
      width: 150,
      align: 'center',
    },
    {
      name: 'repairsOrderStatusMeaning',
      align: 'center',
      width: 150,
    },
    {
      name: 'moStatusMeaning',
      align: 'center',
      width: 150,
    },
    {
      name: 'itemCode',
      align: 'center',
      width: 150,
    },
    {
      name: 'itemDescription',
      align: 'center',
      width: 150,
    },
    {
      name: 'demandQty',
      width: 150,
      align: 'center',
    },
    {
      name: 'creationDate',
      align: 'center',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'moTypeName',
      align: 'center',
      width: 150,
    },
    {
      name: 'repairsOrderTypeMeaning',
      align: 'center',
      width: 150,
    },
    {
      name: 'totalAmount',
      align: 'center',
      width: 150,
    },
    {
      name: 'approvalOpinion',
      width: 150,
      align: 'center',
    },
    {
      name: 'repairsOrderLineNum',
      align: 'center',
      width: 150,
    },
    {
      name: 'repairsItemCode',
      align: 'center',
      width: 150,
    },
    {
      name: 'repairsItemDescription',
      align: 'center',
      width: 150,
    },
    {
      name: 'itemSpecification',
      align: 'center',
      width: 150,
    },
    {
      name: 'repairsQty',
      align: 'center',
      width: 150,
    },
    {
      name: 'repairsUomName',
      width: 150,
      align: 'center',
    },
    {
      name: 'repairsDate',
      align: 'center',
      width: 150,
    },
    {
      name: 'rmaDate',
      align: 'center',
      width: 150,
    },
    {
      name: 'customerFactory',
      align: 'center',
      width: 150,
    },
    {
      name: 'productType',
      align: 'center',
      width: 150,
    },
    {
      name: 'boardCardType',
      align: 'center',
      width: 150,
    },
    {
      name: 'barCode',
      align: 'center',
      width: 150,
    },
    {
      name: 'customerBadPhenomenon',
      width: 150,
      align: 'center',
    },
    {
      name: 'supplierBadPhenomenon',
      align: 'center',
      width: 150,
    },
    {
      name: 'badReason',
      align: 'center',
      width: 150,
    },
    {
      name: 'badPosition',
      align: 'center',
      width: 150,
    },
    {
      name: 'repairsMethod',
      align: 'center',
      width: 150,
    },
    {
      name: 'repairsByName',
      align: 'center',
      width: 150,
    },
    {
      name: 'dutyDecide',
      width: 150,
      align: 'center',
    },
    {
      name: 'position',
      align: 'center',
      width: 150,
    },
    {
      name: 'repairsTime',
      align: 'center',
      width: 150,
    },
    {
      name: 'bgaCode',
      align: 'center',
      width: 150,
    },
    {
      name: 'icCode',
      align: 'center',
      width: 150,
    },
    {
      name: 'amount',
      align: 'center',
      width: 150,
    },
    {
      name: 'remark',
      align: 'center',
      width: 150,
    },
  ];

  /**
   * 导入
   */
  function handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${maintenanceMonitorImport}`,
        title: intl.get(`${intlPrefix}.view.title.customerRefund`).d(`导入维修履历监控报表`),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  /**
   * 导出
   */
  const getCreateExportQueryParams = () => {
    const queryDataDs = ListDS && ListDS.queryDataSet && ListDS.queryDataSet.current;
    const { creationDateStart, creationDateEnd } = queryDataDs?.toData();
    const queryDataDsValue = queryDataDs
      ? filterNullValueObject({
          ...queryDataDs.toData(),
          creationDateStart: creationDateStart ? creationDateStart.concat(' 00:00:00') : null,
          creationDateEnd: creationDateEnd ? creationDateEnd.concat(' 59:59:59') : null,
        })
      : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  };

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.maintenanceMonitor`).d('维修履历监控报表')}>
        <ExcelExport
          requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/repairs-orders/export`}
          queryParams={getCreateExportQueryParams}
        />
        <HButton icon="upload" onClick={handleBatchExport}>
          {intl.get('zcom.common.button.import').d('导入')}
        </HButton>
        <Button onClick={() => handleDelete(submitRepairsOrders)}>提交</Button>
        <Button onClick={() => handleDelete(deleteRepairsOrders)}>删除</Button>
        <Button onClick={handleRepushToSAP} loading={receiveLoading}>
          重推至极米SAP
        </Button>
      </Header>
      <Content className={styles['zcom-vmi-apply-review']}>
        <Table autoHeight dataSet={ListDS} columns={columns} columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomMaintenanceMonitor {...props} />;
});
