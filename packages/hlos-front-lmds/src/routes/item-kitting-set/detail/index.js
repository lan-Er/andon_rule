/**
 * @Description: 齐套配置--detail
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-11 10:13:09
 * @LastEditors: yu.na
 */
import React, { Fragment, useCallback, useMemo, useEffect, useState } from 'react';
import {
  Button,
  Table,
  Form,
  Lov,
  DataSet,
  Select,
  TextField,
  Switch,
  Modal,
  NumberField,
} from 'choerodon-ui/pro';
import { useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { queryLovData } from 'hlos-front/lib/services/api';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import codeConfig from '@/common/codeConfig';
import DetailDS from '../stores/DetailDS';
import styles from '../list/index.less';

const { common } = codeConfig.code;
const preCode = 'lmds.itemKittingSet';

const KittingSetMaintenance = ({ match, history }) => {
  const detailDS = useMemo(() => new DataSet(DetailDS()), []);

  const [isCreate, setIsCreate] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [defaultOrg, setDefaultOrg] = useState({});

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        setDefaultOrg(res.content[0]);
        detailDS.current.set('organizationObj', res.content[0]);
      }
      setIsDirty(false);
    }
    queryDefaultOrg();
  }, []);

  useEffect(() => {
    const { params } = match;
    if (params.kittingSetId) {
      setIsCreate(false);
      refreshPage(params.kittingSetId);
    } else {
      setIsCreate(true);
    }
  }, [match]);

  useDataSetEvent(detailDS, 'update', () => {
    setIsDirty(true);
  });

  useDataSetEvent(detailDS.children.lineDTOList, 'update', ({ dataSet }) => {
    setIsDirty(dataSet.dirty);
  });

  useDataSetEvent(detailDS.children.lineDTOList.children.detailDTOList, 'update', ({ dataSet }) => {
    setIsDirty(dataSet.dirty);
  });

  const lineColumns = useCallback(() => {
    return [
      { name: 'setLineNum', width: 70, lock: true },
      { name: 'setLineType', width: 100, lock: true, editor: (record) => record.status === 'add' },
      { name: 'reviewItemType', width: 100, editor: (record) => record.status === 'add' },
      { name: 'reviewItemObj', width: 200, editor: (record) => record.status === 'add' },
      { name: 'reviewCategoryObj', width: 150, editor: (record) => record.status === 'add' },
      { name: 'enabledFlag', width: 82, editor: true },
    ];
  }, []);

  const detailLineColumns = useCallback(() => {
    return [
      {
        name: 'supplyLineNum',
        width: 70,
        lock: true,
      },
      {
        name: 'kittingSupplyType',
        width: 100,
        lock: true,
        editor: (record) => record.status === 'add',
      },
      // { name: 'kittingType', width: 100, editor: (record) => record.status === 'add' },
      { name: 'organizationObj', width: 128, editor: true },
      { name: 'warehouseObj', width: 128, editor: true },
      // { name: 'wmAreaObj', width: 128, editor: true },
      { name: 'documentTypeObj', width: 128, editor: true },
      { name: 'priority', width: 84, editor: true },
      { name: 'enabledFlag', width: 82, editor: true },
    ];
  }, []);

  function handleLineCreate(ds, type) {
    ds.create({
      [`${type}`]: ds.length ? Number(ds.data[ds.length - 1].data[type]) + 1 : 1,
    });
  }

  async function refreshPage(id) {
    const { params } = match;

    detailDS.queryParameter = {
      kittingSetId: id || params.kittingSetId,
    };
    detailDS.children.lineDTOList.children.detailDTOList.queryParameter = {
      kittingSetId: id || params.kittingSetId,
    };
    await detailDS.query();
  }

  function handleToCreatePage() {
    if (isCreate) {
      detailDS.current.reset();
      detailDS.current.set('organizationObj', defaultOrg);
    } else {
      history.push(`/lmds/kitting-set/create`);
    }
  }
  function handleCreate() {
    if (isDirty) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.saveData`).d('是否保存当前数据？')}</p>,
        okText: intl.get('hzero.common.status.yes').d('是'),
        cancelText: intl.get('hzero.common.status.no').d('否'),
        onOk: handleSave,
        onCancel: handleToCreatePage,
      });
    } else {
      handleToCreatePage();
    }
  }

  async function handleSave() {
    const validateValue = await detailDS.validate(false, false);
    if (!validateValue) return;
    const res = await detailDS.submit(false, false);
    if (res === undefined) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
    }
    if (res && res.content && res.content[0]) {
      setIsDirty(false);
      if (isCreate) {
        history.push(`/lmds/kitting-set/detail/${res.content[0].kittingSetId}`);
      } else {
        refreshPage();
      }
    }
  }

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.detail`).d('齐套配置维护')}
        backPath="/lmds/kitting-set/list"
      >
        <Button onClick={handleCreate}>{intl.get('hzero.common.button.create').d('新建')}</Button>
        <Button color="primary" onClick={handleSave}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </Header>
      <Content className={styles['lmds-kitting-set-content']}>
        <Form dataSet={detailDS} columns={8}>
          <Lov name="organizationObj" colSpan={2} />
          <Select name="kittingReviewType" colSpan={2} />
          <TextField name="kittingSetCode" colSpan={2} />
          <Select name="kittingReviewRule" colSpan={2} />
          <TextField name="description" colSpan={4} />
          <Lov name="itemCategoryObj" colSpan={2} />
          <Lov name="partyObj" colSpan={2} />
          <Lov name="itemObj" colSpan={2} />
          <NumberField name="kittingTimeFence" colSpan={2} />
          {/*  suffix={<span style={{ lineHeight: '20px' }}>天</span>} */}
          <Lov name="adviseRuleObj" colSpan={2} />
          <Switch name="primaryFlag" colSpan={1} />
          <Switch name="enabledFlag" colSpan={1} />
        </Form>
        <div className={styles['lmds-kitting-set-line-table']}>
          <Table
            dataSet={detailDS.children.lineDTOList}
            columns={lineColumns()}
            buttons={[
              [
                'add',
                { onClick: () => handleLineCreate(detailDS.children.lineDTOList, 'setLineNum') },
              ],
              'delete',
            ]}
          />
          <Table
            dataSet={detailDS.children.lineDTOList.children.detailDTOList}
            columns={detailLineColumns()}
            buttons={[
              [
                'add',
                {
                  onClick: () =>
                    handleLineCreate(
                      detailDS.children.lineDTOList.children.detailDTOList,
                      'supplyLineNum'
                    ),
                },
              ],
              'delete',
            ]}
          />
        </div>
      </Content>
    </Fragment>
  );
};
export default KittingSetMaintenance;
