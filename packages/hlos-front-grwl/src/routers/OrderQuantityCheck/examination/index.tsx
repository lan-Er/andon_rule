/*
 * @module: 检查页
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-17 14:16:31
 * @LastEditTime: 2021-06-08 14:31:00
 * @copyright: Copyright (c) 2020,Hand
 */
import { connect } from 'dva';
import React, { Fragment, useEffect, useMemo, useState } from 'react';

import notification from 'utils/notification';
import { Header, Content } from 'components/Page';

import BigDataTable from '../../../components/BigDataTable';
import { yesOrNoRender } from '../../../utils/render';

function Examination({ dispatch }) {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getColumns = useMemo(() => {
    return [
      {
        title: '物料',
        dataIndex: 'itemCode',
        key: 'itemCode',
        resizable: true,
        width: 120,
        fixed: true,
      },
      {
        title: '物料描述',
        dataIndex: 'itemDescription',
        key: 'itemDescription',
        resizable: true,
        width: 200,
        fixed: true,
      },
      {
        title: '特性值描述',
        dataIndex: 'featureDesc',
        key: 'featureDesc',
        resizable: true,
        width: 200,
      },
      {
        title: '母件',
        dataIndex: 'parentFlag',
        key: 'parentFlag',
        resizable: true,
        render: ({ rowData }) => {
          const { parentFlag } = rowData;
          if (parentFlag === '是') {
            return yesOrNoRender(true, parentFlag);
          } else {
            return yesOrNoRender(false, parentFlag);
          }
        },
      },
      {
        title: '物料类型',
        dataIndex: 'itemType',
        key: 'itemType',
        resizable: true,
      },
      {
        title: 'BOM',
        dataIndex: 'bomFlag',
        key: 'bomFlag',
        resizable: true,
      },
      {
        title: '工艺路线',
        dataIndex: 'routingFlag',
        key: 'routingFlag',
        resizable: true,
      },
      {
        title: '按单生产',
        dataIndex: 'mtoFlag',
        key: 'mtoFlag',
        resizable: true,
        render: ({ rowData }) => {
          const { bomFlag = '', routingFlag = '', mtoFlag } = rowData;
          if ((bomFlag === '无' || routingFlag === '无') && mtoFlag === '是') {
            return yesOrNoRender(false, mtoFlag);
          } else {
            return mtoFlag;
          }
        },
      },
      {
        title: '执行规则',
        dataIndex: 'executeRuleName',
        key: 'executeRuleName',
        resizable: true,
      },
      {
        title: '检验规则',
        dataIndex: 'inspectionRuleName',
        key: 'inspectionRuleName',
        resizable: true,
      },
      {
        title: '默认供应仓库',
        dataIndex: 'supplyWarehouseCode',
        key: 'supplyWarehouseCode',
        resizable: true,
      },
      {
        title: '默认发料仓库',
        dataIndex: 'issueWarehouseCode',
        key: 'issueWarehouseCode',
        resizable: true,
      },
      {
        title: '默认完工仓库',
        dataIndex: 'completeWarehouseCode',
        key: 'completeWarehouseCode',
        resizable: true,
      },
      {
        title: '默认入库仓库',
        dataIndex: 'inventoryWarehouseCode',
        key: 'inventoryWarehouseCode',
        resizable: true,
      },
      {
        title: '首工序',
        dataIndex: 'firstOperationFlag',
        key: 'firstOperationFlag',
        resizable: true,
      },
      {
        title: '末工序',
        dataIndex: 'lastOperationFlag',
        key: 'lastOperationFlag',
        resizable: true,
      },
      {
        title: '组件工序',
        dataIndex: 'bomOperationFlag',
        key: 'bomOperationFlag',
        resizable: true,
      },
      {
        title: '供应类型',
        dataIndex: 'supplyTypeMeaning',
        key: 'supplyTypeMeaning',
        resizable: true,
      },
    ];
  }, []);
  useEffect(() => {
    const soLineString = sessionStorage.getItem('orderQuantitySoLineIdList');
    const soLineIdList = soLineString ? JSON.parse(soLineString) : [];
    if (soLineIdList && soLineIdList.length <= 0) {
      notification.warning({ message: '未成功获取数据' });
    } else {
      setLoading(true);
      dispatch({
        type: 'orderQuantityCheckModel/handleExamination',
        payload: soLineIdList,
      })
        .then((res) => {
          setTableData(res);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, []);

  const config: any = {
    columns: getColumns,
    data: tableData,
    loading,
    showPage: false,
    bordered: true,
  };
  return (
    <Fragment>
      <Header title="检查页" backPath="/grwl/order-quantity-check" />
      <Content>
        <BigDataTable config={config} />
      </Content>
    </Fragment>
  );
}
export default connect()(Examination);
