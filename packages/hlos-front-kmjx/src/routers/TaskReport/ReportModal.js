/**
 * @Description: 任务报工--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { connect } from 'dva';
import { Select, Button, Form, NumberField } from 'choerodon-ui/pro';
import intl from 'utils/intl';
// import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';

import styles from './style.less';

const ReportModal = (props) => {
  async function handleOk() {
    const data = props.ds.toData();
    if (data[0].inspectType) {
      await props.handleRrportConfirm(data[0].inspectType);
    }
  }

  // // 弹框 --- 加减数量
  // async function handleUpdateCount(type, value) {
  //   // let number = reportBatchQty;
  //   if (type === 'add') {
  //     await setReportBatchQty(reportBatchQty + 1);
  //     props.handleChange(value + 1);
  //   } else if (reportBatchQty - 1 > 0) {
  //     await setReportBatchQty(reportBatchQty - 1);
  //     props.handleChange(value - 1);
  //   }
  // }

  function optionsFilter(record) {
    return props.footerExtraBtnArr.includes(record.get('value'));
  }

  return (
    <Form dataSet={props.ds} className={styles.login} labelLayout="placeholder">
      <Select name="inspectType" placeholder="请选择报检类型" optionsFilter={optionsFilter} />
      <div className="item-content">
        <span>{props.taskInfo.itemCode}</span>
        <span>{props.taskInfo.itemDescription}</span>
      </div>
      <div className="custom-counter">
        {/* <span className="counter-button" onClick={() => handleUpdateCount('minus', reportBatchQty)}>
          -
        </span> */}
        <NumberField
          className="counter-content"
          value={props.reportBatchQty}
          min={0}
          onChange={(value) => props.handleChange(value)}
        />
        {/* <span className="counter-button" onClick={() => handleUpdateCount('add', reportBatchQty)}>
          +
        </span> */}
      </div>
      <Button className={styles.btn} onClick={() => handleOk()}>
        {intl.get('hzero.common.button.submit').d('提交')}
      </Button>
    </Form>
  );
};

export default connect(({ taskReport }) => ({
  lotList: taskReport?.lotList || [],
}))(ReportModal);
