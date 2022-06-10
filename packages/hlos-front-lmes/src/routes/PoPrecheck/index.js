/**
 * @Description: po预检
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-03-01 14:56:08
 * @LastEditors: leying.yan
 */

import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { isEmpty, cloneDeep } from 'lodash';
import notification from 'utils/notification';
import moment from 'moment';
import Icons from 'components/Icons';
import { HZERO_FILE } from 'utils/config';
import { BUCKET_NAME_MES } from 'hlos-front/lib/utils/config';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { Upload } from 'choerodon-ui';
import { Modal, DataSet } from 'choerodon-ui/pro';
import { closeTab } from 'utils/menuTab';
import { getAccessToken, getCurrentOrganizationId } from 'utils/utils';
import uuidv4 from 'uuid/v4';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import { LoginDS, QueryDS } from '@/stores/poPrecheckDS';
import {
  // getItemControlType,
  getInspectTemplate,
  getExceptionAssigns,
  createInspectionDoc,
  judgeInspectionDoc,
} from '@/services/poPrecheckService';
import SubHeader from './SubHeader/index';
import SelectArea from './SelectArea/index';
import MainLeft from './MainLeft/index';
import MainRight from './MainRight/index';
import Footer from './Footer/index';
import LoginModal from './LoginModal/index';
import styles from './index.less';

let modal = null;
const directory = 'po-precheck';

const loginFactory = () => new DataSet(LoginDS());
const queryFactory = () => new DataSet(QueryDS());

