/**
 * @Description: 非生产任务报工
 * @Author: liYuan.liu<liu.liyuan@hand-china.com>
 * @Date: 2020-12-24
 * @LastEditors: Please set LastEditors
 */

import moment from 'moment';
import { Popover, Tooltip } from 'choerodon-ui';
import React, { useMemo } from 'react';
import { CheckBox, NumberField } from 'choerodon-ui/pro';

import moreIcon from 'hlos-front/lib/assets/icons/more.svg';

import styles from './style.less';

export default ({ handleCheck, loginData, selectTask = {}, handleChangeValue }) => {
  const list = useMemo(() => {
    return selectTask;
  }, [selectTask]);
  return (
    <ul>
      {loginData &&
        loginData.content &&
        loginData.content.map((i) => {
          // i是返回数组里的每一个对象；
          return (
            <li key={i.taskId}>
              <div className={styles.container}>
                <div className={styles.top}>
                  <div>
                    <CheckBox
                      name="base"
                      value={i.taskId}
                      onChange={(value) => handleCheck(value, i)}
                      checked={(list[i.taskId] && list[i.taskId].taskCheck) || false}
                    />
                    <span className={styles['main-task-type']}>{i.taskTypeName}</span>
                    <span className={styles['main-task-status']}>{i.taskStatusMeaning}</span>
                    <span className={styles['main-describe']}>{i.description}</span>
                  </div>
                  <div>
                    <NumberField
                      min={0}
                      value={i.processedTime || ''}
                      onChange={(value) => handleChangeValue(value, i)}
                    />
                    <span className={styles['main-work-time']}>/ {i.standardWorkTime}h</span>
                    <Popover
                      placement="bottom"
                      overlayClassName={styles['my-popover-list']}
                      trigger="click"
                      content={
                        <div className={styles['my-right-list']}>
                          <a href={`${i.pictureIds}`} target="_black">
                            图片
                          </a>
                          <br />
                          <a href={`${i.referenceDocument}`} target="_black">
                            参考文件
                          </a>
                        </div>
                      }
                    >
                      <img src={moreIcon} alt="" />
                    </Popover>
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div>
                    <span className={styles['main-sample']}>{i.workerGroupName}</span>
                    <span
                      className={[styles['main-sample'], styles['main-sample-center']].join(' ')}
                    >
                      {i.workerName}
                    </span>
                    <span className={styles['main-task-num']}>{i.taskNum}</span>
                    <Tooltip
                      title={`${i.prodLineName && i.prodLineName}
                        ${i.equipmentName && '/'}
                        ${i.equipmentName && i.equipmentName}
                        ${i.workcellName && '/'}
                        ${i.workcellName && i.workcellName}
                        ${i.locationName && '/'}
                        ${i.locationName && i.locationName}
                        ${i.outsideLocation && '/'}
                        ${i.outsideLocation && i.outsideLocation}`}
                    >
                      <span
                        className={`${styles['main-sample']} ${styles['main-sample-location']}`}
                      >
                        {i.prodLineName && i.prodLineName}
                        {i.equipmentName && <span>/</span>}
                        {i.equipmentName && i.equipmentName}
                        {i.workcellName && <span>/</span>}
                        {i.workcellName && i.workcellName}
                        {i.locationName && <span>/</span>}
                        {i.locationName && i.locationName}
                        {i.outsideLocation && <span>/</span>}
                        {i.outsideLocation && i.outsideLocation}
                      </span>
                    </Tooltip>
                  </div>
                  <div>
                    <span className={styles['main-time']}>
                      计划:{i.planStartTime ? moment(i.planStartTime).format('MM-DD HH:mm') : ''}--
                      {i.planEndTime ? moment(i.planEndTime).format('MM-DD HH:mm') : ''}
                    </span>
                    {/* <span className={styles['main-time']}>
                      实际:{i.actualStartTime ? moment(i.actualStartTime).format('MM-DD HH:mm') : ''}--
                      {i.actualEndTime ? moment(i.actualEndTime).format('MM-DD HH:mm') : ''}
                    </span> */}
                    <span className={styles['main-work-time']}>{i.calendarDay}</span>
                    <span className={styles['main-work-time']}>{i.calendarShiftCodeMeaning}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
    </ul>
  );
};
