/**
 * @Description: 单件流报工--MainRight
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React, { useState, useEffect } from 'react';
import { Modal } from 'choerodon-ui/pro';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { getDetail } from '@/services/onePieceFlowReportService';
import RegistComp from './RegistComp';
import InOrOutComp from './InOrOutComp';
import IssueComp from './IssueComp';
import InspectComp from './InspectComp';
import PackComp from './PackComp';
import BindComp from './BindComp';
import UnbindComp from './UnbindComp';
import HistoryModal from './HistoryModal';

import styles from './index.less';

export default ({
  ds,
  unbindDS,
  currentActive,
  outTagInfo,
  outTagList,
  tagCode,
  bindObj,
  onQueryInOrOutList,
  list = [],
  issueTabs,
  issueData,
  loginData,
  leftData,
  isSubmit,
  inspectionList,
  exceptionList,
  autoPrint,
  setAutoPrint,
  // qcOkQty,
  // qcNgQty,
  currentResult,
  resultList,
  limitLength,
  rightUnbindList,
  onWorkcellChange,
  onDeleteOutTagItem,
  onChangeInspectTab,
  onExceptionClick,
  onInspectionItemChange,
  // onQcQtyChange,
  onChangeCurrentResult,
  onLimitChange,
  onUnbindInputChange,
  onUnbindItemChange,
  onUnbindLineChange,
  onOutTagCodeChange,
}) => {
  const [currentTab, setCurrentTab] = useState(null);

  useEffect(() => {
    if (currentActive.value === 'ISSUE') {
      setCurrentTab(issueTabs[0]);
      ds.current.set('itemControlType', issueTabs[0]);
    } else if (currentActive.value === 'INSPECT') {
      setCurrentTab('inspection');
    } else if (currentActive.value === 'IN' || currentActive.value === 'OUT') {
      setCurrentTab('inner');
    }
  }, [currentActive]);

  useEffect(() => {
    if (currentActive.value === 'ISSUE') {
      setCurrentTab(issueTabs[0]);
      ds.current.set('itemControlType', issueTabs[0]);
    }
  }, [isSubmit]);

  useEffect(() => {
    if (issueTabs.length) {
      setCurrentTab(issueTabs[0]);
      ds.current.set('itemControlType', issueTabs[0].toUpperCase());
    }
  }, [issueTabs]);

  function handleChangeTab(type) {
    setCurrentTab(type);
    if (currentActive.value === 'IN' || currentActive.value === 'OUT') {
      onQueryInOrOutList(type);
    }
    if (currentActive.value === 'ISSUE') {
      ds.current.set('itemControlType', type.toUpperCase());
    }
    if (currentActive.value === 'INSPECT') {
      onChangeInspectTab(type);
    }
  }

  async function handleShowHistoryModal() {
    let showList = [];
    const res = await getDetail({
      executeType: 'TASK_ISSUE',
      operation: ds.current.get('operationName'),
      organizationId: leftData?.wip?.organizationId,
      moId: leftData?.moId,
      moNum: leftData?.moNum,
      assemblyTagId: leftData?.tagId,
      assemblyTagCode: leftData?.tagCode,
    });
    if (getResponse(res) && res.content) {
      showList = res.content;
    }
    if (showList.length) {
      Modal.open({
        key: 'lmes-one-piece-flow-report-history-modal',
        title: '历史投料',
        className: styles['lmes-one-piece-flow-report-history-modal'],
        children: <HistoryModal list={showList} />,
        footer: null,
        closable: true,
      });
    } else {
      notification.warning({
        message: '暂无可查看历史',
      });
    }
  }

  const props = {
    currentTab,
    list,
    ds,
    onWorkcellChange,
    onChangeTab: handleChangeTab,
    onShowHistoryModal: handleShowHistoryModal,
  };

  const inspectProps = {
    inspectionList,
    exceptionList,
    // qcOkQty,
    // qcNgQty,
    currentResult,
    resultList,
    onExceptionClick,
    onInspectionItemChange,
    // onQcQtyChange,
    onChangeCurrentResult,
  };

  return (
    <div className={styles['main-right']}>
      {(currentActive.value === 'REGISTER' || currentActive.value === 'LOAD') && (
        <RegistComp {...props} />
      )}
      {(currentActive.value === 'IN' || currentActive.value === 'OUT') && (
        <InOrOutComp {...props} />
      )}
      {currentActive.value === 'ISSUE' && (
        <IssueComp {...props} tabs={issueTabs} loginData={loginData} issueData={issueData} />
      )}
      {currentActive.value === 'INSPECT' && <InspectComp {...props} {...inspectProps} />}
      {currentActive.value === 'PACK' && (
        <PackComp
          {...props}
          outTagInfo={outTagInfo}
          outTagList={outTagList}
          tagCode={tagCode}
          autoPrint={autoPrint}
          setAutoPrint={setAutoPrint}
          limitLength={limitLength}
          onDeleteOutTagItem={onDeleteOutTagItem}
          onLimitChange={onLimitChange}
          onOutTagCodeChange={onOutTagCodeChange}
        />
      )}
      {currentActive.value === 'BIND' && bindObj?.productCode && <BindComp bindObj={bindObj} />}
      {currentActive.value === 'UNBIND' && (
        <UnbindComp
          ds={unbindDS}
          list={rightUnbindList}
          onUnbindInputChange={onUnbindInputChange}
          onUnbindItemChange={onUnbindItemChange}
          onUnbindLineChange={onUnbindLineChange}
        />
      )}
    </div>
  );
};
