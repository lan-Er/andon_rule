/*
 * @Description: 明细modal框
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-21 09:44:45
 */

import React from 'react';
import { Tooltip } from 'choerodon-ui/pro';
import styles from './index.less';

export default function DetailsModal({ data, detailsPreview }) {
  return (
    <div className={styles['details-info']}>
      <div className={styles['details-line']}>
        <span>设备编码</span>
        <Tooltip title={data.resourceCode}>{data.resourceCode || ''}</Tooltip>
        <span>执行类型</span>
        <Tooltip title={data.trackTypeMeaning}>{data.trackTypeMeaning || ''}</Tooltip>
      </div>
      <div className={styles['details-line']}>
        <span>执行时间</span>
        <Tooltip title={data.trackTime}>{data.trackTime || ''}</Tooltip>
        <span>执行人</span>
        <Tooltip title={data.workerName}>{data.workerName || ''}</Tooltip>
      </div>
      <div className={`${styles['details-line']} ${styles['single-details-line']}`}>
        <span>备注</span>
        <Tooltip title={data.remark}>{data.remark || ''}</Tooltip>
      </div>
      <div className={styles['details-line']}>
        <span>生产线</span>
        <Tooltip title={data.prodLineName}>{data.prodLineName || ''}</Tooltip>
        <span>目标生产线</span>
        <Tooltip title={data.toProdLineName}>{data.toProdLineName || ''}</Tooltip>
      </div>
      <div className={styles['details-line']}>
        <span>工位</span>
        <Tooltip title={data.workcellName}>{data.workcellName || ''}</Tooltip>
        <span>目标工位</span>
        <Tooltip title={data.toWorkcellName}>{data.toWorkcellName || ''}</Tooltip>
      </div>
      <div className={styles['details-line']}>
        <span>地点</span>
        <Tooltip title={data.locationName}>{data.locationName || ''}</Tooltip>
        <span>目标地点</span>
        <Tooltip title={data.toLocationName}>{data.toLocationName || ''}</Tooltip>
      </div>
      <div className={styles['details-line']}>
        <span>外部地点</span>
        <Tooltip title={data.outsideLocation}>{data.outsideLocation || ''}</Tooltip>
        <span>目标外部地点</span>
        <Tooltip title={data.toOutsideLocation}>{data.toOutsideLocation || ''}</Tooltip>
      </div>
      {
        data.imgList.length ? (
          <div className={styles['details-img-line']}>
            {data.imgList.map((v) => (
              <img src={v} alt="" onClick={() => detailsPreview({ url: v })} />
            ))}
          </div>
        ) : null
      }
    </div>
  );
}
