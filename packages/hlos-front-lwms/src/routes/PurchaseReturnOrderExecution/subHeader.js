/*
 * @Description: 采购退货单执行-二级头
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-12-28 15:11:11
 */

import React from 'react';
import { Lov, TextField } from 'choerodon-ui/pro';

import workerIcon from 'hlos-front/lib/assets/icons/processor.svg';
import documentIcon from 'hlos-front/lib/assets/icons/document.svg';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import orgIcon from 'hlos-front/lib/assets/icons/org.svg';

import style from './index.less';

// import workerIcon from './assets/worker.svg';
// import scanIcon from './assets/scan.svg';
// import itemIcon from './assets/itemIcon.svg';
// import timeIcon from './assets/time.svg';

const SubHeader = (props) => {
  return (
    <div className={style['performance-sub-header']}>
      <div className={style['lov-suffix']}>
        <img className={style['left-icon']} src={orgIcon} alt="" />
        <Lov
          dataSet={props.headerDS}
          name="organizationObj"
          className={style['space-left']}
          placeholder="组织"
          onChange={(value) => props.onQuery(value, 'organizationObj')}
          noCache
        />
      </div>
      <div className={style['lov-suffix']}>
        <img className={style['left-icon']} src={workerIcon} alt="" />
        <Lov
          dataSet={props.headerDS}
          name="workerObj"
          className={style['space-left']}
          placeholder="操作工"
          onChange={(value) => props.onQuery(value, 'workerObj')}
          noCache
        />
      </div>
      <div className={style['lov-suffix']}>
        <img className={style['left-icon']} src={documentIcon} alt="" />
        <img className={style['right-icon']} src={scanIcon} alt="" />
        <TextField
          dataSet={props.headerDS}
          name="deliveryReturnNum"
          className={style['space-left']}
          placeholder="采购退货单"
          onChange={(value) => props.onQuery(value, 'deliveryReturnNum')}
          noCache
        />
      </div>
    </div>
  );
};

export default SubHeader;
