/*
 * @Description: 恒光-试模检验-行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-10-21 18:01:25
 */
import React from 'react';
import { Button, TextField } from 'choerodon-ui/pro';

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
      <div className="judge-button">
        <Button
          className={
            (props.status === 'ONGOING' ? props.lineResult : props.qcResult) === 'PASS'
              ? 'qualified-active'
              : 'qualified'
          }
          icon="check"
          onClick={() => props.handleJudge('PASS')}
        >
          合格
        </Button>
        <Button
          className={
            (props.status === 'ONGOING' ? props.lineResult : props.qcResult) === 'FAILED'
              ? 'unqualified-active'
              : 'unqualified'
          }
          icon="close"
          onClick={() => props.handleJudge('FAILED')}
        >
          不合格
        </Button>
      </div>
      <div className="judge-remark">
        {(props.status === 'ONGOING' ? props.lineResult : props.qcResult) === 'FAILED' ? (
          <TextField
            value={props.status === 'ONGOING' ? props.badRemark : props.lineRemark}
            style={{ height: '56px' }}
            placeholder="请输入不合格原因"
            disabled={props.status !== 'ONGOING'}
            onChange={props.handleRemarkChange}
          />
        ) : null}
      </div>
    </div>
  );
}
