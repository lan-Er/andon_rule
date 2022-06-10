/*
 * @Description: 盘点平台新增和编辑界面
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-26 15:05:50
 * @LastEditors: Please set LastEditors
 */

import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  DataSet,
  Form,
  Lov,
  NumberField,
  Select,
  Table,
  TextField,
  Tooltip,
  Modal,
  Spin,
  DateTimePicker,
} from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import { connect } from 'dva';
import { History } from 'history';
import { ColumnAlign, ColumnLock } from 'choerodon-ui/pro/lib/table/enum';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import queryString from 'query-string';

import formatterCollections from 'utils/intl/formatterCollections';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import { openTab } from 'utils/menuTab';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import { Content, Header } from 'components/Page';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { inventoryPlatformEditDS } from '@src/stores/inventoryPlatformDS';

import { handleOpenBatchCreateLineModal } from './modal';

const intlPrefix = 'lwms.inventoryPlatform';
const commonPrefix = 'lwms.common';
const modalKey = Modal.key();

interface DetailProps {
  [key: string]: any;

  history: History<{
    _isCreate_: boolean;
    id?: string;
    countStatus?: string;
    back?: number;
  }>;
}

const getLineColumns: () => ColumnProps[] = () => {
  const editableWrap = (isLov = true, type = '') => {
    if (isLov) {
      return (record) =>
        record.status === 'add' ? (
          <Lov
            noCache
            onChange={type === 'warehouse' ? () => handleWarehouseChange(record) : () => {}}
          />
        ) : (
          false
        );
    } else {
      return (record) => record.status === 'add';
    }
  };

  const columns = [
    {
      name: 'countLineNum',
      width: 70,
      align: ColumnAlign.center,
      editor: false,
      lock: true,
    },
    {
      name: 'warehouseObj',
      width: 128,
      editor: editableWrap(true, 'warehouse'),
      lock: true,
    },
    {
      name: 'wmAreaObj',
      width: 128,
      editor: editableWrap(),
      lock: true,
    },
    {
      name: 'wmUnitObj',
      width: 128,
      editor: editableWrap(),
    },
    {
      name: 'itemType',
      width: 128,
      editor: editableWrap(false),
    },
    {
      name: 'categoryObj',
      width: 128,
      editor: editableWrap(),
    },
    {
      name: 'itemObj',
      width: 200,
      editor: editableWrap(),
      renderer: ({ value = {} }) => {
        const { itemCode, description, itemDescription } = value || ({} as any);
        return (
          <span>
            {itemCode || description || itemDescription
              ? `${itemCode} ${description || itemDescription}`
              : ''}
          </span>
        );
      },
    },
    {
      name: 'lineRemark',
      width: 200,
      editor: editableWrap(false),
    },
    {
      name: 'enabledFlag',
      width: 80,
      editor: true,
      renderer: yesOrNoRender,
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
  return columns;
};

const handleBatchExport = () => {
  try {
    openTab({
      // 编码是后端给出的
      // TODO 更新导出 URL
      key: `/himp/commentImport/xxxx`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: 'hzero.common.title.templateImport',
      search: queryString.stringify({
        title: 'hzero.common.title.templateImport',
        action: 'himp.commentImport.view.button.templateImport',
        tenantId: getCurrentOrganizationId(),
        prefixPatch: '',
        templateType: 'S',
      }),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message);
  }
};

const handleWarehouseChange = (record) => {
  record.set('wmAreaObj', null);
};

function InventoryPlatformCreateAndEdit(props: DetailProps) {
  const ds = useMemo(() => new DataSet(inventoryPlatformEditDS()), []);
  const [initLineNum, setInitLineNum] = useState(0);
  const { defaultOrg, history, dispatch, batchCreateInfo } = props;
  const [isCreate, setIsCreate] = useState<Boolean | null>(null);
  const [orgHasSetted, setOrgHasSetted] = useState(false);
  const [isDSDirty, setDSDirty] = useState(false);

  // 设置初始行号
  useEffect(() => {
    const countId = history.location?.state?.id;
    if (countId) {
      dispatch({
        type: 'inventoryPlatform/fetchLineNumber',
        payload: {
          countId,
        },
      }).then(({ countLineNum }) => {
        if (!isNaN(countLineNum)) {
          setInitLineNum(countLineNum);
        }
      });
    }
  }, [dispatch, history]);

  // 判断是编辑还是创建界面
  useEffect(() => {
    const state = history?.location?.state;
    if (state) {
      const { _isCreate_ = false } = state;
      setIsCreate(_isCreate_);
    }
  }, [history, isCreate]);

  // 设置默认组织
  useEffect(() => {
    if (isCreate === false) {
      setOrgHasSetted(true);
      return;
    }
    const { current } = ds;
    if (isCreate && current && !orgHasSetted) {
      if (defaultOrg) {
        current.set('organizationObj', defaultOrg);
        setOrgHasSetted(true);
      } else {
        dispatch({ type: 'inventoryPlatform/updateDefaultOrg' }).then(() => {
          setOrgHasSetted(true);
        });
        // .catch(() => {
        //   setOrgHasSetted(true);
        // });
      }
    }
  }, [defaultOrg, orgHasSetted, dispatch, isCreate, ds]);

  // 详情页数据查询
  useEffect(() => {
    if (isCreate === false) {
      const state = history.location?.state || {};
      const { id } = state;
      ds.setQueryParameter('countId', id);
      ds.children.lineDS.setQueryParameter('countId', id);
      ds.query().then((res) => {
        if (res?.content?.length) {
          const { organizationId, organizationCode, organizationName } = res.content[0];
          dispatch({
            type: 'inventoryPlatform/updateCurrentOrg',
            payload: {
              currentOrg: {
                organizationId,
                organizationCode,
                organizationName,
              },
            },
          });
        }
      });
    }
  }, [history, isCreate, dispatch, ds]);

  // 监听头 Form 数据变更
  useEffect(() => {
    const { lineDS } = ds.children || {};
    function updateDSDirtyState(_ds) {
      setDSDirty(_ds.dirty);
    }
    if (dispatch && orgHasSetted) {
      ds.addEventListener('update', ({ name, value = undefined }) => {
        if (name === 'organizationObj') {
          if (lineDS) {
            lineDS.reset();
          }
          dispatch({
            type: 'inventoryPlatform/updateCurrentOrg',
            payload: {
              currentOrg: value,
            },
          });
        }
        setDSDirty(ds.dirty);
      });
      if (lineDS) {
        lineDS.addEventListener('update', () => updateDSDirtyState(lineDS));
        lineDS.addEventListener('create', () => updateDSDirtyState(lineDS));
        lineDS.addEventListener('remove', () => updateDSDirtyState(lineDS));
      }
    }
    return () => {
      ds.removeEventListener('update');
      if (lineDS) {
        lineDS.removeEventListener('update');
        lineDS.removeEventListener('create');
        lineDS.removeEventListener('remove');
      }
    };
  }, [dispatch, ds, orgHasSetted]);

  // 单据批量创建
  useEffect(() => {
    if (batchCreateInfo.length) {
      batchCreateInfo.forEach((r, i) => {
        const {
          wmAreaId,
          wmAreaCode,
          wmAreaName,
          warehouseId,
          warehouseCode,
          warehouseName,
          itemId,
          itemCode,
          description,
          itemType,
        } = r;
        const instance = {
          countLineNum: initLineNum + i + 1,
        } as any;
        if (wmAreaId) {
          instance.wmAreaId = wmAreaId;
          instance.wmAreaCode = wmAreaCode;
          instance.wmAreaName = wmAreaName;
        }
        if (warehouseId) {
          instance.warehouseId = warehouseId;
          instance.warehouseCode = warehouseCode;
          instance.warehouseName = warehouseName;
        }
        if (itemId) {
          instance.itemId = itemId;
          instance.itemCode = itemCode;
          instance.description = description;
          instance.itemType = itemType;
        }
        // TODO 需要优化性能（尝试参考 DS Query查询方式赋值）
        ds.children.lineDS.create(instance, 0);
      });
      dispatch({
        type: 'inventoryPlatform/updateBatchCreate',
        payload: {
          batchCreateInfo: [],
        },
      }).then(() => {
        setInitLineNum((n) => n + batchCreateInfo.length);
      });
    }
  }, [batchCreateInfo, initLineNum, dispatch, ds]);

  // 新建 保存 后清空页面继续新建
  const handleCreate = () => {
    Modal.open({
      key: modalKey,
      closable: true,
      title: intl.get(`${intlPrefix}.view.message.sure`).d('确定'),
      children: (
        <span>
          {intl.get(`${intlPrefix}.view.message.saveInventoryItemOrNot`).d('是否保存此盘点单')}
        </span>
      ),
      onOk: onModalOKClick,
    });
  };

  const onModalOKClick = async () => {
    await handelSave();
    history.push('/lwms/inventory-platform/create', {
      _isCreate_: true,
    });
  };

  // 保存
  const handelSave = async () => {
    const isHeadValid = await validateHead();
    const isLineValid = validateLine();
    if (isHeadValid && isLineValid) {
      const res = await ds.submit();
      if (!res.failed) {
        history.push('/lwms/inventory-platform/list', {
          _isCreate_: true,
          back: 1,
        });
      } else {
        notification.warning({
          message: res.message || `保存失败`,
          description: '',
        });
      }
    }
  };

  const validateHead = async () => {
    const res = await ds.validate(false, false);
    if (!res) {
      notification.warning({
        description: '',
        message: intl.get(`${intlPrefix}.view.message.required`).d('存在必输字段未填写'),
      });
    }
    return res;
  };

  const validateLine = () => {
    const lineData = ds.children.lineDS.toJSONData();
    if (lineData.length) {
      let validateFlag = true;
      for (let i = 0; i < lineData.length; i++) {
        const { warehouseId, itemId } = lineData[i] as any;
        if (!warehouseId && !itemId) {
          notification.warning({
            description: '',
            message: intl.get(`${intlPrefix}.view.message.required`).d('仓库和物料不能同时为空'),
          });
          validateFlag = false;
          break;
        }
      }
      return validateFlag;
    }
  };

  // 新建行
  const handleAddLine = async () => {
    const isHeadValid = await validateHead();
    const countStatus = isCreate ? 'NEW' : history.location?.state?.countStatus;
    if (isHeadValid) {
      if (countStatus === 'NEW') {
        if (ds?.children?.lineDS) {
          const { lineDS } = ds.children;
          lineDS.create(
            {
              countLineNum: initLineNum + 1,
            },
            lineDS?.records?.length || 0
          );
          setInitLineNum((n) => n + 1);
        }
      } else {
        notification.warning({
          description: '',
          message: '仅新建状态且无盘点行可新增行',
        });
      }
    }
  };

  // 批量新建
  const handleBatchAddLine = async () => {
    const isHeadValid = await validateHead();
    const countStatus = isCreate ? 'NEW' : history.location?.state?.countStatus;
    if (isHeadValid) {
      if (countStatus === 'NEW') {
        handleOpenBatchCreateLineModal();
      } else {
        notification.warning({
          description: '',
          message: '仅新建状态且无盘点行可新增行',
        });
      }
    }
  };

  return (
    <Spin spinning={!orgHasSetted}>
      <Header
        title={intl.get(`${intlPrefix}.view.title.inventoryPlatform`).d('盘点平台')}
        backPath="/lwms/inventory-platform/list"
        isChange={isDSDirty}
      >
        {isCreate ? (
          <Button icon="add" color={ButtonColor.primary} onClick={handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        ) : null}
        <Button onClick={handleBatchExport}>
          {intl.get(`${intlPrefix}.button.import`).d('导入')}
        </Button>
        <Button onClick={handelSave}>{intl.get('hzero.common.button.save').d('保存')}</Button>
      </Header>
      <Content>
        <Card
          key="party-detail-header"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
          title={<h3>{intl.get(`${intlPrefix}.view.title.inventoryPlatform`).d('盘点平台')}</h3>}
        >
          <Form dataSet={ds} columns={4}>
            <Lov name="organizationObj" disabled={!isCreate} />
            <TextField name="countNum" disabled={!isCreate} />
            <Select name="countType" disabled={!isCreate} />
            <Select name="countMethod" disabled={!isCreate} />
            <Select name="countStatus" disabled />
            <Lov name="countRuleObj" disabled={!isCreate} />
            <NumberField name="tolerancePositive" />
            <NumberField name="toleranceNegative" />
            <DateTimePicker name="planDate" />
            <Lov name="defaultAdjustAccount" />
            <Select name="approvalRule" />
            <Lov name="approvalWorkFlowObj" />
            <TextField name="remark" />
          </Form>
        </Card>
        <Card
          key="party-detail-body"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
          title={
            <h3>{intl.get(`${intlPrefix}.view.title.inventoryPlatformLine`).d('盘点平台行')}</h3>
          }
        >
          <Button
            key="add"
            icon="playlist_add"
            funcType={FuncType.flat}
            color={ButtonColor.primary}
            onClick={handleAddLine}
          >
            {intl.get('hzero.common.button.create').d('新增')}
          </Button>
          <Button
            key="batch_add"
            icon="queue"
            funcType={FuncType.flat}
            color={ButtonColor.primary}
            onClick={handleBatchAddLine}
          >
            {intl.get(`${intlPrefix}.button.batch.create`).d('批量新增')}
          </Button>
          <Table dataSet={ds.children.lineDS} columns={getLineColumns()} />
        </Card>
      </Content>
    </Spin>
  );
}

function mapStateToProps({ inventoryPlatform }) {
  return {
    defaultOrg: inventoryPlatform?.defaultOrg,
    batchCreateInfo: inventoryPlatform?.batchCreateInfo,
  };
}

export default connect(mapStateToProps)(
  formatterCollections({
    code: [`${intlPrefix}`, `${commonPrefix}`],
  })(InventoryPlatformCreateAndEdit)
);
