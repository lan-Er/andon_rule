/*
 * @module-:班组看板内容
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-24 11:37:57
 * @LastEditTime: 2021-03-15 14:29:56
 * @copyright: Copyright (c) 2018,Hand
 */
import { DataSet, Select, Form, notification } from 'choerodon-ui/pro';
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  Suspense,
  lazy,
  useLayoutEffect,
} from 'react';

import { connect } from 'dva';
import codeConfig from '@/common/codeConfig';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { queryIndependentValueSet } from 'hlos-front/lib/services/api';

import style from './index.module.less';
import Loading from './components/Loading';
import DashbordHeader from '../../common/DashboardHeader';

const MyImgLoading = lazy(() => import('./components/MyImgLoading.js'));

let scrollTime = null;
let centerSrollTime = null;
const codeList = codeConfig();
function MyContent({ myProps, dispatch }) {
  const queryDS = useDataSet(
    () =>
      new DataSet({
        autoCreate: true,
        fields: [
          {
            name: 'workgroup',
            type: 'string',
            lookupCode: `${codeList.ztTeam}`,
            label: '班组',
            required: true,
          },
        ],
        events: {
          update: ({ name, value }) => {
            handleChangeName({ name, value });
          },
        },
      }),
    MyContent
  );
  const { history, location } = myProps;
  const scrollContent = useRef(null);
  const scrollList = useRef(null);
  const centerScrollList = useRef(null);
  const centerScrollContent = useRef(null);
  const [boardImg, setBoardImg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [centerLoading, setCenterLoading] = useState(false);
  const [safeDataList, setSafeDataList] = useState([]);
  const [quality, setQuality] = useState([]);
  const [efficiency, setEfficiency] = useState([]);
  const [productList, setProductList] = useState([]);
  const [queryWorkgroup, setQueryWorkgroup] = useState('');
  const newQueryData = useMemo(() => queryWorkgroup, [queryWorkgroup]);
  const getMyProps = useMemo(() => location, [location]);
  const [centerList, setCenterList] = useState([]);
  useEffect(() => {
    getDefaultLovCode();
  }, [getMyProps]);

  useEffect(() => {
    return () => {
      clearInterval(scrollTime);
      clearInterval(centerSrollTime);
    };
  }, []);
  /**
   * @description: 初始化
   * @param {*}
   * @return {*}
   */
  async function getDefaultLovCode() {
    const res = await queryIndependentValueSet({ lovCode: codeList.ztTeam });
    if (res && res[0]) {
      const workgroup = (res && res[0].value) || '';
      if (workgroup) {
        setQueryWorkgroup(workgroup);
        queryDS.current.set('workgroup', workgroup);
        // handleQuery(workgroup);
        // handleCenterQuery(workgroup);
      } else {
        notification.warning({
          message: '请先维护值集视图',
        });
      }
    }
  }
  useLayoutEffect(() => {
    if (scrollContent && scrollList) {
      const scrollContentHeight = scrollContent.current.offsetHeight;
      const scrollListHeight = scrollList.current.offsetHeight;
      scrollList.current.style.top = '100%';
      if (scrollListHeight > scrollContentHeight) {
        handleScrollList();
      } else {
        scrollList.current.style.top = `${0}px`;
      }
    }
  }, [scrollContent, scrollList, productList, loading]);

  useLayoutEffect(() => {
    if (centerScrollContent && centerScrollList) {
      const scrollContentHeight = centerScrollContent.current.offsetHeight;
      const scrollListHeight = centerScrollList.current.offsetHeight;
      centerScrollList.current.style.top = '100%';
      if (scrollListHeight > scrollContentHeight) {
        handleCenterScrollList();
      } else {
        centerScrollList.current.style.top = `${0}px`;
      }
    }
  }, [centerScrollContent, centerScrollList, centerList, centerLoading]);

  /**
   *修改班组
   *
   * @param {*} changeValue
   */
  function handleChangeName(changeValue) {
    clearInterval(scrollTime);
    clearInterval(centerSrollTime);
    handleQuery(changeValue.value);
    handleCenterQuery(changeValue.value);
    setQueryWorkgroup(changeValue.value);
  }
  /**
   *查询
   *
   */
  function handleQuery(workgroup) {
    setLoading(true);
    dispatch({
      type: 'teamMorningMeetingBoardModels/getTeamBoardImgList',
      payload: { workgroup },
    })
      .then((res) => {
        setLoading(false);
        if (res) {
          const {
            imageJsonString,
            safeJsonString,
            qualityJsonString,
            efficiencyJsonString,
            productJsonString,
          } = res;
          const imageList = imageJsonString ? JSON.parse(imageJsonString) : [];
          const safeList = safeJsonString ? JSON.parse(safeJsonString) : [];
          const qualityList = qualityJsonString ? JSON.parse(qualityJsonString) : [];
          const efficiencyList = efficiencyJsonString ? JSON.parse(efficiencyJsonString) : [];
          const product = productJsonString ? JSON.parse(productJsonString) : [];
          setBoardImg(imageList);
          setSafeDataList(safeList);
          setQuality(qualityList);
          setEfficiency(efficiencyList);
          setProductList(product);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  function handleCenterQuery(workgroup) {
    setCenterLoading(true);
    dispatch({
      type: 'teamMorningMeetingBoardModels/getTeamBoardImgList',
      payload: { workgroup },
    })
      .then((res) => {
        setCenterLoading(false);
        if (res) {
          const { productPlanJsonString } = res;
          const productPlanJson = productPlanJsonString ? JSON.parse(productPlanJsonString) : [];
          setCenterList(productPlanJson);
        }
      })
      .catch((err) => {
        console.log(err);
        setCenterLoading(false);
      });
  }

  /**
   * @description: 中间滚动
   * @param {*}
   * @return {*}
   */
  function handleCenterScrollList() {
    const scrollViewHeight = centerScrollContent.current.offsetHeight;
    let top = scrollViewHeight;
    const scrollListHeight = centerScrollList.current.offsetHeight;
    clearInterval(centerSrollTime);
    centerSrollTime = setInterval(() => {
      if (-top < scrollListHeight && !centerLoading) {
        centerScrollList.current.style.top = `${top}px`;
        top -= 1;
      } else if (-top >= scrollListHeight && !centerLoading) {
        clearInterval(centerSrollTime);
        handleCenterQuery(newQueryData);
      }
    }, 2000 / 60);
  }
  /**
   *右侧超出滚动
   *
   */
  function handleScrollList() {
    const scrollViewHeight = scrollContent.current.offsetHeight;
    let top = scrollViewHeight;
    const scrollListHeight = scrollList.current.offsetHeight;
    clearInterval(scrollTime);
    scrollTime = setInterval(() => {
      if (-top < scrollListHeight && !loading) {
        scrollList.current.style.top = `${top}px`;
        top -= 1;
      } else if (-top >= scrollListHeight && !loading) {
        clearInterval(scrollTime);
        handleQuery(newQueryData);
      }
    }, 2000 / 60);
  }
  return (
    <div className={style['team-morning-meeting-board']}>
      <DashbordHeader title="中天宇光SIM1" history={history} />
      <div className={style['my-select-box']}>
        <Form dataSet={queryDS} columns={4} labelWidth={[70]}>
          <Select name="workgroup" />
        </Form>
      </div>
      <div className={style['my-team-morning-meeting-board-content']}>
        <section className={style['morning-meeting-left']}>
          <div className={style['header-title']}>质量月报</div>
          <div className={style['board-left-bottom']}>
            <Suspense fallback={<Loading />}>
              <MyImgLoading src={boardImg[0]?.imageUrl} alt="质量" />
            </Suspense>
          </div>
        </section>
        <section className={style['morning-meeting-center']}>
          <div className={style['header-title']}>生产计划</div>
          <div className={style['board-center-bottom']}>
            <div className={style['board-center-bottom-list-title']}>
              <span>生产编号</span>
              <span>产品型号</span>
              <span>台数</span>
              <span>图号</span>
              <span>线材日期</span>
              <span>交货时间</span>
              <span>客户名称</span>
              <span>订单日期</span>
            </div>
            <div
              className={style['center-scroll-list']}
              ref={(node) => {
                centerScrollContent.current = node;
              }}
            >
              <ul
                ref={(node) => {
                  centerScrollList.current = node;
                }}
              >
                {centerList &&
                  centerList.map((item, index) => {
                    return (
                      <li key={index.toString()}>
                        <span>{item.productNum}</span>
                        <span>{item.productModel}</span>
                        <span>
                          {item.equipmentQuantity ? parseInt(item.equipmentQuantity, 10) : 0}
                        </span>
                        <span>{item.drawingCode}</span>
                        <span>{item.wireDate}</span>
                        <span>{item.deliveryTime}</span>
                        <span>{item.customerName}</span>
                        <span>{item.orderDate}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </section>
        <section className={style['morning-meeting-right']}>
          <div className={style['header-title']}>5S</div>
          <div className={style['board-right-bottom']}>
            <div className={style['board-right-five']}>
              <Suspense fallback={<Loading />}>
                <MyImgLoading src={boardImg[1]?.imageUrl} alt="5s" />
              </Suspense>
            </div>
            <div className={style['board-right-quantity']}>
              <table>
                <tbody>
                  <tr>
                    <td />
                    <td>目标值</td>
                    <td>实际值</td>
                  </tr>
                  <tr>
                    <td>质量</td>
                    <td>{quality[0]?.targetValue || 0}</td>
                    <td>{quality[0]?.realValue || 0}</td>
                  </tr>
                  <tr>
                    <td>效率</td>
                    <td>{efficiency[0]?.targetValue || 0}</td>
                    <td>{efficiency[0]?.realValue || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={style['board-right-safety']}>
              <table>
                <tbody>
                  <tr>
                    <td>一般安全事故</td>
                    <td>{safeDataList[0]?.normalAccident || 0}</td>
                  </tr>
                  <tr>
                    <td>安全隐患</td>
                    <td>{safeDataList[0]?.safeProblem || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={style['board-right-table-list']}>
              <div className={style['board-right-bottom-list-title']}>
                <span>生产编号</span>
                <span>图号</span>
                <span>型号</span>
                <span>操作者</span>
                <span>预计开工</span>
                <span>预计完工</span>
              </div>
              <div
                className={style['right-scroll-list']}
                ref={(node) => {
                  scrollContent.current = node;
                }}
              >
                <ul
                  ref={(node) => {
                    scrollList.current = node;
                  }}
                >
                  {productList &&
                    productList.map((item, index) => {
                      return (
                        <li key={index.toString()}>
                          <span>{item.productNum}</span>
                          <span>{item.drawingCode}</span>
                          <span>{item.model}</span>
                          <span>{item.operator}</span>
                          <span>{item.planStartTime}</span>
                          <span>{item.planCompleteTime}</span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default connect()(MyContent);
