/*
 * @Description: 采购需求发布与确认
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-24 10:57:01
 * @LastEditors: liangkun
 * @LastEditTime: 2020-07-24 11:35:41
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment, useState } from 'react';
import { isEmpty } from 'lodash';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { Table, Button, DataSet, Tooltip, Modal } from 'choerodon-ui/pro';
import { getCurrentUser, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { purchaseRequirementReleaseDS, componentDS } from '@/stores/purchaseRequirementDS';
import { orderStatusRender, surnamesRender, getSerialNum } from '@/utils/renderer';
import ComponentModal from './ComponentModal';

import styles from './index.less';

const { loginName } = getCurrentUser();

const dashboardConfig = 'LISP.PURCHASE_TEMPLATE';
const organizationId = getCurrentOrganizationId();

const PurchaseRequirementRelease = (props) => {
  const [releaseLoading, setReleaseLoading] = useState(false);
  const todoListDataSetFactory = () =>
    new DataSet({
      ...purchaseRequirementReleaseDS(),
    });
  const ListDS = useDataSet(todoListDataSetFactory, PurchaseRequirementRelease);
  const modalList = () =>
    new DataSet({
      ...componentDS(),
    });
  const ModalDS = useDataSet(modalList);

  const { dispatch } = props;

  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { header: 'No.', width: 70, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      { name: 'attribute1', lock: 'left', width: 150 },
      { name: 'attribute2', lock: 'left', width: 150, tooltip: 'overflow' },
      {
        name: 'attribute3',
        tooltip: 'overflow',
        width: 120,
        renderer: ({ value }) => <span className={styles['text-wrap']}>{value}</span>,
      },
      {
        name: 'attribute4',
        tooltip: 'overflow',
        renderer: ({ value }) => orderStatusRender(value),
      },
      { name: 'attribute5', tooltip: 'overflow', renderer: ({ value }) => surnamesRender(value) },
      {
        name: 'attribute6',
        tooltip: 'overflow',
        width: 130,
        renderer: ({ record, value }) => handleCellRender(value, record.get('attribute33')),
      },
      {
        name: 'attribute7',
        tooltip: 'overflow',
        width: 130,
        renderer: ({ value }) => <span className={styles['text-wrap']}>{value}</span>,
      },
      { name: 'attribute8', tooltip: 'overflow', width: 120 },
      { name: 'attribute9', tooltip: 'overflow' },
      { name: 'attribute10', tooltip: 'overflow' },
      { name: 'attribute11', tooltip: 'overflow' },
      { name: 'attribute12', tooltip: 'overflow' },
      { name: 'attribute13', tooltip: 'overflow' },
      { name: 'attribute14', width: 120, tooltip: 'overflow' },
      {
        name: 'attribute15',
        tooltip: 'overflow',
        width: 150,
        renderer: ({ record, value }) => handleCellRender(value, record.get('attribute16')),
      },
      { name: 'attribute17', tooltip: 'overflow' },
      { name: 'attribute18', tooltip: 'overflow' },
      { name: 'attribute19', tooltip: 'overflow', width: 120 },
      {
        name: 'attribute20',
        tooltip: 'overflow',
        renderer: ({ record, value }) => (
          <span className={styles['text-wrap']}>{`${record.get('attribute10')} ${value}`}</span>
        ),
      },
      {
        name: 'attribute21',
        tooltip: 'overflow',
        width: 120,
        renderer: ({ record, value }) => (
          <span className={styles['text-wrap']}>{`${record.get('attribute10')} ${value}`}</span>
        ),
      },
      {
        name: 'attribute22',
        tooltip: 'overflow',
        width: 120,
        renderer: ({ value }) => <span className={styles['text-wrap']}>{value}</span>,
      },
      { name: 'attribute23', tooltip: 'overflow', renderer: ({ value }) => handlePreview(value) },
    ];
  }

  /**
   * 图纸预览列表
   * @param {*} record 当前行记录
   */
  function handlePreview(fileList) {
    if (isEmpty(fileList)) return fileList;
    const links = fileList.split(';').map((item) => {
      return (
        <>
          <a href={item} target="_blank" rel="noopener noreferrer" style={{ margin: '3px 10px' }}>
            {item.split('@').pop()}
          </a>
          <br />
        </>
      );
    });
    return (
      <Tooltip title={links}>
        <span className={styles['text-wrap']}>
          <a>查看附件</a>
        </span>
      </Tooltip>
    );
  }

  /**
   * 换行内容渲染
   * @param {*} record 当前行记录
   */
  function handleCellRender(upValue, downValue) {
    return (
      <>
        <span className={styles['text-wrap']}>{upValue}</span>
        <br />
        <span className={`${styles['down-font']} ${styles['text-wrap']}`}>{downValue}</span>
      </>
    );
  }

  /**
   * 发布
   */
  function handleRelease() {
    setReleaseLoading(true);
    return new Promise((resolve) => {
      const { selected } = ListDS;
      if (isEmpty(selected)) {
        notification.warning({
          message: '请先选择具体采购订单',
        });
        resolve(setReleaseLoading(false));
        return false;
      }
      const releaseData = selected.map((item) => {
        const { attribute2, attribute14, objectVersionNumber, dataId } = item.toData();
        return {
          attribute2,
          attribute14,
          attribute4: '已发布',
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'PURCHASE_ORDER',
          user: loginName,
          objectVersionNumber,
          dataId,
        };
      });
      dispatch({
        type: 'purchaseRequirementModel/release',
        payload: releaseData,
      }).then((res) => {
        if (res && !res.failed) {
          notification.warning({
            message: '操作成功',
          });
          ListDS.query();
        }
        resolve(setReleaseLoading(false));
      });
    });
  }

  /**
   * 导出
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = ListDS && ListDS.queryDataSet && ListDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  // 导入
  function handleImport() {
    openTab({
      key: `/himp/commentImport/${dashboardConfig}`,
      title: '采购订单导入',
      search: queryString.stringify({
        action: '采购订单导入',
      }),
    });
  }

  async function handleShowComponent() {
    if (ListDS.selected.length !== 1) {
      notification.error({
        message: '请选择一条数据',
      });
      return;
    }
    ModalDS.queryParameter = {
      attribute2: ListDS.selected[0].data.attribute2,
    };
    await ModalDS.query();
    Modal.open({
      title: '外协组件明细',
      children: <ComponentModal ds={ModalDS} data={ListDS.selected[0].data} />,
      closable: true,
      footer: null,
      className: styles['lisp-purchase-requirement-releaser-component-modal'],
    });
  }

  return (
    <Fragment>
      <Header title="采购需求发布">
        <Button
          onClick={() => handleRelease()}
          color="primary"
          icon="publish2"
          loading={releaseLoading}
        >
          发布
        </Button>
        <ExcelExport
          requestUrl={`${HLOS_LMDS}/v1/${organizationId}/psi-elements/excel`}
          queryParams={getExportQueryParams}
        />
        <Button icon="file_upload" onClick={handleImport}>
          导入
        </Button>
        <Button onClick={handleShowComponent}>订单组件</Button>
      </Header>
      <Content className={styles['lisp-purchase-requirement-releaser']}>
        <Table
          dataSet={ListDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          editMode="inline"
          rowHeight="auto"
          style={{ height: 550 }}
        />
      </Content>
    </Fragment>
  );
};

export default PurchaseRequirementRelease;
