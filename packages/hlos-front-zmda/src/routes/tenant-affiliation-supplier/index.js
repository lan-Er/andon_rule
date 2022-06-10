/**
 * @Description: 租户隶属关系与供应商编码配置
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-26 11:21:14
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { DataSet, Table, Button, Lov } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentUser } from 'utils/utils';
import TenantAffiliationSupplierDS from './store/TenantAffiliationSupplierDS';
import { tenantRelsDelete } from '@/services/tenantAffiliationSupplier.js';

const preCode = 'zmda.tenantAffiliationSupplier.model';

export default class ZmdaTenantAffiliationSupplier extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...TenantAffiliationSupplierDS(),
    });
  }

  state = {
    isPlatformAdmin: false, // 是否是平台管理员 平台管理员是指HZERO平台下的租户管理员
    // isParentTenantAdmin: false, // 是否是核企的租户管理员
    tenantObj: null, // 当前租户对象
  };

  componentDidMount() {
    const { currentRoleName, tenantId, tenantNum, tenantName } = getCurrentUser();
    this.setState({
      isPlatformAdmin: tenantId === 0 && currentRoleName === '租户管理员',
      // isParentTenantAdmin: tenantId !== 0 && currentRoleName === "租户管理员",
      tenantObj: {
        tenantId,
        tenantNum,
        tenantName,
      },
    });
  }

  @Bind()
  async handleCreate() {
    const obj = this.state.isPlatformAdmin ? {} : { parentTenantObj: this.state.tenantObj };
    this.tableDS.create(obj, 0);
  }

  @Bind()
  async handleDelete() {
    if (!this.tableDS.selected.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    const arr = [];
    this.tableDS.selected.forEach((v) => {
      arr.push({
        tenantRelId: v.data.tenantRelId,
        _token: v.data._token,
      });
    });
    try {
      const res = await tenantRelsDelete(arr);
      if (res && res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: '删除成功',
      });
      this.tableDS.query();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  get columns() {
    const { isPlatformAdmin } = this.state;
    return [
      { name: 'parentTenantObj', width: 150, editor: isPlatformAdmin ? <Lov noCache /> : null },
      { name: 'parentTenantName' },
      { name: 'tenantObj', width: 150, editor: <Lov noCache /> },
      { name: 'tenantName' },
      { name: 'supplierObj', width: 150, editor: <Lov noCache /> },
      { name: 'supplierName' },
      { name: 'description' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  render() {
    return (
      <Fragment>
        <Header
          title={intl
            .get(`${preCode}.view.title.tenantAffiliationSupplier`)
            .d('租户隶属与供应商编码配置')}
        >
          {/* <Button>
            {intl.get('hzero.common.button.codeUpdate').d('供应商编码更新')}
          </Button> */}
          <Button onClick={this.handleDelete}>
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
