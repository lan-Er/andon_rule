import React, { useEffect, useRef, useState } from 'react';
import { Button, Upload } from 'hzero-ui';
import { isString, isObject } from 'lodash';
import { getAccessToken } from 'utils/utils';
import { getEnvConfig } from 'utils/iocUtils';
import notification from 'utils/notification';
import intl from 'utils/intl';
import webUploader from './webUploader';

const { API_HOST, HZERO_HFLE } = getEnvConfig();

const FragmentUpload = (props) => {
  const {
    callback = () => {},
    action = `${API_HOST}/hfle/v1/files/multipart`,
    method = 'post',
    headers = {
      Authorization: `bearer ${getAccessToken()}`,
    },
    fileSize = 1000 * 1024 * 1024,
    paramsData = {},
    text = intl.get('hzero.common.upload.txt').d('上传'),
    doneText = intl.get('hzero.common.upload.txt.done').d('已上传'),
    type = '',
    prefixPatch = HZERO_HFLE,
    showUploadList,
    ...others
  } = props;
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [dealUploadList, setDealUploadList] = useState();
  const webUploaderRef = useRef(null);
  useEffect(() => {
    webUploaderRef.current = webUploader;
    webUploaderRef.current.init(prefixPatch);
  }, []); // eslint-disable-line

  useEffect(() => {
    webUploaderRef.current.setParams(paramsData);
  }, [paramsData]);

  useEffect(() => {
    if (typeof showUploadList === 'boolean') {
      if (showUploadList === true) {
        const list = {
          showPreviewIcon: true,
          showRemoveIcon: false,
        };
        setDealUploadList(list);
      } else {
        setDealUploadList(showUploadList);
      }
    } else if (typeof showUploadList === 'object') {
      const list = {
        ...showUploadList,
        showRemoveIcon: false,
      };
      setDealUploadList(list);
    }
  }, [showUploadList]);

  const beforeUpload = (file) => {
    const isLimit = file.size < fileSize;
    if (!isLimit) {
      notification.error({ message: `只支持小于${fileSize / 1024 / 1024}MB的文件！` });
    } else {
      setFileList([...fileList, file]);
    }
    return isLimit;
  };

  const onThisChange = async (info) => {
    const { file, event } = info;
    if (event) {
      setPercent(Math.floor(event.percent));
    }
    if (file.status === 'error') {
      notification.error({ message: '上传失败', description: file.error?.message });
      setLoading(false);
      setPercent(0);
    }
    if (file.status === 'uploading') {
      setLoading(true);
    }
    if (file.status === 'done') {
      setLoading(false);
    }
    if (isString(file.response)) {
      callback(file.response);
      return;
    }
    if (isObject(file.response)) {
      // 上传失败
      if (file.response?.failed) {
        notification.error({ message: file.response.message });
      }
    }
  };

  const customRequest = async ({ onProgress, onError, onSuccess, file }) => {
    // https://github.com/react-component/upload#customrequest
    if (!webUploaderRef.current) {
      onError(new Error('上传失败'));
    } else {
      const { success, data, msg } = await webUploaderRef.current.upload(file, (percentage) => {
        onProgress({ percent: percentage * 100 });
      });
      if (success) {
        onSuccess(data);
      } else {
        onError(new Error(msg));
      }
    }
  };

  const uploadProps = {
    action,
    method,
    headers,
    paramsData,
    beforeUpload,
    onChange: onThisChange,
    customRequest,
    fileList,
    ...others,
    showUploadList: dealUploadList,
  };

  return (
    <React.Fragment>
      <Upload {...uploadProps}>
        <Button loading={loading} type={type} icon="upload">
          {loading ? `${doneText}${percent}%` : text}
        </Button>
      </Upload>
    </React.Fragment>
  );
};

export default FragmentUpload;
