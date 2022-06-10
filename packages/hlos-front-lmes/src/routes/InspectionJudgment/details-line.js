/*
 * @Description: 明细页面行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-09 13:18:30
 */

import React from 'react';
import { Row, Col, TextField, NumberField } from 'choerodon-ui/pro';

import styles from './index.less';

export default function DetailsLine(props) {
  const { headerData } = props;

  return (
    <Row className={styles['details-line']}>
      <Col span={6} className={styles.title}>
        <span>{props.tagCode || ''} {headerData.itemControlType === 'TAG' ? `(${props.batchQty})` : ''}</span>
        <span>{props.lotNumber || ''} {headerData.itemControlType === 'LOT' ? `(${props.batchQty})` : ''}</span>
      </Col>
      <Col span={8} className={styles.total}>
        {headerData.samplingType === 'ALL' ? (
          <>
            <span className={`${styles.qualified} ${styles['total-span']}`}>
              {props.detailsQualifiedQuantity}
            </span>
            <span className={`${styles.unqualified} ${styles['total-span']}`}>
              {props.detailsUnqualifiedQuantity}
            </span>
          </>
        ) : (
          <>
            <span className={`${styles['input-qualified']} ${styles['total-span']}`}>
              <NumberField
                value={props.detailsQualifiedQuantity || 0}
                onChange={(value) => props.onDetailsQuantity(value, 'qualified')}
              />
            </span>
            <span className={`${styles['input-unqualified']} ${styles['total-span']}`}>
              <NumberField
                value={props.detailsUnqualifiedQuantity || 0}
                onChange={(value) => props.onDetailsQuantity(value, 'unqualified')}
              />
            </span>
          </>
        )}
      </Col>
      <Col span={4} className={styles['details-judge']} onClick={props.onSwitchJudge}>
        <span className={styles['current-judge']} style={{ color: `${props.curJudge.color}` }}>
          {props.curJudge.value}
        </span>
        {/* <img src={props.curJudge.icon} alt="展开" /> */}
        {props.curJudge.icon}
        {props.show && (
          <div className={styles['switch-judge']}>
            {props.defaultList.map((v) => (
              <span
                key={v.value}
                className={`${styles['judge-value']} ${
                  v.value === props.curJudge.value && styles['judge-value-active']
                }`}
                onClick={() => props.onActiveMode(v)}
              >
                {v.value}
              </span>
            ))}
          </div>
        )}
      </Col>
      <Col span={6} className={styles.remark}>
        <TextField value={props.remark} placeholder="备注" onChange={props.onDetailsRemark} />
      </Col>
    </Row>
  );
}
