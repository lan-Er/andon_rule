/**
 * @Description: 进出炉报工--MainRight
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React, { useState, useEffect } from 'react';
import RegistComp from './RegistComp';
import PrepareOrBindComp from './PrepareOrBindComp';
import InOrOutComp from './InOrOutComp';
import WashComp from './WashComp';
import InspectComp from './InspectComp';

import styles from './index.less';

export default ({
  ds,
  snRef,
  containerRef,
  lotRef,
  currentActive,
  onQueryInOrOutList,
  list = [],
  inspectedList = [],
  bindList = [],
  showSupplierLov,
  onWorkcellChange,
  // onChangeInspectTab,
  onTagChange,
  onTagQtyChange,
  onDelTagItem,
  onDelPrepareItem,
  onPrepareSnChange,
  onPrepareInputKeyDown,
}) => {
  const [currentTab, setCurrentTab] = useState(null);
  const [currentInspectList, setCurrentInspectList] = useState([]);

  useEffect(() => {
    if (currentActive.value === 'INSPECT') {
      setCurrentTab('ing');
    } else if (currentActive.value === 'IN' || currentActive.value === 'OUT') {
      setCurrentTab('inner');
    }
  }, [currentActive]);

  useEffect(() => {
    if (currentActive.value === 'INSPECT') {
      if (currentTab === 'ing') {
        setCurrentInspectList(list);
      } else if (currentTab === 'ed') {
        setCurrentInspectList(inspectedList);
      }
    }
  }, [currentTab, list, inspectedList]);

  function handleChangeTab(type) {
    setCurrentTab(type);
    if (currentActive.value === 'IN' || currentActive.value === 'OUT') {
      onQueryInOrOutList(type);
    }
    if (currentActive.value === 'INSPECT') {
      // onChangeInspectTab(type);
      if (type === 'ing') {
        setCurrentInspectList(list);
      } else if (type === 'ed') {
        setCurrentInspectList(inspectedList);
      }
    }
  }

  const commonProp = {
    ds,
    snRef,
    containerRef,
    lotRef,
    currentTab,
    list,
    currentInspectList,
    bindList,
    currentActive,
    showSupplierLov,
    onWorkcellChange,
    onTagChange,
    onTagQtyChange,
    onDelTagItem,
    onDelPrepareItem,
    onPrepareInputKeyDown,
    onPrepareSnChange,
    onChangeTab: handleChangeTab,
  };

  return (
    <div className={styles['main-right']}>
      {currentActive.value === 'REGISTER' && <RegistComp {...commonProp} />}
      {(currentActive.value === 'PREPARE' || currentActive.value === 'BIND') && (
        <PrepareOrBindComp {...commonProp} />
      )}
      {(currentActive.value === 'IN' || currentActive.value === 'OUT') && (
        <InOrOutComp {...commonProp} />
      )}
      {currentActive.value === 'WASH' && <WashComp {...commonProp} />}
      {currentActive.value === 'INSPECT' && <InspectComp {...commonProp} />}
    </div>
  );
};
