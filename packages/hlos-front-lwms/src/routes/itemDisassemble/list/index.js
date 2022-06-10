/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-22 17:18:20
 * @LastEditTime: 2021-03-07 11:50:22
 */

import React, { useEffect, useState, Fragment } from 'react';
// import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import Icons from 'components/Icons';
import { Form, Button, DataSet, Table, TextField, Modal, Lov } from 'choerodon-ui/pro';
// import { Popconfirm } from 'choerodon-ui';
import { userSetting } from 'hlos-front/lib/services/api';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { itemDisassenbleSubHeaderDS } from '@/stores/itemDisassembleDS';
import {
  getTagThings,
  getMoComponent,
  getBomComponent,
  wmItemDisassemble,
  queryItemControlTypeBatch,
} from '@/services/itemDisassembleService';
import ItemModal from '../modals/itemModal';
import TagModal from '../modals/tagModal';
import LotModal from '../modals/lotModal';
import styles from './index.less';

const intlPrefix = 'lwms.tagPrint';
const commonPrefix = 'lwms.common';
const subHeaderDS = new DataSet(itemDisassenbleSubHeaderDS());
const resultTableDS = subHeaderDS.children.table;
const resultTableSearchDS = subHeaderDS.children.search;
// const resultTableSearchDS = new DataSet(itemDisassenbleTableSearchDS());
const modalItemKey = Modal.key();
const modalTagKey = Modal.key();
const modalLotKey = Modal.key();

