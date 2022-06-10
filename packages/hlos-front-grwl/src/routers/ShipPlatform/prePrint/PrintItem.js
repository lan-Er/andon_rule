/*
 * @module: 每一个单子
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-26 11:08:30
 * @LastEditTime: 2021-06-11 10:56:44
 * @copyright: Copyright (c) 2020,Hand
 */
import moment from 'moment';
import QRCode from 'qrcode.react';
import React, { useEffect, useMemo, useRef } from 'react';

import style from './index.module.less';

export default function PrintItem({ item = {}, coordinate, handleIntegrationData }) {
  const tableNode = useRef(null);
  const newItem = useMemo(() => item, [item]);
  useEffect(() => {
    if (
      tableNode &&
      tableNode.current &&
      newItem &&
      newItem.lineDtoList &&
      newItem.lineDtoList.length > 0
    ) {
      const everyLineHeight = [];
      let resultList = [];
      const {
        current: { childNodes },
      } = tableNode;
      if (childNodes && childNodes.length > 0) {
        childNodes.forEach((list) => {
          everyLineHeight.push(list.offsetHeight);
        });
        everyLineHeight.shift(); // 排除表格标题
        resultList = needSlice(everyLineHeight, 220);
      }
      handleChangeParentArrList(resultList);
    }
  }, [tableNode]);

  /**
   * @description: 将该组件实际数据处理成高度分割数据类型
   * @param {*} listArr
   * @return {*}
   */
  function handleChangeParentArrList(listArr) {
    const { lineDtoList } = item;
    const newLineDtoList = [];
    let startIndex = 0;
    let endIndex = 0;
    listArr.forEach((list) => {
      const len = list.length;
      endIndex = len + endIndex;
      const everyArray = lineDtoList.slice(startIndex, endIndex);
      newLineDtoList.push(everyArray);
      startIndex = endIndex;
    });
    const resultHeightList = { [coordinate]: { ...item, lineDtoList: newLineDtoList } }; // 每个组件根据高度处理以后的数据
    handleIntegrationData(resultHeightList);
  }

  /**
   * @description: 高度截取
   * @param {*} arr
   * @return {*}
   */
  function needSlice(arr, targetHeight) {
    let startIndex = 0;
    let endIndex = 0;
    let total = 0;
    const result = [];
    arr.forEach((itemHeight, j) => {
      if (total + itemHeight >= targetHeight) {
        const everyArry = arr.slice(startIndex, endIndex);
        result.push(everyArry);
        total = itemHeight;
        startIndex = j;
        if (j + 1 === arr.length) {
          const lastArray = arr.slice(startIndex, endIndex + 1);
          result.push(lastArray);
        }
      } else {
        total = itemHeight + total;
        endIndex = j + 1;
        if (j + 1 === arr.length) {
          const everyArry = arr.slice(startIndex, endIndex);
          result.push(everyArry);
        }
      }
    });
    return result;
  }

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
    <div className={style['ship-platform-every']}>
      <header>
        <div>打印日期：{moment().format('YYYY-MM-DD')}</div>
        <div>{item.partyName}</div>
        <div />
        <div className={style['qr-code-list']}>
          {item.deliveryNum && (
            <QRCode value={item.deliveryNum} size={60} fgColor="#000" renderAs="svg" level="M" />
          )}
        </div>
      </header>
      <div className={style['ship-platform-title']}>送货入仓单</div>
      <div className={style['table-title']}>
        <table>
          <tbody>
            <tr>
              <td>送货单类型：{item.documentTypeName}</td>
              <td>送货单号：{item.deliveryNum}</td>
              <td>供应商：{item.organizationName}</td>
              <td />
            </tr>
            <tr>
              <td>
                送货单日期：
                {item.creationDate ? moment(item.creationDate).format('YYYY-MM-DD') : null}
              </td>
              <td>
                要求到货日期：
                {item.applyShipDate ? moment(item.applyShipDate).format('YYYY-MM-DD') : null}
              </td>
              <td>预计到货日期：{item.expectArrivalDate}</td>
              <td />
            </tr>
            <tr>
              <td>厂区：{item.location}</td>
              <td>送货仓库：{item.customerReceiveWm}</td>
              <td>目标仓库：{item.customerInventoryWm}</td>
              <td>是否免检：{item.customerReceiveType}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={style['line-table-list']}>
        <table border="1">
          <tbody ref={tableNode}>
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
            {item.lineDtoList &&
              item.lineDtoList.length > 0 &&
              item.lineDtoList.map((lineListItem, j) => {
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
      </footer>
    </div>
  );
}
