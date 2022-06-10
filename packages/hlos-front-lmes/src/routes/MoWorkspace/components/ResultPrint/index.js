/*
 * @module: 经过计算高度处理数据后最终打印的内容
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-02-03 10:54:44
 * @LastEditTime: 2021-05-10 16:34:30
 * @copyright: Copyright (c) 2020,Hand
 */
import React, { Fragment } from 'react';
import Barcode from 'react-hooks-barcode';

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
export default function ResultPrint({ resultList }) {
  return (
    <Fragment>
      {resultList.lineDtoList &&
        resultList.lineDtoList.length > 0 &&
        resultList.lineDtoList.map((items, index) => {
          return (
            <div className={style['transfer-card-print-result']} key={index.toString()}>
              <header>
                <h1>车间生产工单</h1>
                <span>
                  <Barcode value={resultList.moNum} {...config} />
                </span>
              </header>
              <div className={style['transfer-card-print-content']}>
                <table width="100%">
                  <tr>
                    <td>工单号: {resultList.moNum}</td>
                    <td>要求完成时间: {resultList.demandDate}</td>
                    <td>数量: {resultList.demandQty}</td>
                  </tr>
                  <tr>
                    <td>物料编码: {resultList.itemCode}</td>
                    <td colSpan={3}>物料描述: {resultList.itemDescription}</td>
                  </tr>
                  <tr>
                    <td>图号: {resultList.drawingCode}</td>
                    <td colSpan={3}>特性值描述: {resultList.featureDesc}</td>
                  </tr>
                  <tr>
                    <td>父工单号: {resultList.topMoNum}</td>
                    <td colSpan={3}>父件物料: {resultList.parentItemDescription}</td>
                  </tr>
                  <tr>
                    <td>订单号: {resultList.orderNum}</td>
                    <td>型号规格: {resultList.shortCode}</td>
                    <td>
                      共{resultList.lineDtoList.length}页, 第{index + 1}页
                    </td>
                  </tr>
                </table>
                <table className={style['transfer-card-print-content-list']} border="1">
                  <tbody>
                    <tr>
                      <td>序号</td>
                      <td>任务条码</td>
                      <td>工序名称</td>
                      <td>检验规则/工序说明</td>
                      <td>数量</td>
                    </tr>
                    {items &&
                      items.map((list, k) => {
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
                <div>制单人: {resultList.releasedName}</div>
                <div>制单日期: {resultList.releasedDate}</div>
                <div>审核: </div>
                <div>仓管员: </div>
              </footer>
              {/* {resultList.lineDtoList.length === index + 1 ? (
                <footer>
                  <div>制单人: {resultList.releasedName}</div>
                  <div>制单日期: {resultList.releasedDate}</div>
                  <div>审核: </div>
                  <div>仓管员: </div>
                </footer>
              ) : null} */}
            </div>
          );
        })}
    </Fragment>
  );
}
