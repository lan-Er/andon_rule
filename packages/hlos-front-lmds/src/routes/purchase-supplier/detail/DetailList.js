/*
 * @Author: zhang yang
 * @Description: 供应商 - Ix
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-28 14:47:39
 */

import React, { PureComponent, Fragment } from 'react';
import { Table, Tooltip, Button, TextField, Select } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

export default class DetailList extends PureComponent {
  /**
   * 新增
   */
  @Bind()
  async handleAddChildrenList() {
    this.props.detailDS.children.supplierSiteList.create({}, 0);
  }

  get columns() {
    return [
      {
        name: 'supplierSiteType',
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        width: 150,
      },
      {
        name: 'supplierSiteNumber',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        width: 150,
      },
      { name: 'supplierSiteName', editor: true, width: 150 },
      { name: 'supplierSiteAlias', editor: true, width: 150 },
      { name: 'description', editor: true, width: 150 },
      { name: 'supplierSiteStatus', editor: true, width: 150 },
      { name: 'countryRegion', editor: true, width: 150 },
      { name: 'provinceState', editor: true, width: 150 },
      { name: 'city', editor: true, width: 150 },
      { name: 'address', editor: true, width: 150 },
      { name: 'zipcode', editor: true, width: 150 },
      { name: 'contact', editor: true, width: 150 },
      { name: 'phoneNumber', editor: true, width: 150 },
      { name: 'email', editor: true, width: 150 },
      { name: 'startDate', editor: true, width: 150, align: 'center' },
      { name: 'endDate', editor: true, width: 150, align: 'center' },
      { name: 'externalId', editor: true, width: 150 },
      { name: 'externalNum', editor: true, width: 150 },
      {
        name: 'enabledFlag',
        editor: true,
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 70,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('取消')}>
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => this.removeData(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  @Bind()
  removeData(record) {
    const { supplierSiteList } = this.props.detailDS.children;
    if (record.toData().supplierSiteId) {
      supplierSiteList.current.reset();
    } else {
      supplierSiteList.remove(record);
    }
  }

  render() {
    const { detailDS } = this.props;
    const buttons = ['add'];
    const tableProps = {
      buttons,
      columns: this.columns,
      dataSet: detailDS.children.supplierSiteList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
