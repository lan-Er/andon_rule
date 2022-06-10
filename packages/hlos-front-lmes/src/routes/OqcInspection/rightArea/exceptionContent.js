/*
 * @Description: 不良原因tab页签内容
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-10 19:46:45
 */

import React from 'react';
import uuidv4 from 'uuid/v4';
import style from '../index.less';
import AbnormalLine from './abnormalLine';
import ToPage from '../toPage';

export default function ExceptionContent({
  data,
  onAbnormalChange,
  toExpNumCheck,
  onPicturesModal,
}) {
  return (
    <div className={style['bad-reason-content']}>
      <div>
        {
          data.exceptionList && data.exceptionList.length
          ? data.exceptionList.slice(5 * (data.curExpPage - 1), 5 * data.curExpPage).map(v => (
            <AbnormalLine
              key={uuidv4()}
              {...v}
              judged={data.judged}
              onAbnormalChange={(value) => onAbnormalChange(value, data.inspectionDocId, v)}
              onPicturesModal={() => onPicturesModal(v, data.inspectionDocId)}
            />
          )) : null
        }
      </div>
      <ToPage
        curPage={data.curExpPage || 1}
        totalPage={data.totalExpPage}
        toNumCheck={(value) => toExpNumCheck(value, data)}
      />
    </div>
  );
};