import React from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Button, Form, Lov, NumberField, TextField, Modal } from 'choerodon-ui/pro';
import moment from 'moment';
import PrintElement from '@/components/PrintElement';
import QRCode from 'qrcode.react';
import { queryHeadDS } from '../../stores/labelPrintingDS';
import styles from './index.less';

const headDS = new DataSet(queryHeadDS());
const pathCode = 'www.jiachenin.com-';

const LabelPrinting = () => {
  const viewLoading = false;
  const [visible, setVisible] = React.useState(false);
  const printDomRef = React.useRef(null);

  const [printingCodeList, setPrintingCodeList] = React.useState([]);

  function printingSubmit() {
    const params = headDS.queryDataSet.current.toJSONData();
    if (!params.itemCode) {
      Modal.warning('请选择物料编码!');
      return;
    }
    if (!params.startNum || !/^[0-9]+$/.test(params.startNum)) {
      Modal.warning('请输入起始流水（0-9数字）!');
      return;
    }
    if (!params.tagNum) {
      Modal.warning('请输入标签数量!');
      return;
    }
    const dataCode = moment(new Date()).format('YYMMDD');
    const tagCodeList = [];
    // 获取起始流水前面的0
    const zeroNum = params.startNum.split('').findIndex((item) => {
      return item !== '0';
    });
    const zeroArr = [];
    for (let index = 0; index < zeroNum; index++) {
      zeroArr.push('0');
    }
    const zeroStr = zeroArr.join('');
    // 拼接二维码code字符串
    for (let index = 0; index < params.tagNum; index++) {
      const serialNumber = zeroStr + (Number(params.startNum) + index);
      tagCodeList.push({
        qrCode: `${pathCode}${params.itemCode}-${dataCode}-${serialNumber}`,
        itemCode: params.itemCode,
      });
    }
    let tempList = group(tagCodeList, 4);
    tempList = tempList.map((item) => {
      return {
        groupList: item,
      };
    });
    console.log(tempList);
    setPrintingCodeList(tempList);
    setVisible(true);
  }

  function group(array, subGroupLength) {
    let index = 0;
    let subGroupLengths = subGroupLength;
    if (index > 0) {
      subGroupLengths = subGroupLength + 3;
    }
    const newArray = [];
    while (index < array.length) {
      newArray.push(array.slice(index, (index += subGroupLengths)));
    }
    return newArray;
  }

  return (
    <React.Fragment>
      <Header title="标签打印">
        {visible && (
          <Button
            color="primary"
            onClick={() => {
              PrintElement({
                content: printDomRef.current,
              });
            }}
          >
            打印
          </Button>
        )}
      </Header>
      <Content>
        <Form dataSet={headDS.queryDataSet} columns={4}>
          <Lov name="itemObj" clearButton noCache />
          <TextField name="startNum" clearButton noCache />
          <NumberField name="tagNum" clearButton noCache />
          <Button
            type="submit"
            onClick={printingSubmit}
            loading={viewLoading}
            style={{ width: '120px' }}
          >
            标签渲染
          </Button>
        </Form>
        {visible && (
          <div
            id="printDiv"
            className={styles['jc-label-printing']}
            style={{ marginTop: 0, marginLeft: 32, overflow: 'hidden' }}
            ref={printDomRef}
          >
            <table>
              <tbody>
                {printingCodeList.map((item, index) => (
                  <tr key={index} style={{ display: 'flex', borderBottom: '6px solid #ffffff' }}>
                    {item.groupList.map((groupItem) => (
                      <td key={groupItem.qrCode} className={styles['label-item']}>
                        <QRCode
                          value={groupItem.qrCode}
                          size={30}
                          fgColor="#000"
                          renderAs="svg"
                          level="L"
                        />
                        <div className={styles['item-code']}>{groupItem.itemCode}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Content>
    </React.Fragment>
  );
};

export default LabelPrinting;
