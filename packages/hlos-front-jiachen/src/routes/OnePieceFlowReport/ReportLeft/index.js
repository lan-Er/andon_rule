import React from 'react';
import { TextField } from 'choerodon-ui/pro';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import styles from './index.less';

export default ({
  feedingFlag,
  querySnNum,
  changeSnNum,
  commitSnNum,
  queryFeedNum,
  changeFeedNum,
  commitFeedNum,
  querySnNumRef,
  queryFeedNumRef,
  taskQtyObj,
  barcodeQtyObj,
  disabledSnNum,
  snNumObj,
}) => {
  return (
    <div className={styles['jiachen-opfr-report-left']}>
      <div style={{ width: '45%' }}>
        <div className={styles['head-title']}>
          {taskQtyObj.itemCode} 共{taskQtyObj.moTaskQty || 0} 已生产{taskQtyObj.moExecutedQty || 0}
        </div>
        <TextField
          ref={querySnNumRef}
          placeholder="请扫描或输入SN号"
          suffix={<img src={scanIcon} alt="" />}
          clearButton
          value={querySnNum}
          disabled={disabledSnNum}
          onChange={changeSnNum}
          onKeyDown={commitSnNum}
        />
      </div>
      {feedingFlag && (
        <div style={{ width: '45%' }}>
          <div className={styles['head-title']}>
            共需投{barcodeQtyObj.barcodeBomUsage || 0}条码 已投
            {barcodeQtyObj.barcodeExecuteQty || 0}
          </div>
          <TextField
            ref={queryFeedNumRef}
            placeholder="请扫描或输入投料码"
            suffix={<img src={scanIcon} alt="" />}
            clearButton
            value={queryFeedNum}
            disabled={!snNumObj || (snNumObj && Object.keys(snNumObj).length === 0)}
            onChange={changeFeedNum}
            onKeyDown={commitFeedNum}
          />
        </div>
      )}
    </div>
  );
};
