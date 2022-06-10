/**
 * @Description: 进出炉报工--MainRight-准备/氮化
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Switch, TextField, Lov } from 'choerodon-ui/pro';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import deleteIcon from 'hlos-front/lib/assets/icons/delete.svg';
import Icons from 'components/Icons';
import styles from './index.less';

export default ({
  bindList = [],
  ds,
  snRef,
  containerRef,
  lotRef,
  currentActive,
  showSupplierLov,
  onPrepareSnChange,
  onDelPrepareItem,
  onPrepareInputKeyDown,
}) => {
  return (
    <div className={styles.prepare}>
      <div className={styles['prepare-switch']}>
        <Switch dataSet={ds} name="ruleFlag" />
        <span>识别规则</span>
        {showSupplierLov && <Lov dataSet={ds} name="supplierObj" noCache />}
      </div>
      <div className={styles['prepare-input']}>
        <div className={styles['prepare-input-top']}>
          <div>
            <TextField
              ref={snRef}
              dataSet={ds}
              name="snNumber"
              placeholder="请录入SN号"
              suffix={<img src={scanIcon} alt="" />}
              onChange={onPrepareSnChange}
              onKeyDown={(e) => onPrepareInputKeyDown(e, 'snNumber')}
            />
          </div>
          <div>
            {currentActive.value === 'PREPARE' ? (
              <TextField
                ref={containerRef}
                dataSet={ds}
                name="containerNumber"
                placeholder="请录入容器号"
                suffix={<img src={scanIcon} alt="" />}
                onKeyDown={(e) => onPrepareInputKeyDown(e, 'containerNumber')}
              />
            ) : (
              <TextField
                dataSet={ds}
                name="furnaceLot"
                placeholder="请录入炉批次"
                suffix={<img src={scanIcon} alt="" />}
                onKeyDown={(e) => onPrepareInputKeyDown(e, 'furnaceLot')}
              />
            )}
          </div>
        </div>
        {currentActive.value === 'PREPARE' && (
          <TextField
            ref={lotRef}
            dataSet={ds}
            name="furnaceLot"
            placeholder="请录入炉批次"
            suffix={<img src={scanIcon} alt="" />}
            onKeyDown={(e) => onPrepareInputKeyDown(e, 'furnaceLot')}
          />
        )}
      </div>
      <div className={styles['prepare-bind-list']}>
        {bindList.map((i, idx) => {
          return (
            <div key={i.snNumber} className={styles['prepare-bind-list-item']}>
              <div className={styles['item-main']}>
                <div>
                  <div>{i.snNumber}</div>
                  {currentActive.value === 'PREPARE' && (
                    <div className={styles.pin}>
                      <Icons type="Group554" size="20" color="#999" />
                    </div>
                  )}
                  {currentActive.value === 'PREPARE' && <div>{i.containerNumber}</div>}
                </div>
                <div>
                  <span className={styles['furnace-lot']}>炉批次</span>
                  {i.furnaceLot}
                </div>
              </div>
              <img src={deleteIcon} alt="" onClick={() => onDelPrepareItem(idx)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
