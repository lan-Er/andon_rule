/**
 * @Description: 单件流报工--LoginModal
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-16 09:41:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Select, DatePicker, Lov, Form, Button, Switch } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import styles from '../index.less';

export default ({ onLogin, ds, onExit, onWorkcellChange }) => {
  return (
    <div>
      <Form dataSet={ds} labelLayout="placeholder">
        <Lov name="workerObj" placeholder="操作工" />
        <Lov name="workcellObj" placeholder="工位" onChange={onWorkcellChange} />
        <div className={styles.date}>
          <DatePicker name="calendarDay" placeholder="请选择时间" />
          <Select name="calendarShiftCode" placeholder="班次" />
        </div>
        <div className={styles.rework}>
          <div>返修</div>
          <div>
            <Switch name="reworkFlag" />
          </div>
        </div>
      </Form>
      <Button color="primary" onClick={onLogin}>
        登录
      </Button>
      <span className={styles['exit-btn']} onClick={onExit}>
        <Icons type="exit" size="24" />
      </span>
    </div>
  );
};
