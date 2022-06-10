/**
 * @Description: po预检-不良原因
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-01 14:04:08
 * @LastEditors: leying.yan
 */

import React, { useState, useEffect } from 'react';
import { Col, Row, NumberField } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import arrowRightBlueIcon from 'hlos-front/lib/assets/icons/arrow-right-blue.svg';
import arrowLeftBlueIcon from 'hlos-front/lib/assets/icons/arrow-left-blue.svg';
import arrowLeftForbiddenIcon from 'hlos-front/lib/assets/icons/arrow-left-forbidden.svg';
import arrowRightForbiddenIcon from 'hlos-front/lib/assets/icons/arrow-right-forbidden.svg';
import style from './index.less';

export default ({ exceptionList, onAbnormalChange, onPicturesChange }) => {
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 5;
  const [beforeClick, setBeforeClick] = useState(true);
  const [nextClick, setNextClick] = useState(true);
  const totalPage = Math.ceil(exceptionList.length / pageSize);

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

  function ExceptionLine(props) {
    return (
      <Row className={style['abnormal-line']} type="flex" justify="space-between" align="middle">
        <Col span={11} className={style.title}>
          {props.exceptionName}
        </Col>
        <Col span={3} offset={3}>
          <NumberField
            value={props.exceptionQty || 0}
            min={0}
            onChange={(value) => props.onAbnormalChange(value, props.lineIndex)}
          />
        </Col>
        <Col span={5} offset={2} className={style.upload} onClick={() => props.onPicturesChange()}>
          <Icons type="ziyuan60" size="20" />
          <span>上传图片</span>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <div className={style.middle}>
        {exceptionList &&
          exceptionList.length > 0 &&
          exceptionList
            .slice((pageNum - 1) * pageSize, pageNum * pageSize)
            .map((line, lineIndex) => (
              <ExceptionLine
                {...line}
                lineIndex={pageNum === 1 ? lineIndex : lineIndex + pageSize * (pageNum - 1)}
                onAbnormalChange={onAbnormalChange}
                onPicturesChange={() => onPicturesChange(line, lineIndex)}
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
