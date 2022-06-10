/*
 * @Description: 执行页面左侧显示内容
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-21 22:01:18
 */

import React from 'react';
import defaultAvatarIcon from 'hlos-front/lib/assets/img-default-avator.png';
import Icons from 'components/Icons';

import style from './index.less';

export default function leftContent({
  declarerPicture,
  declarerName,
  inspectionTimeFormatter,
  inspectionDocNum,
  samplingType,
  samplingTypeMeaning,
  itemCode,
  description,
  batchQty,
  sampleQty,
  docRule,
  inspectionGroupName,
  onOpenSampleModal,
}) {
  return (
    <div className={style['left-content']}>
      <div className={style['worker-info']}>
        <img src={declarerPicture || defaultAvatarIcon} alt="avatar" />
        <span className={style.worker}>{declarerName}</span>
        <span className={style.time}>{inspectionTimeFormatter}</span>
      </div>
      <div className={style['inspection-header']}>
        <div className={style['header-info']}>
          <Icons type="document-grey1" size="26" color="#9b9b9b" />
          <span>{inspectionDocNum}</span>
          {samplingType ? (
            <span className={style['header-status']}>{samplingTypeMeaning}</span>
          ) : null}
        </div>
        <div className={style['header-info']}>
          <Icons type="document-grey1" size="26" color="#9b9b9b" />
          <span>{itemCode}</span>
        </div>
        <div className={style['header-info']}>
          <Icons type="banzuguanli1" size="26" color="#9b9b9b" />
          <span>{description}</span>
        </div>
        <div className={style['header-info']}>
          <Icons type="number-unselect" size="22" color="#9b9b9b" />
          <span>报检数量: {batchQty}</span>
        </div>
        {/* <div className={style['header-info']}>
          <Icons type="number-unselect" size="22" color="#9b9b9b" />
          <span>抽样数量: {sampleQty}</span>
        </div> */}
        {docRule && docRule.sample_update === '1' ? (
          <div className={style['header-info']}>
            <Icons type="number-unselect" size="22" color="#9b9b9b" />
            <div style={{ flex: 1 }} className={style['ds-ai-center']}>
              <span>抽样数量: </span>
              <div style={{ flex: 1 }}>
                <span>{sampleQty}</span>
                <Icons
                  style={{ marginLeft: '10px' }}
                  type="beizhu"
                  size="24"
                  color="#1C879C"
                  onClick={onOpenSampleModal}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={style['header-info']}>
            <Icons type="number-unselect" size="22" color="#9b9b9b" />
            <span>抽样数量: {sampleQty}</span>
          </div>
        )}
        <div className={style['header-info']}>
          <Icons type="inspection-item1" size="26" color="#9b9b9b" />
          <span>检验组: {inspectionGroupName}</span>
        </div>
      </div>
    </div>
  );
}
