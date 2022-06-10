/**
 * @Description: 报价单维护-列表页
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-03-26 15:50:18
 */

import { connect } from 'dva';
import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Tabs,
  Table,
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
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { QuotationListDS } from '../store/QuotationMaintainDS';
import LogModal from '@/components/LogModal/index';
import styles from './index.less';

const { TabPane } = Tabs;
const { Option } = SelectBox;
const withdrawnKey = Modal.key();
const intlPrefix = 'zcom.quotationMaintain';
const ListDS = () => new DataSet(QuotationListDS());

let withdrawnReason = ''; // 撤回原因
let withdrawnRemark = ''; // 撤回补充说明

function ZcomQuotationMaintain({ dispatch, history, currentTab }) {
  const listDS = useDataSet(() => ListDS(), ZcomQuotationMaintain);
  const [curTab, setCurTab] = useState(currentTab);
  const [moreQuery, setMoreQuery] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    listDS.setQueryParameter('quotationOrderStatusList', null);
    if (curTab !== 'ALL') {
      if (curTab === 'NEW') {
        listDS.setQueryParameter('quotationOrderStatusList', ['NEW', 'WITHDRAWN', 'RETURNED']);
      } else {
        listDS.setQueryParameter('quotationOrderStatusList', [curTab]);
      }
    }
    listDS.query();
  }, []);

  function handleCreate() {
    const pathName = `/zcom/quotation-maintain/create`;
    history.push(pathName);
  }

  function handleToDetail(record) {
    const { quotationOrderId, quotationOrderNum, quotationOrderStatus } = record.toData();
    history.push({
      pathname: `/zcom/quotation-maintain/detail/${quotationOrderId}`,
      state: {
        quotationOrderNum,
        quotationOrderStatus,
      },
    });
  }

  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  async function handleSearch() {
    const validateValue = await listDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    await listDS.query();
  }

  function handleSubmit() {
    setSubmitLoading(true);
    return new Promise(async (resolve) => {
      if (!listDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(setSubmitLoading(false));
        return false;
      }
      let statusFlag = true;
      const arr = listDS.selected.map((v) => {
        if (!['NEW', 'WITHDRAWN', 'RETURNED'].includes(v.data.quotationOrderStatus)) {
          statusFlag = false;
        }
        const obj = Object.assign({}, v.data, {
          quotationOrderStatus: 'QUOTED',
        });
        return obj;
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.statusValidate`)
            .d('存在不是新建、已退回或已撤回状态的报价单'),
        });
        resolve(setSubmitLoading(false));
        return false;
      }
      dispatch({
        type: 'quotationMaintain/quotationOrderSubmit',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '提交成功',
          });
          handleSearch();
        }
        resolve(setSubmitLoading(false));
      });
    });
  }

  // 单行提交
  // function handleOneSubmit(record) {
  //   return new Promise(async (resolve) => {
  //     dispatch({
  //       type: 'quotationMaintain/quotationOrderSubmit',
  //       payload: [
  //         {
  //           ...record.toData(),
  //         },
  //       ],
  //     }).then((res) => {
  //       if (res && !res.failed) {
  //         notification.success({
  //           message: '提交成功',
  //         });
  //         handleSearch();
  //       }
  //       resolve();
  //     });
  //   });
  // }

  // function handleDelete(record) {
  //   return new Promise(async (resolve) => {
  //     dispatch({
  //       type: 'quotationMaintain/quotationOrderDelete',
  //       payload: {
  //         ...record.toData(),
  //       },
  //     }).then((res) => {
  //       if (res && !res.failed) {
  //         notification.success({
  //           message: '删除成功',
  //         });
  //         handleSearch();
  //       }
  //       resolve();
  //     });
  //   });
  // }

  function handleWithdrawnSure(params) {
    return new Promise(async (resolve) => {
      if (!withdrawnReason) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.noreason`).d('请选择您撤回报价的原因'),
        });
        resolve(false);
        return;
      }
      dispatch({
        type: 'quotationMaintain/quotationOrderRecall',
        payload: params,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '撤回成功',
          });
          handleSearch();
        }
        resolve();
      });
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
    withdrawnReason = '';
    withdrawnRemark = '';
    let validateFlag = true;
    if (!listDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    const params = listDS.selected.map((v) => {
      if (!['RETURNED', 'QUOTED'].includes(v.data.quotationOrderStatus)) {
        validateFlag = false;
      }
      const obj = Object.assign({}, v.data, {
        operationOpinion: `${withdrawnReason}${withdrawnRemark ? `:${withdrawnRemark}` : ''}`,
      });
      return obj;
    });
    if (!validateFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.select`)
          .d(`选中的报价单中有无法撤回的报价单（新建/已撤回/已生效/已失效），请检查后选择`),
      });
      return;
    }
    Modal.open({
      key: withdrawnKey,
      title: '撤回报价',
      children: (
        <div>
          <div className={styles['withdrawn-title']}>请选择您撤回报价的原因（必选）</div>
          <SelectBox onChange={handleReasonChange}>
            <Option value="fix">修改报价</Option>
            <Option value="cancel">取消报价</Option>
            <Option value="other">其他</Option>
          </SelectBox>
          <TextArea placeholder="补充说明" cols={60} onChange={handleRemarkChange} />
        </div>
      ),
      className: styles['zcom-quotation-maintain-withdrawn'],
      onOk: () => handleWithdrawnSure(params),
    });
  }

  function handleTabChange(key) {
    setCurTab(key);
    dispatch({
      type: 'quotationMaintain/updateState',
      payload: {
        currentTab: key,
      },
    });
    listDS.setQueryParameter('quotationOrderStatusList', null);
    if (key !== 'ALL') {
      if (key === 'NEW') {
        listDS.setQueryParameter('quotationOrderStatusList', ['NEW', 'WITHDRAWN', 'RETURNED']);
      } else {
        listDS.setQueryParameter('quotationOrderStatusList', [key]);
      }
    }
    listDS.query();
  }

  const columns = [
    {
      name: 'quotationOrder',
      lock: true,
      minWidth: 180,
      renderer: ({ record }) => (
        <>
          <a onClick={() => handleToDetail(record)}>{record.get('quotationOrderNum')}</a>
          <div>报价单标题：{record.get('quotationOrderName')}</div>
        </>
      ),
    },
    {
      name: 'sourceChannel',
      lock: true,
      minWidth: 200,
      renderer: ({ record }) => (
        <>
          <div>来源类型：{record.get('quotationSourceTypeMeaning')}</div>
          <div>来源单号：{record.get('sourceDocNum')}</div>
        </>
      ),
    },
    { name: 'customerName', minWidth: 150 },
    {
      name: 'totalAmount',
      minWidth: 150,
      renderer: ({ record }) => {
        const { currencyCode, totalAmount } = record.toData();
        return (
          <span>
            {totalAmount && totalAmount !== '0'
              ? `${currencyCode || ''}${Number(totalAmount).toFixed(2)}`
              : ''}
          </span>
        );
      },
    },
    { name: 'quotationOrderStatus', width: 90, lock: 'right' },
    {
      header: '日志',
      width: 90,
      renderer: ({ record }) => {
        return (
          <LogModal id={record.get('quotationOrderId')}>
            <a>日志</a>
          </LogModal>
        );
      },
      lock: 'right',
    },
    // {
    //   header: '操作',
    //   width: 170,
    //   command: ({ record }) => {
    //     const arr = [
    //       <Button
    //         key="submit"
    //         color="primary"
    //         funcType="flat"
    //         onClick={() => handleOneSubmit(record)}
    //       >
    //         提交报价
    //       </Button>,
    //       <Button key="delete" color="primary" funcType="flat" onClick={() => handleDelete(record)}>
    //         删除
    //       </Button>,
    //     ];
    //     const withdrawnArr = [
    //       <Button
    //         key="withdrawn"
    //         color="primary"
    //         funcType="flat"
    //         onClick={() => handleWithdrawn(record)}
    //       >
    //         撤回报价
    //       </Button>,
    //     ];
    //     // 新建和已撤回：可提交报价和删除报价
    //     if (['NEW', 'WITHDRAWN'].includes(record.get('quotationOrderStatus'))) {
    //       return arr;
    //     }
    //     // 已退回：可撤回报价、提交报价和删除报价
    //     if (['RETURNED'].includes(record.get('quotationOrderStatus'))) {
    //       return withdrawnArr.concat(arr);
    //     }
    //     // 已报价：可撤回报价
    //     if (['QUOTED'].includes(record.get('quotationOrderStatus'))) {
    //       return withdrawnArr;
    //     }
    //     return [];
    //   },
    //   lock: 'right',
    // },
  ];

  // function getWithdrawnColumns() {
  //   const arr = columns.concat([]);
  //   arr.splice(5, 0, {
  //     header: '撤回理由',
  //     name: 'operationOpinion',
  //     width: 100,
  //     lock: 'right',
  //   });
  //   return arr;
  // }

  // function getReturnedColumns() {
  //   const arr = columns.concat([]);
  //   arr.splice(5, 0, {
  //     header: '退回理由',
  //     name: 'operationOpinion',
  //     width: 100,
  //     lock: 'right',
  //   });
  //   return arr;
  // }

  function getListProps() {
    const props = {
      dataSet: listDS,
      queryBar: 'none',
      columnResizable: 'true',
      columns,
      rowHeight: 'auto',
    };
    return props;
  }

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.quotationMaintain`).d('报价单维护')}>
        {/* <ExcelExport
          requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/repairs-orders/export`}
          queryParams={getExportQueryParams}
        />
        <HButton icon="upload" onClick={handleImport}>
          {intl.get('zcom.common.button.import').d('导入')}
        </HButton> */}
        <Button color="primary" onClick={handleCreate}>
          新建
        </Button>
        <Button onClick={handleSubmit} loading={submitLoading}>
          提交报价
        </Button>
        <Button onClick={handleWithdrawn}>撤回报价</Button>
      </Header>
      <Content className={styles['zcom-quotation-maintain-content']}>
        <div className={styles['zcom-quotation-maintain']}>
          <Form dataSet={listDS.queryDataSet} columns={3}>
            <TextField name="quotationOrderNum" />
            <Lov name="customerObj" clearButton noCache />
            {curTab === 'ALL' && <Select name="quotationOrderStatusList" />}
            {(moreQuery || curTab !== 'ALL') && <Lov name="companyObj" clearButton noCache />}
            {moreQuery && <Select name="quotationOrderType" />}
            {moreQuery && <Select name="quotationSourceType" />}
            {moreQuery && <TextField name="sourceDocNum" />}
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
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="全部" key="ALL">
            <Table {...getListProps()} />
          </TabPane>
          <TabPane tab="待提交" key="NEW">
            <Table {...getListProps()} />
          </TabPane>
          <TabPane tab="已撤回" key="WITHDRAWN">
            <Table {...getListProps()} />
          </TabPane>
          <TabPane tab="被退回" key="RETURNED">
            <Table {...getListProps()} />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default connect(({ quotationMaintain: { currentTab } }) => ({ currentTab }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomQuotationMaintain)
);
