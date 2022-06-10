/*
 * @Descripttion:物料类别-详情
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-16 09:26:56
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-16 10:05:05
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { DataSet, Table, CheckBox, Button, Tooltip, TextField } from 'choerodon-ui/pro';
import { Row, Col, Form, Input } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { EDIT_FORM_ITEM_LAYOUT } from 'utils/constants';
import { Header, Content } from 'components/Page';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import CategoryDS from '../stores/CategoryDS';

const preCode = 'lmds.category';

@connect()
@formatterCollections({
  code: ['lmds.common', 'lmds.category'],
})
export default class Category extends Component {
  state = {
    categorySetCode: '',
    categorySetName: '',
    segmentNum: '',
    segmentLimitFlag: false,
    enabledFlag: false,
  };

  tableDS = new DataSet({
    ...CategoryDS(),
  });

  async componentDidMount() {
    const {
      location: { search },
    } = this.props;

    // 从类别集页面接收到的参数
    const categorySetDataStr = new URLSearchParams(search).get('categorySetData');
    if (categorySetDataStr) {
      const categorySetData = JSON.parse(decodeURIComponent(categorySetDataStr));

      this.tableDS.queryParameter = {
        categorySetId: categorySetData.categorySetId,
        categorySetCode: categorySetData.categorySetCode,
      };
      await this.tableDS.query();

      this.setState({
        categorySetCode: categorySetData.categorySetCode,
        categorySetName: categorySetData.categorySetName,
        segmentNum: categorySetData.segmentNum,
        segmentLimitFlag: categorySetData.segmentLimitFlag,
        enabledFlag: categorySetData.enabledFlag,
      });

      if (categorySetData.segmentLimitFlag) {
        // 如果段数限定为true 则对应的段数必输
        for (let i = 1; i <= categorySetData.segmentNum; i++) {
          this.tableDS.fields.get(`segment${i}`).set('required', true);
        }
      }
    }
  }

  /**
   * 判断segment是否可输入
   * @param {*} record 该条记录
   * @param {*} name 该条记录名称
   */
  @Bind()
  editorRendererSegment(record, name) {
    const segmentNum = Number(this.state.segmentNum);
    const num = Number(name.split('t')[1]);
    return segmentNum >= num ? <TextField /> : null;
  }

  get columns() {
    return [
      { name: 'categoryCode', width: 150, lock: true },
      { name: 'categoryName', width: 150, editor: true, lock: true },
      { name: 'description', width: 150, editor: true },
      // { name: 'organizationObj', width: 150, editor: <Lov noCache /> },
      { name: 'segment1', width: 150, editor: true },
      { name: 'segment2', width: 150, editor: this.editorRendererSegment },
      { name: 'segment3', width: 150, editor: this.editorRendererSegment },
      { name: 'segment4', width: 150, editor: this.editorRendererSegment },
      { name: 'segment5', width: 150, editor: this.editorRendererSegment },
      { name: 'segment6', width: 150, editor: this.editorRendererSegment },
      { name: 'segment7', width: 150, editor: this.editorRendererSegment },
      { name: 'segment8', width: 150, editor: this.editorRendererSegment },
      { name: 'segment9', width: 150, editor: this.editorRendererSegment },
      { name: 'segment10', width: 150, editor: this.editorRendererSegment },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            'edit',
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.delete').d('删除')}>
              <Button
                icon="delete"
                color="primary"
                funcType="flat"
                onClick={() => this.handleDelLine(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const validateValue = await this.tableDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }

    const res = await this.tableDS.submit();
    if (res === undefined) {
      notification.warning({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
    } else if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else {
      await this.tableDS.query();
    }
  }

  /**
   * 删除
   */
  @Bind()
  async handleDelLine(record) {
    try {
      const res = await this.tableDS.delete([record]);
      if (!isEmpty(res) && res.failed && res.message) {
        throw res;
      } else {
        this.tableDS.query();
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
  }

  render() {
    const {
      categorySetCode,
      categorySetName,
      segmentNum,
      segmentLimitFlag,
      enabledFlag,
    } = this.state;
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.category`).d('类别集')}
          backPath="/zmda/category-set/list"
        />
        <Content>
          <Row>
            <Col span={5}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${preCode}.model.categorySet`).d('类别')}
              >
                <Input value={categorySetCode} disabled />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${preCode}.model.categorySetName`).d('类别名称')}
              >
                <Input value={categorySetName} disabled />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${preCode}.model.categorySetSegmentNum`).d('段数')}
              >
                <Input value={segmentNum} disabled />
              </Form.Item>
            </Col>
            <Col span={8} offset={1}>
              <Col span={12}>
                <Form.Item
                  {...EDIT_FORM_ITEM_LAYOUT}
                  label={intl.get(`${preCode}.model.categorySetSegmentLimit`).d('段数限定')}
                >
                  <CheckBox checked={segmentLimitFlag} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...EDIT_FORM_ITEM_LAYOUT}
                  label={intl.get('lmds.common.model.enabledFlag').d('是否有效')}
                >
                  <CheckBox checked={enabledFlag} disabled />
                </Form.Item>
              </Col>
            </Col>
          </Row>
          <Table
            dataSet={this.tableDS}
            buttons={['add']}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
