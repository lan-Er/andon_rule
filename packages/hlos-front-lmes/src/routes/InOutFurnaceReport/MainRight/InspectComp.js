/**
 * @Description: 进出炉报工--MainRight-检验
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { TextField, NumberField, Select } from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';
import deleteIcon from 'hlos-front/lib/assets/icons/delete.svg';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import styles from './index.less';

export default ({
  ds,
  currentInspectList,
  currentTab,
  onChangeTab,
  onTagChange,
  onDelTagItem,
  onTagQtyChange,
}) => {
  return (
    <div className={styles.washOrInspect}>
      <div className={styles['tabs-wrapper']}>
        <div className={styles.tabs}>
          <div
            className={currentTab === 'ing' ? `${styles.active}` : null}
            onClick={() => onChangeTab('ing')}
          >
            待检验
          </div>
          <div
            className={currentTab === 'ed' ? `${styles.active}` : null}
            onClick={() => onChangeTab('ed')}
          >
            已检验
          </div>
        </div>
        {currentTab === 'ing' ? (
          <div>
            <TextField
              dataSet={ds}
              name="tagCode"
              placeholder="请录入标签号"
              suffix={<img src={scanIcon} alt="" />}
              onChange={onTagChange}
            />
          </div>
        ) : (
          <div className={styles['inspect-top-right']}>
            <NumberField dataSet={ds} name="defaultQty" placeholder="数量" />
            <div>
              <Select dataSet={ds} name="qcType" clearButton={false} />
              <TextField
                dataSet={ds}
                name="tagCode"
                placeholder="请录入标签号"
                suffix={<img src={scanIcon} alt="" />}
                onChange={(val) => onTagChange(val, true)}
              />
            </div>
          </div>
        )}
      </div>
      <div className={styles['list-wrapper']}>
        {currentInspectList.map((i) => {
          return (
            <div key={uuidv4()} className={styles['list-item']}>
              <div className={styles['list-item-left']}>
                <p>
                  {i.tagCode}
                  {currentTab === 'ed' && (
                    <span className={`${styles.status} ${styles[i.qcType]}`}>
                      {i.qcTypeMeaning}
                    </span>
                  )}
                </p>
                <p>
                  {i.itemCode}
                  <span>{i.itemDescription}</span>
                </p>
              </div>
              <div className={styles['list-item-right']}>
                {currentTab === 'ing' ? (
                  <span className={styles['ing-qty']}>
                    {i.executeQty} {i.uomName}
                  </span>
                ) : (
                  <NumberField
                    value={i.executeQty}
                    onChange={(val) => onTagQtyChange(val, i, true)}
                    min={0}
                  />
                )}
                {currentTab === 'ed' && <span className={styles.uom}>{i.uomName}</span>}
                <img src={deleteIcon} alt="" onClick={() => onDelTagItem(i, currentTab === 'ed')} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
