/**
 * 图文教程详情--新建和编辑
 * @since: 2020-07-09 15:37:57
 * @author: wei.zhou05@hand-china.com
 */

import React, { Component, Fragment } from 'react';
import Form from 'hzero-ui/es/form';
import Input from 'hzero-ui/es/input';
import { Select } from 'choerodon-ui';
import { Button } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import RichTextEditor from 'components/RichTextEditor';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import UploadImg from 'hippius-front/lib/components/UploadImg';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  groupSearch,
  graphicOperate,
  getGraphicDetail,
  releaseOrCancel,
} from '@/services/graphicTutorialDetail';
import './index.less';

const preCode = 'lwhs.graphicTutorialDetail';
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create({ fieldNameProp: null })
export default class GraphicTutorialDetail extends Component {
  state = {
    categoryArr: [],
    detailData: {},
  };

  componentDidMount() {
    this.initData();
  }

  async initData() {
    const { id } = this.props.match.params;
    if (id && id !== 'create') {
      const detail = await getGraphicDetail({ id });
      if (detail.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      this.setState({ detailData: detail });
    }
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
  categoryChange(e) {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ categoryId: e });
  }

  @Bind()
  uploadChange(e) {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ cover: e });
  }

  @Bind()
  editorChange(e) {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ content: e });
  }

  @Bind()
  handleEditorOk() {
    this.richTextEditor.editor.setData(this.state.detailData.content);
  }

  @Bind()
  handleSave() {
    this.props.form.validateFields({ force: true }, async (err, values) => {
      if (err) {
        notification.error({
          message: '存在必输字段未填写或字段输入不合法！',
        });
        return;
      }
      const { id } = this.props.match.params;
      const data =
        id !== 'create'
          ? Object.assign({}, this.state.detailData, values)
          : Object.assign({}, values, {
              tenantId: getCurrentOrganizationId(),
              topFlag: false,
              releaseFlag: false,
            });
      try {
        const res = await graphicOperate(data);
        if (res.failed) {
          notification.error({
            message: res.message,
          });
          return;
        }
        notification.success({
          message: '保存成功',
        });
        this.props.history.push(`/lwhs/graphic-tutorial-list/list`);
      } catch (error) {
        console.log(error);
      }
    });
  }

  @Bind()
  handleRelease() {
    this.props.form.validateFields({ force: true }, async (err, values) => {
      console.log(values);
      if (err) {
        notification.error({
          message: '存在必输字段未填写或字段输入不合法！',
        });
        return;
      }
      const { id } = this.props.match.params;
      if (id === 'create') {
        notification.warning({
          message: '请先保存再发布',
        });
        return;
      }
      try {
        const res = await releaseOrCancel({
          releaseFlag: 1,
          ids: [id],
        });
        if (res.failed) {
          notification.error({
            message: res.message,
          });
          return;
        }
        notification.success({
          message: '发布成功',
        });
        this.props.history.push(`/lwhs/graphic-tutorial-list/list`);
      } catch (error) {
        console.log(error);
      }
    });
  }

  render() {
    const { id } = this.props.match.params;
    const title = id === 'create' ? '新建图文' : '图文详情';
    const { categoryArr, detailData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.graphicTutorialDetail`).d(`${title}`)}
          backPath="/lwhs/graphic-tutorial-list"
        />
        <Content>
          <Form>
            <FormItem {...formItemLayout} label="所属分组">
              {getFieldDecorator('categoryId', {
                rules: [{ required: true, message: '请选择所属分组' }],
                initialValue: detailData.categoryId || undefined,
              })(
                <Select onChange={this.categoryChange} style={{ width: 200 }}>
                  {categoryArr.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.categoryName}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="标题">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入标题' }],
                initialValue: detailData.title || '',
              })(<Input style={{ width: 600 }} placeholder="请输入标题" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="作者">
              {getFieldDecorator('author', {
                rules: [],
                initialValue: detailData.author || '',
              })(<Input style={{ width: 600 }} placeholder="请输入作者" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="封面">
              {getFieldDecorator('cover', {
                rules: [{ required: true, message: '请上传封面' }],
                initialValue: detailData.cover || undefined,
              })(
                <UploadImg
                  options={{
                    requiredType: ['JPG', 'PNG'],
                    size: {
                      width: '900',
                      height: '500',
                    },
                  }}
                  bucketName="lwhs"
                  editing
                  onChange={this.uploadChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="简介">
              {getFieldDecorator('remark', {
                rules: [],
                initialValue: detailData.remark || '',
              })(<TextArea style={{ width: 600, height: 80 }} placeholder="请输入简介" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="正文">
              {getFieldDecorator('content', {
                rules: [{ required: true, message: '请输入正文' }],
              })(
                <RichTextEditor
                  bucketName="lwhs"
                  ref={(node) => {
                    this.richTextEditor = node;
                  }}
                  readOnly={false}
                  onEditorChange={this.editorChange}
                  onInstanceReady={this.handleEditorOk}
                  content={detailData && detailData.content ? detailData.content : ''}
                />
              )}
            </FormItem>
          </Form>
          <div className="footer-btn">
            <Button color="primary" className="save-btn" onClick={this.handleSave}>
              保存
            </Button>
            <Button color="primary" className="release-btn " onClick={this.handleRelease}>
              发布
            </Button>
          </div>
        </Content>
      </Fragment>
    );
  }
}
