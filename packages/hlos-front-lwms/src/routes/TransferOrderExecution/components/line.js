/*
 * @Description: 转移单执行界面行组件
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-08 19:51:41
 */

import React, { useMemo, useEffect } from 'react';
import { DataSet, Lov, NumberField, Tooltip } from 'choerodon-ui/pro';

import quantityIcon from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import lotIcon from 'hlos-front/lib/assets/icons/rec-lot.svg';
import tagIcon from 'hlos-front/lib/assets/icons/rec-tag.svg';
import { lineDSConfig } from '@/stores/transferOrderExecutionDS.js';

import style from '../index.less';

export default function TableLine(props) {
  const lineDS = useMemo(() => new DataSet(lineDSConfig()), []);

  let iconPath = tagIcon;
  switch (props.itemControlType) {
    case 'QUANTITY':
      iconPath = quantityIcon;
      break;
    case 'LOT':
      iconPath = lotIcon;
      break;
    case 'TAG':
      iconPath = tagIcon;
      break;
    default:
      break;
  }

  let numberFieldValue = 0;
  if (props.status === 'PICKED') {
    numberFieldValue = props.pickedQty || 0;
  } else {
    numberFieldValue = props.defaultNumber || 0;
  }

  useEffect(() => {
    lineDS.fields.get('warehouseObj').setLovPara('organizationId', props.organizationId);
    if (props.warehouseId) {
      lineDS.current.set('warehouseObj', {
        warehouseName: props.warehouseName,
        warehouseCode: props.warehouseCode,
        warehouseId: props.warehouseId,
      });
      lineDS.current.set('wmAreaObj', {
        wmAreaName: props.wmAreaName,
        wmAreaCode: props.wmAreaCode,
        wmAreaId: props.wmAreaId,
      });
    }
  }, []);

  function handleWarehouseChange(newObj, oldObj) {
    if ((newObj && oldObj && newObj.warehouseId !== oldObj.warehouseId) || !newObj) {
      lineDS.current.set('wmAreaObj', null);
    }
    const _data = lineDS.toJSONData();
    const record = {
      warehouseId: _data[0].warehouseId,
      warehouseCode: _data[0].warehouseCode,
      warehouseName: _data[0].warehouseName,
    };
    props.onWarehouseChange(record);
  }

  function handleWmAreaChange() {
    const _data = lineDS.toJSONData();
    const record = {
      wmAreaId: _data[0].wmAreaId,
      wmAreaCode: _data[0].wmAreaCode,
      wmAreaName: _data[0].wmAreaName,
    };
    props.onWmAreaChange(record);
  }

  return (
    <div className={style.lines}>
      <div className={style.logo} onClick={props.handleModal}>
        <img src={iconPath} alt="tagIcon" />
      </div>
      <div className={style['custom-counter']}>
        <NumberField
          className={style['counter-content']}
          value={numberFieldValue}
          // step={1}
          onChange={props.handleInput}
          disabled={props.status !== 'RELEASED'}
          readOnly={props.itemControlType !== 'QUANTITY'}
        />
      </div>
      <div className={style['total-number']}>
        <span className={style.number}>{props.applyQty}</span>
        <span>{props.uomName}</span>
      </div>
      <div className={style.item}>
        <Tooltip title={props.itemDescription}>{props.itemDescription}</Tooltip>
        <span className={style['item-code']}>{props.itemCode}</span>
      </div>
      {props.status !== 'RELEASED' ? (
        ''
      ) : (
        <>
          <div className={style['warehouse-transfer']}>
            <Lov
              dataSet={lineDS}
              name="warehouseObj"
              placeholder="请输入或选择"
              onChange={handleWarehouseChange}
            />
          </div>
          <div className={style['warehouse-transfer']}>
            <Lov
              dataSet={lineDS}
              name="wmAreaObj"
              placeholder="请输入或选择"
              onChange={handleWmAreaChange}
            />
          </div>
        </>
      )}
      {/* <div className={style['status-time']}>
        <span className={style.status}>{props.requestLineStatusMeaning}</span>
      </div> */}
    </div>
  );
}
