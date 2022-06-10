/**
 * @Description: 生产报废 - 登录弹窗
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-07-12 09:53:08
 * @LastEditors: Please set LastEditors
 */

import React, { useEffect, useState } from 'react';
import { Lov, Select, Button, DatePicker, Radio } from 'choerodon-ui/pro';
import styles from './index.less';

const LoginModal = ({
  ds,
  resourceList,
  loginData,
  onResourceChange,
  onExit,
  onOk,
}) => {

  const [resourceType, setResourceType] = useState('workcell');

  useEffect(() => {
    if(loginData.resourceType) {
      setResourceType(loginData.resourceType);
    }
  }, [loginData]);

  function handleResourceChange(val) {
    setResourceType(val);
    onResourceChange(val);
  }

  function handleRadioChange(val) {
    ds.current.set('reportType', val);
  }

  return (
    <div className={styles['modal-body']}>
      <div className={styles['modal-main']}>
        <div>
          <div>操作人员</div>
          <Lov dataSet={ds} name="workerObj" />
        </div>
        <div>
          <div>报工方式</div>
          <div className={styles['report-type']}>
            <Radio
              dataSet={ds}
              name="reportType"
              value="MO"
              mode="button"
              onChange={handleRadioChange}
            >
              工单
            </Radio>
            <Radio
              dataSet={ds}
              name="reportType"
              value="TASK"
              mode="button"
              onChange={handleRadioChange}
            >
              任务
            </Radio>
          </div>
        </div>
        <div>
          <div>资源类型</div>
          <div className={styles['concat-input']}>
            <div className={styles['select-wrapper']}>
              <Select value={resourceType} onChange={handleResourceChange}>
                {resourceList.map(i => {
                  return <Select.Option key={i.key} value={i.key}>{i.name}</Select.Option>;
                })}
              </Select>
            </div>
            <Lov dataSet={ds} name={`${resourceType}Obj`} style={{ width: '75%' }} />
          </div>
        </div>
        <div>
          <div>时间</div>
          <div className={styles['concat-input']}>
            <div className={styles['select-wrapper']}>
              <Select dataSet={ds} name="shiftCode" />
            </div>
            <DatePicker dataSet={ds} name="date" style={{ width: '78%' }} />
          </div>
        </div>
      </div>
      <div className={styles['modal-footer']}>
        <div
          className={styles['exit-btn']}
          onClick={onExit}
        >
          退出登录
        </div>
        <Button
          onClick={onOk}
        >
          确认
        </Button>
      </div>
    </div>
  );
};

export default LoginModal;