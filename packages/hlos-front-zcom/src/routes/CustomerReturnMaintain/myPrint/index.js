import { connect } from 'dva';
import QRCode from 'qrcode';
import queryString from 'query-string';
import Barcode from 'react-hooks-barcode';
import React, { Fragment, useRef, useEffect, useState } from 'react';
import { Button } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';
import style from './index.module.less';

function MyPrint({ location, dispatch }) {
  const printNode = useRef(null);
  const [allowPrint, setAllowPrint] = useState(false);
  const [printItemRefundInfo, setPrintItemRefundInfo] = useState([]);
  const [dataURL, setDataURL] = useState('');
  const [backPath, setBackPath] = useState('');

  const { search } = location;
  const params = search ? queryString.parse(search) : {};

  const config = {
    width: 2,
    height: 40,
    format: 'CODE128',
    displayValue: false,
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

  useEffect(() => {
    setBackPath(`/zcom/customer-return-maintain/detail/${params.itemRefundId}`);
    dispatch({
      type: 'customerRefund/itemRefundPrint',
      payload: { itemRefundId: params.itemRefundId },
    })
      .then((res) => {
        setPrintItemRefundInfo([res]);
        setAllowPrint(true);
        QRCode.toDataURL(res.itemRefundNum)
          .then((url) => {
            setDataURL(url);
            // eslint-disable-next-line no-console
            console.log(url);
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err);
          });
      })
      .catch(() => {
        setPrintItemRefundInfo([]);
        setAllowPrint(false);
      });
  }, [params.itemRefundId]);

  function handlePrint() {
    const pageStyle =
      '@page { size: A4 portrait; margin: 40pt 0; overflow: hidden; } @media print { body { -webkit-print-color-adjust: exact; } } html,body { overflow: auto!important; height: auto!important; }';
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

  function getToday() {
    const myDate = new Date();
    return `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`;
  }

  return (
    <Fragment>
      <Header title="退料单打印" backPath={backPath}>
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
                <div className={style['customer-return-print']} key={index.toString()}>
                  <header>
                    <div>
                      送货日期：
                      <br /> {getToday()}
                    </div>
                    <div className={style['return-print-title']}>
                      <p className={style['print-title']}>{item.tenantName}</p>
                      <p>退料单</p>
                    </div>
                    <div>
                      退料单号：
                      <br /> {item.itemRefundNum}
                    </div>
                  </header>
                  <div className={style['transfer-order']}>
                    <div className={style['send-order-info']}>
                      <div>
                        <p>退料⽅：</p>
                        <p>
                          {item.refundContactName} {item.refundContactPhone}
                        </p>
                      </div>
                      <div>
                        <p>收货⽅：</p>
                        <p>
                          {item.receiveContactName} {item.receiveContactPhone}
                        </p>
                      </div>
                      <div>
                        <p>收货地址：</p>
                        <p>{item.receiveAddress}</p>
                      </div>
                      <div>
                        <p>客户：</p>
                        <p>{item.customerName}</p>
                      </div>
                      <div>
                        <p>备注：</p>
                        <p>{item.remark}</p>
                      </div>
                    </div>
                    <div className={style['send-order']}>
                      <div>
                        <Barcode value={item.itemRefundNum} {...config} />
                      </div>
                      <div>
                        <img src={dataURL} width="150" alt="QRCode" />
                      </div>
                    </div>
                  </div>
                  <div className={style['transfer-card-print-content']}>
                    <table className={style['transfer-card-print-content-list']} border="1">
                      <tbody>
                        <tr style={{ pageBreakAfter: 'always' }}>
                          <td>行</td>
                          <td>物料编码</td>
                          <td>物料描述</td>
                          <td>单位</td>
                          <td>退料数量</td>
                          <td>收货数量</td>
                          <td>包装明细</td>
                          <td>退料日期</td>
                          <td>备注</td>
                        </tr>
                        {item.itemRefundLineList &&
                          item.itemRefundLineList.length > 0 &&
                          item.itemRefundLineList.map((list, k) => {
                            return (
                              <tr key={k.toString()}>
                                <td>{k + 1}</td>
                                <td>{list.customerItemCode}</td>
                                <td>{list.customerItemDescription}</td>
                                <td>{list.uomName}</td>
                                <td>{list.refundQty}</td>
                                <td />
                                <td />
                                <td>
                                  {item.itemRefundDate ? item.itemRefundDate.substring(0, 10) : ''}
                                </td>
                                <td>{list.lineRemark}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className={style['transfer-card-print-footer']}>
                    <div>
                      <div>退料公司经⼿⼈（签字及盖章）: </div>
                      <div>收货公司经⼿⼈（签字及盖章）:</div>
                    </div>
                    <div>
                      <p>注意：</p>
                      <div className={style['transfer-card-print-footer-attention']}>
                        <p>1.⼯⼚退料前必须电话或书⾯通知我司供应中⼼，否则我司仓库有权拒收。</p>
                        <p>
                          2.我司仓库收货时间为⼯作⽇上班时间，如遇其他时间送货须提前通知我司供应中⼼，经确认同意后⽅可送货，否则我司仓库拒绝收货。
                        </p>
                        <p>
                          3.本单据⼀式三联(A4纸打印)，第⼀联收货⽅留底，第⼆联收货⽅财务留底，第三联供应商带回。请供应商妥善保管，以此作为结算依据。
                        </p>
                      </div>
                    </div>
                    <div className={style['transfer-card-print-footer-car']}>
                      <div>司机姓名：</div>
                      <div>车牌号：</div>
                      <div>司机联系⽅式：</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Content>
    </Fragment>
  );
}
export default connect()(MyPrint);
