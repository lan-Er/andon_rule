/*
 * @Descripttion: 安灯触发
 * @Author: yu.na@hand-china.com
 * @Date: 2020-11-11 11:00:22
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Lov, Modal, TextField, NumberField, Form, Button, DataSet } from 'choerodon-ui/pro';
import { Tabs, Icon } from 'choerodon-ui';
import moment from 'moment';
import { getResponse } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { closeTab } from 'utils/menuTab';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting, queryLovData } from 'hlos-front/lib/services/api';
import Time from 'hlos-front/lib/components/Time.js';
import logoImg from 'hlos-front/lib/assets/icons/logo.svg';
import carIcon from 'hlos-front/lib/assets/icons/car.svg';
import workerIcon from 'hlos-front/lib/assets/icons/worker-icon.svg';
import exitImg from 'hlos-front/lib/assets/icons/out.svg';
import redAndonImg from 'hlos-front/lib/assets/red-andon.png';
import yellowAndonImg from 'hlos-front/lib/assets/yellow-andon.png';
import greenAndonImg from 'hlos-front/lib/assets/green-andon.png';
import { QueryDS } from '@/stores/andonTriggerDS';
import {
  queryAndonTriggerClass,
  andonTrigger,
  queryAndonTrigger,
} from '@/services/andonTriggerService';
import styles from './index.less';

const { TabPane } = Tabs;
const modalKey = Modal.key();
const preCode = 'lmes.andonTrigger';

const queryFactory = () => new DataSet(QueryDS());

const Header = () => {
  const timeComponent = useMemo(() => <Time />, []);

  return (
    <div className={styles.header}>
      <div className={styles['header-left']}>
        <span>
          <img src={logoImg} alt="" />
        </span>
        <span>安灯触发</span>
      </div>
      {timeComponent}
    </div>
  );
};

const AndonTrigger = (props) => {
  const queryDS = useDataSet(queryFactory, AndonTrigger);
  const [tabKey, setTabKey] = useState('');
  const [paneTitleArr, setPaneTitleArr] = useState([]);
  const [triggerList, setTriggerList] = useState([]);
  const [currentTriggerList, setCurrentTriggerList] = useState([]);
  const [rightTriggerList, setRightTriggerList] = useState([]);
  const [currentRightTriggerList, setCurrentRightTriggerList] = useState([]);
  const [isLogin, toggleIsLogin] = useState(false);
  const [workerObj, setWorker] = useState({});
  const [currentLeftPage, changeLeftPage] = useState(0);
  const [currentRightPage, changeRightPage] = useState(0);
  const [totalLeftPage, setTotalLeftPage] = useState(0);
  const [totalRightPage, setTotalRightPage] = useState(0);
  const [defaultClass, setDefaultClass] = useState(null);

  const leftPageSize = 8;
  const rightPageSize = 4;
  let modal = null;

  useEffect(() => {
    async function queryUserSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const {
          prodLineId,
          prodLineName,
          workcellName,
          workcellId,
          organizationId,
        } = res.content[0];
        queryDS.queryDataSet.current.set('resourceObj', {
          resourceId: workcellId || prodLineId,
          resourceName: workcellName || prodLineName,
        });
        queryDS.queryDataSet.current.set('organizationId', organizationId);
        queryDS.current.set('organizationId', organizationId);
        setDefaultClass(workcellId ? 'WKC' : 'PROD_LINE');
        queryTriggerClass(
          workcellId || prodLineId,
          workcellId ? 'WKC' : 'PROD_LINE',
          organizationId
        );
        const workerRes = await queryLovData({ lovCode: 'LMDS.WORKER', defaultFlag: 'Y' });
        if (workerRes && workerRes.content && workerRes.content[0]) {
          setWorker(workerRes.content[0]);
        }
      }
    }
    queryUserSetting();
  }, [queryDS]);

  const queryTriggerClass = async (id, type, organizationId) => {
    let params = {};
    const _type = type || defaultClass;
    if (_type === 'WKC') {
      params = {
        workcellId: id,
      };
    } else if (_type === 'PROD_LINE') {
      params = {
        prodLineId: id,
      };
    }
    const res = await queryAndonTriggerClass(params);
    if (res && Array.isArray(res)) {
      setPaneTitleArr(res);
      if (res[0] && res[0].andonClassCode) {
        if (!tabKey) {
          setTabKey(res[0].andonClassCode);
        }
        queryDS.queryParameter = {
          ...params,
          andonClassCode: !tabKey ? res[0].andonClassCode : tabKey,
          closed: true,
        };
        const data = await queryDS.query();
        if (data && Array.isArray(data)) {
          setTriggerList(data);
          const _data = data.slice();
          setCurrentTriggerList(_data.splice(0, leftPageSize));
          const size = data.length < leftPageSize ? 0 : Math.ceil(data.length / leftPageSize);
          setTotalLeftPage(size);
        }

        const rightData = await queryAndonTrigger({
          ...params,
          organizationId,
          andonClassCode: res[0].andonClassCode,
          closed: false,
        });
        if (rightData && Array.isArray(rightData)) {
          setRightTriggerList(rightData);
          const _rightData = rightData.slice();
          setCurrentRightTriggerList(_rightData.splice(0, rightPageSize));
          const size =
            rightData.length < rightPageSize ? 0 : Math.ceil(rightData.length / rightPageSize);
          setTotalRightPage(size);
        }
      }
    }
  };

  const handleTabClick = (key) => {
    setTabKey(key);
  };

  const handleTabChange = async (val) => {
    const { resourceClass, resourceId } = queryDS.queryDataSet.current.toJSONData();
    const rClass = resourceClass || defaultClass;
    let params = {
      andonClassCode: val,
      closed: true,
    };
    if (rClass === 'WKC') {
      params = {
        ...params,
        workcellId: resourceId,
      };
      queryDS.queryParameter = {
        ...params,
      };
    } else {
      params = {
        ...params,
        prodLineId: resourceId,
      };
    }

    queryDS.queryParameter = params;
    const data = await queryDS.query();
    if (data && Array.isArray(data)) {
      setTriggerList(data);
      const _data = data.slice();
      setCurrentTriggerList(_data.splice(0, leftPageSize));
      setTotalLeftPage(data.length < leftPageSize ? 0 : Math.ceil(data.length / leftPageSize));
    }

    const rightData = await queryAndonTrigger({
      ...params,
      organizationId: queryDS.queryDataSet.current.get('organizationId'),
      andonClassCode: val,
      closed: false,
    });
    if (rightData && Array.isArray(rightData)) {
      setRightTriggerList(rightData);
      const _rightData = rightData.slice();
      setCurrentRightTriggerList(_rightData.splice(0, rightPageSize));
      const size =
        rightData.length < rightPageSize ? 0 : Math.ceil(rightData.length / rightPageSize);
      setTotalRightPage(size);
    }
  };

  const imgRender = (status) => {
    if (status === 'TRIGGERED') {
      return redAndonImg;
    } else {
      return yellowAndonImg;
    }
  };

  const handleLogin = async (flag) => {
    if (flag) {
      if (!queryDS.queryDataSet.current.get('workerId')) return;
      setWorker(queryDS.queryDataSet.current.get('workerObj'));
    }
    toggleIsLogin(!isLogin);
  };

  const handleExit = () => {
    props.history.push('/workplace');
    closeTab('/pub/lmes/andon-trigger');
  };

  const handleReset = () => {
    const { organizationId } = queryDS.queryDataSet.current.data;
    queryDS.current.reset();
    queryDS.current.set('organizationId', organizationId);
  };

  const handleSave = async (record) => {
    const {
      exceptionGroupId,
      exceptionGroupCode,
      exceptionId,
      exceptionCode,
      moId,
      moNum,
      quantity,
      remark,
      organizationId,
    } = queryDS.current.toJSONData();
    const { resourceId, resourceClass } = queryDS.queryDataSet.current.toJSONData();
    // if (
    //   (record.dataCollectType === 'EQUIPMENT' || record.dataCollectType === 'QUALITY') &&
    //   (!exceptionGroupId || !exceptionId)
    // ) {
    //   return;
    // }
    const { andonId, andonCode, andonName, uomId, uom } = record;
    const res = await andonTrigger({
      andonId,
      andonCode,
      andonName,
      triggeredBy: workerObj.workerId,
      triggeredTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
      exceptionGroupId,
      exceptionGroupCode,
      exceptionId,
      exceptionCode,
      sourceDocId: moId,
      sourceDocNum: moNum,
      quantity,
      uomId,
      uom,
      remark,
    });
    if (getResponse(res)) {
      notification.success();
      modal.close();
      queryTriggerClass(resourceId, resourceClass, organizationId);
    }
  };

  const handleEdit = (i) => {
    queryDS.current.set('organizationId', queryDS.queryDataSet.current.get('organizationId'));
    modal = Modal.open({
      key: modalKey,
      closable: true,
      footer: null,
      className: styles['andon-info-modal-wrapper'],
      title: intl.get(`${preCode}.view.title.andonInfo`).d('安灯信息'),
      children: (
        <div>
          <Form dataSet={queryDS} labelLayout="placeholder">
            {i.dataCollectType === 'ITEM' && <Lov placeholder="MO" name="moNumObj" noCache />}
            {i.dataCollectType === 'EQUIPMENT' && (
              <TextField placeholder="设备" name="resourceName" disabled />
            )}
            {(i.dataCollectType === 'EQUIPMENT' || i.dataCollectType === 'QUALITY') && (
              <Lov placeholder="异常组" name="exceptionGroupObj" noCache />
            )}
            {(i.dataCollectType === 'EQUIPMENT' || i.dataCollectType === 'QUALITY') && (
              <Lov placeholder="异常" name="exceptionObj" noCache />
            )}
            {i.dataCollectType === 'ITEM' && (
              <TextField placeholder="物料" name="itemDescription" disabled />
            )}
            {i.dataCollectType === 'ITEM' && (
              <NumberField
                name="quantity"
                placeholder="数量"
                addonAfter={`${i.uomName || i.uom || ''}`}
              />
            )}
            {/* {i.dataCollectType === 'ITEM' && <TextField placeholder="单位" name="uom" disabled />} */}
            {i.dataCollectType === 'COUNT' && (
              <TextField placeholder="累计次数" name="pressedTimes" disabled />
            )}
            <TextField name="remark" placeholder="备注信息" />
          </Form>
          <div className={styles.buttons}>
            <Button onClick={handleReset}>{intl.get('hzero.common.status.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSave(i)}>
              {intl.get('hzero.common.button.sure').d('确定')}
            </Button>
          </div>
        </div>
      ),
    });
    if (i.dataCollectType === 'EQUIPMENT' && !i.resourceName) {
      notification.warning({
        message: '该安灯未关联任何设备',
      });
    } else if (i.dataCollectType === 'ITEM' && !(i.itemId || i.itemDescription)) {
      notification.warning({
        message: '该安灯未关联任何物料',
      });
    }
  };

  const handleResourceChange = (record) => {
    queryTriggerClass(
      record.resourceId,
      record.resourceClass,
      queryDS.queryDataSet.current.get('organizationId')
    );
  };

  const handleLeftListChange = (num) => {
    const _triggerList = triggerList.slice();
    if (
      (currentLeftPage - 1 < 0 && num === -1) ||
      (currentLeftPage + 1 === totalLeftPage && num === 1) ||
      currentLeftPage === totalLeftPage
    ) {
      return;
    }
    setCurrentTriggerList(
      _triggerList.splice((currentLeftPage + num) * leftPageSize, leftPageSize)
    );
    changeLeftPage(currentLeftPage + num);
  };
  const handleRightListChange = (num) => {
    const _triggerList = rightTriggerList.slice();
    if (
      (currentRightPage - 1 < 0 && num === -1) ||
      (currentRightPage + 1 === totalRightPage && num === 1) ||
      currentRightPage === totalRightPage
    ) {
      return;
    }
    setCurrentRightTriggerList(
      _triggerList.splice((currentRightPage + num) * rightPageSize, rightPageSize)
    );
    changeRightPage(currentRightPage + num);
  };

  if (isLogin) {
    return (
      <div className={styles['andon-trigger']}>
        <Header />
        <div className={styles['login-content']}>
          <p className={styles['login-title']}>登录</p>
          <Lov
            dataSet={queryDS.queryDataSet}
            name="workerObj"
            prefix={<img src={workerIcon} alt="" />}
            placeholder="选择操作工"
            noCache
          />
          <div className={styles['login-btn']}>
            <div className={styles['exit-btn']} onClick={handleExit}>
              退出
            </div>
            <div className={styles['login-btn']} onClick={() => handleLogin(true)}>
              登录
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['andon-trigger']}>
      <Header />
      <div className={styles.content}>
        <div className={styles.query}>
          <Lov
            dataSet={queryDS.queryDataSet}
            name="resourceObj"
            prefix={<img src={carIcon} alt="" />}
            onChange={handleResourceChange}
            clearButton={null}
            noCache
          />
        </div>
        <div className={styles.list}>
          <div>
            {paneTitleArr.length && (
              <Tabs
                activeKey={tabKey}
                onTabClick={(key) => handleTabClick(key)}
                onChange={handleTabChange}
              >
                {paneTitleArr.map((item) => {
                  return (
                    <TabPane tab={item.andonClassName} key={item.andonClassCode}>
                      <div className={styles['pane-content']}>
                        {currentTriggerList.map((i) => {
                          return (
                            <div className={styles['pane-item']} key={i.andonId}>
                              <img src={greenAndonImg} alt="" onClick={() => handleEdit(i)} />
                              <p>{i.andonName}</p>
                              <p>{i.andonRelTypeMeaning}</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className={styles.pagination}>
                        <Icon
                          type="navigate_before"
                          onClick={() => handleLeftListChange(-1)}
                          style={
                            currentLeftPage === 0 || currentLeftPage === totalLeftPage
                              ? { color: 'rgba(255, 255, 255, 0.4)' }
                              : { color: '#fff' }
                          }
                        />
                        <Icon
                          type="navigate_next"
                          onClick={() => handleLeftListChange(1)}
                          style={
                            currentLeftPage + 1 === totalLeftPage ||
                            currentLeftPage === totalLeftPage
                              ? { color: 'rgba(255, 255, 255, 0.4)' }
                              : { color: '#fff' }
                          }
                        />
                      </div>
                    </TabPane>
                  );
                })}
              </Tabs>
            )}
          </div>
          <div className={styles['open-card']}>
            <div className={styles['open-card-title']}>未关闭({rightTriggerList.length})</div>
            <div className={styles['open-card-content']}>
              <div className={styles.main}>
                {currentRightTriggerList.map((i) => {
                  return (
                    <div className={styles.item} key={i.andonId}>
                      <img src={imgRender(i.currentStatus)} alt="" />
                      <div>
                        <p>{i.andonName}</p>
                        <p>{i.andonRelTypeMeaning}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.pagination}>
                <Icon
                  type="navigate_before"
                  onClick={() => handleRightListChange(-1)}
                  style={
                    currentRightPage === 0 || currentRightPage === totalRightPage
                      ? { color: 'rgba(255, 255, 255, 0.4)' }
                      : { color: '#fff' }
                  }
                />
                <Icon
                  type="navigate_next"
                  onClick={() => handleRightListChange(1)}
                  style={
                    currentRightPage + 1 === totalRightPage || currentRightPage === totalRightPage
                      ? { color: 'rgba(255, 255, 255, 0.4)' }
                      : { color: '#fff' }
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.worker}>
          <div className={styles.circle}>
            {workerObj.fileUrl ? (
              <img src={workerObj.fileUrl} alt="" />
            ) : (
              workerObj.workerName && workerObj.workerName.substr(0, 1)
            )}
          </div>
          <div>
            <p className={styles.name}>{workerObj.workerName}</p>
            <p className={styles.type}>{workerObj.workerTypeMeaning}</p>
          </div>
          <div className={styles.toggle} onClick={() => handleLogin(false)}>
            切换
          </div>
        </div>
        <div className={styles.exit}>
          <div className={styles.btn} onClick={handleExit}>
            <img src={exitImg} alt="" />
            退出
          </div>
        </div>
      </div>
    </div>
  );
};

export default formatterCollections({ code: [`${preCode}`] })(AndonTrigger);
