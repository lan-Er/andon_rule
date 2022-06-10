/**
 * @Description: 不合格品处理--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-10-16 10:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Lov,
  DatePicker,
  DataSet,
  NumberField,
  TextField,
  Spin,
  Select,
  Modal,
  Col,
} from 'choerodon-ui/pro';
import { Icon, Checkbox, Popover, Upload } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { closeTab } from 'utils/menuTab';
import { getResponse, getAccessToken, getCurrentOrganizationId } from 'utils/utils';
import { HZERO_FILE } from 'utils/config';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import Icons from 'components/Icons';
import {
  nonconformingProcessApi,
  getInspectionDocLot,
} from '@/services/nonconformingProcessingService';
import uuidv4 from 'uuid/v4';
import { queryLovData } from 'hlos-front/lib/services/api';
import { BUCKET_NAME_MES } from 'hlos-front/lib/utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { HeaderDS, ProcessorDS } from '@/stores/nonconformingProcessiongDS';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import processorIcon from 'hlos-front/lib/assets/icons/processor.svg';
import documentTypeIcon from 'hlos-front/lib/assets/icons/document-type.svg';
import documentIcon from 'hlos-front/lib/assets/icons/document.svg';
// import itemIcon from 'hlos-front/lib/assets/icons/item.svg';
// import inspectorIcon from 'hlos-front/lib/assets/icons/inspector.svg';
// import dateIcon from 'hlos-front/lib/assets/icons/date.svg';
import lockIcon from 'hlos-front/lib/assets/icons/lock.svg';
import unLockIcon from 'hlos-front/lib/assets/icons/un-lock.svg';
// import exitImg from 'hlos-front/lib/assets/icons/exit.svg';
// import checkImg from 'hlos-front/lib/assets/icons/check.svg';
// import resetImg from 'hlos-front/lib/assets/icons/reset.svg';
// import submitImg from 'hlos-front/lib/assets/icons/submit.svg';
import LotModal from './LotModal';
import styles from './index.less';

import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const commonCode = 'lmes.common';
const modalKey = Modal.key();
let modal = null;
let picturesModal = null;
let lotPicturesModal = null;
const directory = 'nonconforming-processing';

const headerDS = () => new DataSet(HeaderDS());
const processorDS = () => new DataSet(ProcessorDS());

const NonconformingProcessiong = ({ history, dispatch, inspectDocList }) => {
  const ds = useDataSet(headerDS, NonconformingProcessiong);
  const workerDS = useDataSet(processorDS);

  // const [arr, setArr] = useState([
  //   {
  //     key: 'scrappedQty',
  //     title: '报废',
  //     color: '#D6D6D6',
  //   },
  //   {
  //     key: 'reworkQty',
  //     title: '返修',
  //     color: '#F7B502',
  //   },
  //   {
  //     key: 'returnedQty',
  //     title: '退回',
  //     color: '#EB9A79',
  //   },
  //   {
  //     key: 'concessionQty',
  //     title: '让步接受',
  //     color: '#C079DF',
  //   },
  // ]);
  // const [list, setList] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  // const [isExpand, setExpand] = useState(false);
  const [processorLock, changeProcessorLock] = useState(false);
  const [documentTypeLock, changeDocumentTypeLock] = useState(false);
  const [documentLock, changeDocumentLock] = useState(false);
  const [itemLock, changeItemLock] = useState(false);
  const [avator, setAvator] = useState(null);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    async function queryDefaultSetting() {
      const res = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(res) && res.content && res.content[0]) {
        workerDS.current.set('processorObj', res.content[0]);
        setAvator(res.content[0].fileUrl);
      }
      const orgRes = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (getResponse(orgRes) && orgRes.content && orgRes.content[0]) {
        ds.queryDataSet.current.set('organizationId', orgRes.content[0].organizationId);
      }
    }
    queryDefaultSetting();
    changeProcessorLock(
      JSON.parse(window.localStorage.getItem('nonconfirmingProcessing/processorLock'))
    );
  }, [workerDS, ds]);

  useEffect(() => {
    return () => {
      if (ds.current) {
        ds.current.reset();
      }
      ds.queryDataSet.current.reset();
      workerDS.current.reset();
      dispatch({
        type: 'nonconformingProcessing/updateState',
        payload: {
          inspectDocList: [],
          lotList: [],
        },
      });
    };
  }, []);

  const suffixRender = (flag, type) => {
    return (
      <Fragment>
        <Icon type="search" />
        <img src={flag ? lockIcon : unLockIcon} alt="" onClick={(e) => handleLockClick(type, e)} />
      </Fragment>
    );
  };

  const handleLockClick = (type, e) => {
    if (e) e.stopPropagation();
    if (type === 'processor') {
      window.localStorage.setItem('nonconfirmingProcessing/processorLock', !processorLock);
      changeProcessorLock(!processorLock);
    } else if (type === 'documentType') {
      changeDocumentTypeLock(!documentTypeLock);
    } else if (type === 'document') {
      changeDocumentLock(!documentLock);
    } else if (type === 'item') {
      changeItemLock(!itemLock);
    }
  };

  const handleExit = () => {
    Modal.confirm({
      key: Modal.key(),
      children: (
        <span>
          {intl
            .get(`${commonCode}.view.message.exit.no.saving`)
            .d('退出后不保存当前编辑，确认退出？')}
        </span>
      ),
    }).then((button) => {
      if (button === 'ok') {
        history.push('/workplace');
        closeTab('/pub/lmes/nonconforming-processing');
      }
    });
  };

  const handleCheckItem = (rec, e) => {
    const _list = inspectDocList.slice();
    const idx = _list.findIndex((i) => i.inspectionDocId === rec.inspectionDocId);
    _list.splice(idx, 1, {
      ...rec,
      checked: e.target.checked,
    });
    dispatch({
      type: 'nonconformingProcessing/updateState',
      payload: {
        inspectDocList: _list,
      },
    });
    setAllChecked(_list.every((i) => i.checked));
  };

  const handleCheckAll = () => {
    const _list = inspectDocList.slice();
    _list.forEach((el) => {
      const _el = el;
      _el.checked = !allChecked;
    });
    setAllChecked(!allChecked);
  };

  const handleQueryReset = () => {
    const { documentTypeObj, documentObj, itemObj, organizationId } = ds.queryDataSet.current.data;
    const { processorObj } = workerDS.current.data;
    ds.queryDataSet.current.reset();
    ds.queryDataSet.current.set('organizationId', organizationId);
    if (processorLock) {
      ds.queryDataSet.current.set('processorObj', processorObj);
    } else {
      workerDS.current.set('processorObj', null);
    }
    if (documentTypeLock) {
      ds.queryDataSet.current.set('documentTypeObj', documentTypeObj);
    }
    if (documentLock) {
      ds.queryDataSet.current.set('documentObj', documentObj);
    }
    if (itemLock) {
      ds.queryDataSet.current.set('itemObj', itemObj);
    }
  };

  const handleReset = () => {
    handleQueryReset();
    dispatch({
      type: 'nonconformingProcessing/updateState',
      payload: {
        inspectDocList: [],
      },
    });
  };

  const handleSubmit = async () => {
    const checkedList = inspectDocList.filter((i) => i.checked);
    if (!checkedList.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const submitData = [];
    const copySubmitData = [];
    checkedList.forEach((i) => {
      submitData.push({
        ...i,
        processorId: workerDS.current.get('processorId'),
        processor: workerDS.current.get('processor'),
        processedDate: moment().format(DEFAULT_DATETIME_FORMAT),
      });
    });
    const workerValidate = await workerDS.validate(false, false);
    if (!workerValidate) return;
    // const arr1 = ['TASK', 'MO'];
    // const arr2 = ['WM_DELIVERY', 'PO'];
    // if (arr1.includes(ds.queryDataSet.current.get('documentTypeObj').documentClass)) {
    if (
      !submitData.every(
        (i) =>
          (i.scrappedQty || 0) +
            (i.returnedQty || 0) +
            (i.reworkQty || 0) +
            (i.concessionQty || 0) ===
          (i.qcNgQty || 0)
      )
    ) {
      notification.warning({
        message: '处理数量必须等于不合格数量!',
      });
      return;
    }
    // } else if (arr2.includes(ds.queryDataSet.current.get('documentTypeObj').documentClass)) {
    //   if (
    //     !submitData.every((i) => (i.returnedQty || 0) + (i.concessionQty || 0) === (i.qcNgQty || 0))
    //   ) {
    //     notification.warning({
    //       message: '退回数量+让步接受不等于不合格数量',
    //     });
    //     return;
    //   }
    // }
    submitData.forEach((i) => {
      let processPictures = '';
      if (i.processPictures) {
        i.processPictures.forEach((item) => {
          processPictures = processPictures === '' ? item.url : `${processPictures}#${item.url}`;
        });
      }
      if (i.lineDTOList) {
        i.lineDTOList.forEach((item) => {
          let processLotPictures = '';
          item.processLotPictures.forEach((data) => {
            processLotPictures =
              processLotPictures === '' ? data.url : `${processLotPictures}#${data.url}`;
          });
          const _item = item;
          _item.processLotPictures = processLotPictures;
        });
      }
      copySubmitData.push({
        ...i,
        processPictures,
        processorId: workerDS.current.get('processorId'),
        processor: workerDS.current.get('processor'),
        processedDate: moment().format(DEFAULT_DATETIME_FORMAT),
      });
    });
    const res = await nonconformingProcessApi(copySubmitData);
    if (getResponse(res)) {
      notification.success();
      setListLoading(true);
      const queryRes = await ds.query();
      if (getResponse(queryRes) && queryRes.content) {
        queryRes.content.forEach((i) => {
          const _i = i;
          _i.processPictures = [];
          _i.inputArr = judgedDocumentClass(_i);
        });
        dispatch({
          type: 'nonconformingProcessing/updateState',
          payload: {
            inspectDocList: queryRes.content,
          },
        });
      }
      setListLoading(false);
    }
  };

  // const handleExpand = () => {
  //   setExpand(!isExpand);
  // };

  const judgedDocumentClass = (rec) => {
    const _arr = [
      {
        key: 'scrappedQty',
        title: '报废',
        color: '#D6D6D6',
      },
      {
        key: 'reworkQty',
        title: '返修',
        color: '#F7B502',
      },
      {
        key: 'returnedQty',
        title: '退回',
        color: '#EB9A79',
      },
      {
        key: 'concessionQty',
        title: '让步接受',
        color: '#C079DF',
      },
    ];
    // const typeClass = rec.documentClass || rec.sourceDocClass;
    if (rec.sourceDocClass === 'TASK' || rec.sourceDocClass === 'MO') {
      const idx = _arr.findIndex((i) => i.key === 'returnedQty');
      _arr.splice(idx, 1);
      ds.queryDataSet.fields.get('documentObj').set('required', false);
    } else if (rec.sourceDocClass === 'WM_DELIVERY' || rec.sourceDocClass === 'PO') {
      const idx2 = _arr.findIndex((i) => i.key === 'scrappedQty');
      _arr.splice(idx2, 1);
      const idx3 = _arr.findIndex((i) => i.key === 'reworkQty');
      _arr.splice(idx3, 1);
      ds.queryDataSet.fields.get('documentObj').set('required', false);
    }
    // setArr(_arr);
    return _arr;
  };

  const handleQueryChange = (rec) => {
    if (!isEmpty(rec)) {
      // judgedDocumentClass(rec);
      if (rec.documentClass === 'MES.INSPECTION') {
        ds.queryDataSet.fields.get('documentObj').set('required', true);
      }
    }
    ds.queryDataSet.current.set('documentObj', null);
    dispatch({
      type: 'nonconformingProcessing/updateState',
      payload: {
        inspectDocList: [],
        lotList: [],
      },
    });
  };

  const handleSearch = async () => {
    const validateValue = await ds.queryDataSet.validate(false, false);
    if (!validateValue) return;

    setListLoading(true);
    const res = await ds.query();
    if (getResponse(res) && res.content) {
      res.content.forEach((i) => {
        const _i = i;
        _i.processPictures = [];
        _i.inputArr = judgedDocumentClass(_i);
      });
      dispatch({
        type: 'nonconformingProcessing/updateState',
        payload: {
          inspectDocList: res.content,
        },
      });
      // if (res.content[0] && ds.queryDataSet.current.get('documentClass') === 'MES.INSPECTION') {
      //   // judgedDocumentClass(res.content[0]);
      // }
    }
    setListLoading(false);
  };

  const handleProcessorChange = (rec) => {
    setAvator(rec.fileUrl);
  };

  const handleInspectChange = (rec) => {
    if (rec) {
      // judgedDocumentClass(rec);
      let params = {};
      if (rec.sourceDocTypeId) {
        params = {
          documentTypeId: rec.sourceDocTypeId,
          documentTypeCode: rec.sourceDocTypeCode,
          documentTypeName: rec.sourceDocTypeName,
        };
      } else if (rec.documentTypeId) {
        params = {
          documentTypeId: rec.documentTypeId,
          documentTypeCode: rec.documentTypeCode,
          documentTypeName: rec.documentTypeName,
        };
      }
      ds.queryDataSet.current.set('documentTypeObj', params);
      if (params.documentTypeId) {
        ds.queryDataSet.fields.get('documentTypeObj').set('required', false);
      } else {
        ds.queryDataSet.fields.get('documentTypeObj').set('required', true);
      }
    } else {
      ds.queryDataSet.fields.get('documentTypeObj').set('required', true);
      if (ds.current) {
        ds.current.set('documentTypeObj', null);
      }
    }
  };

  const handleOrderKeyDown = (e) => {
    e.persist();
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const formRender = () => {
    return [
      <Lov
        dataSet={workerDS}
        name="processorObj"
        key="processorObj"
        placeholder="处理人"
        prefix={<img src={processorIcon} alt="" style={{ margin: '0 8px' }} />}
        suffix={suffixRender(processorLock, 'processor')}
        clearButton={false}
        noCache
        disabled={processorLock}
        onChange={handleProcessorChange}
      />,
      <Lov
        dataSet={ds.queryDataSet}
        name="documentTypeObj"
        key="documentTypeObj"
        placeholder="单据类型"
        prefix={<img src={documentTypeIcon} alt="" style={{ margin: '0 8px' }} />}
        suffix={suffixRender(documentTypeLock, 'documentType')}
        noCache
        disabled={documentTypeLock}
        onChange={handleQueryChange}
        onKeyDown={handleOrderKeyDown}
      />,
      <Lov
        dataSet={ds.queryDataSet}
        name="documentObj"
        key="documentObj"
        placeholder="单据号"
        prefix={<img src={documentIcon} alt="" style={{ margin: '0 8px' }} />}
        suffix={suffixRender(documentLock, 'document')}
        noCache
        disabled={documentLock}
        onChange={handleInspectChange}
        onKeyDown={handleOrderKeyDown}
      />,
      <Lov
        dataSet={ds.queryDataSet}
        name="inspectionDocumentObj"
        key="inspectionDocumentObj"
        placeholder="检验单号"
        prefix={<img src={documentIcon} alt="" style={{ margin: '0 8px' }} />}
        noCache
        onChange={handleInspectChange}
        onKeyDown={handleOrderKeyDown}
      />,
    ];
  };

  const handleValueChange = (val, type, rec) => {
    const idx = inspectDocList.findIndex((i) => i.inspectionDocId === rec.inspectionDocId);
    const _list = inspectDocList.slice();
    let params = { ...rec };
    if (type === 'processRemark') {
      params = {
        ...rec,
        processRemark: val,
        checked: true,
      };
    } else {
      const ngQty = rec.qcNgQty || 0;
      const sumQty =
        val +
        (rec.concessionQty || 0) +
        (rec.reworkQty || 0) +
        (rec.scrappedQty || 0) +
        (rec.returnedQty || 0);
      // const diffQty =
      //   ngQty -
      //   val -
      //   (rec.concessionQty || 0) -
      //   (rec.reworkQty || 0) -
      //   (rec.scrappedQty || 0) -
      //   (rec.returnedQty || 0);
      params = {
        ...rec,
        [type]: sumQty > ngQty ? 0 : val,
        checked: true,
      };
      if(type === 'concessionQty' && params.concessionQty > 0) {
        params = {
          ...params,
          processResult: 'CONCESSION',
        };
      }
    }
    // const nullList = [];
    // arr.forEach((i) => {
    //   if (!rec[i.key] && i.key !== type) {
    //     nullList.push(i.key);
    //   }
    // });
    // if (nullList.length === 1) {
    //   params = {
    //     ...params,
    //     [nullList[0]]: diffQty < 0 ? 0 : diffQty,
    //   };
    // }
    _list.splice(idx, 1, params);
    dispatch({
      type: 'nonconformingProcessing/updateState',
      payload: {
        inspectDocList: _list,
      },
    });
  };

  const handleShowModal = async (rec) => {
    if (!rec.lineDTOList) {
      const res = await getInspectionDocLot({ inspectionDocId: rec.inspectionDocId, ngFlag: 1 });
      if (getResponse(res) && Array.isArray(res)) {
        const newList = [];
        res.forEach((i) => {
          if (i.qcNgQty <= 0) return;
          newList.push({
            ...i,
            processLotPictures: [],
            scrappedQty: null,
            reworkQty: null,
            returnedQty: null,
            concessionQty: null,
          });
        });
        dispatch({
          type: 'nonconformingProcessing/updateState',
          payload: {
            lotList: newList,
          },
        });
      }
    }
    modal = Modal.open({
      key: modalKey,
      title: rec.inspectionDocNum,
      className: styles['lmes-nonconforming-processing-modal'],
      children: (
        <LotModal
          inspectionDocId={rec.inspectionDocId}
          arr={rec.inputArr}
          data={rec}
          onModalCancel={handleModalCancel}
          onModalOk={handleModalOk}
          handlePicturesLotModal={handlePicturesLotModal}
          lineList={rec.lineDTOList}
        />
      ),
      closable: true,
      footer: null,
    });
  };

  const handleModalOk = (id, list) => {
    const idx = inspectDocList.findIndex((i) => i.inspectionDocId === id);
    const inspectDocListClone = [...inspectDocList];
    let concessionQty = 0;
    let returnedQty = 0;
    let scrappedQty = 0;
    let reworkQty = 0;
    list.forEach((i) => {
      concessionQty += i.concessionQty;
      returnedQty += i.returnedQty;
      scrappedQty += i.scrappedQty;
      reworkQty += i.reworkQty;
    });
    inspectDocListClone.splice(idx, 1, {
      ...inspectDocListClone[idx],
      checked: true,
      concessionQty,
      returnedQty,
      scrappedQty,
      reworkQty,
      lineDTOList: list,
    });
    dispatch({
      type: 'nonconformingProcessing/updateState',
      payload: {
        inspectDocList: inspectDocListClone,
        lotList: [],
      },
    });
    modal.close();
  };

  const handleModalCancel = () => {
    modal.close();
  };

  const handleFilterModalShow = () => {
    Modal.open({
      key: modalKey,
      title: intl.get(`hzero.c7nUI.Table.filterTitle`).d('筛选'),
      className: styles['lmes-nonconforming-processing-filter-modal'],
      children: (
        <Form dataSet={ds.queryDataSet} labelLayout="placeholder">
          <Lov name="relatedDocObj" key="relatedDocObj" placeholder="关联单据" />
          <Lov name="itemCategoryObj" key="itemCategoryObj" placeholder="物料类别" />
          <Lov
            name="itemObj"
            key="itemObj"
            placeholder="物料"
            // prefix={<img src={itemIcon} alt="" style={{ margin: '0 8px' }} />}
            // suffix={suffixRender(itemLock, 'item')}
            noCache
            // disabled={itemLock}
          />
          <DatePicker
            // dataSet={ds.queryDataSet}
            name="createDateMin"
            key="createDateMin"
            placeholder={['报检时间>=', '报检时间<=']}
            // prefix={<img src={dateIcon} alt="" style={{ margin: '0 8px' }} />}
          />
          {/* <DatePicker
            // dataSet={ds.queryDataSet}
            name="createDateMax"
            key="createDateMax"
            placeholder="报检时间<="
            // prefix={<img src={dateIcon} alt="" style={{ margin: '0 8px' }} />}
          /> */}
          <Lov name="supplierCategoryObj" key="supplierCategoryObj" placeholder="供应商类别" />
          <Select
            name="inspectionTemplateTypeList"
            key="inspectionTemplateTypeList"
            placeholder="检验类型"
          />
          <Lov
            // dataSet={ds.queryDataSet}
            name="declarerObj"
            key="declarerObj"
            placeholder="报检人"
            // prefix={<img src={inspectorIcon} alt="" style={{ margin: '0 8px' }} />}
            noCache
          />
        </Form>
      ),
      onOk: () => handleSearch(),
    });
  };

  const handlePicturesModal = (record) => {
    picturesModal = Modal.open({
      key: 'nonconforming-processing-pictures-modal',
      title: '图片',
      className: styles['nonconforming-processing-pictures-modal'],
      children: (
        <div className={styles.wrapper}>
          <div className={styles['img-list']}>
            <Upload {...propsData(record)} fileList={record.processPictures}>
              {record.processPictures && record.processPictures.length >= 9 ? null : uploadButton()}
            </Upload>
          </div>
          <div className={styles['footer-button']} onClick={() => handleConfirm()}>
            <span>确认</span>
          </div>
        </div>
      ),
      footer: null,
      movable: true,
      closable: true,
    });
  };
  // 行上传图片
  const handlePicturesLotModal = (record, el) => {
    lotPicturesModal = Modal.open({
      key: 'nonconforming-processing-pictures-modal',
      title: '图片',
      className: styles['nonconforming-processing-pictures-modal'],
      children: (
        <div className={styles.wrapper}>
          <div className={styles['img-list']}>
            <Upload {...propsLotData(el)} fileList={el.processLotPictures}>
              {el.processLotPictures && el.processLotPictures.length >= 9 ? null : uploadButton()}
            </Upload>
          </div>
          <div className={styles['footer-button']} onClick={() => handleLotConfirm()}>
            <span>确认</span>
          </div>
        </div>
      ),
      footer: null,
      movable: true,
      closable: true,
    });
  };

  // 上传成功
  const handleImgSuccess = (res, record) => {
    if (!res) {
      return;
    }
    const _fileList = [];
    const fileObj = {
      uid: uuidv4(),
      name: res.split('@')[1],
      status: 'done',
      url: res,
    };
    _fileList.unshift(fileObj);
    const _record = record;
    _record.processPictures = [..._fileList, ...record.processPictures];
    updateModal(record);
  };

  // 行上传成功
  const handleLotImgSuccess = (res, record) => {
    if (!res) {
      return;
    }
    const _fileList = [];
    const fileObj = {
      uid: uuidv4(),
      name: res.split('@')[1],
      status: 'done',
      url: res,
    };
    _fileList.unshift(fileObj);
    const _record = record;
    _record.processLotPictures = [..._fileList, ...record.processLotPictures];
    updateLotModal(record);
  };

  // 预览图片
  const handlePreview = (file) => {
    if (!file.url) return;
    window.open(file.url);
  };

  // 删除图片
  const handleRemove = (file, record) => {
    // const _badReasonList = this.state.badReasonList.slice();
    // const targetIndex = record.processPictures.findIndex((v) => v.exceptionId === record.exceptionId);
    const _record = record;
    _record.processLotPictures = record.processLotPictures.filter((v) => v.uid !== file.uid);
    updateModal(record);
  };

  // 行删除图片
  const handleLotRemove = (file, record) => {
    // const _badReasonList = this.state.badReasonList.slice();
    // const targetIndex = record.processPictures.findIndex((v) => v.exceptionId === record.exceptionId);
    const _record = record;
    _record.processLotPictures = record.processLotPictures.filter((v) => v.uid !== file.uid);
    updateLotModal(record);
  };

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
      // fileList: this.state.fileList,
    };
  };

  const propsLotData = (record) => {
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
      onSuccess: (res) => handleLotImgSuccess(res, record),
      onPreview: handlePreview,
      onRemove: (res) => handleLotRemove(res, record),
      // fileList: this.state.fileList,
    };
  };

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MES,
      directory,
    };
  };

  const uploadButton = () => (
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

  const handleConfirm = () => {
    picturesModal.close();
  };
  const handleLotConfirm = () => {
    lotPicturesModal.close();
  };

  // 弹框更新
  const updateModal = (record) => {
    picturesModal.update({
      children: (
        <div className={styles.wrapper}>
          <div className={styles['img-list']}>
            <Upload {...propsData(record)} fileList={record.processPictures}>
              {record.processPictures && record.processPictures.length >= 9 ? null : uploadButton()}
            </Upload>
          </div>
          <div className={styles['footer-button']} onClick={() => handleConfirm()}>
            <span>确认</span>
          </div>
        </div>
      ),
    });
  };
  // 行弹框更新
  const updateLotModal = (record) => {
    lotPicturesModal.update({
      children: (
        <div className={styles.wrapper}>
          <div className={styles['img-list']}>
            <Upload {...propsLotData(record)} fileList={record.processLotPictures}>
              {record.processLotPictures && record.processLotPictures.length >= 9
                ? null
                : uploadButton()}
            </Upload>
          </div>
          <div className={styles['footer-button']} onClick={() => handleLotConfirm()}>
            <span>确认</span>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className={styles['lmes-nonconforming-processing']}>
      <CommonHeader title="不合格品处理" />
      <div className={styles['lmes-nonconforming-processing-sub-header']}>
        <img className={styles.avator} src={avator || defaultAvatorImg} alt="" />
        <div className={styles['form-area']}>
          <Form columns={4} labelLayout="placeholder">
            {formRender()}
            {/* <div className={styles.queryBtn}>
              <Button onClick={handleQueryReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={handleSearch}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div> */}
          </Form>
          {/* <img className={styles.expand} src={expandIcon} alt="" onClick={handleExpand} /> */}
        </div>
      </div>
      <Spin spinning={listLoading}>
        <div className={styles['lmes-nonconforming-processing-list']}>
          {inspectDocList.map((el) => {
            return (
              <div className={styles['list-item']} key={el.inspectionDocId}>
                <div className={styles.top}>
                  <Checkbox checked={el.checked} onChange={(e) => handleCheckItem(el, e)} />
                  <div>
                    <p className={styles.order}>{el.inspectionDocNum}</p>
                    <div>
                      <span>批次数 {el.batchQty}</span>
                      <span>
                        <span className={`${styles.circle} ${styles.ok}`} /> 合格 {el.qcOkQty}
                      </span>
                      <span>
                        <span className={`${styles.circle} ${styles.ng}`} /> 不合格 {el.qcNgQty}
                      </span>
                    </div>
                  </div>
                  <div className={styles['top-right-list']}>
                    {el.inputArr.map((i) => {
                      return (
                        <div key={i.key}>
                          <div>
                            <span className={styles.circle} style={{ backgroundColor: i.color }} />{' '}
                            {i.title}
                          </div>
                          <NumberField
                            min={0}
                            // step={1}
                            value={el[i.key]}
                            disabled={
                              el.itemControlType &&
                              (el.itemControlType === 'LOT' || el.itemControlType === 'TAG')
                            }
                            className={styles.block}
                            onChange={(val) => handleValueChange(val, i.key, el)}
                          />
                        </div>
                      );
                    })}
                    <div>
                      <p>备注</p>
                      <TextField
                        value={el.processRemark}
                        className={styles.remark}
                        onChange={(val) => handleValueChange(val, 'processRemark', el)}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.bottom}>
                  <Popover content={`${el.itemCode} ${el.description}`} placement="bottom">
                    <span>
                      {el.itemCode} {el.description}
                    </span>
                  </Popover>
                  <span>{el.sourceDocNum}</span>
                  <span>
                    <span>报检人：{el.declarerName}</span>
                    <span>{el.creationDate}</span>
                  </span>
                  <span>
                    <span>判定人：{el.inspectorName || el.inspector}</span>
                    <span>{el.judgedDate}</span>
                  </span>
                  <Col span={4} className={styles.upload} onClick={() => handlePicturesModal(el)}>
                    <Icons type="ziyuan60" size="20" />
                    <span>上传图片</span>
                  </Col>
                  {el.itemControlType &&
                    (el.itemControlType === 'LOT' || el.itemControlType === 'TAG') && (
                      <a
                        style={{ color: '#1c879c', marginTop: '2px' }}
                        onClick={() => handleShowModal(el)}
                      >
                        查看明细
                      </a>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </Spin>
      <div className={styles['lmes-nonconforming-processing-footer']}>
        <div className={styles.icon} onClick={handleExit}>
          <Icons type="exit" size="48" />
          <div className={styles.line} />
          <p className={styles.text}>退出</p>
        </div>
        <div>
          <div className={styles.icon} onClick={handleReset}>
            <Icons type="reset" size="48" />
            <div className={styles.line} />
            <p className={styles.text}>重置</p>
          </div>
          <div className={styles.icon} onClick={handleCheckAll}>
            <Icons type="check" size="48" />
            <div className={styles.line} />
            <p className={styles.text}>全选</p>
          </div>
          <div className={styles.icon} onClick={handleSubmit}>
            {/* <img src={submitImg} alt="" /> */}
            <Icons type="submit" size="48" />
            <div className={styles.line} />
            <p className={styles.text}>提交</p>
          </div>
          <div className={styles.icon} onClick={handleFilterModalShow}>
            <Icons type="ziyuan23" size="48" />
            <div className={styles.line} />
            <p className={styles.text}>筛选</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ nonconformingProcessing }) => ({
  inspectDocList: nonconformingProcessing?.inspectDocList || [],
  lotList: nonconformingProcessing?.lotList || [],
}))(NonconformingProcessiong);
