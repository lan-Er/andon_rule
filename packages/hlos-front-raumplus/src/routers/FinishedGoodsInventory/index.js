/**
 * @Description: 成品库存查询
 */
import React, { useEffect, useRef, useState } from 'react';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import { Table, DataSet, Form, TextField, Lov, Button } from 'choerodon-ui/pro';

import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { queryLovData } from 'hlos-front/lib/services/api';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';

import styles from './index.less';
// import PrintCodeSheet from './printPro';
import PrintCodeSheet from './print/PrintCodeSheet';
import codeConfig from '@/common/codeConfig';
import { tableQuery, tableDetailed } from '@/stores/FinishedGoodsInventoryDS';
import { getPrintListService } from '@/services/finishedGoodsInventorySeervice';

const organizationId = getCurrentOrganizationId();

const preCode = 'raumplus.finishedGoods';
const { common } = codeConfig.code;

function FinishedGoodsInventory() {
  let headDataSet = useDataSet(() => new DataSet(tableQuery()), FinishedGoodsInventory);
  const lineDataSet = useDataSet(() => new DataSet(tableDetailed()));
  const [orderId, setOrderId] = useState(-1);
  const [moreQuery, setMoreQuery] = useState(false);
  const [printCodeArr, setPrintCodeArr] = useState([]);
  const printNode = useRef(null);
  const [printLoading, setPrintLoading] = useState(false);

  useEffect(() => {
    defaultLovSetting();
    return () => {
      headDataSet = new DataSet(tableQuery());
    };
  }, []);

  const columns = [
    { name: 'itemCode' },
    { name: 'itemDescription' },
    { name: 'documentNum' },
    { name: 'uom' },
    { name: 'number' },
    { name: 'wareHouseCode' },
    { name: 'wmAreaCode' },
    { name: 'featureType' },
    { name: 'attributeString1' },
  ];

  const columnsDetaile = [
    { name: 'tagCode' },
    { name: 'outerTagCode' },
    { name: 'featureType' },
    { name: 'attributeString1' },
  ];

  /**
   *导出
   *
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = headDataSet && headDataSet.queryDataSet && headDataSet.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  /**
   *设置默认查询条件
   *
   */
  async function defaultLovSetting() {
    const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
    if (getResponse(res)) {
      if (!isEmpty(res.content) && headDataSet.queryDataSet && headDataSet.queryDataSet.current) {
        headDataSet.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
          organizationCode: res.content[0].organizationCode,
        });
      }
    }
  }

  /**
   *头点击事件
   *
   */
  function handleClick({ record }) {
    return {
      onClick: async () => {
        setOrderId(1);
        lineDataSet.queryParameter = {
          wmAreaCode: record.data.wmAreaCode,
          documentNum: record.data.documentNum,
          featureType: record.data.featureType,
          attributeString1: record.data.attributeString1,
          warehouseCode: record.data.wareHouseCode,
        };
        const res = await lineDataSet.query();
        if (res && res.length > 0) {
          lineDataSet.data.forEach((item) => {
            item.set({
              featureType: record.get('featureType'),
              attributeString1: record.get('attributeString1'),
            });
          });
        }
      },
    };
  }

  /**
   *查询
   *
   * @returns
   */
  async function handleSearch() {
    setOrderId(-1);
    const validateValue = await headDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    await headDataSet.query();
  }

  /**
   *重置
   *
   */
  function handleReset() {
    headDataSet.queryDataSet.current.reset();
  }

  // function changeArray(arr) {
  //   if (!arr || arr.length <= 0) {
  //     return [];
  //   }
  //   const result = [];
  //   const returnLen = Math.ceil(arr.length / 4);
  //   for (let i = 0; i < returnLen; i++) {
  //     const everyArr = arr.slice(i * 4, i * 4 + 4);
  //     result.push(everyArr);
  //   }
  //   return result;
  // }
  /**
   * 打印
   */
  function handlePrint() {
    const select = lineDataSet.selected;
    if (select.length === 0) {
      return notification.error({
        message: '请选中一个及以上单据',
        placement: 'bottomRight',
      });
    }
    const params = select.map((item) => {
      return { tagCode: item.get('tagCode'), setOf: item.get('attributeString1') };
    });
    setPrintLoading(true);
    getPrintListService(params)
      .then((res) => {
        if (res && res.failed) {
          notification.error({ message: res.message });
          setPrintLoading(false);
          return;
        }
        if (!res || res.length <= 0) {
          notification.warning({ message: '暂无打印数据' });
          setPrintLoading(false);
          return;
        }
        setPrintCodeArr(res);
        if (
          printNode &&
          printNode.current &&
          printNode.current.children &&
          printNode.current.children.length > 0
        ) {
          ReactToPrint({ content: printNode && printNode.current });
        } else {
          notification.warning({ message: '无打印数据' });
        }
        setTimeout(() => {
          setPrintLoading(false);
        }, 1000);
      })
      .catch(() => {
        setPrintLoading(false);
      });
  }
  return (
    <React.Fragment>
      <Header title={intl.get(`${preCode}.view.title.finishedGoodsInventory`).d('成品库存查询')}>
        <ExcelExport
          requestUrl={`${HLOS_LWMSS}/v1/product-present/export-product`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <div className={styles['lwms-ship-platform']}>
          <Form dataSet={headDataSet.queryDataSet} columns={4}>
            <Lov name="organizationObj" clearButton noCache />
            <Lov name="warehouseCodeObj" />
            <Lov name="wmAreaCodeObj" />
            <Lov name="documentNumObj" clearButton noCache />
            {moreQuery && <Lov name="itemCodeObj" clearButton noCache />}
            {moreQuery && <TextField name="attributeString1" clearButton noCache />}
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
            <Button
              onClick={() => {
                setMoreQuery(!moreQuery);
              }}
            >
              {moreQuery
                ? intl.get('hzero.common.button.collected').d('收起查询')
                : intl.get('hzero.common.button.viewMore').d('更多查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Table
          dataSet={headDataSet}
          border={false}
          columns={columns}
          queryBar="none"
          onRow={(record) => handleClick(record)}
          pagination={{
            onChange: () => setOrderId(-1),
          }}
        />

        {orderId !== -1 && (
          <React.Fragment>
            <Header>
              <Button
                style={{ marginBottom: '10px' }}
                color="primary"
                onClick={handlePrint}
                loading={printLoading}
              >
                打印
              </Button>
            </Header>
            <Table dataSet={lineDataSet} columns={columnsDetaile} />
            <div className={styles['finished-goods-inventory-print-list']} ref={printNode}>
              {printCodeArr &&
                printCodeArr.length > 0 &&
                printCodeArr.map((item, index) => {
                  return <PrintCodeSheet printArray={item} key={index.toString()} />;
                })}
            </div>
          </React.Fragment>
        )}
      </Content>
    </React.Fragment>
  );
}

export default formatterCollections({
  code: [`${preCode}`],
})((props) => {
  return <FinishedGoodsInventory {...props} />;
});
