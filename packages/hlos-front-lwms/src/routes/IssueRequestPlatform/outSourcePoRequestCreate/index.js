/*
 * @Description:委外订单领料单新增
 * @Author: tw
 * @Date: 2021-08-04 13:22:07
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
import { outSourceDetailDS } from '@/stores/issueRequestDS';
import { PrdNotLimitSave } from '@/services/issueRequestService';
import MainLineTable from './issueRequestLineTable';

const intlPrefix = 'lwms.issueRequestPlatform';
const commonPrefix = 'lwms.common';

const childRef = React.createRef();

function outSourcePoRequestCreate({ dispatch, location }) {
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
  const detailDS = useMemo(() => new DataSet(outSourceDetailDS()), []);
  // const leftDS = useMemo(() => new DataSet(outSourceDetailLeftLineDS()), []);
  // const leftDS = new DataSet(outSourceDetailLeftLineDS());
  const [isRoundDisabled, setIsRoundDisabled] = useState(true);

  useEffect(() => {
    const returnOrderObj = myState ? JSON.parse(myState) && JSON.parse(myState).returnOrderObj : {};
    let docNum = '';
    if (returnOrderObj && returnOrderObj.docProcessRule) {
      docNum = JSON.parse(returnOrderObj && returnOrderObj.docProcessRule).doc_num;
    }
    if (!docNum || docNum !== 'manual') {
      detailDS.fields.get('requestNum').set('disabled', true);
    } else {
      detailDS.fields.get('requestNum').set('required', true);
    }
  }, []);
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
        (item.secondUomId && !item.secondApplyQty)
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
    const _lineList = [];
    for (let i = 0; i < checkValues.length; i++) {
      _lineList.push({
        ...checkValues[i],
      });
    }
    const data = detailDS.current.toJSONData();
    const { poObj } = detailDS.toData()[0];
    _lineList.forEach((i) => {
      const _i = i;
      _i.sourceDocTypeId = documentTypeData.documentTypeId;
      _i.sourceDocTypeCode = documentTypeData.documentTypeCode;
      _i.sourceDocId = data?.poId;
      _i.sourceDocNum = data?.poNum;
    });
    const params = {
      ...data,
      requestTypeId: documentTypeData.documentTypeId,
      requestTypeCode: documentTypeData.documentTypeCode,
      wmRequestNum: data.requestNum,
      sourceDocTypeId: poObj.poTypeId,
      sourceDocTypeCode: poObj.poTypeCode,
      sourceDocId: poObj.poId,
      sourceDocNum: poObj.poNum,
      _status: 'create', // 用以区分是新增还是编辑 ds的提交就有  自己写的参数 就得加一个
      approvalRule: documentTypeData.approvalRule,
      approvalWorkflow: documentTypeData.approcalWorkflow,
      docProcessRuleId,
      docProcessRule,
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
    }
  };

  /**
   * @description: 领料单LOV变更 带出头部数据
   * @param {*} record 记录
   */
  function handlePoChange(record) {
    if (!isEmpty(record)) {
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
            <Form className="issue-request-platform-form" dataSet={detailDS} columns={4}>
              <Lov name="organizationObj" noCache />
              <Lov name="poObj" noCache onChange={handlePoChange} />
              <TextField name="requestNum" noCache />
              <Lov name="creatorObj" />
              <Lov name="wmMoveTypeObj" noCache />
              <DateTimePicker name="planDemandDate" />
              <Lov name="warehouseObj" noCache />
              <Lov name="wmAreaObj" noCache />
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
            queryContainer={document.getElementsByClassName('issue-request-platform-form')[0]}
            // leftDataSet={leftDS}
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
})(outSourcePoRequestCreate);
