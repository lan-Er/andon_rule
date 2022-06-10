/**
 * @Description: MO退料--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-25 15:11:08
 * @LastEditors: yu.na
 */

import React, { useMemo, useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { DataSet, Modal } from 'choerodon-ui/pro';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import Loading from 'hlos-front/lib/components/Loading';
import { userSetting } from 'hlos-front/lib/services/api';
import defaultAvatarImg from 'hlos-front/lib/assets/img-default-avator.png';
import intl from 'utils/intl';
import { closeTab } from 'utils/menuTab';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { ListDS, HeaderDS } from '@/stores/moReturnMaterialDS';
import { queryReturnMoItemDetail, moReturnSubmit } from '@/services/moReturnMaterialService';
import ListItem from './ListItem';
import Footer from './Footer';
import Header from './Header';
import ReturnModal from './ReturnModal';
import styles from './index.less';

const preCode = 'lmes.moReturnMaterial';
let modal = null;
const modalKey = Modal.key();

const MoReturnMaterial = ({ history, returnList, dispatch }) => {
  const listDS = useMemo(() => new DataSet(ListDS()), []);
  const headerDS = useMemo(() => new DataSet(HeaderDS()), []);

  const [currentAvator, setCurrentAvator] = useState(defaultAvatarImg);
  const [changeFlag, setChangeFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allchecked, setAllChecked] = useState(false);

  useEffect(() => {
    async function queryDefaultData() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const {
          meOuId,
          organizationId,
          organizationCode,
          workerId,
          workerCode,
          workerName,
          fileUrl,
          warehouseId,
          warehouseCode,
          warehouseName,
        } = res.content[0];
        listDS.queryDataSet.current.set('meOuId', meOuId);
        headerDS.current.set('organizationId', organizationId);
        headerDS.current.set('organizationCode', organizationCode);
        headerDS.current.set('workerObj', {
          workerId,
          workerCode,
          workerName,
        });
        headerDS.current.set('warehouseObj', {
          warehouseId,
          warehouseCode,
          warehouseName,
        });
        setCurrentAvator(fileUrl);
      }
    }
    queryDefaultData();
  }, []);

  /**
   * @param {Object/Boolean} value - lov选中的记录/checkbox val
   * @param {Object} rec - icon 当前修改行记录
   * @param {String} type - 改变字段类型 仓库 or 货位 or checkbox
   */
  function handleLineChange(value, rec, type) {
    const idx = returnList.findIndex((i) => i.moComponentId === rec.moComponentId);
    const cloneList = [...returnList];
    if (idx >= 0) {
      let params = { ...rec };
      if (type === 'check') {
        params = {
          ...params,
          checked: value,
        };
      } else if (type === 'warehouse' || type === 'wmArea') {
        params = {
          ...params,
          [`${type}Id`]: value ? value[`${type}Id`] : null,
          [`${type}Code`]: value ? value[`${type}Code`] : null,
          [`${type}Name`]: value ? value[`${type}Name`] : null,
        };
      }
      cloneList.splice(idx, 1, params);
      if (type === 'check') {
        setAllChecked(cloneList.every((i) => i.checked));
      }
      dispatch({
        type: 'moReturnMaterial/updateState',
        payload: {
          returnList: cloneList,
        },
      });
    }
  }

  function handleHeaderWhWmChange(value = {}, type) {
    const cloneList = [...returnList];
    setChangeFlag(!changeFlag);
    if (type === 'warehouse') {
      cloneList.forEach((i) => {
        const _i = i;
        _i.warehouseId = value?.warehouseId;
        _i.warehouseCode = value?.warehouseCode;
        _i.warehouseName = value?.warehouseName;
      });
    } else if (type === 'wmArea') {
      cloneList.forEach((i) => {
        const _i = i;
        _i.wmAreaId = value?.wmAreaId;
        _i.wmAreaCode = value?.wmAreaCode;
        _i.wmAreaName = value?.wmAreaName;
      });
    }
    dispatch({
      type: 'moReturnMaterial/updateState',
      payload: {
        returnList: cloneList,
      },
    });
  }

  function handleMoChange(rec) {
    if (rec) {
      handleSearch();
    }
  }

  async function handleSearch() {
    setLoading(true);
    const res = await listDS.query(); // MO202103250011
    setLoading(false);
    if (Array.isArray(res)) {
      res.forEach((i) => {
        const _i = i;
        _i.warehouseId = headerDS.current.get('warehouseId');
        _i.warehouseCode = headerDS.current.get('warehouseCode');
        _i.warehouseName = headerDS.current.get('warehouseName');
      });
      dispatch({
        type: 'moReturnMaterial/updateState',
        payload: {
          returnList: res,
        },
      });
    }
  }

  async function handleItemClick(rec) {
    const cloneReturnList = [...returnList];
    const idx = cloneReturnList.findIndex((i) => i.moComponentId === rec.moComponentId);
    if (!rec.itemReturnLineList) {
      const res = await queryReturnMoItemDetail({
        moId: rec.moId,
        itemId: rec.componentItemId,
        moComponentId: rec.moComponentId,
      });
      const itemReturnLineList = [];
      Object.keys(res).forEach((i) => {
        const executeQtyArr = res[i].map((e) => e.executeQty);
        const executeQty = executeQtyArr.reduce((pre, cur) => pre + cur);
        itemReturnLineList.push({
          lotNumber: i,
          executeQty,
          tagList: res[i],
        });
      });
      if (idx >= 0) {
        cloneReturnList.splice(idx, 1, {
          ...rec,
          itemReturnLineList,
        });
        dispatch({
          type: 'moReturnMaterial/updateState',
          payload: {
            returnList: cloneReturnList,
          },
        });
      }
    }
    modal = Modal.open({
      key: modalKey,
      title: intl.get(`${preCode}.view.title.modal`).d('工单退料'),
      className: styles['mo-return-material-return-modal'],
      children: (
        <ReturnModal
          idx={idx}
          itemControlType={rec.itemControlType}
          componentDescription={rec.componentDescription}
          componentItemCode={rec.componentItemCode}
          onCancel={handleCancel}
        />
      ),
      footer: null,
      closable: true,
    });
  }

  function handleCancel() {
    modal.close();
  }

  function handleExit() {
    history.push('/workplace');
    closeTab('/pub/lmes/mo-return-material');
  }

  function handleReset() {
    listDS.queryDataSet.current.set('moObj', null);
    headerDS.current.set('workerObj', null);
    headerDS.current.set('warehouseObj', null);
    headerDS.current.set('wmAreaObj', null);
    setCurrentAvator(defaultAvatarImg);
    dispatch({
      type: 'moReturnMaterial/updateState',
      payload: {
        returnList: [],
      },
    });
  }

  function handleSelectAll() {
    const cloneList = [...returnList];
    cloneList.forEach((i) => {
      const _i = i;
      _i.checked = !allchecked;
    });
    dispatch({
      type: 'moReturnMaterial/updateState',
      payload: {
        returnList: cloneList,
      },
    });
    setAllChecked(!allchecked);
  }

  function handleQtyChange(val, rec) {
    const cloneReturnList = [...returnList];
    const idx = returnList.findIndex((i) => i.moComponentId === rec.moComponentId);
    if (idx >= 0) {
      cloneReturnList.splice(idx, 1, {
        ...rec,
        returnedOkQty: val,
        checked: val > 0,
        itemReturnLineList: [
          {
            returnedOkQty: val,
          },
        ],
      });
    }
    dispatch({
      type: 'moReturnMaterial/updateState',
      payload: {
        returnList: cloneReturnList,
      },
    });
  }

  async function handleSubmit() {
    const componentItemLineList = [];
    let itemReturnLineList = [];
    returnList.forEach((i) => {
      if (i.itemReturnLineList && i.checked) {
        itemReturnLineList = [];
        const lineData = {
          componentItemId: i.componentItemId,
          componentItemCode: i.componentItemCode,
          uomId: i.uomId,
          uom: i.uom,
          moComponentId: i.moComponentId,
          itemControlType: i.itemControlType,
          warehouseId: i.warehouseId,
          warehouseCode: i.warehouseCode,
          wmAreaId: i.wmAreaId,
          wmAreaCode: i.wmAreaCode,
          checked: i.checked,
        };
        i.itemReturnLineList.forEach((j) => {
          if (i.itemControlType === 'TAG' || i.itemControlType === 'LOT') {
            j.tagList.forEach((k) => {
              if (i.itemControlType === 'TAG' && k.returnedOkQty) {
                itemReturnLineList = itemReturnLineList.concat({
                  returnedOkQty: k.returnedOkQty,
                  tagId: k.tagId,
                  tagCode: k.tagCode,
                });
              } else if (i.itemControlType === 'LOT' && j.returnedOkQty) {
                itemReturnLineList.push({
                  returnedOkQty: j.returnedOkQty,
                  lotId: k.lotId,
                  lotNumber: k.lotNumber,
                });
              }
            });
          } else if (i.itemControlType === 'QUANTITY') {
            itemReturnLineList.push({
              returnedOkQty: j.returnedOkQty,
            });
          }
        });
        componentItemLineList.push({
          ...lineData,
          itemReturnLineList,
        });
      }
    });
    const params = {
      organizationId: headerDS.current.get('organizationId'),
      organizationCode: headerDS.current.get('organizationCode'),
      moId: listDS.queryDataSet.current.get('moId'),
      moNum: listDS.queryDataSet.current.get('moNum'),
      returnedTime: moment().format(DEFAULT_DATETIME_FORMAT),
      workerId: headerDS.current.get('workerId'),
      worker: headerDS.current.get('worker'),
      // workerGroupId: headerDS.current.get('workerGroupId'), // 用户设置没有默认的班组
      // workerGroud: headerDS.current.get('workerGroud'),
      componentItemLineList,
    };
    setLoading(true);
    const res = await moReturnSubmit(params);
    setLoading(false);
    if (getResponse(res)) {
      notification.success();
      handleSearch();
    }
  }

  return (
    <div className={styles['lmes-mo-return-material']}>
      <CommonHeader title={intl.get(`${preCode}.view.title.index`).d('MO退料')} />
      <Header
        currentAvator={currentAvator}
        listDS={listDS}
        headerDS={headerDS}
        onMoChange={handleMoChange}
        onHeaderWhWmChange={handleHeaderWhWmChange}
      />
      <div className={styles['mo-return-material-list']}>
        {returnList.map((i) => {
          return (
            <ListItem
              key={i.moComponentId}
              data={i}
              changeFlag={changeFlag}
              onLineChange={handleLineChange}
              onItemClick={handleItemClick}
              onQtyChange={handleQtyChange}
            />
          );
        })}
      </div>
      <Footer
        onExit={handleExit}
        onReset={handleReset}
        onSelectAll={handleSelectAll}
        onSubmit={handleSubmit}
      />
      {loading && <Loading />}
    </div>
  );
};

export default connect(({ moReturnMaterial }) => ({
  returnList: moReturnMaterial?.returnList || [],
}))(MoReturnMaterial);
