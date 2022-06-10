/**
 * @Description: 物料关键属性详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-14 16:12:42
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Table,
  Form,
  TextField,
  NumberField,
  Tabs,
  Switch,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { ItemKeyAttrDS, ItemKeyAttrValueListDS } from '../store/ItemKeyAttributeDS';
import { itemKeyAttrCreate, itemKeyAttrUpdate } from '@/services/itemKeyAttrService';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zmda.itemKeyAttribute';
const itemKeyAttrDS = () => new DataSet(ItemKeyAttrDS());
const itemKeyAttrValueListDS = () => new DataSet(ItemKeyAttrValueListDS());

function ZmdaItemKeyAttributeDetail({ match, history }) {
  const AttributeDS = useDataSet(itemKeyAttrDS, ZmdaItemKeyAttributeDetail);
  const ValueListDS = useDataSet(itemKeyAttrValueListDS);
  const {
    params: { type, attributeId },
  } = match;

  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    AttributeDS.setQueryParameter('attributeId', null);
    ValueListDS.setQueryParameter('attributeId', null);
    AttributeDS.data = [];
    AttributeDS.create();
    ValueListDS.data = [];
    ValueListDS.clearCachedSelected();
    if (type !== 'create') {
      AttributeDS.setQueryParameter('attributeId', attributeId);
      ValueListDS.setQueryParameter('attributeId', attributeId);
      handleSearch();
    }
  }, [attributeId]);

  function handleSearch() {
    AttributeDS.query();
    ValueListDS.query();
  }

  function handleSave() {
    setSaveLoading(true);
    return new Promise(async (resolve) => {
      const validate = await AttributeDS.current.validate(true, false);
      if (!validate) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSaveLoading(false));
        return false;
      }
      const obj = AttributeDS.current.toData();
      const res = type === 'create' ? await itemKeyAttrCreate(obj) : await itemKeyAttrUpdate(obj);
      if (res && !res.failed) {
        notification.success({
          message: '保存成功',
        });
        if (type === 'create') {
          history.push({
            pathname: `/zmda/item-key-attribute/detail/${res.attributeId}`,
          });
        } else {
          AttributeDS.query();
        }
      } else {
        notification.error({
          message: res.message,
        });
      }
      resolve(setSaveLoading(false));
    });
  }

  function handleClear() {
    AttributeDS.data = [];
    AttributeDS.create();
  }

  function handleValueCreate() {
    ValueListDS.create({
      attributeId,
      attributeCode: AttributeDS.current.get('attributeCode'),
    });
  }

  function handleValueDelete() {
    ValueListDS.delete(ValueListDS.selected);
  }

  const valueColumns = [
    { name: 'attributeValue', width: 150, editor: true },
    { name: 'attributeValueDesc', width: 250, editor: true },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: ['edit'],
    },
  ];

  return (
    <Fragment>
      <Header
        title={intl
          .get(`${intlPrefix}.view.title.itemKeyAttributeDefinition`)
          .d('物料关键属性定义')}
        backPath="/zmda/item-key-attribute"
      >
        <Button color="primary" onClick={handleSave} loading={saveLoading}>
          保存
        </Button>
        {type === 'create' && <Button onClick={handleClear}>清空</Button>}
      </Header>
      <Content>
        <Form dataSet={AttributeDS} columns={4}>
          <TextField name="attributeCode" key="attributeCode" disabled={type !== 'create'} />
          <TextField name="attributeDesc" key="attributeDesc" />
          <NumberField name="orderNum" key="orderNum" />
          <Switch name="enabledFlag" key="enabledFlag" />
        </Form>
        <Tabs defaultActiveKey="attributeValue">
          <TabPane tab="属性可选值" key="attributeValue" className={styles['zmda-attribute-table']}>
            <Table
              dataSet={ValueListDS}
              columns={valueColumns}
              columnResizable="true"
              editMode="inline"
              buttons={
                type !== 'create'
                  ? [
                      ['add', { onClick: () => handleValueCreate() }],
                      ['delete', { onClick: () => handleValueDelete() }],
                    ]
                  : null
              }
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZmdaItemKeyAttributeDetail);
