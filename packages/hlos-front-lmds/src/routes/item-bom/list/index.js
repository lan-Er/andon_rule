/**
 * @Description: Bom管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-22 10:40:46
 * @LastEditors: yu.na
 */

import React, { useEffect, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import statusConfig from '@/common/statusConfig';
import BomListDS from '../stores/BomListDS';

const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const {
  importTemplateCode: { bom },
} = statusConfig.statusValue.lmds;

// @formatterCollections({
//   code: ['lmds.bom', 'lmds.common'],
// })
function Bom(props) {
  const tableDS = useDataSet(() => new DataSet(BomListDS()), Bom);
  useEffect(() => {
    const myQuery = sessionStorage.getItem('itemBomquery') || false;
    if (myQuery) {
      tableDS.query().then(() => {
        sessionStorage.removeItem('itemBomquery');
      });
    }
    return () => {
      sessionStorage.removeItem('itemBomquery');
    };
  }, []);
  function columns() {
    return [
      { name: 'bomTypeMeaning', width: 100, lock: true },
      { name: 'bomCode', width: 144, lock: true },
      { name: 'description', width: 200 },
      { name: 'bomVersion', width: 84, align: 'center' },
      { name: 'organizationObj', width: 128 },
      { name: 'itemObj', width: 128 },
      { name: 'itemDescription', width: 200 },
      { name: 'alternate', width: 84 },
      { name: 'startDate', width: 100, align: 'center' },
      { name: 'endDate', width: 100, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Button
              key="edit"
              color="primary"
              funcType="flat"
              onClick={() => handleToDetailPage('/lmds/bom/detail', record)}
            >
              {intl.get('hzero.common.button.edit').d('编辑')}
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 跳转到新建页面
   * @param service
   * @param e
   */
  const handleCreate = (url, e) => {
    if (e) e.stopPropagation();
    props.dispatch(
      routerRedux.push({
        pathname: url,
      })
    );
  };

  /**
   * 跳转到详情
   * @param record
   * @param service
   * @param e
   */
  const handleToDetailPage = (url, record, e) => {
    if (e) e.stopPropagation();
    props.dispatch(
      routerRedux.push({
        pathname: `${url}/${record.get('bomId')}`,
      })
    );
  };

  const handleBatchImport = () => {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${bom}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`lmds.bom.view.title.bomImport`).d('BOM导入'),
      search: queryString.stringify({
        action: intl.get(`lmds.bom.view.title.bomImport`).d('BOM导入'),
      }),
    });
  };

  const getExportQueryParams = () => {
    const queryDataDs = tableDS && tableDS.queryDataSet && tableDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      // tenantId: organizationId,
      ...queryDataDsValue,
    };
  };

  return (
    <Fragment>
      <Header title="BOM">
        <Button icon="add" color="primary" onClick={() => handleCreate('/lmds/bom/create')}>
          {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
        </Button>
        <HButton icon="upload" onClick={handleBatchImport}>
          {intl.get('hzero.common.button.import').d('导入')}
        </HButton>
        <ExcelExport
          requestUrl={`${HLOS_LMDS}/v1/${organizationId}/boms/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <Table
          dataSet={tableDS}
          columns={columns()}
          columnResizable="true"
          queryFieldsLimit={4}
          editMode="inline"
        />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: ['lmds.bom', 'lmds.common'],
})((props) => {
  return <Bom {...props} />;
});
