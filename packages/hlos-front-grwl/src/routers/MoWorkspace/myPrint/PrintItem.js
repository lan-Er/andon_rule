/*
 * @module: 打印数据
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-02-02 15:52:13
 * @LastEditTime: 2021-06-24 15:22:49
 * @copyright: Copyright (c) 2020,Hand
 */
import Barcode from 'react-hooks-barcode';
import React, { Fragment, useEffect, useRef, useMemo } from 'react';

import style from './index.module.less';

const config = {
  width: 2,
  height: 40,
  format: 'CODE128',
  displayValue: true,
  fontOptions: '',
  font: 'monospace',
  textAlign: 'center',
  textPosition: 'bottom',
  textMargin: 2,
  fontSize: 14,
  background: '#fff',
  lineColor: '#000',
  margin: 0,
};
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
        everyLineHeight.shift();
        resultList = needSlice(everyLineHeight, 478);
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

  return (
    <Fragment>
      <header>
        <h1>车间生产工单</h1>
        <span>
          <Barcode value={item.moNum} {...config} />
        </span>
      </header>
      <div className={style['transfer-card-print-content']}>
        <table width="100%">
          <tr>
            <td>工单号: {item.moNum}</td>
            <td>要求完成时间: {item.demandDate}</td>
            <td>数量: {item.demandQty}</td>
          </tr>
          <tr>
            <td>物料编码: {item.itemCode}</td>
            <td colSpan={3}>物料描述: {item.itemDescription}</td>
          </tr>
          <tr>
            <td>图号: {item.drawingCode}</td>
            <td colSpan={3}>特性值描述: {item.featureDesc}</td>
          </tr>
          <tr>
            <td>父工单号: {item.topMoNum}</td>
            <td colSpan={3}>父件物料: {item.parentItemDescription}</td>
          </tr>
          <tr>
            <td>订单号: {item.orderNum}</td>
            <td colSpan={3}>型号规格: {item.shortCode}</td>
          </tr>
        </table>
        <table className={style['transfer-card-print-content-list']} border="1">
          <tbody
            ref={(node) => {
              tableNode.current = node;
            }}
          >
            <tr>
              <td>序号</td>
              <td>任务条码</td>
              <td>工序名称</td>
              <td>检验规则/工序说明</td>
              <td>数量</td>
            </tr>
            {item.lineDtoList &&
              item.lineDtoList.length > 0 &&
              item.lineDtoList.map((list, k) => {
                return (
                  <tr key={k.toString()} className={style['my-talbe-print-line-list']}>
                    <td>{list.sequenceNum}</td>
                    <td>
                      <Barcode value={list.taskNum} {...config} fontSize={12} />
                    </td>
                    <td>{list.operation}</td>
                    <td>{list.inspectionRuleInstruction}</td>
                    <td>{list.taskQty}</td>
                    {/* <td>
                      {list.standardWorkTime ? Number(list.standardWorkTime) : 0}
                      {list.unitPrice ? `/${Number(list.unitPrice)}` : '/0'}
                    </td> */}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <footer>
        <div>制单人: {item.releasedName}</div>
        <div>制单日期: {item.releasedDate}</div>
        <div>审核: </div>
        <div>仓管员: </div>
      </footer>
    </Fragment>
  );
}
