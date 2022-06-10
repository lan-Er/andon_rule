/*
 * @Descripttion: 报价单审核详情页
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-03-26 10:53:20
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-07 21:35:53
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Form,
  TextField,
  Table,
  NumberField,
  Tabs,
  Modal,
  SelectBox,
  TextArea,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { downloadFile } from 'services/api';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { headDS, lineDS } from '../store/indexDS';
import styles from './index.less';

const { TabPane } = Tabs;
const { Option } = SelectBox;
const withdrawnKey = Modal.key();
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'zcom.quotationReview';
const HeadDS = new DataSet(headDS());
const LineDS = new DataSet(lineDS());

let withdrawnReason = ''; // 撤回原因
let withdrawnRemark = ''; // 撤回补充说明
function ZcomQuotationReviewDetail({ match, dispatch, history }) {
  const [canEdit, setCanEdit] = useState(true);
  const {
    params: { quotationOrderId },
  } = match;

  useEffect(() => {
    async function loadData() {
      HeadDS.current.set('approvalOpinion', '');
      HeadDS.setQueryParameter('quotationOrderId', quotationOrderId);
      LineDS.setQueryParameter('quotationOrderId', quotationOrderId);
      await HeadDS.query();
      setCanEdit(HeadDS.current.get('quotationOrderStatus') === 'QUOTED');
      LineDS.query();
    }
    loadData();
  }, [quotationOrderId]);

  /**
   * 审核通过/拒绝
   * @param {*} type 审核类型
   */
  async function handleReview(type) {
    if (type === 'RETURNED' && !withdrawnReason) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.noreason`).d('请选择您退回报价的原因'),
      });
      return;
    }
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'quotationReview/verifyQuotationOrder',
        payload: [
          {
            ...HeadDS.current.toData(),
            quotationOrderStatus: type,
            operationOpinion: type === 'RETURNED' ? withdrawnReason + withdrawnRemark : null,
            supplierPromiseDate: HeadDS.current.toData().supplierPromiseDate
              ? `${HeadDS.current.toData().supplierPromiseDate} 00:00:00`
              : null,
            quotationOrderLineList: LineDS.toData(),
          },
        ],
      })
        .then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '操作成功',
            });
            const pathName = `/zcom/quotation-review`;
            history.push(pathName);
          }
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  // 查看附件
  function downloadLineFile(file) {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: 'zcom' },
        { name: 'directory', value: 'zcom' },
        { name: 'url', value: file },
      ],
    });
  }

  function handleRemarkChange(e) {
    withdrawnRemark = e;
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

  function handleWithdrawn() {
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

  const lineColumns = [
    {
      name: 'quotationOrderLineNum',
      width: 80,
      lock: 'left',
    },
    {
      name: 'customerItemDesc',
      width: 150,
      lock: 'left',
      renderer: ({ record }) => {
        return (
          <>
            <div>{record.get('customerItemCode')}</div>
            <div>{record.get('customerItemDesc')}</div>
          </>
        );
      },
    },
    {
      name: 'supplierItemDesc',
      width: 150,
      minWidth: 120,
      renderer: ({ record }) => {
        return (
          <>
            <div>{record.get('supplierItemCode')}</div>
            <div>{record.get('supplierItemDesc')}</div>
          </>
        );
      },
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('customerItemId')}
            itemDesc={record.get('customerItemDesc')}
            disabled
          />
        ) : null;
      },
    },
    { name: 'customerUomName' },
    { name: 'customerQuotationQty' },
    { name: 'customerPrice' },
    {
      name: 'taxRate',
      renderer: ({ value }) => <span>{value * 100}</span>,
    },
    { name: 'customerExTaxPrice' },
    { name: 'specification', width: 150 },
    { name: 'processingTechnic', width: 150 },
    {
      name: 'fileUrl',
      renderer: ({ value }) => {
        return value ? (
          <span
            style={{ cursor: 'pointer', color: '#29bece' }}
            onClick={() => downloadLineFile(value)}
          >
            查看附件
          </span>
        ) : null;
      },
    },
    {
      name: 'customerCounterOfferPrice',
      width: 150,
      align: 'left',
      editor: () =>
        HeadDS.current.get('quotationOrderStatus') === 'QUOTED' ? <NumberField /> : null,
      lock: 'right',
    },
    {
      name: 'counterOfferReason',
      width: 150,
      editor: () =>
        HeadDS.current.get('quotationOrderStatus') === 'QUOTED' ? <TextField /> : null,
      lock: 'right',
    },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.quotationReviewDetail`).d('报价单审核详情')}
        backPath="/zcom/quotation-review"
      >
        {canEdit && (
          <>
            <Button color="primary" onClick={() => handleReview('EFFECTIVE')}>
              通过
            </Button>
            <Button onClick={handleWithdrawn}>退回</Button>
          </>
        )}
      </Header>
      <Content className={styles['zcom-quotation-review-detail-content']}>
        <Form dataSet={HeadDS} columns={4} labelWidth={120}>
          <TextField name="customerCompanyName" key="customerCompanyName" disabled />
          <TextField name="quotationOrderTypeMeaning" key="quotationOrderTypeMeaning" disabled />
          <TextField name="supplierName" key="supplierName" disabled />
          <TextField name="quotationOrderName" key="quotationOrderName" disabled />
          <TextField name="quotationOrderNum" key="quotationOrderNum" disabled />
          <TextField
            name="quotationOrderStatusMeaning"
            key="quotationOrderStatusMeaning"
            disabled
          />
          <TextField name="currencyCode" key="currencyCode" disabled />
          <TextField name="productionCycle" key="productionCycle" disabled />
          <TextField name="supplierPromiseDate" key="supplierPromiseDate" disabled />
          <TextField name="quotationSourceTypeMeaning" key="quotationSourceTypeMeaning" disabled />
          <TextField name="sourceDocNum" key="sourceDocNum" disabled />
          <TextArea
            newLine
            colSpan={2}
            name="remark"
            key="remark"
            disabled
            resize="both"
            autoSize
          />
        </Form>
        <Tabs defaultActiveKey="detail">
          <TabPane tab="报价明细" key="detail">
            <Table dataSet={LineDS} columns={lineColumns} columnResizable="true" rowHeight="auto" />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomQuotationReviewDetail {...props} />;
});
