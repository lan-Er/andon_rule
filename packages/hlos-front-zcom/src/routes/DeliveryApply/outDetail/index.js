/**
 * @Description: 发货预约详情（外协物料）
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-06-16 09:47:25
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Form,
  TextField,
  Select,
  Lov,
  DatePicker,
  Table,
  TextArea,
  Modal,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { findStrIndex } from '@/utils/renderer';
import LogModal from '@/components/LogModal/index';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { DeliveryApplyOutHeadDS, DeliveryApplyOutLineDS } from '../store/outDS';
import { releaseDeliveryApply } from '@/services/deliveryApplyService';
import styles from './index.less';

const intlPrefix = 'zcom.deliveryApply';
const deliveryApplyOutHeadDS = () => new DataSet(DeliveryApplyOutHeadDS());
const deliveryApplyOutLineDS = (roleType) => new DataSet(DeliveryApplyOutLineDS(roleType));

function ZcomDeliveryApplyOutDetail({ match, location, dispatch, history }) {
  const roleType = getRoleType(); // 当前角色类型 客户customer/供应商supplier
  const { state } = location;
  const stateObj = state || {};
  const {
    params: { type, deliveryApplyId },
  } = match;
  const HeadDS = useDataSet(deliveryApplyOutHeadDS, ZcomDeliveryApplyOutDetail);
  const LineDS = useDataSet(() => deliveryApplyOutLineDS(roleType));

  const [canEdit, setCanEdit] = useState(false); // 是否可编辑
  const [isReview, setIsReview] = useState(false); // 是否是审核视角
  const [canReview, setCanReview] = useState(false); // 是否可审核
  const [canDelivey, setCanDelivery] = useState(false); // 是否可创建发货单
  const [deliveryShow, setDeliveryShow] = useState(true);
  const [receiveShow, setReceiveShow] = useState(true);
  const [basicShow, setBasicShow] = useState(true);

  // 通过截取路由地址的内容获取当前角色类型
  function getRoleType() {
    const { pathname } = location;
    const pIndex = findStrIndex(pathname, '/', 2);
    const nIndex = findStrIndex(pathname, '/', 3);
    return pathname.substring(pIndex + 1, nIndex);
  }

  useEffect(() => {
    HeadDS.setQueryParameter('deliveryApplyId', null);
    LineDS.setQueryParameter('deliveryApplyId', null);
    HeadDS.data = [];
    HeadDS.create();
    LineDS.data = [];
    LineDS.clearCachedSelected();
    if (type === 'create') {
      HeadDS.setQueryParameter('idList', stateObj.ids);
      LineDS.setQueryParameter('idList', stateObj.ids);
    } else {
      HeadDS.setQueryParameter('deliveryApplyId', deliveryApplyId);
      LineDS.setQueryParameter('deliveryApplyId', deliveryApplyId);
      setIsReview(stateObj.isReview);
    }
    handleSearch();
  }, [deliveryApplyId]);

  async function handleSearch() {
    await HeadDS.query();
    const { deliveryApplyStatus } = HeadDS.current.toData();
    setCanEdit(
      type === 'create' ||
        ['NEW', 'SUPPLIER_DECLINED', 'CUSTOMER_DECLINED'].includes(deliveryApplyStatus)
    );
    setCanReview(['SUPPLIER_CONFIRMING', 'CUSTOMER_CONFIRMING'].includes(deliveryApplyStatus));
    setCanDelivery(
      roleType === 'customer' &&
        ['APPOINTMENT_CONFIRMED', 'DELIVERING'].includes(deliveryApplyStatus)
    );
    LineDS.query();
  }

  function lineValidate() {
    const arr = [];
    LineDS.data.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  }

  function handleSubmit(arr) {
    return new Promise((resolve) => {
      dispatch({
        type: 'deliveryApply/releaseDeliveryApply',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const pathName = `/zcom/delivery-apply/${roleType}`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  async function handleOperate(operationType) {
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      const validateLineResult = await Promise.all(lineValidate());
      if (!validateHead || validateLineResult.findIndex((v) => !v) !== -1) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(false);
        return false;
      }
      const headData = HeadDS.current.toData();
      const deliveryApplyLineList = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.toData(), {
          deliverySourceType: 'PO_OUTSOURCE',
        });
        return obj;
      });
      let statusStr;
      if (operationType === 'submit') {
        statusStr = roleType === 'customer' ? 'SUPPLIER_CONFIRMING' : 'CUSTOMER_CONFIRMING';
      }
      const payLoadObj = {
        ...headData,
        deliveryView: 'TO_SUPPLIER',
        deliveryApplyStatus: statusStr || headData.deliveryApplyStatus,
        receivingFlag: 0,
        initiator: roleType === 'supplier' ? 'SUPPLIER' : 'CUSTOMER',
        deliveryApplyLineList,
        operationOpinion: operationType === 'submit' ? '' : headData.operationOpinion,
      };
      if (operationType === 'submit') {
        releaseDeliveryApply([
          {
            ...payLoadObj,
            checkFlag: 1,
          },
        ]).then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '操作成功',
            });
            const pathName = `/zcom/delivery-apply/${roleType}`;
            history.push(pathName);
          } else if (res.failed && res.code === 'hzmc.warn.check.delivery.num') {
            const arr = res.message.split('\n');
            Modal.confirm({
              children: (
                <div>
                  {arr.map((item) => {
                    return <div>{item}</div>;
                  })}
                </div>
              ),
              onOk: () => {
                handleSubmit([
                  {
                    ...payLoadObj,
                    checkFlag: 0,
                  },
                ]);
              },
            });
          } else {
            notification.error({
              message: res.message,
            });
            resolve(false);
            return false;
          }
          resolve();
        });
      } else {
        const actionType = deliveryApplyId
          ? 'deliveryApply/updateDeliveryApply'
          : 'deliveryApply/saveDeliveryApply';
        dispatch({
          type: actionType,
          payload: payLoadObj,
        }).then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '操作成功',
            });
            if (operationType === 'save') {
              if (!deliveryApplyId) {
                const pathName = `/zcom/delivery-apply/${roleType}/out/detail/${res.deliveryApplyId}`;
                history.push(pathName);
              } else {
                handleSearch();
              }
            }
          }
          resolve();
        });
      }
    });
  }

  async function handleVerify(action) {
    return new Promise((resolve) => {
      if (action === 'declined') {
        if (!HeadDS.current.get('operationOpinion')) {
          notification.warning({ message: '请先填写审批意见' });
          resolve(false);
          return false;
        }
      }
      let applyStatus;
      if (action === 'confirmed') {
        applyStatus = 'APPOINTMENT_CONFIRMED';
      } else {
        applyStatus = roleType === 'customer' ? 'CUSTOMER_DECLINED' : 'SUPPLIER_DECLINED';
      }
      dispatch({
        type: 'deliveryApply/verifyDeliveryApply',
        payload: [
          {
            ...HeadDS.current.toData(),
            deliveryView: 'TO_SUPPLIER',
            deliveryApplyStatus: applyStatus,
            receivingFlag: 0,
          },
        ],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const pathName = `/zcom/delivery-apply/${roleType}`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  async function handleCancel() {
    return new Promise((resolve) => {
      const { deliveryApplyStatus, relatedDeliveryOrderId } = HeadDS.current.toData();
      if (deliveryApplyStatus === 'CANCELLED') {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.errStatus`)
            .d('已取消的发货申请单不可再进行取消操作'),
        });
        resolve(false);
        return false;
      }
      if (relatedDeliveryOrderId) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.errStatus`)
            .d('该发货申请单已关联发货单，不可进行取消操作'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'deliveryApply/cancelDeliveryApply',
        payload: [
          {
            ...HeadDS.current.toData(),
            deliveryApplyStatus: 'CANCELLED',
          },
        ],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const pathName = `/zcom/delivery-apply/${roleType}`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  async function handleCreateDelivery() {
    return new Promise((resolve) => {
      dispatch({
        type: 'deliveryApply/createByDeliveryApply',
        payload: { deliveryApplyId },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          handleSearch();
          history.push({
            pathname: `/zcom/supply-item-ship/detail/${res.deliveryOrderId}`,
          });
        }
        resolve();
      });
    });
  }

  function handleClear() {
    HeadDS.current.reset();
    HeadDS.current.set('deliveryAddress', null);
    HeadDS.current.set('consignerName', null);
    HeadDS.current.set('consignerPhone', null);
    HeadDS.current.set('deliveryWarehouse', null);
    HeadDS.current.set('receivingAddress', null);
    HeadDS.current.set('consigneeName', null);
    HeadDS.current.set('consigneePhone', null);
    HeadDS.current.set('receivingWarehouse', null);
    const arr = LineDS.data.map((v) => {
      return {
        ...v.toData(),
        customerDeliveryQty: null,
        supplierDeliveryQty: null,
      };
    });
    LineDS.data = arr;
  }

  function handleCopeLine(record) {
    LineDS.create(
      {
        ...record.toData(),
        deliveryApplyLineId: null,
        deliveryApplyLineNum: null,
      },
      record.index + 1
    );
  }

  function handleDeleteLine() {
    return new Promise((resolve) => {
      if (!LineDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      const arr = LineDS.selected.map((v) => {
        return {
          ...v.toData(),
        };
      });
      dispatch({
        type: 'deliveryApply/deleteLine',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          LineDS.query();
        }
        resolve();
      });
    });
  }

  const columnsArr = [
    { name: 'deliveryApplyLineNum', width: 60, lock: true },
    {
      name: 'customerItem',
      width: 150,
      renderer: ({ record }) => (
        <>
          <div>{record.get('customerItemCode')}</div>
          <div>{record.get('customerItemDesc')}</div>
        </>
      ),
      lock: true,
    },
    {
      name: 'supplierItem',
      width: 150,
      minWidth: 120,
      renderer: ({ record }) => (
        <>
          <div>{record.get('supplierItemCode')}</div>
          <div>{record.get('supplierItemDesc')}</div>
        </>
      ),
      lock: true,
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('customerItemId')}
            itemDesc={record.get('customerItemDesc')}
            disabled
          />
        ) : null;
      },
    },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 80 },
    {
      name: 'supplierPromiseDate',
      width: 100,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
  ];

  function getColumns() {
    const arr = columnsArr.concat([]);
    if (roleType === 'customer') {
      arr.splice(
        4,
        0,
        { name: 'customerUomName', width: 60 },
        { name: 'customerDemandQty', width: 80 },
        {
          name: 'customerShippableQty',
          width: 120,
          minWidth: 120,
          renderer: ({ value }) => {
            return <span>{Number(value) < 0 ? 0 : value}</span>;
          },
        }
      );
      arr.push({
        name: 'customerTotalDeliveryQty',
        width: 130,
        minWidth: 130,
      });
      arr.push({
        name: 'customerUnshippedQty',
        width: 130,
        minWidth: 130,
        renderer: ({ value }) => {
          return <span>{Number(value) < 0 ? 0 : value}</span>;
        },
      });
      arr.push({
        name: 'deliveryApplyLineStatusMeaning',
        width: 100,
      });
      arr.push({
        name: 'customerDeliveryQty',
        width: 120,
        editor: canEdit && !isReview,
        align: 'left',
        lock: 'right',
      });
    }
    if (roleType === 'supplier') {
      arr.splice(
        4,
        0,
        { name: 'supplierUomName', width: 60 },
        { name: 'supplierDemandQty', width: 80 },
        {
          name: 'supplierShippableQty',
          width: 150,
          minWidth: 130,
          renderer: ({ value }) => {
            return <span>{Number(value) < 0 ? 0 : value}</span>;
          },
        }
      );
      arr.push({
        name: 'supplierTotalDeliveryQty',
        width: 150,
        minWidth: 130,
      });
      arr.push({
        name: 'supplierUnshippedQty',
        width: 150,
        minWidth: 130,
        renderer: ({ value }) => {
          return <span>{Number(value) < 0 ? 0 : value}</span>;
        },
      });
      arr.push({
        name: 'deliveryApplyLineStatusMeaning',
        width: 100,
      });
      arr.push({
        name: 'supplierDeliveryQty',
        width: 150,
        editor: canEdit && !isReview,
        align: 'left',
        lock: 'right',
      });
    }
    if (canEdit && !isReview) {
      arr.push({
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        command: ({ record }) => {
          return [
            <Button
              key="copy"
              color="primary"
              funcType="flat"
              onClick={() => handleCopeLine(record)}
            >
              拆行
            </Button>,
          ];
        },
        lock: 'right',
      });
    }
    return arr;
  }

  function getTitle() {
    if (type === 'create') {
      return intl.get(`${intlPrefix}.view.title.deliveryApplyCreate`).d('新建发货预约');
    } else {
      if (isReview) {
        return intl.get(`${intlPrefix}.view.title.deliveryApplyReview`).d('发货预约审核');
      }
      return intl.get(`${intlPrefix}.view.title.deliveryApplyDetail`).d('发货预约详情');
    }
  }

  return (
    <Fragment>
      <Header title={getTitle()} backPath={`/zcom/delivery-apply/${roleType}`}>
        {canDelivey && <Button onClick={handleCreateDelivery}>创建发货</Button>}
        {canEdit && !isReview && (
          <>
            <Button color="primary" onClick={() => handleOperate('submit')}>
              保存并提交
            </Button>
            <Button color="primary" onClick={() => handleOperate('save')}>
              保存
            </Button>
            {type === 'create' && <Button onClick={handleClear}>清空</Button>}
          </>
        )}
        {canReview && isReview && (
          <>
            <Button color="primary" onClick={() => handleVerify('confirmed')}>
              通过
            </Button>
            <Button onClick={() => handleVerify('declined')}>驳回</Button>
          </>
        )}
        {deliveryApplyId && !isReview && <Button onClick={handleCancel}>取消</Button>}
        {deliveryApplyId && (
          <LogModal id={deliveryApplyId}>
            <Button>查看日志</Button>
          </LogModal>
        )}
      </Header>
      <Content className={styles['zcom-delivery-apply-out-detail-content']}>
        {type !== 'create' && (
          <Form dataSet={HeadDS} labelLayout="vertical" columns={3}>
            <TextArea
              name="operationOpinion"
              key="operationOpinion"
              colSpan={2}
              rows={8}
              disabled={!(canReview && isReview)}
            />
          </Form>
        )}
        <div className={styles['zcom-delivery-apply-info']}>
          <span>预约发货信息</span>
          <span
            className={styles['info-toggle']}
            onClick={() => {
              setDeliveryShow(!deliveryShow);
            }}
          >
            {deliveryShow ? '收起' : '展开'}
          </span>
        </div>
        {deliveryShow && (
          <Form dataSet={HeadDS} columns={4}>
            <TextField name="deliveryApplyNum" key="deliveryApplyNum" disabled />
            <Select name="deliveryApplyType" key="deliveryApplyType" disabled />
            <Select name="deliveryApplyStatus" key="deliveryApplyStatus" disabled />
            <TextField name="customerName" key="customerName" disabled />
            <Lov
              name="customerInventoryOrgObj"
              key="customerInventoryOrgObj"
              disabled={!canEdit || isReview || roleType === 'supplier'}
            />
            <TextField
              name="deliveryAddress"
              key="deliveryAddress"
              disabled={!canEdit || isReview}
            />
            <TextField name="consignerName" key="consignerName" disabled={!canEdit || isReview} />
            <TextField name="consignerPhone" key="consignerPhone" disabled={!canEdit || isReview} />
            <TextField
              name="deliveryWarehouse"
              key="deliveryWarehouse"
              disabled={!canEdit || isReview}
            />
            <DatePicker
              name="deliveryApplyDate"
              key="deliveryApplyDate"
              disabled={!canEdit || isReview}
            />
            <DatePicker name="arrivalDate" key="arrivalDate" disabled={!canEdit || isReview} />
          </Form>
        )}
        <div className={styles['zcom-delivery-apply-info']}>
          <span>收货信息</span>
          <span
            className={styles['info-toggle']}
            onClick={() => {
              setReceiveShow(!receiveShow);
            }}
          >
            {receiveShow ? '收起' : '展开'}
          </span>
        </div>
        {receiveShow && (
          <Form dataSet={HeadDS} columns={4}>
            <TextField name="supplierName" key="supplierName" disabled />
            <Lov
              name="supplierInventoryOrgObj"
              key="supplierInventoryOrgObj"
              disabled={!canEdit || isReview || roleType === 'customer'}
            />
            <TextField
              name="receivingAddress"
              key="receivingAddress"
              disabled={
                !((canEdit && !isReview) || (isReview && canReview && roleType === 'customer'))
              }
            />
            <TextField
              name="consigneeName"
              key="consigneeName"
              disabled={
                !((canEdit && !isReview) || (isReview && canReview && roleType === 'customer'))
              }
            />
            <TextField
              name="consigneePhone"
              key="consigneePhone"
              disabled={
                !((canEdit && !isReview) || (isReview && canReview && roleType === 'customer'))
              }
            />
            <TextField
              name="receivingWarehouse"
              key="receivingWarehouse"
              disabled={
                !((canEdit && !isReview) || (isReview && canReview && roleType === 'customer'))
              }
            />
          </Form>
        )}
        <div className={styles['zcom-delivery-apply-info']}>
          <span>基础信息</span>
          <span
            className={styles['info-toggle']}
            onClick={() => {
              setBasicShow(!basicShow);
            }}
          >
            {basicShow ? '收起' : '展开'}
          </span>
        </div>
        {basicShow && (
          <>
            <div className={styles['line-delete-btn']}>
              {canEdit && !isReview && <Button onClick={handleDeleteLine}>删除</Button>}
            </div>
            <Table
              dataSet={LineDS}
              columns={getColumns()}
              columnResizable="true"
              rowHeight="auto"
            />
          </>
        )}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomDeliveryApplyOutDetail);
