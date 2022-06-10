/**
 * @Description: 生产报废 - left
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-07-12 09:53:08
 * @LastEditors: Please set LastEditors
 */

import React from 'react';
import { Icon, Popconfirm } from 'choerodon-ui';
import Icons from 'components/Icons';
import intl from 'utils/intl';
import emptyPage from 'hlos-front/lib/assets/icons/empty-page.svg';
import lotImg from 'hlos-front/lib/assets/icons/rec-lot.svg';
import tagImg from 'hlos-front/lib/assets/icons/rec-tag.svg';
import qtyImg from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import styles from './index.less';

const ContentRight = ({
  taskList,
  currentListItem,
  onMoClick,
  onListItemClick,
  onListItemDel,
  onOpenLineModal,
}) => {

  function imgRender(type) {
    let imgSrc = qtyImg;
    if (type === 'LOT') {
      imgSrc = lotImg;
    } else if (type === 'TAG') {
      imgSrc = tagImg;
    }
    return <img src={imgSrc} alt="" />;
  }
  return (
    <div className={styles['production-scrap-main-right']}>
      <div className={styles['production-scrap-main-right-title']}>
        <Icons type="a-ziyuan1521" size="24" />
        <span>报工信息</span>
      </div>
      {taskList.length ? (
        <div className={styles['production-scrap-main-right-list']}>
          {taskList.map((i, idx) => {
            return (
              <div
                key={i.taskItemLineId}
                className={`${styles['list-item']} ${currentListItem.taskItemLineId === i.taskItemLineId && styles.active}`}
                onClick={() => onListItemClick(i)}
              >
                <div className={styles['item-left']}>
                  {imgRender(i.itemControlType)}
                  <div>
                    <div className={styles.order}>
                      <div>
                        <div className={styles.mo} onClick={() => onMoClick(i)}>{i.moNum}</div>
                        <div className={styles.task}>{i.taskNum}</div>
                      </div>
                      <div className={styles.status}>{i.taskStatusMeaning}</div>
                    </div>
                    <div className={styles.item}>{i.itemCode} {i.itemDescription}</div>
                    <div className={styles.other}>
                      <div>操作工 {i.workerName}</div>
                      <div onClick={() => onOpenLineModal(false)}>
                        {i.operation} {i.warehouseName} {i.wmAreaName}
                        <Icon type="expand_more" />
                      </div>
                      <div>已报废 {i.scrappedQty} {i.uomName}</div>
                    </div>
                  </div>
                </div>
                <div className={styles['item-right']}>
                  <div className={styles['qty-title']}>本次报废</div>
                  <div className={styles.qty}>
                    {i.currentScrappedQty || 0}
                    <span className={styles.uom}>{i.uomName}</span>
                  </div>
                </div>
                <div className={styles['item-delete']}>
                  <Popconfirm
                    okText={intl.get('hzero.common.button.sure').d('确定')}
                    cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                    title={intl.get('hocr.commonOcr	view.message.deleteConfirm').d('是否删除')}
                    onConfirm={e => onListItemDel(e, idx, i)}
                  >
                    <Icons type="delete" size="32" color="#999" />
                  </Popconfirm>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles['production-scrap-main-right-empty']}>
          <img src={emptyPage} alt="" />
          <div className={styles['empty-message']}>暂无数据</div>
          <div className={styles['empty-confirm']}>请先扫描MO号</div>
        </div>
      )}
    </div>
  );
};

export default ContentRight;