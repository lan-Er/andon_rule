import React, { Fragment, useEffect } from 'react';
import { connect } from 'dva';
import { Button, DataSet, Modal, Radio, Table, TextField, Lov, Tooltip } from 'choerodon-ui/pro';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { ColumnLock } from 'choerodon-ui/pro/lib/table/enum';

import {
  inventoryModalItemDS,
  inventoryModalWMDS,
  inventoryModalAreaDS,
  inventoryModalFilterDS,
} from '@src/stores/inventoryPlatformDS';
import intl from 'utils/intl';
import notification from 'utils/notification';

const modalModeByWmDS = new DataSet(inventoryModalWMDS());
const modalModeByAreaDS = new DataSet(inventoryModalAreaDS());
const modalFilterDS = new DataSet(inventoryModalFilterDS());
const modalItemDS = new DataSet(inventoryModalItemDS());

const intlPrefix = 'lwms.inventoryPlatform';
const modalKey = Modal.key();
const tempItemIds: string[] = [];
let modalContent: 'mode' | 'item' = 'mode';
let modalInstance;

function mapStateToProps({ inventoryPlatform }) {
  return {
    organizationId:
      inventoryPlatform?.currentOrg?.organizationId ||
      inventoryPlatform?.defaultOrg?.organizationId,
  };
}

const handleSelectItem = (val) => {
  const { itemId, itemCode, description, itemType } = val;
  if (tempItemIds.includes(itemId)) {
    notification.warning({
      description: '',
      message: intl.get(`${intlPrefix}.view.message.noDuplicatedItem`).d('不可重复选择相同物料'),
    });
    return;
  }
  modalItemDS.create(
    {
      itemId,
      itemCode,
      description,
      itemType,
    },
    0
  );
  tempItemIds.push(itemId);
  if (modalFilterDS.current) {
    modalFilterDS.current.set('itemObj', null);
  }
};

const handleSubmit = (dispatch) => {
  modalInstance.close();
  setTimeout(() => {
    const inventoryMode = modalFilterDS.current?.get('inventoryMode');
    if (inventoryMode) {
      const activeDS = inventoryMode === 'repo' ? modalModeByWmDS : modalModeByAreaDS;
      let batchCreateInfo: Array<any> = [];
      const repoInfo = activeDS.selected.map((i) => i.data) || [];
      const { records: itemRecords } = modalItemDS;
      if (itemRecords.length) {
        repoInfo.forEach((repo: any) => {
          const _repo = {};
          const keys = [
            'warehouseId',
            'warehouseCode',
            'warehouseName',
            'wmAreaId',
            'wmAreaCode',
            'wmAreaName',
          ];
          keys.forEach((key) => {
            const val = repo[key];
            if (val) {
              _repo[key] = val;
            }
          });
          const itemInfo = itemRecords.map((i) => i.data) || [];
          batchCreateInfo.push(...itemInfo.map((item) => ({ ...item, ..._repo })));
        });
      } else {
        batchCreateInfo = repoInfo;
      }
      dispatch({
        type: 'inventoryPlatform/updateBatchCreate',
        payload: {
          batchCreateInfo,
        },
      });
    }
    modalFilterDS.reset();
    modalContent = 'mode';
    modalModeByWmDS.loadData([]);
    modalModeByWmDS.clearCachedSelected();
    modalModeByAreaDS.loadData([]);
    modalModeByAreaDS.clearCachedSelected();
    modalItemDS.loadData([]);
  }, 200);
};

const handleQuery = (organizationId) => {
  let ds: DataSet | null = null;
  if (modalContent === 'mode') {
    const mode = modalFilterDS?.current?.get('inventoryMode');
    if (mode === 'repo') {
      ds = modalModeByWmDS;
    } else if (mode === 'wmArea') {
      ds = modalModeByAreaDS;
    }
  }
  if (ds) {
    ds.setQueryParameter('displayWarehouse', modalFilterDS.current?.get('repoOrAreaInfo'));
    if (organizationId) {
      ds.setQueryParameter('organizationId', organizationId);
    }
    ds.query();
  }
};

const getModalColumns = () => {
  const inventoryMode = modalFilterDS?.current?.get('inventoryMode');
  if (modalContent === 'mode') {
    const _columns = [
      {
        name: 'displayWarehouse',
        width: 150,
        editor: false,
      },
    ];
    if (inventoryMode === 'repo') {
      return _columns;
    } else if (inventoryMode === 'wmArea') {
      return _columns.concat({
        name: 'displayWmArea',
        width: 150,
        editor: false,
      });
    }
  } else if (modalContent === 'item') {
    return [
      {
        name: 'itemCode',
        width: 150,
        editor: false,
      },
      {
        name: 'description',
        width: 150,
        editor: false,
      },
      {
        // @ts-ignore
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ dataSet, record }) => {
          return [
            <Tooltip
              key="action"
              placement="bottom"
              title={intl.get('hzero.common.button.delete').d('删除')}
            >
              <Button
                icon="delete"
                color={ButtonColor.primary}
                funcType={FuncType.flat}
                disabled={record.status !== 'add'}
                onClick={() => dataSet.delete(record)}
              />
            </Tooltip>,
          ];
        },
        lock: ColumnLock.right,
      },
    ];
  }
};

