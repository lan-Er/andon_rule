/**
 * 分组管理
 * @since: 2020-07-08 16:23:05
 * @author: wei.zhou05@hand-china.com
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Table } from 'choerodon-ui';
import { DataSet, Button, Modal, TextField } from 'choerodon-ui/pro';
import { DragSource, DropTarget, DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Header, Content } from 'components/Page';
import { GmDS } from '@/stores/groupingManageDS';
import { groupSearch, groupOperate, groupDelete, groupSort } from '@/services/groupingManage';
import './index.less';

const preCode = 'lwhs.groupingManage';
const { confirm } = Modal;

function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

let BodyRow = (props) => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };
  let { className } = restProps;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }
  return connectDragSource(
    connectDropTarget(<tr {...restProps} className={className} style={style} />)
  );
};

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // eslint-disable-next-line no-param-reassign
    monitor.getItem().index = hoverIndex;
  },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

export default class GroupingManage extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...GmDS,
    });
  }

  state = {
    data: [],
    pagination: {
      page: 0,
      size: 10,
      showSizeChanger: false,
    },
    loading: false,
    categoryName: '',
    isSort: false,
  };

  components = {
    body: {
      row: BodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];
    this.setState(
      update(this.state, {
        data: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        },
      })
    );
  };

  componentDidMount() {
    this.handleSearch();
  }

  async handleSearch(params = {}) {
    this.setState({ loading: true });
    const categoryType = this.getCategoryType(this.props.match.path);
    const { page, size } = this.state.pagination;
    const res = await groupSearch({
      categoryType,
      page,
      size,
      ...params,
    });
    if (res.failed) {
      notification.error({
        message: res.message,
      });
      return;
    }
    this.setState({
      loading: false,
      data: res,
    });
  }

  EditModalContent = ({ modal }) => {
    const record = this.state.categoryName ? modal.props.children.props.record.record : {};
    modal.handleOk(async () => {
      if (!this.state.categoryName) {
        notification.warning({
          message: '请先输入分组名称',
        });
        return false;
      }
      try {
        const categoryType = this.getCategoryType(this.props.match.path);
        const obj = record.id
          ? Object.assign({}, record, {
              categoryName: this.state.categoryName,
            })
          : {
              type: categoryType,
              categoryName: this.state.categoryName,
            };
        const res = await groupOperate(obj);
        if (res.failed) {
          notification.error({
            message: res.message,
          });
          return false;
        }
        notification.success({
          message: '操作成功',
        });
        this.setState({
          categoryName: '',
        });
        modal.close();
        this.handleSearch({ page: 0 });
      } catch (err) {
        console.log(err);
      }
    });
    modal.handleCancel(() => {
      this.setState({
        categoryName: '',
      });
      modal.close();
    });
    const onChange = (e) => {
      this.setState({
        categoryName: e,
      });
    };
    return (
      <div className="group-modal-content">
        <div className="title">
          <span>*</span>分组名称
        </div>
        <div className="edit-area">
          <TextField value={this.state.categoryName} onChange={onChange} />
        </div>
      </div>
    );
  };

  @Bind()
  handleCreate() {
    this.setState(
      {
        categoryName: '',
      },
      () => {
        Modal.open({
          key: 'create',
          title: '新建分组',
          children: <this.EditModalContent />,
        });
      }
    );
  }

  @Bind()
  handleSort() {
    this.setState({ isSort: true });
  }

  @Bind()
  async handleSortFinish() {
    const arr = this.state.data.map((item, index) => ({ ...item, categorySeq: index + 1 }));
    const res = await groupSort(arr);
    if (res.failed) {
      notification.error({
        message: res.message,
      });
      return;
    }
    this.setState({ isSort: false });
    notification.success({
      message: '排序成功',
    });
    this.handleSearch({ page: 0 });
  }

  @Bind()
  handleUpdate(record) {
    this.setState(
      {
        categoryName: record.categoryName,
      },
      () => {
        Modal.open({
          key: 'update',
          title: '编辑分组',
          children: <this.EditModalContent record={{ record }} />,
        });
      }
    );
  }

  @Bind()
  async handleDelete(record) {
    const that = this;
    confirm({
      title: '确定删除吗?',
      content: '',
      onOk() {
        const { id, type } = record;
        groupDelete({ id, type }).then((res) => {
          if (res.failed) {
            notification.error({
              message: res.message,
            });
            return;
          }
          notification.success({
            message: '删除成功',
          });
          that.handleSearch({ page: 0 });
        });
      },
    });
  }

  get columns() {
    return this.state.isSort
      ? [
          {
            title: '分组名称',
            dataIndex: 'categoryName',
            key: 'categoryName',
            align: 'center',
          },
        ]
      : [
          {
            title: '分组名称',
            dataIndex: 'categoryName',
            key: 'categoryName',
            align: 'center',
          },
          {
            title: '操作',
            dataIndex: '',
            key: 'operate',
            width: 200,
            align: 'center',
            render: (record) => {
              return [
                <Button
                  key="update"
                  color="primary"
                  funcType="flat"
                  onClick={() => this.handleUpdate(record)}
                >
                  编辑
                </Button>,
                <Button
                  key="delete"
                  color="primary"
                  funcType="flat"
                  onClick={() => this.handleDelete(record)}
                >
                  删除
                </Button>,
              ];
            },
          },
        ];
  }

  @Bind()
  getCategoryType(path) {
    const index = path.lastIndexOf('/');
    return path.substring(index + 1);
  }

  render() {
    const categoryType = this.getCategoryType(this.props.match.path);
    const { data, loading, isSort, pagination } = this.state;
    return (
      <DndProvider backend={HTML5Backend}>
        <Header
          title={intl
            .get(`${preCode}.view.title.groupingManage`)
            .d(`${categoryType === 'image_text' ? '图文' : '视频'}教程分组管理`)}
        >
          {isSort ? (
            <Button color="primary" onClick={this.handleSortFinish}>
              完成排序
            </Button>
          ) : (
            <div>
              <Button color="primary" onClick={this.handleSort}>
                排序
              </Button>
              <Button icon="add" color="primary" onClick={this.handleCreate}>
                新建分组
              </Button>
            </div>
          )}
        </Header>
        <Content>
          <Table
            columns={this.columns}
            dataSource={data}
            components={this.components}
            onRow={
              isSort
                ? (record, index) => ({
                    index,
                    moveRow: this.moveRow,
                  })
                : ''
            }
            filterBar={false}
            bordered={!isSort}
            pagination={pagination}
            loading={loading}
          />
        </Content>
      </DndProvider>
    );
  }
}
