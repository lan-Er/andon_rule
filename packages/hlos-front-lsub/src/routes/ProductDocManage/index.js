/**
 * 产品文档管理
 * @since: 2020-06-29 15:19:38
 * @author: wei.zhou05@hand-china.com
 */

import React, { Component, Fragment } from 'react';
import { DataSet, Table, Button, Form, TextField, Select } from 'choerodon-ui/pro';
import { Modal, Upload, Icon, Spin } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { API_HOST } from 'utils/config';
import { HLOS_LSUB } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { PdmDS } from '@/stores/productDocManageDS';
import FormDS from '@/stores/formDS';
import { productOperate, productDelete } from '@/services/productDoc';
import style from './index.less';

const preCode = 'lsub.productDoc';
const { Sidebar } = Modal;
const { confirm } = Modal;

export default class ProductDocManage extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...PdmDS,
    });
    this.formDS = new DataSet({
      ...FormDS(),
    });
  }

  state = {
    visible: false,
    loading: false,
  };

  async componentDidMount() {
    await this.formDS.create({});
  }

  get columns() {
    return [
      { name: 'docCodeMeaning', width: 150 },
      { name: 'docName', width: 100 },
      { name: 'fileSize', width: 100 },
      { name: 'emailMessageTemplateCode', width: 300 },
      { name: 'docDownloadUrl' },
    ];
  }

  @Bind()
  handleProgress() {
    this.setState({ loading: true });
  }

  @Bind()
  handleUploadSuccess(res) {
    this.setState({ loading: false });
    this.formDS.current.set('docDownloadUrl', res.fileUrl);
    this.formDS.current.set('fileSize', res.fileSize);
    notification.success({
      message: '上传成功',
    });
  }

  @Bind()
  async handleCreate() {
    this.formDS.current.reset();
    this.setState({
      visible: true,
    });
  }

  @Bind()
  async handleDelete() {
    const that = this;
    if (!this.tableDS.selected.length) {
      notification.warning({
        message: '至少选择一条数据',
      });
      return;
    }
    confirm({
      title: '确定删除吗?',
      content: '',
      onOk() {
        const { id } = that.tableDS.selected[0].data;
        productDelete({ id }).then((res) => {
          if (res) {
            notification.success({
              message: '删除成功',
            });
            that.tableDS.query();
          }
        });
      },
    });
  }

  @Bind()
  async handleOk() {
    const validateValue = await this.formDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }
    try {
      const baseObj = {
        docCode: this.formDS.current.get('docCode'),
        docDownloadUrl: this.formDS.current.get('docDownloadUrl'),
        docName: this.formDS.current.get('docName'),
        emailMessageTemplateCode: this.formDS.current.get('emailMessageTemplateCode'),
        fileSize: this.formDS.current.get('fileSize'),
        tenantId: getCurrentOrganizationId(),
      };
      const id = this.formDS.current.get('id');
      const obj = id
        ? Object.assign({}, baseObj, {
            id,
            objectVersionNumber: this.formDS.current.get('objectVersionNumber'),
          })
        : baseObj;
      const res = await productOperate(obj);
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: '提交成功',
      });
      this.setState({
        visible: false,
      });
      this.tableDS.query();
    } catch (err) {
      console.log(err);
    }
  }

  @Bind()
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  @Bind()
  handleRowClick(record) {
    const that = this;
    return {
      onClick: () => {
        that.setState({
          visible: true,
        });
        that.formDS.current.set('id', record.data.id);
        that.formDS.current.set('objectVersionNumber', record.data.objectVersionNumber);
        that.formDS.current.set('docName', record.data.docName);
        that.formDS.current.set('docCode', record.data.docCode);
        that.formDS.current.set('docDownloadUrl', record.data.docDownloadUrl);
        that.formDS.current.set('fileSize', record.data.fileSize);
        that.formDS.current.set('emailMessageTemplateCode', record.data.emailMessageTemplateCode);
      },
    };
  }

  render() {
    const uploadProps = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${API_HOST}${HLOS_LSUB}/v1/${getCurrentOrganizationId()}/uploadAttachment`,
      accept: 'application/pdf',
      showUploadList: false,
      fileListMaxLength: 1,
      onProgress: this.handleProgress,
      onSuccess: this.handleUploadSuccess,
    };
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.produtdoc`).d('产品文档')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            新建
          </Button>
          <Button onClick={this.handleDelete}>删除</Button>
        </Header>
        <Content>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            queryFieldsLimit={4}
            onRow={({ record }) => this.handleRowClick(record)}
          />
          <Sidebar
            title={`${
              this.formDS.current && this.formDS.current.get('id') ? '修改' : '新增'
            }产品文档`}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            cancelText="取消"
            okText="确定"
            width={600}
            closable
          >
            <Form dataSet={this.formDS}>
              <TextField name="docName" />
              <Select name="docCode" />
              <TextField name="docDownloadUrl" disabled />
              <TextField name="fileSize" disabled />
              <TextField name="emailMessageTemplateCode" />
            </Form>
            <div style={{ marginLeft: '151px', marginTop: '10px' }}>
              <Upload {...uploadProps}>
                <Button>
                  <Icon type="file_upload" /> 上传PDF文件
                </Button>
              </Upload>
            </div>
            {this.state.loading ? (
              <div className={style['upload-loading']}>
                <Spin size="large" />
              </div>
            ) : null}
          </Sidebar>
        </Content>
      </Fragment>
    );
  }
}
