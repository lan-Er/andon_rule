/*
 * @Description: 在库检验执行页面
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-06-09 15:45:03
 */

import React, { useState, useEffect } from 'react';
import { Modal, TextField, NumberField, Button } from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';

import uuidv4 from 'uuid/v4';
import notification from 'utils/notification';
import { closeTab } from 'utils/menuTab';
import {
  queryInspectionDoc,
  queryInspectionDocLines,
  getInspectionDocLot,
  queryExceptionAssigns,
  inspectionSingleDocSubmit,
  updateSampleQty,
} from '@/services/inStockInspectionService';
import Icons from 'components/Icons';
import { getAccessToken, getCurrentOrganizationId, getResponse } from 'utils/utils';
import { HZERO_FILE } from 'utils/config';
import { BUCKET_NAME_MES } from 'hlos-front/lib/utils/config';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import LeftContent from './leftContent.js';
import RightContent from './rightArea/index.js';
import Footer from './footer.js';

import style from './index.less';

let modal = null;
let sampleModal = null;
const directory = 'in-stock-inspection';
const defaultList = [
  {
    value: '合格',
    active: true,
    icon: <Icons type="triangle-green" size="12" color="#4CAF50" />,
    color: '#4CAF50',
    judgeResult: 'PASS',
  },
  {
    value: '不合格',
    active: false,
    icon: <Icons type="triangle-green" size="12" color="#F3511F" />,
    color: '#F3511F',
    judgeResult: 'FAILED',
  },
  {
    value: '让步接受',
    active: false,
    icon: <Icons type="triangle-green" size="12" color="#F9A825" />,
    color: '#F9A825',
    judgeResult: 'CONCESSION',
  },
];

