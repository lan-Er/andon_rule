import React, { useState, useEffect } from 'react';
import { Form } from 'choerodon-ui/pro';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import styles from './index.less';

let timeId = null;

const Header = (props) => {
  const {
    formRender,
    formData: { formDs, resourceName, avator },
  } = props;

  const [currentTime, setTime] = useState(moment().format(DEFAULT_DATETIME_FORMAT));

  useEffect(() => {
    timeId = setInterval(() => {
      setTime(moment().format(DEFAULT_DATETIME_FORMAT));
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, [formDs]);

  return (
    <div className={styles['dispatch-order-report-header']}>
      <img className={styles.avator} src={avator} alt="" />
      <div className={styles['form-area']}>
        <Form columns={3} labelLayout="placeholder">
          {formRender()}
        </Form>
      </div>
      <div className={styles['info-box']}>
        <span>{currentTime}</span>
        <span>{resourceName}</span>
      </div>
    </div>
  );
};

export default Header;
