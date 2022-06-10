/*
 * @Description: 盘点平台调整界面
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-26 15:05:50
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'dva';
import React, { Fragment, useMemo, useEffect, useState } from 'react';
import { DataSet, Table, Form, Lov, TextField, Button } from 'choerodon-ui/pro';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';

import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { userSetting } from 'hlos-front/lib/services/api';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import moment from 'moment';
import notification from 'utils/notification';
import { Content, Header } from 'components/Page';
import {
  inventoryDetailAndAdjustmentDS,
  inventoryAdjustmentFormDS,
} from '@src/stores/inventoryPlatformDS';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { adjustWmCountSer } from '@src/services/inventoryPlatformService';

import styles from '../style/index.module.less';

const intlPrefix = 'lwms.inventoryPlatform';
const commonPrefix = 'lwms.common';
const tenantId = getCurrentOrganizationId();

const getColumns: () => ColumnProps[] = () => [
  {
    name: 'formattedItem',
    width: 200,
    editor: false,
    lock: true,
  },
  {
    name: 'warehouseObj',
    width: 128,
    editor: false,
    lock: true,
  },
  {
    name: 'wmAreaObj',
    width: 128,
    editor: false,
    lock: true,
  },
  {
    name: 'wmUnitObj',
    width: 128,
    editor: false,
  },
  {
    name: 'uomName',
    width: 80,
    editor: false,
  },
  {
    name: 'tagCode',
    width: 128,
    editor: false,
  },
  {
    name: 'lotNumber',
    width: 128,
    editor: false,
  },
  {
    name: 'ownerType',
    width: 84,
    editor: false,
  },
  {
    name: 'owner',
    width: 200,
    editor: false,
  },
  {
    name: 'featureType',
    width: 84,
    editor: false,
  },
  {
    name: 'featureValue',
    width: 128,
    editor: false,
  },
  {
    name: 'projectNum',
    width: 128,
    editor: false,
  },
  {
    name: 'sourceNum',
    width: 128,
    editor: false,
  },
  {
    name: 'snapshotQty',
    width: 82,
    editor: false,
  },
  {
    name: 'countQty',
    width: 82,
    editor: false,
  },
  {
    name: 'auditQty',
    width: 82,
    editor: false,
  },
  {
    name: 'varianceQty',
    width: 82,
    editor: false,
  },
  {
    name: 'variancePercent',
    width: 82,
    editor: false,
  },
  {
    name: 'adjustQty',
    width: 100,
    editor: true,
  },
  {
    name: 'secondUomName',
    width: 80,
    editor: false,
  },
  {
    name: 'snapshotSecondQty',
    width: 82,
    editor: false,
  },
  {
    name: 'secondCountQty',
    width: 82,
    editor: false,
  },
  {
    name: 'secondAdjustQty',
    width: 82,
    editor: false,
  },
  {
    name: 'adjustAccountObj',
    width: 128,
    editor: true,
  },
  {
    name: 'countDate',
    width: 144,
    editor: false,
    align: ColumnAlign.center,
  },
  {
    name: 'countManName',
    width: 100,
    editor: false,
  },
  {
    name: 'countRemark',
    width: 200,
    editor: false,
  },
  {
    name: 'auditDate',
    width: 144,
    editor: false,
    align: ColumnAlign.center,
  },
  {
    name: 'auditManName',
    width: 100,
    editor: false,
  },
  {
    name: 'auditRemark',
    width: 200,
    editor: false,
  },
  {
    name: 'adjustByObj',
    width: 100,
    editor: true,
  },
  {
    name: 'adjustDate',
    width: 144,
    editor: false,
    align: ColumnAlign.center,
  },
  {
    name: 'adjustReason',
    width: 200,
    editor: true,
  },
  {
    name: 'adjustRemark',
    width: 200,
    editor: true,
  },
  {
    name: 'recordTypeMeaning',
    width: 128,
    editor: false,
  },
  {
    name: 'countFlag',
    width: 70,
    editor: false,
    renderer: yesOrNoRender,
  },
];

function InventoryPlatformAdjustment(props) {
  const [dsQueryParams, setDsQueryParams] = useState({});
  const [snapshotAmount, setSnapshotAmount] = useState(0);
  const [countAmount, setCountAmount] = useState(0);
  const [auditAmount, setAuditAmount] = useState(0);
  const [differenceAmount, setDifferenceAmount] = useState(0);
  const [adjustAmount, setAdjustAmount] = useState(0);

  const { history, dispatch, defaultOrg, currentOrg, defaultAdjustAccount, queryPara } = props;
  const {
    id,
    organizationName,
    countNum,
    countType,
    countStatus,
    countStatusMeaning,
    queryParams,
  } = queryPara || {};
  const ds = useMemo(
    () =>
      new DataSet(
        inventoryDetailAndAdjustmentDS({
          queryFields: false,
          selectable: true,
          defaultOrg,
        })
      ),
    [defaultOrg]
  );
  const formDs = useMemo(() => new DataSet(inventoryAdjustmentFormDS()), []);
  const getExportQueryParams = () => {
    return filterNullValueObject(dsQueryParams);
  };

  // 设置默认调整账户
  useEffect(() => {
    if (defaultAdjustAccount) {
      const { current } = formDs;
      if (current) {
        current.set('adjustAccount', defaultAdjustAccount);
      }
    }
  }, [formDs, defaultAdjustAccount]);

  // 查询默认组织
  useEffect(() => {
    if (dispatch && !defaultOrg) {
      dispatch({ type: 'inventoryPlatform/updateDefaultOrg' });
    }
  }, [dispatch, defaultOrg]);

  // 设置默认组织 ID 用于控制调整人
  useEffect(() => {
    const { current } = formDs;
    const org = currentOrg || defaultOrg;
    if (org) {
      const { organizationId } = org;
      if (current) {
        current.set('organizationId', organizationId);
      }
    }
  }, [defaultOrg, currentOrg, formDs]);

  useEffect(() => {
    const { current } = formDs;
    async function queryUserSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const { workerId, workerCode, workerName } = res.content[0];
        if (workerId) {
          if (current) {
            current.set('adjustByObj', {
              workerId,
              workerCode,
              workerName,
            });
          }
        }
      }
    }
    queryUserSetting();
  }, []);

  useEffect(() => {
    setDsQueryParams(queryParams);
    ds.queryParameter = queryParams || {};
    ds.query();
  }, [ds, queryParams]);

  useEffect(() => {
    const eventHanlder = ({ dataSet }) => {
      const [
        _snapshotAmount,
        _countAmount,
        _auditAmount,
        _differenceAmount,
        _adjustAmount,
      ] = dataSet.selected.reduce(
        (acc, v) => {
          return [
            acc[0] + v.get('snapshotQty') || 0,
            acc[1] + v.get('countAmount') || 0,
            acc[2] + v.get('auditQty') || 0,
            acc[3] + v.get('varianceQty') || 0,
            acc[4] + v.get('adjustQty') || 0,
          ];
        },
        [0, 0, 0, 0, 0]
      );
      setSnapshotAmount(_snapshotAmount);
      setCountAmount(_countAmount);
      setAuditAmount(_auditAmount);
      setDifferenceAmount(_differenceAmount);
      setAdjustAmount(_adjustAmount);
    };
    ds.addEventListener('select', eventHanlder);
    ds.addEventListener('unselect', eventHanlder);
    ds.addEventListener('selectAll', eventHanlder);
    ds.addEventListener('unSelectAll', eventHanlder);
    return () => {
      ds.removeEventListener('select', eventHanlder);
      ds.removeEventListener('unselect', eventHanlder);
      ds.removeEventListener('selectAll', eventHanlder);
      ds.removeEventListener('unSelectAll', eventHanlder);
    };
  }, [ds, snapshotAmount, countAmount, auditAmount, differenceAmount, adjustAmount]);

  const generateTitle = () => {
    const title = intl.get(`${intlPrefix}.view.title.inventoryAdjustment`).d('盘点调整');
    return (
      <Fragment>
        {title}
        <span className={styles.headInfo}>
          <span>
            {'  '}
            {organizationName}
          </span>
          <span>
            {'  '}
            {countNum}
          </span>
          <span>
            {'  '}
            {countType}
          </span>
          <span>
            {'  '}
            {countStatusMeaning}
          </span>
        </span>
      </Fragment>
    );
  };

  const handleAdjustment = async () => {
    const validRes = await formDs.validate(false, false);
    if (!validRes) {
      notification.warning({
        description: '',
        message: intl.get(`${intlPrefix}.view.message.required`).d('存在必输字段未填写'),
      });
      return;
    }
    // @ts-ignore
    const { adjustAccountObj, adjustByObj, adjustReason, adjustRemark = '' } = formDs.current.data;
    const data = ds.selected.map((i) => i.data);
    const dtoList = data.map((i) => {
      // @ts-ignore
      const { adjustAccountObj: dataAdjustAccountObj = {} } = i;
      return {
        // @ts-ignore
        countRecordId: i.countRecordId,
        // @ts-ignore
        adjustAccount: dataAdjustAccountObj?.costCenterCode
          ? dataAdjustAccountObj.costCenterCode
          : adjustAccountObj.costCenterCode,
        // @ts-ignore
        adjustAccountId: dataAdjustAccountObj?.costCenterId
          ? dataAdjustAccountObj.costCenterId
          : adjustAccountObj.costCenterId,
        // @ts-ignore
        adjustQty: i.adjustQty,
        // @ts-ignore
        adjustReason: i.adjustReason ? i.adjustReason : adjustReason,
        // @ts-ignore
        adjustRemark: i.adjustRemark ? i.adjustRemark : adjustRemark,
        // @ts-ignore
        secondAdjustQty: i.secondAdjustQty,
      };
    });
    if (!dtoList.length) {
      notification.warning({
        message: '请勾选需要调整的数据',
        description: '',
      });
      return;
    }
    const params = {
      adjustBy: adjustByObj.workerId,
      adjustMan: adjustByObj.workerCode,
      adjustDate: moment().format('YYYY-MM-DD'),
      countId: queryParams.countId,
      adjustWmCountVarianceDetailDtoList: dtoList,
    };
    const res = await adjustWmCountSer(params);
    if (!res.failed) {
      notification.success({
        message: res.message || `调整成功`,
        description: '',
      });
      history.push(`/lwms/inventory-platform/detail/${queryParams.countId}`, {
        id,
        organizationName,
        countNum,
        countType,
        countStatus,
      });
    } else {
      notification.warning({
        message: res.message || `调整失败`,
        description: '',
      });
    }
  };

  return (
    <Fragment>
      <Header
        title={generateTitle()}
        backPath={`/lwms/inventory-platform/detail/${queryParams ? queryParams.countId : null}`}
      >
        <ExcelExport
          requestUrl={`${HLOS_LWMS}/v1/${tenantId}/count-records/excel`}
          queryParams={getExportQueryParams}
        />
        <Button onClick={handleAdjustment}>
          {intl.get(`${intlPrefix}.button.adjustment`).d('调整')}
        </Button>
      </Header>
      <Content>
        <span className={styles.headInfo} style={{ marginLeft: '40px' }}>
          <span>
            {intl.get(`${intlPrefix}.snapshotAmount`).d('快照数量总计')}：{snapshotAmount}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span>
            {intl.get(`${intlPrefix}.countAmount`).d('盘点数量总计')}：{countAmount}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span>
            {intl.get(`${intlPrefix}.auditAmount`).d('复盘数量总计')}：{auditAmount}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span>
            {intl.get(`${intlPrefix}.differenceAmount`).d('差异值总计')}：{differenceAmount}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span>
            {intl.get(`${intlPrefix}.adjustAmount`).d('调整数量总计')}：{adjustAmount}
          </span>
        </span>
        <Form dataSet={formDs} columns={4}>
          <Lov name="adjustByObj" />
          <Lov name="adjustAccountObj" />
          <TextField name="adjustReason" />
          <TextField name="adjustRemark" />
        </Form>
        <Table columns={getColumns()} dataSet={ds} queryFieldsLimit={4} />
      </Content>
    </Fragment>
  );
}

function mapStateToProps(res) {
  const { inventoryPlatform } = res;
  return {
    currentOrg: inventoryPlatform?.currentOrg,
    defaultOrg: inventoryPlatform?.defaultOrg,
    defaultAdjustAccount: inventoryPlatform?.defaultAdjustAccount,
    queryPara: inventoryPlatform?.queryPara,
  };
}

export default connect(mapStateToProps)(
  formatterCollections({
    code: [`${intlPrefix}`, `${commonPrefix}`],
  })(InventoryPlatformAdjustment)
);
