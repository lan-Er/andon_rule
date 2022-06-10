/*
 * @Description: 恒光-检验判定结果
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-10-16 14:08:05
 */
import React from 'react';
import { TextField, NumberField, Lov, Button } from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';

export default function Result(props) {
  return (
    <div className="inspection-result">
      <div className="top">
        {props.result.map((v) => {
          return (
            <div
              style={{ flex: props.title === '判定结果' && v.title === '判定人' ? '1' : null }}
              className="top-item"
              key={uuidv4()}
            >
              <div className="item-left">
                {v.color && <span className="circle" style={{ backgroundColor: v.color }} />}
                <span className="item-left-title">{v.title}</span>
              </div>
              {v.type === 'number' ? (
                <NumberField
                  style={{ height: '56px', flex: 1, width: '150px' }}
                  value={v.value}
                  min={0}
                  step={1}
                  disabled={v.title === '合格接收' ? true : !props.inspectResult}
                  placeholder={v.placeholder}
                  onChange={(value) => props.handleResultChange(value, v.title)}
                />
              ) : (
                <Lov
                  style={{
                    height: '56px',
                    flex: 1,
                    paddingLeft: '10px',
                  }}
                  dataSet={props.lovDs}
                  name="workerObj"
                  key="workerObj"
                  disabled={!props.inspectResult}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="bottom">
        {props.title === '判定结果' && (
          <Button type="default" className="bad-reason" onClick={props.handleBadReason}>
            不良原因
          </Button>
        )}
        <span className="remark">备注</span>
        <TextField
          style={{ height: '56px' }}
          value={props.remark}
          disabled={!props.inspectResult}
          placeholder="请输入备注"
          onChange={props.handleRemark}
        />
      </div>
    </div>
  );
}
