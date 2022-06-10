import React from 'react';
import Icons from 'components/Icons';
import { Lov, Select, Button, Radio, DatePicker, Form } from 'choerodon-ui/pro';

import styles from './style.less';

export default (props) => {
  return (
    <Form dataSet={props.ds} className={styles.login} labelLayout="placeholder">
      <Lov name="workerObj" placeholder="请输入操作工" />
      {props.loginCheckArr.length > 1 && (
        <div className={styles.other}>
          <p>其他选项</p>
          {props.loginCheckArr.map((i) => {
            return (
              <Radio
                name="other"
                value={i.key}
                onChange={(val) => props.onRadioChange(val, props.loginCheckArr)}
                defaultChecked={i.key === props.value}
              >
                {i.name}
              </Radio>
            );
          })}
        </div>
      )}
      {props.value === 'prodLine' && <Lov name="prodLineObj" placeholder="请选择产线" />}
      {props.value === 'workcell' && <Lov name="workcellObj" placeholder="请选择工位" />}
      {props.value === 'equipment' && <Lov name="equipmentObj" placeholder="请选择设备" />}
      {props.value === 'workerGroup' && <Lov name="workerGroupObj" placeholder="请选择班组" />}
      <div className={styles.other}>
        <p>选择时间</p>
        <div className={styles['login-modal-select']}>
          <DatePicker name="date" placeholder="请选择时间" style={{ width: 330 }} />
          <Select
            name="shift"
            style={{ width: 132, marginLeft: 16 }}
            dropdownMenuStyle={{ fontSize: 20 }}
          />
        </div>
      </div>
      <Button className={styles.btn} onClick={props.onLoginClick}>
        登录
      </Button>
      <span className={styles['exit-btn']} onClick={props.onExit}>
        <Icons type="exit" size="24" />
      </span>
    </Form>
  );
};
