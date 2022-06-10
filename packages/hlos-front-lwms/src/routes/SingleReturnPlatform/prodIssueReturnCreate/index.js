/*
 * @Description: 退料单新增
 * @Author: leying.yan@hand-china.com
 * @Date: 2021-06-02 10:22:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-02 10:22:07
 */
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { routerRedux } from 'dva/router';
import { Lov, Form, TextField, Button, DateTimePicker, DataSet, Tooltip } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { userSetting } from 'hlos-front/lib/services/api';
import { singleReturnDetailDS } from '@/stores/singleReturnPlatformDS';
import { prodIssueReturnSave, getItemWmRule } from '@/services/singleReturnService';
import MainLineTable from './LineTable';

const intlPrefix = 'lwms.singleReturnPlatform';
const commonPrefix = 'lwms.common';

function ProdIssueReturnCreate({ dispatch, location }) {
  const myState = sessionStorage.getItem('singleReturnState');
  const myRuturnOrderObj = myState ? JSON.parse(myState) && JSON.parse(myState).returnOrderObj : {};
  if ((!location || !location.state || !location.state.returnOrderObj) && !myRuturnOrderObj) {
    const pathname = `/lwms/single-return-platform`;
    dispatch(
      routerRedux.push({
        pathname,
      })
    );
    return false;
  }
  const { docProcessRuleId, docProcessRule } = myRuturnOrderObj || location.state.returnOrderObj;
  const [documentTypeData, setDocumentTypeData] = useState({});
  const detailDS = useMemo(() => new DataSet(singleReturnDetailDS()), []);
  /**
   * 设置默认组织
   */
  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        detailDS.current.set('organizationObj', {
          organizationId: res.content[0].meOuId,
          organizationName: res.content[0].meOuName,
          organizationCode: res.content[0].organizationCode,
        });
        detailDS.current.set('creatorObj', {
          workerId: res.content[0].workerId,
          workerName: res.content[0].workerName,
          workerCode: res.content[0].workerCode,
        });
      }
    }
    getUserInfo();
    if (myRuturnOrderObj || (location && location.state && location.state.returnOrderObj)) {
      if (myRuturnOrderObj) {
        setDocumentTypeData(myRuturnOrderObj);
      } else {
        setDocumentTypeData(location.state.returnOrderObj);
      }
    }
    // 若单据处理规则中doc_num为manual,，必输；若不为manual，灰色不可输入
    let docNum = '';
    if (myRuturnOrderObj && myRuturnOrderObj.docProcessRule) {
      docNum = JSON.parse(myRuturnOrderObj && myRuturnOrderObj.docProcessRule).doc_num;
    }
    if (!docNum || docNum !== 'manual') {
      detailDS.fields.get('wmRequestNum').set('disabled', true);
      detailDS.fields.get('wmRequestNum').set('required', false);
    }
    if (docNum === 'manual') {
      detailDS.fields.get('wmRequestNum').set('disabled', false);
      detailDS.fields.get('wmRequestNum').set('required', true);
    }
    return () => {
      sessionStorage.removeItem('singleReturnState');
    };
  }, []);
  /**
   * @description: 保存按钮
   */
  const handleSave = async () => {
    const validateValue = await detailDS.validate(false, true);
    const validateLineValue = await detailDS.children.requestLineList.validate(false, true);
    if (!validateValue || !validateLineValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    if (!detailDS.children.requestLineList.selected.length) {
      notification.warning({
        message: '未选中领料单行',
      });
      return;
    }
    const { requestLineList } = detailDS.children;
    const _lineList = [];
    const recordArr = requestLineList.selected;
    const data = detailDS.current.toJSONData();
    for (let i = 0; i < recordArr.length; i++) {
      const params = [
        {
          organizationId: detailDS.current.get('organizationId'),
          itemId: recordArr[i].get('itemId'),
        },
      ];
      // eslint-disable-next-line no-await-in-loop
      const res = await getItemWmRule(params);
      const {
        pickRuleId,
        pickRule,
        reservationRuleId,
        reservationRule,
        fifoRuleId,
        fifoRule,
      } = res[0];
      _lineList.push({
        ...recordArr[i].toJSONData(),
        pickRuleId,
        pickRule,
        reservationRuleId,
        reservationRule,
        fifoRuleId,
        fifoRule,
        sourceDocTypeId: documentTypeData.documentTypeId,
        sourceDocTypeCode: documentTypeData.documentTypeCode,
        sourceDocNum: data.issueRequestNum,
        requestLineStatus: '',
        requestLineStatusMeaning: '',
      });
    }
    const params = {
      ...data,
      requestTypeId: documentTypeData.documentTypeId,
      requestTypeCode: documentTypeData.documentTypeCode,
      sourceDocTypeId: documentTypeData.documentTypeId,
      sourceDocTypeCode: documentTypeData.documentTypeCode,
      sourceDocId: data.issueRequestId,
      sourceDocNum: data.issueRequestNum,
      _status: 'create', // 用以区分是新增还是编辑 ds的提交就有  自己写的参数 就得加一个
      approvalRule: documentTypeData.approvalRule,
      approvalWorkflow: documentTypeData.approcalWorkflow,
      docProcessRuleId,
      docProcessRule,
      requestLineList: _lineList,
    };
    const res = await prodIssueReturnSave(params);
    if (res && res.failed) {
      notification.error({
        message: res.message || '保存失败',
      });
    } else {
      notification.success({
        message: res.message || '保存成功',
      });
      // 成功后重置
      const organizationObj = detailDS.current.get('organizationObj');
      const creatorObj = detailDS.current.get('creatorObj');
      detailDS.reset();
      if (detailDS.current) {
        detailDS.current.set('organizationObj', organizationObj);
        detailDS.current.set('creatorObj', creatorObj);
      }
      sessionStorage.setItem('SingleReturnProdIssueReturnCreate', true);
    }
  };

  /**
   * @description: 返回退出新增界面
   */
  const handleBack = () => {
    detailDS.remove(detailDS.current);
    dispatch(routerRedux.push('/lwms/single-return-platform'));
  };

  return (
    <Fragment>
      <Header
        title={documentTypeData?.documentTypeName}
        backPath="/lwms/single-return-platform/list"
        onBack={handleBack}
      >
        <Button icon="save" onClick={handleSave}>
          {intl.get('hzero.common.btn.save').d('保存')}
        </Button>
        <Button icon="cancel" onClick={handleBack}>
          {intl.get('hzero.common.btn.cancel').d('取消')}
        </Button>
      </Header>
      <Content className="lwms-issue-request-content">
        <Card
          key="lwms-issue-request-detail-header"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
        >
          <Fragment key="issue-request-platform-form">
            <Form dataSet={detailDS} columns={4}>
              <Lov name="organizationObj" noCache />
              <Lov name="issueRequestObj" noCache />
              <TextField name="wmRequestNum" />
              <TextField name="moNum" disabled />
              <TextField name="assemblyItemName" disabled />
              <Lov name="wmMoveTypeObj" noCache />
              <Lov name="creatorObj" />
              <DateTimePicker name="planDemandDate" />
              <Lov name="warehouseObj" noCache />
              <Lov name="wmAreaObj" noCache />
              <Lov name="toWarehouseObj" noCache />
              <Lov name="toWmAreaObj" noCache />
              <TextField name="remark" colSpan={2} />
            </Form>
            <Tooltip placement="top" title={documentTypeData?.docProcessRule}>
              <a style={{ width: '25%', padding: '0.1rem 100px', display: 'inline-block' }}>
                {intl.get(`${intlPrefix}.model.docProcessRule`).d('单据处理规则')}
              </a>
            </Tooltip>
          </Fragment>
        </Card>
        <Card
          key="lwms-issue-request-detail-line"
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        >
          <MainLineTable
            dataSet={detailDS.children.requestLineList}
            type={documentTypeData?.documentTypeCode}
          />
        </Card>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(ProdIssueReturnCreate);
