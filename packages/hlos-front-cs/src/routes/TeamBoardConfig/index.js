/*
 * @module-:班组看板配置
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-25 15:24:23
 * @LastEditTime: 2021-03-15 14:12:45
 * @copyright: Copyright (c) 2018,Hand
 */
import { HZERO_FILE } from 'utils/config';
import { Content, Header } from 'components/Page';
import { Card, Col, Row } from 'choerodon-ui';
import { Button, Upload } from 'choerodon-ui/pro';
import { deleteFile } from 'hlos-front/lib/services/api';
import React, { Fragment, useState, useEffect } from 'react';
import { BUCKET_NAME_CSV, HLOS_LCSV } from 'hlos-front/lib/utils/config';

import { connect } from 'dva';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

function TeamBoardConfig(props) {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadSuccessList, setUploadSuccessList] = useState({
    five: null,
    quality: null,
  });
  const [uploadImgAll, setUploadImgAll] = useState(false);
  const [department, setDepartment] = useState('');
  const [parseImgList, setParseImgList] = useState({});
  useEffect(() => {
    handleChangeSetUpload();
  }, [uploadSuccessList]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('teamMeetingBoardImgList');
    };
  }, []);

  /**
   *更新列表
   *
   */
  function handleChangeSetUpload() {
    const { five, quality } = uploadSuccessList;
    if (five && quality) {
      setUploadImgAll(true);
    } else {
      setUploadImgAll(false);
    }
  }
  /**
   *跳转到晨会看板页
   *
   */
  function goWorkShopMorningMeeting() {
    const { history, dispatch } = props;
    const { five, quality } = uploadSuccessList;
    const imageDtoList = [];
    const urlList = [quality, five];
    for (let i = 0; i < urlList.length; i++) {
      imageDtoList.push({ imageUrl: urlList[i], location: i + 1 });
    }
    const params = {
      department,
      imageDtoList,
    };
    dispatch({
      type: 'workshopMorningConfigModel/saveWorkShopMorningBoardImgList',
      payload: params,
    }).then((res) => {
      if (res) {
        history.push('/cs/team-morning-meeting-board');
      } else {
        notification.error({ message: '存在未上传的文件' });
      }
    });
  }

  /**
   *上传成功
   *
   */
  async function handleSuccess(res) {
    if (res && res.includes('failed')) {
      const newRes = JSON.parse(res);
      notification.error({ message: `EXCEL上传成功，但是${newRes.message}，请重新上传正确的格式` });
      return;
    }
    const { dispatch } = props;
    const queryImgListRes = await dispatch({
      type: 'teamMorningMeetingBoardModels/getTeamBoardImgList',
      payload: { workgroup: res },
    });
    if (queryImgListRes) {
      setUploadSuccess(true);
      setDepartment(res);
      const { imageJsonString } = queryImgListRes;
      const imgListParse =
        imageJsonString && imageJsonString.includes('imageUrl') ? JSON.parse(imageJsonString) : [];
      imgListParse.forEach((item) => {
        const { imageUrl } = item;
        const isHaveMoreImg = imageUrl ? imageUrl.includes('|') : false;
        let imgArray = [];
        if (imageUrl && isHaveMoreImg) {
          imgArray = imageUrl.split('|');
        } else if (imageUrl && !isHaveMoreImg) {
          imgArray = [imageUrl];
        }
        for (let i = 0; i < imgArray.length; i++) {
          handleRemoveFile(null, null, imgArray[i]);
        }
      });
    }
  }

  /**
   *EXCEL上传失败
   *
   */
  function handleUploadError() {
    setUploadSuccess(false);
    notification.error({ message: 'EXCEL上传失败，请重试' });
  }

  /**
   *图片上传失败
   *
   */
  function handleUploadImgError() {
    notification.error({ message: '图片上传失败' });
  }

  // EXCEL上传配置
  const myProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    action: `${process.env.API_HOST}${HLOS_LCSV}/v1/${organizationId}/dashboard/workgroup-meeting-dashboard-import`,
    multiple: true,
    accept: ['.xlsx'],
    uploadImmediately: true,
    showUploadList: true,
    name: 'excel',
    showPreviewImage: true,
    onUploadSuccess: handleSuccess,
    onUploadError: handleUploadError,
    withCredentials: true,
    onRemoveFile: handleClearExcel,
    extra: <p>请上传EXCEL文件(xlsx)</p>,
  };

  /**
   *清除excel
   *
   */
  function handleClearExcel() {
    setUploadSuccess(false);
    setDepartment('');
  }
  /**
   *上传成功
   *
   * @param {*} actions
   * @param {*} res
   */
  function handleImgSuccess(actions, res) {
    if (!res) {
      return;
    }
    const localList = { ...parseImgList };
    if (localList) {
      const myImgList = localList;
      if (myImgList[actions]) {
        const oldAction = myImgList[actions];
        const newAction = `${oldAction}|${res}`;
        myImgList[actions] = newAction;
      } else {
        myImgList[actions] = res;
      }
      setUploadSuccessList(myImgList);
      setParseImgList(myImgList);
    } else {
      parseImgList[actions] = res;
      setUploadSuccessList(parseImgList);
    }
  }

  /**
   *文件删除
   *
   */
  function handleRemoveFile(actions, response, myUrl) {
    if (myUrl) {
      deleteFile({ file: myUrl, directory: 'morning-meeting' });
    }
    if (!response) {
      return;
    }
    const localList = { ...parseImgList };
    const remveFileList = localList[actions] ? localList[actions] : '';
    const isHaveOwnMore = remveFileList ? remveFileList.includes('|') : false;
    const removeArray = isHaveOwnMore ? remveFileList.split('|') : [remveFileList];
    const removeIndex = removeArray.indexOf(response);
    removeArray.splice(removeIndex, 1);
    const newLinkString = removeArray.join('|');
    const newLocalList = { ...localList, [actions]: newLinkString };
    if (localList[actions]) {
      const url = response;
      setUploadSuccessList(newLocalList);
      deleteFile({ file: url, directory: 'morning-meeting' }).then(() => {
        setParseImgList(newLocalList);
        return true;
      });
    }
    return true;
  }
  /**
   *图片上传
   *
   * @returns
   */
  function imgUpdate(name, actions) {
    return {
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
      multiple: true,
      fileListMaxLength: 0,
      accept: ['image/*'],
      data: uploadData,
      uploadImmediately: true,
      showUploadList: true,
      appendUpload: true,
      showPreviewImage: true,
      onUploadSuccess: (response) => handleImgSuccess(actions, response),
      onUploadError: handleUploadImgError,
      withCredentials: true,
      onRemoveFile: ({ response, url }) => handleRemoveFile(actions, response, url),
      extra: uploadSuccess ? <p>请上传{name}文件(.jpg, .png)</p> : <p>请先上传EXCEL再来上传此处</p>,
    };
  }
  function uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_CSV,
      directory: 'morning-meeting',
    };
  }
  return (
    <Fragment>
      <Header title="班组晨会看板配置">
        <Button
          onClick={goWorkShopMorningMeeting}
          disabled={!uploadSuccess || !uploadImgAll}
          color="blue"
        >
          去往看板界面
        </Button>
      </Header>
      <Content>
        <Row gutter={26}>
          <Col span={12}>
            <Card title="EXCEL" bordered={false}>
              <Upload {...myProps} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="质量月报" bordered={false}>
              <Upload {...imgUpdate('质量月报', 'quality')} disabled={!uploadSuccess} />
            </Card>
          </Col>
        </Row>
        <Row style={{ margin: '20px 0' }} gutter={26}>
          <Col span={12}>
            <Card title="5S图片" bordered={false}>
              <Upload {...imgUpdate('5s', 'five')} disabled={!uploadSuccess} />
            </Card>
          </Col>
        </Row>
      </Content>
    </Fragment>
  );
}
export default connect()(TeamBoardConfig);
