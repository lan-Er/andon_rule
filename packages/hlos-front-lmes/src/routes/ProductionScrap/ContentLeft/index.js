/**
 * @Description: 生产报废 - left
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-07-12 09:53:08
 * @LastEditors: Please set LastEditors
 */

import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import uuidv4 from 'uuid/v4';
import { TextField, Button, NumberField, Tooltip } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import emptyPage from 'hlos-front/lib/assets/icons/empty-page.svg';
import styles from './index.less';

const ContentLeft = ({
  loginData,
  currentListItem,
  currentListItem: {
    childrenList = [],
    itemControlType,
    taskQty = 0,
    processOkQty = 0,
    processNgQty = 0,
    reworkQty = 0,
    scrappedQty = 0,
    rawNgQty = 0,
    pendingQty = 0,
    wipQty = 0,
    uomName,
    currentScrappedQty = 0,
  },
  onMoChange,
  onTaskChange,
  onLotOrTagChange,
  onScrappedQtyChange,
  onLineDel,
  onQtyChange,
  onStart,
  onPause,
  onSubmit,
}) => {
  const [reportType, setReportType] = useState('MO');

  useEffect(() => {
    if (loginData.reportType) {
      setReportType(loginData.reportType);
    }
  }, [loginData]);

  return (
    <div className={styles['production-scrap-main-left']}>
      <div className={styles['input-area']}>
        <div className={styles['mo-input']}>
          <TextField
            placeholder={`请扫描或输入${reportType === 'TASK' ? '任务' : 'MO'}`}
            onChange={reportType === 'TASK' ? onTaskChange : onMoChange}
          />
          <div className={styles['scan-icon']}>
            <Icons type="scan" size="36" color="#fff" />
          </div>
        </div>
        {!isEmpty(currentListItem) ? (
          <div>
            <div className={styles.execute}>
              <span>可执行</span>
              <span className={styles.qty}>
                {taskQty -
                  processOkQty -
                  processNgQty -
                  scrappedQty -
                  rawNgQty -
                  reworkQty -
                  pendingQty -
                  wipQty}
              </span>
              <span className={styles.uom}>{uomName}</span>
            </div>
            {itemControlType === 'QUANTITY' ? (
              <div className={styles['qty-input']}>
                <div className={styles['qty-title']}>本次报废数量</div>
                <div>
                  <NumberField
                    addonAfter={uomName}
                    min={0}
                    value={currentScrappedQty}
                    onChange={onQtyChange}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className={styles['lot-tag-input']}>
                  <TextField
                    placeholder={`请录入或扫描${itemControlType === 'TAG' ? '标签' : '批次'}`}
                    suffix={<Icons type="scan" size="24" color="#1C879C" />}
                    onChange={(val) => onLotOrTagChange(val, itemControlType)}
                  />
                </div>
                <div className={styles['lot-tag-list-wrapper']}>
                  <div className={styles['list-title']}>
                    <div>{itemControlType === 'TAG' ? '标签' : '批次'}(0)</div>
                    <div>
                      报废数量({currentScrappedQty} {uomName})
                    </div>
                  </div>
                  {childrenList.length ? (
                    childrenList.map((i, idx) => {
                      return (
                        <div className={styles.list} key={uuidv4()}>
                          <div className={styles['list-item']}>
                            <div>
                              <Tooltip title={itemControlType === 'TAG' ? i.tagCode : i.lotNumber}>
                                {itemControlType === 'TAG' ? i.tagCode : i.lotNumber}
                              </Tooltip>
                            </div>
                            <div>
                              <div>
                                <NumberField
                                  value={i.scrappedQty}
                                  onChange={(val) => onScrappedQtyChange(val, idx)}
                                  min={0}
                                />
                                <span className={styles.uom}>{uomName}</span>
                              </div>
                              <Icons
                                type="delete"
                                size="20"
                                color="#999"
                                onClick={(e) => onLineDel(e, idx)}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles['list-empty']}>
                      <img src={emptyPage} alt="" />
                      <div className={styles['empty-message']}>暂无数据</div>
                      <div className={styles['empty-confirm']}>
                        请在上方扫描或输入{itemControlType === 'TAG' ? '标签' : '批次'}号
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <div className={styles.btns}>
        <div className={`${isEmpty(currentListItem) && styles.disabled}`}>
          <span onClick={onStart}>
            <Icons type="starts" size="20" />
            <span>开工</span>
          </span>
          <span onClick={onPause}>
            <Icons type="suspended" size="20" />
            <span>暂停</span>
          </span>
        </div>
        <Button disabled={isEmpty(currentListItem)} onClick={onSubmit}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default ContentLeft;
