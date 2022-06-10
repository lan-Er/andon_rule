/*
 * @Descripttion: VMI申请单审核详情
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-02-22 09:46:34
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-10 15:56:40
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, DatePicker, TextField, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { verifyVmiApply } from '@/services/vmiApplyReview';
import { HZERO_FILE } from 'utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import { downloadFile } from 'services/api';
import moment from 'moment';
import { returnReviewListDS } from '../store/VmiApplyReviewDS';
import styles from './index.less';

const organizationId = getCurrentOrganizationId();
const intlPrefix = 'zcom.vmiApplyReview';
const ListDS = new DataSet(returnReviewListDS());

function ZcomVmiApplyReviewReview({ history }) {
  useEffect(() => {
    ListDS.query();
  }, []);

  /**
   * 进入详情
   * @param {*} id 头id
   */
  function handleToDetail(id) {
    const pathName = `/zcom/vmi-apply-review/${id}`;
    history.push(pathName);
  }

  /**
   * 审核通过/拒绝
   * @param {*} type 审核类型
   */
  async function handleReview(type) {
    let filedFlag = true;
    let validateFlag = true;
    const arr = [];

    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }

    const validateResult = await Promise.all(lineValidate());
    validateResult.forEach((v) => {
      filedFlag = filedFlag && v;
    });
    if (!filedFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.select`)
          .d('存在必输字段未填写或字段输入不合法！'),
      });
      return;
    }

    ListDS.selected.forEach(async (v) => {
      const { approvalByName, approvalDate, approvalOpinion } = v.data;
      const obj = {
        ...v.data,
        vmiApplyStatus: type,
        approvalByName,
        approvalDate: approvalDate ? moment(approvalDate).format('YYYY-MM-DD HH:mm:ss') : null,
        approvalOpinion,
      };
      arr.push(obj);

      if (v.data.vmiApplyStatus !== 'RELEASED') {
        validateFlag = false;
      }
    });

    if (!validateFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.select`)
          .d('存在不是已提交状态的退料单！'),
      });
      return;
    }

    try {
      const res = await verifyVmiApply(arr);
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        ListDS.query();
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
   * 行列表必输字段校验
   */
  function lineValidate() {
    const arr = [];
    ListDS.selected.forEach((v) => {
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

  const columns = [
    {
      name: 'vmiApplyNum',
      width: 150,
      align: 'center',
      renderer: ({ record, value }) => {
        const id = record.get('vmiApplyId');
        return <a onClick={() => handleToDetail(id)}>{value || ''}</a>;
      },
    },
    {
      name: 'vmiApplyStatusMeaning',
      align: 'center',
      width: 150,
    },
    {
      name: 'supplierName',
      align: 'center',
      width: 150,
    },
    {
      name: 'vmiMeOuName',
      align: 'center',
      width: 150,
    },
    {
      name: 'vmiWarehouseName',
      align: 'center',
      width: 150,
    },
    {
      name: 'createdByName',
      align: 'center',
      width: 150,
    },
    {
      name: 'creationDate',
      align: 'center',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'submitDate',
      align: 'center',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'approvalDate',
      align: 'center',
      width: 150,
      editor: (record) =>
        record.get('vmiApplyStatus') === 'RELEASED' ? <DatePicker disabled /> : null,
    },
    {
      name: 'approvalByName',
      align: 'center',
      width: 150,
      editor: (record) =>
        record.get('vmiApplyStatus') === 'RELEASED' ? <TextField disabled /> : null,
    },
    {
      name: 'remark',
      align: 'center',
      width: 150,
    },
    {
      name: 'fileUrl',
      align: 'center',
      width: 150,
      renderer: ({ value }) => {
        return value ? <a onClick={() => downloadHeadFile(value)}>查看附件</a> : null;
      },
    },
    {
      name: 'approvalOpinion',
      align: 'center',
      width: 150,
      editor: (record) => (record.get('vmiApplyStatus') === 'RELEASED' ? <TextField /> : null),
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.vmiApplyReviewReview`).d('VMI申领单审核')}>
        <Button onClick={() => handleReview('CONFIRMED')}>审核通过</Button>
        <Button onClick={() => handleReview('REFUSED')}>审核拒绝</Button>
      </Header>
      <Content className={styles['zcom-vmi-apply-review']}>
        <Table autoHeight dataSet={ListDS} columns={columns} columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomVmiApplyReviewReview {...props} />;
});
