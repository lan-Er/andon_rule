/*
 * @Description: 配置分配明细
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-05 11:24:00
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-05 11:25:49
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { Table, Checkbox } from 'choerodon-ui';
import { Bind } from 'lodash-decorators';
import update from 'immutability-helper';
import { Header, Content } from 'components/Page';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragSource, DropTarget, DndProvider } from 'react-dnd';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  Button,
  DataSet,
  Lov,
  TextField,
  Form,
  Switch,
  Notification,
  Spin,
} from 'choerodon-ui/pro';

import { configurationAssignDetailHeadDS } from './stores/configurationAssignDS';

import './index.less';

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

@formatterCollections({
  code: ['lisp.drawingPlatform', 'lisp.common'],
})
class ConfigurationAssignDetailPage extends Component {
  state = {
    lineData: [],
    queryId: '',
    loading: false,
    saveLoading: false,
    isDisabled: true,
  };

  headDS = new DataSet({ ...configurationAssignDetailHeadDS() });

  componentDidMount() {
    let { id } = this.props.match.params;
    if (id === 'create') {
      this.setState({
        isDisabled: false,
      });
      id = '';
      return;
    }
    this.handleSearch(id);
  }

  columns = [
    {
      title: '字段编码',
      dataIndex: 'customizationCode',
      key: 'customizationCode',
    },
    {
      title: '字段名字',
      dataIndex: 'customizationName',
      key: 'customizationName',
    },
    {
      title: '是否必输',
      dataIndex: 'mustInputFlag',
      key: 'mustInputFlag',
      align: 'center',
      render: (text) => <Checkbox checked={text} disabled />,
    },
    {
      title: '配置是否有效',
      dataIndex: 'enabledFlag',
      key: 'enabledFlag',
      align: 'center',
      render: (text) => <Checkbox checked={text} disabled />,
    },
    {
      title: '是否显示',
      dataIndex: 'displayFlag',
      key: 'displayFlag',
      align: 'center',
      render: (text, record) => (
        <Checkbox
          onChange={() => this.handleChecked(text, record)}
          checked={text}
          disabled={record.mustInputFlag}
        />
      ),
    },
  ];

  components = {
    body: {
      row: BodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { lineData } = this.state;
    const dragRow = lineData[dragIndex];

    this.setState(
      update(this.state, {
        lineData: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        },
      })
    );
  };

  /**
   * 是否显示选择
   * @param {*} text 当前选择框值
   * @param {object} record 当前行数据
   */
  @Bind()
  handleChecked(text, record) {
    const { lineData } = this.state;
    const index = lineData.findIndex((item) => item.customizationId === record.customizationId);
    if (index !== -1) {
      lineData[index].displayFlag = !text;
      this.setState({
        lineData,
      });
    }
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch(id) {
    this.setState({ loading: true }, async () => {
      this.headDS.setQueryParameter('ctgPgId', id);
      const res = await this.headDS.query();
      if (res && !res.failed) {
        const { list, ...rest } = res;
        this.headDS.data = [{ ...rest }];
        this.setState({
          lineData: list.map((item, index) => ({ ...item, key: index })) || [],
          loading: false,
        });
      }
    });
  }

  /**
   * 查询行数据
   * @param {object} value 模版值集选择的行数据
   */
  @Bind()
  handleSearchLine(value) {
    this.setState({ loading: true }, () => {
      const { dispatch } = this.props;
      if (isEmpty(value) || !value.templateId) return false;
      const { templateId } = value;
      const categoryTemplateId = this.headDS.current.get('categoryTemplateId');
      dispatch({
        type: 'configuration/saveAssignLine',
        payload: {
          templateId,
          categoryTemplateId,
        },
      }).then((res) => {
        if (!isEmpty(res) && !res.failed && !isEmpty(res.list)) {
          this.setState({
            lineData: res.list.map((item, index) => ({ ...item, key: index })) || [],
            loading: false,
          });
        } else {
          this.setState({
            lineData: [],
            loading: false,
          });
        }
      });
    });
  }

  /**
   * 查询行数据-选择模版类型
   * @param {object} value 模版值集选择的行数据
   */
  @Bind()
  handleSearchLineCate(value) {
    this.setState({ loading: true }, () => {
      const { dispatch } = this.props;
      if (isEmpty(value) || !value.categoryTemplateId) return false;
      const { categoryTemplateId } = value;
      const templateId = this.headDS.current.get('templateId');
      if (isEmpty(templateId)) return false;
      dispatch({
        type: 'configuration/saveAssignLine',
        payload: {
          templateId,
          categoryTemplateId,
        },
      }).then((res) => {
        if (!isEmpty(res) && !res.failed && !isEmpty(res.list)) {
          this.setState({
            lineData: res.list.map((item, index) => ({ ...item, key: index })) || [],
            loading: false,
          });
        } else {
          this.setState({
            lineData: [],
            loading: false,
          });
        }
      });
    });
  }

  /**
   * 模版分配头
   * @returns
   */
  @Bind()
  formFields() {
    const { isDisabled } = this.state;
    return [
      <Lov name="tenant" key="tenant" noCache disabled={isDisabled} />,
      <TextField name="categoryPageCode" key="categoryPageCode" disabled={isDisabled} />,
      <TextField name="categoryPageDesc" key="categoryPageDesc" />,
      <Lov name="category" key="category" onChange={this.handleSearchLineCate} />,
      <Lov name="template" key="template" onChange={this.handleSearchLine} />,
      <TextField name="templateName" key="templateName" disabled />,
      <Switch name="enabledFlag" key="enabledFlag" />,
    ];
  }

  /**
   * 保存
   */
  @Bind()
  handleSave() {
    this.setState({ saveLoading: true, loading: true }, () => {
      return new Promise((resolve) => {
        const { lineData } = this.state;
        this.headDS.validate(false, false).then((validate) => {
          if (!validate) {
            resolve(this.setState({ saveLoading: false }));
            return false;
          }
          const headData = this.headDS.toData();
          const {
            match: {
              params: { id },
            },
            dispatch,
          } = this.props;
          dispatch({
            type: 'configuration/saveAssignDetail',
            payload: {
              ...headData[0],
              _status: id === 'create' ? 'create' : 'update',
              list: lineData.map((item, index) => ({ ...item, sequence: index + 1 })),
            },
          }).then((res) => {
            if (res && !res.failed) {
              Notification.success({
                message: '保存成功',
                placement: 'bottomRight',
              });
              const { ctgPgId } = res;
              if (id === 'create') {
                const pathname = `/lmds/configuration-assign/detail/${ctgPgId}`;
                this.props.history.push(pathname);
              } else {
                this.handleSearch(ctgPgId);
              }
            }
            resolve(this.setState({ saveLoading: false, loading: false }));
          });
        });
      });
    });
  }

  render() {
    const { lineData, loading, saveLoading } = this.state;
    return (
      <Spin dataSet={this.headDS} spinning={loading}>
        <DndProvider backend={HTML5Backend}>
          <Header title="配置分配明细" backPath="/lmds/configuration-assign/list">
            <Button onClick={this.handleSave} color="primary" loading={saveLoading}>
              保存
            </Button>
          </Header>
          <Content>
            <Form dataSet={this.headDS} columns={4} style={{ flex: 'auto' }} header="功能配置">
              {this.formFields()}
            </Form>
            <p className="c7n-pro-form-header">配置详情</p>
            <Table
              columns={this.columns}
              dataSource={lineData}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow,
              })}
              filterBar={false}
              pagination={false}
              bordered
            />
          </Content>
        </DndProvider>
      </Spin>
    );
  }
}

export default ConfigurationAssignDetailPage;
