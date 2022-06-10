/*
 * @module: 设备监控看板底部组件
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-18 15:37:25
 * @LastEditTime: 2021-03-02 14:31:32
 * @copyright: Copyright (c) 2020,Hand
 */
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import React, { useMemo, useEffect, useState, useRef } from 'react';

import Icons from 'components/Icons';

import style from './index.module.less';
import debounce from './component/utils';
import MyLoading from './component/MyLoading';
import MyEcharts from './component/MyEcharts';
import breakdownImg from './assets/images/error.png';
import MyMarquee from './component/MyMarquee';

let timers = null;
function MyFooter({
  equipmentMonitoringModel: { equipmentList, quryParams, footerLeftLoading },
  dispatch,
}) {
  const [activeEquipment, setActiveEquipment] = useState({});
  const [details, setDetails] = useState([]);
  const myFooterNode = useRef(null);
  const myListNode = useRef(null);
  const leftContent = useRef(null);
  const equipmentLeft = useRef(null);
  const [rightLoading, setRightLoading] = useState(false);
  const leftLoading = useMemo(() => footerLeftLoading, [footerLeftLoading]);
  const myList = useMemo(() => {
    const { lineDtoList } = equipmentList;
    if (lineDtoList && lineDtoList.length > 0) {
      return lineDtoList;
    } else {
      return [];
    }
  }, [equipmentList]);
  const myQueryparams = useMemo(() => {
    return quryParams;
  }, [quryParams]);
  useEffect(() => {
    return () => {
      clearInterval(timers);
    };
  }, []);
  useEffect(() => {
    if (myList && myList.length > 0 && equipmentLeft) {
      const equipmentCurrent = equipmentLeft.current;
      equipmentCurrent.style.transition = '0s';
      equipmentCurrent.style.transform = `translateY(0px)`;
      setActiveEquipment(myList && { ...myList[0], index: 0 });
      handleQueryItem(myList && myList[0], 0);
    } else {
      setActiveEquipment({});
      setDetails([]);
    }
  }, [myList, equipmentLeft]);

  useEffect(() => {
    if (myListNode && myFooterNode && !rightLoading) {
      const listCurrent = myListNode.current;
      const footerCurrent = myFooterNode.current;
      const listHeight = listCurrent.scrollHeight;
      const footerHeight = footerCurrent.offsetHeight;
      if (listHeight > footerHeight) {
        listCurrent.style.transition = '0s';
        listCurrent.style.transform = `translateY(0px)`;
        scrollLeft(listHeight, footerHeight, listCurrent);
      } else {
        clearInterval(timers);
        timers = setInterval(() => {
          listCurrent.style.transition = '0s';
          listCurrent.style.transform = `translateY(0px)`;
          changeShowDetails();
        }, 6000);
      }
    }
  }, [myListNode, myFooterNode, rightLoading, details]);

  /**
   * @description: 切换展示详情
   * @param {*}
   * @return {*}
   */
  function changeShowDetails() {
    const activeEquipmentIndex = activeEquipment && activeEquipment.index;
    const myListLen = myList.length || 0;
    if (activeEquipmentIndex + 1 < myListLen) {
      if ((activeEquipmentIndex + 1) % 6 === 0 && activeEquipmentIndex !== 0) {
        const leftCurrent = leftContent.current;
        const equipmentCurrent = equipmentLeft.current;
        const leftHeight = leftCurrent && leftCurrent.offsetHeight;
        // const equipmentLeftHeight = equipmentCurrent && equipmentCurrent.scrollHeight;
        equipmentCurrent.style.transition = '1s ease-in';
        equipmentCurrent.style.transform = `translateY(-${
          Math.floor((activeEquipmentIndex + 1) / 6) * leftHeight + 20
        }px)`;
      } else if ((activeEquipmentIndex + 1) % 6 === 0 && activeEquipmentIndex === 0) {
        const equipmentCurrent = equipmentLeft.current;
        equipmentCurrent.style.transition = '0s';
        equipmentCurrent.style.transform = `translateY(0px)`;
      }
      const queryItem = myList[activeEquipmentIndex + 1];
      setActiveEquipment({ ...queryItem, index: activeEquipmentIndex + 1 });
      handleQueryItem(queryItem, activeEquipmentIndex + 1);
    } else {
      clearInterval(timers);
      dispatch({
        type: 'equipmentMonitoringModel/getDetailsList',
        payload: true,
      });
    }
  }
  /**
   * @description: 滚动操作
   * @param {*} myScrollHeight
   * @param {*} myFooterHeight
   * @return {*}
   */
  function scrollLeft(myScrollHeight, myFooterHeight) {
    const listCurrent = myListNode.current;
    let top = 0;
    clearInterval(timers);
    timers = setInterval(() => {
      top += myFooterHeight + 4;
      if (top > myScrollHeight) {
        clearInterval(timers);
        listCurrent.style.transition = '1s ease-in';
        listCurrent.style.transform = `translateY(-${top}px)`;
        changeShowDetails();
      } else {
        listCurrent.style.transition = '1s ease-in';
        listCurrent.style.transform = `translateY(-${top}px)`;
      }
    }, 6000);
  }
  /**
   * @description: 查询详情
   * @param {*} item
   * @return {*}
   */
  function handleQueryItem(item, index) {
    const equipmentListOne = item;
    const equipmentId = equipmentListOne && equipmentListOne.equipmentId;
    const { organizationId, minutes } = myQueryparams;
    const params = { equipmentId, organizationId, minutes };
    setActiveEquipment({ ...item, index });
    setRightLoading(true);
    dispatch({
      type: 'equipmentMonitoringModel/getEquipmentmonitoringDetail',
      payload: params,
    }).then((res) => {
      if (res && res.length > 0) {
        setDetails(res);
        setRightLoading(false);
      } else {
        setDetails([]);
        setRightLoading(false);
      }
    });
  }

  function handleSetBgColor(equipStatus) {
    if (equipStatus) {
      if (equipStatus.toLowerCase() === 'running') {
        return { background: '#388E3C' };
      } else if (equipStatus.toLowerCase() === 'standby') {
        return { background: '#05A791' };
      } else if (equipStatus.toLowerCase() === 'maintaince') {
        return { background: '#F4C648' };
      } else if (equipStatus.toLowerCase() === 'breakdown') {
        return { background: '#D65246' };
      } else if (equipStatus.toLowerCase() === 'colsed') {
        return { background: '#0288D1' };
      }
    }
  }
  return (
    <div className={style['equipmnet-minitoring-my-footer']}>
      <section
        ref={(node) => {
          leftContent.current = node;
        }}
      >
        <div
          className={style['equipment-left-list']}
          ref={(node) => {
            equipmentLeft.current = node;
          }}
        >
          {myList &&
            myList.map((item, index) => {
              return (
                <div key={index.toString()} className={style['my-equipment-list']}>
                  <header
                    style={handleSetBgColor(item.equipmentStatus)}
                    onClick={() => debounce(() => handleQueryItem(item, index))}
                  >
                    <span>
                      {item.equipmentStatus === 'BREAKDOWN' ? (
                        <img src={breakdownImg} alt="警告" className={style['my-breakdown-icon']} />
                      ) : null}
                      <MyMarquee>{item.equipmentName}</MyMarquee>
                    </span>
                    <span>{item.equipmentCode}</span>
                  </header>
                  <footer
                    className={
                      item.equipmentStatus === 'BREAKDOWN' ? style['my-equipment-backdown'] : ''
                    }
                  >
                    <div className={style['my-equipment-list-footer-left']}>
                      {item.fileUrl ? <img src={item.fileUrl} alt="图片" /> : '暂无图片'}
                    </div>
                    <div className={style['my-equipment-list-footer-right']}>
                      <div>
                        <span>位置</span>
                        <i>{item.position}</i>
                      </div>
                      <div>
                        <span>设备类型</span>
                        <i>{item.equipmentType}</i>
                      </div>
                      <div>
                        <span>所有类型</span>
                        <i>{item.ownerType}</i>
                      </div>
                      <div>
                        <span>上次检修时间</span>
                        <i>{item.lastTpmDate}</i>
                      </div>
                    </div>
                  </footer>
                </div>
              );
            })}
        </div>
        {leftLoading ? (
          <div className={style['my-left-list-loading']}>
            <MyLoading />
          </div>
        ) : null}
      </section>
      <section className={style['my-equipment-monitoring-footer-right']}>
        <header>
          <h1>{activeEquipment && activeEquipment.equipmentName}</h1>
          <section className={style['my-footer-right-proline']}>
            <div>
              <Icons type="ziyuan1841" size="22" /> {activeEquipment?.prodLineName ?? '无产线信息'}
            </div>
            <div>
              <Icons type="chanxian" size="22" /> {activeEquipment?.workcellName ?? '无工位信息'}
            </div>
          </section>
        </header>
        <footer
          ref={(node) => {
            myFooterNode.current = node;
          }}
        >
          <div
            className={style['my-footer-echarts-list']}
            ref={(node) => {
              myListNode.current = node;
            }}
          >
            {details &&
              details.map((item, index) => {
                return (
                  <div className={style['equipment-monitoring-board-line']} key={index.toString()}>
                    <MyEcharts list={item} />
                  </div>
                );
              })}
          </div>
          {rightLoading ? (
            <div className={style['my-right-list-loading']}>
              <MyLoading />
            </div>
          ) : null}
        </footer>
      </section>
    </div>
  );
}
export default connect(({ equipmentMonitoringModel }) => ({ equipmentMonitoringModel }))(
  withRouter(MyFooter)
);
