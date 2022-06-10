/**
 * @Description: VMI物料申请平台
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-02-20 15:15:22
 */

import React, { useEffect, useState, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject, getCurrentUser } from 'utils/utils';
import { applyListDS } from '../store/VmiMaterialsApplyDS';
import styles from './index.less';

const intlPrefix = 'zcom.vmiMaterialsApply';
const ListDS = new DataSet(applyListDS());
const organizationId = getCurrentOrganizationId();

function ZcomVmiMaterialsApply({ dispatch, history }) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(record) {
    // 需要根据状态进行跳转页面的判断
    const { vmiApplyId, vmiApplyStatus } = record.toData();
    if (['NEW', 'REFUSED'].includes(vmiApplyStatus)) {
      const pathName = `/zcom/vmi-materials-apply/apply/edit/${vmiApplyId}`;
      history.push(pathName);
    } else {
      const pathName = `/zcom/vmi-materials-apply/detail/${vmiApplyStatus}/${vmiApplyId}`;
      history.push(pathName);
    }
  }

  function handleCreate() {
    const pathName = `/zcom/vmi-materials-apply/apply/create`;
    history.push(pathName);
  }

  function handleDelete() {
    setDeleteLoading(true);
    return new Promise(async (resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(setDeleteLoading(false));
        return false;
      }
      const arr = ListDS.selected.map((v) => {
        const obj = Object.assign({}, v.data);
        return obj;
      });
      dispatch({
        type: 'vmiMaterialsApply/vmiApplysDelete',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '删除成功',
          });
          ListDS.query();
        }
        resolve(setDeleteLoading(false));
      });
    });
  }

  function handleSubmit() {
    setSubmitLoading(true);
    return new Promise(async (resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(setSubmitLoading(false));
        return false;
      }
      const { id, realName } = getCurrentUser();
      const arr = ListDS.selected.map((v) => {
        const obj = Object.assign({}, v.data, {
          submitBy: id,
          submitByName: realName,
        });
        return obj;
      });
      dispatch({
        type: 'vmiMaterialsApply/vmiApplysSubmit',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '提交成功',
          });
          ListDS.query();
        }
        resolve(setSubmitLoading(false));
      });
    });
  }

  // 获取导出字段查询参数
  const getExportQueryParams = () => {
    const queryDataDs = ListDS && ListDS.queryDataSet && ListDS.queryDataSet.current;
    let queryDataDsValue = {};
    if (queryDataDs) {
      const {
        creationDateStart,
        creationDateEnd,
        approvalDateStart,
        approvalDateEnd,
        submitDateStart,
        submitDateEnd,
      } = queryDataDs.toData();
      queryDataDsValue = filterNullValueObject({
        ...queryDataDs.toData(),
        creationDateStart: creationDateStart ? creationDateStart.concat(' 00:00:00') : null,
        creationDateEnd: creationDateEnd ? creationDateEnd.concat(' 23:59:59') : null,
        approvalDateStart: approvalDateStart ? approvalDateStart.concat(' 00:00:00') : null,
        approvalDateEnd: approvalDateEnd ? approvalDateEnd.concat(' 23:59:59') : null,
        submitDateStart: submitDateStart ? submitDateStart.concat(' 00:00:00') : null,
        submitDateEnd: submitDateEnd ? submitDateEnd.concat(' 23:59:59') : null,
      });
    }
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  };

  const columns = [
    {
      name: 'vmiApplyNum',
      width: 150,
      renderer: ({ record, value }) => {
        return <a onClick={() => handleToDetail(record)}>{value || ''}</a>;
      },
    },
    { name: 'vmiApplyStatus', width: 150 },
    { name: 'vmiMeOuName', width: 150 },
    { name: 'vmiWmOuName', width: 150 },
    { name: 'vmiWarehouseName', width: 150 },
    { name: 'createdByName', width: 150 },
    {
      name: 'creationDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'submitDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'approvalByName', width: 150 },
    {
      name: 'approvalDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'remark', width: 150 },
    { name: 'approvalOpinion', width: 150 },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.vmiMaterialsApply`).d('VMI物料申请平台')}>
        <ExcelExport
          requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/item-refunds/export`} // 地址待调整
          queryParams={getExportQueryParams}
        />
        <Button onClick={handleSubmit} loading={submitLoading}>
          提交
        </Button>
        <Button color="primary" onClick={handleCreate}>
          新建
        </Button>
        <Button onClick={handleDelete} loading={deleteLoading}>
          删除
        </Button>
      </Header>
      <Content className={styles['zcom-vmi-materials-apply-content']}>
        <Table dataSet={ListDS} columns={columns} columnResizable="true" queryFieldsLimit="4" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomVmiMaterialsApply {...props} />;
});
