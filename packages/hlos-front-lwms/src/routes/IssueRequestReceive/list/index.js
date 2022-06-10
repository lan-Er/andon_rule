/**
 * @Description: 领料执行--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 120120-07-10 10:05:15
 * @LastEditors: yu.na
 */

import React, { useState, useEffect } from 'react';
import { Button, Lov, DataSet, TextField, Form } from 'choerodon-ui/pro';
import { Spin, Icon, Modal, Checkbox } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import { getResponse, getCurrentUserId } from 'utils/utils';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { Content } from 'components/Page';
import { userSetting } from 'hlos-front/lib/services/api';
import { issueRequestDS } from '@/stores/IssueRequestReceiveDS';
import { requestByNum } from '@/services/issueRequestExecuteService';

import SendImg from 'hlos-front/lib/assets/icons/send.svg';
import Card from './Card';
import './index.less';

const issueDS = () => new DataSet(issueRequestDS());
const { Sidebar } = Modal;

const IssueRequestReceive = (props) => {
  const ds = useDataSet(issueDS, IssueRequestReceive);
  const [issueList, setIssueList] = useState([]);
  const [spinning, changeSpinning] = useState(false);
  const [showMore, toggleShowMore] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [pageDisabled, changePageDisabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchClick, setSearchClick] = useState(false);
  const [orderNum, setOrderNum] = useState(null);

  useEffect(() => {
    async function queryDefaultUserSetting() {
      const res = await userSetting({
        userId: getCurrentUserId(),
        defaultFlag: 'Y',
      });
      if (!isEmpty(res) && res.content && res.content[0]) {
        const {
          workerId,
          workerCode,
          workerName,
          organizationId,
          organizationCode,
          organizationName,
          warehouseId,
          warehouseCode,
          warehouseName,
          wmAreaId,
          wmAreaCode,
          wmAreaName,
        } = res.content[0];
        if (workerId && workerName) {
          ds.queryDataSet.current.set('workerObj', {
            workerId,
            workerCode,
            workerName,
          });
        }
        if (organizationId && organizationName) {
          ds.queryDataSet.current.set('organizationObj', {
            organizationId,
            organizationCode,
            organizationName,
          });
        }
        if (warehouseId && warehouseName) {
          ds.queryDataSet.current.set('warehouseObj', {
            warehouseId,
            warehouseCode,
            warehouseName,
          });
        }
        if (wmAreaId && wmAreaName) {
          ds.queryDataSet.current.set('wmAreaObj', {
            wmAreaId,
            wmAreaCode,
            wmAreaName,
          });
        }
      }
      handleHeaderSearch();
    }
    queryDefaultUserSetting();
  }, []);

  async function handleHeaderSearch(page = 0, size) {
    setCurrentPage(page);
    setSearchClick(false);
    changeSpinning(true);
    ds.queryParameter = {
      page: page || 0,
      size: size || 12,
      showImage: true,
    };
    const res = await ds.query();
    if (getResponse(res)) {
      if (res.totalElements) {
        setTotalElements(res.totalElements);
        if (page === 0) {
          setIssueList(res.content);
        } else {
          setIssueList(issueList.concat(...res.content));
        }
        if (page === res.totalPages) {
          changePageDisabled(true);
        } else {
          changePageDisabled(false);
        }
      }
    }
    changeSpinning(false);
    toggleShowMore(false);
  }

  function handleOrderNumChange(value) {
    setOrderNum(value);
  }

  async function handleOrderSearch() {
    if (!searchClick) {
      setSearchClick(true);
    }
    const res = await requestByNum({ requestNum: orderNum, showImage: true });
    if (getResponse(res)) {
      if (isEmpty(res)) {
        notification.warning({
          message: '该领料单号不存在',
        });
      } else if (res.requestStatus === 'EXECUTED') {
        if (searchClick) {
          if (issueList.findIndex((i) => i.requestNum === orderNum) !== -1) {
            notification.warning({
              message: '单据已扫描',
            });
            return;
          }
          setIssueList(issueList.concat(res));
        } else {
          setIssueList([res]);
        }
      } else {
        notification.warning({
          message: `单据状态为${res.requestStatusMeaning}不能在此界面操作`,
        });
      }
      setOrderNum(null);
      changePageDisabled(true);
    }
  }

  function handleIssueRequestDetil(issueRequest) {
    props.history.push({
      pathname: `/pub/lwms/issue-request-receive/detail/${issueRequest.requestId}`,
      state: {
        record: issueRequest,
      },
    });
  }

  function handleShowMore() {
    toggleShowMore(!showMore);
  }

  /**
   *重置
   */
  async function handleReset() {
    ds.queryDataSet.current.reset();
    await ds.query();
    toggleShowMore(false);
  }

  function handleCancel() {
    toggleShowMore(false);
  }

  function handlePaginationChange() {
    setCurrentPage(currentPage + 1);
    handleHeaderSearch(currentPage + 1);
  }

  function handleItemReceive() {}

  function handleReceive() {}

  function handleItemSelect(item, e) {
    const index = issueList.findIndex((el) => el.requestId === item.requestId);
    const list = [];
    issueList.forEach((i) => {
      list.push(i);
    });
    list.splice(index, 1, {
      ...item,
      checked: e.target.checked,
    });
    setIssueList(list);
  }

  function handleSelectAll() {
    const list = [];
    if (issueList.every((item) => item.checked)) {
      issueList.forEach((item) => {
        list.push({
          ...item,
          checked: false,
        });
      });
    } else {
      issueList.forEach((item) => {
        list.push({
          ...item,
          checked: true,
        });
      });
    }
    setIssueList(list);
  }

  return (
    <div className="lwms-issue-request-receive">
      <div className="lwms-issue-request-receive-header">
        <div className="lwms-issue-request-receive-header-left">领料接收</div>
        <div className="lwms-issue-request-receive-header-right">
          <Lov dataSet={ds.queryDataSet} name="organizationObj" placeholder="请选择接收组织" />
          <Lov dataSet={ds.queryDataSet} name="warehouseObj" placeholder="请选择接收仓库" />
          <Lov dataSet={ds.queryDataSet} name="wmAreaObj" placeholder="请选择接收货位" />
          <div className="more" onClick={handleShowMore}>
            更多
            <Icon type="expand_more" />
          </div>
          <Button color="primary" onClick={() => handleHeaderSearch(0)}>
            {intl.get('hzero.c7nUI.Table.filterTitle').d('筛选')}
          </Button>
        </div>
      </div>
      <div className="sub-lwms-issue-request-receive-header">共搜索到 {totalElements} 条数据</div>
      <Content className="lwms-issue-request-receive-content">
        <div className="query">
          <div className="query-check">
            <Checkbox
              checked={!!issueList.length && issueList.every((item) => item.checked)}
              onChange={handleSelectAll}
            >
              全选
            </Checkbox>
            <div onClick={handleReceive}>
              <img src={SendImg} alt="" />
              <span>一键接收</span>
            </div>
          </div>
          <div className="query-main">
            <TextField
              placeholder="请输入领料单号"
              value={orderNum}
              onChange={handleOrderNumChange}
            />
            <Button color="primary" onClick={handleOrderSearch}>
              {intl.get('lwms.common.button.search').d('搜索')}
            </Button>
          </div>
        </div>
        <Spin spinning={spinning}>
          <div className="lwms-issue-request-receive-card-list">
            {issueList.map((i) => {
              const issueProps = {
                issueRequest: i,
                onDetail: handleIssueRequestDetil,
                onItemReceive: handleItemReceive,
                onItemSelect: handleItemSelect,
              };
              return <Card {...issueProps} key={i.requestId} />;
            })}
          </div>
        </Spin>
        <div
          className="lwms-issue-request-receive-pagination"
          onClick={!pageDisabled ? handlePaginationChange : () => {}}
        >
          {!pageDisabled ? '点击加载更多' : '暂无更多数据'}
        </div>
      </Content>
      <Sidebar
        title={intl.get('hzero.c7nUI.Table.filterTitle').d('筛选')}
        className="lwms-issue-request-receive-filter-modal"
        visible={showMore}
        onCancel={handleCancel}
        cancelText={intl.get('hzero.common.button.reset').d('重置')}
        okText={intl.get('hzero.c7nUI.Table.filterTitle').d('筛选')}
        width={560}
        closable
        footer={null}
        zIndex={999}
      >
        <Form className="form" dataSet={ds.queryDataSet}>
          <Lov dataSet={ds.queryDataSet} name="organizationObj" noCache />
          <Lov dataSet={ds.queryDataSet} name="warehouseObj" noCache />
          <Lov dataSet={ds.queryDataSet} name="wmAreaObj" noCache />
          <Lov dataSet={ds.queryDataSet} name="requestTypeObj" noCache />
          <Lov dataSet={ds.queryDataSet} name="prodLineObj" noCache />
          <Lov dataSet={ds.queryDataSet} name="workerObj" noCache />
        </Form>
        <div className="foot-btn">
          <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
          <Button color="primary" onClick={handleHeaderSearch}>
            {intl.get('hzero.c7nUI.Table.filterTitle').d('筛选')}
          </Button>
        </div>
      </Sidebar>
    </div>
  );
};

export default IssueRequestReceive;
