/*
 * @Descripttion: 供应商-新建/详情页
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-09 14:58:35
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-12 16:34:38
 */

import React, { useState, useEffect, Fragment } from 'react';
import { DataSet, Button, Form, TextField, Lov, Table, CheckBox, Modal } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { createHeadDS, contactsDS, addressDS, operationUnitDS } from '../store/indexDS';
import './index.less';

const intlPrefix = 'zcom.vmiMaterialsApply';
const CreateHeadDS = () => new DataSet({ ...createHeadDS() });
const CreateContactsDS = () => new DataSet({ ...contactsDS() });
const CreateAddressDS = () => new DataSet({ ...addressDS() });
const CreateOperationUnitDS = () => new DataSet({ ...operationUnitDS() });

function ZcomVmiMaterialsApplyCreate({ match, location, history }) {
  const HeadDS = useDataSet(CreateHeadDS, ZcomVmiMaterialsApplyCreate);
  const ContactsDS = useDataSet(CreateContactsDS);
  const AddressDS = useDataSet(CreateAddressDS);
  const OperationUnitDS = useDataSet(CreateOperationUnitDS);

  const [constactShow, setConstactShow] = useState(true);
  const [addressShow, setAddressShow] = useState(true);
  const [addAuthFlag, setAddAuthFlag] = useState(false);

  const [initUnifiedSocialNum, setInitUnifiedSocialNum] = useState(null);

  const {
    params: { type, supplierId },
  } = match;

  const { state = {} } = location;
  const { supplierNumber } = state;

  useEffect(() => {
    HeadDS.setQueryParameter('supplierId', null);
    ContactsDS.setQueryParameter('supplierId', null);
    AddressDS.setQueryParameter('supplierId', null);

    HeadDS.data = [];
    ContactsDS.data = [];
    AddressDS.data = [];
    HeadDS.create();
    ContactsDS.clearCachedSelected();
    if (type === 'create') {
      // const { realName } = getCurrentUser();
      // HeadDS.current.set('creationDate', new Date());
      // HeadDS.current.set('createdByName', realName);
    } else {
      HeadDS.setQueryParameter('supplierId', supplierId);
      ContactsDS.setQueryParameter('supplierId', supplierId);
      AddressDS.setQueryParameter('supplierId', supplierId);

      handleSearch();
    }
  }, [supplierId]);

  async function handleSearch() {
    await HeadDS.query();
    setInitUnifiedSocialNum(HeadDS.current.get('unifiedSocialNum'));
    setAddAuthFlag(!!HeadDS.current.get('supplierId'));
    await ContactsDS.query();
    await AddressDS.query();
  }

  const handleLineCreate = (ds) => {
    ds.create(
      {
        supplierId: HeadDS.current.get('supplierId'),
        supplierNumber: HeadDS.current.get('supplierNumber'),
      },
      0
    );
  };

  const handleOperationCreate = () => {
    const { addressNum, addressId, supplierSiteId } = AddressDS.current.toData();
    OperationUnitDS.create(
      {
        addressNum,
        addressId,
        supplierSiteId,
        supplierId,
        supplierNumber,
      },
      0
    );
  };

  async function handleSave() {
    const validateValue = await HeadDS.validate(false, false);
    if (!validateValue) {
      notification.warning({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }

    if (
      type !== 'create' &&
      initUnifiedSocialNum &&
      initUnifiedSocialNum !== HeadDS.current.get('unifiedSocialNum')
    ) {
      Modal.confirm({
        children: <p>如果修改统一社会信用代码，可能会影响与客户的协同功能，请确认后再调整!</p>,
        onOk: () => {
          handleCreate();
        },
      });
      return;
    }

    handleCreate();
  }

  async function handleCreate() {
    const res = await HeadDS.submit();
    if (res && res.content && res.content[0]) {
      const headerSupplierId = res.content[0].supplierId;

      if (type === 'create') {
        const pathName = `/zmda/supplier-maintain/detail/${headerSupplierId}`;
        history.push({
          pathname: pathName,
          state: { supplierNumber: HeadDS.current.get('supplierNumber') },
        });

        return;
      }
      HeadDS.setQueryParameter('supplierId', headerSupplierId);
      ContactsDS.setQueryParameter('supplierId', headerSupplierId);
      AddressDS.setQueryParameter('supplierId', headerSupplierId);
      handleSearch();
    }
  }

  function handleToggle(setMethod, value) {
    setMethod(!value);
  }

  const contactsColumns = [
    {
      name: 'contactsName',
      align: 'center',
      editor: true,
      width: 150,
      lock: true,
    },
    { name: 'contactsMobilePhone', align: 'center', width: 150, editor: true },
    { name: 'contactsPhone', align: 'center', width: 150, editor: true },
    { name: 'contactsFax', align: 'center', width: 150, editor: true },
    { name: 'contactsEmail', align: 'center', width: 150, editor: true },
    {
      name: 'enabledFlag',
      align: 'center',
      width: 150,
      editor: (record) => (record.editing ? <CheckBox /> : false),
      renderer: yesOrNoRender,
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      command: ['edit'],
      lock: 'right',
    },
  ];

  const addressColumns = [
    {
      name: 'addressNum',
      align: 'center',
      editor: true,
      // editor: (record) => (record.status === 'add' ? <TextField /> : null),
      width: 150,
      lock: true,
    },
    { name: 'addressName', align: 'center', width: 150, editor: true },
    {
      name: 'fullAddress',
      align: 'center',
      width: 150,
      renderer: ({ value }) => {
        return (
          <a onClick={handleAddress} style={{ textAlign: 'center' }}>
            {value || '编辑'}
          </a>
        );
      },
    },
    { name: 'supplierSiteType', align: 'center', width: 150, editor: true },
    {
      name: 'enabledFlag',
      align: 'center',
      width: 150,
      editor: (record) => (record.editing ? <CheckBox /> : false),
      renderer: yesOrNoRender,
    },
    {
      header: '分配至业务实体',
      align: 'center',
      width: 150,
      renderer: ({ record }) => {
        return (
          <a
            onClick={handleAssign}
            style={{ textAlign: 'center' }}
            disabled={!record.get('supplierSiteId')}
          >
            分配至业务实体
          </a>
        );
      },
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      command: ['edit'],
      lock: 'right',
    },
  ];

  const operationUniColumns = [
    {
      name: 'addressNum',
      align: 'center',
      width: 150,
    },
    {
      name: 'businessUnitObj',
      align: 'center',
      width: 150,
      editor: (record) => record.status === 'add',
    },
    {
      name: 'enabledFlag',
      align: 'center',
      width: 150,
      editor: (record) => (record.editing ? <CheckBox /> : false),
      renderer: yesOrNoRender,
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      command: ['edit'],
      lock: 'right',
    },
  ];

  const handleAddress = () => {
    Modal.open({
      key: 'zmda-supplier-maintain-create-modal',
      title: '详细地址',
      children: (
        <Form dataSet={AddressDS}>
          <TextField name="country" key="country" />
          <TextField name="province" key="province" />
          <TextField name="city" key="city" />
          <TextField name="county" key="county" />
          <TextField name="addressDetail" key="addressDetail" />
        </Form>
      ),
    });
  };

  const handleAssign = async () => {
    OperationUnitDS.setQueryParameter('supplierSiteId', AddressDS.current.get('supplierSiteId'));
    OperationUnitDS.query();
    Modal.open({
      key: 'zmda-supplier-maintain-assign',
      title: '分配至业务实体',
      children: (
        <Table
          dataSet={OperationUnitDS}
          columns={operationUniColumns}
          columnResizable="true"
          editMode="inline"
          queryFieldsLimit={1}
          buttons={[['add', { onClick: () => handleOperationCreate(OperationUnitDS) }]]}
        />
      ),
      className: 'zmda-supplier-maintain-modal',
    });
  };

  const handleHeadReset = () => {
    HeadDS.reset();
  };

  return (
    <Fragment>
      <Header
        title={
          type === 'create'
            ? intl.get(`${intlPrefix}.view.title.vmiMaterialsApplyCreate`).d('新建供应商')
            : intl.get(`${intlPrefix}.view.title.vmiMaterialsApplyEdit`).d('供应商详情')
        }
        backPath="/zmda/supplier-maintain"
      >
        <Button color="primary" onClick={handleSave}>
          保存
        </Button>
        {!addAuthFlag ? <Button onClick={handleHeadReset}>清空</Button> : null}
      </Header>
      <Content className="zmda-supplier-maintain">
        <Form dataSet={HeadDS} columns={4} labelWidth={120}>
          <TextField
            name="supplierNumber"
            key="supplierNumber"
            disabled={type !== 'create'}
            restrict="0-9"
          />
          <TextField name="supplierName" key="supplierName" disabled={type !== 'create'} />
          <TextField name="supplierShortName" key="supplierShortName" />
          <CheckBox name="cooperationFlag" key="cooperationFlag">
            供应商协同
          </CheckBox>
          <TextField name="unifiedSocialNum" key="unifiedSocialNum" />
          <Lov name="defaultTaxRateObj" key="defaultTaxRateObj" noCache />
        </Form>

        <div className="zmda-supplier-maintain-headInfo">
          <span>联系人</span>
          <span
            className="headInfo-toggle"
            onClick={() => handleToggle(setConstactShow, constactShow)}
          >
            {constactShow ? (
              <span>
                收起 <Icon type="expand_more" />
              </span>
            ) : (
              <span>
                展开 <Icon type="expand_less" />
              </span>
            )}
          </span>
        </div>
        {constactShow ? (
          <Table
            dataSet={ContactsDS}
            columns={contactsColumns}
            columnResizable="true"
            editMode="inline"
            buttons={[
              addAuthFlag ? ['add', { onClick: () => handleLineCreate(ContactsDS) }] : null,
            ]}
          />
        ) : null}

        <div className="zmda-supplier-maintain-headInfo">
          <span>地点</span>
          <span
            className="headInfo-toggle"
            onClick={() => handleToggle(setAddressShow, addressShow)}
          >
            {addressShow ? (
              <span>
                收起 <Icon type="expand_more" />
              </span>
            ) : (
              <span>
                展开 <Icon type="expand_less" />
              </span>
            )}
          </span>
        </div>
        {addressShow ? (
          <Table
            dataSet={AddressDS}
            columns={addressColumns}
            columnResizable="true"
            editMode="inline"
            buttons={[addAuthFlag ? ['add', { onClick: () => handleLineCreate(AddressDS) }] : null]}
          />
        ) : null}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomVmiMaterialsApplyCreate {...props} />;
});
