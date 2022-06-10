/*
 * @Description: 异常tab页签内容
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-19 15:13:21
 */

import React from 'react';
import uuidv4 from 'uuid/v4';
import style from '../index.less';
import AbnormalLine from './abnormalLine';

export default function ExceptionContent({
  exceptionList,
  onAbnormalChange,
  onPicturesModal,
}) {
  return (
    <div className={style['bad-reason-content']}>
      {
        exceptionList && exceptionList.length
        ? exceptionList.map(v => (
          <AbnormalLine
            key={uuidv4()}
            {...v}
            onAbnormalChange={(value) => onAbnormalChange(value, v)}
            onPicturesModal={() => onPicturesModal(v)}
          />
        )) : null
      }
    </div>
  );
};