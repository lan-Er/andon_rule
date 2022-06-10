/*
 * @Description: OQC检验执行页面
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-29 09:42:03
 */

import React, { useState, useEffect } from 'react';
import { Modal } from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';

import uuidv4 from 'uuid/v4';
import notification from 'utils/notification';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { closeTab } from 'utils/menuTab';
import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import { getAccessToken, getCurrentOrganizationId, getResponse } from 'utils/utils';
import { HZERO_FILE } from 'utils/config';
import { BUCKET_NAME_MES } from 'hlos-front/lib/utils/config';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';

import {
  getInspectionDocForGroup,
  inspectionDocBatchJudge,
  queryInspectionDocLines,
  queryExceptionAssigns,
  inspectionDocSubmit,
  queryInspectionDocExpPC,
} from '@/services/oqcInspectionService.js';

import noDataImg from 'hlos-front/lib/assets/no-data.png';
import Icons from 'components/Icons';
import LeftContent from './leftContent';
import RightContent from './rightArea/rightContent';
import SubHeader from './subHeader';
import Footer from './footer';
import style from './index.less';

const { common } = codeConfig.code;
const directory = 'oqc-inspection';
let modal = null;

/*
inspectionList的数据格式
inspectionList = [
  {
    ...,
    lineList: [], // 对应右侧的检验项
    exceptionList: [], // 对应的异常数组
    curLinePage: 1, // 检验项当前页
    totalLinePage: 1, // 检验项总页数
    beforeLineClick: false, // 检验项左跳转可否点击
    nextLineClick: false, // 检验项右跳转可否点击
    curExpPage: 1, // 异常当前页
    totalExpPage: 1, // 异常总页数
    beforeExpClick: false, // 不良原因左跳转可否点击
    nextExpClick: false, // 不良原因右跳转可否点击
    qcResultCur: '', // 该单是否判定, 如果判定成功, 则左侧展示状态变更以及右侧的数据变为只读模式
  },
]
*/

