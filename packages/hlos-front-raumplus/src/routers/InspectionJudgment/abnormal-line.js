/*
 * @Description: 异常页签行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-02-05 14:56:44
 */
import React from 'react';
import { NumberField } from 'choerodon-ui/pro';
import { Row, Col } from 'choerodon-ui';

import Icons from 'components/Icons';
import style from './index.less';

export default function AbnormalLine({ line, onAbnormalChange, handlePicturesModal }) {
  return (
    <Row className={style['abnormal-line']} type="flex" justify="space-between" align="middle">
      <Col span={12} className={style.title}>
        {line.exceptionName}
      </Col>
      <Col span={3} offset={3}>
        <NumberField value={line.exceptionQty || 0} min={0} step={1} onChange={onAbnormalChange} />
      </Col>
      <Col span={4} offset={2} className={style.upload} onClick={handlePicturesModal}>
        <Icons type="ziyuan60" size="20" />
        <span>上传图片</span>
      </Col>
    </Row>
  );
}
