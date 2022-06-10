/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-05-07 11:28:38
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-07-16 10:18:50
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
              <span>{printArray.customer}</span>
            </div>
            {/* <div>{printArray.soNum}</div> */}
          </div>
          {/* <div className={style['item-top-right']}>
            <QRCode value={printArray.tagCode} fgColor="#000" renderAs="svg" level="M" size={45} />
            <span>{printArray.tagCode}</span>
          </div> */}
        </div>
        <div className={style['item-bottom']}>
          <div className={style['item-bottom-left']}>
            <div className={style['item-text-overflow']}>
              <div className={style['bottom-left']}>
                <span className={style['order-type']}>
                  <p>{printArray.orderType}</p>
                </span>
                <span className={style['erp-num']}>
                  <p>{printArray.erpnum}</p>
                </span>
                <span className={style['erp-num']}>
                  <p>{printArray.contractNum}</p>
                </span>
                <span className={style['print-erp-number']}>
                  <p>{printArray.soNum}</p>
                </span>
              </div>
              <div className={style['bottom-right']}>
                <QRCode
                  value={printArray.tagCode}
                  fgColor="#000"
                  renderAs="svg"
                  level="M"
                  size={45}
                />
                <span>{printArray.tagCode}</span>
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
              <span>{printArray.customer}</span>
            </div>
            {/* <div>{printArray.soNum}</div> */}
          </div>
          {/* <div className={style['item-top-right']}>
            <QRCode value={printArray.tagCode} fgColor="#000" renderAs="svg" level="M" size={45} />
            <span>{printArray.tagCode}</span>
          </div> */}
        </div>
        <div className={style['item-bottom']}>
          <div className={style['item-bottom-left']}>
            <div className={style['item-text-overflow']}>
              <div className={style['bottom-left']}>
                <span className={style['order-type']}>
                  <p>{printArray.orderType}</p>
                </span>
                <span className={style['erp-num']}>
                  <p>{printArray.erpnum}</p>
                </span>
                <span className={style['erp-num']}>
                  <p>{printArray.contractNum}</p>
                </span>
                <span className={style['print-erp-number']}>
                  <p>{printArray.soNum}</p>
                </span>
              </div>
              <div className={style['bottom-right']}>
                <QRCode
                  value={printArray.tagCode}
                  fgColor="#000"
                  renderAs="svg"
                  level="M"
                  size={45}
                />
                <span>{printArray.tagCode}</span>
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
              <span>{printArray.customer}</span>
            </div>
            {/* <div>{printArray.soNum}</div> */}
          </div>
          {/* <div className={style['item-top-right']}>
            <QRCode value={printArray.tagCode} fgColor="#000" renderAs="svg" level="M" size={45} />
            <span>{printArray.tagCode}</span>
          </div> */}
        </div>
        <div className={style['item-bottom']}>
          <div className={style['item-bottom-left']}>
            <div className={style['item-text-overflow']}>
              <div className={style['bottom-left']}>
                <span className={style['order-type']}>
                  <p>{printArray.orderType}</p>
                </span>
                <span className={style['erp-num']}>
                  <p>{printArray.erpnum}</p>
                </span>
                <span className={style['erp-num']}>
                  <p>{printArray.contractNum}</p>
                </span>
                <span className={style['print-erp-number']}>
                  <p>{printArray.soNum}</p>
                </span>
              </div>
              <div className={style['bottom-right']}>
                <QRCode
                  value={printArray.tagCode}
                  fgColor="#000"
                  renderAs="svg"
                  level="M"
                  size={45}
                />
                <span>{printArray.tagCode}</span>
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
              <span>{printArray.customer}</span>
            </div>
            {/* <div>{printArray.soNum}</div> */}
          </div>
          {/* <div className={style['item-top-right']}>
            <QRCode value={printArray.tagCode} fgColor="#000" renderAs="svg" level="M" size={45} />
            <span>{printArray.tagCode}</span>
          </div> */}
        </div>
        <div className={style['item-bottom']}>
          <div className={style['item-bottom-left']}>
            <div className={style['item-text-overflow']}>
              <div className={style['bottom-left']}>
                <span className={style['order-type']}>
                  <p>{printArray.orderType}</p>
                </span>
                <span className={style['erp-num']}>
                  <p>{printArray.erpnum}</p>
                </span>
                <span className={style['erp-num']}>
                  <p>{printArray.contractNum}</p>
                </span>
                <span className={style['print-erp-number']}>
                  <p>{printArray.soNum}</p>
                </span>
              </div>
              <div className={style['bottom-right']}>
                <QRCode
                  value={printArray.tagCode}
                  fgColor="#000"
                  renderAs="svg"
                  level="M"
                  size={45}
                />
                <span>{printArray.tagCode}</span>
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
