/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-08-17 14:23:07
 * @LastEditTime: 2020-08-26 10:21:41
 * @Description:
 */
import React, { useState } from 'react';
import { Row, Col, Upload, Button } from 'choerodon-ui';
import { Lov, TextField, TextArea, Select, Icon } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import notification from 'utils/notification';
import { HZERO_FILE } from 'utils/config';
import { deleteFile } from 'hlos-front/lib/services/api';
// import { downloadFile } from 'services/api';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';

import './Modal.less';

const organizationId = getCurrentOrganizationId();
const directory = 'problem-tracking';

const CreateModal = ({ newListDS }) => {
  const [fileList, setFileList] = useState([]);
  const [titleNumber, setTitleNumber] = useState(0);
  // 获取标题字数
  function getTitleNumber(e) {
    const titleLength = e.target.value.length;
    setTitleNumber(titleLength);
  }

  // 上传文件
  const handleUploadSuccess = (res, file) => {
    const currentFile = file;
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      newListDS.current.set('picture', res);
      currentFile.url = res;
      setFileList([currentFile]);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  };

  // 移除文件
  const handleRemove = (file) => {
    deleteFile({ file: file.url, directory });
    newListDS.current.set('picture', '');
    setFileList([]);
  };

  // 下载文件
  // const downFile = (file) => {
  //   const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
  //   downloadFile({
  //     requestUrl: api,
  //     queryParams: [
  //       { name: 'bucketName', value: BUCKET_NAME_MDS },
  //       { name: 'directory', value: directory },
  //       { name: 'url', value: file },
  //     ],
  //   });
  // };

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory: '1',
    };
  };

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: 'image/*',
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    onSuccess: handleUploadSuccess,
    onRemove: handleRemove,
    // onPreview: downFile,
    data: uploadData,
    fileList,
  };

  return (
    <div>
      <Row gutter={8} className="modal-row">
        <Col className="gutter-row" span={3}>
          <span className="title-row">
            <span style={{ color: '#d50000' }}>*</span> 问题类型:
          </span>
        </Col>
        <Col className="gutter-row" span={5}>
          <Select dataSet={newListDS} name="issueType" placeholder="请选择" />
        </Col>
        {/* <Col className="gutter-row" span={3}>
          <span className="title-row">
            <span style={{ color: '#d50000' }}>*</span> 优先级
          </span>
        </Col>
        <Col className="gutter-row" span={5}>
          <TextField dataSet={newListDS} name="issuePriority" />
        </Col> */}
        <Col className="gutter-row" span={3}>
          <span className="title-row">
            <span style={{ color: '#d50000' }}>*</span> 重要等级
          </span>
        </Col>
        <Col className="gutter-row" span={5}>
          <Select dataSet={newListDS} name="issueRank" placeholder="请选择" />
        </Col>
        <Col className="gutter-row" span={3}>
          <span className="title-row">来源单据号</span>
        </Col>
        <Col className="gutter-row" span={5}>
          <Lov dataSet={newListDS} name="docObj" noCache />
        </Col>
      </Row>
      <Row gutter={8} className="modal-row">
        <Col className="gutter-row" span={3}>
          <span className="title-row">资源</span>
        </Col>
        <Col className="gutter-row" span={5}>
          <Lov dataSet={newListDS} name="resourceObj" noCache />
        </Col>
      </Row>
      <Row gutter={8} className="modal-row">
        <Col className="gutter-row" span={3}>
          <span className="title-row">
            <span style={{ color: '#d50000' }}>*</span> 问题标题
          </span>
        </Col>
        <Col className="gutter-row" span={20}>
          <TextField
            maxLength={40}
            dataSet={newListDS}
            name="issueTopic"
            className="problem-title"
            onInput={getTitleNumber}
          />
        </Col>
        <Col span={1}>
          <span style={{ lineHeight: '25px' }}>{titleNumber || 0}/40</span>
        </Col>
      </Row>
      <Row gutter={8} className="modal-row big-box">
        <Col className="gutter-row" span={3}>
          <span className="title-row">问题描述</span>
        </Col>
        <Col className="gutter-row area-box" span={21}>
          <TextArea dataSet={newListDS} name="description" className="text-area" />
        </Col>
      </Row>
      <Row gutter={8} className="modal-row big-box">
        <Col className="gutter-row" span={3}>
          <span className="title-row">问题原因</span>
        </Col>
        <Col className="gutter-row area-box" span={21}>
          <TextArea dataSet={newListDS} name="reasonAnalysis" className="text-area" />
        </Col>
      </Row>
      <Row className="modal-row">
        <Col span={3} />
        <Upload {...uploadProps}>
          <Button>
            <Icon type="file_upload" />
            上传图片
          </Button>
        </Upload>
      </Row>
      <Row gutter={8} className="modal-row">
        <Col className="gutter-row" span={3}>
          <span className="title-row">
            <span style={{ color: '#d50000' }}>*</span> 提出人
          </span>
        </Col>
        <Col className="gutter-row area-box" span={5}>
          <TextField disabled dataSet={newListDS} name="submittedWorker" />
        </Col>
        {/* <Col className="gutter-row" span={3}>
          <span className="title-row">联系电话</span>
        </Col>
        <Col className="gutter-row area-box" span={5}>
          <TextField dataSet={newListDS} name="phoneNumber" maxLength={11} className="text-area" />
        </Col> */}
      </Row>
    </div>
  );
};

export { CreateModal };