function InStockExecute(props) {
  const [headerData, setHeaderData] = useState({});
  const [inspectionList, setInspectionList] = useState([]);
  const [detailsList, setDetailsList] = useState([]);
  const [exceptionList, setExceptionList] = useState([]);
  const [docQualifiedQty, setDocQualifiedQty] = useState(0);
  const [docUnqualifiedQty, setDocUnqualifiedQty] = useState(0);
  const [myLoading, setMyLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    await handleGetInspectionDocList();
    await handleQueryInspectionDocLines();
    handleGetInspectionDocLot();
    handleQueryExceptionAssigns();
  }

  // 根据检验组获取检验单列表
  async function handleGetInspectionDocList() {
    const { inspectionDocId, organizationId } = props.location.state;
    const resp = await queryInspectionDoc({
      organizationId,
      inspectionDocId,
    });
    if (getResponse(resp) && resp?.content && resp.content.length) {
      let docRule = {};
      if (resp.content[0].docProcessRule) {
        docRule = JSON.parse(resp.content[0].docProcessRule);
      }
      setHeaderData({ ...resp.content[0], docRule });
      sessionStorage.setItem(
        'inStock/changeSample',
        JSON.stringify({
          editSampleNumber: resp.content[0].sampleQty,
          qualifiedSampleQty: 0,
          unQualifiedSampleQty: 0,
        })
      );
    }
  }

  // 获取检验项
  async function handleQueryInspectionDocLines() {
    const { inspectionDocId } = props.location.state;
    const resp = await queryInspectionDocLines({
      inspectionDocId,
      page: -1,
    });
    let _inspectionList = inspectionList.slice();
    if (resp?.content && resp.content.length) {
      _inspectionList = resp.content.map((v) => {
        return { ...v, qcOkQty: headerData.batchQty ?? 0, qcNgQty: 0 };
      });
      setInspectionList(_inspectionList);
    }
  }

  // 获取明细页面数据
  async function handleGetInspectionDocLot() {
    const { inspectionDocId } = props.location.state;
    const resp = await getInspectionDocLot({
      inspectionDocId,
    });
    if (getResponse(resp) && resp.length) {
      const _list = resp.map((v) => ({
        ...v,
        qualifiedQty: 0,
        unqualifiedQty: 0,
        remark: '',
        judgeResult: 'PASS',
        show: false,
        curJudge: defaultList[0],
      }));
      setDetailsList(_list);
    }
  }

  // 获取不良原因数据
  async function handleQueryExceptionAssigns() {
    const { itemId } = props.location.state;
    const resp = await queryExceptionAssigns({
      itemId,
      sourceType: 'WQC',
    });
    if (getResponse(resp) && resp.length) {
      const list = resp.map((v) => ({ ...v, exceptionQty: 0, active: false, fileList: [] }));
      setExceptionList(list);
    }
  }

  // 检验项合格/不合格数量变化
  function handleQtyChange(value, record, type) {
    const _batchQty = headerData.batchQty ?? 0;
    let _inspectionList = inspectionList.slice();
    if (value <= _batchQty) {
      _inspectionList = _inspectionList.map((v) => {
        let _qcOkQty = v.qcOkQty;
        let _qcNgQty = v.qcNgQty;
        if (type === 'qualified') {
          _qcOkQty = parseFloat(value.toFixed(6));
          _qcNgQty = parseFloat((_batchQty - value).toFixed(6));
        } else {
          _qcNgQty = parseFloat(value.toFixed(6));
          _qcOkQty = parseFloat((_batchQty - value).toFixed(6));
        }
        if (v.inspectionDocLineId === record.inspectionDocLineId) {
          return {
            ...v,
            qcOkQty: _qcOkQty,
            qcNgQty: _qcNgQty,
          };
        }
        return { ...v };
      });
    } else {
      notification.warning({
        message: '不可大于报检数量',
      });
    }
    setInspectionList(_inspectionList);
  }

  // 批次合格/不合格数量变化
  function handleDetailsQtyChange(value, record, type) {
    const _batchQty = record.batchQty ?? 0;
    let _detailsList = detailsList.slice();
    if (value <= _batchQty) {
      _detailsList = _detailsList.map((v) => {
        let _qualifiedQty = v.qualifiedQty;
        let _unqualifiedQty = v.unqualifiedQty;
        if (type === 'qualified') {
          _qualifiedQty = parseFloat(value.toFixed(6));
          _unqualifiedQty = parseFloat((_batchQty - value).toFixed(6));
        } else {
          _unqualifiedQty = parseFloat(value.toFixed(6));
          _qualifiedQty = parseFloat((_batchQty - value).toFixed(6));
        }
        if (v.inspectionDocLotId === record.inspectionDocLotId) {
          return {
            ...v,
            qualifiedQty: _qualifiedQty,
            unqualifiedQty: _unqualifiedQty,
            curJudge: _unqualifiedQty === v.batchQty ? defaultList[1] : defaultList[0],
            judgeResult:
              _unqualifiedQty === v.batchQty
                ? defaultList[1].judgeResult
                : defaultList[0].judgeResult,
          };
        }
        return { ...v };
      });
    } else {
      notification.warning({
        message: '不可大于报检数量',
      });
    }
    setDetailsList(_detailsList);
    handleAutoDocQty(_detailsList);
  }

  // 根据明细行自动计算检验单数量
  function handleAutoDocQty(list) {
    const _detailsList = list || detailsList.slice();
    if (headerData.itemControlType !== 'QUANTITY') {
      const okQty = _detailsList.reduce((pre, cur) => {
        return parseFloat(cur.qualifiedQty) + pre;
      }, 0);
      const ngQty = _detailsList.reduce((pre, cur) => {
        return parseFloat(cur.unqualifiedQty) + pre;
      }, 0);
      setDocQualifiedQty(okQty);
      setDocUnqualifiedQty(ngQty);
    }
  }

  // 明细行判定结果展示收起
  function handleSwitchJudge(record) {
    let _detailsList = detailsList.slice();
    _detailsList = _detailsList.map((v) => {
      if (v.inspectionDocLotId === record.inspectionDocLotId) {
        return { ...v, show: !v.show };
      }
      return { ...v };
    });
    setDetailsList(_detailsList);
  }

  // 明细行判定
  function handleActiveMode(resultRec, record) {
    const _detailsList = detailsList.slice();
    const _index = _detailsList.findIndex(
      (v) => v.inspectionDocLotId === record.inspectionDocLotId
    );
    _detailsList[_index].curJudge = { ...resultRec };
    setDetailsList(_detailsList);
  }

  // 明细行备注弹框
  function handleDetailsRemark(record) {
    modal = Modal.open({
      key: 'lmes-in-stock-inspection-modal',
      title: '备注',
      className: style['lmes-in-stock-inspection-modal'],
      children: (
        <div className={style['details-remark']}>
          <div>
            <TextField
              value={record.remark}
              placeholder="请输入备注"
              onChange={(value) => handleChangeRemark(value, record)}
            />
          </div>
          <div className={style['button-text']} onClick={() => modal.close()}>
            <span>确认</span>
          </div>
        </div>
      ),
      footer: null,
      closable: true,
    });
  }

  // 明细行备注
  function handleChangeRemark(value, record) {
    let _detailsList = detailsList.slice();
    _detailsList = _detailsList.map((v) => {
      if (v.inspectionDocLotId === record.inspectionDocLotId) {
        return { ...v, remark: value };
      }
      return { ...v };
    });
    setDetailsList(_detailsList);
  }

  const propsData = (record) => {
    return {
      name: 'file',
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${HZERO_FILE}/v1/${getCurrentOrganizationId()}/files/multipart`,
      accept: ['image/*'],
      listType: 'picture-card',
      multiple: true,
      data: uploadData,
      onSuccess: (res) => handleImgSuccess(res, record),
      onPreview: handlePreview,
      onRemove: (res) => handleRemove(res, record),
    };
  };

  function uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MES,
      directory,
    };
  }

  // 上传成功
  function handleImgSuccess(res, record) {
    if (!res) {
      return;
    }
    let _exceptionList = exceptionList.slice();
    let _updateExpRec = {};
    const _targetIndex = _exceptionList.findIndex((v) => v.exceptionId === record.exceptionId);
    const _fileList = [];
    const fileObj = {
      uid: uuidv4(),
      name: res.split('@')[1],
      status: 'done',
      url: res,
    };
    _fileList.unshift(fileObj);
    _exceptionList = _exceptionList.map((v) => {
      if (v.exceptionId === record.exceptionId) {
        _updateExpRec = { ...v, fileList: [..._fileList, ...v.fileList] };
        return { ..._updateExpRec };
      }
      return { ...v };
    });
    setExceptionList(_exceptionList);
    handleUpdateModal(_exceptionList[_targetIndex]);
  }

  // 预览图片
  function handlePreview(file) {
    if (!file.url) return;
    window.open(file.url);
  }

  // 删除图片
  function handleRemove(file, record) {
    const _exceptionList = exceptionList.slice();

    const targetIndex = _exceptionList.findIndex((v) => v.exceptionId === record.exceptionId);
    _exceptionList[targetIndex].fileList = _exceptionList[targetIndex].fileList.filter(
      (v) => v.uid !== file.uid
    );
    setExceptionList(_exceptionList);
    handleUpdateModal(_exceptionList[targetIndex]);
  }

  function uploadButton() {
    return (
      <div>
        <Icons type="add-blue" size={28} color="#999" />
        <div>
          <span>
            <p>点击上传</p>
            <p>最多可上传9张</p>
          </span>
        </div>
      </div>
    );
  }

  // 打开上传图片modal
  function handlePicturesModal(record) {
    modal = Modal.open({
      key: 'in-stock-inspection-pictures-modal',
      title: '图片',
      className: style['in-stock-inspection-pictures-modal'],
      children: (
        <div className={style.wrapper}>
          <div className={style['img-list']}>
            <Upload {...propsData(record)} fileList={record.fileList}>
              {record && record.fileList && record.fileList.length >= 9 ? null : uploadButton()}
            </Upload>
          </div>
          <div className={style['footer-button']} onClick={() => modal.close()}>
            <span>确认</span>
          </div>
        </div>
      ),
      footer: null,
      movable: true,
      closable: true,
    });
  }

  // 更新上传图片modal
  function handleUpdateModal(record) {
    modal.update({
      children: (
        <div className={style.wrapper}>
          <div className={style['img-list']}>
            <Upload {...propsData(record)} fileList={record.fileList}>
              {record && record.fileList && record.fileList.length >= 9 ? null : uploadButton()}
            </Upload>
          </div>
          <div className={style['footer-button']} onClick={() => modal.close()}>
            <span>确认</span>
          </div>
        </div>
      ),
    });
  }

  // 异常数量更改
  function handleAbnormalChange(value, record) {
    let _exceptionList = exceptionList.slice();
    _exceptionList = _exceptionList.map((v) => {
      if (v.exceptionId === record.exceptionId) {
        return {
          ...v,
          exceptionQty: value,
        };
      }
      return { ...v };
    });
    setExceptionList(_exceptionList);
  }

  // 检验判数量判定
  function handleInspectionQuantity(value, type) {
    let _okQty = docQualifiedQty;
    let _ngQty = docUnqualifiedQty;
    const _batchQty = headerData.batchQty || 0;
    if (value < _batchQty) {
      if (type === 'qualified') {
        _okQty = parseFloat(value.toFixed(6));
        _ngQty = parseFloat((_batchQty - value).toFixed(6));
      } else {
        _ngQty = parseFloat(value.toFixed(6));
        _okQty = parseFloat((_batchQty - value).toFixed(6));
      }
    } else {
      notification.warning({
        message: '不可大于报检数量',
      });
    }
    if (myLoading) {
      setMyLoading(false);
    } else {
      setMyLoading(true);
    }
    setDocQualifiedQty(_okQty);
    setDocUnqualifiedQty(_ngQty);
  }

  // 退出当前页
  function handleClose(flag) {
    props.history.push({
      pathname: '/lmes/in-stock-inspection',
      state: {
        flag,
      },
    });
    closeTab('/pub/lmes/in-stock-inspection/execute');
  }

  // 判定
  async function handleSubmit(qcResult) {
    if (qcResult === 'FAILED' && docUnqualifiedQty <= 0) {
      notification.warning({
        message: '不合格数量必须大于0',
      });
      return;
    }

    // 校验
    if (exceptionList.some((v) => v.exceptionQty > docUnqualifiedQty)) {
      notification.warning({
        message: '异常数量不可大于不合格数量！',
      });
      return;
    }

    const { qualifiedSampleQty, unQualifiedSampleQty } =
      JSON.parse(sessionStorage.getItem('inStock/changeSample')) || {};

    const inspectionDocLineList = [];
    const judgeInspectionDocLotDtoList = detailsList.map((v) => ({
      ...v,
      qcResult: v.curJudge.judgeResult,
      qcOkQty: v.qualifiedQty,
      qcNgQty: v.unqualifiedQty,
      qcSecondOkQty: null,
      qcSecondNgQty: null,
      qcNgReasonId: null,
      qcNgReason: null,
      lotRemark: v.remark,
      lotPictures: null,
    }));
    const _exceptionList = exceptionList.map((v) => {
      const fileUrlList = [];
      v.fileList.forEach((ele) => {
        fileUrlList.push(ele.url);
      });
      return { ...v, fileUrlList };
    });
    const inspectionDocExceptionList = [
      {
        exceptionDocId: headerData.inspectionDocId,
        lineList: _exceptionList.map((v) => ({ ...v, exceptionPictures: v.fileUrlList.join('#') })),
      },
    ];
    const params = {
      inspectionDocId: headerData.inspectionDocId, // 检验单id 必传
      qcResult, // 判定结果 必传
      qcOkQty:
        docQualifiedQty === 0 && docUnqualifiedQty === 0 && qcResult === 'PASS'
          ? null
          : docQualifiedQty, // 合格数量
      qcNgQty:
        docQualifiedQty === 0 && docUnqualifiedQty === 0 && qcResult === 'PASS'
          ? null
          : docUnqualifiedQty, // 不合格数量
      qcSecondOkQty: null,
      qcSecondNgQty: null,
      qcNgReasonId: null,
      qcNgReason: null,
      inspectorId: props.location.state.workerId, // 判定员id
      inspector: props.location.state.workerCode, // 判定员
      judgedDate: moment().format(DEFAULT_DATETIME_FORMAT), // 判定时间
      remark: null,
      batchQty: headerData.batchQty || headerData.sampleQty,
      _token: headerData._token,
      sampleOkQty: qualifiedSampleQty,
      sampleNgQty: unQualifiedSampleQty,
      inspectionDocLineList,
      judgeInspectionDocLotDtoList,
      inspectionDocExceptionList,
    };
    const res = await inspectionSingleDocSubmit(params);
    if (getResponse(res)) {
      notification.success({
        message: '提交成功',
      });
      handleClose(true);
    }
  }

  // 样品更改
  async function handleChangeSampleNumber() {
    const { editSampleNumber } = JSON.parse(sessionStorage.getItem('inStock/changeSample')) || {};
    if (!editSampleNumber) {
      return;
    }
    if (isEdit) {
      setIsEdit(!isEdit);
      return;
    }
    const resp = await updateSampleQty({
      inspectionDocId: headerData.inspectionDocId,
      sampleQty: editSampleNumber,
    });
    if (getResponse(resp)) {
      notification.success({
        message: '提交成功',
      });
      setHeaderData({ ...headerData, sampleQty: resp.sampleQty });
      setIsEdit(!isEdit);
      sampleModal.close();
    }
  }

  function handleOpenSampleModal() {
    const { editSampleNumber, qualifiedSampleQty, unQualifiedSampleQty } =
      JSON.parse(sessionStorage.getItem('inStock/changeSample')) || {};
    sampleModal = Modal.open({
      key: 'in-stock-sample-modal',
      title: '数量',
      className: style['in-stock-sample-modal'],
      children: (
        <div className={style.wrapper}>
          <div className={style.header}>
            <div className={style.title}>抽样数量</div>
            <span className={style['sample-input']}>
              <NumberField
                value={editSampleNumber}
                min={0}
                placeholder="请输入数量"
                onChange={handleChangeSampleQty}
              />
            </span>
          </div>
          <div className={style.content}>
            <div>
              <div className={style['ds-ai-center']}>
                <span className={style['qualified-circle']} />
                <span className={style.title}>合格数量</span>
              </div>
              <NumberField
                value={qualifiedSampleQty}
                min={0}
                placeholder="请输入数量"
                onChange={handleQualifiedQty}
              />
            </div>
            <div>
              <div className={style['ds-ai-center']}>
                <span className={style['unqualified-circle']} />
                <span className={style.title}>不合格数量</span>
              </div>
              <NumberField
                value={unQualifiedSampleQty}
                min={0}
                placeholder="请输入数量"
                onChange={handleUnqualifiedQty}
              />
            </div>
          </div>
          <div className={style.footer}>
            <Button onClick={() => sampleModal.close()}>取消</Button>
            <Button className={style.confirm} color="primary" onClick={handleChangeSampleNumber}>
              确定
            </Button>
          </div>
        </div>
      ),
      footer: null,
      movable: true,
      closable: true,
    });
  }

  function handleChangeSampleQty(value) {
    sessionStorage.setItem(
      'inStock/changeSample',
      JSON.stringify({
        editSampleNumber: parseFloat(value.toFixed(6)),
        qualifiedSampleQty: 0,
        unQualifiedSampleQty: 0,
      })
    );
    handleUpdateSample(value, 0, 0);
  }

  function handleQualifiedQty(value) {
    const { editSampleNumber } = JSON.parse(sessionStorage.getItem('inStock/changeSample')) || {};
    if (value > editSampleNumber) {
      notification.warning({
        message: '不可大于抽样数量!',
      });
      sessionStorage.setItem(
        'inStock/changeSample',
        JSON.stringify({
          editSampleNumber: JSON.parse(sessionStorage.getItem('inStock/changeSample'))
            .editSampleNumber,
          qualifiedSampleQty: 0,
          unQualifiedSampleQty: 0,
        })
      );
      handleUpdateSample(editSampleNumber, 0, 0);
      return;
    }
    sessionStorage.setItem(
      'inStock/changeSample',
      JSON.stringify({
        editSampleNumber: JSON.parse(sessionStorage.getItem('inStock/changeSample'))
          .editSampleNumber,
        qualifiedSampleQty: parseFloat(value.toFixed(6)),
        unQualifiedSampleQty: parseFloat(
          (parseFloat(editSampleNumber) - parseFloat(value)).toFixed(6)
        ),
      })
    );
    handleUpdateSample(
      editSampleNumber,
      parseFloat(value.toFixed(6)),
      parseFloat((parseFloat(editSampleNumber) - parseFloat(value)).toFixed(6))
    );
  }

  function handleUnqualifiedQty(value) {
    const { editSampleNumber } = JSON.parse(sessionStorage.getItem('inStock/changeSample')) || {};
    if (value > editSampleNumber) {
      notification.warning({
        message: '不可大于抽样数量!',
      });
      sessionStorage.setItem(
        'inStock/changeSample',
        JSON.stringify({
          editSampleNumber: JSON.parse(sessionStorage.getItem('inStock/changeSample'))
            .editSampleNumber,
          qualifiedSampleQty: 0,
          unQualifiedSampleQty: 0,
        })
      );
      handleUpdateSample(editSampleNumber, 0, 0);
      return;
    }
    sessionStorage.setItem(
      'inStock/changeSample',
      JSON.stringify({
        editSampleNumber: JSON.parse(sessionStorage.getItem('inStock/changeSample'))
          .editSampleNumber,
        qualifiedSampleQty: parseFloat(
          (parseFloat(editSampleNumber) - parseFloat(value)).toFixed(6)
        ),
        unQualifiedSampleQty: parseFloat(value.toFixed(6)),
      })
    );
    handleUpdateSample(
      editSampleNumber,
      parseFloat((parseFloat(editSampleNumber) - parseFloat(value)).toFixed(6)),
      parseFloat(value.toFixed(6))
    );
  }

  function handleUpdateSample() {
    const { editSampleNumber, qualifiedSampleQty, unQualifiedSampleQty } =
      JSON.parse(sessionStorage.getItem('inStock/changeSample')) || {};
    sampleModal.update({
      children: (
        <div className={style.wrapper}>
          <div className={style.header}>
            <div className={style.title}>抽样数量</div>
            <span className={style['sample-input']}>
              <NumberField
                value={editSampleNumber}
                placeholder="请输入数量"
                onChange={handleChangeSampleQty}
              />
            </span>
          </div>
          <div className={style.content}>
            <div>
              <div className={style['ds-ai-center']}>
                <span className={style['qualified-circle']} />
                <span className={style.title}>合格数量</span>
              </div>
              <NumberField
                value={qualifiedSampleQty}
                min={0}
                placeholder="请输入数量"
                onChange={handleQualifiedQty}
              />
            </div>
            <div>
              <div className={style['ds-ai-center']}>
                <span className={style['unqualified-circle']} />
                <span className={style.title}>不合格数量</span>
              </div>
              <NumberField
                value={unQualifiedSampleQty}
                min={0}
                placeholder="请输入数量"
                onChange={handleUnqualifiedQty}
              />
            </div>
          </div>
          <div className={style.footer}>
            <Button onClick={() => sampleModal.close()}>取消</Button>
            <Button className={style.confirm} color="primary" onClick={handleChangeSampleNumber}>
              确定
            </Button>
          </div>
        </div>
      ),
    });
  }

  const leftProps = {
    ...headerData,
    onOpenSampleModal: handleOpenSampleModal,
  };

  const rightProps = {
    samplingType: headerData.samplingType,
    itemControlType: headerData.itemControlType,
    inspectionList,
    detailsList,
    defaultList,
    exceptionList,
    onAbnormalChange: handleAbnormalChange,
    onPicturesModal: handlePicturesModal,
    onSwitchJudge: handleSwitchJudge,
    onActiveMode: handleActiveMode,
    onDetailsRemark: handleDetailsRemark,
    onQualifiedChange: (value, record) => handleQtyChange(value, record, 'qualified'),
    onUnqualifiedChange: (value, record) => handleQtyChange(value, record, 'unqualified'),
    onDetailsQualifiedQty: (value, record) => handleDetailsQtyChange(value, record, 'qualified'),
    onDetailsUnqualifiedQty: (value, record) =>
      handleDetailsQtyChange(value, record, 'unqualified'),
  };

  const footerProps = {
    myLoading,
    docQualifiedQty,
    docUnqualifiedQty,
    itemControlType: headerData.itemControlType,
    onInspectionQuantity: handleInspectionQuantity,
    onClose: handleClose,
    onQualified: () => handleSubmit('PASS'),
    onUnqualified: () => handleSubmit('FAILED'),
  };

  return (
    <div className={style['in-stock-execute']}>
      <CommonHeader />
      <div className={style['in-stock-execute-content']}>
        <LeftContent {...leftProps} />
        <RightContent {...rightProps} />
      </div>
      <div>
        <Footer {...footerProps} />
      </div>
    </div>
  );
}

export default InStockExecute;
