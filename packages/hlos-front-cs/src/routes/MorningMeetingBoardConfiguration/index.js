/*
 * @module-: 晨会看板配置
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-13 14:30:50
 * @LastEditTime: 2020-12-29 15:34:32
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { Fragment, useState } from 'react';
import { Content, Header } from 'components/Page';
import { Card, Col, Row } from 'choerodon-ui';
import { Button, Upload } from 'choerodon-ui/pro';
import { HLOS_LCSV } from 'hlos-front/lib/utils/config';

import { connect } from 'dva';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

function MorningMeetingBoardConfiguration(props) {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  /**
   *跳转到晨会看板页
   *
   */
  function goWorkShopMorningMeeting() {
    const { history } = props;
    history.push('/cs/workshop-morning-meeting-board/item');
  }

  /**
   *上传成功
   *
   */
  function handleSuccess(res) {
    if (res && res.includes('failed')) {
      const newRes = JSON.parse(res);
      notification.error({ message: `EXCEL上传成功，但是${newRes.message}，请重新上传正确的格式` });
      return;
    }
    setUploadSuccess(true);
    const meetingBoard = { department: res };
    localStorage.setItem('meetingBoardDepartment', JSON.stringify(meetingBoard));
    notification.success({ message: 'EXCEL上传成功，可以进入看板页面' });
  }

  /**
   *EXCEL上传失败
   *
   */
  function handleUploadError() {
    setUploadSuccess(false);
    notification.error({ message: 'EXCEL上传失败，请重试' });
  }

  // EXCEL上传配置
  const myProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    action: `${process.env.API_HOST}${HLOS_LCSV}/v1/${organizationId}/dashboard/meeting-dashboard-import`,
    multiple: true,
    accept: ['.xlsx', '.xls'],
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
  }

  return (
    <Fragment>
      <Header title="晨会看板配置">
        <Button onClick={goWorkShopMorningMeeting} disabled={!uploadSuccess} color="primary">
          去往看板界面
        </Button>
      </Header>
      <Content>
        <Row style={{ margin: '20px 0' }} gutter={26}>
          <Col span={8}>
            <Card title="EXCEL" bordered={false}>
              <Upload {...myProps} />
            </Card>
          </Col>
        </Row>
      </Content>
    </Fragment>
  );
}
export default connect()(MorningMeetingBoardConfiguration);
