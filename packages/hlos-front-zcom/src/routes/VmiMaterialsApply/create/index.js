/**
 * @Description: VMI物料申请单创建/修改
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-02-22 14:07:40
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
} from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';
// import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { downloadFile } from 'services/api';
// import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getCurrentUser, getAccessToken } from 'utils/utils';
import { createHeadDS, createLineDS } from '../store/VmiMaterialsApplyDS';

const intlPrefix = 'zcom.vmiMaterialsApply';
const organizationId = getCurrentOrganizationId();
const CreateHeadDS = () => new DataSet({ ...createHeadDS() });
const CreateLineDS = () => new DataSet({ ...createLineDS() });

function ZcomVmiMaterialsApplyCreate({ dispatch, match, history }) {
  const HeadDS = useDataSet(CreateHeadDS, ZcomVmiMaterialsApplyCreate);
  const LineDS = useDataSet(CreateLineDS);
  const {
    params: { type, vmiApplyId },
  } = match;

  const [fileUrl, setFileUrl] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    HeadDS.setQueryParameter('vmiApplyId', null);
    LineDS.setQueryParameter('vmiApplyId', null);
    HeadDS.data = [];
    LineDS.data = [];
    HeadDS.create();
    LineDS.clearCachedSelected();
    if (type === 'create') {
      const { realName } = getCurrentUser();
      HeadDS.current.set('creationDate', new Date());
      HeadDS.current.set('createdByName', realName);
    } else {
      HeadDS.setQueryParameter('vmiApplyId', vmiApplyId);
      LineDS.setQueryParameter('vmiApplyId', vmiApplyId);
      handleSearch();
    }
  }, [vmiApplyId]);

  async function handleSearch() {
    await HeadDS.query();
    setFileUrl(HeadDS.current.get('fileUrl'));
    await LineDS.query();
  }

  const handleLineCreate = () => {
    LineDS.create({}, 0);
  };

  const handleLineDelete = () => {
    const savedList = [];
    const unSavedList = [];
    LineDS.selected.forEach((record) => {
      const { vmiApplyLineId } = record.toData();
      if (vmiApplyLineId) {
        savedList.push(record.toData());
      } else {
        unSavedList.push(record);
      }
    });
    if (unSavedList.length) {
      LineDS.delete(unSavedList);
    }
    if (savedList.length) {
      dispatch({
        type: 'vmiMaterialsApply/vmiApplyLinesDelete',
        payload: savedList,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '删除成功',
          });
          LineDS.query();
        }
      });
    }
  };

  function handleSave() {
    setSaveLoading(true);
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      const validateLine = await LineDS.validate(true, false);
      const hasEmptyItem = LineDS.data.findIndex((item) => {
        const itemId = item.get('itemId');
        return itemId === undefined || itemId === null;
      });
      const hasEmptyApplyQty = LineDS.data.findIndex((item) => {
        const applyQty = item.get('applyQty');
        return applyQty === undefined || applyQty === null;
      });
      const hasEmptyReceiveWarehouseId = LineDS.data.findIndex((item) => {
        const receiveWarehouseId = item.get('receiveWarehouseId');
        return receiveWarehouseId === undefined || receiveWarehouseId === null;
      });
      if (
        !validateHead ||
        !validateLine ||
        hasEmptyItem !== -1 ||
        hasEmptyApplyQty !== -1 ||
        hasEmptyReceiveWarehouseId !== -1
      ) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSaveLoading(false));
        return false;
      }
      const headData = HeadDS.current.toData();
      const vmiApplyLineList = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.toData(), {
          applyDate: item.toData().applyDate
            ? moment(item.toData().applyDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
        });
        return obj;
      });
      dispatch({
        type: 'vmiMaterialsApply/vmiApplySave',
        payload: {
          ...headData,
          vmiApplyStatus: 'NEW',
          creationDate: headData.creationDate
            ? moment(headData.creationDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
          vmiApplyLineList,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '保存成功',
          });
          if (vmiApplyId) {
            handleSearch();
          } else {
            const pathName = `/zcom/vmi-materials-apply/apply/edit/${res.vmiApplyId}`;
            history.push(pathName);
          }
        }
        resolve(setSaveLoading(false));
      });
    });
  }

  function handleSubmit() {
    setSubmitLoading(true);
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      const validateLine = await LineDS.validate(true, false);
      const hasEmptyItem = LineDS.data.findIndex((item) => {
        const itemId = item.get('itemId');
        return itemId === undefined || itemId === null;
      });
      const hasEmptyApplyQty = LineDS.data.findIndex((item) => {
        const applyQty = item.get('applyQty');
        return applyQty === undefined || applyQty === null;
      });
      const hasEmptyReceiveWarehouseId = LineDS.data.findIndex((item) => {
        const receiveWarehouseId = item.get('receiveWarehouseId');
        return receiveWarehouseId === undefined || receiveWarehouseId === null;
      });
      if (
        !validateHead ||
        !validateLine ||
        hasEmptyItem !== -1 ||
        hasEmptyApplyQty !== -1 ||
        hasEmptyReceiveWarehouseId !== -1
      ) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSubmitLoading(false));
        return false;
      }
      const headData = HeadDS.current.toData();
      const vmiApplyLineList = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.toData(), {
          applyDate: item.toData().applyDate
            ? moment(item.toData().applyDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
        });
        return obj;
      });
      const { id, realName } = getCurrentUser();
      dispatch({
        type: 'vmiMaterialsApply/vmiApplySave',
        payload: {
          ...headData,
          vmiApplyStatus: 'RELEASED',
          submitBy: id,
          submitByName: realName,
          creationDate: headData.creationDate
            ? moment(headData.creationDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
          vmiApplyLineList,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '提交成功',
          });
          const pathName = `/zcom/vmi-materials-apply/list`;
          history.push(pathName);
        }
        resolve(setSubmitLoading(false));
      });
    });
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

  // 删除附件
  const handleFileDelete = () => {
    HeadDS.current.set('fileUrl', null);
    setFileUrl(null);
  };

  // 上传附件
  const handleUploadSuccess = (res) => {
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      HeadDS.current.set('fileUrl', res);
      setFileUrl(res);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  };

  // 获取导出字段查询参数
  // const getExportQueryParams = () => {
  //   const queryDataDs = LineDS && LineDS.queryDataSet && LineDS.queryDataSet.current;
  //   const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
  //   return {
  //     tenantId: organizationId,
  //     ...queryDataDsValue,
  //   };
  // };

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: 'zcom',
      directory: 'zcom',
    };
  };

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: '*',
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    data: uploadData,
    onSuccess: handleUploadSuccess,
    showUploadList: false,
  };

  const lineColumns = [
    {
      name: 'vmiApplyLineNum',
      align: 'center',
      width: 150,
      lock: true,
    },
    { name: 'itemObj', align: 'center', width: 150, editor: true },
    { name: 'itemDescription', align: 'center', width: 150 },
    { name: 'applyQty', align: 'center', width: 150, editor: true },
    { name: 'uomName', align: 'center', width: 150 },
    { name: 'receiveWarehouseObj', align: 'center', width: 150, editor: true },
    { name: 'applyDate', align: 'center', width: 150, editor: true },
    { name: 'lineRemark', align: 'center', width: 150, editor: true },
  ];

  return (
    <Fragment>
      <Header
        title={
          type === 'create'
            ? intl.get(`${intlPrefix}.view.title.vmiMaterialsApplyCreate`).d('VMI物料申请创建')
            : intl.get(`${intlPrefix}.view.title.vmiMaterialsApplyEdit`).d('VMI物料申请单修改')
        }
        backPath="/zcom/vmi-materials-apply/list"
      >
        {/* {
          type === 'edit' && (
            <ExcelExport
              requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/item-refunds/export`} // 地址待调整
              queryParams={getExportQueryParams}
            />
          )
        } */}
        <Button onClick={handleSubmit} loading={submitLoading}>
          保存并提交
        </Button>
        <Button onClick={handleSave} loading={saveLoading}>
          保存
        </Button>
        {fileUrl && (
          <>
            <Button onClick={handleFileDownload}>查看附件</Button>
            <Button onClick={handleFileDelete}>删除附件</Button>
          </>
        )}
        <Upload {...uploadProps}>
          <Button>{fileUrl ? '修改附件' : '上传附件'}</Button>
        </Upload>
      </Header>
      <Content>
        <Form dataSet={HeadDS} columns={4}>
          <TextField name="vmiApplyNum" key="vmiApplyNum" disabled />
          <Lov name="vmiMeOuObj" key="vmiMeOuObj" disabled={type === 'edit'} />
          <Lov name="vmiWarehouseObj" key="vmiWarehouseObj" disabled={type === 'edit'} />
          <Select name="vmiApplyStatus" key="vmiApplyStatus" disabled />
          <DatePicker name="creationDate" key="creationDate" disabled />
          <TextField name="createdByName" key="createdByName" disabled />
          <Lov name="customerObj" key="customerObj" disabled={type === 'edit'} />
          {type === 'edit' && (
            <TextArea
              name="approvalOpinion"
              key="approvalOpinion"
              newLine
              disabled
              colSpan={2}
              rows={3}
            />
          )}
          <TextArea name="remark" key="remark" newLine colSpan={2} rows={3} />
        </Form>
        <Table
          dataSet={LineDS}
          columns={lineColumns}
          columnResizable="true"
          buttons={[
            ['add', { onClick: () => handleLineCreate() }],
            ['delete', { onClick: () => handleLineDelete() }],
          ]}
        />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomVmiMaterialsApplyCreate {...props} />;
});
