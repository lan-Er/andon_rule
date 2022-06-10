import React from 'react';
import { Button, TextField } from 'choerodon-ui/pro';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import exitIcon from 'hlos-front/lib/assets/icons/exit.svg';
import processorIcon from 'hlos-front/lib/assets/icons/processor.svg';
import documentIcon from 'hlos-front/lib/assets/icons/document.svg';
import styles from './index.less';
import oneStepIcon from '../../../assets/icons/oneStep.svg';
import stationIcon from '../../../assets/icons/station.svg';
// import user from '../../../assets/img/user.png';

export default ({
  workerName,
  workerObj,
  changeWorker,
  searchWorker,
  moNum,
  moNumObj,
  changeMoNum,
  searchMoNum,
  workcellName,
  workcellObj,
  changeWorkcell,
  searchWorkcell,
  operationName,
  // operationObj,
  changeOperation,
  searchOperation,
  exitPage,
  workerNameRef,
  moNumRef,
  workcellNameRef,
  operationNameRef,
  openInspection,
  handlingException,
}) => {
  return (
    <div className={styles['jiachen-opfr-sub-header']}>
      {/* <div className={styles.worker}>
        <img src={workerObj.fileUrl ? workerObj.fileUrl : user} alt="" />
      </div> */}
      <div className={styles.inputs}>
        <TextField
          ref={workerNameRef}
          placeholder="员工编码"
          prefix={<img src={processorIcon} alt="" />}
          suffix={<img src={scanIcon} alt="" />}
          clearButton
          value={workerName}
          onChange={changeWorker}
          onKeyDown={searchWorker}
        />
        <TextField
          ref={moNumRef}
          placeholder="工单编码"
          prefix={<img src={documentIcon} alt="" />}
          suffix={<img src={scanIcon} alt="" />}
          clearButton
          disabled={!workerObj || (workerObj && Object.keys(workerObj).length === 0)}
          value={moNum}
          onChange={changeMoNum}
          onKeyDown={searchMoNum}
        />
        <TextField
          ref={workcellNameRef}
          placeholder="工位"
          prefix={<img src={oneStepIcon} alt="" />}
          suffix={<img src={scanIcon} alt="" />}
          clearButton
          disabled={
            !workerObj ||
            (workerObj && Object.keys(workerObj).length === 0) ||
            !moNumObj ||
            (moNumObj && Object.keys(moNumObj).length === 0)
          }
          value={workcellName}
          onChange={changeWorkcell}
          onKeyDown={searchWorkcell}
        />
        <TextField
          ref={operationNameRef}
          placeholder="工序"
          prefix={<img src={stationIcon} alt="" />}
          suffix={<img src={scanIcon} alt="" />}
          clearButton
          disabled={
            !workerObj ||
            (workerObj && Object.keys(workerObj).length === 0) ||
            !moNumObj ||
            (moNumObj && Object.keys(moNumObj).length === 0) ||
            !workcellObj ||
            (workcellObj && Object.keys(workcellObj).length === 0)
          }
          value={operationName}
          onChange={changeOperation}
          onKeyDown={searchOperation}
        />
      </div>
      <Button color="primary" onClick={openInspection}>
        报检
      </Button>
      <Button color="primary" onClick={handlingException}>
        异常处理
      </Button>
      <div className={styles.worker}>
        <img src={exitIcon} alt="" onClick={exitPage} />
      </div>
    </div>
  );
};
