/**
 * @Description: 需求工作台新建/详情页面 - 头表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-28 15:58:08
 * @LastEditors: yu.na
 */

import React, { useState, useEffect } from 'react';
import {
  Lov,
  Form,
  Select,
  TextField,
  NumberField,
  DataSet,
  Button,
  Modal,
  DatePicker,
} from 'choerodon-ui/pro';
import { Divider, Card, Icon, Tooltip } from 'choerodon-ui';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { userSetting } from 'hlos-front/lib/services/api';
import { DemandDetailDS } from '@/stores/demandOrderDS';
import { releaseDemand, cancelDemand, closeDemand } from '@/services/demandOrderService';
// import codeConfig from '@/common/codeConfig';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import LineDetail from './LineDetail';

// const { common } = codeConfig.code;

const preCode = 'lsop.demandOrder';

const DetailDS = () => new DataSet(DemandDetailDS());

const DemandOrderDetail = ({ match, history, location, dispatch }) => {
  const detailDS = useDataSet(DetailDS, DemandOrderDetail);
  // const { detailDS, match, history, location } = useContext(Store);
  const [showFlag, setShowFlag] = useState(false);
  const [createFlag, setCreateFlag] = useState(true);
  const [allDisabled, setAllDisabled] = useState(false);
  const [sopOuObj, setSopOuObj] = useState(null);
  const [demandTypeObj, setDemandTypeObj] = useState(null);
  const [dsDirty, setDSDirty] = useState(false);
  const [docProcessRule, setDocProcessRule] = useState(null);
  const [numDisabled, setNumDisabled] = useState(true);

  /**
   *设置默认查询条件
   */
  useEffect(() => {
    const { demandId } = match.params;
    const { state } = location;

    async function defaultLovSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        if (detailDS.current) {
          detailDS.current.set('demandTypeObj', {
            documentTypeId: res.content[0].demandTypeId,
            documentTypeCode: res.content[0].demandTypeCode,
            documentTypeName: res.content[0].demandTypeName,
            docProcessRule: res.content[0].docProcessRule || null,
          });
        }
        setDemandTypeObj({
          documentTypeId: res.content[0].demandTypeId,
          documentTypeCode: res.content[0].demandTypeCode,
          documentTypeName: res.content[0].demandTypeName,
          docProcessRule: res.content[0].docProcessRule || null,
        });
        detailDS.current.set('sopOuObj', {
          sopOuId: res.content[0].sopOuId,
          sopOuCode: res.content[0].sopOuCode,
          sopOuName: res.content[0].sopOuName,
        });
        setSopOuObj({
          sopOuId: res.content[0].sopOuId,
          sopOuCode: res.content[0].sopOuCode,
          sopOuName: res.content[0].sopOuName,
        });
      }
    }

    /**
     * 查询并校验状态
     */
    async function query(id) {
      detailDS.queryParameter = { demandId: id };
      await detailDS.query().then((res) => {
        if (getResponse(res) && res.content && res.content[0]) {
          checkDemandStatus(res);
          setDocProcessRule(res.content[0].docProcessRule);
          if (res.content[0].secondUomId) {
            detailDS.fields.get('secondDemandQty').set('disabled', false);
          } else {
            // 辅助单位数量初始不可编辑
            detailDS.fields.get('secondDemandQty').set('disabled', true);
          }
        }
      });
    }

    function updateDSDirty() {
      setDSDirty(detailDS.dirty);
    }

    function addDirtyDetect() {
      detailDS.addEventListener('update', updateDSDirty);
      detailDS.addEventListener('create', updateDSDirty);
      detailDS.addEventListener('remove', updateDSDirty);
    }

    if (demandId) {
      query(demandId);
      setCreateFlag(false);
      addDirtyDetect();
    } else {
      if (state && state.mode && state.mode === 'copy') {
        if (detailDS.current) {
          detailDS.remove(detailDS.current);
        }
        detailDS.create(state.data, 0);
        return;
      }
      if (detailDS && detailDS.current) {
        detailDS.remove(detailDS.current);
      }
      detailDS.create({}, 0);

      defaultLovSetting().then(addDirtyDetect);
      // 辅助单位数量初始不可编辑
      detailDS.fields.get('secondDemandQty').set('disabled', true);
    }

    return () => {
      detailDS.removeEventListener('update', updateDSDirty);
      detailDS.removeEventListener('create', updateDSDirty);
      detailDS.removeEventListener('remove', updateDSDirty);
    };
  }, [detailDS]);

  /*
   **刷新页面
   */
  async function refreshPage() {
    const { demandId } = match.params;
    detailDS.queryParameter = { demandId };
    await detailDS.query();
  }

  /*
   **检查当前需求订单状态
   */
  function checkDemandStatus(result) {
    if (result && result.content && result.content[0]) {
      if (
        result.content[0].demandStatus === 'CLOSED' ||
        result.content[0].demandStatus === 'CANCELLED'
      ) {
        setAllDisabled(true);
      }
    }
  }
  /**
   *新增
   */
  async function handleAdd() {
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.saveData`).d('是否保存当前数据？')}</p>,
      okText: '是',
      cancelText: '否',
      onOk: () => handleSave(true),
      onCancel: () => handleModalCancel(),
    });
  }

  function handleModalCancel() {
    const pathname = `/lsop/demand-order/create`;
    history.push(pathname);
  }

  /**
   *提交
   */
  function handleSubmit() {
    if (detailDS.current.data.demandStatus === 'NEW') {
      releaseDemand([detailDS.current.toJSONData()]).then(async (res) => {
        if (res && res.failed && res.message) {
          notification.error({
            message: res.message,
          });
        } else {
          notification.success();
          await detailDS.query().then((result) => {
            checkDemandStatus(result);
          });
        }
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.submitLimit`)
          .d('只有新建状态的需求订单才允许提交！'),
      });
    }
  }

  /**
   *复制
   */
  function handleCopy() {
    const cloneData = detailDS.current.toData();
    cloneData.demandNum = null;
    cloneData.demandId = null;
    history.push({
      pathname: '/lsop/demand-order/create',
      state: {
        mode: 'copy',
        data: {
          ...cloneData,
          demandStatus: 'NEW',
        },
      },
    });
    setCreateFlag(true);
    // detailDS.create(
    //   {
    //     ...cloneData,
    //     demandStatus: 'NEW',
    //   },
    //   0
    // );
  }

  /**
   *保存
   */
  async function handleSave(flag) {
    const validateValue = await detailDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await detailDS.submit();
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else if (res === undefined && !flag) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }
    if (flag) {
      const pathname = `/lsop/demand-order/create`;
      history.push(pathname);
      return;
    }
    if (!createFlag) {
      setDSDirty(false);
      refreshPage();
    } else if (res && res.content && res.content[0]) {
      setDSDirty(false);
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/lsop/demand-order/detail/${res.content[0].demandId}`;
      history.push(pathname);
    }
    dispatch({
      type: 'demandOrder/updateState',
      payload: {
        queryStatus: 'refresh',
      },
    });
  }

  /**
   *取消
   */
  function handleCancel() {
    if (
      detailDS.current.data.demandStatus === 'NEW' ||
      detailDS.current.data.demandStatus === 'RELEASED' ||
      detailDS.current.data.demandStatus === 'PLANNED'
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.cancelDemand`).d('是否取消需求订单？')}</p>,
        onOk: () =>
          cancelDemand([detailDS.current.toJSONData()]).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              await detailDS.query().then((result) => {
                checkDemandStatus(result);
              });
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.cancelLimit`)
          .d('只有新建、已提交、已计划状态的需求订单才允许取消！'),
      });
    }
  }

  /**
   *关闭
   */
  function handleClose() {
    if (
      detailDS.current.soLineStatus !== 'CANCELLED' &&
      detailDS.current.soLineStatus !== 'CLOSED'
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.closeDemand`).d('是否关闭需求订单？')}</p>,
        onOk: () =>
          closeDemand([detailDS.current.toJSONData()]).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              await detailDS.query().then((result) => {
                checkDemandStatus(result);
              });
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.closeLimit`)
          .d('已取消、已关闭状态的需求订单不允许关闭！'),
      });
    }
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   * 监听销售中心Lov字段变化
   * @param record 选中行信息
   */
  function handleSopChange(record) {
    handleReset();
    if (record) {
      setSopOuObj({
        sopOuId: record.sopOuId,
        sopOuCode: record.sopOuCode,
        sopOuName: record.sopOuName,
      });
      detailDS.current.set('sopOuObj', {
        sopOuId: record.sopOuId,
        sopOuCode: record.sopOuCode,
        sopOuName: record.sopOuName,
      });
    }
    if (demandTypeObj) {
      detailDS.current.set('demandTypeObj', demandTypeObj);
    }
  }

  /**
   * 监听订单类型Lov字段变化
   * @param record 选中行信息
   */
  function handleDemandTypeChange(record) {
    handleReset();
    if (record) {
      setDemandTypeObj({
        documentTypeId: record.documentTypeId,
        documentTypeCode: record.documentTypeCode,
        documentTypeName: record.documentTypeName,
        docProcessRule: record.docProcessRule,
      });
      detailDS.current.set('demandTypeObj', {
        documentTypeId: record.documentTypeId,
        documentTypeCode: record.documentTypeCode,
        documentTypeName: record.documentTypeName,
        docProcessRule: record.docProcessRule,
      });
      setDocProcessRule(record.docProcessRule);
      if (
        !isEmpty(record.docProcessRule) &&
        JSON.parse(record.docProcessRule).doc_num === 'manual'
      ) {
        setNumDisabled(false);
        detailDS.fields.get('demandNum').set('required', true);
      } else {
        setNumDisabled(true);
        detailDS.fields.get('demandNum').set('required', false);
      }
    } else {
      setNumDisabled(true);
      detailDS.fields.get('demandNum').set('required', false);
      setDocProcessRule(null);
    }
    if (sopOuObj) {
      detailDS.current.set('sopOuObj', sopOuObj);
    }
  }

  /**
   * 监听物料Lov字段变化
   * @param record 选中行信息
   */
  function handleItemChange(record) {
    handleReset();
    if (sopOuObj) {
      detailDS.current.set('sopOuObj', sopOuObj);
      if (record) {
        detailDS.current.set('itemObj', {
          itemId: record.itemId,
          itemCode: record.itemCode,
          description: record.description,
        });
        detailDS.current.set('uomObj', {
          uomId: record.uomId,
          uomCode: record.uom,
          uomName: record.uomName,
        });
      }
    }
    if (demandTypeObj) {
      detailDS.current.set('demandTypeObj', demandTypeObj);
    }
  }

  /**
   * 重置
   */
  function handleReset() {
    detailDS.current.reset();
  }

  return (
    <React.Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.demand`).d('需求')}
        backPath="/lsop/demand-order/list"
        isChange={dsDirty}
      >
        <Button
          icon="add"
          color={allDisabled || createFlag ? 'default' : 'primary'}
          onClick={handleAdd}
          disabled={allDisabled || createFlag}
        >
          {intl.get('hzero.common.button.add').d('新增')}
        </Button>
        <Button onClick={handleClose} disabled={allDisabled || createFlag}>
          {intl.get('hzero.common.button.close').d('关闭')}
        </Button>
        <Button onClick={handleCancel} disabled={allDisabled || createFlag}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button onClick={handleCopy} disabled={allDisabled || createFlag}>
          {intl.get('hzero.common.button.copy').d('复制')}
        </Button>
        <Button onClick={handleSubmit} disabled={allDisabled || createFlag}>
          {intl.get('hzero.common.button.submit').d('提交')}
        </Button>
        <Button onClick={() => handleSave()} disabled={allDisabled}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </Header>
      <Content>
        <Card key="demand-order-detail-header" bordered={false} className={DETAIL_CARD_CLASSNAME}>
          <Form dataSet={detailDS} columns={4}>
            <Lov
              name="sopOuObj"
              noCache
              disabled={!createFlag || allDisabled}
              onChange={handleSopChange}
            />
            <Lov
              name="demandTypeObj"
              noCache
              disabled={!createFlag || allDisabled}
              onChange={handleDemandTypeChange}
            />
            <TextField name="demandNum" disabled={numDisabled || !createFlag} />
            <Select name="demandStatus" disabled />
            <Lov
              name="itemObj"
              noCache
              disabled={!createFlag || allDisabled}
              onChange={handleItemChange}
            />
            <Lov name="uomObj" noCache disabled />
            <TextField name="itemDescription" colSpan={2} disabled />
            <NumberField name="demandQty" disabled={allDisabled} />
            <DatePicker name="demandDate" disabled={allDisabled} />
            <Lov name="secondUomObj" noCache disabled />
            <NumberField name="secondDemandQty" disabled={allDisabled} />
            <TextField name="remark" colSpan={2} disabled={allDisabled} />
          </Form>
          <Divider>
            <div>
              <span onClick={handleToggle} style={{ cursor: 'pointer' }}>
                {!showFlag
                  ? `${intl.get('hzero.common.button.expand').d('展开')}`
                  : `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`}
              </span>
              <Icon type={!showFlag ? 'expand_more' : 'expand_less'} />
            </div>
          </Divider>
          <div style={!showFlag ? { display: 'none' } : { display: 'block' }}>
            <Form dataSet={detailDS} columns={4}>
              <DatePicker name="promiseDate" disabled={allDisabled} />
              <DatePicker name="deadlineDate" disabled={allDisabled} />
              <TextField name="specification" disabled={!createFlag || allDisabled} />
              <Select name="demandRank" disabled={allDisabled} />
              <TextField name="projectNum" disabled={allDisabled} />
              <TextField name="wbsNum" disabled={allDisabled} />
              <TextField name="demandPeriod" disabled={allDisabled} />
              <NumberField name="priority" disabled={allDisabled} />
              <Lov name="sourceDocTypeObj" noCache disabled={!createFlag || allDisabled} />
              <Lov name="sourceDocObj" noCache disabled={!createFlag || allDisabled} />
              <Lov name="sourceDocLineObj" noCache disabled={!createFlag || allDisabled} />
              <TextField name="demandVersion" disabled />
              <NumberField name="externalId" disabled={!createFlag || allDisabled} />
              <TextField name="externalNum" disabled={!createFlag || allDisabled} />
            </Form>
            <div
              style={{
                display: 'inline-block',
                width: '25%',
                marginTop: '-50px',
                marginLeft: '50%',
                position: 'absolute',
                lineHeight: '50px',
                paddingLeft: 15,
              }}
            >
              <Tooltip placement="top" title={docProcessRule}>
                <a style={{ marginLeft: '15%' }}>
                  {intl.get(`${preCode}.model.docProcessRule`).d('单据处理规则')}
                </a>
              </Tooltip>
            </div>
          </div>
        </Card>
        <Card
          key="demand-order-detail-line"
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        >
          <LineDetail tableDS={detailDS} isCreate={createFlag} allDisabled={allDisabled} />
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default connect(({ demandOrder }) => ({
  demandOrder,
}))(DemandOrderDetail);