const poPrecheck = ({ history }) => {
  const loginDS = useDataSet(loginFactory, poPrecheck);
  const queryDS = useDataSet(queryFactory);
  const [lineNumDisabled, setLineNumDisabled] = useState(true);
  const [poDisabled, setPoDisabled] = useState(true);
  const [bottomData, setBottomData] = useState({});
  const [inspectionList, setInspectionList] = useState([]);
  const [exceptionList, setExceptionList] = useState([]);
  const [loginData, setLoginData] = useState({});
  const [hasCreated, setHasCreated] = useState(false);
  const [inspectionDocId, setInspectionDocId] = useState();
  const [batchQty, setBatchQty] = useState(0);
  const latestExceptionList = useRef(exceptionList);

  useEffect(() => {
    async function init() {
      const resArr = await userSetting({ defaultFlag: 'Y' });
      if (resArr) {
        if (resArr && resArr.content && resArr.content[0]) {
          const {
            workerId,
            workerCode,
            workerName,
            fileUrl,
            organizationId,
            organizationCode,
            organizationName,
          } = resArr.content[0];
          loginDS.current.set('workerObj', {
            workerId,
            workerCode,
            workerName,
            fileUrl,
          });
          loginDS.current.set('organizationObj', {
            organizationId,
            organizationCode,
            organizationName,
          });
          queryDS.current.set('organizationObj', {
            organizationId,
            organizationCode,
            organizationName,
          });
        }
      }
    }
    init();
    handleWorkerChange();
  }, []);

  useEffect(() => {
    latestExceptionList.current = exceptionList;
  }, [exceptionList]);

  // 点击切换按钮
  function handleWorkerChange() {
    if (hasCreated) return;
    modal = Modal.open({
      key: 'lmes-po-precheck-login-modal',
      title: '登录',
      className: styles['lmes-po-precheck-login-modal'],
      children: <LoginModal onLogin={handleLogin} ds={loginDS} onExit={handleExit} />,
      footer: null,
    });
  }

  /**
   * 切换操作员登录
   * @returns
   */
  async function handleLogin() {
    const validateValue = await loginDS.validate(false, false);
    if (!validateValue) return;
    queryDS.current.reset();
    setPoDisabled(true);
    setLineNumDisabled(true);
    setHasCreated(false);
    setBottomData({});
    loginDS.current.set('inspectionDocNum', '');
    setLoginData(loginDS.current.toJSONData());
    queryDS.current.set('organizationId', loginDS.current.get('organizationId'));
    queryDS.current.set('organizationCode', loginDS.current.get('organizationCode'));
    modal.close();
  }

  function handleExit() {
    history.push('/workplace');
    closeTab('/pub/lmes/po-precheck');
  }

  /**
   *创建检验单
   * @returns
   */
  async function handleCreate() {
    if (hasCreated) return;
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) return;
    const { workerId, workerCode } = loginDS.current.toJSONData();
    const params = {
      ...queryDS.current.toJSONData(),
      declarerId: workerId,
      declarer: workerCode,
      declaredDate: moment().format(DEFAULT_DATETIME_FORMAT),
      inspectionDocType: 'SQC',
      inspectionTemplateType: 'SQC.NORMAL',
      sourceDocClass: 'PO',
      sampleQty: 1,
    };
    const res = await createInspectionDoc(params);
    if (!res.failed) {
      loginDS.current.set('inspectionDocNum', res.inspectionDocNum);
      setLoginData(loginDS.current.toJSONData());
      setHasCreated(true);
      res.inspectionDocLineList.map((item) => {
        if (item.resultType === 'NUMBER') {
          return Object.assign(item, {
            qcValue: 0,
            qcOkQty: '',
            qcNgQty: '',
          });
        } else {
          return Object.assign(item, {
            qcJudge: true,
            qcOkQty: '',
            qcNgQty: '',
          });
        }
      });
      notification.success({
        message: `检验单${res.inspectionDocNum}已提交成功`,
      });
      setInspectionDocId(res.inspectionDocId);
      setInspectionList(res.inspectionDocLineList);
      // 获取异常信息
      const exceptionRes = await getExceptionAssigns({
        organizationId: queryDS.current.get('organizationId'),
      });
      if (exceptionRes && exceptionRes.content) {
        exceptionRes.content.map((data) => {
          return Object.assign(data, {
            exceptionQty: 0,
            fileList: [],
          });
        });
        setExceptionList(exceptionRes.content);
      } else {
        notification.error({
          message: exceptionRes.message,
        });
      }
    } else {
      notification.error({
        message: res.message,
      });
    }
  }

  /**
   *判定
   */
  async function handleJudge(value) {
    let continueFlag = true;
    inspectionList.forEach((item) => {
      if (
        item.qcNgQty === '' ||
        item.qcOkQty === '' ||
        item.qcNgQty > queryDS.current.get('demandQty') ||
        item.qcOkQty > queryDS.current.get('demandQty')
      ) {
        continueFlag = false;
      }
    });
    if (!continueFlag) {
      notification.error({
        message: '请先正确填写检验项的检验数量！',
      });
      return;
    }
    const { workerId, workerCode } = loginDS.current.toJSONData();
    const params = {
      inspectionDocId,
      qcResult: value,
      qcOkQty: value === 'PASS' ? batchQty : 0,
      qcNgQty: value === 'FAILED' ? batchQty : 0,
      inspectorId: workerId,
      inspector: workerCode,
      judgedDate: moment().format(DEFAULT_DATETIME_FORMAT),
      inspectionDocLineList: inspectionList.map((item) => {
        return Object.assign(item, {
          qcResult: value,
          inspectorId: workerId,
          inspector: workerCode,
        });
      }),
      inspectionDocExceptionList: exceptionList.map((item) => {
        return Object.assign(item, { exceptionDocId: inspectionDocId });
      }),
    };
    const res = await judgeInspectionDoc(params);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '判定成功',
      });
      // 判定完成后清除供应商以外其他数据
      // queryDS.current.reset();
      setHasCreated(false);
      setBottomData({});
      queryDS.current.set('poObj', {});
      queryDS.current.set('sourceDocNum', '');
      queryDS.current.set('lineNumObj', {});
      queryDS.current.set('inspectionGroupObj', null);
      queryDS.current.set('remark', null);
      queryDS.current.set('batchQty', null);
      loginDS.current.set('inspectionDocNum', null);
      setLoginData(loginDS.current.toJSONData());
    }
  }

  /**
   * 下一张
   */
  function handleNext() {
    if (!hasCreated) {
      return;
    }
    setHasCreated(false);
    setBottomData({});
    queryDS.current.reset();
    queryDS.current.set('poObj', {});
    queryDS.current.set('organizationObj', loginDS.current.get('organizationObj'));
    loginDS.current.set('inspectionDocNum', null);
    setLoginData(loginDS.current.toJSONData());
  }

  // 修改po，清空行号等信息
  function handlePoChange(value) {
    if (!value) {
      queryDS.current.set('poObj', {});
    }
    queryDS.current.set('lineNumObj', {});
    queryDS.current.set('batchQty', null);
    queryDS.current.set('inspectionGroupObj', null);
    setBottomData({});
    setLineNumDisabled(false);
  }

  // 行号变化时
  async function handleLineNumChange(record) {
    if (record) {
      queryDS.current.set('batchQty', record.demandQty);
      setBatchQty(record.demandQty);
      setBottomData(record);
      const params = {
        organizationId: queryDS.current.get('organizationId'),
        itemId: queryDS.current.get('itemId'),
        partyId: queryDS.current.get('partyId'),
        inspectionTemplateType: 'SQC.NORMAL',
      };
      // 获取物料控制类型 （现在缺少groupID，不知道怎么传）
      // const itemControlRes = await getItemControlType([
      //   {
      //     organizationId: params.organizationId,
      //     itemId: params.itemId,
      //     tenantId: getCurrentOrganizationId(),
      //   },
      // ]);
      // console.log(itemControlRes);
      const res = await getInspectTemplate(params);
      // 能获取到检验模板及明细设置数据则直接展示
      if (res && res.inspectionGroupId) {
        queryDS.current.set('inspectionGroupObj', {
          inspectionGroupId: res.inspectionGroupId,
          inspectionGroupName: res.inspectionGroupName,
          templateId: res.templateId,
        });
        // queryDS.current.set('templateId', res.templateId);
      }
    }
  }

  function handleAbnormalChange(value, index) {
    const tempList = exceptionList;
    tempList[index].exceptionQty = value;
    setExceptionList(tempList);
  }

  // 修改供应商，清空已选择的po和行号
  async function handlePartyChange() {
    queryDS.current.set('poObj', {});
    queryDS.current.set('sourceDocNum', '');
    queryDS.current.set('lineNumObj', {});
    queryDS.current.set('inspectionGroupObj', null);
    queryDS.current.set('batchQty', null);
    setPoDisabled(false);
    setLineNumDisabled(true);
    setBottomData('');
  }

  // 修改检验数量
  function handleBatchQtyChange(value) {
    if (value > queryDS.current.get('demandQty')) {
      return;
    }
    setBottomData({ ...bottomData, demandQty: value });
  }

  function sub(num1, num2) {
    let r1 = 0;
    let r2 = 0;
    let m = 0;
    let n = 0;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = 10 ** Math.max(r1, r2);
    n = r1 >= r2 ? r1 : r2;
    return parseFloat(((num1 * m - num2 * m) / m).toFixed(n));
  }

  function handleNumberChange(value, type, index) {
    const tempList = inspectionList;
    if (type === 'qcOkQty') {
      tempList[index].qcOkQty = value || 0;
      tempList[index].qcNgQty =
        value > queryDS.current.get('batchQty') ? '' : sub(queryDS.current.get('batchQty'), value);
    } else {
      tempList[index].qcNgQty = value || 0;
      tempList[index].qcOkQty =
        value > queryDS.current.get('batchQty') ? '' : sub(queryDS.current.get('batchQty'), value);
    }
    setInspectionList(cloneDeep(tempList));
  }

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MES,
      directory,
    };
  };

  function handlePicturesModal(record, index) {
    modal = Modal.open({
      key: 'lmes-po-precheck-pictures-modal',
      title: '图片',
      className: styles['lmes-po-precheck-pictures-modal'],
      children: (
        <div className={styles.wrapper}>
          <div className={styles['img-list']}>
            <Upload {...propsData(record, index)} fileList={record.fileList}>
              {record.fileList && record.fileList.length >= 9 ? null : uploadButton()}
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
  }

  const propsData = (record, index) => {
    return {
      name: 'file',
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${HZERO_FILE}/v1/${getCurrentOrganizationId()}/files/multipart`,
      accept: 'image/*',
      listType: 'picture-card',
      multiple: true,
      data: uploadData,
      onSuccess: (res) => handleImgSuccess(res, record, index),
      onPreview: handlePreview,
      onRemove: (res) => handleRemove(res, record, index),
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

  // 弹框更新
  function updateModal(currentException, index) {
    modal.update({
      children: (
        <div className={styles.wrapper}>
          <div className={styles['img-list']}>
            <Upload {...propsData(currentException, index)} fileList={currentException.fileList}>
              {currentException.fileList.length >= 9 ? null : uploadButton()}
            </Upload>
          </div>
          <div className={styles['footer-button']} onClick={() => handleConfirm()}>
            <span>确认</span>
          </div>
        </div>
      ),
    });
  }

  /**
   * 图片上传成功后
   *
   * @param {*} res 图片上传结果
   * @param {*} record 当前上传图片的异常信息
   * @param {*} index 当前上传图片的异常信息的index
   * @returns
   */
  function handleImgSuccess(res, record, index) {
    if (!res) {
      return;
    }
    let _exceptionList = latestExceptionList.current;
    const _fileList = [];
    let curRec = {};
    const fileObj = {
      uid: uuidv4(),
      name: res.split('@')[1],
      status: 'done',
      url: res,
    };
    _fileList.unshift(fileObj);
    _exceptionList = _exceptionList.map((v) => {
      if (v.exceptionId === record.exceptionId) {
        // console.log(v.fileList)
        curRec = { ...v, fileList: [..._fileList, ...v.fileList] };
        return curRec;
      }
      return { ...v };
    });
    setExceptionList(cloneDeep(_exceptionList));
    updateModal(_exceptionList[index], index);
  }

  /**
   *图片预览
   *
   */
  function handlePreview(file) {
    if (!file.url) return;
    window.open(file.url);
  }

  /**
   * 图片删除
   * @param {*} res
   * @param {*} record
   * @param {*} index
   */
  function handleRemove(res, record, index) {
    const _exceptionList = latestExceptionList.current;
    const targetIndex = _exceptionList.findIndex((v) => v.exceptionId === record.exceptionId);
    _exceptionList[targetIndex].fileList = _exceptionList[targetIndex].fileList.filter(
      (v) => v.uid !== res.uid
    );
    setExceptionList(cloneDeep(_exceptionList));
    updateModal(_exceptionList[index], index);
  }

  function handleConfirm() {
    modal.close();
  }

  return (
    <div className={styles['lmes-po-precheck']}>
      <CommonHeader title="PO预检" />
      {!isEmpty(loginData) && <SubHeader data={loginData} />}
      <div className={styles.content}>
        <SelectArea ds={queryDS} hasCreated={hasCreated} onPartyChange={handlePartyChange} />
        <div className={styles.main}>
          <MainLeft
            ds={queryDS}
            poDisabled={poDisabled}
            lineNumDisabled={lineNumDisabled}
            bottomData={bottomData}
            hasCreated={hasCreated}
            onPoChange={handlePoChange}
            onLineNumChange={handleLineNumChange}
            onBatchQtyChange={handleBatchQtyChange}
          />
          {hasCreated ? (
            <MainRight
              ds={queryDS}
              inspectionList={inspectionList}
              exceptionList={exceptionList}
              onNumberChange={handleNumberChange}
              onAbnormalChange={handleAbnormalChange}
              onPicturesChange={handlePicturesModal}
            />
          ) : null}
        </div>
      </div>
      <Footer
        hasCreated={hasCreated}
        onWorkerChange={handleWorkerChange}
        onExit={handleExit}
        onCreate={handleCreate}
        onJudge={handleJudge}
        onNext={handleNext}
      />
    </div>
  );
};

export default connect()(
  formatterCollections({
    code: ['lmes.proPrecheck', 'lmes.common'],
  })(poPrecheck)
);
