/*
 * @Description: 明细行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-26 15:30:42
 */

import React from 'react';
import { Row, Col, NumberField } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import styles from '../index.less';

export default function DetailsLine({
  curJudge,
  show,
  defaultList,
  lotNumber,
  tagCode,
  batchQty,
  itemControlType,
  warehouseName,
  wmAreaName,
  qualifiedQty,
  unqualifiedQty,
  remark,
  onDetailsRemark,
  onDetailsQualifiedQty,
  onDetailsUnqualifiedQty,
  onSwitchJudge,
  onActiveMode,
}) {
  return (
    <Row className={styles['details-line']}>
      <Col span={10} className={styles.title}>
        {/* <span>{`${lotNumber || ''}(${batchQty})`}</span> */}
        <span>{tagCode || ''} {itemControlType === 'TAG' ? `(${batchQty})` : ''}</span>
        <span>{lotNumber || ''} {itemControlType === 'LOT' ? `(${batchQty})` : ''}</span>
        <span>{warehouseName && wmAreaName ? `${warehouseName}-${wmAreaName}` : (warehouseName || wmAreaName)}</span>
      </Col>
      <Col span={8} className={styles.total}>
        <span className={`${styles['input-qualified']} ${styles['total-span']}`}>
          <NumberField
            value={qualifiedQty || 0}
            onChange={onDetailsQualifiedQty}
          />
        </span>
        <span className={`${styles['input-unqualified']} ${styles['total-span']}`}>
          <NumberField
            value={unqualifiedQty || 0}
            onChange={onDetailsUnqualifiedQty}
          />
        </span>
      </Col>
      <Col span={4} className={styles['details-judge']} onClick={onSwitchJudge}>
        <span className={styles['current-judge']} style={{ color: `${curJudge.color}` }}>
          {curJudge.value}
        </span>
        {curJudge.icon}
        {show && (
          <div className={styles['switch-judge']}>
            {defaultList.map((v) => (
              <span
                key={v.value}
                className={`${styles['judge-value']} ${
                  v.value === curJudge.value && styles['judge-value-active']
                }`}
                onClick={() => onActiveMode(v)}
              >
                {v.value}
              </span>
            ))}
          </div>
        )}
      </Col>
      <Col span={2} className={styles.remark} onClick={onDetailsRemark}>
        <Icons type="remark2" size="20" color={remark ? '#666' : '#1C879C'} />
        <span style={{color: remark && '#666'}}>备注</span>
      </Col>
    </Row>
  );
}
