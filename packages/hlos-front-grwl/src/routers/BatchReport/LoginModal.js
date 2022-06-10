/**
 * @Description: 批量报工--LoginModal
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-01-23 11:01:22
 * @LastEditors: yu.na
 */

import React from 'react';
import Icons from 'components/Icons';
import { Lov, Select, Button, Radio, DatePicker, Form } from 'choerodon-ui/pro';

import styles from './style.less';

export default ({ loginCheckArr, ds, lovType, onExit, onOk, onTypeChange, onRadioChange }) => {
  return (
    <Form dataSet={ds} className={styles.login} labelLayout="placeholder">
      <Lov name="workerObj" placeholder="请输入操作工" />
      {lovType === 'prodline' && <Lov name="prodlineObj" placeholder="请选择产线" />}
      {lovType === 'workcell' && <Lov name="workcellObj" placeholder="请选择工位" />}
      {lovType === 'equipment' && <Lov name="equipmentObj" placeholder="请选择设备" />}
      {lovType === 'workergroup' && <Lov name="workergroupObj" placeholder="请选择班组" />}
      <div className={styles.other}>
        <p>选择时间</p>
        <div className={styles['login-modal-select']}>
          <DatePicker name="date" placeholder="请选择时间" style={{ width: 330 }} />
          <Select
            name="calendarShiftCode"
            style={{ width: 132, marginLeft: 16 }}
            dropdownMenuStyle={{ fontSize: 20 }}
          />
        </div>
      </div>
      <Select name="reportType" dropdownMenuStyle={{ fontSize: 20 }} onChange={onTypeChange} />
      {/* {loginCheckArr.length > 1 && ( */}
      <div className={styles.other}>
        <p>其他选项</p>
        {loginCheckArr.map((i) => {
          return (
            <Radio
              name="other"
              key={i.key}
              value={i.key}
              onChange={(val) => onRadioChange(val, loginCheckArr)}
            >
              {i.name}
            </Radio>
          );
        })}
      </div>
      {/* )} */}
      <Button className={styles.btn} onClick={onOk}>
        登录
      </Button>
      <span className={styles['exit-btn']} onClick={onExit}>
        <Icons type="exit" size="24" />
      </span>
    </Form>
  );
};
