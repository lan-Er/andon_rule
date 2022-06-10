/**
 * @Description: 仓库现有量管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-17 12:22:15
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { DataSet, Table, Lov } from 'choerodon-ui/pro';
import { getResponse } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { ExportButton } from 'hlos-front/lib/components';

import { queryLovData } from 'hlos-front/lib/services/api';
import { onhandQtyListDS } from '../store/onhandQtyListDS';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const preCode = 'zexe.onhandQty';

@connect()
@formatterCollections({
  code: ['zexe.onhandQty', 'zexe.common'],
})
export default class OnhandQty extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...onhandQtyListDS,
    });
  }

  async componentDidMount() {
    const res = await Promise.all([
      // queryLovData({ lovCode: common.organization, defaultFlag: 'Y' }),
      queryLovData({ lovCode: common.warehouse, defaultFlag: 'Y' }),
    ]);
    const fail = res.find((item) => item.fail);
    if (getResponse(res) && !fail) {
      // if (res[0] && res[0].content[0]) {
      //   this.tableDS.queryDataSet.current.set('organizationObj', {
      //     organizationId: res[0].content[0].organizationId,
      //     organizationName: res[0].content[0].organizationName,
      //   });
      // }
      if (res[0] && res[0].content[0]) {
        this.tableDS.queryDataSet.current.set('warehouseObj', {
          warehouseId: res[0].content[0].warehouseId,
          warehouseName: res[0].content[0].warehouseName,
        });
      }
    }
  }

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      { name: 'organization', width: 150, lock: true },
      { name: 'warehouse', width: 150, lock: true },
      { name: 'wmArea', width: 150, lock: true },
      { name: 'itemObj', width: 150, lock: true },
      { name: 'featureCode', width: 150 },
      { name: 'itemDescription', width: 150 },
      { name: 'itemTypeMeaning', width: 150 },
      { name: 'quantity', width: 150 },
      { name: 'uomName', width: 150 },
      { name: 'lotNumber', width: 150 },
      { name: 'wmUnitCode', width: 150 },
      { name: 'itemCategoryName', width: 150 },
      { name: 'warehouseCategoryName', width: 150 },
      { name: 'ownerTypeMeaning', width: 150 },
      { name: 'owner', width: 150 },
      { name: 'secondUomName', width: 150 },
      { name: 'secondQuantity', width: 150 },
      { name: 'featureTypeMeaning', width: 150 },
      { name: 'featureValue', width: 150 },
      { name: 'sourceNum', width: 150 },
      { name: 'projectNum', width: 150 },
      { name: 'locationName', width: 150 },
    ];
  }

  get queryFields() {
    return {
      organizationObj: <Lov name="organizationObj" clearButton noCache />,
      itemObj: <Lov name="itemObj" clearButton noCache />,
      warehouseObj: <Lov name="warehouseObj" clearButton noCache />,
      wmAreaObj: <Lov name="wmAreaObj" clearButton noCache />,
      lotObj: <Lov name="lotObj" clearButton noCache />,
      ownerObj: <Lov name="ownerObj" clearButton noCache />,
    };
  }

  // 导入
  // @Bind()
  // handleBatchImport() {
  //   openTab({
  //     key: `/himp/commentImport/LMDS.ONHAND_INITIAL`,
  //     title: intl.get(`${preCode}.view.title.onhandImport`).d('现有量导入'),
  //     search: queryString.stringify({
  //       action: intl.get(`${preCode}.view.title.onhandImport`).d('现有量导入'),
  //     }),
  //   });
  // }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.onhandQty`).d('现有量查询')}>
          <ExportButton
            reportCode={['LWMS.ONHAND_QUANTITY']}
            exportTitle={
              intl.get(`${preCode}.view.title.onhandQty`).d('现有量查询') +
              intl.get('hzero.common.button.export').d('导出')
            }
          />
          {/* <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton> */}
        </Header>
        <Content>
          <Table
            autoHeight
            dataSet={this.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
            queryFields={this.queryFields}
            queryFieldsLimit={4}
          />
        </Content>
      </Fragment>
    );
  }
}
