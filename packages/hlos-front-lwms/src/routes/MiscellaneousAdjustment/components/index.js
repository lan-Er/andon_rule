/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-07-13 09:46:45
 * @LastEditTime: 2021-02-02 16:04:51
 * @Description: 时间和表格行组件
 */
import React, { useState, useEffect } from 'react';
import { NumberField, Row, Col } from 'choerodon-ui/pro';
import { Checkbox, Tooltip } from 'choerodon-ui';

import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import styles from '../index.module.less';
import '../common.less';

function getTime() {
  return moment().format(DEFAULT_DATETIME_FORMAT);
}

/**
 * 时钟
 * @param {Object} props
 * */
const Clock = (props) => {
  const [time, setTime] = useState(getTime());
  useEffect(() => {
    const timeId = setInterval(() => {
      setTime(getTime());
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, []);
  return (
    <span className={styles['time-component']} {...props}>
      {time}
    </span>
  );
};

const CommonInput = (props) => {
  return (
    <div className="common-input">
      <NumberField step={props.step || 1} min={props.min || 0} value={props.defaultValue || 0} />
      <span className="sign left">-</span>
      <span className="sign right">+</span>
    </div>
  );
};

const Line = (props) => {
  // console.log(props.quantity);
  // const [quantity, setQuantity] = useState(props.quantity);
  const handleChange = (e) => {
    props.onChecked(props.index, e.target.checked);
  };
  const handleChangeQuantity = (value) => {
    props.onChangeQuantity(props.index, value);
  };
  return (
    <div
      className={`table-line ${props.even ? 'table-line-even' : 'table-line-odd'} ${
        props.checked ? 'table-line-height' : ''
      }`}
    >
      <Row>
        {/* <Col span={1} className="table-col">
          <Checkbox checked={props.checked} onChange={handleChange} />
        </Col> */}
        <Col span={8} className="table-col input-number">
          <Checkbox
            style={{ margin: '0 10px 0 20px' }}
            checked={props.checked}
            onChange={handleChange}
          />
          <div
            className={styles['common-input']}
            // className="common-input"
          >
            <NumberField
              // step={props.step || 1}
              min={props.min || 0}
              max={props.existQuantity || null}
              value={props.quantity || 0}
              onChange={handleChangeQuantity}
            />
            {/* <span className="sign left">-</span> */}
            {/* <span className="sign right">+</span> */}
          </div>
          <span style={{ marginLeft: '5px' }}>{props.uomName}</span>
        </Col>
        <Col span={4} className="table-col">
          <div className="material-name">
            <Tooltip title={props.itemName}>{props.itemName}</Tooltip>
            <span>{props.itemCode}</span>
          </div>
        </Col>
        <Col span={4} className="table-col">
          <span>{props.lotNumber}</span>
        </Col>
        <Col span={4} className="table-col">
          <span>{props.supplierName}</span>
        </Col>
        <Col span={4} className="table-col">
          <span className="show-date">{props.expireDate}</span>
        </Col>
      </Row>
    </div>
  );
};

const TagLine = (props) => {
  const handleChange = (e) => {
    props.onChecked(props.index, e.target.checked);
  };
  return (
    <div
      className={`table-line ${props.even ? 'table-line-even' : 'table-line-odd'} ${
        props.checked ? 'table-line-height' : ''
      }`}
    >
      <Row>
        <Col span={5} className="table-col">
          <Checkbox
            style={{ margin: '0 10px 0 20px' }}
            checked={props.checked}
            onChange={handleChange}
          />
          <div className="material-name">
            <Tooltip title={props.itemName}>{props.itemName}</Tooltip>
            <span>{props.itemCode}</span>
          </div>
        </Col>
        <Col span={4} className="table-col">
          <span>{props.tagCode}</span>
        </Col>
        <Col span={4} className="table-col">
          <span className="tag-number">
            {props.quantity}
            {props.uomName}
          </span>
        </Col>
        <Col span={4} className="table-col">
          <span>{props.supplierName || ''}</span>
        </Col>
        <Col span={6} className="table-col">
          <span className="show-date">{props.supplierName || ''}</span>
        </Col>
      </Row>
    </div>
  );
};

export { Clock, CommonInput, Line, TagLine };
