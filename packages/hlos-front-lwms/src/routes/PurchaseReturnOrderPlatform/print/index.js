import { connect } from 'dva';
import queryString from 'query-string';
import React, { Fragment, useRef, useEffect, useState } from 'react';
import { Button } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';
import style from './index.module.less';

function MyPrint({ location, dispatch, history }) {
  const printNode = useRef(null);
  const [allowPrint, setAllowPrint] = useState(false);
  const [printItemRefundInfo, setPrintItemRefundInfo] = useState([]);

  const { search } = location;
  const params = search ? queryString.parse(search) : {};

  useEffect(() => {
    const { state } = location;
    dispatch({
      type: 'purchaseReturnOrderPlatform/printDeliveryReturn',
      payload: state,
    })
      .then((res) => {
        handlePrintData(res);
        setAllowPrint(true);
      })
      .catch(() => {
        setPrintItemRefundInfo([]);
        setAllowPrint(false);
      });
  }, [params.deliveryReturnIds]);

  function handlePrintData(res) {
    const printDate = [];
    res.forEach((element) => {
      const lineDTOList = element.lineDTOList.slice();
      const linelength = Math.ceil(element.lineDTOList.length / 10);
      if (linelength === 1) {
        printDate.push({
          ...element,
          currentIndex: 1,
          linelength,
        });
      } else {
        for (let i = 0; i <= linelength - 1; i++) {
          printDate.push({
            ...element,
            lineDTOList: lineDTOList.slice(i * 10, i * 10 + 10),
            currentIndex: i + 1,
            linelength,
          });
        }
      }
    });
    setPrintItemRefundInfo(printDate);
  }

  function handlePrint() {
    const pageStyle =
      '@page { size: A4 landscape; margin: 40pt 0; overflow: hidden; } @media print { body { -webkit-print-color-adjust: exact; } } html,body { overflow: auto!important; height: auto!important; }';
    if (
      printNode &&
      printNode.current &&
      printNode.current.children &&
      printNode.current.children.length > 0
    ) {
      ReactToPrint({ content: printNode && printNode.current, pageStyle });
    } else {
      notification.warning({ message: '没有打印的数据' });
    }
  }

  function handleBack() {
    // sessionStorage.setItem('purchaseReturn/flag', false);
    sessionStorage.setItem('purchaseReturnParentQuery', false);
  }

  return (
    <Fragment>
      <Header
        title="采购退货单打印"
        onBack={handleBack}
        backPath="/lwms/purchase-return-order-platform/list"
      >
        <Button
          funcType="flat"
          color="primary"
          icon="print"
          onClick={handlePrint}
          title="注意：请选用A4纸，横向打印"
          disabled={!allowPrint}
        >
          打印
        </Button>
      </Header>
      <Content>
        <div
          ref={(node) => {
            printNode.current = node;
          }}
        >
          {printItemRefundInfo &&
            printItemRefundInfo.map((item, index) => {
              return (
                <div className={style['purchase-return-order']} key={index.toString()}>
                  <header>
                    <div>编号：{item.deliveryReturnNum}</div>
                    <div className={style['purchase-return-order-title']}>
                      <p>供应商不合格品退货单</p>
                    </div>
                    <div>
                      {item.currentIndex}/{item.linelength}
                    </div>
                  </header>
                  <div className={style['transfer-card-print-content']}>
                    <div>
                      <p>
                        供应商：<span style={{ marginRight: '20px' }}>{item.partyName}</span>
                      </p>
                    </div>
                    <table className={style['transfer-card-print-content-list']} border="1">
                      <tbody>
                        <tr
                          style={{
                            pageBreakAfter: 'always',
                            backgroundColor: '#0070c0',
                            color: '#fff',
                          }}
                        >
                          <td>#</td>
                          <td>物料长代码</td>
                          <td>原订单号</td>
                          <td>物料名称</td>
                          <td>规格型号</td>
                          <td>退货数量</td>
                          <td>退货原因</td>
                          <td>备注</td>
                        </tr>
                        {item.lineDTOList &&
                          item.lineDTOList.length > 0 &&
                          item.lineDTOList.map((list, k) => {
                            return (
                              <tr key={k.toString()}>
                                <td>{k + 1}</td>
                                <td>{list.itemCode}</td>
                                <td>{list.poNum}</td>
                                <td>{list.description}</td>
                                <td>{list.specification}</td>
                                <td>{list.returnedQty}</td>
                                <td>{list.returnReason}</td>
                                <td>{list.remark}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <footer>
                    <div>退货人：{item.workerNames.join('/')}</div>
                    <div>供应商确认（签字）：</div>
                    <div>退货日期：</div>
                  </footer>
                </div>
              );
            })}
        </div>
      </Content>
    </Fragment>
  );
}
export default connect()(MyPrint);
