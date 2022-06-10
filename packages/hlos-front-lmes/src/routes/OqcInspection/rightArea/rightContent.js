/*
 * @Description: 执行页右侧区域
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-10 14:47:22
 */

import React from 'react';
import { Tabs } from 'choerodon-ui';
import style from '../index.less';
import InspectionContent from './inspectionContent';
import ExceptionContent from './exceptionContent';

const {TabPane} = Tabs;

export default function RightContent({
  data,
  toNumCheck,
  toExpNumCheck,
  onPicturesModal,
  onQualifiedChange,
  onUnqualifiedChange,
  onSwitchChange,
  onChangePage,
  onAbnormalChange,
}) {
  return (
    <div className={style['right-content']}>
      {
        Object.keys(data).length ? (
          <>
            <div className={style['header-info']}>
              <div>
                <span>{data.inspectionDocNum}</span>
                <span className={style.status}>{data.samplingTypeMeaning}</span>
              </div>
              <div className={style['group-name']}>{data.inspectionGroupName}</div>
            </div>
            <Tabs defaultActiveKey="1" type="card" animated={false}>
              <TabPane
                tab={`检验项(${data.lineList ? data.lineList.length : 0})`}
                key="1"
              >
                <InspectionContent
                  data={data}
                  onQualifiedChange={onQualifiedChange}
                  onUnqualifiedChange={onUnqualifiedChange}
                  onSwitchChange={onSwitchChange}
                  toNumCheck={toNumCheck}
                  onChangePage={onChangePage}
                />
              </TabPane>
              <TabPane
                tab={`不良原因(${data.exceptionList ? data.exceptionList.length : 0})`}
                key="2"
              >
                {
                  data.exceptionList && data.exceptionList.length ? (
                    <ExceptionContent
                      data={data}
                      onAbnormalChange={onAbnormalChange}
                      onPicturesModal={onPicturesModal}
                      toExpNumCheck={toExpNumCheck}
                    />
                  ) : null
                }
              </TabPane>
            </Tabs>
          </>
        ) : null
      }
    </div>
  );
}