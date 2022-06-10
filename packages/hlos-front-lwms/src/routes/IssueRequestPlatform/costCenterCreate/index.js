/*
 * @Description:领料单新增
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-12-07 10:22:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-11 14:14:21
 */
import React, { useState, Fragment, useEffect, useMemo } from 'react';
// import { routerRedux } from 'dva/router';
import { Lov, Form, TextField, Button, DataSet } from 'choerodon-ui/pro';
import { Card, Divider, Icon } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import { userSetting } from 'hlos-front/lib/services/api';
import detailDS from '@/stores/costCenterDS';
import notification from 'utils/notification';
import MainLineTable from './issueRequestLineTable';
import { costCenterAdd } from '@/services/issueRequestService';

const intlPrefix = 'lwms.issueRequestPlatform';
const commonPrefix = 'lwms.common';

function CostCenterCreate(props) {
  const myState = sessionStorage.getItem('initMyState');
  const myRuturnOrderObj = myState ? JSON.parse(myState) && JSON.parse(myState).returnOrderObj : {};
  const { approvalRule, approvalWorkflow } =
    (props.location && props.location.state && props.location.state.returnOrderObj) ||
    myRuturnOrderObj;
  const fatherDS = useMemo(() => new DataSet(detailDS()), []);
  const childDS = fatherDS.children.line;
  const [moreDetail, setMoreDetail] = useState(false);
  const [defaultWorker, setDefaultWorker] = useState({});
  const [documentTypeData, setDocumentTypeData] = useState({});
  const [lineNumStart, setLineNumStart] = useState(true);
  /**
   * 设置默认组织
   */
  useEffect(() => {
    const {
      location: { state },
    } = props;
    const { returnOrderObj } = state;
    if (returnOrderObj || myRuturnOrderObj) {
      if (myRuturnOrderObj) {
        setDocumentTypeData(myRuturnOrderObj);
      } else {
        setDocumentTypeData(returnOrderObj);
      }
      const docNum =
        (JSON.parse(myRuturnOrderObj && myRuturnOrderObj.docProcessRule) &&
          JSON.parse(myRuturnOrderObj && myRuturnOrderObj.docProcessRule).doc_num) ||
        (JSON.parse(returnOrderObj && returnOrderObj.docProcessRule) &&
          JSON.parse(returnOrderObj && returnOrderObj.docProcessRule).doc_num);
      if (!docNum || docNum !== 'manual') {
        fatherDS.fields.get('requestNum').set('disabled', true);
        fatherDS.fields.get('requestNum').set('required', false);
      }
      if (docNum === 'manual') {
        fatherDS.fields.get('requestNum').set('disabled', false);
        fatherDS.fields.get('requestNum').set('required', true);
      }
    }
  }, []);

  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        fatherDS.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
          organizationCode: res.content[0].organizationCode,
        });
        const workerObj = {
          workerName: res.content[0].workerName,
          workerCode: res.content[0].workerCode,
          workerId: res.content[0].workerId,
        };
        fatherDS.current.set('requestWorkerObj', workerObj);
        setDefaultWorker(workerObj);
      }
    }
    getUserInfo();
  }, []);

  /**
   * @description: 返回退出新增界面
   */
  async function handleSubmit() {
    // const { dispatch } = props;
    if (childDS.selected.length === 0) {
      notification.warning({
        message: '未选中行信息',
      });
      return;
    }
    const validate =
      (await fatherDS.validate(false, false)) && (await childDS.validate(false, false));
    if (!validate) return;
    const lineList = [];
    childDS.selected.forEach((i) => {
      const data = i.toData();
      if (data && data.itemId) {
        const params = {
          _status: 'create',
          ...i.toJSONData(),
        };
        lineList.push(params);
      }
    });
    const myParams = {
      _status: 'create',
      ...fatherDS.current.toJSONData(),
      creatorId: defaultWorker?.workerId,
      creator: defaultWorker?.workerCode,
      approvalRule,
      approvalWorkflow,
      requestTypeId: documentTypeData.documentTypeId || null,
      requestTypeCode: documentTypeData.documentTypeCode || null,
      docProcessRuleId: documentTypeData.docProcessRuleId || null,
      docProcessRule: documentTypeData.docProcessRule || null,
      // remark:备注信息，非必传；传入界面的备注信息
      requestLineList: lineList,
    };
    setLineNumStart(false);
    const res = await costCenterAdd(myParams);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: `领料单{${res.requestNum}}提交成功`,
      });
      sessionStorage.setItem('IssueRequestCostCenterCreate', true);
      // 成功后重置
      const organizationObj = fatherDS.current.get('organizationObj');
      const requestWorkerObj = fatherDS.current.get('requestWorkerObj');
      fatherDS.reset();
      if (fatherDS.children) {
        fatherDS.children.line.reset();
      }
      if (fatherDS.current) {
        fatherDS.current.set('organizationObj', organizationObj);
        fatherDS.current.set('requestWorkerObj', requestWorkerObj);
      }
      setLineNumStart(true);
      // const pathname = `/lwms/issue-request-platform/list`;
      // dispatch(
      //   routerRedux.push({
      //     pathname,
      //   })
      // );
    }
  }
  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.issueRequestPlatform`).d('成本中心领料单新增')}
        backPath="/lwms/issue-request-platform/list"
      >
        <Button icon="save" onClick={handleSubmit}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </Header>
      <Content className="lwms-issue-request-content">
        <Card
          key="lwms-issue-request-detail-header"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
        >
          <Fragment key="issue-request-platform-form">
            <Form dataSet={fatherDS} columns={4}>
              <Lov name="organizationObj" noCache />
              <Lov name="costCenterObj" noCache />
              <Lov name="requestDepartmentObj" noCache />
              <TextField name="requestNum" />
              {moreDetail && <TextField name="requestReason" />}
              {moreDetail && <Lov name="warehouseObj" noCache />}
              {moreDetail && <Lov name="wmAreaObj" noCache />}
              {moreDetail && <TextField name="projestNum" />}
              {moreDetail && <Lov name="requestWorkerObj" noCache />}
              {moreDetail && <TextField name="outerRequestNum" />}
              {moreDetail && <TextField name="requestGroup" />}
            </Form>
            <Divider>
              <div onClick={() => setMoreDetail(!moreDetail)}>
                <span>
                  {moreDetail
                    ? `${intl.get('hzero.common.button.hidden').d('隐藏')}`
                    : `${intl.get('hzero.common.button.expand').d('展开')}`}
                  <Icon type={!moreDetail ? 'expand_more' : 'expand_less'} />
                </span>
              </div>
            </Divider>
          </Fragment>
        </Card>
        <Card
          key="lwms-issue-request-detail-line"
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        >
          {/* {为了防止闪屏和子组件序号更新，因此，为了让diff刷新，因此加了key} */}
          {lineNumStart ? (
            <MainLineTable dataSet={fatherDS.children.line} key="two" />
          ) : (
            <MainLineTable
              key="one"
              dataSet={fatherDS.children.line}
              isResetLineNum={lineNumStart}
            />
          )}
        </Card>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(CostCenterCreate);
