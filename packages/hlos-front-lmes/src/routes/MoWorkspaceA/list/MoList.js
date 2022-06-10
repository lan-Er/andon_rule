/**
 * @Description: MO工作台管理信息
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React, { useContext, useEffect, useState } from 'react';
import {
  Tabs,
  Lov,
  Form,
  Button,
  // Switch,
  DatePicker,
  DateTimePicker,
  TextField,
  Select,
  Modal,
} from 'choerodon-ui/pro';
import intl from 'utils/intl';
import {
  getResponse,
  tableScrollWidth,
  createPagination,
  getCurrentOrganizationId,
  filterNullValueObject,
} from 'utils/utils';
import notification from 'utils/notification';
import { isUndefined } from 'lodash';
import ExcelExport from 'components/ExcelExport';
// import { ExportButton } from 'hlos-front/lib/components';
import { Header, Content } from 'components/Page';
import useChangeWidth from '@/utils/useChangeWidth';
import Store from '@/stores/moWorkspaceADS';
import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import { releaseMo, cancelMo, closeMo, holdMo, exploreMo } from '@/services/moWorkspaceService';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

import MainTable from './MainTable';
import ExecuteTable from './ExecuteTable';
import './style.less';

const { common } = codeConfig.code;
const { TabPane } = Tabs;

const preCode = 'lmes.moWorkspace';
const organizationId = getCurrentOrganizationId();

export default () => {
  const { listDS, queryDS, history } = useContext(Store);
  const [showFlag, setShowFlag] = useState(false);
  const showQueryNumber = useChangeWidth();
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({});
  const [moListLoading, setMoListLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [closeLoading, setCloseLoading] = useState(false);
  const [releaseLoading, setReleaseLoading] = useState(false);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    queryDS.create({}, 0);
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });

      if (getResponse(res)) {
        if (res && res.content && res.content[0]) {
          queryDS.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationName: res.content[0].organizationName,
          });
        }
      }
    }
    defaultLovSetting();
  }, [queryDS]);

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="moNumObj" noCache key="moNumObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Select name="moStatus" key="moStatus" />,
      <Lov name="meAreaObj" noCache key="meAreaObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="equipmentObj" noCache key="equipmentObj" />,
      <Lov name="moTypeObj" noCache key="moTypeObj" />,
      <Lov name="soObj" noCache key="soObj" />,
      <Lov name="demandObj" noCache key="demandObj" />,
      <TextField name="customerName" key="customerName" />,
      <TextField name="projectNum" key="projectNum" />,
      <Lov name="sourceDocObj" noCache key="sourceDocObj" />,
      <TextField name="externalNum" key="externalNum" />,
      <Lov name="categoryObj" noCache key="categoryObj" />,
      <Select name="mtoExploredFlag" key="mtoExploredFlag" />,
      <DatePicker name="demandDateStart" key="demandDateStart" />,
      <DatePicker name="demandDateEnd" key="demandDateEnd" />,
      <TextField name="topMoNum" key="topMoNum" />,
      <TextField name="parentMoNums" key="parentMoNums" />,
      <DateTimePicker name="planStartDateLeft" key="planStartDateLeft" />,
      <DateTimePicker name="planStartDateRight" key="planStartDateRight" />,
      <DateTimePicker name="planEndDateLeft" key="planEndDateLeft" />,
      <DateTimePicker name="planEndDateRight" key="planEndDateRight" />,
    ];
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    const { pageSize } = pagination;
    handlePagination({ pageSize });
  }

  /**
   * handlePagination - 分页设置
   * @param {object} pagination - 分页对象
   */
  async function handlePagination(page) {
    setMoListLoading(true);
    listDS.queryParameter = queryDS.current.toJSONData();
    if (page) {
      const { current, pageSize } = page;
      listDS.setQueryParameter('page', current - 1);
      listDS.setQueryParameter('size', pageSize);
    } else {
      const { current, pageSize } = pagination;
      listDS.setQueryParameter('page', current - 1);
      listDS.setQueryParameter('size', pageSize);
    }
    const result = await listDS.query();
    setDataSource(result.content);
    setPagination(createPagination(result));
    // 清空勾选
    handleSelectRowKeys();
    setMoListLoading(false);
  }

  /**
   * 重置
   */
  function handleReset() {
    queryDS.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   *跳转到明细页面
   * @param {*} url
   */
  function handleToDetailPage(url) {
    history.push(url);
  }

  /**
   *下达
   */
  function handleRelease() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const statusList = ['NEW', 'SCHEDULED'];
    if (selectedData.filter((i) => !statusList.includes(i.moStatus)).length > 0) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.submitLimit`)
          .d('只有新增和已排期状态的MO才允许下达！'),
      });
      return;
    }

    setReleaseLoading(true);
    releaseMo(selectedRowKeys).then(async (res) => {
      setReleaseLoading(false);
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: intl.get(`${preCode}.view.message.releaseOk`).d('下达成功'),
        });
        handlePagination();
      }
    });
  }

  /**
   *分解
   */
  function handleExplore() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const statusList = ['NEW', 'SCHEDULED', 'RELEASED'];
    if (selectedData.filter((i) => !statusList.includes(i.moStatus)).length > 0) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.exploreLimit`)
          .d('只有新增、已排期、已下达状态的MO才允许分解！'),
      });
      return;
    }
    setExploreLoading(true);
    exploreMo({
      exploreLevel: 0,
      moIdList: selectedRowKeys,
    }).then(async (res) => {
      setExploreLoading(false);
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: intl.get(`${preCode}.view.message.exploreOk`).d('分解成功'),
        });
        handlePagination();
      }
    });
  }

  /**
   *暂挂
   */
  async function handlePending() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const statusList = ['NEW', 'SCHEDULED', 'RELEASED'];
    if (selectedData.filter((i) => !statusList.includes(i.moStatus)).length > 0) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.pendingLimit`)
          .d('只有新增、已排期、已下达状态的MO才允许暂挂！'),
      });
      return;
    }
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.pendingMo`).d('是否暂挂MO？')}</p>,
      onOk: () => {
        setPendingLoading(true);
        holdMo(selectedRowKeys).then(async (res) => {
          setPendingLoading(false);
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            notification.success({
              message: intl.get(`${preCode}.view.message.pendingOk`).d('暂挂成功'),
            });
            handlePagination();
          }
        });
      },
    });
  }

  /**
   *取消
   */
  function handleCancel() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const statusList = ['NEW', 'SCHEDULED', 'RELEASED', 'PENDING'];
    if (selectedData.filter((i) => !statusList.includes(i.moStatus)).length > 0) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.cancelLimit`)
          .d('只有新增、已排期、已下达、已暂挂状态的MO才允许取消！'),
      });
      return;
    }
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.cancelMo`).d('是否取消MO？')}</p>,
      onOk: () => {
        setCancelLoading(true);
        cancelMo(selectedRowKeys).then(async (res) => {
          setPendingLoading(false);
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            notification.success({
              message: intl.get(`${preCode}.view.message.cancelOk`).d('取消成功'),
            });
            handlePagination();
          }
        });
      },
    });
  }

  /**
   *关闭
   */
  function handleClose() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const statusList = ['CANCELLED', 'CLOSED'];
    if (selectedData.filter((i) => statusList.includes(i.moStatus)).length > 0) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.closeLimit`)
          .d('已取消、已关闭状态的MO不允许关闭！'),
      });
    } else if (selectedData.filter((i) => !i.releasedDate).length > 0) {
      notification.error({
        message: intl.get(`${preCode}.view.message.releasedDateLimit`).d('下达时间不能为空！'),
      });
    } else {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.closeMo`).d('是否关闭MO？')}</p>,
        onOk: () => {
          setCloseLoading(true);
          closeMo(selectedRowKeys).then(async (res) => {
            setCloseLoading(false);
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              notification.success({
                message: intl.get(`${preCode}.view.message.closeOk`).d('关闭成功'),
              });
              handlePagination();
            }
          });
        },
      });
    }
  }

  /**
   *显示超链接
   * @returns
   */
  function linkRenderer(value, record) {
    return (
      <a
        onClick={() =>
          handleToDetailPage(
            `/lmes/mo-workspace-a/detail/${record.ownerOrganizationId}/${record.moId}`
          )
        }
      >
        {value}
      </a>
    );
  }
  /**
   * MO选择操作
   * @param {array<String>} selectedRowKeys - moId唯一标识列表
   */
  function handleSelectRowKeys(rowKeys = [], records = []) {
    setSelectedRowKeys(rowKeys);
    setSelectedData(records);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectRowKeys,
  };

  const mainProps = {
    loading: moListLoading,
    dataSource,
    pagination,
    tableScrollWidth,
    handlePagination,
    linkRenderer,
    rowSelection,
  };
  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = queryDS.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    // const { moStatus: moStatusList } = fieldsValue;
    return {
      ...fieldsValue,
      // moStatusList,
      moStatusList: fieldsValue?.moStatus?.join(),
      moStatus: undefined,
    };
  }

  return (
    <>
      <Header title={intl.get(`${preCode}.view.title.moWorkspace`).d('MO工作台')}>
        <Button
          icon="add"
          color="primary"
          onClick={() => handleToDetailPage('/lmes/mo-workspace-a/create')}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${organizationId}/mos/excel-mo-a`}
          queryParams={getExportQueryParams}
        />
        <Button loading={closeLoading} waitType="throttle" onClick={handleClose}>
          {intl.get('hzero.common.button.close').d('关闭')}
        </Button>
        <Button loading={cancelLoading} waitType="throttle" onClick={handleCancel}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button loading={pendingLoading} waitType="throttle" onClick={handlePending}>
          {intl.get('lmes.common.button.pending').d('暂挂')}
        </Button>
        <Button loading={exploreLoading} waitType="throttle" onClick={handleExplore}>
          {intl.get('lmes.common.button.explore').d('分解')}
        </Button>
        <Button loading={releaseLoading} waitType="throttle" onClick={handleRelease}>
          {intl.get('lmes.common.button.release').d('下达')}
        </Button>
      </Header>
      <Content className="lmes-moWorkspace-content">
        <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
          <Form dataSet={queryDS} columns={showQueryNumber} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, showQueryNumber) : queryFields()}
          </Form>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginLeft: 8 }}>
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Tabs animated={{ inkBar: true, tabPane: false }} defaultActiveKey="main">
          <TabPane tab={intl.get(`${preCode}.view.title.miain`).d('主要')} key="main">
            <MainTable {...mainProps} />
          </TabPane>
          <TabPane tab={intl.get(`${preCode}.view.title.execute`).d('执行')} key="execute">
            <ExecuteTable {...mainProps} />
          </TabPane>
        </Tabs>
      </Content>
    </>
  );
};
