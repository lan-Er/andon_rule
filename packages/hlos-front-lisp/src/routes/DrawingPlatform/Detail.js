/*
 * @Description: 图纸编辑
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 15:58:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-19 15:42:15
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { useState, useEffect } from 'react';
import { Table, Button, DataSet, Form, TextField, Select, Switch, Spin } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import { HZERO_FILE } from 'utils/config';
import { Upload, Icon } from 'choerodon-ui';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';

import { getSerialNum } from '@/utils/renderer';
import { detailLineDS, detailHeadDS } from '@/stores/drawingPlatformDS';

import styles from './index.less';

const directory = 'item';
const organizationId = getCurrentOrganizationId();

const todoLineDataSetFactory = () => new DataSet({ ...detailLineDS() });
const todoHeadDataSetFactory = () => new DataSet({ ...detailHeadDS() });

const DrawingPlatformEditListPage = (props) => {
  const LineDS = useDataSet(todoLineDataSetFactory);
  const HeadDS = useDataSet(todoHeadDataSetFactory);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const uploadProps = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `bearer ${getAccessToken()}`,
    },
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    accept: ['image/*', 'application/pdf'],
    onSuccess: handleUploadSuccess,
    data: uploadData,
  };

  useEffect(() => {
    const { id } = props.match.params;
    HeadDS.setQueryParameter(id, '');
    if (id === 'create') {
      HeadDS.data = [];
      LineDS.data = [];
      HeadDS.create();
      return;
    }
    setIsDisabled(true);
    handleSearch(id);
  });

  /**
   * 移除文件
   * @param {*} record 当前行记录
   * @param {number} index 当前图片所在位置索引
   */
  function handleRemove(record, index) {
    const urlList = record.get('attribute5').split(';');
    urlList.splice(index, 1);
    record.set('attribute5', urlList.join(';'));
  }

  /**
   * 上传文件
   * @param {*} file
   */
  function uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory,
    };
  }

  /**
   * 图片上传成功
   * @param res 返回response
   * @param file 上传文件信息
   */
  async function handleUploadSuccess(res) {
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      let urlList = LineDS.current.get('attribute5');
      if (!isEmpty(urlList)) {
        urlList += `;${res}`;
      } else {
        urlList = res;
      }
      LineDS.current.set('attribute5', urlList);
      // setRefresh(!refresh);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  }

  /**
   * 查询
   * @param {*} id 图纸头id
   */
  async function handleSearch(id) {
    HeadDS.setQueryParameter('dataId', id);
    const res = await HeadDS.query();
    if (res && res.content && res.content[0]) {
      const { attribute2 } = res.content[0];
      LineDS.setQueryParameter('attribute1', attribute2);
      LineDS.query();
    }
  }

  /**
   * 渲染行图纸链接
   * @param {*} record
   */
  function handleFile(record) {
    const { editing } = record;
    if (editing) {
      return (
        <Upload {...uploadProps}>
          <Button funcType="flat">
            <Icon type="file_upload" /> Upload
          </Button>
        </Upload>
      );
    }
    return handlePreview(record);
  }

  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { header: 'No.', width: 50, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      {
        name: 'attribute2',
        width: 150,
        lock: 'left',
        tooltip: 'overflow',
        editor: (record) => record.status === 'add',
      },
      { name: 'attribute3', width: 150, tooltip: 'overflow', editor: true },
      { name: 'attribute4', width: 150, tooltip: 'overflow', editor: true },
      {
        name: 'attribute5',
        width: 150,
        renderer: ({ record }) => handleFile(record),
        tooltip: 'always',
      },
      { name: 'attribute6', width: 150, tooltip: 'overflow', editor: true },
      { name: 'attribute7', width: 150, tooltip: 'overflow', editor: true },
      {
        name: 'attribute8',
        width: 150,
        tooltip: 'overflow',
        editor: (record) => record.status === 'add',
      },
      {
        name: 'attribute9',
        width: 150,
        tooltip: 'overflow',
        editor: (record) => record.status === 'add',
      },
      { name: 'attribute10', width: 150, tooltip: 'overflow', editor: true },
      { name: 'attribute11', width: 150, tooltip: 'overflow', editor: true },
      { name: 'attribute12', width: 150, lock: 'right' },
      { header: '操作', command: ['edit'], width: 150, lock: 'right' },
    ];
  }

  /**
   * 跳转编辑详情界面
   * @param {*} id 行id
   */
  function handleToEditPage(id) {
    const pathName = `/lisp/drawing-platform/detail/${id}`;
    props.history.push(pathName);
  }

  /**
   * 保存
   */
  function handleSave() {
    setLoading(true);
    HeadDS.submit().then((res) => {
      if (res && res.success && !isEmpty(res.content)) {
        const { dataId } = res.content[0];
        handleToEditPage(dataId);
      }
      setLoading(false);
    });
  }

  /**
   * 图纸预览列表
   * @param {*} record 当前行记录
   */
  function handlePreview(record) {
    const fileList = record.get('attribute5');
    if (isEmpty(fileList)) return fileList;
    const links = fileList.split(';').map((item, index) => {
      return (
        <>
          <a href={item} target="_blank" rel="noopener noreferrer" style={{ margin: '3px 10px' }}>
            {item.split('@').pop()}
          </a>
          <Icon
            type="delete_forever"
            className={styles['file-delete']}
            onClick={() => handleRemove(record, index)}
          />
          <br />
        </>
      );
    });
    return links;
  }

  /**
   * 新增行
   */
  async function handleCreate() {
    const validate = await HeadDS.validate();
    const attribute2 = HeadDS.current && HeadDS.current.get('attribute2');
    if (!attribute2 && !validate) {
      notification.warning({
        message: '请先输入并保存图纸信息',
      });
      return false;
    }
    LineDS.create({ attribute1: attribute2 });
  }

  return (
    <Spin dataSet={HeadDS}>
      <Header title="图纸编辑" backPath="/lisp/drawing-platform/list">
        <Button onClick={handleSave} loading={loading} color="primary">
          保存
        </Button>
      </Header>
      <Content>
        <Form dataSet={HeadDS} columns={5} header="图纸信息">
          <Select name="attribute1" key="attribute1" disabled={isDisabled} />
          <TextField name="attribute2" key="attribute2" disabled={isDisabled} />
          <TextField name="attribute3" key="attribute3" />
          <TextField name="attribute4" key="attribute4" />
          <TextField name="attribute5" key="attribute5" disabled={isDisabled} />
          <Select name="attribute6" key="attribute6" disabled={isDisabled} />
          <TextField name="attribute7" key="attribute7" />
          <TextField name="attribute8" key="attribute8" />
          <TextField name="attribute9" key="attribute9" />
          <Select name="attributeName" key="attributeName" />
          <TextField name="attribute11" key="attribute11" disabled />
          <Select name="attribute12" key="attribute12" />
          <Select name="attributeName13" key="attributeName13" />
          <TextField name="attribute14" key="attribute14" />
          <Select name="attributeName15" key="attributeName15" />
          <TextField name="attribute16" key="attribute16" disabled />
          <TextField name="attribute17" key="attribute17" />
          <TextField name="attribute18" key="attribute18" />
          <Select name="attributeName19" key="attributeName19" />
          <TextField name="attribute20" key="attribute20" disabled />
          <TextField name="attribute21" key="attribute21" />
          <TextField name="attribute22" key="attribute22" />
          <Select name="attribute23" key="attribute23" />
          <Switch name="attribute24" key="attribute24" />
        </Form>
        <Table
          dataSet={LineDS}
          columns={columns()}
          columnResizable="true"
          buttons={[['add', { onClick: () => handleCreate() }]]}
          editMode="inline"
          header="图纸版本"
        />
      </Content>
    </Spin>
  );
};

export default DrawingPlatformEditListPage;
