/*
 * @module-: 底部
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-06-24 10:42:53
 * @LastEditTime: 2020-08-01 09:43:06
 * @copyright: Copyright (c) 2018,Hand
 */
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import React, { Component } from 'react';
import { Progress, Button, CheckBox, DataSet } from 'choerodon-ui/pro';

import querystring from 'query-string';
import { Bind } from 'lodash-decorators';

import style from './index.less';
import sortImg from '../assets/sort/sort.svg';
import sortUpImg from '../assets/sort/sort-up.svg';
import sortDown from '../assets/sort/sort-down.svg';
import filterImg from '../assets/filter/filter-no.svg';
import filterUse from '../assets/filter/filter-use.svg';

import MyProgress from '../components/MyProgress/index';

let dataTypeListAll = [{ status: ['未使用', '使用中', '维修中', '已报废'] }];
@connect(({ MoldMonitoringModel }) => ({
  MoldMonitoringModel,
}))
export default class MyFooter extends Component {
  constructor(props) {
    super(props);
    this.useCheckBox = null;
    this.newDiv = null;
    this.newDivUI = null;
    this.state = {
      sortImgs: [sortImg, sortUpImg, sortDown],
      stateProps: [],
      filterImages: [filterImg, filterUse],
      currentSortIndex: 0,
      currentFilterIndex: 1,
      typeDataList: [],
      activeType: [], // 当前展示模具状态数据
      proportionStatistics: { unUsed: 0, using: 0, service: 0, scrapped: 0 }, // 没有过滤的右侧模具占比
      propsModal: {},
      listCopy: [],
      checkBoxList: ['未使用', '使用中', '维修中', '已报废'],
      // alertModal: true,
    };
    this.ds = new DataSet({
      fields: [
        { name: 'status', multiple: true }, // 组件没有children会用label替代
      ],
      data: dataTypeListAll,
      events: {
        update: this.handleChangeCheckBox,
      },
    });
  }

  componentDidMount = () => {
    // 文字无缝滚动
    clearInterval(this.industryNews);
    this.industryNews = setInterval(this.taskIndustryNews, 50);
    // document.body.addEventListener('click', () => this.modalChange());
  };

  // componentWillMount() {
  //   document.body.removeEventListener('click', () => this.modalChange());
  // }

  /**
   *点击弹框其它区域，隐藏弹框
   *
   * @param {*} e
   * @memberof MyFooter
   */
  @Bind()
  modalChange(e) {
    const events = e || window.event;
    if (events.target.tagName === 'path' || events.target.tagName === 'svg') {
      this.useCheckBox.classList.remove('model-list');
      this.useCheckBox.style.display = 'none';
    } else if (events.target.tagName !== 'path' || events.target.tagName !== 'svg') {
      if (
        events.target !== this.useCheckBox &&
        events.target.className.indexOf('my-content-check') < 0 &&
        events.target.className.indexOf('c7n-pro-checkbox') < 0 &&
        this.useCheckBox.className.indexOf('model-list') > -1
      ) {
        this.useCheckBox.classList.remove('model-list');
        this.useCheckBox.style.display = 'none';
      }
    }
  }

  @Bind()
  taskIndustryNews() {
    if (this.newDiv.scrollTop >= this.newDivUI.offsetHeight - this.newDiv.clientHeight) {
      this.newDiv.scrollTop = 0;
    } else {
      this.newDiv.scrollTop += 1;
    }
  }

  @Bind()
  handleIndustryNewsEnter() {
    clearInterval(this.industryNews);
  }

  @Bind()
  handleIndustryNewsLeave() {
    this.industryNews = setInterval(this.taskIndustryNews, 100);
  }

