/**
 * @Description: po预检-检验项
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-01 14:04:08
 * @LastEditors: leying.yan
 */

import React, { useEffect, useState } from 'react';
import { Col, Row, NumberField } from 'choerodon-ui/pro';
import arrowRightBlueIcon from 'hlos-front/lib/assets/icons/arrow-right-blue.svg';
import arrowLeftBlueIcon from 'hlos-front/lib/assets/icons/arrow-left-blue.svg';
import arrowLeftForbiddenIcon from 'hlos-front/lib/assets/icons/arrow-left-forbidden.svg';
import arrowRightForbiddenIcon from 'hlos-front/lib/assets/icons/arrow-right-forbidden.svg';
import style from './index.less';

export default ({ ds, inspectionList, onNumberChange }) => {
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 5;
  const [beforeClick, setBeforeClick] = useState(true);
  const [nextClick, setNextClick] = useState(true);
  const totalPage = Math.ceil((inspectionList.length > 0 ? inspectionList.length : 1) / pageSize);
  const { batchQty } = ds.current.toJSONData();

  useEffect(() => {
    if ((pageNum < totalPage || pageNum === totalPage) && pageNum > 1) {
      setBeforeClick(true);
    } else {
      setBeforeClick(false);
    }
    if (pageNum < totalPage) {
      setNextClick(true);
    } else {
      setNextClick(false);
    }
  }, [pageNum, totalPage]);

  function onPageChange(type, value) {
    if (type === 'before') {
      setPageNum(pageNum - 1);
    } else if (type === 'next') {
      setPageNum(pageNum + 1);
    } else {
      setPageNum(value);
    }
  }

  function InspectionLine(props) {
    return (
      <Row className={style['content-right-eye']}>
        <Col span={14} className={style.title}>
          {props.inspectionItemName}
        </Col>
        <Col className={style.number}>
          <NumberField
            placeholder="合格"
            value={props.qcOkQty}
            min={0}
            max={batchQty}
            className={style['qualified-input']}
            onChange={(value) => props.onNumberChange(value, 'qcOkQty', props.lineIndex)}
          />
        </Col>
        <Col className={style.number}>
          <NumberField
            placeholder="不合格"
            min={0}
            max={batchQty}
            className={style['unqualified-input']}
            onChange={(value) => props.onNumberChange(value, 'qcNgQty', props.lineIndex)}
            value={props.qcNgQty}
          />
        </Col>
      </Row>
    );
  }

  return (
    <>
      <div className={style.middle}>
        {inspectionList &&
          inspectionList.length > 0 &&
          inspectionList
            .slice((pageNum - 1) * pageSize, pageNum * pageSize)
            .map((line, lineIndex) => (
              <InspectionLine
                {...line}
                lineIndex={pageNum === 1 ? lineIndex : lineIndex + pageSize * (pageNum - 1)}
                onNumberChange={onNumberChange}
              />
            ))}
      </div>
      <div className={style.footer}>
        <div className={style['to-page']}>
          {beforeClick && (
            <img
              style={{ cursor: 'pointer' }}
              src={arrowLeftBlueIcon}
              alt=""
              onClick={() => onPageChange('before')}
            />
          )}
          {!beforeClick && (
            <img style={{ cursor: 'not-allowed' }} src={arrowLeftForbiddenIcon} alt="" />
          )}
          <div className={style.page}>
            <span>
              <NumberField
                value={pageNum}
                step={1}
                min={1}
                max={totalPage}
                onChange={(value) => onPageChange('jump', value)}
              />
            </span>
            <span>/</span>
            <span>{totalPage}</span>
          </div>
          {nextClick && (
            <img
              style={{ cursor: 'pointer' }}
              src={arrowRightBlueIcon}
              alt=""
              onClick={() => onPageChange('next')}
            />
          )}
          {!nextClick && (
            <img style={{ cursor: 'not-allowed' }} src={arrowRightForbiddenIcon} alt="" />
          )}
        </div>
      </div>
    </>
  );
};
