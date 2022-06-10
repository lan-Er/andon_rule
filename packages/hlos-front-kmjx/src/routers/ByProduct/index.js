/*
 * @Description: 副产品报功--ByProductReportPage
 * @Author: 檀建军 <sai.tan@zone-cloud.com>
 * @Date: 2021-04-18 11:20:42
 * @LastEditors: jianjun.tan
 * @Copyright: Copyright (c) 2021, Zone
 */

import React, { Fragment, useMemo, useEffect } from 'react';
import { DataSet, Table } from 'choerodon-ui/pro';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import { TagRender } from 'utils/renderer';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import formatterCollections from 'utils/intl/formatterCollections';
import { Button as ButtonPermission } from 'components/Permission';
import { isEmpty } from 'lodash';
import { Modal } from 'choerodon-ui';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { queryLovData } from 'hlos-front/lib/services/api';
import { byProductDS } from '@/stores/byProductDS';
import { approveOrRefuseByProduct } from '@/services/byProductReportService';
import styles from './index.less';

const organizationId = getCurrentOrganizationId();
const ByProductPage = () => {
  const listDS = useMemo(() => new DataSet(byProductDS()), []);

  useEffect(() => {
    defaultLovSetting();
  }, []);
  /**
   * 显示错误信息态框
   */
  function handleOpenModal(text) {
    Modal.info({
      content: text,
      onOk() {},
    });
  }

  async function handleApproved() {
    const ids = listDS.selected.map((i) => i.data.taskSubmitId);
    const result = await approveOrRefuseByProduct({ ids, auditStatus: 'APPROVED' });
    if (getResponse(result)) {
      notification.success(intl.get('hzero.common.notification.success').d('操作成功'));
      listDS.query();
    }
  }

  async function handleRejected() {
    const ids = listDS.selected.map((i) => i.data.taskSubmitId);
    const result = await approveOrRefuseByProduct({ ids, auditStatus: 'REFUSED' });
    if (getResponse(result)) {
      notification.success(intl.get('hzero.common.notification.success').d('操作成功'));
      listDS.query();
    }
  }

  /**
   *设置默认查询条件
   *
   */
  async function defaultLovSetting() {
    const res = await queryLovData({ lovCode: 'LMDS.ORGANIZATION', defaultFlag: 'Y' });
    if (getResponse(res)) {
      if (!isEmpty(res.content) && listDS.queryDataSet && listDS.queryDataSet.current) {
        listDS.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
        });
      }
    }
    listDS.query();
  }

  // 获取导出字段查询参数
  function getExportQueryParams() {
    const queryDataDs = listDS.queryDataSet?.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  function getColumns() {
    return [
      {
        name: 'organizationName',
        width: 150,
        lock: true,
      },
      {
        name: 'moNum',
        width: 150,
        lock: true,
      },
      {
        name: 'prodLineName',
        width: 150,
        lock: true,
      },
      {
        name: 'auditStatusMeaning',
        width: 100,
        lock: true,
        renderer: ({ value, record }) => statusRender(record.data.auditStatus, value),
      },
      {
        name: 'itemCode',
        width: 150,
      },
      {
        name: 'itemDescription',
        width: 150,
      },
      {
        name: 'executeQty',
        width: 100,
      },
      {
        name: 'uomName',
        width: 90,
      },
      {
        name: 'lotNumber',
        width: 150,
      },
      {
        name: 'warehouseCodeName',
        width: 150,
      },
      {
        name: 'wmAreaCodeName',
        width: 150,
      },
      {
        name: 'submitterName',
        width: 100,
      },
      {
        name: 'auditorName',
        width: 100,
      },
      {
        name: 'submitTime',
        width: 150,
      },
      {
        name: 'auditTime',
        width: 150,
      },
      {
        name: 'remarkMeaning',
        width: 150,
      },
      {
        name: 'submitStatus',
        width: 100,
        renderer: ({ value }) => {
          const statusLists = [
            {
              status: 'SUCCESS',
              color: 'green',
              text: intl.get('hzero.common.status.success').d('成功'),
            },
            {
              status: 'FAILURE',
              color: 'red',
              text: intl.get('hzero.common.status.failure').d('失败'),
            },
          ];
          return TagRender(value, statusLists);
        },
      },
      {
        name: 'submitResultError',
        width: 150,
        renderer: ({ value }) => <a onClick={() => handleOpenModal(value)}>{value}</a>,
      },
    ];
  }
  return (
    <Fragment>
      <Header>
        <ExcelExport
          requestUrl={`/lmes/v1/${organizationId}/kmjx-task-submits/excel`}
          queryParams={getExportQueryParams}
        />
        <ButtonPermission
          type="c7n-pro"
          onClick={handleRejected}
          color="red"
          permissionList={[
            {
              code: 'zone.kmjx.by.product.report.ps.button.reject',
              type: 'button',
              meaning: '拒绝',
            },
          ]}
        >
          {intl.get('hzero.common.status.reject').d('拒绝')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={handleApproved}
          color="green"
          permissionList={[
            {
              code: 'zone.kmjx.by.product.report.ps.button.agree',
              type: 'button',
              meaning: '同意',
            },
          ]}
        >
          {intl.get('hzero.common.status.agree').d('同意')}
        </ButtonPermission>
      </Header>
      <Content className={styles['kmjx-byproduct-content']}>
        <Table dataSet={listDS} columns={getColumns()} columnResizable="true" />
      </Content>
    </Fragment>
  );
};

export default formatterCollections({
  code: ['kmjx.byProductReport'],
})((props) => ByProductPage(props));
