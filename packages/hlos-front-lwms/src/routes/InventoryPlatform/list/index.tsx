/*
 * @Description: 盘点平台
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-26 15:05:50
 * @LastEditors: Please set LastEditors
 */

import React, { useState, useEffect, Fragment } from 'react';
import { Table, DataSet, Button } from 'choerodon-ui/pro';
import { connect } from 'dva';
import notification from 'utils/notification';
import { FuncType, ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';
import { ColumnAlign, ColumnLock } from 'choerodon-ui/pro/lib/table/enum';
import { isUndefined } from 'lodash';

import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender, statusRender } from 'hlos-front/lib/utils/renderer';
import { inventoryPlatformHeadDS, inventoryPlatformLineDS } from '@src/stores/inventoryPlatformDS';
import {
  closeWmCountSer,
  cancelWmCountSer,
  deleteWmCountSer,
  snapshotWmCountSer,
  completeWmCountSer,
} from '@src/services/inventoryPlatformService';
import style from '../style/index.module.less';

const intlPrefix = 'lwms.inventoryPlatform';
const commonPrefix = 'lwms.common';
const organizationId = getCurrentOrganizationId();
const headDS = new DataSet(inventoryPlatformHeadDS());
const lineDS = new DataSet(inventoryPlatformLineDS());

const getHeadColumns = (router, dispatch) => {
  const handleGoEdit = (record) => {
    const id = record.get('countId');
    router.push(`/lwms/inventory-platform/edit/${id}`, {
      _isCreate_: false,
      countStatus: record.get('countStatus'),
      id,
    });
  };
  const handleGoDetail = (record) => {
    const id = record.get('countId');
    router.push(`/lwms/inventory-platform/detail/${id}`);
    dispatch({
      type: 'inventoryPlatform/updateDefaultAdjustAccount',
      payload: {
        defaultAdjustAccount: record.get('defaultAdjustAccount'),
      },
    });
    dispatch({
      type: 'inventoryPlatform/updateCurrentOrg',
      payload: {
        currentOrg: record.get('organizationObj'),
      },
    });
    dispatch({
      type: 'inventoryPlatform/updateQueryPara',
      payload: {
        id,
        organizationId: record.get('organizationId'),
        organizationName: record.get('organizationName'),
        countNum: record.get('countNum'),
        countType: record.get('countTypeMeaning'),
        countStatusMeaning: record.get('countStatusMeaning'),
        countStatus: record.get('countStatus'),
        defaultAdjustAccount: record.get('defaultAdjustAccount'),
      },
    });
  };
  return [
    {
      name: 'organizationObj',
      width: 128,
      editor: false,
      lock: true,
      renderer: ({ record }: RenderProps) => {
        return `${record?.get('organizationCode')}-${record?.get('organizationName')}`;
      },
    },
    {
      name: 'countNum',
      width: 128,
      editor: false,
      lock: true,
      renderer: ({ value, record }: RenderProps) =>
        (
          <span
            style={{ cursor: 'pointer', color: 'blue' }}
            onClickCapture={(e) => {
              // prevent trigger query line data
              e.stopPropagation();
              // go to detail
              handleGoEdit(record);
            }}
          >
            {value || ''}
          </span>
        ) as any,
    },
    {
      name: 'countType',
      width: 128,
      editor: false,
      lock: true,
    },
    {
      name: 'countMethod',
      width: 90,
      editor: false,
    },
    {
      name: 'countStatus',
      width: 90,
      editor: false,
      renderer: ({ value, record }: RenderProps) => {
        return statusRender(value, record?.get('countStatusMeaning'));
      },
    },
    {
      name: 'planDate',
      width: 144,
      align: ColumnAlign.center,
      editor: false,
    },
    {
      name: 'countStartDate',
      width: 144,
      align: ColumnAlign.center,
      editor: false,
    },
    {
      name: 'countEndDate',
      width: 144,
      align: ColumnAlign.center,
      editor: false,
    },
    {
      name: 'lastAdjustmentDate',
      width: 144,
      align: ColumnAlign.center,
      editor: false,
    },
    {
      name: 'frozenDate',
      width: 144,
      align: ColumnAlign.center,
      editor: false,
    },
    {
      name: 'disabledDate',
      width: 144,
      align: ColumnAlign.center,
      editor: false,
    },
    {
      name: 'tolerancePositive',
      width: 82,
      editor: false,
    },
    {
      name: 'toleranceNegative',
      width: 82,
      editor: false,
    },
    {
      name: 'countRuleObj',
      width: 128,
      editor: false,
    },
    {
      name: 'defaultAdjustAccount',
      width: 128,
      editor: false,
    },
    {
      name: 'approvalRuleMeaning',
      width: 128,
      editor: false,
    },
    {
      name: 'approvalWorkflow',
      width: 128,
      editor: false,
    },
    {
      name: 'remark',
      width: 200,
      editor: false,
    },
    {
      header: intl.get(`${intlPrefix}.view.title.inventoryDetail`).d('盘点明细'),
      width: 90,
      command: ({ record }) => {
        return [
          <Button key="detail" funcType={FuncType.flat} onClick={() => handleGoDetail(record)}>
            明细
          </Button>,
        ];
      },
      lock: ColumnLock.right,
    },
  ];
};
const lineColumns = [
  {
    name: 'countLineNum',
    width: 70,
    align: ColumnAlign.center,
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
    name: 'itemType',
    width: 128,
    editor: false,
  },
  {
    name: 'categoryObj',
    width: 128,
    editor: false,
  },
  {
    name: 'formattedItem',
    width: 200,
    editor: false,
  },
  {
    name: 'lineRemark',
    width: 200,
    editor: false,
  },
  {
    name: 'enabledFlag',
    width: 80,
    editor: false,
    renderer: yesOrNoRender,
  },
];

