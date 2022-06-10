/**
 * @Description: 创建点检任务
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-17 21:01:20
 */

import React, { Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Button, Form, TextField, TextArea, Lov, Table } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { queryLovData } from 'hlos-front/lib/services/api';
import { getSerialNum } from '@/utils/renderer';
import codeConfig from '@/common/codeConfig';
import { CreateFormDS, CreateTableDS } from '@/stores/equipmentInspectionDS';
import { createEquInspection } from '../../services/equipmentInspection';

const { lmesEquipmentInspection } = codeConfig.code;

export default class CreateEquipmentIns extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      organizationId: null,
      organizationCode: null,
    };
    this.formDS = new DataSet({
      ...CreateFormDS,
    });
    this.tableDS = new DataSet({
      ...CreateTableDS,
    });
  }

  async componentDidMount() {
    // 获取用户默认组织
    const resp = await queryLovData({
      lovCode: lmesEquipmentInspection.organization,
      defaultFlag: 'Y',
    });
    if (resp && resp.content && resp.content.length) {
      this.formDS.current.set('organizationId', resp.content[0].meOuId);
      this.setState({
        organizationId: resp.content[0].meOuId,
        organizationCode: resp.content[0].meOuCode,
      });
    }
  }

  get columns() {
    return [
      {
        header: '序号',
        renderer: ({ record }) => getSerialNum(record),
        width: 80,
        align: 'center',
      },
      { name: 'inspectionItemName', width: 150, align: 'center' },
      { name: 'inspectionItemAlias', width: 150, align: 'center' },
      { name: 'inspectionItemDescription', align: 'center' },
      { name: 'inspectionClassMeaning', width: 150, align: 'center' },
      { name: 'inspectionResource', width: 150, align: 'center' },
      { name: 'resultType', width: 150, align: 'center' },
      {
        header: '参考值',
        renderer: ({ record }) =>
          `${record.data.defaultLcl ? `${record.data.defaultLcl}-` : ''}${
            record.data.defaultUcl || ''
          }`,
        width: 100,
        align: 'center',
      },
    ];
  }

  handleInsGroupChange = (record) => {
    this.tableDS.queryParameter = { inspectionGroupId: record ? record.inspectionGroupId : '0' };
    this.tableDS.query();
  };

  handleCancel = () => {
    this.props.history.push({
      pathname: '/lmes/equipment-inspection/list',
    });
  };

  handleSave = async () => {
    const validateValue = await this.formDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段没有填写完毕，请完善',
      });
      return;
    }
    const { organizationId, organizationCode } = this.state;
    const { state } = this.props.location;
    const obj = {
      organizationId,
      organizationCode,
      taskTypeId: '',
      taskTypeCode: 'EQUIPMENT_PERIOD_CHECK_TASK',
      taskStatus: 'REALEASED',
      resourceId: this.formDS.current.get('equipmentId'),
      resourceCode: this.formDS.current.get('equipmentCode'),
      prodLineId: this.formDS.current.get('prodLineId'),
      inspectionGroupId: this.formDS.current.get('inspectionGroupId'),
      inspectionGroupCode: this.formDS.current.get('inspectionGroupCode'),
      remark: this.formDS.current.get('remark'),
      workerId: state ? state.workerId : null,
      worker: state ? state.workerCode : null,
    };
    const resp = await createEquInspection(obj);
    if (resp.failed) {
      notification.error({
        message: resp.message,
      });
      return;
    }
    if (resp.taskNum) {
      notification.success({
        message: '创建成功',
      });
      this.handleCancel();
    }
  };

  render() {
    return (
      <Fragment>
        <Header title="创建点检任务">
          <Button color="primary" onClick={this.handleSave}>
            保存
          </Button>
          <Button onClick={this.handleCancel}>取消</Button>
        </Header>
        <Content>
          <Form dataSet={this.formDS} columns={3}>
            <TextField name="taskNum" />
            <Lov name="equipmentObj" key="equipmentObj" placeholder="请选择设备" />,
            <Lov
              name="inspectionGroupObj"
              key="inspectionGroupObj"
              placeholder="请选择点检组"
              onChange={this.handleInsGroupChange}
            />
            ,
            <TextArea name="remark" colSpan={24} placeholder="请输入备注" />
          </Form>
          <Table dataSet={this.tableDS} columns={this.columns} />
        </Content>
      </Fragment>
    );
  }
}
