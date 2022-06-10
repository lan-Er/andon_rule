/*
 * @module: 物料二维码打印
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-28 16:05:54
 * @LastEditTime: 2021-06-11 16:08:32
 * @copyright: Copyright (c) 2020,Hand
 */
import QRCode from 'qrcode.react';
import React, { Fragment } from 'react';

import styles from './index.less';

export default function ItemPrint({ itemPrintList }) {
  return (
    <Fragment>
      {itemPrintList && itemPrintList.length
        ? itemPrintList.map((v) =>
            v.itemCode ? (
              <div className={styles['code-box']}>
                <div className={styles['code-left']}>
                  <QRCode value={v.qrCode} size={56} fgColor="#000" renderAs="svg" level="M" />
                </div>
                <div className={styles['code-right']}>
                  <div className={styles['code-right-top']}>
                    <span>{v.itemCode}</span>
                  </div>
                  <div className={styles['code-right-bottom']}>{v.itemDescription}</div>
                </div>
              </div>
            ) : (
              <div className={styles['code-box']}>
                <div style={{ lineHeight: '20mm', marginLeft: '25mm' }}>下一条</div>
              </div>
            )
          )
        : null}
    </Fragment>
  );
}
