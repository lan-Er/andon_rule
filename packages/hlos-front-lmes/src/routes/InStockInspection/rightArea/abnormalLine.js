/*
 * @Description: 异常页签行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-15 14:56:25
 */
import React from 'react';
import { NumberField } from 'choerodon-ui/pro';
import { Row, Col } from 'choerodon-ui';

import Icons from 'components/Icons';
import style from '../index.less';

export default function AbnormalLine({
  exceptionName,
  exceptionQty,
  fileList,
  judged,
  onAbnormalChange,
  onPicturesModal,
}) {
  return (
    <Row className={style['abnormal-line']} type="flex" justify="space-between" align="middle">
      <Col span={10} className={style.title}>
        {exceptionName}
      </Col>
      <Col span={4} offset={2}>
        <NumberField
          value={exceptionQty || 0}
          min={0}
          step={1}
          disabled={judged}
          onChange={onAbnormalChange}
        />
      </Col>
      <Col span={5} offset={3} onClick={onPicturesModal}>
        {
          (fileList && fileList.length || judged) ? (
            <div className={style.view}>
              <Icons type="image1" size="20" />
              <span>查看图片</span>
            </div>
          ) : (
            <div className={style.upload}>
              <Icons type="ziyuan54" size="20" />
              <span>上传图片</span>
            </div>
          )
        }
      </Col>
    </Row>
  );
}