const RenderModalContent = ({ organizationId }) => {
  useEffect(() => {
    modalFilterDS.addEventListener('update', async ({ name }) => {
      if (name === 'inventoryMode') {
        modalInstance.update({
          children: <WrappedModalContent />,
        });
        if (organizationId) {
          handleQuery(organizationId);
        }
      }
    });
    return () => {
      modalFilterDS.removeEventListener('update');
    };
  }, [organizationId]);
  if (modalContent === 'mode') {
    const modeType = modalFilterDS?.current?.get('inventoryMode');
    return (
      <Fragment>
        <span style={{ fontSize: '14px' }}>
          {intl.get(`${intlPrefix}.view.message.selectInventoryMode`).d('选择盘点模式：')}
        </span>
        <Radio dataSet={modalFilterDS} name="inventoryMode" value="repo">
          {intl.get(`${intlPrefix}.view.message.byRepo`).d('按仓库')}
        </Radio>
        <Radio dataSet={modalFilterDS} name="inventoryMode" value="wmArea">
          {intl.get(`${intlPrefix}.view.message.byWmArea`).d('按货位')}
        </Radio>
        <div style={{ margin: '20px 0' }}>
          {intl.get(`${intlPrefix}.view.message.warehouse`).d('仓库：')}
          <TextField
            clearButton
            dataSet={modalFilterDS}
            name="repoOrAreaInfo"
            onClear={() => handleQuery(organizationId)}
          />
          <Button onClick={() => handleQuery(organizationId)} style={{ marginLeft: '10px' }}>
            {intl.get('hzero.common.button.search').d('搜索')}
          </Button>
        </div>
        <Table
          dataSet={modeType === 'repo' ? modalModeByWmDS : modalModeByAreaDS}
          columns={getModalColumns()}
        />
      </Fragment>
    );
  } else {
    const { current } = modalFilterDS;
    if (current) {
      current.set('organizationId', organizationId);
    }
    return (
      <Fragment>
        <span style={{ fontSize: '14px' }}>
          {intl.get(`${intlPrefix}.view.message.limitInventoryItem`).d('限定盘点的物料：')}
        </span>
        <div style={{ margin: '20px 0' }}>
          {intl.get(`${intlPrefix}.view.message.addItem`).d('添加物料：')}
          <Lov name="itemObj" dataSet={modalFilterDS} onChange={handleSelectItem} noCache />
        </div>
        <Table dataSet={modalItemDS} columns={getModalColumns()} />
      </Fragment>
    );
  }
};

const WrappedModalContent = connect(mapStateToProps)(RenderModalContent);

const RenderModalFooter = (props) => {
  const { dispatch, content } = props;
  const contentType = content || modalContent;
  if (contentType === 'mode') {
    return (
      <Fragment>
        <Button
          onClick={() => {
            modalContent = 'item';
            modalInstance.update({
              children: <WrappedModalContent />,
              footer: <WrappedModalFooter content="item" />,
            });
          }}
        >
          限定物料
        </Button>
        <Button onClick={() => handleSubmit(dispatch)}>
          {intl.get('hzero.common.button.submit').d('提交')}
        </Button>
      </Fragment>
    );
  } else if (contentType === 'item') {
    return (
      <Fragment>
        <Button
          onClick={() => {
            modalContent = 'mode';
            modalInstance.update({
              children: <WrappedModalContent />,
              footer: <WrappedModalFooter content="mode" />,
            });
          }}
        >
          {intl.get('hzero.common.button.ok').d('确定')}
        </Button>
      </Fragment>
    );
  }
};

const WrappedModalFooter = connect()(RenderModalFooter);

export const handleOpenBatchCreateLineModal = () => {
  tempItemIds.length = 0;
  modalInstance = Modal.open({
    key: modalKey,
    closable: true,
    footer: <WrappedModalFooter />,
    title: intl.get(`${intlPrefix}.view.title.batch.create`).d('批量新增'),
    children: <WrappedModalContent />,
    afterClose: () => {
      modalContent = 'mode';
      modalFilterDS.removeEventListener('update');
    },
  });
};
