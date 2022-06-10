/*
 * @Description: 卡片信息
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-06 10:03:18
 */

import React from 'react';
import { CheckBox, Tooltip } from 'choerodon-ui/pro';
import defaultAvatarIcon from 'hlos-front/lib/assets/img-default-avator.png';
import Icons from 'components/Icons';
import style from './index.less';

export default function Card({ data, onToDetails, onChange }) {
  return (
    <div className={style.card}>
      <div className={style.top}>
        <CheckBox checked={data.checked} onChange={onChange} />
        <span className={style.document}>
          <Tooltip
            title={
              data.itemCode && data.description
                ? `${data.itemCode}_${data.description}`
                : data.itemCode || data.description
            }
          >
            {data.itemCode && data.description
              ? `${data.itemCode}_${data.description}`
              : data.itemCode || data.description}
          </Tooltip>
        </span>
        <span className={style.time}>{data.inspectionTimeFormatter}</span>
      </div>
      <div className={style.content} onClick={onToDetails}>
        <Icons type="clock-gray" size="14" color="#9b9b9b" />
        <span>{data.creationDate}</span>
      </div>
      <div className={style.content} onClick={onToDetails}>
        <Icons type="documents" size="14" color="#9b9b9b" />
        <span>
          {data.sourceDocNum && data.sourceDocLineNum
            ? `${data.sourceDocNum}-${data.sourceDocLineNum}`
            : data.sourceDocNum || data.sourceDocLineNum}
        </span>
      </div>
      <div className={style.bottom}>
        <div>
          <img src={data.declarerPicture || defaultAvatarIcon} alt="" />
          <span>{data.declarerName}</span>
        </div>
        <div className={style['text-ellipsis']}>
          <span>检验数量</span>
          <span className={style['inspection-quantity']}>
            {`${data.batchQty || 0}(${data.sampleQty})`}
          </span>
        </div>
      </div>
    </div>
  );
}