function OqcExecute(props) {
  const [defaultWorker, setDefaultWorker] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [leftCurPage, setLeftCurPage] = useState(1); // 左侧区域当前页
  const [leftTotalPage, setLeftTotalPage] = useState(1); // 左侧区域总页码
  const [leftBeforeClick, setLeftBeforeClick] = useState(false); // 左侧区域切换页码的左箭头是否可点击
  const [leftNextClick, setLeftNextClick] = useState(false); // 左侧区域切换页码的右箭头是否可点击
  const [inspectionList, setInspectionList] = useState([]); // 检验单列表
  const [rightAreaData, setRightAreaData] = useState({}); // 右侧区域展示的数据
  const [qualifiedQuantity, setQualifiedQuantity] = useState(0); // 检验单合格数量
  const [unqualifiedQuantity, setUnqualifiedQuantity] = useState(0); // 检验单不合格数量
  const [myLoading, setMyLoading] = useState(false);

  // const newRightAreaData = useMemo(() => {
  //   console.log('useMemo');
  //   return rightAreaData;
  // }, [rightAreaData]);

  useEffect(() => {
    const { state } = props.location;
    setHeaderData(state);
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(res) && res.content && res.content.length) {
        const { workerId, workerCode, workerName, fileUrl } = res.content[0];
        setDefaultWorker({
          workerId,
          workerCode,
          workerName,
          fileUrl,
        });
      }
    }
    defaultLovSetting();

    handleGetInspectionDocForGroup();
  }, []);

  // 根据检验组获取检验单列表
  async function handleGetInspectionDocForGroup() {
    const { inspectionDocGroup } = props.location.state;
    const resp = await getInspectionDocForGroup({
      inspectionDocGroup,
      page: -1,
    });
    if (getResponse(resp) && resp.content && resp.content.length) {
      const _list = resp.content.map((v) => ({
        ...v,
        checked: false,
        qcResultCur: v.qcResult || 'default',
        judged: !!v.qcResult,
        qcOkQty: v.qcOkQty,
        qcNgQty: v.qcNgQty,
      }));
      setInspectionList(_list);
      setLeftTotalPage(Math.ceil(resp.totalElements / 6));
    }
  }

  const propsData = (record, headerId) => {
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
      onSuccess: (res) => handleImgSuccess(res, record, headerId),
      onPreview: handlePreview,
      onRemove: (res) => handleRemove(res, record, headerId),
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
  function handleImgSuccess(res, record, headerId) {
    if (!res) {
      return;
    }
    const _inspectionList = inspectionList.slice();
    const _selectedRec = _inspectionList.find((v) => v.inspectionDocId === headerId);
    const _selectedIndex = _inspectionList.findIndex((v) => v.inspectionDocId === headerId);
    let _updateExpRec = {};
    const _fileList = [];
    const fileObj = {
      uid: uuidv4(),
      name: res.split('@')[1],
      status: 'done',
      url: res,
    };
    _fileList.unshift(fileObj);
    _selectedRec.exceptionList = _selectedRec.exceptionList.map((v) => {
      if (v.exceptionId === record.exceptionId) {
        _updateExpRec = { ...v, fileList: [..._fileList, ...v.fileList] };
        return { ..._updateExpRec };
      }
      return { ...v };
    });
    _inspectionList.splice(_selectedIndex, 1, _selectedRec);
    setInspectionList(_inspectionList);
    setRightAreaData(_inspectionList[_selectedIndex]);
    handleUpdateModal(_updateExpRec, headerId);
  }

  // 预览图片
  function handlePreview(file) {
    if (!file.url) return;
    window.open(file.url);
  }

  // 删除图片
  function handleRemove(file, record, headerId) {
    const _inspectionList = inspectionList.slice();
    const _selectedRec = _inspectionList.find((v) => v.inspectionDocId === headerId);
    const _selectedIndex = _inspectionList.findIndex((v) => v.inspectionDocId === headerId);

    const targetIndex = _selectedRec.exceptionList.findIndex(
      (v) => v.exceptionId === record.exceptionId
    );
    _selectedRec.exceptionList[targetIndex].fileList = _selectedRec.exceptionList[
      targetIndex
    ].fileList.filter((v) => v.uid !== file.uid);
    _inspectionList.splice(_selectedIndex, 1, _selectedRec);
    setInspectionList(_inspectionList);
    setRightAreaData(_inspectionList[_selectedIndex]);
    handleUpdateModal(_selectedRec.exceptionList[targetIndex], headerId);
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
  function handlePicturesModal(record, headerId) {
    if (rightAreaData.judged) {
      Modal.open({
        key: 'oqc-inspection-pictures-view-modal',
        title: '图片',
        className: style['oqc-inspection-pictures-view-modal'],
        children: (
          <div
            className={
              record && record.fileList && record.fileList.length
                ? style['view-images']
                : style['no-data']
            }
          >
            {record && record.fileList && record.fileList.length ? (
              record.fileList.map((imgRec) => (
                <img key={uuidv4()} src={imgRec} alt="" onClick={() => handlePreviewImg(imgRec)} />
              ))
            ) : (
              <>
                <img src={noDataImg} alt="" />
                <span>暂无数据</span>
              </>
            )}
          </div>
        ),
        footer: null,
        movable: true,
        closable: true,
      });
      return;
    }
    modal = Modal.open({
      key: 'oqc-inspection-pictures-modal',
      title: '图片',
      className: style['oqc-inspection-pictures-modal'],
      children: (
        <div className={style.wrapper}>
          <div className={style['img-list']}>
            <Upload {...propsData(record, headerId)} fileList={record.fileList}>
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

  function handlePreviewImg(imgUrl) {
    if (imgUrl) {
      window.open(imgUrl);
    }
  }

  // 更新上传图片modal
  function handleUpdateModal(record, headerId) {
    modal.update({
      children: (
        <div className={style.wrapper}>
          <div className={style['img-list']}>
            <Upload {...propsData(record, headerId)} fileList={record.fileList}>
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

  // 左侧区域选中行
  async function handleLineSelected(record) {
    let _inspectionList = inspectionList.slice();
    if (
      (record.lineList && record.lineList.length) ||
      (record.exceptionList && record.exceptionList.length)
    ) {
      _inspectionList = _inspectionList.map((v) => {
        if (v.inspectionDocId === record.inspectionDocId) {
          return { ...v, checked: true };
        }
        return { ...v, checked: false };
      });
      handleSwitchRightAreaArrowStatus(
        _inspectionList.findIndex((v) => v.inspectionDocId === record.inspectionDocId),
        _inspectionList
      );

      if (myLoading) {
        setMyLoading(false);
      } else {
        setMyLoading(true);
      }
      setQualifiedQuantity(0);
      setUnqualifiedQuantity(0);
      return;
    }
    if (inspectionList.some((v) => v.inspectionDocId === record.inspectionDocId)) {
      handleQueryRightContentData(record);
    }

    if (myLoading) {
      setMyLoading(false);
    } else {
      setMyLoading(true);
    }
    setQualifiedQuantity(0);
    setUnqualifiedQuantity(0);
  }

  // 右侧数据获取
  async function handleQueryRightContentData(data) {
    const { inspectionDocId, judged } = data;
    let respList = [];
    if (judged) {
      respList = await Promise.all([
        await queryInspectionDocLines({
          inspectionDocId,
          page: -1,
        }),
        await queryInspectionDocExpPC({
          inspectionDocId,
          page: -1,
        }),
      ]);
    } else {
      respList = await Promise.all([
        await queryInspectionDocLines({
          inspectionDocId,
          page: -1,
        }),
        await queryExceptionAssigns({
          itemId: data.itemId,
          sourceType: 'OQC',
        }),
      ]);
    }
    let _inspectionList = inspectionList.slice();
    if (respList && respList.length) {
      if (respList[0].content && respList[0].content.length) {
        const lineList = respList[0].content.map((v) => {
          return { ...v, qcOkQty: v.qcOkQty || 0, qcNgQty: v.qcNgQty || 0 };
        });
        _inspectionList = _inspectionList.map((rec) => {
          if (rec.inspectionDocId === inspectionDocId) {
            const _rec = {
              ...rec,
              checked: true,
              lineList,
              curLinePage: 1,
              totalLinePage: Math.ceil(respList[0].totalElements / 5),
            };
            return { ..._rec };
          }
          return { ...rec, checked: false };
        });
      }
      if (judged && respList[1] && respList[1].content && respList[1].content.length) {
        const list = respList[1].content.map((v) => ({
          ...v,
          exceptionQty: v.exceptionQty || 0,
          active: false,
          fileList: v.exceptionPictures ? v.exceptionPictures.split('#') : [],
        }));
        _inspectionList = _inspectionList.map((rec) => {
          if (rec.inspectionDocId === inspectionDocId) {
            const _rec = {
              ...rec,
              exceptionList: list,
              curExpPage: 1,
              totalExpPage: Math.ceil(respList[1].totalElements / 5),
            };
            return { ..._rec };
          }
          return { ...rec };
        });
      } else if (respList[1].length) {
        const list = respList[1].map((v) => ({
          ...v,
          exceptionQty: v.exceptionQty || 0,
          active: false,
          fileList: [],
        }));
        _inspectionList = _inspectionList.map((rec) => {
          if (rec.inspectionDocId === inspectionDocId) {
            const _rec = {
              ...rec,
              exceptionList: list,
              curExpPage: 1,
              totalExpPage: Math.ceil(respList[1].length / 5),
            };
            return { ..._rec };
          }
          return { ...rec };
        });
      }
      handleSwitchRightAreaArrowStatus(
        _inspectionList.findIndex((v) => v.inspectionDocId === inspectionDocId),
        _inspectionList
      );
    }
  }

  // 检验项合格数量
  function handleQualifiedChange(value, headerId, record) {
    const _inspectionList = inspectionList.slice();
    const _selectedIndex = _inspectionList.findIndex((v) => v.inspectionDocId === headerId);

    let _qcOkQty = parseFloat(value.toFixed(6));
    let _qcNgQty = parseFloat((_inspectionList[_selectedIndex].batchQty - value).toFixed(6));

    if (value > _inspectionList[_selectedIndex].batchQty) {
      notification.warning({
        message: '不可大于批次数量',
      });
      _qcOkQty = 0;
      _qcNgQty = 0;
    }

    const _lineList = _inspectionList[_selectedIndex].lineList.map((v) => {
      if (v.inspectionDocLineId === record.inspectionDocLineId) {
        return {
          ...v,
          qcOkQty: _qcOkQty,
          qcNgQty: _qcNgQty,
        };
      }
      return { ...v };
    });
    _inspectionList[_selectedIndex].lineList = _lineList;
    setRightAreaData(_inspectionList[_selectedIndex]);
    setInspectionList(_inspectionList);
  }

  // 检验项不合格数量
  function handleUnqualifiedChange(value, headerId, record) {
    const _inspectionList = inspectionList.slice();
    const _selectedIndex = _inspectionList.findIndex((v) => v.inspectionDocId === headerId);

    let _qcOkQty = parseFloat((_inspectionList[_selectedIndex].batchQty - value).toFixed(6));
    let _qcNgQty = parseFloat(value.toFixed(6));

    if (value > _inspectionList[_selectedIndex].batchQty) {
      notification.warning({
        message: '不可大于批次数量',
      });
      _qcOkQty = 0;
      _qcNgQty = 0;
    }

    const _lineList = _inspectionList[_selectedIndex].lineList.map((v) => {
      if (v.inspectionDocLineId === record.inspectionDocLineId) {
        return {
          ...v,
          qcOkQty: _qcOkQty,
          qcNgQty: _qcNgQty,
        };
      }
      return { ...v };
    });
    _inspectionList[_selectedIndex].lineList = _lineList;
    setRightAreaData(_inspectionList[_selectedIndex]);
    setInspectionList(_inspectionList);
  }

  // 左侧区域跳转页码
  function handleLeftNumCheck(value) {
    let _leftCurPage = 1;
    if (value < 1 || value > leftTotalPage) {
      _leftCurPage = leftCurPage;
    } else {
      _leftCurPage = value;
    }
    setLeftCurPage(_leftCurPage);
    handleSwitchLeftAreaArrowStatus(_leftCurPage);
  }

  // 左右箭头切换页码
  function handleChangeLeftCurPage(type) {
    let _leftCurPage = leftCurPage;
    if (type === 'before') {
      if (!leftBeforeClick) return;

      if (leftCurPage > 1) {
        _leftCurPage--;
      }
    } else {
      if (!leftNextClick) return;
      if (leftCurPage < leftTotalPage) {
        _leftCurPage++;
      }
    }
    handleSwitchLeftAreaArrowStatus(_leftCurPage);
  }

  // 左侧区域左右箭头是否可点击
  function handleSwitchLeftAreaArrowStatus(curPage) {
    setLeftCurPage(curPage);

    if (curPage === 1 && curPage < leftTotalPage) {
      setLeftBeforeClick(false);
      setLeftNextClick(true);
    } else if (curPage === leftTotalPage && curPage > 1) {
      setLeftBeforeClick(true);
      setLeftNextClick(false);
    } else if (curPage > 1 && curPage < leftTotalPage) {
      setLeftBeforeClick(true);
      setLeftNextClick(true);
    } else {
      setLeftBeforeClick(false);
      setLeftNextClick(false);
    }
  }

  // 右侧区域页码跳转
  function handleRightNumCheck(value, record) {
    const _selectedIndex = inspectionList.findIndex(
      (v) => v.inspectionDocId === record.inspectionDocId
    );
    if (value < 1 || value > inspectionList[_selectedIndex].totalLinePage) {
      inspectionList.splice(_selectedIndex, 1, {
        ...inspectionList[_selectedIndex],
        curLinePage: inspectionList[_selectedIndex].curLinePage,
      });
    } else {
      inspectionList.splice(_selectedIndex, 1, {
        ...inspectionList[_selectedIndex],
        curLinePage: value,
      });
    }

    // 不良原因
    if (value < 1 || value > inspectionList[_selectedIndex].totalExpPage) {
      inspectionList.splice(_selectedIndex, 1, {
        ...inspectionList[_selectedIndex],
        curExpPage: inspectionList[_selectedIndex].curExpPage,
      });
    } else {
      inspectionList.splice(_selectedIndex, 1, {
        ...inspectionList[_selectedIndex],
        curExpPage: value,
      });
    }
    handleSwitchRightAreaArrowStatus(_selectedIndex);
  }

  // 右侧区域左右箭头是否可点击
  function handleSwitchRightAreaArrowStatus(selectedIndex, list) {
    const _inspectionList = list || inspectionList.slice();
    const _selectedRec = _inspectionList[selectedIndex];
    const {
      curLinePage,
      totalLinePage,
      lineList,
      curExpPage,
      totalExpPage,
      exceptionList,
    } = _selectedRec;
    if (lineList && !lineList.length) {
      _selectedRec.beforeLineClick = false;
      _selectedRec.nextLineClick = false;
      return;
    }
    if (exceptionList && !exceptionList.length) {
      _selectedRec.beforeExpClick = false;
      _selectedRec.nextExpClick = false;
      return;
    }

    if (curLinePage === 1 && curLinePage < totalLinePage) {
      _selectedRec.beforeLineClick = false;
      _selectedRec.nextLineClick = true;
    } else if (curLinePage === totalLinePage && curLinePage > 1) {
      _selectedRec.beforeLineClick = true;
      _selectedRec.nextLineClick = false;
    } else if (curLinePage > 1 && curLinePage < totalLinePage) {
      _selectedRec.beforeLineClick = true;
      _selectedRec.nextLineClick = true;
    } else {
      _selectedRec.beforeLineClick = false;
      _selectedRec.nextLineClick = false;
    }

    if (curExpPage === 1 && curExpPage < totalExpPage) {
      _selectedRec.beforeExpClick = false;
      _selectedRec.nextExpClick = true;
    } else if (curExpPage === totalExpPage && curExpPage > 1) {
      _selectedRec.beforeExpClick = true;
      _selectedRec.nextExpClick = false;
    } else if (curExpPage > 1 && curExpPage < totalExpPage) {
      _selectedRec.beforeExpClick = true;
      _selectedRec.nextExpClick = true;
    } else {
      _selectedRec.beforeExpClick = false;
      _selectedRec.nextExpClick = false;
    }
    _inspectionList.splice(selectedIndex, 1, _selectedRec);
    setRightAreaData(_inspectionList[selectedIndex]);
    setInspectionList(_inspectionList);
  }

  // 左右箭头切换页码
  function handleChangeRightCurPage(type) {
    const _inspectionList = inspectionList.slice();
    const _selectedIndex = _inspectionList.findIndex(
      (v) => v.inspectionDocId === rightAreaData.inspectionDocId
    );
    const { beforeLineClick, nextLineClick, curLinePage, totalLinePage } = _inspectionList[
      _selectedIndex
    ];
    if (type === 'before') {
      if (!beforeLineClick) return;

      if (curLinePage > 1) {
        _inspectionList[_selectedIndex].curLinePage--;
      }
    } else {
      if (!nextLineClick) return;
      if (curLinePage < totalLinePage) {
        _inspectionList[_selectedIndex].curLinePage++;
      }
    }
    _inspectionList.splice(_selectedIndex, 1, _inspectionList[_selectedIndex]);
    handleSwitchRightAreaArrowStatus(_selectedIndex, _inspectionList);
  }

  // 不良样品数量更改
  function handleAbnormalChange(value, headerId, record) {
    const _selectedIndex = inspectionList.findIndex((v) => v.inspectionDocId === headerId);
    const _exceptionList = inspectionList[_selectedIndex].exceptionList.map((v) => {
      if (v.exceptionId === record.exceptionId) {
        return {
          ...v,
          exceptionQty: value,
        };
      }
      return { ...v };
    });
    inspectionList[_selectedIndex].exceptionList = _exceptionList;
    setRightAreaData(inspectionList[_selectedIndex]);
    setInspectionList(inspectionList);
  }

  // 退出当前页
  function handleClose() {
    history.back();
    closeTab('/pub/lmes/oqc-inspection/execute');
  }

  // 快速判定
  async function handleJudgeQuickly() {
    const _list = inspectionList.slice();
    let checkedArray = _list.filter((ele) => ele.checked);
    if (!checkedArray.length) {
      notification.warning({
        message: '请先选择要判断的检验单',
      });
      return;
    }
    if (checkedArray[0].judged) {
      notification.warning({
        message: '当前状态不可以判定',
      });
      return;
    }
    checkedArray = checkedArray.map((ele) => ({
      ...ele,
      qcResult: 'PASS',
      qcOkQty: ele.batchQty,
      qcNgQty: 0,
      qcSecondOkQty: null,
      qcSecondNgQty: null,
      qcNgReasonId: null,
      qcNgReason: null,
      inspectorId: defaultWorker.workerId,
      inspector: defaultWorker.workerCode,
      judgedDate: moment().format(DEFAULT_DATETIME_FORMAT),
      remark: null,
    }));
    if (checkedArray.length) {
      const res = await inspectionDocBatchJudge(checkedArray);
      if (getResponse(res)) {
        notification.success({
          message: '提交成功',
        });
        handleChangeDocStatus('PASS');
      }
    } else {
      notification.warning({
        message: '没有勾选项',
      });
    }
  }

  // 检验单数量
  // const handleInspectionQuantity = useCallback(
  //   (value, type) => {
  //     console.log('newRightAreaData', rightAreaData);
  //     console.log('inspectionList', inspectionList);
  //     if (!Object.keys(rightAreaData).length) {
  //       notification.warning({
  //         message: '请先选择检验单',
  //       });
  //       if (myLoading) {
  //         setMyLoading(false);
  //       } else {
  //         setMyLoading(true);
  //       }
  //       setQualifiedQuantity(0);
  //       setUnqualifiedQuantity(0);
  //       return;
  //     }
  //     if (value > rightAreaData.batchQty) {
  //       notification.warning({
  //         message: '不可大于批次数量',
  //       });
  //       if (myLoading) {
  //         setMyLoading(false);
  //       } else {
  //         setMyLoading(true);
  //       }
  //       setQualifiedQuantity(0);
  //       setUnqualifiedQuantity(0);
  //       return;
  //     }
  //     if (type === 'qualified') {
  //       setQualifiedQuantity(parseFloat(value.toFixed(6)));
  //       setUnqualifiedQuantity(parseFloat((rightAreaData.batchQty - value).toFixed(6)));
  //     } else if (type === 'unqualified') {
  //       setQualifiedQuantity(parseFloat((rightAreaData.batchQty - value).toFixed(6)));
  //       setUnqualifiedQuantity(parseFloat(value.toFixed(6)));
  //     }
  //   },
  //   [qualifiedQuantity, unqualifiedQuantity, myLoading]
  // );

  function handleInspectionQuantity(value, type) {
    if (!Object.keys(rightAreaData).length) {
      notification.warning({
        message: '请先选择检验单',
      });
      if (myLoading) {
        setMyLoading(false);
      } else {
        setMyLoading(true);
      }
      setQualifiedQuantity(0);
      setUnqualifiedQuantity(0);
      return;
    }
    if (value > rightAreaData.batchQty) {
      notification.warning({
        message: '不可大于批次数量',
      });
      if (myLoading) {
        setMyLoading(false);
      } else {
        setMyLoading(true);
      }
      setQualifiedQuantity(0);
      setUnqualifiedQuantity(0);
      return;
    }
    if (type === 'qualified') {
      setQualifiedQuantity(parseFloat(value.toFixed(6)));
      setUnqualifiedQuantity(parseFloat((rightAreaData.batchQty - value).toFixed(6)));
    } else if (type === 'unqualified') {
      setQualifiedQuantity(parseFloat((rightAreaData.batchQty - value).toFixed(6)));
      setUnqualifiedQuantity(parseFloat(value.toFixed(6)));
    }
  }

  // 提交
  async function handleSubmit(judgeResult) {
    if (rightAreaData.judged) {
      notification.warning({
        message: '当前状态不可以判定',
      });
      return;
    }

    if ((!qualifiedQuantity && !unqualifiedQuantity) || !Object.keys(rightAreaData).length) {
      notification.warning({
        message: '请先完成必输项',
      });
      return;
    }

    const _curInspectionDoc = inspectionList.find(
      (v) => v.inspectionDocId === rightAreaData.inspectionDocId
    );
    const inspectionDocLineList =
      _curInspectionDoc.lineList &&
      _curInspectionDoc.lineList.map((v) => {
        const commonRec = {
          inspectionDocLineId: v.inspectionDocLineId,
          sampleNumber: v.sampleNumber,
          resultType: v.resultType,
          inspectorId: headerData.workerId,
          inspector: headerData.workerCode,
          qcResult: 'PASS', // 全部默认合格
          qcOkQty: v.qcOkQty,
          qcNgQty: v.qcNgQty,
        };
        if (v.resultType === 'NUMBER') {
          return { ...commonRec, qcValue: 1 };
        }
        return { ...commonRec, qcValue: null };
      });

    const _expLineList =
      _curInspectionDoc.exceptionList &&
      _curInspectionDoc.exceptionList.map((v) => {
        const fileUrlList = [];
        v.fileList.forEach((ele) => {
          fileUrlList.push(ele.url);
        });
        return {
          exceptionId: v.exceptionId,
          exceptionCode: v.exceptionCode,
          exceptionQty: v.exceptionQty,
          exceptionPictures: fileUrlList.length ? fileUrlList.join('#') : '',
        };
      });

    const params = {
      inspectionDocId: rightAreaData.inspectionDocId, // 检验单id 必传
      qcResult: judgeResult, // 判定结果 必传
      qcOkQty: qualifiedQuantity, // 合格数量
      qcNgQty: unqualifiedQuantity, // 不合格数量
      qcSecondOkQty: null,
      qcSecondNgQty: null,
      qcNgReasonId: null,
      qcNgReason: null,
      inspectorId: headerData.workerId, // 判定员id
      inspector: headerData.workerCode, // 判定员
      judgedDate: moment().format(DEFAULT_DATETIME_FORMAT), // 判定时间
      remark: null,
      inspectionDocLineList,
      inspectionDocExceptionList: _expLineList
        ? [{ exceptionDocId: rightAreaData.inspectionDocId, lineList: _expLineList }]
        : [],
    };
    const res = await inspectionDocSubmit(params);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '提交成功',
      });
      handleChangeDocStatus(judgeResult);
      // this.handleClose();
    }
  }

  // 判定完成之后, 状态变更
  function handleChangeDocStatus(result) {
    let _inspectionList = inspectionList.slice();
    _inspectionList = _inspectionList.map((v) => {
      if (v.inspectionDocId === rightAreaData.inspectionDocId) {
        // setRightAreaData({...v, qcResultCur: result});
        return { ...v, qcResultCur: result, judged: true };
      }
      return { ...v };
    });
    setInspectionList(_inspectionList);
    setRightAreaData(
      _inspectionList.find((v) => v.inspectionDocId === rightAreaData.inspectionDocId)
    );
  }

  // 左侧内容区域数据通信
  const leftContentProps = {
    leftCurPage,
    leftTotalPage,
    leftBeforeClick,
    leftNextClick,
    inspectionList,
    toNumCheck: handleLeftNumCheck,
    onLineSelected: handleLineSelected,
    onChangePage: handleChangeLeftCurPage,
  };

  // 右侧内容区域数据通信
  const rightContentProps = {
    data: rightAreaData,
    inspectionList,
    onQualifiedChange: handleQualifiedChange,
    onUnqualifiedChange: handleUnqualifiedChange,
    // onSwitchChange: handleOnSwitchChange,
    onPicturesModal: handlePicturesModal,
    toNumCheck: handleRightNumCheck,
    toExpNumCheck: handleRightNumCheck,
    onChangePage: handleChangeRightCurPage,
    onAbnormalChange: handleAbnormalChange,
  };

  // 底部按钮数据通信
  const footerProps = {
    myLoading,
    qualifiedQuantity,
    unqualifiedQuantity,
    rightAreaData,
    onClose: handleClose,
    onJudgeQuickly: handleJudgeQuickly,
    onQualified: () => handleSubmit('PASS'),
    onUnqualified: () => handleSubmit('FAILED'),
    onInspectionQuantity: handleInspectionQuantity,
  };

  return (
    <div className={style['oqc-execute']}>
      <CommonHeader title="OQC检验执行" />
      <SubHeader headerData={headerData} defaultWorker={defaultWorker} />
      <div className={style['oqc-execute-content']}>
        <LeftContent {...leftContentProps} />
        <RightContent {...rightContentProps} />
      </div>
      <div>
        <Footer {...footerProps} />
      </div>
    </div>
  );
}

export default OqcExecute;
