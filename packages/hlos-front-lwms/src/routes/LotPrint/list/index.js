/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-23 16:32:05
 */

import React, { useState, useEffect, Fragment } from 'react';
import intl from 'utils/intl';
import { Form, Button, DataSet, Table, Lov, Select } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import { userSetting } from 'hlos-front/lib/services/api';
import formatterCollections from 'utils/intl/formatterCollections';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId } from 'utils/utils';
import { HeadDS, LotPrintDS } from '@/stores/lotPrintDS';
import Preview from 'hzero-front-hrpt/lib/routes/LabelTemplate/Preview';
import _Modal from 'choerodon-ui/pro/lib/modal';

const lotPrintDS = new DataSet(LotPrintDS());

const commonPrefix = 'lwms.common';

const headerDS = new DataSet(HeadDS());
const printModalKey = _Modal.key();

function LotPrint(props) {
  const [selectValue, setSelectValue] = useState('default');
  useEffect(() => {
    // 界面初始默认设置
    async function getInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        lotPrintDS.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
          organizationCode: res.content[0].organizationCode,
        });
      }
      lotPrintDS.query();
    }
    getInfo();
  }, []);
  useEffect(() => {
    function updateLot({ record, name }) {
      if (name === 'organizationObj') {
        record.set('lotNumberObj', null);
      }
    }
    lotPrintDS.queryDataSet.addEventListener('update', updateLot);
    return () => {
      lotPrintDS.queryDataSet.removeEventListener('update', updateLot);
    };
  }, []);
  function Columns() {
    return [
      { name: 'organizationName', width: 128, lock: true },
      { name: 'item', width: 128, lock: true },
      { name: 'lotNumber', width: 128, lock: true },
      { name: 'initialQty', width: 82 },
      { name: 'uomName', width: 82 },
      { name: 'lotTypeMeaning', width: 128 },
      { name: 'supplierLotNumber', width: 128 },
      { name: 'parentLotNumber', width: 128 },
      { name: 'receivedDate', width: 144 },
      { name: 'madeDate', width: 144 },
      { name: 'expireDate', width: 144 },
      { name: 'supplier', width: 128 },
      { name: 'supplierLotNumber', width: 128 },
      { name: 'material', width: 128 },
      { name: 'materialSupplier', width: 128 },
      { name: 'materialLotNumber', width: 128 },
      { name: 'manufacturer', width: 128 },
      { name: 'lotStatusMeaning', width: 90 },
      { name: 'featureTypeMeaning', width: 128 },
      { name: 'featureValue', width: 128 },
      { name: 'remark', width: 200 },
    ];
  }
  const handlePreview = () => {
    if (headerDS.data[0]?.data?.printModel === undefined) {
      if (!templateCode) {
        notification.error({
          message: '请选择打印模板',
        });
      }
      return;
    }
    const templateCode = headerDS.data[0]?.data?.printModel.templateCode;
    _Modal.open({
      key: printModalKey,
      title: '预览',
      children: /* #__PURE__ */ React.createElement(Preview, {
        labelTemplateCode: templateCode,
        tenantId: 0,
      }),
      drawer: true,
      style: {
        width: 1000,
      },
      footer: function footer(okBtn) {
        return okBtn;
      },
    });
  };
  const handlePrint = async () => {
    const validate = await headerDS.validate(false, false);
    if (!validate) return;
    if (lotPrintDS.selected.length === 0) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    const templateCode = headerDS.data[0]?.data?.printModel.templateCode;
    const lotParams = [];
    switch (selectValue) {
      case 'default':
        lotPrintDS.selected.forEach((i) => {
          const obj = {
            ...i.toJSONData(),
          };
          lotParams.push(obj);
        });
        break;
      case 'batch':
        lotPrintDS.selected.forEach((i) => {
          const obj = {
            ...i.toJSONData(),
          };
          lotParams.push(obj.lotNumber);
        });
        break;
      default:
        lotPrintDS.selected.forEach((i) => {
          const obj = {
            ...i.toJSONData(),
          };
          lotParams.push(obj);
        });
    }
    props.history.push({
      pathname: `/lwms/lot-print/print/${templateCode}`,
      search: `tenantId=${getCurrentOrganizationId()}`,
      lotParams,
      tagType: selectValue,
      backPath: '/lwms/lot-print/list',
    });
  };
  const handleSelectChange = (val) => {
    setSelectValue(val);
  };
  return (
    <Fragment>
      <Header title="批次打印">
        <Button color="primary" onClick={handlePrint}>
          {intl.get('lwms.common.view.title.print').d('打印')}
        </Button>
        <Button onClick={handlePreview}>{intl.get('hzero.common.button.preview').d('预览')}</Button>
      </Header>
      <Content>
        <Card
          key="lwms-issue-request-detail-header"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
        >
          <div style={{ display: 'flex' }}>
            <Form dataSet={headerDS} columns={3} style={{ flex: 1 }}>
              <Select label="打印类型" value={selectValue} onChange={handleSelectChange}>
                <Select.Option value="default" key="default">
                  标准打印
                </Select.Option>
                <Select.Option value="batch" key="batch">
                  批次打印
                </Select.Option>
              </Select>
              <Lov name="printModel" noCache />
            </Form>
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <Button style={{ opacity: 0 }}>更多查询</Button>
              <Button style={{ opacity: 0 }}>重置</Button>
              <Button style={{ opacity: 0 }} color="primary">
                查询
              </Button>
            </div>
          </div>
          <Fragment key="issue-request-platform-form">
            <Table dataSet={lotPrintDS} border={false} queryFieldsLimit={3} columns={Columns()} />
          </Fragment>
        </Card>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${commonPrefix}`],
})(LotPrint);
