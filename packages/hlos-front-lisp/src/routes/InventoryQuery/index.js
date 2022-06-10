/*
 * 核企侧库存查询
 * date: 2020-07-23
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import React, { useState } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Switch } from 'choerodon-ui';
import { inventoryQueryDS, totalInventoryQueryDS } from '@/stores/inventoryQueryDS';
import style from './style.less';

import locationImg from './assets/location.svg';
import warningImg from './assets/warning.svg';
import sendImg from './assets/send.svg';
import halfProductImg from './assets/half-product.svg';
import materialImg from './assets/material.svg';
import productImg from './assets/product.svg';

let ds = new DataSet(inventoryQueryDS());
const InventoryQuery = () => {
  const [totalStatus, setTotalStatus] = useState(false);
  const [sendStatus, setSendStatus] = useState('0');
  function columns() {
    return [
      {
        header: 'No.',
        width: 70,
        align: 'left',
        lock: 'left',
        renderer({ record }) {
          return <span>{record.index + 1}</span>;
        },
      },
      { name: 'attribute1', lock: 'left', align: 'left', width: 70 },
      {
        name: 'attribute2&3',
        lock: 'left',
        align: 'left',
        width: 180,
        renderer({ record }) {
          const attribute = record.get('attribute6');
          let src = '';
          switch (attribute) {
            case '产成品':
              src = productImg;
              break;
            case '原材料':
              src = materialImg;
              break;
            default:
              src = halfProductImg;
          }
          return (
            <div className={style['ds-jc-between']}>
              <img src={src} style={{ marginRight: '10px' }} title={attribute} alt="物料类型" />
              <div>
                <div className={style['ds-jc-between']}>
                  {record.get('attribute13') === '1' ? (
                    <img style={{ marginTop: '-4px' }} src={sendImg} alt="寄售标识" />
                  ) : null}
                  {record.get('attribute2')}
                </div>
                <div style={{ color: '#999' }}>{record.get('attribute3')}</div>
              </div>
            </div>
          );
        },
      },
      {
        name: 'attribute14',
        align: 'left',
        width: 110,
      },
      {
        name: 'attribute7',
        align: 'left',
        width: 150,
        renderer({ record }) {
          return (
            <div>
              <div>
                {Number(record.get('attribute7')?.split(' ')[0]) <
                Number(record.get('attribute9')) ? (
                  <img style={{ marginTop: '-4px' }} src={warningImg} alt="警告" />
                ) : null}
                {record.get('attribute7')}
                <span
                  style={{
                    color: '#9b9b9b',
                    fontSize: '8px',
                    marginLeft: '5px',
                  }}
                >
                  {record.get('attribute9')}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        name: 'attribute4&5',
        align: 'left',
        width: 240,
        renderer({ record }) {
          return (
            <div>
              <div>
                {record.get('attribute12') === '1' ? <img src={locationImg} alt="重要" /> : null}
                {record.get('attribute4')}
              </div>
              <div style={{ color: '#999' }}>{record.get('attribute5')}</div>
            </div>
          );
        },
      },
      {
        name: 'attribute10&11',
        align: 'left',
        width: 150,
        renderer({ record }) {
          return (
            <div>
              <div>{record.get('attribute10')}</div>
              <div style={{ color: '#999' }}>{record.get('attribute11')}</div>
            </div>
          );
        },
      },
    ];
  }
  function totalColumns() {
    return [
      {
        header: 'No.',
        width: 80,
        align: 'left',
        lock: 'left',
        renderer({ record }) {
          return <span>{record.index + 1}</span>;
        },
      },
      { name: 'attribute1', lock: 'left', align: 'left', width: 100 },
      {
        name: 'attribute2&3',
        lock: 'left',
        align: 'left',
        width: 180,
        renderer({ record }) {
          const attribute = record.get('attribute6');
          let src = '';
          switch (attribute) {
            case '产成品':
              src = productImg;
              break;
            case '原材料':
              src = materialImg;
              break;
            default:
              src = halfProductImg;
          }
          return (
            <div className={style['ds-jc-between']}>
              <img src={src} style={{ marginRight: '10px' }} title={attribute} alt="物料类型" />
              <div>
                <div className={style['ds-jc-between']}>
                  {record.get('attribute13') === '1' ? (
                    <img style={{ marginTop: '-4px' }} src={sendImg} alt="寄售标识" />
                  ) : null}
                  {record.get('attribute2')}
                </div>
                <div style={{ color: '#999' }}>{record.get('attribute3')}</div>
              </div>
            </div>
          );
        },
      },
      // {
      //   name: 'attribute4',
      //   align: 'left',
      //   width: 150,
      //   renderer({ record }) {
      //     const attribute = record.get('attribute4');
      //     let bgColor;
      //     let fontColor;
      //     switch (attribute) {
      //       case '产成品':
      //         bgColor = '#DDF7EC';
      //         fontColor = '#24BDA2';
      //         break;
      //       case '原材料':
      //         bgColor = '#EEE';
      //         fontColor = '#AAA';
      //         break;
      //       default:
      //         bgColor = '#C0E3FA';
      //         fontColor = '#50B2F3';
      //     }
      //     return (
      //       <span
      //         style={{
      //           padding: '2px 8px',
      //           borderRadius: '8px',
      //           backgroundColor: bgColor,
      //           color: fontColor,
      //           textAlign: 'center',
      //         }}
      //       >
      //         {attribute}
      //       </span>
      //     );
      //   },
      // },
      {
        name: 'attribute8',
        align: 'left',
        width: 150,
      },
      // {
      //   name: 'attribute6',
      //   align: 'left',
      //   width: 180,
      // },
      {
        name: 'attribute5',
        align: 'left',
        width: 150,
      },
    ];
  }
  /**
   * @name: 汇总物料
   */
  function onChange(checked) {
    setTotalStatus(checked);
    if (checked) {
      ds = new DataSet(totalInventoryQueryDS());
      ds.setQueryParameter('attribute7', sendStatus);
      ds.queryDataSet.reset();
    } else {
      ds = new DataSet(inventoryQueryDS());
      ds.setQueryParameter('attribute13', sendStatus);
      ds.queryDataSet.reset();
    }
  }
  /**
   * @name: 仅查看寄售
   */
  function onSendChange(checked) {
    setSendStatus(checked ? '1' : '0');
    if (checked) {
      if (totalStatus) {
        ds.setQueryParameter('attribute7', '1');
      } else {
        ds.setQueryParameter('attribute13', '1');
      }
      ds.query();
    } else {
      if (totalStatus) {
        ds.setQueryParameter('attribute7', '0');
      } else {
        ds.setQueryParameter('attribute13', '0');
      }
      ds.query();
    }
  }
  return (
    <div className={style['inventory-query-box']}>
      <Header title="核企侧库存查询">
        <div className={style['item-total']}>
          <span className={style['item-total-child']}>汇总物料</span>
          <Switch onChange={onChange} />
        </div>
        <div className={style['item-total']}>
          <span className={style['item-total-child']}>仅查看寄售</span>
          <Switch onChange={onSendChange} />
        </div>
      </Header>
      <Content>
        <div className={style['content-box']}>
          <Table
            dataSet={ds}
            queryFieldsLimit={4}
            columns={totalStatus ? totalColumns() : columns()}
            border={false}
            columnResizable="true"
            editMode="inline"
            rowHeight="52px"
          />
        </div>
      </Content>
    </div>
  );
};

export default InventoryQuery;
