/**
 * @Description: 租户隶属与供应商编码配置--树形结构
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-30 15:17:25
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { Table, Modal, Switch } from 'choerodon-ui';
import {
  DataSet,
  Button,
  Form,
  Lov,
  TextField,
  Table as TablePro,
  Modal as ModalPro,
  Switch as SwitchPro,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentUser, filterNullValueObject } from 'utils/utils';
import {
  tenantRelsSearch,
  tenantRelsSave,
  tenantRelsDelete,
  tenantRelRolesSave,
} from '@/services/tenantAffiliationSupplier';
import SearchFormDS from './store/SearchFormDS';
import CreateFormDS from './store/CreateFormDS';
import { roleAssignListDS } from './store/RoleAssignDS';
import styles from './indexTree.less';

let roleModal;
const roleKey = ModalPro.key();
const { Sidebar, confirm } = Modal;
const preCode = 'zmda.tenantAffiliationSupplier.model';

export default class ZmdaTenantAffiliationSupplierTree extends Component {
  constructor(props) {
    super(props);
    this.searchFormDS = new DataSet({
      ...SearchFormDS(),
    });
    this.formDS = new DataSet({
      ...CreateFormDS(),
    });
    this.listDS = new DataSet({
      ...roleAssignListDS(),
    });
  }

  state = {
    tableData: [],
    queryParams: {},
    loading: false,
    visible: false,
    hidden: true,
    expandedRowKeys: [],
    allRowKeys: [],
    isPlatformAdmin: false,
    tenantObj: null, // 当前租户对象
    saveLoading: false,
    deleteLoading: false,
  };

  async componentDidMount() {
    if (!this.searchFormDS.current) {
      await this.searchFormDS.create({}, 0);
    }
    await this.formDS.create({});
    const { currentRoleName, tenantId, tenantNum, tenantName } = getCurrentUser();
    this.setState({
      isPlatformAdmin: tenantId === 0 && currentRoleName === '租户管理员',
      tenantObj: {
        tenantId,
        tenantNum,
        tenantName,
      },
    });
    this.getTableData();
  }

  async getTableData() {
    this.setState({ loading: true });
    const res = await tenantRelsSearch(this.state.queryParams);
    this.setState({ loading: false });
    if (!res.failed) {
      const arr = this.getAllRowKeys(res, []);
      this.setState({
        tableData: res,
        allRowKeys: arr,
        expandedRowKeys: [],
      });
    }
  }

  // 获取data下所有的rowKey（不涉及到下层children）
  getRowKeys(data) {
    const arr = [];
    data.forEach((v) => {
      arr.push(v.tenantRelId);
    });
    return arr;
  }

  // 获取data中所有的rowKey
  getAllRowKeys(data, list) {
    const arr = list;
    data.forEach((v) => {
      arr.push(v.tenantRelId);
      if (v.children) {
        this.getAllRowKeys(v.children, arr);
      }
    });
    return arr;
  }

  @Bind()
  handleEdit(record) {
    this.setState({ visible: true });
    this.formDS.current.set('tenantRelId', record.tenantRelId);
    this.formDS.current.set('_token', record._token);
    this.formDS.current.set('objectVersionNumber', record.objectVersionNumber);
    this.formDS.current.set('parentTenantObj', {
      tenantId: record.parentTenantId,
      tenantNum: record.parentTenantNum,
      tenantName: record.parentTenantName,
    });
    this.formDS.current.set('tenantObj', {
      tenantId: record.targetTenantId,
      tenantNum: record.targetTenantNum,
      tenantName: record.targetTenantName,
    });
    this.formDS.current.set('supplierObj', {
      supplierId: record.supplierId,
      supplierName: record.supplierName,
      supplierNumber: record.supplierNumber,
      description: record.description,
    });
    this.formDS.current.set('customerObj', {
      customerId: record.customerId,
      customerName: record.customerName,
      customerNumber: record.customerNumber,
      description: record.customerDescription,
    });
    this.formDS.current.set('roleControlFlag', !!record.roleControlFlag);
  }

  @Bind()
  handleCreate() {
    this.formDS.current.reset();
    if (!this.state.isPlatformAdmin) {
      this.formDS.current.set('parentTenantObj', this.state.tenantObj);
    }
    this.setState({ visible: true });
  }

  @Bind()
  async handleOk() {
    const validateValue = await this.formDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }
    try {
      const baseObj = filterNullValueObject({
        parentTenantId: this.formDS.current.get('parentTenantId'),
        parentTenantName: this.formDS.current.get('parentTenantName'),
        parentTenantNum: this.formDS.current.get('parentTenantNum'),
        targetTenantId: this.formDS.current.get('targetTenantId'),
        targetTenantNum: this.formDS.current.get('targetTenantNum'),
        targetTenantName: this.formDS.current.get('targetTenantName'),
        supplierId: this.formDS.current.get('supplierId'),
        supplierName: this.formDS.current.get('supplierName'),
        supplierNumber: this.formDS.current.get('supplierNumber'),
        description: this.formDS.current.get('description'),
        customerId: this.formDS.current.get('customerId'),
        customerNumber: this.formDS.current.get('customerNumber'),
        customerName: this.formDS.current.get('customerName'),
        customerDescription: this.formDS.current.get('customerDescription'),
        roleControlFlag: this.formDS.current.get('roleControlFlag') ? 1 : 0,
      });
      const tenantRelId = this.formDS.current.get('tenantRelId');
      const obj = tenantRelId
        ? Object.assign({}, baseObj, {
            tenantRelId,
            _token: this.formDS.current.get('_token'),
            objectVersionNumber: this.formDS.current.get('objectVersionNumber'),
          })
        : baseObj;
      const res = await tenantRelsSave([obj]);
      if (res.failed) {
        throw res;
      } else {
        notification.success({
          message: '操作成功',
        });
        this.setState({
          visible: false,
        });
        this.getTableData();
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
  }

  @Bind()
  handleCancel() {
    this.setState({ visible: false });
  }

  @Bind
  async handleDelete(record) {
    const that = this;
    confirm({
      title: '确定删除吗?',
      content: '',
      onOk() {
        const { tenantRelId, _token } = record;
        const arr = [];
        arr.push({
          tenantRelId,
          _token,
        });
        tenantRelsDelete(arr).then((res) => {
          if (res.failed) {
            notification.error({
              message: res.message,
            });
            return;
          }
          notification.success({
            message: '删除成功',
          });
          that.getTableData();
        });
      },
    });
  }

  // @Bind()
  // handleToggle() {
  //   const { hidden } = this.state;
  //   this.setState({
  //     hidden: !hidden,
  //   });
  // }

  @Bind()
  handleReset() {
    this.searchFormDS.current.clear();
    this.setState({ queryParams: {} });
  }

  @Bind()
  async handleSearch() {
    const validateValue = await this.searchFormDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    const obj = this.searchFormDS.current.toJSONData();
    let queryParameter = {};
    Object.keys(obj).forEach((key) => {
      if (key.indexOf('_') !== -1) {
        return;
      }
      queryParameter = {
        ...queryParameter,
        [key]: obj[key],
      };
    });
    this.setState(
      {
        queryParams: filterNullValueObject(queryParameter),
      },
      () => {
        this.getTableData();
      }
    );
  }

  @Bind()
  expandAll() {
    const arr = this.state.allRowKeys.concat([]);
    this.setState({ expandedRowKeys: arr });
  }

  @Bind()
  collapseAll() {
    this.setState({ expandedRowKeys: [] });
  }

  @Bind()
  async onExpand(expanded, record) {
    const arr = this.getRowKeys([record]);
    if (expanded) {
      const list = this.state.expandedRowKeys.concat(arr);
      this.setState({ expandedRowKeys: list });
    } else {
      this.setState({ expandedRowKeys: this.state.expandedRowKeys });
    }
  }

  // 表格行数据校验
  lineValidate = () => {
    const arr = [];
    this.listDS.data.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  };

  // 角色分配-创建
  handleRoleCreate = (record) => {
    const { parentTenantId, parentTenantName, tenantRelId } = record;
    this.listDS.create({ parentTenantId, tenantRelId, parentTenantName }, 0);
  };

  // 角色分配-删除
  handleRoleDelete = async () => {
    const list = this.listDS.selected;
    if (!list.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    this.setState({ deleteLoading: true });
    this.listDS.delete(list);
    this.setState({ deleteLoading: false });
  };

  // 角色分配-保存
  handleRoleSave = async () => {
    const validateResult = await Promise.all(this.lineValidate());
    if (validateResult.findIndex((v) => !v) !== -1) {
      notification.warning({
        message: '数据校验不通过',
      });
      return;
    }
    this.setState({ saveLoading: true });
    const arr = this.listDS.data.map((v) => v.toData());
    try {
      const res = await tenantRelRolesSave(arr);
      if (res.failed) {
        throw res;
      } else {
        notification.success({
          message: '操作成功',
        });
        this.setState({ saveLoading: false });
        roleModal.close();
      }
    } catch (err) {
      this.setState({ saveLoading: false });
      notification.error({
        message: err.message,
      });
    }
  };

  // 角色分配表格列
  get roleColumns() {
    return [
      { name: 'parentRoleObj', align: 'center', width: 300, editor: true },
      { name: 'parentRoleName', align: 'center', width: 200 },
      { name: 'parentTenantName', align: 'center' },
    ];
  }

  // 打开角色分配modal
  handOpenModal = (record) => {
    this.listDS.reset();
    this.listDS.data = [];
    this.listDS.setQueryParameter('tenantRelId', record.tenantRelId);
    this.listDS.query();
    roleModal = ModalPro.open({
      key: roleKey,
      title: '角色分配',
      children: (
        <div>
          <div className={styles['modal-buttons']}>
            <Button
              color="primary"
              className={styles['modal-buttons-add']}
              onClick={() => this.handleRoleCreate(record)}
            >
              新建
            </Button>
            <Button onClick={this.handleRoleSave} loading={this.state.saveLoading}>
              保存
            </Button>
            <Button onClick={this.handleRoleDelete} loading={this.state.deleteLoading}>
              删除
            </Button>
          </div>
          <TablePro
            dataSet={this.listDS}
            columns={this.roleColumns}
            columnResizable="true"
            className={styles['modal-table']}
          />
        </div>
      ),
      className: styles['zmda-role-assign-modal'],
      footer: (_, cancelBtn) => <div>{cancelBtn}</div>,
    });
  };

  async handleChange(value, record) {
    const obj = {
      ...record,
      roleControlFlag: value ? 1 : 0,
    };
    try {
      const res = await tenantRelsSave([obj]);
      if (res.failed) {
        throw res;
      } else {
        notification.success({
          message: '操作成功',
        });
        this.getTableData();
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
  }

  renderColumns(text, record) {
    return record.parentTenantId ? (
      <Switch checked={text} onChange={(value) => this.handleChange(value, record)} />
    ) : null;
  }

  get columns() {
    return [
      {
        title: intl.get(`${preCode}.tenantNum`).d('租户编码'),
        dataIndex: 'targetTenantNum',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${preCode}.tenantName`).d('租户名称'),
        dataIndex: 'targetTenantName',
        align: 'center',
      },
      {
        title: intl.get(`${preCode}.roleControlFlag`).d('核企侧角色权限控制'),
        dataIndex: 'roleControlFlag',
        render: (text, record) => this.renderColumns(text, record),
        width: 150,
        align: 'center',
      },
      // {
      //   title: intl.get(`${preCode}.parentTenantNum`).d('核企租户编码'),
      //   dataIndex: 'parentTenantNum',
      //   width: 150,
      // },
      // {
      //   title: intl.get(`${preCode}.parentTenantName`).d('核企租户名称'),
      //   dataIndex: 'parentTenantName',
      //   width: 200,
      // },
      {
        title: intl.get(`${preCode}.supplierNumber`).d('核企侧供应商编码'),
        dataIndex: 'supplierNumber',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${preCode}.supplierName`).d('核企侧供应商名称'),
        dataIndex: 'supplierName',
        align: 'center',
      },
      {
        title: intl.get(`${preCode}.customerNumber`).d('供应商侧客户编码'),
        dataIndex: 'customerNumber',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${preCode}.customerName`).d('供应商侧客户名称'),
        dataIndex: 'customerName',
        align: 'center',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'action',
        width: 230,
        fixed: 'right',
        align: 'center',
        render: (text, record) => (
          <>
            <Button
              onClick={() => this.handleEdit(record)}
              // disabled={!record.parentTenantId}
              style={{ color: '#29BECE', outline: 'none', border: 'none' }}
            >
              编辑
            </Button>
            {record.parentTenantId ? (
              <Button
                onClick={() => this.handOpenModal(record)}
                style={{ color: '#29BECE', outline: 'none', border: 'none' }}
                disabled={!record.roleControlFlag}
              >
                角色分配
              </Button>
            ) : null}
            <Button
              onClick={() => this.handleDelete(record)}
              // disabled={!record.parentTenantId}
              style={{ color: '#29BECE', outline: 'none', border: 'none' }}
            >
              删除
            </Button>
          </>
        ),
      },
    ];
  }

  get queryFields() {
    return [<TextField name="targetTenantNum" />, <TextField name="targetTenantName" />];
  }

  render() {
    const { hidden } = this.state;
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.tenantAffiliationSupplier`).d('租户隶属关系配置')}
        >
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button icon="expand_less" onClick={this.collapseAll}>
            {intl.get('hzero.common.button.collapseAll').d('全部收起')}
          </Button>
          <Button icon="expand_more" onClick={this.expandAll}>
            {intl.get('hzero.common.button.expandAll').d('全部展开')}
          </Button>
        </Header>
        <Content className={styles['zmda-tenant-affiliation-content']}>
          <div style={{ display: 'flex', marginBottom: 10, alignItems: 'flex-start' }}>
            <Form dataSet={this.searchFormDS} columns={3} style={{ flex: '1 1 auto' }}>
              {hidden ? this.queryFields.slice(0, 3) : this.queryFields}
            </Form>
            <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              {/* <Button onClick={this.handleToggle}>
                {hidden
                  ? intl.get('hzero.common.button.viewMore').d('更多查询')
                  : intl.get('hzero.common.button.collected').d('收起查询')}
              </Button> */}
              <Button onClick={this.handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={this.handleSearch}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <Table
            bordered
            noFilters
            rowKey="tenantRelId"
            filterBar={false}
            pagination={false}
            scroll={{ x: 1500 }}
            columns={this.columns}
            loading={this.state.loading}
            dataSource={this.state.tableData}
            expandedRowKeys={this.state.expandedRowKeys}
            onExpand={this.onExpand}
          />
          <Sidebar
            title={`${
              this.formDS.current && this.formDS.current.get('tenantRelId') ? '修改' : '新增'
            }租户隶属关系配置`}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            cancelText="取消"
            okText="确定"
            width={600}
            closable
            zIndex="999"
            mask={false}
            className={styles['tenant-affiliation-sidebar']}
          >
            <Form dataSet={this.formDS}>
              <Lov name="parentTenantObj" disabled={!this.state.isPlatformAdmin} />
              <TextField name="parentTenantName" disabled />
              <Lov name="tenantObj" />
              <TextField name="targetTenantName" disabled />
              <Lov name="supplierObj" />
              <TextField name="supplierName" disabled />
              <TextField name="description" disabled />
              <Lov name="customerObj" />
              <TextField name="customerName" disabled />
              <TextField name="customerDescription" disabled />
              <SwitchPro name="roleControlFlag" />
            </Form>
          </Sidebar>
        </Content>
      </Fragment>
    );
  }
}