const getExportQueryParams = () => {
  const formObj = headDS?.queryDataSet?.current;
  const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
  return {
    ...fieldsValue,
    countStatus: (fieldsValue as any).countStatus.join(),
  };
};

function InventoryPlatform(props) {
  const { history, dispatch, defaultOrg } = props;
  const [headId, setHeadId] = useState<string | number | null>(null);
  const [isPageReady, setPageReady] = useState<Boolean>(false);

  useEffect(() => {
    const _state = props.location.state;
    if (_state?.back === 1) {
      headDS.query();
    }
  }, []);

  // 设置默认组织
  useEffect(() => {
    const { current }: any = headDS?.queryDataSet || {};
    async function setDefaultOrg() {
      const res = await dispatch({ type: 'inventoryPlatform/updateDefaultOrg' });
      if (current && res) {
        current.set('organizationObj', res);
      }
    }
    if (dispatch && !defaultOrg) {
      setDefaultOrg();
    }
  }, [dispatch, defaultOrg]);

  /**
   * 设置默认组织
   * 这里是一种特殊情况，正常情况下并不会遇到
   * 用户首次进入的就是详情页面，此时详情界面会初始化 dva 对应的默认组织
   * 从详情页面返回列表页面后通过 dva 赋值给查询DS
   * 但是 queryDataset 的实例化需要一定时间，需要使用 ready 方法进行监听
   * 另外由于 DS 在组件外部实例化，不应该通过 useEffect 依赖数组来监控其变化，
   * 或者说监控不到变化。
   * */
  useEffect(() => {
    if (defaultOrg && !isPageReady && headDS.queryDataSet) {
      headDS.queryDataSet.ready().then(() => {
        const { current }: any = headDS?.queryDataSet || {};
        if (current && !current.get('organizationObj')) {
          current.set('organizationObj', defaultOrg);
          headDS.query();
        }
      });
      setPageReady(true);
    }
  }, [defaultOrg, isPageReady]);

  useEffect(() => {
    // 重置筛选条件时重置默认组织
    if (defaultOrg) {
      headDS.addEventListener('queryBarReset', () => {
        const { current }: any = headDS.queryDataSet || {};
        if (current) {
          current.set('organizationObj', defaultOrg);
        }
      });
    }
    return () => {
      headDS.removeEventListener('queryBarReset');
    };
  }, [defaultOrg]);

  useEffect(() => {
    // 查询头表 重置头ID
    headDS.addEventListener('query', () => setHeadId(null));
    return () => {
      headDS.removeEventListener('query');
    };
  }, []);

  // 跳转新建
  const handleCreate = () => {
    history.push('/lwms/inventory-platform/create', {
      _isCreate_: true,
    });
  };

  const manyBtnHandler = async (type, func) => {
    // @ts-ignore
    let countIds: Array<string> = headDS.selected.map((i) => i.data.countId);
    if (!countIds.length) {
      notification.warning({
        message: `请选择需要${type}的数据`,
        description: '',
      });
      return;
    }
    if (func === deleteWmCountSer) {
      // @ts-ignore
      countIds = { countIds };
    }
    const res = await func(countIds);
    if (!res.failed) {
      notification.success({
        message: res.message || `${type}成功`,
        description: '',
      });
      headDS.query();
    } else {
      notification.warning({
        message: res.message || `${type}失败`,
        description: '',
      });
    }
  };

  // 点击头设置头 ID 并查询行
  const handleClick = ({ record }) => {
    return {
      onClick: () => {
        const countId = record.get('countId');
        if (headId !== countId) {
          setHeadId(countId);
          lineDS.setQueryParameter('countId', countId);
          lineDS.query();
        }
      },
    };
  };

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.inventory.platform`).d('盘点平台')}>
        <ButtonPermission
          type="c7n-pro"
          icon="add"
          color={ButtonColor.primary}
          onClick={handleCreate}
          permissionList={[
            {
              code: 'hlos.lwms.inventory.platform.ps.button.create',
              type: 'button',
              meaning: '新建',
            },
          ]}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </ButtonPermission>
        <ExcelExport
          requestUrl={`${HLOS_LWMS}/v1/${organizationId}/counts/excel`}
          queryParams={getExportQueryParams}
        />
        <ButtonPermission
          type="c7n-pro"
          onClick={() => manyBtnHandler('取消', cancelWmCountSer)}
          permissionList={[
            {
              code: 'hlos.lwms.inventory.platform.ps.button.cancel',
              type: 'button',
              meaning: '取消',
            },
          ]}
        >
          {intl.get('hzero.common.button.cancel').d('取消')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={() => manyBtnHandler('关闭', closeWmCountSer)}
          permissionList={[
            {
              code: 'hlos.lwms.inventory.platform.ps.button.close',
              type: 'button',
              meaning: '关闭',
            },
          ]}
        >
          {intl.get('hzero.common.button.close').d('关闭')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={() => manyBtnHandler('删除', deleteWmCountSer)}
          permissionList={[
            {
              code: 'hlos.lwms.inventory.platform.ps.button.delete',
              type: 'button',
              meaning: '删除',
            },
          ]}
        >
          {intl.get('hzero.common.button.delete').d('删除')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={() => manyBtnHandler('快照', snapshotWmCountSer)}
          permissionList={[
            {
              code: 'hlos.lwms.inventory.platform.ps.button.snapshot',
              type: 'button',
              meaning: '快照',
            },
          ]}
        >
          {intl.get(`${intlPrefix}.button.snapshot`).d('快照')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={() => manyBtnHandler('盘点完成', completeWmCountSer)}
          permissionList={[
            {
              code: 'hlos.lwms.inventory.platform.ps.button.inventorycomplete',
              type: 'button',
              meaning: '盘点完成',
            },
          ]}
        >
          {intl.get(`${intlPrefix}.button.inventoryComplete`).d('盘点完成')}
        </ButtonPermission>
      </Header>
      <Content className={style['inventory-platform']}>
        <Table
          columns={getHeadColumns(history, dispatch)}
          dataSet={headDS}
          queryFieldsLimit={4}
          onRow={(data) => handleClick(data)}
        />
        {headId && <Table columns={lineColumns} dataSet={lineDS} />}
      </Content>
    </Fragment>
  );
}

function mapStateToProps({ inventoryPlatform }) {
  return { defaultOrg: inventoryPlatform?.defaultOrg };
}

export default connect(mapStateToProps)(
  formatterCollections({
    code: [`${intlPrefix}`, `${commonPrefix}`],
  })(InventoryPlatform)
);
