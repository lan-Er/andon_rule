/**
 * @Description: 方案包权限分配
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-05-28 16:36:54
 * @LastEditors: yu.na
 */

import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Table, Button, Select, TextField } from 'choerodon-ui/pro';
import { Modal, Row, Col, Popconfirm } from 'choerodon-ui';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';

import Store from '@/stores/permissionAssignmentDS';
import { assignApi, clearApi, queryApi, deleteApi } from '@/services/api';

const preCode = 'lisp.permissionAssignment';
const { Sidebar } = Modal;
const { Option } = Select;

export default () => {
  const { listDS, userDS, funcDS } = useContext(Store);
  const [visible, setVisible] = useState(false);
  const [clearVisible, setClearVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [okLoading, setOkLoading] = useState(false);
  const [selectValue, changeSelectValue] = useState('loginName');
  const [inputValue, changeInputValue] = useState(null);
  const [funcList, setFuncList] = useState([]);
  const [selectedFunc, setSelectedFunc] = useState(null);

  useEffect(() => {
    async function queryModalData() {
      await userDS.query();
      await funcDS.query();
      queryApi().then((res) => {
        if (res && !res.failed) {
          setFuncList(res);
        }
      });
    }
    queryModalData();
  }, [userDS, funcDS]);

  /**
   *table列
   * @returns
   */
  function columns() {
    return [
      { name: 'functionType', width: 150, lock: true },
      { name: 'dataType', width: 150, lock: true },
      { name: 'attribute1', width: 150 },
      { name: 'attribute2', width: 150 },
      { name: 'attribute3', width: 150 },
      { name: 'attribute4', width: 150 },
      { name: 'attribute5', width: 150 },
      { name: 'attribute6', width: 150 },
      { name: 'attribute7', width: 150 },
      { name: 'attribute8', width: 150 },
      { name: 'attribute9', width: 150 },
      { name: 'attribute10', width: 150 },
      { name: 'attribute11', width: 150 },
      { name: 'attribute12', width: 150 },
      { name: 'attribute13', width: 150 },
      { name: 'attribute14', width: 150 },
      { name: 'attribute15', width: 150 },
      { name: 'attribute16', width: 150 },
      { name: 'attribute17', width: 150 },
      { name: 'attribute18', width: 150 },
      { name: 'attribute19', width: 150 },
      { name: 'attribute20', width: 150 },
      { name: 'attribute21', width: 150 },
      { name: 'attribute22', width: 150 },
      { name: 'attribute23', width: 150 },
      { name: 'attribute24', width: 150 },
      { name: 'attribute25', width: 150 },
      { name: 'attribute26', width: 150 },
      { name: 'attribute27', width: 150 },
      { name: 'attribute28', width: 150 },
      { name: 'attribute29', width: 150 },
      { name: 'attribute30', width: 150 },
      { name: 'attribute31', width: 150 },
      { name: 'attribute32', width: 150 },
      { name: 'attribute33', width: 150 },
      { name: 'attribute34', width: 150 },
      { name: 'attribute35', width: 150 },
      { name: 'attribute36', width: 150 },
      { name: 'attribute37', width: 150 },
      { name: 'attribute38', width: 150 },
      { name: 'attribute39', width: 150 },
      { name: 'attribute40', width: 150 },
      { name: 'attribute41', width: 150 },
      { name: 'attribute42', width: 150 },
      { name: 'attribute43', width: 150 },
      { name: 'attribute44', width: 150 },
      { name: 'attribute45', width: 150 },
      { name: 'attribute46', width: 150 },
      { name: 'attribute47', width: 150 },
      { name: 'attribute48', width: 150 },
      { name: 'attribute49', width: 150 },
      { name: 'attribute50', width: 150 },
    ];
  }

  function userColumns() {
    return [
      { name: 'loginName', width: 150 },
      { name: 'realName', width: 150 },
    ];
  }

  function funcColumns() {
    return [
      { name: 'meaning', width: 150 },
      { name: 'value', width: 150 },
    ];
  }

  function handleShowAssignModal() {
    setVisible(true);
  }

  function handleOk() {
    const functionTypes = funcDS.selected.map((func) => func.data.value);
    const users = userDS.selected.map((item) => item.data.loginName);
    assignApi({
      functionTypes,
      users,
    }).then((res) => {
      if (!res.failed) {
        funcDS.unSelectAll();
        userDS.unSelectAll();
        notification.success();
        setVisible(false);
        listDS.query();
      }
    });
  }

  function handleCancel() {
    setVisible(false);
  }

  function handleAssignClear() {
    setClearVisible(true);
  }

  function handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/LISP.DEMO_DATA`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${preCode}.view.title.solutionPackageImport`).d('方案包导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.solutionPackageImport`).d('方案包导入'),
      }),
    });
  }

  /**
   * 查询
   */
  async function handleSearch() {
    if (selectValue === 'realName') {
      userDS.queryParameter = { realName: inputValue };
    } else if (selectValue === 'loginName') {
      userDS.queryParameter = { loginName: inputValue };
    }
    await userDS.query();
  }

  function handleSelectChange(record) {
    changeSelectValue(record);
  }

  function handleInputChange(record) {
    changeInputValue(record);
  }

  function handleClearOk() {
    const users = userDS.selected.map((item) => item.data.loginName);
    clearApi({
      users,
    }).then((res) => {
      if (!res.failed) {
        userDS.unSelectAll();
        notification.success();
        setClearVisible(false);
        listDS.query();
      }
    });
  }

  function handleClearCancel() {
    setClearVisible(false);
  }

  function handleDelete() {
    setDeleteVisible(true);
  }

  function handleDeleteCancel() {
    setDeleteVisible(false);
  }

  function handleSelectFuncChange(value) {
    setSelectedFunc(value);
  }

  function handleDeleteFunc() {
    setOkLoading(true);
    deleteApi({ functionType: selectedFunc }).then((res) => {
      if (!res.failed) {
        setOkLoading(false);
        notification.success();
        setDeleteVisible(false);
        listDS.query();
      }
    });
  }

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.permissionAssignment`).d('方案包数据权限分配')}
      >
        <Button onClick={handleBatchImport}>
          {intl.get('hzero.common.button.import').d('导入')}
        </Button>
        <Button onClick={handleAssignClear}>
          {intl.get(`${preCode}.view.title.permissionClear`).d('权限清除')}
        </Button>
        <Button onClick={handleShowAssignModal}>
          {intl.get(`${preCode}.view.title.permissionAssign`).d('权限分配')}
        </Button>
        <Button onClick={handleDelete}>{intl.get(`hzero.common.button.delete`).d('删除')}</Button>
      </Header>
      <Content>
        <Table
          dataSet={listDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          editMode="inline"
        />
        <Sidebar
          title="方案包权限分配"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          cancelText="取消"
          okText="确定"
          width={1000}
          closable
          destroyOnClose
        >
          <Row>
            <Col span={3}>
              <Select placeholder="请选择" onChange={handleSelectChange} defaultValue="loginName">
                <Option value="loginName">账户</Option>
                <Option value="realName">名称</Option>
              </Select>
            </Col>
            <Col span={4} style={{ margin: '0 10px' }}>
              <TextField
                placeholder="请输入"
                onChange={handleInputChange}
                disabled={!selectValue}
              />
            </Col>
            <Col span={4}>
              <Button color="primary" onClick={() => handleSearch()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Col>
          </Row>
          <Row style={{ margin: '20px 0 10px' }}>
            <Col span={11}>账号列表</Col>
            <Col span={11} offset={2}>
              方案包列表
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Table
                dataSet={userDS}
                columns={userColumns()}
                columnResizable="true"
                editMode="inline"
              />
            </Col>
            <Col span={11} offset={2}>
              <Table
                dataSet={funcDS}
                columns={funcColumns()}
                columnResizable="true"
                editMode="inline"
                queryBar="none"
              />
            </Col>
          </Row>
        </Sidebar>
        <Sidebar
          title="方案包权限清除"
          visible={clearVisible}
          onOk={handleClearOk}
          onCancel={handleClearCancel}
          cancelText="取消"
          okText="确定"
          width={600}
          closable
          destroyOnClose
        >
          <Row>
            <Col span={5}>
              <Select placeholder="请选择" onChange={handleSelectChange} defaultValue="loginName">
                <Option value="loginName">账户</Option>
                <Option value="realName">名称</Option>
              </Select>
            </Col>
            <Col span={5} style={{ margin: '0 10px' }}>
              <TextField
                placeholder="请输入"
                onChange={handleInputChange}
                disabled={!selectValue}
              />
            </Col>
            <Col span={4}>
              <Button color="primary" onClick={() => handleSearch()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Col>
          </Row>
          <p style={{ margin: '20px 0 10px' }}>账号列表</p>
          <Table
            dataSet={userDS}
            columns={userColumns()}
            columnResizable="true"
            editMode="inline"
          />
        </Sidebar>
        <Modal
          visible={deleteVisible}
          onOk={handleClearOk}
          onCancel={handleDeleteCancel}
          footer={null}
          width={400}
          closable
          destroyOnClose
        >
          <Row>
            <Col span={12}>
              <Select placeholder="请选择" onChange={handleSelectFuncChange}>
                {funcList.map((i) => {
                  return (
                    <Option value={i.value} key={i.value}>
                      {i.meaning}
                    </Option>
                  );
                })}
              </Select>
            </Col>
            <Col span={11} offset={1}>
              <div>
                <Button>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
                <Popconfirm
                  okText={intl.get('hzero.common.button.sure').d('确定')}
                  cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                  title={intl
                    .get('lmds.common.view.message.confirm.remove')
                    .d('是否删除选中的方案包数据？')}
                  onConfirm={() => handleDeleteFunc()}
                >
                  <Button color="primary" disabled={!selectedFunc} loading={okLoading}>
                    {intl.get('hzero.common.button.sure').d('确定')}
                  </Button>
                </Popconfirm>
              </div>
            </Col>
          </Row>
        </Modal>
      </Content>
    </Fragment>
  );
};
