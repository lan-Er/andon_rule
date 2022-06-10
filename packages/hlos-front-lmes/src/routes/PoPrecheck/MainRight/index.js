/**
 * @Description: po预检--MainRight
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-05 13:54:08
 * @LastEditors: leying.yan
 */

import React, { useState } from 'react';
import TabComp from './TabComp';
import style from './index.less';

export default ({
  ds,
  inspectionList,
  exceptionList,
  onAbnormalChange,
  onNumberChange,
  onPicturesChange,
}) => {
  const [currentTab, setCurrentTab] = useState('inspection');

  function onChangeTab(value) {
    setCurrentTab(value);
  }

  return (
    <div className={style['right-content']}>
      <TabComp
        ds={ds}
        onChangeTab={onChangeTab}
        currentTab={currentTab}
        inspectionList={inspectionList}
        exceptionList={exceptionList}
        onNumberChange={onNumberChange}
        onAbnormalChange={onAbnormalChange}
        onPicturesChange={onPicturesChange}
      />
    </div>
  );
};
