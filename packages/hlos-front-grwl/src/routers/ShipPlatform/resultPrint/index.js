/*
 * @module: 最终显示在纸张上的打印界面
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-26 10:21:26
 * @LastEditTime: 2021-06-07 15:24:45
 * @copyright: Copyright (c) 2020,Hand
 */
import moment from 'moment';
import QRCode from 'qrcode.react';
import React, { Fragment } from 'react';

import style from './index.module.less';

export default function ResultPrint({ resultList }) {
  /**
   * @description: 小数保留四位小数，整数不保留小数
   * @param {*} params
   * @return {*}
   */
  function addFloat(params) {
    if (!params) {
      return 0;
    }
    const paramsNumber = typeof params === 'number' ? params : Number(params);
    if (parseInt(params, 10) === paramsNumber) {
      return paramsNumber;
    } else {
      return parseFloat(paramsNumber, 10).toFixed(4);
    }
  }

  return (
    <Fragment>
      {resultList.lineDtoList &&
        resultList.lineDtoList.length > 0 &&
        resultList.lineDtoList.map((items, index) => {
          return (
            <div className={style['ship-platform-every']} key={index.toString()}>
              <header>
                <div>打印日期：{moment().format('YYYY-MM-DD')}</div>
                <div>{resultList.partyName}</div>
                <div />
                <div className={style['qr-code-list']}>
                  {resultList.deliveryNum && (
                    <QRCode
                      value={resultList.deliveryNum}
                      size={60}
                      fgColor="#000"
                      renderAs="svg"
                      level="M"
                    />
                  )}
                </div>
              </header>
              <div className={style['ship-platform-title']}>送货入仓单</div>
              <div className={style['table-title']}>
                <table>
                  <tbody>
                    <tr>
                      <td>送货单类型：{resultList.documentTypeName}</td>
                      <td>送货单号：{resultList.deliveryNum}</td>
                      <td>供应商：{resultList.organizationName}</td>
                      <td />
                    </tr>
                    <tr>
                      <td>
                        送货单日期：
                        {resultList.creationDate
                          ? moment(resultList.creationDate).format('YYYY-MM-DD')
                          : null}
                      </td>
                      <td>
                        要求到货日期：
                        {resultList.applyShipDate
                          ? moment(resultList.applyShipDate).format('YYYY-MM-DD')
                          : null}
                      </td>
                      <td>预计到货日期：{resultList.expectArrivalDate}</td>
                      <td />
                    </tr>
                    <tr>
                      <td>厂区：{resultList.location}</td>
                      <td>送货仓库：{resultList.customerReceiveWm}</td>
                      <td>目标仓库：{resultList.customerInventoryWm}</td>
                      <td>是否免检：{resultList.customerReceiveType}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={style['line-table-list']}>
                <table border="1">
                  <tbody>
                    <tr>
                      <td>序号</td>
                      <td>工号-箱号-分箱</td>
                      <td>物料编码</td>
                      <td>物料名称</td>
                      <td>助记码</td>
                      <td>送货数量</td>
                      <td>单位</td>
                      <td>采购订单</td>
                      <td>接收数量</td>
                      <td>合格数量</td>
                      <td>入库数量</td>
                      <td>备注</td>
                    </tr>
                    {items &&
                      items.length > 0 &&
                      items.map((lineListItem, j) => {
                        return (
                          <tr key={j.toString()}>
                            <td>{lineListItem.shipOrderLineNum}</td>
                            <td />
                            <td>{lineListItem.itemCode}</td>
                            <td>{lineListItem.itemDescription}</td>
                            <td>{lineListItem.itemIdentifyCode}</td>
                            <td>{lineListItem.shippedQty && addFloat(lineListItem.shippedQty)}</td>
                            <td>{lineListItem.uomName}</td>
                            <td>{lineListItem.customerPo}</td>
                            <td />
                            <td />
                            <td />
                            <td>{lineListItem.remark}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <footer>
                <table>
                  <tbody>
                    <tr>
                      <td>送货人：</td>
                      <td>接收人签收：</td>
                      <td>质检员签收：</td>
                      <td>入库记账：</td>
                    </tr>
                    <tr>
                      <td>送货日期：</td>
                      <td>接收日期：</td>
                      <td>质检日期：</td>
                      <td>记账日期：</td>
                    </tr>
                  </tbody>
                </table>
                <div>{`第${index + 1}页， 共${resultList.lineDtoList.length}页`}</div>
              </footer>
            </div>
          );
        })}
    </Fragment>
  );
}
