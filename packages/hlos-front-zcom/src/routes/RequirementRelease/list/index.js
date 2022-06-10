/**
 * @Description: 需求发布
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-05 11:09:38
 */

import React, { useState, useEffect, Fragment } from 'react';
import { isEmpty } from 'lodash';
import queryString from 'query-string';
import { Tag } from 'choerodon-ui';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';
import { queryIndependentValueSet } from 'hlos-front/lib/services/api';
import { releasePo, verifyPo } from '@/services/requirementRelease';

import { requirementReleaseListDS } from '../store/RequirementReleaseDS';
import './index.less';

const intlPrefix = 'zcom.requirementRelease';
const { requirementRelease } = codeConfig.code;
const ListDS = new DataSet(requirementReleaseListDS());
const {
  importTemplateCode: { requirementReleaseImport },
} = statusConfig.statusValue.zcom;

function ZcomRequirementRelease(props) {
  const [releaseLoading, setReleaseLoading] = useState(false);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    getStatusData();
  }, []);

  async function getStatusData() {
    const res = await queryIndependentValueSet({ lovCode: requirementRelease.poStatus });
    if (!isEmpty(res)) {
      setStatusData(res);
    }
  }

  // 获取状态对应的颜色值
  function getColorByStatus(status) {
    let color = '';
    statusData.forEach((v) => {
      if (v.value === status) {
        color = v.tag;
      }
    });
    return color;
  }

  function handleToDetail(id) {
    const pathName = `/zcom/requirement-release/detail/${id}`;
    props.history.push(pathName);
  }

  async function handleRelease() {
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    const arr = [];
    ListDS.selected.forEach((v) => {
      arr.push({
        poHeaderId: v.data.poHeaderId,
        poStatus: v.data.poStatus,
        objectVersionNumber: v.data.objectVersionNumber,
      });
    });
    try {
      setReleaseLoading(true);
      const res = await releasePo(arr);
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
      setReleaseLoading(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      setReleaseLoading(false);
    }
  }

  async function handleConfirmed() {
    handleVerify('CONFIRMED');
  }
  async function handleCanceled() {
    handleVerify('CANCELLED');
  }
  async function handleFallback() {
    handleVerify('RETURNED');
  }

  async function handleVerify(status) {
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    const arr = [];
    ListDS.selected.forEach((v) => {
      arr.push({
        poHeaderId: v.data.poHeaderId,
        poStatus: status,
        objectVersionNumber: v.data.objectVersionNumber,
      });
    });
    try {
      const res = await verifyPo(arr);
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

  function handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${requirementReleaseImport}`,
        title: intl.get(`${intlPrefix}.view.title.requirementReleaseImport`).d('需求发布导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  const columns = [
    { name: 'scmOuName', width: 150, lock: true },
    {
      name: 'poNum',
      width: 150,
      lock: true,
      renderer: ({ record, value }) => {
        const id = record.get('poHeaderId');
        return <a onClick={() => handleToDetail(id)}>{value || ''}</a>;
      },
    },
    {
      name: 'poStatus',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <Tag color={getColorByStatus(value)}>
            <span style={{ color: '#FFFFFF' }}>{record.get('poStatusMeaning') || ''}</span>
          </Tag>
        );
      },
    },
    { name: 'supplierNumber', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'supplierSiteAddress' },
    { name: 'poTypeCode', width: 150 },
    { name: 'creationDate', width: 150 },
    { name: 'buyerName', width: 150 },
    { name: 'sourceSysName', width: 150 },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.requirementRelease`).d('需求发布')}>
        <Button onClick={handleFallback}>退回</Button>
        <Button onClick={handleCanceled}>取消</Button>
        <Button onClick={handleConfirmed}>确认</Button>
        <Button color="primary" icon="publish2" loading={releaseLoading} onClick={handleRelease}>
          发布
        </Button>
        <HButton icon="upload" onClick={handleBatchExport}>
          {intl.get('zcom.common.button.import').d('导入')}
        </HButton>
      </Header>
      <Content className="zcom-requirement-release">
        <Table dataSet={ListDS} columns={columns} columnResizable="true" queryFieldsLimit={4} />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomRequirementRelease {...props} />;
});
