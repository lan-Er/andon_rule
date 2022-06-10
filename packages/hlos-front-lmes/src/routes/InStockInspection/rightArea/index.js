/*
 * @Description: 右侧区域
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-06-09 14:48:50
 */

import React from 'react';
import { Tabs } from 'choerodon-ui';

import InspectionContent from './inspectionContent.js';
import ExceptionContent from './exceptionContent.js';
import DetailsContent from './detailsContent.js';
import style from '../index.less';

const { TabPane } = Tabs;

export default function RightContent({
  samplingType,
  itemControlType,
  inspectionList,
  detailsList,
  defaultList,
  exceptionList,
  onQualifiedChange,
  onUnqualifiedChange,
  onDetailsQualifiedQty,
  onDetailsUnqualifiedQty,
  onSwitchJudge,
  onActiveMode,
  onDetailsRemark,
  onPicturesModal,
  onAbnormalChange,
}) {
  return (
    <div className={style['right-content']}>
      <Tabs defaultActiveKey="1" animated={false}>
        {samplingType !== 'NONE' ? (
          <TabPane tab="样品" key="1">
            <InspectionContent
              inspectionList={inspectionList}
              onQualifiedChange={onQualifiedChange}
              onUnqualifiedChange={onUnqualifiedChange}
            />
          </TabPane>
        ) : null}
        <TabPane tab="明细" key="2">
          <DetailsContent
            itemControlType={itemControlType}
            defaultList={defaultList}
            detailsList={detailsList}
            onDetailsQualifiedQty={onDetailsQualifiedQty}
            onDetailsUnqualifiedQty={onDetailsUnqualifiedQty}
            onSwitchJudge={onSwitchJudge}
            onActiveMode={onActiveMode}
            onDetailsRemark={onDetailsRemark}
          />
        </TabPane>
        <TabPane tab="异常" key="3">
          <ExceptionContent
            exceptionList={exceptionList}
            onPicturesModal={onPicturesModal}
            onAbnormalChange={onAbnormalChange}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
