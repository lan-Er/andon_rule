import React from 'react';
import { Lov } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import styles from './index.less';

const Header = ({ currentAvator, listDS, headerDS, onMoChange, onHeaderWhWmChange }) => {
  return (
    <div className={styles['mo-return-material-header']}>
      <div className={styles.avator}>
        <img src={currentAvator} alt="" />
      </div>
      <div className={styles['select-area']}>
        <div>
          <Lov
            dataSet={headerDS}
            name="workerObj"
            prefix={<Icons type="processor" color="#0C6B7E" size="24" />}
          />
        </div>
        <div className={styles['input-item']}>
          <Lov dataSet={listDS.queryDataSet} name="moObj" onChange={onMoChange} />
          <Icons type="scan1" color="#0C6B7E" size="24" />
        </div>
        <div>
          <Lov
            dataSet={headerDS}
            name="warehouseObj"
            prefix={<Icons type="warehouse" color="#0C6B7E" size="24" />}
            onChange={(rec) => onHeaderWhWmChange(rec, 'warehouse')}
          />
        </div>
        <div>
          <Lov
            dataSet={headerDS}
            name="wmAreaObj"
            prefix={<Icons type="wm-area" color="#0C6B7E" size="24" />}
            onChange={(rec) => onHeaderWhWmChange(rec, 'wmArea')}
          />
        </div>
      </div>
    </div>
  );
};
export default Header;
