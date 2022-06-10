/*
 * @Description: 检验行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-01-31 16:59:11
 */

import React from 'react';
import { Row, Col, NumberField, Switch, Tooltip } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';

import styles from './index.less';

export default function InspectionLine(props) {
  return (
    <Row className={styles['inspection-line']}>
      <Col span={10} className={styles.title}>
        <Tooltip title={props.inspectionItemDescription}>{props.inspectionItemName}</Tooltip>
      </Col>
      {props.resultType === 'NUMBER' ? (
        <Col span={6} offset={2} className={styles.range}>
          {props.lclAccept ? '[' : '('}
          {`${props.lcl ?? ''}-${props.ucl ?? ''}`}
          {props.uclAccept ? ']' : ')'}
        </Col>
      ) : (
        <Col span={8} />
      )}
      {props.resultType === 'JUDGE' ? (
        <Col span={2} offset={4} className={styles.judge}>
          <Switch
            unCheckedChildren={<Icon type="close" />}
            checked={props.qcJudge}
            onChange={props.onSwitchChange}
          >
            <Icon type="check" />
          </Switch>
        </Col>
      ) : (
        <Col span={6} className={styles.number}>
          <NumberField
            className={
              props.qcResult === 'PASS' ? styles['qualified-input'] : styles['unqualified-input']
            }
            value={props.qcValue}
            onChange={props.onNumberChange}
          />
        </Col>
      )}
    </Row>
  );
}
