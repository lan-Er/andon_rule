/*
 * @Descripttion: 资源计划
 * @Author: chenyang.liu
 * @Date: 2019-09-20 14:34:51
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-01 16:36:25
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import { Button } from 'choerodon-ui/pro';
import { Input, Row, Col, DatePicker } from 'choerodon-ui';
import { DragDropContext } from 'react-beautiful-dnd';

import { Content } from 'components/Page';
import notification from 'utils/notification';

import styles from './index.less';
import EquipmentList from './EquipmentList/EquipmentList';
import TaskList from './TaskList/TaskList';

const { RangePicker } = DatePicker;

/**
 * 单个甬道内数据重排
 * @param {Array} list 所在甬道列表
 * @param {object} source 初始位置项
 * @param {object} destination 目标位置项
 */
const reorder = (list, source, destination) => {
  if (source.droppableId === destination.droppableId) {
    const startIndex = source.index;
    const endIndex = destination.index;
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }
};

/**
 * 甬道间数据重排.
 * @param {list} source 来源列表
 * @param {list} destination 目标列表
 * @param {object} droppableSource 来源项
 * @param {object} droppableDestination 目标项
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const desClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  desClone.splice(droppableDestination.index, 0, removed);
  const result = {};
  result.source = sourceClone;
  result.destination = desClone;

  return result;
};

@connect(({ lispResourcePlanModel }) => ({
  lispResourcePlanModel,
}))
export default class Beautiful extends React.Component {
  constructor(props) {
    super(props);
    this.queryHeight = 0;
    this.state = {
      searchParams: {
        moNum: '',
        productCode: '',
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      },
      startTime: moment(),
      endTime: moment(),
    };

    this.myQueryBar = React.createRef();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const queryHeight = this.myQueryBar.current.getBoundingClientRect().height;
    this.queryHeight = queryHeight;
    dispatch({
      type: 'lispResourcePlanModel/getResourcePlanList',
    });
    dispatch({
      type: 'lispResourcePlanModel/getTaskList',
    });
  }

  /**
   * 将查询控制做成受控组件
   * @param {Event} e event对象
   * @param {string} type 查询参数的某项
   */
  @Bind
  changeSearch(e, type) {
    const { searchParams } = this.state;
    searchParams[type] = e.target.value;
    this.setState({
      searchParams,
    });
  }

  /**
   * 改变时间函数
   * @param {date} date date对象
   * @param {dateString} dateString date对象的字符串
   */
  @Bind
  changeDate(date, dateString) {
    const { searchParams } = this.state;
    const [startDate, endDate] = dateString;
    const [startTime, endTime] = date;
    this.setState({
      startTime,
      endTime,
      searchParams: {
        ...searchParams,
        startDate,
        endDate,
      },
    });
  }

  @Bind
  handleQuery() {
    const {
      searchParams: { productCode, moNum },
    } = this.state;
    this.props.dispatch({
      type: 'lispResourcePlanModel/getTaskList',
      payload: {
        attribute2: moNum,
        attribute3: productCode,
      },
    });
  }

  /**
   * 下达操作
   */
  @Bind
  async handleRelease() {
    const { checkArray } = this.props.lispResourcePlanModel;
    const { dispatch } = this.props;
    try {
      dispatch({
        type: 'lispResourcePlanModel/assignTask',
        payload: checkArray,
      }).then((res) => {
        if (res && res.success) {
          notification.success({
            message: '下达完成',
          });
          dispatch({
            type: 'lispResourcePlanModel/updateState',
            payload: {
              checkArray: [],
            },
          });
          dispatch({
            type: 'lispResourcePlanModel/getResourcePlanList',
          });
          dispatch({
            type: 'lispResourcePlanModel/getTaskList',
          });
          this.setState({
            startTime: '',
            endTime: '',
            searchParams: {
              moNum: '',
              productCode: '',
              startDate: '',
              endDate: '',
            },
          });
        }
      });
    } catch (err) {
      notification.error({
        message: '下达失败',
      });
    }
  }

  /**
   * 拖动结束
   */
  @Bind
  onDragEnd(result) {
    const { source, destination } = result;
    const { dispatch } = this.props;
    const { startDate, endDate } = this.state.searchParams;
    let { taskList } = this.props.lispResourcePlanModel;
    const { resourcePlanList, checkArray } = this.props.lispResourcePlanModel;
    if (!destination) return;

    let prodLine = '';
    let equipment = '';

    // 在单个甬道内拖动重排数据
    if (destination.droppableId === source.droppableId) {
      if (destination.droppableId === 'task' && source.droppableId === 'task') {
        // task甬道内拖动重排数据

        const items = reorder(taskList, source, destination);
        const { dataId, objectVersionNumber, attribute2, attribute39 } = items[destination.index];
        dispatch({
          type: 'lispResourcePlanModel/dragBack',
          payload: {
            attribute15: startDate,
            attribute16: endDate,
            attribute19: prodLine,
            attribute2,
            attribute20: '',
            attribute21: equipment,
            attribute39,
            attribute40: destination.index,
            sourceIndex: source.index,
            attribute43: 0,
            dataId,
            objectVersionNumber,
            resourceClass: '',
            resourceName: '',
          },
        }).then(() => {
          dispatch({
            type: 'lispResourcePlanModel/getResourcePlanList',
          });
          dispatch({
            type: 'lispResourcePlanModel/getTaskList',
          });
        });
      } else {
        // 设备甬道内拖动重排数据

        const groupIndex = source.droppableId.slice(0, source.droppableId.indexOf('_'));
        const lineIndex = source.droppableId.slice(
          source.droppableId.indexOf('_') + 1,
          source.droppableId.lastIndexOf('_')
        );
        if (
          resourcePlanList[groupIndex].resourcePlanLineFeignDtoList[lineIndex].taskList[
            destination.index
          ].attribute7 === '运行中'
        ) {
          notification.warning({
            message: '待排程task不能排在在制之前',
          });
          return;
        }
        const items = reorder(
          resourcePlanList[groupIndex].resourcePlanLineFeignDtoList[lineIndex].taskList,
          source,
          destination
        );
        resourcePlanList[groupIndex].resourcePlanLineFeignDtoList[lineIndex].taskList = items;
        const { dataId, objectVersionNumber, attribute2, attribute19, attribute39 } = items[
          destination.index
        ];
        const { attribute3, attribute4 } = resourcePlanList[
          groupIndex
        ].resourcePlanLineFeignDtoList[lineIndex];
        if (attribute3 === '产线') {
          prodLine = attribute19;
        } else if (attribute3 === '设备') {
          equipment = attribute3;
        }
        dispatch({
          type: 'lispResourcePlanModel/dragBack',
          payload: {
            attribute15: startDate,
            attribute16: endDate,
            attribute19: prodLine,
            attribute2,
            attribute20: '',
            attribute21: equipment,
            attribute39,
            attribute40: destination.index,
            sourceIndex: source.index,
            attribute43: 1,
            dataId,
            objectVersionNumber,
            resourceClass: attribute4,
            resourceName: attribute3,
          },
        }).then(() => {
          dispatch({
            type: 'lispResourcePlanModel/getResourcePlanList',
          });
          dispatch({
            type: 'lispResourcePlanModel/getTaskList',
          });
        });
      }
    } else if (source.droppableId === 'task' && destination.droppableId !== 'task') {
      // 从task甬道拖向设备甬道

      const destinationGroupIndex = destination.droppableId.slice(
        0,
        destination.droppableId.indexOf('_')
      );
      const destinationLineIndex = destination.droppableId.slice(
        destination.droppableId.indexOf('_') + 1,
        destination.droppableId.lastIndexOf('_')
      );
      const resultItems = move(
        taskList,
        resourcePlanList[destinationGroupIndex].resourcePlanLineFeignDtoList[destinationLineIndex]
          .taskList,
        source,
        destination
      );
      taskList = resultItems.source;
      resourcePlanList[destinationGroupIndex].resourcePlanLineFeignDtoList[
        destinationLineIndex
      ].taskList = resultItems.destination;
      const {
        dataId,
        objectVersionNumber,
        attribute2,
        attribute19,
        attribute39,
      } = resultItems.destination[destination.index];
      const { attribute3, attribute4 } = resourcePlanList[
        destinationGroupIndex
      ].resourcePlanLineFeignDtoList[destinationLineIndex];
      if (attribute3 === '产线') {
        prodLine = attribute19;
      } else if (attribute3 === '设备') {
        equipment = attribute3;
      }
      dispatch({
        type: 'lispResourcePlanModel/dragBack',
        payload: {
          attribute15: startDate,
          attribute16: endDate,
          attribute19: prodLine,
          attribute2,
          attribute20: '',
          attribute21: equipment,
          attribute39,
          attribute40: destination.index,
          attribute43: 1,
          dataId,
          objectVersionNumber,
          resourceClass: attribute4,
          resourceName: attribute3,
        },
      }).then(() => {
        dispatch({
          type: 'lispResourcePlanModel/getResourcePlanList',
        });
        dispatch({
          type: 'lispResourcePlanModel/getTaskList',
        });
      });
    } else if (destination.droppableId === 'task' && source.droppableId !== 'task') {
      // 从设备甬道拖向task甬道

      const sourceGroupIndex = source.droppableId.slice(0, source.droppableId.indexOf('_'));
      const sourceLineIndex = source.droppableId.slice(
        source.droppableId.indexOf('_') + 1,
        source.droppableId.lastIndexOf('_')
      );
      const [removeItem] = resourcePlanList[sourceGroupIndex].resourcePlanLineFeignDtoList[
        sourceLineIndex
      ].taskList.slice(source.index, source.index + 1);
      const resultItems = move(
        resourcePlanList[sourceGroupIndex].resourcePlanLineFeignDtoList[sourceLineIndex].taskList,
        taskList,
        source,
        destination
      );
      resourcePlanList[sourceGroupIndex].resourcePlanLineFeignDtoList[sourceLineIndex].taskList =
        resultItems.source;
      taskList = resultItems.destination;
      if (checkArray.includes(removeItem.dataId)) {
        checkArray.splice(checkArray.indexOf(removeItem.dataId), 1);
      }
      const { dataId, objectVersionNumber, attribute2, attribute39 } = taskList[destination.index];
      dispatch({
        type: 'lispResourcePlanModel/dragBack',
        payload: {
          attribute15: startDate,
          attribute16: endDate,
          attribute19: prodLine,
          attribute2,
          attribute20: '',
          attribute21: equipment,
          attribute39,
          attribute40: destination.index,
          attribute43: 0,
          dataId,
          objectVersionNumber,
          resourceClass: '',
          resourceName: '',
        },
      }).then(() => {
        dispatch({
          type: 'lispResourcePlanModel/getResourcePlanList',
        });
        dispatch({
          type: 'lispResourcePlanModel/getTaskList',
        });
      });
    } else {
      // 设备甬道间拖动重排数据

      const sourceGroupIndex = source.droppableId.slice(0, source.droppableId.indexOf('_'));
      const sourceLineIndex = source.droppableId.slice(
        source.droppableId.indexOf('_') + 1,
        source.droppableId.lastIndexOf('_')
      );
      const destinationGroupIndex = destination.droppableId.slice(
        0,
        destination.droppableId.indexOf('_')
      );
      const destinationLineIndex = destination.droppableId.slice(
        destination.droppableId.indexOf('_') + 1,
        destination.droppableId.lastIndexOf('_')
      );
      const resultItems = move(
        resourcePlanList[sourceGroupIndex].resourcePlanLineFeignDtoList[sourceLineIndex].taskList,
        resourcePlanList[destinationGroupIndex].resourcePlanLineFeignDtoList[destinationLineIndex]
          .taskList,
        source,
        destination
      );
      resourcePlanList[sourceGroupIndex].resourcePlanLineFeignDtoList[sourceLineIndex].taskList =
        resultItems.source;
      resourcePlanList[destinationGroupIndex].resourcePlanLineFeignDtoList[
        destinationLineIndex
      ].taskList = resultItems.destination;
      const {
        dataId,
        objectVersionNumber,
        attribute2,
        attribute19,
        attribute39,
      } = resultItems.destination[destination.index];
      const { attribute3, attribute4 } = resourcePlanList[
        destinationGroupIndex
      ].resourcePlanLineFeignDtoList[destinationLineIndex];
      if (attribute3 === '产线') {
        prodLine = attribute19;
      } else if (attribute3 === '设备') {
        equipment = attribute3;
      }
      dispatch({
        type: 'lispResourcePlanModel/dragBack',
        payload: {
          attribute15: startDate,
          attribute16: endDate,
          attribute19: prodLine,
          attribute2,
          attribute20: '',
          attribute21: equipment,
          attribute39,
          attribute40: destination.index,
          attribute43: 1,
          dataId,
          objectVersionNumber,
          resourceClass: attribute4,
          resourceName: attribute3,
        },
      }).then(() => {
        dispatch({
          type: 'lispResourcePlanModel/getResourcePlanList',
        });
        dispatch({
          type: 'lispResourcePlanModel/getTaskList',
        });
      });
    }
  }

  render() {
    const {
      lispResourcePlanModel: { resourcePlanList, taskList },
    } = this.props;
    const {
      startTime,
      endTime,
      searchParams: { productCode, moNum },
    } = this.state;
    const dateRange = startTime || endTime ? [startTime, endTime] : [];
    return (
      <Content>
        <div className={styles['resource-plan']}>
          <div ref={this.myQueryBar} className={styles['search-header']}>
            <Row>
              <Col span={8}>
                <Button color="primary" onClick={this.handleRelease}>
                  排期
                </Button>
              </Col>
              <Col span={6}>
                <RangePicker
                  placeholder={['开始时间', '结束时间']}
                  value={dateRange}
                  onChange={this.changeDate}
                  label="交期"
                />
              </Col>
              <Col span={10}>
                <Row gutter={12} style={{ height: '36px', lineHeight: '36px' }}>
                  <Col span={11} />
                  <Col span={5}>
                    <Input
                      value={moNum}
                      onChange={(e) => this.changeSearch(e, 'moNum')}
                      label="MO"
                    />
                  </Col>
                  <Col span={5}>
                    <Input
                      value={productCode}
                      onChange={(e) => this.changeSearch(e, 'productCode')}
                      label="产品编号"
                    />
                  </Col>
                  <Col span={3}>
                    <Button color="primary" onClick={this.handleQuery}>
                      查询
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <div className={styles['operation-content']}>
            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
              <div className={styles['task-list-content']} style={{ top: this.queryHeight }}>
                <TaskList taskList={taskList} />
              </div>

              {resourcePlanList &&
                resourcePlanList.map((item) => (
                  <EquipmentList key={item.dataId} equipmentGroup={item} />
                ))}
            </DragDropContext>
          </div>
        </div>
      </Content>
    );
  }
}
