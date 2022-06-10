/**
 * @Description: 线下拆板--LoginModal
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-23 09:41:08
 * @LastEditors: leying.yan
 */

import React from 'react';
import { Lov, Form, Button } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import styles from '../index.less';

export default ({ onLogin, ds, onExit, onWarehouseChange }) => {
  return (
    <div>
      <Form dataSet={ds} labelLayout="placeholder">
        <Lov name="workerObj" placeholder="操作工" />
        <Lov
          name="warehouseObj"
          placeholder="仓库"
          onChange={(value) => onWarehouseChange(value)}
        />
        <Lov name="wmAreaObj" placeholder="货位" />
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
