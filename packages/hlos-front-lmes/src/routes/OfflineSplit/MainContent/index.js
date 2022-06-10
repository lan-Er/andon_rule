/**
 * @Description: 线下拆板--MainContent
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-23 13:54:08
 * @LastEditors: leying.yan
 */

import React from 'react';
import Icons from 'components/Icons';
import { Tabs } from 'choerodon-ui';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import style from './index.less';

export default ({
  ds,
  splitQuantity,
  bomSplitList,
  currentSnCode,
  onItemAdd,
  onQtyChange,
  onChildSnChange,
  onSplitQtyChange,
  onWarehouseChange,
  onWmAreaChange,
  onDelete,
  onChildSnInput,
}) => {
  return (
    <div className={style['right-content']}>
      <Tabs
        hideAdd
        type="editable-card"
        onEdit={onItemAdd}
        className={style['lmes-offline-split-tabs']}
        tabBarGutter={0}
        tabBarExtraContent={<Icons type="Group3" size="30" onClick={onItemAdd} />}
      >
        {bomSplitList &&
          bomSplitList.length > 0 &&
          bomSplitList.map((pane, index) => (
            <Tabs.TabPane
              closable={false}
              tab={
                pane.completedFlag ? (
                  <span>
                    <Icons type="check-circle" size={23} color="#22AF72" />
                    {pane.title}
                  </span>
                ) : (
                  pane.title || ''
                )
              }
            >
              <div className={style['tab-content']}>
                <LeftContent
                  {...pane}
                  splitQuantity={splitQuantity}
                  paneIndex={index}
                  currentSnCode={currentSnCode}
                  onQtyChange={onQtyChange}
                  onChildSnChange={onChildSnChange}
                  onChildSnInput={onChildSnInput}
                />
                <RightContent
                  {...pane}
                  paneIndex={index}
                  onSplitQtyChange={onSplitQtyChange}
                  onWarehouseChange={onWarehouseChange}
                  onWmAreaChange={onWmAreaChange}
                  onDelete={onDelete}
                  ds={ds}
                />
              </div>
            </Tabs.TabPane>
          ))}
      </Tabs>
    </div>
  );
};
