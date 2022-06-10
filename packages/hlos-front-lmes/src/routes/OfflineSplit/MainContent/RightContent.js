/**
 * @Description: 线下拆板-被拆分
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-23 14:04:08
 * @LastEditors: leying.yan
 */

import React, { useMemo, useEffect } from 'react';
import uuidv4 from 'uuid/v4';
import Icons from 'components/Icons';
import { Col, Row, NumberField, Lov, DataSet } from 'choerodon-ui/pro';
import styles from './index.less';

export default ({
  ds,
  warehouseId,
  warehouseCode,
  warehouseName,
  wmAreaId,
  wmAreaCode,
  wmAreaName,
  splitLineList,
  onSplitQtyChange,
  onWarehouseChange,
  onWmAreaChange,
  paneIndex,
  onDelete,
}) => {
  const QueryDS = () => {
    return {
      autoCreate: true,
      fields: [
        {
          name: 'organizationId',
        },
        {
          name: 'warehouseObj',
          type: 'object',
          lovCode: 'LMDS.WAREHOUSE',
          ignore: 'always',
          required: true,
          dynamicProps: {
            lovPara: () => ({
              organizationId: ds.current.get('organizationId'),
            }),
          },
        },
        {
          name: 'warehouseId',
          type: 'string',
          bind: 'warehouseObj.warehouseId',
        },
        {
          name: 'warehouseCode',
          type: 'string',
          bind: 'warehouseObj.warehouseCode',
        },
        {
          name: 'warehouseName',
          type: 'string',
          bind: 'warehouseObj.warehouseName',
        },
        {
          name: 'wmAreaObj',
          type: 'object',
          lovCode: 'LMDS.WM_AREA',
          ignore: 'always',
          cascadeMap: { warehouseId: 'warehouseId' },
          // required: true,
          dynamicProps: {
            lovPara: ({ record }) => ({
              warehouseId: record.get('warehouseId'),
            }),
          },
        },
        {
          name: 'wmAreaId',
          type: 'string',
          bind: 'wmAreaObj.wmAreaId',
        },
        {
          name: 'wmAreaCode',
          type: 'string',
          bind: 'wmAreaObj.wmAreaCode',
        },
        {
          name: 'wmAreaName',
          type: 'string',
          bind: 'wmAreaObj.wmAreaName',
        },
      ],
    };
  };
  const queryDS = useMemo(() => new DataSet(QueryDS()), []);

  useEffect(() => {
    queryDS.current.set('organizationId', ds.current.get('organizationId'));
    queryDS.current.set('warehouseObj', {
      warehouseId,
      warehouseCode,
      warehouseName,
    });
    queryDS.current.set('wmAreaObj', {
      wmAreaId,
      wmAreaCode,
      wmAreaName,
    });
  }, [warehouseId, wmAreaId]);

  return (
    <div className={styles['split-info']}>
      <div className={styles['select-area']}>
        <Lov
          dataSet={queryDS}
          name="warehouseObj"
          placeholder="拆解仓库"
          onChange={(value) => onWarehouseChange(value, paneIndex)}
        />
        <Lov
          dataSet={queryDS}
          name="wmAreaObj"
          placeholder="拆解货位"
          onChange={(value) => onWmAreaChange(value, paneIndex)}
        />
      </div>
      <div className={styles['split-area']}>
        {splitLineList &&
          splitLineList.length > 0 &&
          splitLineList.map((line, lineIndex) => (
            <Row
              key={uuidv4()}
              className={styles['split-line']}
              type="flex"
              justify="space-between"
              align="middle"
            >
              <Col span={19} className={styles.title}>
                {line.toTagCode}
              </Col>
              <Col span={3}>
                <NumberField
                  value={line.toItemQty}
                  min={0}
                  step={1}
                  onChange={(value) => onSplitQtyChange(value, paneIndex, lineIndex)}
                />
              </Col>
              <Col span={2} onClick={() => onDelete(paneIndex, lineIndex)}>
                <div style={{ marginLeft: '40%' }}>
                  <Icons type="delete" size="30" color="#1c879c" />
                </div>
              </Col>
            </Row>
          ))}
      </div>
    </div>
  );
};
