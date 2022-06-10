/**
 * @Description: VMI物料申请单详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-02-22 16:46:04
 */

import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import {
  DataSet,
  Button,
  Form,
  TextField,
  Select,
  Lov,
  DatePicker,
  TextArea,
  Table,
  Tabs,
} from 'choerodon-ui/pro';
// import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { HZERO_FILE } from 'utils/config';
import { downloadFile } from 'services/api';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
// import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { detailHeadDS, detailLineDS, detailReceivedListDS } from '../store/VmiMaterialsApplyDS';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.vmiMaterialsApply';
const organizationId = getCurrentOrganizationId();
const DetailHeadDS = () => new DataSet({ ...detailHeadDS() });
const DetailLineDS = (showSelect) => new DataSet({ ...detailLineDS(showSelect) });
const ReceivedListDS = () => new DataSet({ ...detailReceivedListDS() });

function ZcomVmiMaterialsApplyDetail({ dispatch, match, history }) {
  const showSelect = ['CONFIRMED', 'DELIVERED', 'RECEIVING'].includes(match.params.status);
  const HeadDS = useDataSet(DetailHeadDS, ZcomVmiMaterialsApplyDetail);
  const LineDS = useDataSet(() => DetailLineDS(showSelect));
  const ListDS = useDataSet(ReceivedListDS);
  const {
    params: { vmiApplyId },
  } = match;

  const [fileUrl, setFileUrl] = useState(null);
  const [detailStatus, setSetailStatus] = useState('view'); // 页面状态 1.view查看 2.receive接收
  const [listShow, setListShow] = useState(false);
  const [receiveLoading, setReceiveLoading] = useState(false);

  useEffect(() => {
    HeadDS.setQueryParameter('vmiApplyId', vmiApplyId);
    LineDS.setQueryParameter('vmiApplyId', vmiApplyId);
    handleSearch();
  }, [vmiApplyId]);

  async function handleSearch() {
    await HeadDS.query();
    setFileUrl(HeadDS.current.get('fileUrl'));
    if (['CONFIRMED', 'DELIVERED', 'RECEIVING'].includes(HeadDS.current.get('vmiApplyStatus'))) {
      setSetailStatus('receive');
    }
    await LineDS.query();
  }

  function lineValidate() {
    const arr = [];
    LineDS.selected.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  }

  function handleReceive() {
    setReceiveLoading(true);
    return new Promise(async (resolve) => {
      if (!LineDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(setReceiveLoading(false));
        return false;
      }
      const validateResult = await Promise.all(lineValidate());
      if (validateResult.findIndex((v) => !v) !== -1) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setReceiveLoading(false));
        return false;
      }
      const vmiApplyLineList = LineDS.selected.map((item) => {
        const obj = Object.assign({}, item.toData(), {
          executeWarehouseId: item.toData().receiveWarehouseId,
          executeWarehouseCode: item.toData().receiveWarehouseCode,
          executeWarehouseName: item.toData().receiveWarehouseName,
          executeRemark: item.toData().lineRemark,
          executeDate: item.toData().executeDate
            ? moment(item.toData().executeDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
        });
        return obj;
      });
      dispatch({
        type: 'vmiMaterialsApply/vmiApplyReceive',
        payload: vmiApplyLineList,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '接收成功',
          });
          const pathName = `/zcom/vmi-materials-apply/list`;
          history.push(pathName);
        }
        resolve(setReceiveLoading(false));
      });
    });
  }

  function handleViewReceivedList(record) {
    ListDS.queryParameter = {
      vmiApplyId,
      vmiApplyLineId: record.data.vmiApplyLineId,
    };
    ListDS.query();
    setListShow(true);
  }

  // 查看附件
  function handleFileDownload() {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: 'zcom' },
        { name: 'directory', value: 'zcom' },
        { name: 'url', value: fileUrl },
      ],
    });
  }

  // // 获取导出字段查询参数
  // const getExportQueryParams = () => {
  //   const queryDataDs = LineDS && LineDS.queryDataSet && LineDS.queryDataSet.current;
  //   const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
  //   return {
  //     tenantId: organizationId,
  //     ...queryDataDsValue,
  //   };
  // };

  const lineColumns = [
    { name: 'vmiApplyLineNum', align: 'center', width: 150, lock: true },
    { name: 'itemObj', align: 'center', width: 150 },
    { name: 'itemDescription', align: 'center', width: 150 },
    { name: 'applyQty', align: 'center', width: 150 },
    { name: 'applyDate', align: 'center', width: 150 },
    { name: 'uomName', align: 'center', width: 150 },
    { name: 'promiseQty', align: 'center', width: 150 },
    {
      name: 'promiseDate',
      align: 'center',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'totalReceivedQty', align: 'center', width: 150 },
    {
      name: 'receiveWarehouseObj',
      align: 'center',
      width: 150,
      editor: detailStatus === 'receive',
    },
    { name: 'executeQty', align: 'center', width: 150, editor: detailStatus === 'receive' },
    { name: 'executeDate', align: 'center', width: 150, editor: detailStatus === 'receive' },
    { name: 'executeWorker', align: 'center', width: 150, editor: detailStatus === 'receive' },
    { name: 'lineRemark', align: 'center', width: 150, editor: detailStatus === 'receive' },
    { name: 'lotNumber', align: 'center', width: 150, editor: detailStatus === 'receive' },
    { name: 'tagCode', align: 'center', width: 150, editor: detailStatus === 'receive' },
    {
      header: '操作',
      width: 150,
      command: ({ record }) => {
        return [
          <Button
            key="view"
            color="primary"
            funcType="flat"
            disabled={!(record.data.totalReceivedQty && record.data.totalReceivedQty > 0)}
            onClick={() => handleViewReceivedList(record)}
          >
            查看接收记录
          </Button>,
        ];
      },
      lock: 'right',
    },
  ];

  const listColumns = [
    { name: 'vmiApplyLineNum', align: 'center', width: 150 },
    { name: 'vmiApplyExecuteNum', align: 'center', width: 150 },
    { name: 'itemCode', align: 'center', width: 150 },
    { name: 'itemDescription', align: 'center', width: 150 },
    { name: 'uomName', align: 'center', width: 150 },
    { name: 'executeWarehouseName', align: 'center', width: 150 },
    { name: 'executeQty', align: 'center', width: 150 },
    { name: 'executeDate', align: 'center', width: 150 },
    { name: 'executeWorker', align: 'center', width: 150 },
    { name: 'executeRemark', align: 'center', width: 150 },
    { name: 'lotNumber', align: 'center', width: 150 },
    { name: 'tagCode', align: 'center', width: 150 },
  ];

  return (
    <Fragment>
      <Header
        title={
          detailStatus === 'view'
            ? intl.get(`${intlPrefix}.view.title.vmiMaterialsApplyDetail`).d('VMI物料申请详情')
            : intl
                .get(`${intlPrefix}.view.title.vmiMaterialsApplyReceive`)
                .d('VMI物料申请平台物料接收')
        }
        backPath="/zcom/vmi-materials-apply/list"
      >
        {/* <ExcelExport
          requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/item-refunds/export`} // 地址待调整
          queryParams={getExportQueryParams}
        /> */}
        {detailStatus === 'receive' && (
          <Button onClick={handleReceive} loading={receiveLoading}>
            确认接收
          </Button>
        )}
        {detailStatus === 'view' && <Button>更新发料信息</Button>}
        {fileUrl && <Button onClick={handleFileDownload}>查看附件</Button>}
      </Header>
      <Content>
        <Form dataSet={HeadDS} columns={4}>
          <TextField name="vmiApplyNum" key="vmiApplyNum" disabled />
          <Lov name="vmiMeOuObj" key="vmiMeOuObj" disabled />
          {detailStatus === 'view' && <Lov name="customerObj" key="customerObj" disabled />}
          <Lov name="vmiWarehouseObj" key="vmiWarehouseObj" disabled />
          <Select name="vmiApplyStatus" key="vmiApplyStatus" disabled />
          <DatePicker name="creationDate" key="creationDate" disabled />
          <TextField name="createdByName" key="createdByName" disabled />
          {detailStatus === 'receive' && (
            <DatePicker name="approvalDate" key="approvalDate" disabled />
          )}
          {detailStatus === 'receive' && (
            <TextField name="approvalByName" key="approvalByName" disabled />
          )}
          {detailStatus === 'receive' && <DatePicker name="submitDate" key="submitDate" disabled />}
          <TextArea
            name="approvalOpinion"
            key="approvalOpinion"
            newLine
            colSpan={2}
            rows={3}
            disabled
          />
          <TextArea name="remark" key="remark" newLine colSpan={2} rows={3} disabled />
        </Form>
        <Table dataSet={LineDS} columns={lineColumns} columnResizable="true" />
        {listShow && (
          <Tabs defaultActiveKey="receivelist">
            <TabPane tab="申请单行接收记录详情" key="receivelist">
              <Table dataSet={ListDS} columns={listColumns} columnResizable="true" />
            </TabPane>
          </Tabs>
        )}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomVmiMaterialsApplyDetail {...props} />;
});
