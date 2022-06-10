/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-08-19 15:40:14
 * @LastEditTime: 2020-08-26 10:21:15
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { Form, TextField, TextArea, Icon } from 'choerodon-ui/pro';
import { Upload, Button } from 'choerodon-ui';
import { HZERO_FILE } from 'utils/config';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import notification from 'utils/notification';
import { deleteFile } from 'hlos-front/lib/services/api';
// import { downloadFile } from 'services/api';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const directory = 'problem-tracking';

const DetailModal = ({ newListDS, picture, issueStatus }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (picture) {
      setFileList([
        {
          uid: '-1',
          name: getFileName(picture),
          url: picture,
        },
      ]);
    }
  }, []);

  function handleUploadSuccess(res, file) {
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
  }

  function handleRemove(file) {
    if (issueStatus === 'NEW') {
      deleteFile({ file: file.url, directory });
      newListDS.current.set('picture', '');
      setFileList([]);
    } else {
      notification.error({
        message: '非新建状态下图片不可删除',
      });
    }
  }

  // function downFile(file) {
  //   const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
  //   downloadFile({
  //     requestUrl: api,
  //     queryParams: [
  //       { name: 'bucketName', value: BUCKET_NAME_MDS },
  //       { name: 'directory', value: directory },
  //       { name: 'url', value: file },
  //     ],
  //   });
  // }

  function uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory: '1',
    };
  }

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    accept: 'image/*',
    onSuccess: handleUploadSuccess,
    onRemove: handleRemove,
    // onPreview: downFile,
    data: uploadData,
    fileList,
  };

  return (
    <Form columns={3} dataSet={newListDS}>
      <TextField label="问题状态" name="issueStatusMeaning" disabled />
      <TextField label="重要等级" name="issueRankMeaning" disabled />
      <TextField label="来源单据号" name="sourceDocNum" disabled />
      <TextField label="资源" name="resourceName" disabled />
      <TextField label="提出人" name="submittedWorker" disabled />
      <TextField label="提出时间" name="submittedTime" disabled />
      <TextArea
        colSpan={3}
        label="问题描述"
        name="description"
        style={{ height: '120px' }}
        disabled={issueStatus !== 'NEW'}
      />
      <TextArea
        colSpan={3}
        label="问题原因"
        name="reasonAnalysis"
        style={{ height: '120px' }}
        disabled={issueStatus !== 'NEW'}
      />
      <div newLine colSpan={3}>
        <Upload {...uploadProps}>
          {issueStatus !== 'NEW' ? null : (
            <Button>
              <Icon type="file_upload" />
              上传图片
            </Button>
          )}
        </Upload>
      </div>
      {issueStatus !== 'NEW' && <TextField label="处理人" name="closedWorker" disabled required />}
    </Form>
  );
};

export { DetailModal };
