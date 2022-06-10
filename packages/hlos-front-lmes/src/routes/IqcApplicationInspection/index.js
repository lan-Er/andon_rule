/*
 * IQC报检
 * date: 2020-07-09
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import React, { Fragment, useMemo, useEffect, useState } from 'react';
import { DataSet, Lov, Row, Col, Form, NumberField, TextArea, TextField } from 'choerodon-ui/pro';

import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { queryLovData } from 'hlos-front/lib/services/api';
import logoImg from 'hlos-front/lib/assets/icons/logo.svg';
import exitImg from 'hlos-front/lib/assets/icons/exit.svg';
import resetImg from 'hlos-front/lib/assets/icons/reset.svg';
import workerImg from 'hlos-front/lib/assets/icons/processor.svg';
import unlockImg from 'hlos-front/lib/assets/icons/un-lock.svg';
import inspectImg from 'hlos-front/lib/assets/icons/inspect.svg';
import orgImg from 'hlos-front/lib/assets/icons/org.svg';
import defaultAvatarImg from 'hlos-front/lib/assets/img-default-avator.png';
import Time from './Time';
import codeConfig from '@/common/codeConfig';
import { iqcFormDS } from '../../stores/iqcApplicationInspectionDS';
import style from './index.module.less';

const { common } = codeConfig.code;

function IqcHead() {
  return (
    <div className={style['iqc-header']}>
      <img src={logoImg} alt="logo" />
      <span className={style['iqc-header-time']}>
        <Time />
      </span>
    </div>
  );
}

function IqcContent(props) {
  const { formDS } = props;
  // 减号
  const handleDecrease = () => {
    const sampleQty = formDS.current?.get('sampleQty');
    if (sampleQty) {
      formDS.current.set('sampleQty', sampleQty - 1);
    } else {
      return notification.warning({
        message: '样品数量必须大于0',
      });
    }
  };
  // 加号
  const handleIncrease = () => {
    const sampleQty = formDS.current?.get('sampleQty');
    if (sampleQty || sampleQty === 0) {
      formDS.current.set('sampleQty', sampleQty + 1);
    }
  };
  return (
    <div className={style['iqc-content']}>
      <Row>
        <Col span={14}>
          <Form dataSet={formDS} className={style['iqc-content-form']}>
            <Lov name="sourceObj" placeholder="请输入来源单据号" />
            <Lov name="sourceLineObj" placeholder="请输入来源单据行号" />
          </Form>
          <div className={style['iqc-content-num']}>
            <span className={style['iqc-content-num-label']}>样品数量</span>
            <div className={style['iqc-content-num-input']}>
              <span className={style['iqc-content-num-decrease']} onClick={handleDecrease}>
                -
              </span>
              <NumberField dataSet={formDS} name="sampleQty" />
              <span className={style['iqc-content-num-increase']} onClick={handleIncrease}>
                +
              </span>
            </div>
          </div>
          <div className={style['iqc-content-textarea']}>
            <span className={style['iqc-content-textarea-label']}>备注</span>
            <TextArea
              dataSet={formDS}
              name="remark"
              className={style['iqc-content-textarea-input']}
              placeholder="请输入备注"
            />
          </div>
        </Col>
        <Col offset={1} span={9} className={style['iqc-content-right']}>
          <Row>
            <Col span={18} className={style['iqc-content-right-one-left']}>
              <TextField dataSet={formDS} name="itemCode" />
            </Col>
            <Col span={6} className={style['iqc-content-right-one-right']}>
              <TextField dataSet={formDS} name="qtyuom" />
            </Col>
          </Row>
          <Row className={style['iqc-content-right-two']}>
            <Col span={12}>
              <TextField dataSet={formDS} name="description" />
            </Col>
            <Col span={12}>
              <TextField dataSet={formDS} name="lotNumber" />
            </Col>
          </Row>
          <Row className={style['iqc-content-right-three']}>
            <Col span={12}>
              <TextField dataSet={formDS} name="partyName" />
            </Col>
            <Col span={12}>
              <TextField dataSet={formDS} name="shipTicket" />
            </Col>
          </Row>
          <Row className={style['iqc-content-right-three']}>
            <Col span={24}>
              <TextField dataSet={formDS} name="inspectionGroupName" />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

function IqcFoot(props) {
  const { formDS } = props;
  // 退出
  const handleExit = () => {
    history.back();
  };
  // 重置
  const handleReset = () => {
    const workerObj = formDS.current?.get('workerObj');
    formDS.current.clear();
    formDS.current.set('workerObj', workerObj);
  };
  // 报检
  const handleSubmit = async () => {
    if (!formDS.current) {
      return notification.warning({
        message: '有必输项未输',
      });
    }
    const res = await formDS.submit();
    if (res && res.success) {
      const workerObj = formDS.current?.get('workerObj');
      formDS.current.clear();
      formDS.reset();
      formDS.current.set('workerObj', workerObj);
    } else if (formDS.current.get('sampleQty') === 0) {
      return notification.warning({
        message: '样品数量必须大于0',
      });
    } else if (
      !formDS.current.get('workerObj') ||
      !formDS.current.get('sourceObj') ||
      !formDS.current.get('sourceLineObj') ||
      !formDS.current.get('sampleQty')
    ) {
      return notification.warning({
        message: '有必输项未输',
      });
    }
  };
  return (
    <div className={style['iqc-foot']}>
      <div className={style['iqc-foot-item']} onClick={handleExit}>
        <img src={exitImg} alt="exit" />
        <span>退出</span>
      </div>
      <div className={style['iqc-foot-item']} onClick={handleReset}>
        <img src={resetImg} alt="reset" />
        <span>重置</span>
      </div>
      <div className={style['iqc-foot-item']} onClick={handleSubmit}>
        <img src={inspectImg} alt="inspect" />
        <span>报检</span>
      </div>
    </div>
  );
}

function IqcInspection() {
  const formDS = useMemo(() => new DataSet(iqcFormDS()), []);
  const [workerIcon, setWorkerIcon] = useState('');
  useEffect(() => {
    setDefaultDSValue();
  }, []);

  /**
 *设置默认查询条件
 */
  async function setDefaultDSValue() {
    const res = await queryLovData({
      lovCode: common.worker,
      defaultFlag: 'Y',
      showOrganization: 'Y',
    });
    if (getResponse(res)) {
      if (res && Array.isArray(res.content) && res.content.length) {
        formDS.current.set('workerObj', res.content[0]);
        formDS.current.set('declarerId', res.content[0].workerId);
        formDS.current.set('declarer', res.content[0].workerName);
        formDS.current.set('fileUrl', res.content[0].fileUrl);
        formDS.current.set('organizationId', res.content[0].organizationId);
        formDS.current.set('organizationCode', res.content[0].organizationCode);
        formDS.current.set('organizationName', res.content[0].organizationName);
        setWorkerIcon(res.content[0].fileUrl);
      }
    }
  }

  const selectWorker = () => {
    setWorkerIcon(formDS.current.get('fileUrl'));
  };

  return (
    <Fragment>
      <IqcHead />
      <div className={style['iqc-form']}>
        <img src={workerIcon || defaultAvatarImg} alt="user" />
        <div className={style['iqc-form-item-box']}>
          <div className={style['iqc-form-item']}>
            <img className={style['img-left']} src={workerImg} alt="worker" />
            <Lov placeholder="操作工" dataSet={formDS} name="workerObj" onChange={selectWorker} />
            <img className={style['img-right']} src={unlockImg} alt="lock" />
          </div>
          <div className={style['iqc-form-item']}>
            <img className={style['img-left']} src={orgImg} alt="organization" />
            <Lov placeholder="组织" dataSet={formDS} name="organizationName" />
            <img className={style['img-right']} src={unlockImg} alt="lock" />
          </div>
        </div>
      </div>
      <IqcContent formDS={formDS} />
      <IqcFoot formDS={formDS} />
    </Fragment>
  );
}

export default IqcInspection;
