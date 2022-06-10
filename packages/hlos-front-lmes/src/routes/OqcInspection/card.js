/*
 * @Description: 卡片信息
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-13 21:38:53
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
          <Tooltip title={data.sourceDocNum}>{data.sourceDocNum}</Tooltip>
        </span>
        <span className={style.time}>{data.duration}</span>
      </div>
      <div className={style.content} onClick={onToDetails}>
        <Icons type="clock-gray" size="14" color="#9b9b9b" />
        <span>{data.declarerDate}</span>
      </div>
      <div className={style.bottom}>
        <div>
          <img src={data.declarerHeadUrl || defaultAvatarIcon} alt="" />
          <span>{data.declarerName}</span>
        </div>
        <div className={style['text-ellipsis']}>{data.partyName}</div>
      </div>
    </div>
  );
}
