/**
 * @Description: 线下拆板
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-23 11:11:08
 * @LastEditors: leying.yan
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { isEmpty, cloneDeep } from 'lodash';
import notification from 'utils/notification';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { Modal, DataSet, Lov } from 'choerodon-ui/pro';
import { closeTab } from 'utils/menuTab';
import { getResponse } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import { LoginDS, QueryDS } from '@/stores/offlineSplitDS';
import {
  getTagThing,
  queryBomComponents,
  wmTagDisassemble,
  getItemBom,
} from '@/services/offlineSplitService';
import SubHeader from './SubHeader/index';
import SelectArea from './SelectArea/index';
import MainContent from './MainContent/index';
import Footer from './Footer/index';
import LoginModal from './LoginModal/index';
import styles from './index.less';

let modal = null;

const loginFactory = () => new DataSet(LoginDS());
const queryFactory = () => new DataSet(QueryDS());

const offlineSplit = ({ history }) => {
  const loginDS = useDataSet(loginFactory, offlineSplit);
  const queryDS = useDataSet(queryFactory);
  const [tagId, setTagId] = useState('');
  const [splitQuantity, setSplitQuantity] = useState(0);
  const [snData, setSnData] = useState({});
  const [loginData, setLoginData] = useState({});
  const [bomSplitList, setBomSplitList] = useState([]);
  const [currentSnCode, setCurrentSnCode] = useState('');
  useEffect(() => {
    async function init() {
      const resArr = await userSetting({ defaultFlag: 'Y' });
      if (resArr) {
        if (resArr && resArr.content && resArr.content[0]) {
          const {
            workerId,
            workerCode,
            workerName,
            fileUrl,
            organizationId,
            organizationCode,
            organizationName,
            warehouseId,
            warehouseCode,
            warehouseName,
            wmAreaId,
            wmAreaCode,
            wmAreaName,
          } = resArr.content[0];
          loginDS.current.set('workerObj', {
            workerId,
            workerCode,
            workerName,
            fileUrl,
          });
          loginDS.current.set('organizationObj', {
            organizationId,
            organizationCode,
            organizationName,
          });
          if (warehouseId) {
            loginDS.current.set('warehouseObj', {
              warehouseId,
              warehouseCode,
              warehouseName,
            });
          }
          if (wmAreaId) {
            loginDS.current.set('wmAreaObj', {
              wmAreaId,
              wmAreaCode,
              wmAreaName,
            });
          }
          queryDS.current.set('organizationObj', {
            organizationId,
            organizationCode,
            organizationName,
          });
        }
      }
    }
    init();
    handleWorkerChange();
  }, []);

  // 点击切换按钮
  function handleWorkerChange() {
    modal = Modal.open({
      key: 'lmes-offline-split-login-modal',
      title: '登录',
      className: styles['lmes-offline-split-login-modal'],
      children: (
        <LoginModal
          onLogin={handleLogin}
          ds={loginDS}
          onExit={handleExit}
          onWarehouseChange={handleLoginWarehouseChange}
        />
      ),
      footer: null,
    });
  }

  /**
   * 切换操作员登录
   * @returns
   */
  async function handleLogin() {
    const validateValue = await loginDS.validate(false, false);
    if (!validateValue) return;
    queryDS.current.reset();
    setBomSplitList([]);
    setSnData('');
    setLoginData(loginDS.current.toJSONData());
    queryDS.current.set('organizationId', loginDS.current.get('organizationId'));
    queryDS.current.set('organizationCode', loginDS.current.get('organizationCode'));
    modal.close();
  }

  function handleExit() {
    history.push('/workplace');
    closeTab('/pub/lmes/offline-split');
  }

  /**
   *提交
   */
  async function handleSubmit() {
    // 判定仓库是否已选
    let validateFlag = true;
    for (let i = 0; i < bomSplitList.length; i++) {
      const item = bomSplitList[i];
      if (!item.warehouseId && item.splitLineList.length > 0) {
        notification.error({
          message: `物料${item.componentItemDescription}未选择仓库`,
        });
        validateFlag = false;
        break;
      }
      // if (!item.wmAreaId) {
      //   notification.error({
      //     message: `物料${item.componentItemDescription}未选择货位`,
      //   });
      //   validateFlag = false;
      //   break;
      // }
    }
    if (!validateFlag) {
      return;
    }
    const completeFlag = bomSplitList.every((i) => i.completedFlag);
    if (!completeFlag) {
      Modal.confirm({
        title: '拆板未完成，是否提交',
      }).then((button) => {
        if (button === 'ok') {
          submit();
        }
      });
    } else {
      submit();
    }
  }

  async function submit() {
    const { organizationId, organizationCode, workerId, workerName } = loginDS.current.toJSONData();
    const baseParams = [
      {
        organizationId,
        organizationCode,
        workerId,
        worker: workerName,
        tagId,
        itemId: snData.itemId,
        disassembleQty: splitQuantity,
        executedTime: moment().format(DEFAULT_DATETIME_FORMAT),
        wmTagDisassembleLineDTOList: [],
      },
    ];
    const wmTagDisassembleLineDTOList = [];
    bomSplitList.map((bom) => {
      return wmTagDisassembleLineDTOList.push(
        ...bom.splitLineList.map((line) => {
          return {
            toTagCode: line.toTagCode,
            toItemId: bom.componentItemId,
            toItemCode: bom.componentItemCode,
            toUomId: bom.uomId,
            toUom: bom.uom,
            toItemQty: line.toItemQty,
            toWarehouseId: bom.warehouseId,
            toWarehouseCode: bom.warehouseCode,
            toWmAreaId: bom.wmAreaId,
            toWmAreaCode: bom.wmAreaCode,
          };
        })
      );
    });
    baseParams[0].wmTagDisassembleLineDTOList = wmTagDisassembleLineDTOList;
    const res = await wmTagDisassemble(baseParams);
    if (getResponse(res)) {
      notification.success();
      queryDS.current.reset();
      setBomSplitList([]);
      setSnData('');
    }
  }

  // SN号变化
  async function handleSnChange(e) {
    if (e.keyCode === 13 && e.target.value) {
      const val = e.target.value;
      // 调用API getTagThing 带出标签信息及标签实物 TAG12301
      const tagThingRes = await getTagThing({
        wmsOrganizationId: loginDS.current.get('organizationId'),
        tagCode: val,
      });
      if (tagThingRes && tagThingRes.content && tagThingRes.content.length > 0) {
        setTagId(tagThingRes.content[0].tagId);
        setSplitQuantity(tagThingRes.content[0].quantity);
        queryDS.current.set('itemId', tagThingRes.content[0].itemId);
        queryDS.current.set('itemCode', tagThingRes.content[0].itemCode);
        queryDS.current.set('itemDescription', tagThingRes.content[0].itemDescription);
        setSnData({
          itemId: tagThingRes.content[0].itemId,
          itemCode: tagThingRes.content[0].itemCode,
          itemDescription: tagThingRes.content[0].itemDescription,
          warehouseId: tagThingRes.content[0].warehouseId,
          warehouseCode: tagThingRes.content[0].warehouseCode,
          warehouseName: tagThingRes.content[0].warehouseName,
          wmAreaId: tagThingRes.content[0].wmAreaId,
          wmAreaCode: tagThingRes.content[0].wmAreaCode,
          wmAreaName: tagThingRes.content[0].wmAreaName,
        });
        // 再调取API getItemBom获取对应拆板BOM
        const itemBomRes = await getItemBom([
          {
            organizationId: loginDS.current.get('organizationId'),
            itemId: tagThingRes.content[0].itemId,
            bomType: 'SPLIT',
          },
        ]);
        if (getResponse(itemBomRes) && itemBomRes[0]) {
          queryDS.current.set('bomObj', itemBomRes[0]);
          // 通过bomId获取拆分物料
          const bomRes = await queryBomComponents({ bomId: itemBomRes[0].bomId, enableFlag: 1 });
          if (getResponse(bomRes)) {
            bomRes.content.map((item) => {
              return Object.assign(item, {
                splitLineList: [],
                title: item.componentItemCode,
                quantity: 1,
                completedQuantity: 0,
                warehouseId: tagThingRes.content[0].warehouseId,
                warehouseCode: tagThingRes.content[0].warehouseCode,
                warehouseName: tagThingRes.content[0].warehouseName,
                wmAreaId: tagThingRes.content[0].wmAreaId,
                wmAreaCode: tagThingRes.content[0].wmAreaCode,
                wmAreaName: tagThingRes.content[0].wmAreaName,
              });
            });
            setBomSplitList(bomRes.content);
          }
        }
      }
    }
  }

  function handleChildSnInput(value) {
    setCurrentSnCode(value);
  }

  /**
   * 子sn号变化
   *
   * @param {*} e 输入框事件
   * @param {*} paneIndex 当前对应的拆分目标index
   */
  function handleChildSnChange(e, paneIndex) {
    if (e.keyCode === 13 && e.target.value) {
      const val = e.target.value;
      const tempList = bomSplitList.slice();
      const currentPane = tempList[paneIndex];
      // 判断该子sn号是否已录入
      let duplicateFlag = false;
      tempList.forEach((item) => {
        const duplicateList = item.splitLineList.filter((v) => v.toTagCode === val);
        if (duplicateList.length > 0) duplicateFlag = true;
      });
      if (duplicateFlag) {
        notification.error({
          message: '该子SN号已录入！',
        });
        return;
      }
      const tempQuantity =
        currentPane.splitLineList.reduce((pre, cur) => {
          return cur.toItemQty + pre;
        }, 0) + currentPane.quantity;
      const qty = (currentPane.bomUsage || 0) * (splitQuantity || 0);
      // 先判定是否已完成拆分进度
      if (tempQuantity === qty) {
        currentPane.completedFlag = true;
        e.target.value = '';
        // e.target.disabled = true;
      } else if (tempQuantity > qty) {
        notification.error({
          message: '超过可拆分数量，请重新输入！',
        });
        return;
      }
      currentPane.splitLineList.push({ toTagCode: val, toItemQty: currentPane.quantity });
      currentPane.completedQuantity = tempQuantity;
      e.target.value = '';
      setCurrentSnCode('');
      setBomSplitList(cloneDeep(tempList));
    }
  }

  // 数量变化
  function handleQtyChange(e, paneIndex) {
    const tempList = bomSplitList.slice();
    tempList[paneIndex].quantity = e;
    setBomSplitList(cloneDeep(tempList));
  }
  // 单行数量变化
  function handleSplitQtyChange(val, paneIndex, lineIndex) {
    const tempList = cloneDeep(bomSplitList);
    const currentPane = tempList[paneIndex];
    const oldQty = currentPane.splitLineList[lineIndex].toItemQty;
    currentPane.splitLineList[lineIndex].toItemQty = val;
    const tempQuantity = currentPane.splitLineList.reduce((pre, cur) => {
      return cur.toItemQty + pre;
    }, 0);
    const qty = (currentPane.bomUsage || 0) * (splitQuantity || 0);
    if (tempQuantity === qty) {
      currentPane.completedFlag = true;
    } else if (tempQuantity > qty) {
      notification.error({
        message: '超过可拆分数量，请重新输入！',
      });
      currentPane.splitLineList[lineIndex].toItemQty = oldQty;
      currentPane.completedQuantity = tempQuantity - val + oldQty;
      setBomSplitList(cloneDeep(tempList));
      return;
    }
    currentPane.completedQuantity = tempQuantity;
    setBomSplitList(cloneDeep(tempList));
  }

  /**
   * 切换bom
   */
  async function handleBomChange(value) {
    if (value) {
      const bomRes = await queryBomComponents({ bomId: value.bomId, enableFlag: 1 });
      if (getResponse(bomRes)) {
        bomRes.content.map((item) => {
          return Object.assign(item, {
            splitLineList: [],
            title: item.componentItemCode,
            quantity: 1,
            completedQuantity: 0,
            warehouseId: snData.warehouseId,
            warehouseCode: snData.warehouseCode,
            warehouseName: snData.warehouseName,
            wmAreaId: snData.wmAreaId,
            wmAreaCode: snData.wmAreaCode,
            wmAreaName: snData.wmAreaName,
          });
        });
        setBomSplitList(bomRes.content);
      }
    }
  }

  /**
   * 登录页面仓库变化，清空货位
   *
   */
  function handleLoginWarehouseChange() {
    loginDS.current.set('wmAreaObj', '');
  }

  /**
   * 拆解物料的仓库变化
   * @param {*} value 变化的值
   * @param {*} index 当前变化的子物料index
   */
  function handleWarehouseChange(value, index) {
    const _bomSplitList = bomSplitList.slice();
    _bomSplitList[index] = {
      ..._bomSplitList[index],
      warehouseId: value ? value.warehouseId : '',
      warehouseCode: value ? value.warehouseCode : '',
      warehouseName: value ? value.warehouseName : '',
    };
    setBomSplitList(cloneDeep(_bomSplitList));
  }

  /**
   * 拆解物料的货位变化
   * @param {*} value 变化的值
   * @param {*} index 当前变化的子物料index
   */
  function handleWmAreaChange(value, index) {
    const _bomSplitList = bomSplitList.slice();
    _bomSplitList[index] = {
      ..._bomSplitList[index],
      wmAreaId: value ? value.wmAreaId : '',
      wmAreaCode: value ? value.wmAreaCode : '',
      wmAreaName: value ? value.wmAreaName : '',
    };
    setBomSplitList(cloneDeep(_bomSplitList));
  }
  /**
   * 新增拆分物料
   */
  function handleItemAdd() {
    Modal.open({
      key: 'lmes-offline-split-item-modal',
      title: '创建',
      className: styles['lmes-offline-split-item-modal'],
      children: <Lov dataSet={queryDS} name="addItemObj" placeholder="请选择物料" />,
      onOk: handleItemModalOk,
    });
  }

  /**
   * 删除拆分行
   */
  function handleSplitLineDelete(paneIndex, lineIndex) {
    const _bomSplitList = bomSplitList.slice();
    _bomSplitList[paneIndex].splitLineList.splice(lineIndex, 1);
    // 重新计算已拆解数量
    const tempQuantity = _bomSplitList[paneIndex].splitLineList.reduce((pre, cur) => {
      return cur.toItemQty + pre;
    }, 0);
    _bomSplitList[paneIndex].completedQuantity = tempQuantity;
    _bomSplitList[paneIndex].completedFlag = false;
    setBomSplitList(cloneDeep(_bomSplitList));
  }

  function handleItemModalOk() {
    if (queryDS.current.get('addItemId')) {
      const {
        addItemId,
        addItemCode,
        addItemDescription,
        uom,
        uomId,
      } = queryDS.current.toJSONData();
      const tempList = bomSplitList.slice();
      tempList.push({
        componentItemId: addItemId,
        componentItemCode: addItemCode,
        componentItemDescription: addItemDescription,
        splitLineList: [],
        title: addItemCode,
        quantity: 1,
        completedQuantity: 0,
        uom,
        uomId,
      });
      setBomSplitList(cloneDeep(tempList));
    }
  }

  return (
    <div className={styles['lmes-offline-split']}>
      <CommonHeader title="线下拆板" />
      {!isEmpty(loginData) && <SubHeader data={loginData} />}
      <div className={styles.content}>
        <SelectArea
          ds={queryDS}
          snData={snData}
          onSnChange={handleSnChange}
          onBomChange={handleBomChange}
        />
        <div className={styles.main}>
          {bomSplitList.length > 0 ? (
            <MainContent
              ds={queryDS}
              splitQuantity={splitQuantity}
              bomSplitList={bomSplitList}
              currentSnCode={currentSnCode}
              onQtyChange={handleQtyChange}
              onChildSnChange={handleChildSnChange}
              onSplitQtyChange={handleSplitQtyChange}
              onItemAdd={handleItemAdd}
              onWmAreaChange={handleWmAreaChange}
              onWarehouseChange={handleWarehouseChange}
              onDelete={handleSplitLineDelete}
              onChildSnInput={handleChildSnInput}
            />
          ) : (
            ''
          )}
        </div>
      </div>
      <Footer onWorkerChange={handleWorkerChange} onExit={handleExit} onSubmit={handleSubmit} />
    </div>
  );
};

export default connect()(
  formatterCollections({
    code: ['lmes.common'],
  })(offlineSplit)
);
