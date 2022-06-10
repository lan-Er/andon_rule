/*
 * @Descripttion:报价单审核（核企侧）
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-03-26 10:53:20
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-07 21:17:44
 */

import React, { useEffect, useState, Fragment } from 'react';
import {
  DataSet,
  Button,
  Table,
  Tabs,
  Form,
  Lov,
  Select,
  TextField,
  Modal,
  SelectBox,
  TextArea,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import LogModal from '@/components/LogModal/index';
import { listDS } from '../store/indexDS';
import styles from './index.less';

const { TabPane } = Tabs;
const { Option } = SelectBox;
const withdrawnKey = Modal.key();
const intlPrefix = 'zcom.quotationReview';

const ListDS = new DataSet(listDS());
let withdrawnReason = ''; // 退回原因
let withdrawnRemark = ''; // 退回补充说明

function ZcomQuotationReview({ history, dispatch }) {
  // const [listColumns, setListColumns] = useState([]);
  const [moreQuery, setMoreQuery] = useState(false);
  const [currentTab, setCurrentTab] = useState('ALL');

  useEffect(() => {
    // ListDS.query();
    handleTabChange('ALL');
  }, []);

  /**
   * 进入详情
   * @param {*} id 头id
   */
  function handleToDetail(id) {
    const pathName = `/zcom/quotation-review/${id}`;
    history.push(pathName);
  }

  function handleValidate(type) {
    const selectedList = ListDS.selected;
    let validateFlag = true;
    if (!selectedList.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return false;
    }
    selectedList.forEach((v) => {
      if (v.data.quotationOrderStatus !== 'QUOTED') {
        validateFlag = false;
      }
    });
    if (!validateFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.select`)
          .d(
            `选中的报价单有无法${
              type === 'RETURNED' ? '退回' : '通过'
            }的报价单（新建/已生效/已退回/已撤回/已失效），请检查后选择`
          ),
      });
      return false;
    }
    return true;
  }

  /**
   * 审核通过/退回
   * @param {*} type 审核类型
   */
  async function handleReview(type) {
    const arr = [];
    const selectedList = ListDS.selected;
    if (!handleValidate(type)) {
      return;
    }
    selectedList.forEach(async (v) => {
      const obj = {
        ...v.data,
        quotationOrderStatus: type,
        operationOpinion: type === 'RETURNED' ? withdrawnReason + withdrawnRemark : null,
      };
      arr.push(obj);
    });
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'quotationReview/verifyQuotationOrder',
        payload: arr,
      })
        .then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '操作成功',
            });
            ListDS.query();
          }
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  function handleReasonChange(e) {
    let str;
    switch (e) {
      case 'fix':
        str = '修改报价';
        break;
      case 'cancel':
        str = '取消报价';
        break;
      case 'other':
        str = '其他';
        break;
      default:
        str = '';
        break;
    }
    withdrawnReason = str;
  }

  function handleRemarkChange(e) {
    withdrawnRemark = e;
  }

  function handleWithdrawn() {
    if (!handleValidate('RETURNED')) {
      return;
    }
    withdrawnReason = '';
    withdrawnRemark = '';
    Modal.open({
      key: withdrawnKey,
      title: '退回报价',
      children: (
        <div>
          <div className={styles['withdrawn-title']}>请选择您退回报价的原因（必选）</div>
          <SelectBox onChange={handleReasonChange}>
            <Option value="fix">修改报价</Option>
            <Option value="cancel">取消报价</Option>
            <Option value="other">其他</Option>
          </SelectBox>
          <TextArea placeholder="补充说明" cols={60} onChange={handleRemarkChange} />
        </div>
      ),
      className: styles['zcom-quotation-review-withdrawn'],
      onOk: () => handleReview('RETURNED'),
    });
  }

  const columns = [
    {
      name: 'quotationOrderNum',
      minWidth: 180,
      renderer: ({ record, value }) => {
        const id = record.get('quotationOrderId');
        return (
          <>
            <a onClick={() => handleToDetail(id)}>{value}</a>
            <div>报价单标题：{record.get('quotationOrderName')}</div>
          </>
        );
      },
      lock: 'left',
    },
    {
      name: 'quotationSourceTypeMeaning',
      minWidth: 200,
      renderer: ({ record, value }) => {
        return (
          <>
            <div>来源类型：{value}</div>
            <div>来源单号：{record.get('sourceDocNum')}</div>
          </>
        );
      },
    },
    {
      name: 'supplierName',
      minWidth: 150,
    },
    {
      name: 'totalAmount',
      minWidth: 150,
      renderer: ({ record, value }) => {
        return !value || Number(value) === 0 ? null : (
          <div>{`${record.get('currencyCode')} ${Number(value).toFixed(2)}`}</div>
        );
      },
    },
    {
      name: 'quotationOrderStatusMeaning',
      width: 100,
      lock: 'right',
    },
    {
      header: '日志',
      width: 90,
      lock: 'right',
      renderer: ({ record }) => {
        return (
          <LogModal id={record.get('quotationOrderId')}>
            <a>日志</a>
          </LogModal>
        );
      },
    },
  ];

  function handleTabChange(key) {
    setCurrentTab(key);
    ListDS.setQueryParameter('quotationOrderStatusList', key !== 'ALL' ? [key] : null);
    // if (key === 'RETURNED') {
    //   const arr = columns.concat([]);
    //   arr.splice(4, 0, {
    //     header: '退回理由',
    //     name: 'operationOpinion',
    //     // width: 100,
    //     lock: 'right',
    //   });
    //   setListColumns(arr);
    // } else {
    //   setListColumns(columns);
    // }
    ListDS.query();
  }

  const handleReset = () => {
    ListDS.queryDataSet.current.reset();
  };

  const handleSearch = () => {
    ListDS.query();
  };

  const listProps = {
    dataSet: ListDS,
    queryBar: 'none',
    columnResizable: 'true',
    columns,
    rowHeight: 'auto',
  };

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.quotationReview`).d('报价单审核')}>
        <Button color="primary" onClick={() => handleReview('EFFECTIVE')}>
          通过
        </Button>
        <Button onClick={handleWithdrawn}>退回</Button>
      </Header>
      <Content className={styles['zcom-quotation-review-content']}>
        <div className={styles['zcom-quotation-review-list-query']}>
          <Form dataSet={ListDS.queryDataSet} columns={3}>
            <TextField name="quotationOrderNum" key="quotationOrderNum" />,
            <Lov name="supplierObj" key="supplierObj" noCache />,
            {currentTab === 'ALL' && (
              <Select name="quotationOrderStatusList" key="quotationOrderStatusList" />
            )}
            ,
            {(moreQuery || currentTab !== 'ALL') && (
              <Lov name="companyObj" key="companyObj" noCache />
            )}
            ,{moreQuery && <Select name="quotationOrderType" key="quotationOrderType" />},
            {moreQuery && <Select name="quotationSourceType" key="quotationSourceType" />},
            {moreQuery && <TextField name="sourceDocNum" key="sourceDocNum" />},
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
            <Button
              onClick={() => {
                setMoreQuery(!moreQuery);
              }}
            >
              {moreQuery
                ? intl.get('hzero.common.button.collected').d('收起查询')
                : intl.get('hzero.common.button.viewMore').d('更多查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Tabs defaultActiveKey={currentTab} onChange={handleTabChange}>
          <TabPane tab="全部" key="ALL">
            <Table {...listProps} />
          </TabPane>
          <TabPane tab="已报价" key="QUOTED">
            <Table {...listProps} />
          </TabPane>
          <TabPane tab="已退回" key="RETURNED">
            <Table {...listProps} />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomQuotationReview {...props} />;
});
