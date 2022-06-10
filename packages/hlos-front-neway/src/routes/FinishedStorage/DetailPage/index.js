/**
 * 完工入库单-详情
 * @since：2021/6/2
 * @author：jxy <xiaoyan.jin@hand-china.com>
 * @copyright Copyright (c) 2021,Hand
 */
import React, { useEffect, useMemo, useState, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Form, Button, Lov, TextField, NumberField } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { detailFormDS } from '@/stores/FinishedStorageDS';
import { userSetting } from 'hlos-front/lib/services/api';

const preCode = 'newway.finishedStorage';

const FinishedStorageDetail = (props) => {
  const detailDS = useMemo(() => new DataSet(detailFormDS()), []);
  const [isDSDirty, setDSDirty] = useState(false);
  useEffect(() => {
    async function defaultLovSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length && detailDS && detailDS.current) {
        detailDS.current.set('organizationLov', {
          meOuName: res.content[0].meOuName,
          meOuId: res.content[0].meOuId,
          meOuCode: res.content[0].meOuCode,
        });
      }
    }
    defaultLovSetting();
    detailDS.addEventListener('update', () => {
      setDSDirty(true);
    });
    return () => {
      detailDS.removeEventListener('update');
    };
  }, [detailDS]);

  /**
   * 保存新建数据
   * @returns {Promise<void>}
   */
  async function handleSave() {
    const flag = await detailDS.current.validate();
    if (!flag) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
    } else {
      const res = await detailDS.submit();
      if (res && !res.failed) {
        setDSDirty(false);
        props.history.push({ pathname: '/neway/finished-storage/list' });
        sessionStorage.setItem('finishedStorageCreate', true);
      }
    }
  }

  /**
   * 监听生产订单变化
   * @param record
   */
  function handleMoNumChange(record) {
    if (record) {
      detailDS.current.set('itemCode', record.itemCode);
      detailDS.current.set('itemId', record.itemId);
      detailDS.current.set('itemDesc', record.description);
      detailDS.current.set('sourceDocNum', record.soNum);
      detailDS.current.set('sourceDocLineNum', record.soLineNum);
      detailDS.current.set('tagCode', record.tagCode);
      detailDS.current.set('applyQty', record.applyQty);
      detailDS.current.set('wmName', record.wmName);
    } else {
      cleanData();
    }
  }

  /**
   * 清空工厂关联数据
   */
  function cleanData() {
    detailDS.current.init('moNumLov', null);
    detailDS.current.init('docTypeLov', null);
    detailDS.current.init('warehouseLov', null);
    detailDS.current.init('wmAreaLov', null);
    detailDS.current.set('itemCode', null);
    detailDS.current.set('itemDesc', null);
    detailDS.current.set('sourceDocNum', null);
    detailDS.current.set('sourceDocLineNum', null);
    detailDS.current.set('tagCode', null);
    detailDS.current.set('applyQty', null);
    detailDS.current.set('wmName', null);
  }

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.finishedStorage`).d('完工入库单')}
        backPath="/neway/finished-storage/list"
        isChange={isDSDirty}
      >
        <Button onClick={handleSave}>{intl.get('hzero.common.btn.save').d('保存')}</Button>
      </Header>
      <Content className="lwms-issue-request-content">
        <Form dataSet={detailDS} columns={4}>
          <Lov name="organizationLov" noCache onChange={cleanData} />
          <TextField name="requestNum" />
          <TextField name="requestStatus" />
          <Lov name="moNumLov" noCache onChange={handleMoNumChange} />
          <TextField name="itemCode" />
          <TextField name="itemDesc" />
          <TextField name="sourceDocNum" />
          <TextField name="sourceDocLineNum" />
          <Lov name="docTypeLov" noCache />
          <NumberField name="applyQty" />
          <NumberField name="qty" />
          <TextField name="tagCode" />
          <TextField name="wmName" />
          <Lov name="warehouseLov" noCache />
          <Lov name="wmAreaLov" noCache />
        </Form>
      </Content>
    </Fragment>
  );
};

export default formatterCollections({ code: [`${preCode}`] })(FinishedStorageDetail);
