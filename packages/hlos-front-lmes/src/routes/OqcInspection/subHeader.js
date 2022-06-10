/*
 * @Description: 二级头栏信息
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-10 17:18:21
 */
import React from 'react';
import defaultAvatarIcon from 'hlos-front/lib/assets/img-default-avator.png';
import Icons from 'components/Icons';
import style from './index.less';

export default function SubHeader({ headerData, defaultWorker }) {
  const { sourceDocNum, declarerName, partyName, declarerDate } = headerData;
  const { workerName, fileUrl } = defaultWorker;
  return (
    <div className={style['sub-header']}>
      <div>
        <img src={fileUrl || defaultAvatarIcon} alt="" />
        <span>{workerName}</span>
      </div>
      <div>
        <Icons type="document-grey" size="14" color="#9b9b9b" />
        <span>{sourceDocNum}</span>
      </div>
      <div>
        <span>{declarerName}</span>
      </div>
      <div>
        <span>{partyName}</span>
      </div>
      <div>
        <span>{declarerDate}</span>
      </div>
    </div>
  );
}