  componentWillUnmount() {
    clearInterval(this.industryNews);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { currentSortIndex, activeType } = this.state;
    if (nextProps.originalValue !== this.state.stateProps) {
      const { originalValue } = nextProps;
      this.updateChange(originalValue, []);
      return true;
    } else if (
      nextProps.moldMonitoringModel !== this.state.propsModal &&
      !(nextProps.originalValue !== this.state.stateProps)
    ) {
      const { originalValue, moldMonitoringModel } = nextProps;
      const dataList = moldMonitoringModel?.getModalDataList?.data ?? [];
      this.updateChange(originalValue, dataList);
      this.setState({ propsModal: moldMonitoringModel });
      return true;
    } else if (
      nextState.currentSortIndex !== currentSortIndex ||
      nextState.activeType !== activeType
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   *传来数据变化引起视图更新
   *
   * @param {*} originalValue
   * @param {*} clickOnePie
   * @memberof MyFooter
   */
  @Bind()
  updateChange(originalValue, clickOnePie) {
    if (clickOnePie) {
      this.setState({ listCopy: [] });
    }
    const typeData = this.groupArray(originalValue); // 模具根据类型分类
    const typeDataLists = typeData[0]?.data ?? [];
    const activeType = !(clickOnePie.length > 0) ? typeDataLists : clickOnePie;
    const newActiveType = [];
    let unUsed = 0;
    let using = 0;
    let service = 0;
    let scrapped = 0;
    for (let i = 0; i < activeType.length; i++) {
      const actives = activeType[i];
      if (actives.attribute3 === '使用中') {
        newActiveType.push({
          ...actives,
          id: i,
          color: '#52C41A',
          proportion: Math.floor(
            (Number(actives.attribute6) * 100) /
              (Number(actives.attribute6) + Number(actives.attribute9))
          ),
        });
        using += 1;
      } else if (actives.attribute3 === '已报废') {
        newActiveType.push({
          ...actives,
          id: i,
          color: '#AAADBA',
          proportion: Math.floor(
            (Number(actives.attribute6) * 100) /
              (Number(actives.attribute6) + Number(actives.attribute9))
          ),
        });
        scrapped += 1;
      } else if (actives.attribute3 === '维修中') {
        service += 1;
        newActiveType.push({
          ...actives,
          id: i,
          color: '#FF8B5E',
          proportion: Math.floor(
            (Number(actives.attribute6) * 100) /
              (Number(actives.attribute6) + Number(actives.attribute9))
          ),
        });
      } else {
        newActiveType.push({
          ...actives,
          id: i,
          color: '#3AA1FF',
          proportion: Math.floor(
            (Number(actives.attribute6) * 100) /
              (Number(actives.attribute6) + Number(actives.attribute9))
          ),
        });
        unUsed += 1;
      }
    }
    const newList = [];
    for (let h = 0; h < newActiveType.length; h++) {
      for (let s = 0; s < this.state.checkBoxList.length; s++) {
        if (this.state.checkBoxList[s] === newActiveType[h].attribute3) {
          newList.push(newActiveType[h]);
        }
      }
    }
    dataTypeListAll = [{ status: ['未使用', '使用中', '维修中', '已报废'] }];
    const proportionStatistics = { unUsed, using, service, scrapped };
    this.setState({
      stateProps: originalValue,
      activeType: newList,
      proportionStatistics,
      listCopy: newList,
      typeDataList: newActiveType,
    });
  }

  // 排序函数
  @Bind()
  handleSort(creationDate, currentIndex) {
    let sortBy = 1;
    if (currentIndex === 1) {
      sortBy = 1;
    } else {
      sortBy = -1;
    }
    return (a, b) => {
      if (a[creationDate] > b[creationDate]) {
        return -1 * sortBy;
      } else if (a[creationDate] < b[creationDate]) {
        return 1 * sortBy;
      } else if (a[creationDate] === b[creationDate]) {
        return 0;
      }
    };
  }

  @Bind()
  openFilterModal(e) {
    const evens = e || window.event;
    evens.stopPropagation();
    this.useCheckBox.classList.add('model-list');
    this.useCheckBox.style.display = 'block';
  }

  /**
   *点击排序/过滤
   *
   * @param {*} status
   * @memberof MyFooter
   */
  @Bind()
  handleChangeSort(status) {
    const { sortImgs, currentSortIndex, currentFilterIndex, listCopy, activeType } = this.state;
    const sortImgsLen = sortImgs.length;
    if (status === 'sort') {
      if (sortImgsLen > currentSortIndex + 1) {
        const newData = [...activeType];
        newData.sort(this.handleSort('proportion', currentSortIndex));
        this.setState({
          currentSortIndex: currentSortIndex + 1,
          activeType: newData,
        });
      } else {
        const dataList = [...listCopy];
        const restore = currentFilterIndex === 0 ? dataList : activeType;
        this.setState({ currentSortIndex: 0, activeType: restore });
      }
    } else if (status !== 'sort') {
      this.openFilterModal();
    }
  }

  /**
   *选择情况
   *
   * @param {*} { name, value, oldValue }
   * @memberof MyFooter
   */
  @Bind()
  handleChangeCheckBox({ value }) {
    this.setState({ checkBoxList: value });
  }

  /**
   *筛选确定与否
   *
   * @param {*} selectStatus
   * @memberof MyFooter
   */
  @Bind()
  handleCloseCheckBox(selectStatus) {
    const { typeDataList, checkBoxList, currentSortIndex } = this.state;
    if (this.useCheckBox) {
      this.useCheckBox.style.display = 'none';
    }
    if (selectStatus === 'close') {
      this.setState({ currentFilterIndex: 0 });
    } else if (selectStatus !== 'close') {
      if (checkBoxList.length > 0) {
        const newDataList = [];
        for (let i = 0; i < typeDataList.length; i++) {
          for (let j = 0; j < checkBoxList.length; j++) {
            if (checkBoxList[j] === typeDataList[i].attribute3) {
              newDataList.push(typeDataList[i]);
            }
          }
        }
        newDataList.sort(this.handleSort('proportion', currentSortIndex));
        if (checkBoxList.length !== 0) {
          this.setState({ currentFilterIndex: 1 });
        } else {
          this.setState({ currentFilterIndex: 0 });
        }
        this.setState({ activeType: newDataList });
      } else {
        this.setState({ currentFilterIndex: 0, activeType: [] });
      }
      this.setState({ currentSortIndex: 0 });
    }
  }

  /**
   *数据根据某个字段分组
   *
   * @param {*} arr
   * @returns
   * @memberof MyFooter
   */
  @Bind()
  groupArray(arr) {
    const map = {};
    const dest = [];
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        const ai = arr[i];
        if (!map[ai.attribute7]) {
          dest.push({
            attribute7: ai.attribute7,
            data: [ai],
          });
          map[ai.attribute7] = ai;
        } else {
          for (let j = 0; j < dest.length; j++) {
            const dj = dest[j];
            if (dj.attribute7 === ai.attribute7) {
              dj.data.push(ai);
              break;
            }
          }
        }
      }
    }
    return dest;
  }

