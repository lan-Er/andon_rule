/*
 * @Description:领料单新增
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-12-07 10:22:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-10 11:15:43
 */
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { routerRedux } from 'dva/router';
import { isEmpty } from 'lodash';
import { Lov, Form, TextField, Button, DateTimePicker, DataSet, Tooltip } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { userSetting } from 'hlos-front/lib/services/api';
import { issueRequestDetailDS } from '@/stores/issueRequestDS';
import { PrdNotLimitSave, getItemWmRule } from '@/services/issueRequestService';
import MainLineTable from './issueRequestLineTable';

const intlPrefix = 'lwms.issueRequestPlatform';
const commonPrefix = 'lwms.common';

const childRef = React.createRef();

function PrdNotLimitCreate({ dispatch, location }) {
  const myState = sessionStorage.getItem('initMyState');
  const myRuturnOrderObj = myState ? JSON.parse(myState) && JSON.parse(myState).returnOrderObj : {};
  if ((!location || !location.state || !location.state.returnOrderObj) && !myRuturnOrderObj) {
    const pathname = `/lwms/issue-request-platform`;
    dispatch(
      routerRedux.push({
        pathname,
      })
    );
    return false;
  }
  const { docProcessRuleId, docProcessRule } = myRuturnOrderObj || location.state.returnOrderObj;
  const [documentTypeData, setDocumentTypeData] = useState({});
  const [checkValues, setCheckValues] = useState([]);
  const detailDS = useMemo(() => new DataSet(issueRequestDetailDS()), []);
  const [isRoundDisabled, setIsRoundDisabled] = useState(true);
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
  }, []);

  function lineValidate() {
    let validateFlag = true;
    checkValues.forEach((item) => {
      if (
        !item.itemId ||
        !item.uomId ||
        !item.applyQty ||
        !item.warehouseId ||
        (item.secondUomId && !item.secondApplyQty) ||
        ((documentTypeData?.documentTypeCode === 'PLANNED_MO_ISSUE_REQUEST' ||
          documentTypeData?.documentTypeCode === 'PLANNED_REQUEST') &&
          item.applyQty > item.claimedQty)
      ) {
        validateFlag = false;
      }
    });
    return validateFlag;
  }

  /**
   * @description: 保存按钮
   */
  const handleSave = async () => {
    if (!checkValues.length) {
      notification.warning({
        message: '未选中领料单行',
      });
      return;
    }
    const validateValue = await detailDS.validate(false, true);
    const lineValidateResult = await lineValidate();
    if (!validateValue || !lineValidateResult) {
      notification.warning({
        message: '数据校验不通过',
      });
      return;
    }
    if (!validateValue) {
      notification.warning({
        message: '数据校验不通过',
      });
      return;
    }
    // const { requestLineList } = detailDS.children;
    const _lineList = [];
    // const recordArr = requestLineList.selected;
    for (let i = 0; i < checkValues.length; i++) {
      const params = [
        {
          organizationId: detailDS.current.get('organizationId'),
          itemId: checkValues[i].itemId,
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
        ...checkValues[i],
        pickRuleId,
        pickRule,
        reservationRuleId,
        reservationRule,
        fifoRuleId,
        fifoRule,
      });
    }
    const data = detailDS.current.toJSONData();
    const { moNumObj } = detailDS.toData()[0];
    _lineList.forEach((i) => {
      const _i = i;
      _i.sourceDocNum = data?.moNum;
      _i.sourceDocId = data?.moId;
      _i.sourceDocTypeCode = data?.moTypeCode;
      // sourceDocTypeCode
    });
    const params = {
      ...data,
      sourceDocTypeId: moNumObj.moTypeId,
      sourceDocTypeCode: moNumObj.moTypeCode,
      sourceDocId: moNumObj.moId,
      sourceDocNum: moNumObj.moNum,
      _status: 'create', // 用以区分是新增还是编辑 ds的提交就有  自己写的参数 就得加一个
      approvalRule: documentTypeData.approvalRule,
      approvalWorkflow: documentTypeData.approcalWorkflow,
      docProcessRuleId,
      docProcessRule,
      requestTypeId: documentTypeData.documentTypeId,
      requestTypeCode: documentTypeData.documentTypeCode,
      requestLineList: _lineList,
    };
    const res = await PrdNotLimitSave(params);
    if (res && res.failed) {
      notification.error({
        message: res.message || '保存失败',
      });
    } else {
      notification.success({
        message: res.message || '保存成功',
      });
      sessionStorage.setItem('IssueRequestPlatformProNotLimit', true);
      // 成功后重置
      childRef.current.deletValue();
      const organizationObj = detailDS.current.get('organizationObj');
      const creatorObj = detailDS.current.get('creatorObj');
      detailDS.reset();
      if (detailDS.current) {
        detailDS.current.set('organizationObj', organizationObj);
        detailDS.current.set('creatorObj', creatorObj);
      }
      // detailDS.query();
      // const pathname = `/lwms/issue-request-platform/list`;
      // dispatch(
      //   routerRedux.push({
      //     pathname,
      //   })
      // );
    }
  };

  /**
   * @description: 工单LOV变更 带出头部数据
   * @param {*} record 记录
   */
  function handleMoChange(record) {
    if (!isEmpty(record)) {
      // 装配件
      detailDS.current.set('assemblyItemObj', {
        itemId: record.itemId,
        itemCode: record.itemCode,
        description: record.description,
        item: record.item,
      });
      // 需求时间
      detailDS.current.set('planDemandDate', record.planStartDate);
      // 生产线
      detailDS.current.set('prodLineObj', {
        prodLineId: record.prodLineId,
        prodLineCode: record.prodLineCode,
        resourceName: record.prodLineName,
      });
      // 工位
      detailDS.current.set('workcellObj', {
        workcellId: record.workcellId,
        workcellCode: record.workcellCode,
        workcellName: record.workcellName,
      });
      // 清除行数据
      childRef.current.deletValue();
    }
  }
  /**
   * @description: 返回退出新增界面
   */
  const handleBack = () => {
    detailDS.remove(detailDS.current);
  };

  const onChangeCheckValues = (data) => {
    setCheckValues(data);
  };

  const onLineTableQuery = (data) => {
    setIsRoundDisabled(data.length === 0);
  };

  // 圆整
  const handleRound = () => {
    childRef.current.handleRound();
    // let lineData = childRef.current.lineTableData
  };

  return (
    <Fragment>
      <Header
        title={documentTypeData?.documentTypeName}
        backPath="/lwms/issue-request-platform/list"
        onBack={handleBack}
      >
        <Button icon="save" onClick={handleSave}>
          {intl.get('hzero.common.btn.save').d('保存')}
        </Button>
        <Button disabled={isRoundDisabled} onClick={handleRound}>
          {intl.get('hzero.common.btn.round').d('圆整')}
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
              <Lov name="moNumObj" noCache onChange={handleMoChange} />
              <Lov name="assemblyItemObj" noCache disabled />
              <Lov name="wmMoveTypeObj" noCache />
              <DateTimePicker name="planDemandDate" disabled />
              <Lov name="creatorObj" />
              <Lov name="prodLineObj" noCache disabled />
              <Lov name="workcellObj" noCache disabled />
              <Lov name="warehouseObj" noCache />
              <Lov name="wmAreaObj" noCache />
              {documentTypeData.documentTypeCode === 'COMMON_REQUEST' && (
                <Lov name="toWarehouseObj" noCache />
              )}
              {documentTypeData.documentTypeCode === 'COMMON_REQUEST' && (
                <Lov name="toWmAreaObj" noCache />
              )}
              <TextField name="remark" colSpan={2} />
            </Form>
            {documentTypeData.documentTypeCode !== 'COMMON_REQUEST' && (
              <Tooltip placement="top" title={documentTypeData?.docProcessRule}>
                <a style={{ width: '25%', padding: '0.1rem 100px', display: 'inline-block' }}>
                  {intl.get(`${intlPrefix}.model.docProcessRule`).d('单据处理规则')}
                </a>
              </Tooltip>
            )}
          </Fragment>
        </Card>
        <Card
          key="lwms-issue-request-detail-line"
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        >
          <MainLineTable
            cRef={childRef}
            pageContainer={document.getElementsByClassName('lwms-issue-request-content')[0]}
            queryContainer={document.getElementsByClassName(`${DETAIL_CARD_CLASSNAME}`)[0]}
            dataSet={detailDS.children.requestLineList}
            type={documentTypeData?.documentTypeCode}
            onChangeCheckValues={onChangeCheckValues}
            onLineTableQuery={onLineTableQuery}
          />
        </Card>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(PrdNotLimitCreate);
