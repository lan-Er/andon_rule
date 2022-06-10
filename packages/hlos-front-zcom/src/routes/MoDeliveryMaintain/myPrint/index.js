import { connect } from 'dva';
import queryString from 'query-string';
import { Button } from 'choerodon-ui/pro';
import Barcode from 'react-hooks-barcode';
import React, { Fragment, useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';

import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';
import styles from './index.less';

function MyPrint({ location, dispatch }) {
  const printNode = useRef(null);
  const [allowPrint, setAllowPrint] = useState(false);
  const [printDeliveryInfo, setPrintDeliveryInfo] = useState([]);
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
    setBackPath(`/zcom/mo-delivery-maintain/detail/${params.deliveryOrderId}`);
    dispatch({
      type: 'moDeliveryMaintain/moDeliveryPrint',
      payload: { deliveryOrderId: params.deliveryOrderId },
    })
      .then((res) => {
        setPrintDeliveryInfo([res]);
        setAllowPrint(true);
        QRCode.toDataURL(res.deliveryOrderNum)
          .then((url) => {
            setDataURL(url);
            console.log(url);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch(() => {
        setPrintDeliveryInfo([]);
        setAllowPrint(false);
      });
  }, [params.deliveryOrderId]);

  function handlePrint() {
    const pageStyle =
      '@page { size: A4 portrait;  margin: 40pt 0; overflow: hidden; } @media print { body { -webkit-print-color-adjust: exact; } } html,body { overflow: auto!important; height: auto!important; }';
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
  return (
    <Fragment className={styles['delivery-maintain-print-page']}>
      <Header title="送货单打印" backPath={backPath}>
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
          {printDeliveryInfo &&
            printDeliveryInfo.map((item, index) => {
              return (
                <div className={styles['delivery-maintain-print']} key={index.toString()}>
                  <header>
                    <div>
                      <p>送货日期</p>
                      <p>{item.planDeliveryDate ? item.planDeliveryDate.substring(0, 10) : ''}</p>
                    </div>

                    <div className={styles['maintain-print-title']}>
                      <p className={styles['print-title']}>{item.tenantName}</p>
                      <p>送货单</p>
                    </div>

                    <div>
                      <p>送货单编码</p>
                      <p>{item.deliveryOrderNum}</p>
                    </div>
                  </header>

                  <div className={styles['transfer-order']}>
                    <div className={styles['send-order-info']}>
                      <div>
                        <p className={styles['send-order-name']}>
                          Vendor Code: {item.supplierNumber}
                        </p>
                      </div>
                      <div>
                        <p>发货⽅:</p>
                        <p>
                          {item.contact} {item.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <p>收货⽅:</p>
                        <p>
                          {item.receiveContactName} {item.receiveContactPhone}
                        </p>
                      </div>
                      <div>
                        <p>采购⽅:</p>
                        <p>
                          {item.buyerCode} {item.buyerName}
                        </p>
                      </div>
                      <div>
                        <p>送货地址:</p>
                        <p>{item.receiveAddress}</p>
                      </div>
                      <div>
                        <p>收货仓库:</p>
                        <p>
                          {item.receiveWarehouseCode} {item.receiveWarehouseName}
                        </p>
                      </div>
                      <div>
                        <p>备注:</p>
                        <p>{item.remark}</p>
                      </div>
                    </div>

                    <div className={styles['send-order']}>
                      <div>
                        <Barcode value={item.deliveryOrderNum} {...config} />
                      </div>
                      <div>
                        <img src={dataURL} width="170" alt="QRCode" />
                      </div>
                    </div>
                  </div>

                  <div className={styles['transfer-card-print-content']}>
                    <table className={styles['transfer-card-print-content-list']} border="1">
                      <tbody>
                        <tr style={{ pageBreakAfter: 'always' }}>
                          <td>行</td>
                          <td>MO订单号</td>
                          <td>物料编号</td>
                          <td>物料描述</td>
                          <td>单位</td>
                          <td>送货数量</td>
                          <td>收货数量</td>
                          <td>包装明细</td>
                          <td>需求送货日期</td>
                          <td>备注</td>
                        </tr>
                        {item.deliveryLineDTOList &&
                          item.deliveryLineDTOList.length > 0 &&
                          item.deliveryLineDTOList.map((list, k) => {
                            return (
                              <tr key={k.toString()}>
                                <td>{k + 1}</td>
                                <td>{list.sourceDocNum}</td>
                                <td>{list.customerItemCode}</td>
                                <td>{list.customerItemDescription}</td>
                                <td>{list.uomName}</td>
                                <td>{list.deliveryQty}</td>
                                <td />
                                <td />
                                <td>{list.demandDate ? list.demandDate.substring(0, 10) : ''}</td>
                                <td>{list.lineRemark}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  <div className={styles['transfer-card-print-footer']}>
                    <div>
                      <div>送货公司经⼿⼈（签字及盖章）: </div>
                      <div>收货公司经⼿⼈（签字及盖章）:</div>
                    </div>

                    <div>
                      <p>注意：</p>
                      <p>1.⼯⼚送货前必须电话或书⾯通知我司供应中⼼，否则我司仓库有权拒收。</p>
                      <p>
                        2.我司仓库收货时间为⼯作⽇上班时间，如遇其他时间送货须提前通知我司供应中⼼，经确认同意后⽅可送货，否则我司仓库拒绝收货。
                      </p>
                      <p>
                        {' '}
                        3.本单据⼀式三联(A4纸打印)，第⼀联收货⽅留底，第⼆联收货⽅财务留底，第三联供应商带回。请供应商妥善保管，以此作为结算依据。
                      </p>
                    </div>

                    <div className={styles['transfer-card-print-footer-car']}>
                      <div>送货司机姓名：</div>
                      <div>车号：</div>
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
