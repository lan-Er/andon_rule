/*
 * @Descripttion: 安灯响应与关闭
 * @Author: yu.na@hand-china.com
 * @Date: 2020-11-12 18:00:22
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Lov, DataSet, DatePicker, Modal, Form, Button } from 'choerodon-ui/pro';
import { Tabs, Icon } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { closeTab } from 'utils/menuTab';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import notification from 'utils/notification';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting, queryLovData } from 'hlos-front/lib/services/api';
import { QueryDS, DetailDS, FilterDS } from '@/stores/andonCloseDS';
import { responseApi, closeApi, createRepairTask } from '@/services/andonCloseService';
import Time from 'hlos-front/lib/components/Time.js';
import logoImg from 'hlos-front/lib/assets/icons/logo.svg';
import carIcon from 'hlos-front/lib/assets/icons/car.svg';
import workerIcon from 'hlos-front/lib/assets/icons/worker-icon.svg';
import itemIcon from 'hlos-front/lib/assets/icons/item-icon.svg';
import orderIcon from 'hlos-front/lib/assets/icons/order-icon.svg';
import filterIcon from 'hlos-front/lib/assets/icons/filter-btn.svg';
import redAndonImg from 'hlos-front/lib/assets/red-andon.png';
import yellowAndonImg from 'hlos-front/lib/assets/yellow-andon.png';
import exitImg from 'hlos-front/lib/assets/icons/out.svg';
import styles from './index.less';

const { TabPane } = Tabs;
const modalKey = Modal.key();

const queryFactory = () => new DataSet(QueryDS());
const detailFactory = () => new DataSet(DetailDS());
const filterFactory = () => new DataSet(FilterDS());

let modal = null;
let createChecklist = null;
const preCode = 'lmes.andonClose';

const Header = () => {
  const timeComponent = useMemo(() => <Time />, []);

  return (
    <div className={styles.header}>
      <div className={styles['header-left']}>
        <span>
          <img src={logoImg} alt="" />
        </span>
        <span>安灯关闭</span>
      </div>
      {timeComponent}
    </div>
  );
};

const AndonClose = (props) => {
  const ds = useDataSet(queryFactory, AndonClose);
  const detailDS = useDataSet(detailFactory);
  const filterDS = useDataSet(filterFactory);

  const [tabKey, setTabKey] = useState('TRIGGERED');
  const [currentLeftPage, changeLeftPage] = useState(0);
  const [totalLeftPage, setTotalLeftPage] = useState(0);
  const [andonList, setAndonList] = useState([]);
  const [currentAndonList, setCurrentAndonList] = useState([]);
  const [isLogin, toggleIsLogin] = useState(false);
  const [workerObj, setWorker] = useState({});
  const [activeItemKey, setActiveItem] = useState('');
  const [detailData, setDetailData] = useState({});
  const [orgId, setOrganizationId] = useState(null);
  const [collectType, setCollectType] = useState(null);

  const leftPageSize = 6;

  const paneTitleArr = useMemo(() => {
    return [
      {
        andonClassName:
          tabKey === 'TRIGGERED'
            ? `待响应(${andonList.length > 99 ? '99+' : andonList.length})`
            : '待响应',
        andonClassCode: 'TRIGGERED',
      },
      {
        andonClassName:
          tabKey === 'RESPONSED'
            ? `待关闭(${andonList.length > 99 ? '99+' : andonList.length})`
            : '待关闭',
        andonClassCode: 'RESPONSED',
      },
    ];
  }, [andonList, tabKey]);

  useEffect(() => {
    async function queryUserSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const { organizationId } = res.content[0];
        ds.queryDataSet.current.set('organizationId', organizationId);
        filterDS.current.set('organizationId', organizationId);
        setOrganizationId(organizationId);
        const workerRes = await queryLovData({ lovCode: 'LMDS.WORKER', defaultFlag: 'Y' });
        if (workerRes && workerRes.content && workerRes.content[0]) {
          setWorker(workerRes.content[0]);
          const dataCollectType = checkDataCollectType(workerRes.content[0].workerType);
          handleSearch(dataCollectType, organizationId);
          setCollectType(dataCollectType);
        }
      }
    }
    queryUserSetting();
  }, [ds]);

  const checkDataCollectType = (type) => {
    switch (type) {
      case 'WM_OPERATOR':
        return 'ITEM';
      case 'REPAIRMAN':
        return 'EQUIPMENT';
      case 'ME_OPERATOR':
        return 'QUALITY';
      default:
        return null;
    }
  };

  const handleSearch = async (dataCollectType, organizationId, currentStatus) => {
    if (!dataCollectType) {
      notification.warning({
        message: '您登陆的账号无权限关闭安灯！',
      });
      setAndonList([]);
      setCurrentAndonList([]);
      changeLeftPage(0);
      setTotalLeftPage(0);
      setActiveItem('');
      setDetailData({});
      return;
    }
    const params = filterDS.current.toJSONData();
    ds.queryParameter = {
      ...params,
      dataCollectType,
      organizationId,
      currentStatus: currentStatus || tabKey,
    };
    const res = await ds.query();
    if (res && Array.isArray(res)) {
      setAndonList(res);
      const _res = res.slice();
      setCurrentAndonList(_res.splice(0, leftPageSize));
      const size = res.length < leftPageSize ? 0 : Math.ceil(res.length / leftPageSize);
      setTotalLeftPage(size);
    }
  };

  const handleTabClick = (key) => {
    setTabKey(key);
  };

  const handleTabChange = (val) => {
    setAndonList([]);
    setCurrentAndonList([]);
    handleSearch(collectType, orgId, val);
    setActiveItem('');
    setDetailData({});
  };

  const handleLeftListChange = (num) => {
    const _andonList = andonList.slice();
    if (
      (currentLeftPage - 1 < 0 && num === -1) ||
      (currentLeftPage + 1 === totalLeftPage && num === 1) ||
      currentLeftPage === totalLeftPage
    ) {
      return;
    }
    setCurrentAndonList(_andonList.splice((currentLeftPage + num) * leftPageSize, leftPageSize));
    changeLeftPage(currentLeftPage + num);
  };

  const handleLogin = async (flag) => {
    if (flag) {
      if (!ds.queryDataSet.current.get('workerId')) return;
      setWorker(ds.queryDataSet.current.get('workerObj'));
      const dataCollectType = checkDataCollectType(
        ds.queryDataSet.current.get('workerObj').workerType
      );
      handleSearch(dataCollectType, orgId);
      setCollectType(dataCollectType);
    }
    toggleIsLogin(!isLogin);
  };

  const handleExit = () => {
    props.history.push('/workplace');
    closeTab('/pub/lmes/andon-close');
  };

  const handleFilterModalShow = () => {
    modal = Modal.open({
      key: modalKey,
      closable: true,
      footer: null,
      className: styles['andon-filter-modal-wrapper'],
      title: intl.get(`hzero.c7nUI.Table.filterTitle`).d('筛选'),
      children: (
        <div>
          <Form dataSet={filterDS} labelLayout="placeholder">
            <Lov placeholder="工位" name="workcellObj" noCache />
            <Lov placeholder="生产线" name="prodLineObj" noCache />
            <DatePicker name="startTriggeredDate" placeholder="触发日期" />
            <DatePicker name="startResponsedDate" placeholder="响应日期" />
          </Form>
          <div className={styles.buttons}>
            <Button onClick={handleReset}>{intl.get('hzero.common.status.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleQuery}>
              {intl.get('hzero.common.button.sure').d('确定')}
            </Button>
          </div>
        </div>
      ),
    });
  };

  const handleReset = () => {
    filterDS.current.reset();
  };

  const handleQuery = () => {
    handleSearch(collectType, orgId);
    modal.close();
  };

  const hourRender = (i) => {
    let diff = i.responseHour;
    if (tabKey === 'TRIGGERED') {
      const currentTime = new Date().getTime();
      const dealTime = new Date(i.triggeredTime).getTime();
      diff = (currentTime - dealTime) / 1000 / 60 / 60;
    }
    if (diff < 1) {
      return '<1h';
    } else {
      return `${Math.floor(diff)}h`;
    }
  };

  const handleItemClick = async (i) => {
    setActiveItem(i.andonId);
    detailDS.queryParameter = {
      andonId: i.andonId,
      andonJournalId: i.andonJournalId,
    };
    const res = await detailDS.query();
    if (getResponse(res)) {
      setDetailData(res);
    }
  };

  const handleTriggerConfirm = async (i) => {
    const _andonList = andonList.slice();
    const idx = _andonList.findIndex((rec) => i.andonId === rec.andonId);
    _andonList.splice(idx, 1, {
      ...i,
      showMask: !i.showMask,
    });
    setAndonList(andonList);
    setCurrentAndonList(_andonList.splice(currentLeftPage * leftPageSize, leftPageSize));
  };

  const handleTrigger = async (i) => {
    if (tabKey === 'TRIGGERED') {
      if (
        detailData.processRule !== undefined &&
        detailData.processRule.indexOf('CREATE_REPAIR_TASK') !== -1
      ) {
        createChecklist = Modal.open({
          key: 'createChecklist',
          className: styles['andon-filter-modal-wrapper-new'],
          border: false,
          drawerBorder: false,
          children: '是否创建维修任务？',
          onOk: CreateChecklist,
          onCancel: cancelCreateChecklist,
        });
      } else {
        Trigger();
      }
    } else {
      Trigger();
    }
  };
  // 取消
  function cancelCreateChecklist() {
    createChecklist.close();
    Trigger();
  }
  // 创建维修任务
  async function CreateChecklist() {
    const resOrg = await userSetting({ defaultFlag: 'Y' });
    if (resOrg && resOrg.content && resOrg.content[0]) {
      const { organizationId, organizationCode } = resOrg.content[0];
      const params = {
        organizationId,
        organizationCode,
        resourceId: detailData.andonRelId,
        resourceCode: detailData.andonRelCode,
        taskTypeId: '',
        taskTypeCode: 'EQUIPMENT_REPAIR_TASK',
        TaskStatus: detailData.released,
        workerId: detailData.triggeredBy,
        worker: detailData.triggeredByCode,
        exceptionId: detailData.exceptionId,
        exceptionCode: detailData.exceptionCode,
        pictures: detailData.pictures,
        remark: detailData.remark,
      };
      const res = await createRepairTask(params);
      if (getResponse(res)) {
        if (res.failed) {
          notification.error({
            message: res.message,
          });
        } else {
          notification.success({
            message: '创建成功',
          });
        }
        Trigger();
      }
    }
  }

  async function Trigger() {
    let res = {};
    let params = {
      andonJournalId: detailData.andonJournalId,
    };
    if (tabKey === 'TRIGGERED') {
      params = {
        ...params,
        responsedBy: workerObj.workerId,
        responsedTime: moment().format(DEFAULT_DATE_FORMAT),
      };
      res = await responseApi(params);
    } else {
      params = {
        ...params,
        closedBy: workerObj.workerId,
        closedTime: moment().format(DEFAULT_DATE_FORMAT),
      };
      res = await closeApi(params);
    }
    if (getResponse(res)) {
      handleSearch(collectType, orgId);
      setActiveItem('');
      setDetailData({});
    }
    handleTriggerConfirm(detailData);
  }

  if (isLogin) {
    return (
      <div className={styles['lmes-andon-close']}>
        <Header />
        <div className={styles['login-content']}>
          <p className={styles['login-title']}>登录</p>
          <Lov
            dataSet={ds.queryDataSet}
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
    <div className={styles['lmes-andon-close']}>
      <Header />
      <div className={styles.content}>
        <Tabs
          activeKey={tabKey}
          onTabClick={(key) => handleTabClick(key)}
          onChange={handleTabChange}
        >
          {paneTitleArr.map((item) => {
            return (
              <TabPane tab={item.andonClassName} key={item.andonClassCode}>
                <div className={styles['pane-content']}>
                  <div className={styles['pane-left']}>
                    <div className={styles['pane-item-wrapper']}>
                      {currentAndonList.map((i) => (
                        <div
                          className={`${styles['pane-item']} ${
                            activeItemKey === i.andonId && styles['active-item']
                          }`}
                          key={i.andonId}
                          onClick={() => handleItemClick(i)}
                        >
                          <img
                            src={tabKey === 'TRIGGERED' ? redAndonImg : yellowAndonImg}
                            alt=""
                            onClick={(e) => handleTriggerConfirm(i, e)}
                          />
                          <div className={styles['item-content']}>
                            <p className={styles['item-title']}>{i.andonName}</p>
                            <div className={styles['item-workcell']}>
                              <p>{i.workcellName || i.prodLineName}</p>
                              <p>{i.triggeredTime}</p>
                            </div>
                            <div>
                              <p className={styles['item-worker']}>{i.workerName}</p>
                              <p className={styles['item-time']}>{hourRender(i)}</p>
                            </div>
                            {i.showMask && (
                              <div className={styles['item-mask']}>
                                是否{tabKey === 'TRIGGERED' ? '响应' : '关闭'}
                                <div>
                                  <Button onClick={(e) => handleTriggerConfirm(i, e)}>
                                    {intl.get('hzero.common.button.cancel').d('取消')}
                                  </Button>
                                  <Button color="primary" onClick={() => handleTrigger(i)}>
                                    {intl.get('hzero.common.button.sure').d('确定')}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
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
                          currentLeftPage + 1 === totalLeftPage || currentLeftPage === totalLeftPage
                            ? { color: 'rgba(255, 255, 255, 0.4)' }
                            : { color: '#fff' }
                        }
                      />
                    </div>
                  </div>
                  {!isEmpty(detailData) && (
                    <div className={styles['pane-right']}>
                      <p className={styles['andon-header']}>
                        {detailData.andonName}
                        <span>{detailData.currentStatusMeaning}</span>
                      </p>
                      <div className={styles['andon-resource']}>
                        <p>
                          <img src={carIcon} alt="" />
                          {detailData.workcellName || detailData.prodLineName || '-'}
                        </p>
                        <p>
                          <img src={itemIcon} alt="" />
                          {detailData.andonRelType === 'ITEM'
                            ? detailData.itemDescription || '-'
                            : detailData.resourceName || '-'}
                        </p>
                      </div>
                      <div className={styles['andon-document']}>
                        <p>
                          <img src={orderIcon} alt="" />
                          {detailData.sourceDocNum || '-'}
                        </p>
                        <p>{detailData.quantity || '-'}</p>
                      </div>
                      <div className={styles['andon-progress']}>
                        <div className={styles['progress-item']}>
                          <div
                            className={`${styles.status} ${
                              tabKey === 'TRIGGERED' && styles.current
                            }`}
                          >
                            <span className={styles.circle} />
                            触发
                          </div>
                          <p>
                            {detailData.triggeredByName} {detailData.triggeredTime}
                          </p>
                        </div>
                        <div className={styles.stepline} />
                        <div className={styles['progress-item']}>
                          <div
                            className={`${styles.status} ${
                              tabKey === 'RESPONSED' && styles.current
                            }`}
                          >
                            <span className={`${styles.circle} ${styles.yellow}`} />
                            响应
                          </div>
                          <p>
                            {detailData.responsedByName} {detailData.responsedTime}
                          </p>
                        </div>
                        <div className={styles.stepline} />
                        <div className={styles['progress-item']}>
                          <div className={styles.status}>
                            <span className={`${styles.circle} ${styles.green}`} />
                            关闭
                          </div>
                        </div>
                      </div>
                      <div className={styles['andon-exception']}>
                        <p className={styles.title}>异常信息</p>
                        <div className={styles.detail}>{detailData.remark}</div>
                      </div>
                      {detailData.picture && (
                        <div className={styles.pictures}>
                          <img src={detailData.picture} alt="" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabPane>
            );
          })}
        </Tabs>
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
          <div className={styles['btn-wrapper']}>
            <div className={styles.btn} onClick={handleFilterModalShow}>
              <img src={filterIcon} alt="" />
              筛选
            </div>
          </div>
          <div className={styles['btn-wrapper']}>
            <div className={styles.btn} onClick={handleExit}>
              <img src={exitImg} alt="" />
              退出
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default formatterCollections({ code: [`${preCode}`] })(AndonClose);
