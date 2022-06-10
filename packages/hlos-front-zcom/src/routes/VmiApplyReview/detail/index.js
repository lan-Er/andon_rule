/*
 * @Descripttion: VMI申请单审核
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-02-22 09:46:34
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-19 11:39:27
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Form,
  TextField,
  TextArea,
  Table,
  DatePicker,
  NumberField,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { downloadFile } from 'services/api';
import { returnReviewHeadDS, returnReviewLineDS } from '../store/VmiApplyReviewDS';
import { verifyVmiApply } from '@/services/vmiApplyReview';

const organizationId = getCurrentOrganizationId();
const intlPrefix = 'zcom.vmiApplyReview';
const HeadDS = new DataSet(returnReviewHeadDS());
const LineDS = new DataSet(returnReviewLineDS());

function ZcomVmiApplyReviewDetail({ match, history }) {
  const [canEdit, setCanEdit] = useState(true);
  const [headFile, setHeadFile] = useState(null);
  const {
    params: { vmiApplyId },
  } = match;

  useEffect(() => {
    async function loadData() {
      HeadDS.current.set('approvalOpinion', '');
      HeadDS.setQueryParameter('vmiApplyId', vmiApplyId);
      LineDS.setQueryParameter('vmiApplyId', vmiApplyId);
      await HeadDS.query();
      setHeadFile(HeadDS.current.get('fileUrl'));
      setCanEdit(HeadDS.current.get('vmiApplyStatus') === 'RELEASED');
      LineDS.query();
    }
    loadData();
  }, [vmiApplyId]);

  /**
   * 审核通过/拒绝
   * @param {*} type 审核类型
   */
  async function handleReview(type) {
    let filedFlag = true;
    const validateValue = await HeadDS.current.validate(true, false);
    if (!validateValue) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.select`)
          .d('存在必输字段未填写或字段输入不合法！'),
      });
      return;
    }

    const validateResult = await Promise.all(lineValidate());
    validateResult.forEach((v) => {
      filedFlag = filedFlag && v;
    });

    if (!filedFlag && type === 'CONFIRMED') {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.select`)
          .d('存在必输字段未填写或字段输入不合法！'),
      });
      return;
    }

    const obj = {
      ...HeadDS.current.toData(),
      vmiApplyStatus: type,
      vmiApplyLineList: LineDS.toData(),
    };

    try {
      const res = await verifyVmiApply([obj]);
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        const pathName = `/zcom/vmi-apply-review`;
        history.push(pathName);
      } else {
        notification.error({
          message: res.message,
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  /**
   * 行列表校验
   */
  function lineValidate() {
    const arr = [];
    LineDS.data.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  }

  // 查看附件
  function downloadHeadFile(file) {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: 'zcom' },
        { name: 'directory', value: 'zcom' },
        { name: 'url', value: file },
      ],
    });
  }

  const lineColumns = [
    {
      name: 'vmiApplyLineNum',
      align: 'center',
      width: 150,
    },
    {
      name: 'customerItemCode',
      align: 'center',
      width: 150,
    },
    {
      name: 'customerItemDescription',
      align: 'center',
      width: 150,
    },
    {
      name: 'applyQty',
      align: 'center',
      width: 150,
    },
    {
      name: 'uomName',
      align: 'center',
      width: 150,
    },
    {
      name: 'receiveWarehouseName',
      align: 'center',
      width: 150,
    },
    {
      name: 'applyDate',
      align: 'center',
      width: 150,
    },
    {
      name: 'promiseQty',
      align: 'center',
      width: 150,
      editor: () => (HeadDS.current.get('vmiApplyStatus') === 'RELEASED' ? <NumberField /> : null),
    },
    {
      name: 'promiseDate',
      align: 'center',
      width: 150,
      editor: () => (HeadDS.current.get('vmiApplyStatus') === 'RELEASED' ? <DatePicker /> : null),
    },
    {
      name: 'lineRemark',
      align: 'center',
      width: 150,
    },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.vmiApplyReview`).d('VMI物料申领单审核')}
        backPath="/zcom/vmi-apply-review"
      >
        {headFile && <Button onClick={() => downloadHeadFile(headFile)}>查看附件</Button>}
        {canEdit && (
          <>
            <Button onClick={() => handleReview('CONFIRMED')}>审核通过</Button>
            <Button onClick={() => handleReview('REFUSED')}>审核拒绝</Button>
          </>
        )}
      </Header>
      <Content>
        <Form dataSet={HeadDS} columns={4}>
          <TextField name="vmiApplyNum" key="vmiApplyNum" disabled />
          <TextField name="vmiMeOuName" key="vmiMeOuName" disabled />
          <TextField name="customerName" key="customerName" disabled />
          <TextField name="supplierName" key="supplierName" disabled />
          <TextField name="vmiWarehouseName" key="vmiWarehouseName" disabled />
          <TextField name="vmiApplyStatusMeaning" key="vmiApplyStatusMeaning" disabled />
          <DatePicker name="approvalDate" key="approvalDate" disabled />
          <TextField name="createdByName" key="createdByName" disabled />
          <TextField name="approvalByName" key="approvalByName" disabled />
          <TextArea name="remark" key="remark" disabled newLine colSpan={4} rows={2} />
          <TextArea
            name="approvalOpinion"
            key="approvalOpinion"
            newLine
            colSpan={4}
            rows={2}
            disabled={!canEdit}
          />
        </Form>

        <Table dataSet={LineDS} columns={lineColumns} columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomVmiApplyReviewDetail {...props} />;
});
