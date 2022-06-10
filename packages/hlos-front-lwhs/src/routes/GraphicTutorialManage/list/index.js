/**
 * 图文教程管理
 * @since: 2020-07-09 11:04:50
 * @author: wei.zhou05@hand-china.com
 */

import React, { Component, Fragment } from 'react';
import { DataSet, Table, Button, Select } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { GtmDS } from '@/stores/graphicTutorialManageDS';
import notification from 'utils/notification';
import {
  groupSearch,
  releaseOrCancel,
  topOrCancel,
  deleteImageTextCourse,
} from '@/services/graphicTutorialList';

const preCode = 'lwhs.graphicTutorial';
const { Option } = Select;

export default class GraphicTutorialManage extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...GtmDS,
    });
  }

  state = {
    categoryArr: [],
  };

  componentDidMount() {
    this.initData();
  }

  async initData() {
    const res = await groupSearch({ categoryType: 'image_text' });
    if (res.failed) {
      notification.error({
        message: res.message,
      });
      return;
    }
    this.setState({ categoryArr: res });
  }

  @Bind()
  handleCreate() {
    this.props.history.push(`/lwhs/graphic-tutorial-list/detail/create`);
  }

  @Bind()
  handleGoGrouping() {
    this.props.history.push(`/lwhs/grouping-manage/image_text`);
  }

  @Bind()
  handleUpdate(record) {
    this.props.history.push(`/lwhs/graphic-tutorial-list/detail/${record.data.id}`);
  }

  @Bind()
  async handleReleaseOrCancel(record, releaseFlag) {
    try {
      const res = await releaseOrCancel({
        releaseFlag,
        ids: [record.data.id],
      });
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: releaseFlag ? '发布成功' : '取消发布成功',
      });
      this.tableDS.query();
    } catch (err) {
      console.log(err);
    }
  }

  @Bind()
  async handleTopOrCancel(record, topFlag) {
    try {
      const res = await topOrCancel({
        topFlag,
        ids: [record.data.id],
      });
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: topFlag ? '置顶成功' : '取消置顶成功',
      });
      this.tableDS.query();
    } catch (err) {
      console.log(err);
    }
  }

  @Bind()
  async handleDelete(record) {
    try {
      const res = await deleteImageTextCourse([record.data.id]);
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: '删除成功',
      });
      this.tableDS.query();
    } catch (err) {
      console.log(err);
    }
  }

  @Bind()
  getButtons(record) {
    const { releaseFlag, topFlag } = record.data;
    const returnBtn = [];
    const btns = [
      <Button
        key="update"
        color="primary"
        funcType="flat"
        onClick={() => this.handleUpdate(record)}
        style={{
          display: 'inline-block',
          marginTop: '-6px',
        }}
      >
        编辑
      </Button>,
      <Button
        key="release"
        color="primary"
        funcType="flat"
        onClick={() => this.handleReleaseOrCancel(record, 1)}
        style={{
          display: 'inline-block',
          marginTop: '-6px',
        }}
      >
        发布
      </Button>,
      <Button
        key="cancel"
        color="primary"
        funcType="flat"
        onClick={() => this.handleReleaseOrCancel(record, 0)}
        style={{
          display: 'inline-block',
          marginTop: '-6px',
        }}
      >
        取消发布
      </Button>,
      <Button
        key="top"
        color="primary"
        funcType="flat"
        onClick={() => this.handleTopOrCancel(record, 1)}
        style={{
          display: 'inline-block',
          marginTop: '-6px',
        }}
      >
        置顶
      </Button>,
      <Button
        key="topcancel"
        color="primary"
        funcType="flat"
        onClick={() => this.handleTopOrCancel(record, 0)}
        style={{
          display: 'inline-block',
          marginTop: '-6px',
        }}
      >
        取消置顶
      </Button>,
      <Button
        key="delete"
        color="primary"
        funcType="flat"
        onClick={() => this.handleDelete(record)}
        style={{
          display: 'inline-block',
          marginTop: '-6px',
        }}
      >
        删除
      </Button>,
    ];
    // 已发布和置顶：只能进行取消发布和取消置顶的操作
    if (releaseFlag && topFlag) {
      returnBtn.push(btns[2]);
      returnBtn.push(btns[4]);
      return returnBtn;
    }
    // 已发布和未置顶：只能进行取消发布和置顶的操作
    if (releaseFlag && !topFlag) {
      returnBtn.push(btns[2]);
      returnBtn.push(btns[3]);
      return returnBtn;
    }
    // 未发布：只能进行发布和编辑和删除的操作
    if (!releaseFlag) {
      returnBtn.push(btns[0]);
      returnBtn.push(btns[1]);
      returnBtn.push(btns[5]);
      return returnBtn;
    }
  }

  get columns() {
    return [
      {
        name: 'coverAndTitle',
        align: 'center',
        renderer: ({ record }) => (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-6px' }}>
            <div style={{ marginRight: '20px' }}>
              <img
                src={record.data.cover}
                alt=""
                style={{
                  width: '180px',
                  height: '100px',
                }}
              />
            </div>
            <div>{record.data.title}</div>
          </div>
        ),
      },
      { name: 'categoryName', width: 150, align: 'center' },
      // { name: 'title', width: 150, align: 'center' },
      // { name: 'author', width: 150, align: 'center' },
      { name: 'releaseDate', width: 150, align: 'center' },
      {
        header: '操作',
        width: 300,
        command: ({ record }) => {
          return this.getButtons(record);
        },
        lock: 'right',
      },
    ];
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.graphicTutorialManage`).d('图文教程管理')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            新建图文教程
          </Button>
          <Button onClick={this.handleGoGrouping}>编辑分组</Button>
        </Header>
        <Content>
          <Table
            rowHeight="auto"
            border={false}
            dataSet={this.tableDS}
            columns={this.columns}
            queryFieldsLimit={4}
            queryFields={{
              categoryObj: (
                <Select name="categoryObj">
                  {this.state.categoryArr.map((item) => {
                    return (
                      <Option key={item} value={item}>
                        {item.categoryName}
                      </Option>
                    );
                  })}
                </Select>
              ),
            }}
          />
        </Content>
      </Fragment>
    );
  }
}
