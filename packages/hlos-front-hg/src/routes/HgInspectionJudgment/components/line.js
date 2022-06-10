/*
 * @Description: 恒光-检验项判定-行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-10-19 14:54:03
 */
import React from 'react';
import { NumberField } from 'choerodon-ui/pro';

import pass from '../../../assets/InspectionJudgment/pass.png';
import fail from '../../../assets/InspectionJudgment/fail.png';

export default function Line(props) {
  return (
    <div className="inspection-line">
      <div className="number">{props.index + 1}.</div>
      <div className="item">
        <span>{props.inspectionItemName}</span>
        {props.lcl && props.ucl ? (
          <span>
            {props.lclAccept ? '[' : '('}
            {props.lcl} -- {props.ucl}
            {props.uclAccept ? ']' : ')'}
          </span>
        ) : null}
      </div>
      <div className="number-value">
        <img src={pass} alt="合格" />
        <NumberField
          value={props.qcStatus === 'ONGOING' ? props.lineQualifiedNum : props.qcOkQty}
          style={{ height: '56px' }}
          min={0}
          step={1}
          disabled={!props.startInspect}
          onChange={props.handleQualified}
        />
      </div>
      <div className="number-value">
        <img src={fail} alt="不合格" />
        <NumberField
          value={props.qcStatus === 'ONGOING' ? props.lineUnqualifiedNum : props.qcNgQty}
          style={{ height: '56px' }}
          disabled
        />
      </div>
    </div>
  );
}
