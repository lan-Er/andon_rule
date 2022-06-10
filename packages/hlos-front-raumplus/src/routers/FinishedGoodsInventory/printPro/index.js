/*
 * @module: 打印table版本
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-21 13:55:38
 * @LastEditTime: 2021-05-26 19:15:49
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';
import QRCode from 'qrcode.react';

import style from './index.module.less';

export default function PrintPro({ printArray }) {
  return (
    <div className={style['my-print-pro']}>
      <section>
        <div className={style['item-top']}>
          <div className={style['item-top-left']}>
            <div>
              {printArray.packagingBrand}
              <span>{printArray.orderType}</span>
            </div>
            <div>{printArray.soNum}</div>
          </div>
          <div className={style['item-top-right']}>
            <QRCode value={printArray.tagCode} fgColor="#000" renderAs="svg" level="M" size={45} />
            <span>{printArray.tagCode}</span>
          </div>
        </div>
        <div className={style['item-bottom']}>
          <div className={style['item-bottom-left']}>
            <div className={style['item-text-overflow']}>
              <div>
                <span>
                  <p>{printArray.customer}</p>
                </span>
                <span>
                  <p>{printArray.area}</p>
                </span>
                <span className={style['print-erp-number']}>
                  <p>{printArray.erpnum}</p>
                </span>
              </div>
            </div>
          </div>
          <div className={style['item-bottom-right']}>
            <span>总包数 {printArray.totalNumber}</span>
            <span>第 {printArray.packageNum} 包</span>
          </div>
        </div>
      </section>
      <p className={style['item-time']}>{printArray.packageTime}</p>
      <span />
      <section>
        <div className={style['item-top']}>
          <div className={style['item-top-left']}>
            <div>
              {printArray.packagingBrand}
              <span>{printArray.orderType}</span>
            </div>
            <div>{printArray.soNum}</div>
          </div>
          <div className={style['item-top-right']}>
            <QRCode value={printArray.tagCode} fgColor="#000" renderAs="svg" level="M" size={45} />
            <span>{printArray.tagCode}</span>
          </div>
        </div>
        <div className={style['item-bottom']}>
          <div className={style['item-bottom-left']}>
            <div className={style['item-text-overflow']}>
              <div>
                <span>
                  <p>{printArray.customer}</p>
                </span>
                <span>
                  <p>{printArray.area}</p>
                </span>
                <span className={style['print-erp-number']}>
                  <p>{printArray.erpnum}</p>
                </span>
              </div>
            </div>
          </div>
          <div className={style['item-bottom-right']}>
            <span>总包数 {printArray.totalNumber}</span>
            <span>第 {printArray.packageNum} 包</span>
          </div>
        </div>
      </section>
      <p className={style['item-time']}>{printArray.packageTime}</p>
      <span />
      <section>
        <div className={style['item-top']}>
          <div className={style['item-top-left']}>
            <div>
              {printArray.packagingBrand}
              <span>{printArray.orderType}</span>
            </div>
            <div>{printArray.soNum}</div>
          </div>
          <div className={style['item-top-right']}>
            <QRCode value={printArray.tagCode} fgColor="#000" renderAs="svg" level="M" size={45} />
            <span>{printArray.tagCode}</span>
          </div>
        </div>
        <div className={style['item-bottom']}>
          <div className={style['item-bottom-left']}>
            <div className={style['item-text-overflow']}>
              <div>
                <span>
                  <p>{printArray.customer}</p>
                </span>
                <span>
                  <p>{printArray.area}</p>
                </span>
                <span className={style['print-erp-number']}>
                  <p>{printArray.erpnum}</p>
                </span>
              </div>
            </div>
          </div>
          <div className={style['item-bottom-right']}>
            <span>总包数 {printArray.totalNumber}</span>
            <span>第 {printArray.packageNum} 包</span>
          </div>
        </div>
      </section>
      <p className={style['item-time']}>{printArray.packageTime}</p>
      <span />
      <section>
        <div className={style['item-top']}>
          <div className={style['item-top-left']}>
            <div>
              {printArray.packagingBrand}
              <span>{printArray.orderType}</span>
            </div>
            <div>{printArray.soNum}</div>
          </div>
          <div className={style['item-top-right']}>
            <QRCode value={printArray.tagCode} fgColor="#000" renderAs="svg" level="M" size={45} />
            <span>{printArray.tagCode}</span>
          </div>
        </div>
        <div className={style['item-bottom']}>
          <div className={style['item-bottom-left']}>
            <div className={style['item-text-overflow']}>
              <div>
                <span>
                  <p>{printArray.customer}</p>
                </span>
                <span>
                  <p>{printArray.area}</p>
                </span>
                <span className={style['print-erp-number']}>
                  <p>{printArray.erpnum}</p>
                </span>
              </div>
            </div>
          </div>
          <div className={style['item-bottom-right']}>
            <span>总包数 {printArray.totalNumber}</span>
            <span>第 {printArray.packageNum} 包</span>
          </div>
        </div>
      </section>
      <p className={style['item-time']}>{printArray.packageTime}</p>
      <span />
    </div>
  );
}
