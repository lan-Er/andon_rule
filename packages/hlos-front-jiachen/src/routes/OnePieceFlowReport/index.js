import React, { useState, useEffect, createRef } from 'react';
import { Modal } from 'choerodon-ui/pro';
import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import moment from 'moment';
import SubHeader from './SubHeader/index';
import ReportLeft from './ReportLeft/index';
import ReportRight from './ReportRight/index';
import InspectModal from './InspectModal/index';
import ExceptionModal from './ExceptionModal/index';
import {
  getUserSettings,
  searchWorkerCode,
  getMoNum,
  searchWorkcellCode,
  searchOperationCode,
  taskItems,
  validDisplayFeeding,
  getLatestEsop,
  registerWip,
  moveOutWip,
  expandTag,
  issueTask,
  expandTagNew,
  taskQty,
  barcodeQty,
} from '@/services/onePieceFlowReportService';

import styles from './index.less';

let inspectModal = null;
let exceptionModal = null;

const workerNameRef = createRef();
const moNumRef = createRef();
const workcellNameRef = createRef();
const operationNameRef = createRef();
const querySnNumRef = createRef();
const queryFeedNumRef = createRef();
const pdfRef = createRef();

const OnePieceFlowReport = ({ history }) => {
  const [userSetting, setUserSetting] = useState({});
  const [workerName, setWorkerName] = useState(null); // 用户编码显示名称
  const [workerObj, setWorkerObj] = useState({}); // 用户对象
  const [moNum, setMoNum] = useState(null); // 工单编码
  const [moNumObj, setMoNumObj] = useState({}); // 工单编码对象
  const [workcellName, setWorkcellName] = useState(null); // 工位编码显示名称
  const [workcellObj, setWorkcellObj] = useState({}); // 工位对象
  const [operationName, setOperationName] = useState(null); // 工序编码显示名称
  const [operationObj, setOperationObj] = useState({}); // 工序对象
  const [queryDataDone, setQueryDataDone] = useState(false);
  const [taskItemsObj, setTaskItemsObj] = useState({}); // 任务信息
  const [feedingFlag, setFeedingFlag] = useState(false); // 是否显示投料栏
  const [technologyFiles, setTechnologyFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [querySnNum, setQuerySnNum] = useState(null);
  const [queryFeedNum, setQueryFeedNum] = useState(null);
  const [snNumObj, setSnNumObj] = useState(null);

  const [currentExecutedFeedNumCount, setCurrentExecutedFeedNumCount] = useState(0); // 当前执行投料码成功的次数

  const [taskQtyObj, setTaskQtyObj] = useState({});
  const [barcodeQtyObj, setBarcodeQtyObj] = useState({});

  const [disabledSnNum, setDisabledSnNum] = useState(false);

  useEffect(() => {
    async function getUserMsg() {
      const resp = await getUserSettings();
      if (resp && resp.content) {
        if (resp.content.length) {
          const msg = resp.content[0];
          setUserSetting(msg);
          if (msg.workcellCode) {
            const workcellResp = await searchWorkcellCode({
              workcellCode: msg.workcellCode,
            });
            setWorkcellName(workcellResp.workcellName);
            setWorkcellObj(workcellResp);
          }
        }
      }
    }
    getUserMsg();
  }, []);

  useEffect(() => {
    if (Object.keys(workerObj).length === 0 || !workerName) {
      workerNameRef.current.focus();
    } else if (Object.keys(moNumObj).length === 0 || !moNum) {
      moNumRef.current.focus();
    } else if (Object.keys(workcellObj).length === 0 || !workcellName) {
      workcellNameRef.current.focus();
    } else if (Object.keys(operationObj).length === 0 || !operationName) {
      operationNameRef.current.focus();
    }
  });

  useEffect(() => {
    if (queryDataDone && querySnNumRef.current && !disabledSnNum) {
      querySnNumRef.current.focus();
    }
  }, [queryDataDone, disabledSnNum]);

  useEffect(() => {
    if (taskItemsObj.taskId) {
      getTaskQty(taskItemsObj.taskId);
    }
  }, [taskItemsObj.taskId]);

  useEffect(() => {
    setQuerySnNum(null);
    setSnNumObj({});
    setDisabledSnNum(false);
  }, [workerName, moNum, workcellName, operationName]);

  function changeFocus(flag) {
    if (flag === 'sn') {
      setQuerySnNum(null);
      setSnNumObj({});
      setDisabledSnNum(false);
      querySnNumRef.current.focus();
    } else if (flag === 'feed') {
      setDisabledSnNum(true);
      queryFeedNumRef.current.focus();
    }
  }

  async function getTaskQty(taskId) {
    const params = {
      taskId,
    };
    const resp = await taskQty(params);
    if (resp) {
      setTaskQtyObj(resp);
    } else {
      setTaskQtyObj({});
    }
  }

  async function getBarcodeQty(taskId, tagCode) {
    const params = {
      taskId,
      tagCode,
    };
    const resp = await barcodeQty(params);
    if (resp) {
      setBarcodeQtyObj(resp);
    } else {
      setBarcodeQtyObj({});
    }
    return resp;
  }

  function changeWorker(value) {
    setWorkerName(value);

    setMoNum(null);
    setMoNumObj({});
    setOperationName(null);
    setOperationObj({});

    setQueryDataDone(false);
  }

  async function searchWorker(e) {
    e.persist();
    if (e.keyCode === 13) {
      if (!e.target.value) {
        setWorkerName(null);
        setWorkerObj({});
        return;
      }
      const params = {
        workerCode: e.target.value,
      };
      const resp = await searchWorkerCode(params);
      if (resp && resp.failed) {
        notification.error({
          message: resp.message,
        });
        setWorkerName(null);
        setWorkerObj({});
      } else {
        setWorkerName(resp.workerName ? resp.workerName : null);
        setWorkerObj(resp);
      }
    }
  }

  function changeMoNum(value) {
    setMoNum(value);

    setOperationName(null);
    setOperationObj({});

    setQueryDataDone(false);
  }

  async function searchMoNum(e) {
    e.persist();
    if (e.keyCode === 13) {
      if (!e.target.value) {
        setMoNum(null);
        setMoNumObj({});
        return;
      }
      const params = {
        moNum: e.target.value,
      };
      const resp = await getMoNum(params);
      if (resp && resp.failed) {
        notification.error({
          message: resp.message,
        });
        setMoNum(null);
        setMoNumObj({});
      } else {
        setMoNum(resp.moNum ? resp.moNum : null);
        setMoNumObj(resp);
      }
    }
  }

  function changeWorkcell(value) {
    setWorkcellName(value);

    setOperationName(null);
    setOperationObj({});

    setQueryDataDone(false);
  }

  async function searchWorkcell(e) {
    e.persist();
    if (e.keyCode === 13) {
      if (!e.target.value) {
        setWorkcellName(null);
        setWorkcellObj({});
        return;
      }
      const params = {
        workcellCode: e.target.value,
      };
      const resp = await searchWorkcellCode(params);
      if (resp && resp.failed) {
        notification.error({
          message: resp.message,
        });
        setWorkcellName(null);
        setWorkcellObj({});
      } else {
        setWorkcellName(resp.workcellName ? resp.workcellName : null);
        setWorkcellObj(resp);
      }
    }
  }

  function changeOperation(value) {
    setOperationName(value);

    setSnNumObj({});

    setCurrentFile({});

    setQueryDataDone(false);
  }

  async function searchOperation(e) {
    e.persist();
    if (e.keyCode === 13) {
      if (!e.target.value) {
        setOperationName(null);
        setOperationObj({});
        return;
      }
      const params = {
        operationCode: e.target.value,
      };
      const resp = await searchOperationCode(params);
      if (resp && resp.failed) {
        notification.error({
          message: resp.message,
        });
        setOperationName(null);
        setOperationObj({});
      } else {
        setOperationName(resp.operationName ? resp.operationName : null);
        setOperationObj(resp);

        // 查询工序级任务
        setTimeout(() => {
          getTaskItems(resp.operationId);
        }, 0);
      }
    }
  }

  async function getTaskItems(operationId) {
    const params = {
      moNum: moNumObj.moNum,
      moQueryFlag: 'Y',
      operationId, // operationObj.operationId,
      organizationId: userSetting.organizationId,
      taskTypeCode: 'OPERATION_TASK',
    };
    const resp = await taskItems(params);
    if (resp) {
      const msg = resp.content && resp.content.length > 0 ? resp.content[0] : {};
      if (resp.content && resp.content.length) {
        setQueryDataDone(true);
      } else {
        setQueryDataDone(false);
        notification.error({
          message: '当前工单不经过该工序',
          duration: 5,
        });
        return;
      }
      setTaskItemsObj(msg);

      setTimeout(() => {
        // 查询 工艺文件
        getLatestEsopFile(msg);
        // 查询是否 投料码
        getValidDisplayFeeding(msg.taskId);
      }, 0);
    }
  }

  async function getLatestEsopFile(msg) {
    const { itemId, operationId } = msg;
    const url = null;
    const urlList = [];
    const params = {
      productId: itemId,
      operationId,
    };
    const res = await getLatestEsop(params);
    if (res) {
      if (res && res.fileUrl) {
        const fileExt = res.fileUrl.replace(/.+\./, '');
        urlList.push({
          fileUrl: res.fileUrl,
          fileType: fileExt,
        });
      }
    }
    if (url || urlList) {
      setTechnologyFiles(urlList);
      setCurrentIndex(0);
      setCurrentFile(urlList.length ? urlList[0] : {});
    }
  }

  function handleChangeFilePrevious() {
    if (!technologyFiles.length || currentIndex === 0) {
      return;
    }
    const index = currentIndex;
    setCurrentIndex(index - 1);
    setCurrentFile(technologyFiles[index - 1]);
  }

  function handleChangeFileNext() {
    if (!technologyFiles.length || currentIndex === technologyFiles.length - 1) {
      return;
    }
    const index = currentIndex;
    setCurrentIndex(index + 1);
    setCurrentFile(technologyFiles[index + 1]);
  }

  async function getValidDisplayFeeding(taskId) {
    const params = {
      taskId,
    };
    const resp = await validDisplayFeeding(params);
    if (resp > 0) {
      setFeedingFlag(true);
    } else {
      setFeedingFlag(false);
    }
  }

  function changeSnNum(value) {
    setQuerySnNum(value);
  }

  async function commitSnNum(e) {
    e.persist();
    if (e.keyCode === 13) {
      if (!e.target.value) {
        return;
      }
      let params = {};
      let res = null;
      if (taskItemsObj.firstOperationFlag) {
        params = {
          organizationId: userSetting.organizationId,
          organizationCode: userSetting.organizationCode,
          operationId: operationObj.operationId,
          operationCode: operationObj.operationCode,
          workerId: workerObj.workerId,
          worker: workerObj.workerCode,
          prodLineId: null,
          prodLineCode: null,
          workcellId: workcellObj.workcellId,
          workcellCode: workcellObj.workcellCode,
          calendarDay: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          calendarShiftCode: 'MORNING SHIFT',
          taskId: taskItemsObj.taskId,
          taskNum: taskItemsObj.taskNum,
          itemId: taskItemsObj.itemId,
          itemCode: taskItemsObj.itemCode,
          moId: moNumObj.moId,
          moNum: moNumObj.moNum,
          wipLineList: [
            {
              tagCode: e.target.value,
              executeQty: 1,
              lotNumber: moment(new Date()).format('YYYYMMDD'),
            },
          ],
        };
        res = await registerWip(params);
      } else {
        const tagList = await expandTag({
          tagCode: e.target.value,
          tagThingType: 'THING',
          wmsOrganizationId: userSetting.organizationId,
        });
        params = {
          organizationId: userSetting.organizationId,
          organizationCode: userSetting.organizationCode,
          operationId: operationObj.operationId,
          operationCode: operationObj.operationCode,
          workerId: workerObj.workerId,
          worker: workerObj.workerCode,
          prodLineId: null,
          prodLineCode: null,
          workcellId: workcellObj.workcellId,
          workcellCode: workcellObj.workcellCode,
          calendarDay: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          calendarShiftCode: 'MORNING SHIFT',
          taskId: taskItemsObj.taskId,
          taskNum: taskItemsObj.taskNum,
          itemId: taskItemsObj.itemId,
          itemCode: taskItemsObj.itemCode,
          moId: moNumObj.moId,
          moNum: moNumObj.moNum,
          wipLineList: tagList.map((itemObj) => {
            return {
              tagId: itemObj.tagId,
              tagCode: itemObj.tagCode,
              executeQty: itemObj.quantity,
              inspectedResult: 'OK',
            };
          }),
        };
        res = await moveOutWip(params);
      }
      if (res && res.failed) {
        notification.error({
          message: res.message,
          duration: 5,
        });
      } else {
        setSnNumObj(res);
        notification.success({
          message: '提交成功',
        });

        await getTaskQty(taskItemsObj.taskId);
        const respBarcodeQty = await getBarcodeQty(taskItemsObj.taskId, e.target.value);
        // 是否存在投料码需要聚焦
        if (
          respBarcodeQty &&
          feedingFlag &&
          Number(respBarcodeQty.barcodeBomUsage) > 0 &&
          queryFeedNumRef.current
        ) {
          setCurrentExecutedFeedNumCount(Number(respBarcodeQty.barcodeExecuteQty));
          changeFocus('feed');
        } else {
          setCurrentExecutedFeedNumCount(0);
          changeFocus('sn');
        }
      }
    }
  }

  function changeFeedNum(value) {
    setQueryFeedNum(value);
  }

  async function commitFeedNum(e) {
    e.persist();
    if (e.keyCode === 13) {
      if (!e.target.value) {
        return;
      }
      const tagRes = await expandTagNew({
        tagCode: e.target.value,
        taskId: taskItemsObj.taskId,
      });
      if (tagRes && Object.keys(tagRes).indexOf('failed') !== -1 && tagRes.failed) {
        notification.error({
          message: tagRes.message,
          duration: 5,
        });
      } else {
        if (!tagRes) {
          return;
        }
        if (!tagRes.itemId) {
          notification.error({
            message: '该任务下未查询到投料码信息，请重新扫描输入！',
            duration: 5,
          });
          return;
        }
        const { tagId, tagCode } =
          snNumObj && snNumObj.wipLineList
            ? snNumObj.wipLineList[0]
            : { tagId: null, tagCode: null };
        const params = {
          organizationId: userSetting.organizationId,
          organizationCode: userSetting.organizationCode,
          taskId: taskItemsObj.taskId,
          taskNum: taskItemsObj.taskNum,
          workerId: workerObj.workerId,
          worker: workerObj.workerCode,
          prodLineId: null,
          prodLineCode: null,
          workcellId: workcellObj.workcellId,
          workcellCode: workcellObj.workcellCode,
          calendarDay: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          calendarShiftCode: 'MORNING SHIFT',
          assemblyTagId: tagId,
          assemblyTagCode: tagCode || querySnNum,
          issuedTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          issueTaskItemList: [
            {
              itemId: tagRes.itemId,
              itemCode: tagRes.itemCode,
              uomId: tagRes.uomId,
              uom: tagRes.uom,
              taskItemLineId: tagRes.taskItemLineId,
              itemControlType: tagRes.itemControlType,
              warehouseId: workcellObj.issueWarehouseId,
              warehouseCode: workcellObj.issueWarehouseCode,
              wmAreaId: workcellObj.issueWmAreaId,
              wmAreaCode: workcellObj.issueWmAreaCode,
              lineList: tagRes.lineList,
              // [
              //   {
              //     issuedOkQty: tagObj.quantity,
              //     lotId: tagObj.lotId,
              //     lotNumber: tagObj.lotNumber,
              //     tagCode: tagObj.tagCode,
              //     tagId: tagObj.tagId,
              //   },
              // ],
            },
          ],
        };
        const res = await issueTask(params);
        if (res && res.failed) {
          notification.error({
            message: res.message,
            duration: 5,
          });
        } else {
          setQueryFeedNum(null);
          notification.success({
            message: '提交成功',
          });

          const respBarcodeQty = await getBarcodeQty(taskItemsObj.taskId, querySnNum);
          if (
            respBarcodeQty &&
            currentExecutedFeedNumCount < Number(respBarcodeQty.barcodeBomUsage) - 1
          ) {
            setCurrentExecutedFeedNumCount(Number(respBarcodeQty.barcodeExecuteQty));
            changeFocus('feed');
          } else {
            setCurrentExecutedFeedNumCount(0);
            changeFocus('sn');
          }
        }
      }
    }
  }

  function exitPage() {
    Modal.confirm({
      title: '确认',
      children: <div>退出界面将会导致界面上的数据丢失，请确定是否要退出界面</div>,
    }).then((button) => {
      if (button === 'ok') {
        // 退出
        history.push('/workplace');
        closeTab('/pub/jc/one-piece-flow-report');
      }
    });
  }

  function openInspection() {
    // 打开报检窗口
    inspectModal = Modal.open({
      key: 'jc-one-piece-flow-report-inspect-modal',
      title: '报检',
      className: styles['jc-one-piece-flow-report-inspect-modal'],
      children: (
        <InspectModal
          userSetting={userSetting}
          workerObj={workerObj}
          moNumObjTemp={moNumObj}
          workcellObj={workcellObj}
          operationObjTemp={operationObj}
          onInspectionModalClose={handleInspectionModalClose}
        />
      ),
      closable: true,
      footer: null,
    });
  }

  function handleInspectionModalClose() {
    inspectModal.close();
  }

  function handlingException() {
    if (!queryDataDone) {
      notification.warning({
        message: '请先输入完整的员工、工单、工位、工序信息',
      });
      return;
    }
    // 打开异常处理窗口
    exceptionModal = Modal.open({
      key: 'jc-one-piece-flow-report-exception-modal',
      title: '异常处理',
      className: styles['jc-one-piece-flow-report-inspect-modal'],
      children: (
        <ExceptionModal
          userSetting={userSetting}
          workerObj={workerObj}
          workcellObj={workcellObj}
          taskItemsObj={taskItemsObj}
          onInspectionModalClose={handleExceptionModalClose}
        />
      ),
      closable: true,
      footer: null,
    });
  }

  function handleExceptionModalClose() {
    exceptionModal.close();
  }

  return (
    <React.Fragment>
      <SubHeader
        workerName={workerName}
        workerObj={workerObj}
        changeWorker={changeWorker}
        changeMoNum={changeMoNum}
        moNum={moNum}
        moNumObj={moNumObj}
        searchMoNum={searchMoNum}
        searchWorker={searchWorker}
        workcellName={workcellName}
        workcellObj={workcellObj}
        changeWorkcell={changeWorkcell}
        searchWorkcell={searchWorkcell}
        operationName={operationName}
        operationObj={operationObj}
        changeOperation={changeOperation}
        searchOperation={searchOperation}
        exitPage={exitPage}
        workerNameRef={workerNameRef}
        moNumRef={moNumRef}
        workcellNameRef={workcellNameRef}
        operationNameRef={operationNameRef}
        openInspection={openInspection}
        handlingException={handlingException}
      />
      {queryDataDone && (
        <div className={styles['jiachen-opfr-main']}>
          <ReportLeft
            taskItemsObj={taskItemsObj}
            feedingFlag={feedingFlag}
            commitSnNum={commitSnNum}
            querySnNum={querySnNum}
            changeSnNum={changeSnNum}
            commitFeedNum={commitFeedNum}
            queryFeedNum={queryFeedNum}
            changeFeedNum={changeFeedNum}
            querySnNumRef={querySnNumRef}
            queryFeedNumRef={queryFeedNumRef}
            taskQtyObj={taskQtyObj}
            barcodeQtyObj={barcodeQtyObj}
            disabledSnNum={disabledSnNum}
            snNumObj={snNumObj}
          />
          <ReportRight
            technologyFiles={technologyFiles}
            currentFile={currentFile}
            currentIndex={currentIndex}
            handleChangeFilePrevious={handleChangeFilePrevious}
            handleChangeFileNext={handleChangeFileNext}
            pdfRef={pdfRef}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default OnePieceFlowReport;