  /**
   *去往模具履历界面
   *
   * @memberof MyFooter
   */
  @Bind()
  handleGoToDieResume(moldCode) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/lisp/die-resume',
        query: { moldCode },
        search: querystring.stringify({
          moldCode: encodeURIComponent(JSON.stringify(moldCode)),
        }),
      })
    );
  }

  render() {
    const {
      typeDataList,
      proportionStatistics,
      activeType,
      sortImgs,
      filterImages,
      currentSortIndex,
      currentFilterIndex,
      // alertModal,
    } = this.state;
    return (
      <div className={style['my-content-footer']}>
        <section className={style['my-content-center-left']}>
          <header>
            <div>
              {`${typeDataList[0] && typeDataList[0].attribute7} (${typeDataList.length}种)`}
            </div>
            <span />
          </header>
          <div
            className={style['my-content-table-list']}
            onMouseEnter={this.handleIndustryNewsEnter}
            onMouseLeave={this.handleIndustryNewsLeave}
          >
            <span>序号</span>
            <span>模具编码</span>
            <span>模具名称</span>
            <span className={style['my-content-table-status']}>
              模具状态
              <img
                src={filterImages[currentFilterIndex]}
                alt="模具状态"
                onClick={() => this.handleChangeSort('filter')}
              />
              <section
                ref={(checkBoxDOM) => {
                  this.useCheckBox = checkBoxDOM;
                }}
              >
                <div className={style['my-content-check']}>
                  <CheckBox
                    dataSet={this.ds}
                    name="status"
                    value="未使用"
                    className={style['model-list']}
                  >
                    未使用
                  </CheckBox>
                  <br />
                  <CheckBox
                    dataSet={this.ds}
                    name="status"
                    value="使用中"
                    className={style['model-list']}
                  >
                    使用中
                  </CheckBox>
                  <br />
                  <CheckBox
                    dataSet={this.ds}
                    name="status"
                    value="维修中"
                    className={style['model-list']}
                  >
                    维修中
                  </CheckBox>
                  <br />
                  <CheckBox
                    dataSet={this.ds}
                    name="status"
                    value="已报废"
                    className={style['model-list']}
                  >
                    已报废
                  </CheckBox>
                  <br />
                  <div className={style['my-content-footer']}>
                    <div>
                      <Button onClick={() => this.handleCloseCheckBox('close')}>取消</Button>
                    </div>
                    <div>
                      <Button color="green" onClick={() => this.handleCloseCheckBox('default')}>
                        确定
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </span>
            <div>
              使用次数占比
              <img
                src={sortImgs[currentSortIndex]}
                alt="占比"
                onClick={() => this.handleChangeSort('sort')}
              />
            </div>
            <span>预计使用次数</span>
          </div>
          <div
            ref={(refDOM) => {
              this.newDiv = refDOM;
            }}
            className={style['my-content-footer-list']}
            onMouseEnter={this.handleIndustryNewsEnter}
            onMouseLeave={this.handleIndustryNewsLeave}
          >
            <div
              ref={(refDOM) => {
                this.newDivUI = refDOM;
              }}
            >
              {activeType &&
                activeType.map((item, index) => {
                  return (
                    <div
                      className={style['my-content-table-list-all']}
                      key={item.id}
                      onClick={() => this.handleGoToDieResume(item.attribute1)}
                      title="点击跳转到对应的模具履历界面"
                    >
                      <span>{index + 1}</span>
                      <span>{item.attribute1}</span>
                      <span>{item.attribute2}</span>
                      <span style={{ color: `${item.color}` }}>
                        <i
                          style={{ background: `${item.color}` }}
                          className={style['my-content-table-list-l']}
                        />
                        {item.attribute3}
                      </span>
                      <div className={style['my-content-table-bar-graph']}>
                        <div>
                          <MyProgress
                            value={Math.floor(
                              (Number(item.attribute6) * 100) /
                                (Number(item.attribute6) + Number(item.attribute9))
                            )}
                          />
                        </div>
                      </div>
                      <span>{Number(item.attribute6) + Number(item.attribute9)}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
        <section className={style['my-content-center-right']}>
          <header>
            <div>模具占比情况</div>
            <span />
          </header>
          <div className={style['my-content-right-img']}>
            <div className={style['my-content-pie']}>
              <Progress
                value={Math.floor(
                  ((Number(proportionStatistics.unUsed) + Number(proportionStatistics.service)) *
                    100) /
                    (Number(proportionStatistics.unUsed) +
                      Number(proportionStatistics.service) +
                      Number(proportionStatistics.using))
                )}
                type="dashboard"
                size="large"
              />
            </div>
            <div className={style['my-content-footer-scop']}>
              <section>
                <span>待使用</span>
                <br />
                <span>{proportionStatistics && proportionStatistics.unUsed}</span>
              </section>
              <section>
                <span>维修中</span>
                <br />
                <span>{proportionStatistics.service}</span>
              </section>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