function ItemDisassemble() {
  const [tagDismantling, setTagDismantling] = useState(false);
  const [itemObj, setItemObj] = useState({});

  let modal = null;
  let itemTemp = {};
  let tagDetailTemp = {};
  let detailQuantity = 0;
  let lineDetailDS = new DataSet();
  useEffect(() => {
    // 界面初始默认设置
    async function getInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        subHeaderDS.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
          organizationCode: res.content[0].organizationCode,
        });
        resultTableSearchDS.current.set(
          'organizationObj',
          subHeaderDS.current.get('organizationObj')
        );
        subHeaderDS.current.set('workerObj', {
          workerId: res.content[0].workerId,
          workerName: res.content[0].workerName,
          workerCode: res.content[0].workerCode,
        });
      }
    }
    getInfo();
  }, []);
  useEffect(() => {
    return () => {
      subHeaderDS.reset();
    };
  }, []);
  const changeTagDismantling = (bool) => {
    setTagDismantling(bool);
  };
  const changeDetail = (type) => {
    if (type === 'TAG') {
      modal = Modal.open({
        key: modalTagKey,
        title: '明细录入',
        className: `${styles['lwms-itemDisassemble-modal']}`,
        closable: true,
        style: {
          width: '800px',
        },
        children: (
          <TagModal
            organizationObj={subHeaderDS.current.get('organizationObj')}
            records={resultTableDS.current.get('detailRecords')}
            itemObj={resultTableDS.current.get('toItemObj')}
            referenceQuantity={resultTableDS.current.get('referenceQuantity')}
            getLineDetail={(e, quantitySum, detailTableDS) => {
              getLineDetail(e, quantitySum, detailTableDS);
            }}
          />
        ),
        onOk: handleTagOk,
        onCancel: handleTagCancel,
      });
    }
    if (type === 'LOT') {
      modal = Modal.open({
        key: modalLotKey,
        title: '明细录入',
        className: `${styles['lwms-itemDisassemble-modal']}`,
        closable: true,
        destroyOnClose: true,
        style: {
          width: '800px',
        },
        children: (
          <LotModal
            organizationObj={subHeaderDS.current.get('organizationObj')}
            records={resultTableDS.current.get('detailRecords')}
            itemObj={resultTableDS.current.get('toItemObj')}
            referenceQuantity={resultTableDS.current.get('referenceQuantity')}
            getLineDetail={(e, quantitySum, detailTableDS) => {
              getLineDetail(e, quantitySum, detailTableDS);
            }}
          />
        ),
        onOk: handleTagOk,
        onCancel: handleTagCancel,
      });
    }
  };
  const scanTag = async (e) => {
    if (e.keyCode === 13) {
      const params = {
        tagCode: e.target.value,
      };
      const res = await getTagThings(params);
      if (res.length > 0) {
        setItemObj(res[0]);
      } else {
        setItemObj({});
      }
    }
  };
  const getItem = (e) => {
    itemTemp = e.toJSONData();
  };
  const getLineDetail = (e, quantitySum, detailTableDS) => {
    tagDetailTemp = e;
    detailQuantity = quantitySum;
    lineDetailDS = detailTableDS;
  };
  const handleItemOk = () => {
    if (itemTemp.itemId) {
      setItemObj(itemTemp);
    }
  };

  const handleCancel = () => {
    modal.close();
  };
  const handleTagOk = async () => {
    const validate = await lineDetailDS.validate(false, false);
    if (lineDetailDS.data.length === 0 || detailQuantity === 0) {
      Modal.confirm({
        title: '未输入明细内容，是否退出？',
      }).then((button) => {
        if (button === 'cancel') {
          resultTableDS.current.set('detailRecords', tagDetailTemp);
          changeDetail(resultTableDS.current.get('toItemControlType'));
        }
        if (button === 'ok') {
          resultTableDS.current.set('detailRecords', {});
        }
      });
    } else if (!validate) {
      Modal.confirm({
        title: '请输入必输项',
      }).then(() => {
        resultTableDS.current.set('detailRecords', tagDetailTemp);
        changeDetail(resultTableDS.current.get('toItemControlType'));
      });
    } else {
      resultTableDS.current.set('detailRecords', tagDetailTemp);
    }
  };

  const handleTagCancel = () => {
    // tagDetailTemp = {};
    modal.close();
  };
  const chooseItem = () => {
    if (!tagDismantling) {
      modal = Modal.open({
        key: modalItemKey,
        title: '待拆解产品',
        className: `${styles['lwms-itemDisassemble-modal']}`,
        closable: true,
        style: {
          width: '1100px',
        },
        children: (
          <ItemModal
            organization={subHeaderDS.current.get('organizationObj')}
            getItem={(e) => {
              getItem(e);
            }}
          />
        ),
        onOk: handleItemOk,
        onCancel: handleCancel,
      });
    }
  };

  const haveItem = () => {
    return (
      <div className={styles['lwms-itemDisassemble-item']}>
        <div className={styles['lwms-itemDisassemble-item-header']}>
          {itemObj.itemCode} {itemObj.itemDescription}
        </div>
        <div className={styles['lwms-itemDisassemble-item-body']}>
          {itemObj.quantity ? (
            <span>
              <span className={styles['lwms-itemDisassemble-item-body-icon']}>
                <Icons type="quantity1" size={16} style={{ cursor: 'pointer' }} />
                数量
              </span>
              <span className={styles['lwms-itemDisassemble-item-body-text']}>
                {itemObj.quantity} {itemObj.uomName}
              </span>
            </span>
          ) : (
            ''
          )}
          {itemObj.quantity ? (
            <span>
              <span className={styles['lwms-itemDisassemble-item-body-icon']}>
                <Icons type="location1" size={16} style={{ cursor: 'pointer' }} />
                库位
              </span>
              <span className={styles['lwms-itemDisassemble-item-body-text']}>
                {itemObj.warehouseName} {itemObj.wmAreaName ? '-' : ''} {itemObj.wmAreaName}{' '}
                {itemObj.wmUnitCode ? '-' : ''} {itemObj.wmUnitCode}
              </span>
            </span>
          ) : (
            ''
          )}
          {itemObj.lotNumber ? (
            <span>
              <span className={styles['lwms-itemDisassemble-item-body-icon']}>
                <Icons type="receipts" size={16} style={{ cursor: 'pointer' }} />
                {itemObj.lotNumber ? '批次' : ''}
              </span>
              <span className={styles['lwms-itemDisassemble-item-body-text']}>
                {itemObj.lotNumber}
              </span>
            </span>
          ) : (
            ''
          )}
          {itemObj.tagCode ? (
            <span>
              <span className={styles['lwms-itemDisassemble-item-body-icon']}>
                <Icons type="receipts" size={16} style={{ cursor: 'pointer' }} />
                {itemObj.tagCode ? '标签' : ''}
              </span>
              <span className={styles['lwms-itemDisassemble-item-body-text']}>
                {itemObj.tagCode}
              </span>
            </span>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  };
  const noItem = () => {
    return <div className={styles['lwms-itemDisassemble-no-item']}>无选中待拆解产品</div>;
  };
  const handSearch = async () => {
    resultTableDS.reset();
    const {
      organizationObj,
      workerObj,
      disassembleQty,
      moStatues,
      bomStatues,
    } = subHeaderDS.current.data;
    const validate = organizationObj.organizationId && workerObj.workerId && disassembleQty;
    if (!validate || (!bomStatues && !moStatues)) {
      notification.warning({
        message: '请完善拆解信息录入',
      });
      return;
    }
    if (!isEmpty(bomStatues)) {
      const params = {
        organizationId: organizationObj.organizationId,
        bomId: bomStatues.bomId || null,
      };
      const res = await getBomComponent(params);
      if (res.length === 0) {
        notification.warning({
          message: '接口返回为空，请换个bom',
        });
      }
      res.forEach((item) => {
        resultTableDS.create(
          {
            organizationObj: subHeaderDS.current.data.organizationObj,
            toItemObj: {
              itemId: item.componentItemId,
              itemCode: item.componentItemCode,
              uomId: item.uomId,
              uom: item.uom,
              description: item.componentItemDescription || '',
            },
            bomUsage: item.bomUsage,
            referenceQuantity: item.bomUsage * subHeaderDS.current.get('disassembleQty'),
            toWarehouseObj: resultTableSearchDS.current.data.toWarehouseObj,
            toWmAreaObj: resultTableSearchDS.current.data.toWmAreaObj,
            // resultTableSearchDS
            detailRecords: {},
          },
          0
        );
      });
    }
    if (!isEmpty(moStatues)) {
      const params = {
        organizationId: organizationObj.organizationId,
        moId: moStatues.moId || null,
        page: -1,
      };
      const res = await getMoComponent(params);
      res.content.forEach((item) => {
        resultTableDS.create(
          {
            organizationObj: subHeaderDS.current.data.organizationObj,
            toItemObj: {
              itemId: item.componentItemId,
              itemCode: item.componentItemCode,
              uomId: item.uomId,
              uom: item.uom,
              description: item.componentDescription || '',
            },
            bomUsage: item.bomUsage,
            referenceQuantity: item.bomUsage * subHeaderDS.current.get('disassembleQty'),
            toWarehouseObj: resultTableSearchDS.current.data.toWarehouseObj,
            toWmAreaObj: resultTableSearchDS.current.data.toWmAreaObj,
            detailRecords: {},
          },
          0
        );
      });
    }
  };
  const handleAddLine = () => {
    resultTableDS.create(
      {
        organizationObj: subHeaderDS.current.data.organizationObj,
        toWarehouseObj: resultTableSearchDS.current.data.toWarehouseObj,
        toWmAreaObj: resultTableSearchDS.current.data.toWmAreaObj,
      },
      0
    );
    resultTableDS.select(resultTableDS.current);
  };
  const handleSumbit = async () => {
    if (!validateSumbitData()) {
      notification.warning({
        message: '请选择有效的拆解结果',
      });
      return;
    }
    const validate = await subHeaderDS.validate();
    if (isEmpty(itemObj) || !validate) {
      notification.warning({
        message: '请完善拆解物料',
      });
      return;
    }
    const resp = await queryItemControlTypeBatch([
      {
        organizationId: itemObj.organizationId,
        warehouseId: itemObj.warehouseId,
        itemId: itemObj.itemId,
        tenantId: getCurrentOrganizationId(),
        groupId: '2021', // 传入的值不做参考
      },
    ]);
    const fromItemControlType = resp[0].itemControlType;
    const disassembleList = [];
    const itemDetailDtoList = [];
    resultTableDS.selected.forEach((ele) => {
      if (ele.get('detailRecords')) {
        const arr = Array.from(ele.get('detailRecords'));
        for (let i = 0; i < arr.length; i++) {
          const params = {
            ...ele.toJSONData(),
            toTagCode: ele.get('toItemControlType') === 'LOT' ? null : arr[i].data.tagCode,
            toLotNumber: ele.get('toItemControlType') === 'LOT' ? arr[i].data.lotNumber : null,
            toItemQty: arr[i].data.quantity,
          };
          itemDetailDtoList.push(params);
        }
      } else {
        const params = {
          ...ele.toJSONData(),
          toItemQty: ele.get('quantity'),
        };
        itemDetailDtoList.push(params);
      }
    });
    const obj = {
      itemDetailDtoList,
      ...itemObj,
      disassembleQty: subHeaderDS.current.get('disassembleQty'),
      itemControlType: fromItemControlType,
      lotNumber: fromItemControlType === 'LOT' ? itemObj.lotNumber : null,
      lotId: fromItemControlType === 'LOT' ? itemObj.lotId : null,
      tagCode: fromItemControlType === 'TAG' ? itemObj.tagCode : null,
      tagId: fromItemControlType === 'TAG' ? itemObj.tagId : null,
    };
    disassembleList.push(obj);
    const params = {
      ...subHeaderDS.current.get('organizationObj'),
      workerId: subHeaderDS.current.get('workerId'),
      worker: subHeaderDS.current.get('workerCode'),
      disassembleList,
    };
    const res = await wmItemDisassemble(params);
    if (getResponse(res)) {
      notification.success();
      resultTableDS.remove(resultTableDS.selected);
    }
  };
  const validateSumbitData = () => {
    let sumbitFlag = true;
    if (resultTableDS.selected.length === 0) {
      return false;
    }
    resultTableDS.selected.forEach((ele) => {
      if (!ele.get('toItemId') || !ele.get('toItemControlType')) {
        sumbitFlag = false;
      }
    });
    return sumbitFlag;
  };
  function tableColumns() {
    return [
      {
        name: 'toItemObj',
        width: 200,
        editor: true,
        renderer: ({ value, record }) => formatItem(record.data, value),
      },
      { name: 'bomUsage', width: 84 },
      { name: 'toWarehouseObj', width: 128, editor: true },
      {
        name: 'toWmAreaObj',
        width: 128,
        editor: (record) => !isEmpty(record.get('toWarehouseObj')),
      },
      {
        name: 'toWmUnitObj',
        width: 84,
        editor: (record) => !isEmpty(record.get('toWarehouseObj')),
      },
      { name: 'referenceQuantity', width: 84 },
      {
        name: 'quantity',
        width: 84,
        editor: (record) => record.get('toItemControlType') === 'QUANTITY',
      },
      // { name: 'toItemControlType', width: 128 },
      { name: 'toItemControlTypeMeaning', width: 128 },
      {
        header: '明细',
        width: 90,
        command: ({ record }) => {
          return [
            <Button
              key="edit"
              color={
                record.get('toItemControlType') === 'TAG' ||
                record.get('toItemControlType') === 'LOT'
                  ? 'primary'
                  : 'gray'
              }
              onClick={() => changeDetail(record.get('toItemControlType'))}
            >
              查看
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }
  function formatItem(data) {
    if (data.toItemObj) {
      const itemInformation = `${data.toItemObj.itemCode ? data.toItemObj.itemCode : ''} ${
        data.toItemObj.description
      }`;
      return itemInformation;
    }
  }

  return (
    <Fragment>
      <Header title="产品拆解">
        <Button
          color="primary"
          onClick={() => {
            handleSumbit();
          }}
        >
          提交
        </Button>
      </Header>
      <Content className={styles['lwms-itemDisassemble-content']}>
        <div className={styles['lwms-itemDisassemble-header']}>
          <Button
            color={!tagDismantling ? 'primary' : 'gray'}
            onClick={() => {
              changeTagDismantling(false);
            }}
          >
            非标签拆解
          </Button>
          <span className={styles['header-button']}>
            <Button
              color={tagDismantling ? 'primary' : 'gray'}
              onClick={() => {
                changeTagDismantling(true);
              }}
            >
              标签拆解
            </Button>
          </span>
          <Button
            color="gray"
            className={!tagDismantling ? styles['blue-text'] : styles['gray-text']}
            onClick={() => {
              chooseItem();
            }}
          >
            选择物料
          </Button>
          <span className={styles['magrin-left']}>
            <TextField placeholder="请输入" onKeyDown={scanTag} disabled={!tagDismantling} />
          </span>
        </div>

        <Form dataSet={subHeaderDS} columns={3} labelLayout="placeholder">
          <Lov name="organizationObj" noCache />
          <Lov name="workerObj" noCache />
          <TextField name="disassembleQty" placeholder="拆解数量" />
          <Lov name="moStatues" noCache />
          <Lov name="bomStatues" noCache />
        </Form>
        {itemObj.itemId ? haveItem() : noItem()}
        <div className={styles['lwms-itemDisassemble-table-header']}>
          <div>
            <Button
              funcType="flat"
              color="primary"
              icon="search"
              onClick={() => {
                handSearch();
              }}
            >
              查询
            </Button>
            <Button
              funcType="flat"
              color="primary"
              icon="add"
              onClick={() => {
                handleAddLine();
              }}
            >
              新增
            </Button>
          </div>
          <div>
            <Lov
              dataSet={resultTableSearchDS}
              name="toWarehouseObj"
              noCache
              placeholder="目标仓库"
            />
            <Lov dataSet={resultTableSearchDS} name="toWmAreaObj" noCache placeholder="目标货位" />
          </div>
        </div>
        <Table dataSet={resultTableDS} border={false} columns={tableColumns()} />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(ItemDisassemble);
