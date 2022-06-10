/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-23 11:07:04
 */
import React from 'react';

import { Content, Header } from 'components/Page';
import { Button, Tooltip, ModalContainer } from 'choerodon-ui/pro';
import axios from 'axios';
import queryString from 'query-string';

import intl from 'utils/intl';
import notification from 'utils/notification';
import { isTenantRoleLevel, getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { HZERO_RPT, API_HOST } from 'utils/config';
import Icons from 'components/Icons';
import { pressData } from '@/services/tagPrintService';

import PrintElement from '@/components/PrintElement';
import styles from './index.less';

const Print = (props) => {
  const { location = {} } = props;
  const { search = {}, backPath = '', lotParams = [], tagType } = location;
  const { tenantId } = queryString.parse(search);

  const printDomRef = React.useRef(null);

  const [label, setLabel] = React.useState({});

  const [visible, setVisible] = React.useState(false);

  // const [printLoading, setPrintLoading] = React.useState(false);

  const [viewLoading, setViewLoading] = React.useState(false);

  async function handleView() {
    const {
      match: {
        params: { templateCode },
      },
    } = props;
    setViewLoading(true);
    const params = {
      data: lotParams,
    };
    let transportParams;
    if (tagType === 'batch') {
      transportParams = {
        lotNumbers: lotParams.join(),
      };
    } else {
      const resp = await pressData(params);
      transportParams = resp.dataId;
    }
    // const resp = await pressData(params);
    // const transportParams = resp.dataId;
    axios({
      url: isTenantRoleLevel()
        ? `${HZERO_RPT}/v1/${getCurrentOrganizationId()}/label-prints/view/html?labelTemplateCode=${templateCode}`
        : `${HZERO_RPT}/v1/label-prints/view/html?labelTemplateCode=${templateCode}&labelTenantId=${tenantId}`,
      method: 'GET',
      params:
        tagType === 'batch'
          ? transportParams
          : {
              dataId: transportParams,
            },
      baseURL: `${API_HOST}`,
      headers: { Authorization: `bearer ${getAccessToken()}` },
    })
      .then((res) => {
        if (res) {
          setLabel(res.label);
          setVisible(true);
          setViewLoading(false);
        }
      })
      .catch((err) => {
        setViewLoading(false);
        notification.error({
          message: err.message,
        });
      });
  }

  return (
    <>
      <Header
        title={intl.get('hrpt.labelTemplate.view.message.title.print').d('批次打印')}
        backPath={backPath}
      >
        <Button loading={viewLoading} color="primary" onClick={handleView} icon="sync">
          {intl.get('hrpt.labelTemplate.view.message.title.view').d('批次渲染')}
        </Button>
        {visible && (
          <Tooltip
            placement="top"
            title={intl.get('hrpt.labelTemplate.view.message.title.print').d('批次打印')}
          >
            <Icons
              type="dayin"
              size={30}
              style={{ color: '#0303ab', cursor: 'pointer', marginRight: 6 }}
              onClick={() => {
                PrintElement({
                  content: printDomRef.current,
                });
              }}
            />
          </Tooltip>
        )}
      </Header>
      <Content>
        {visible && (
          <div className={styles['model-title']}>
            {intl.get('hrpt.reportQuery.view.message.buildResult').d('生成结果')}
          </div>
        )}
        {visible && (
          <div
            style={{ paddingBottom: 20, overflow: 'hidden' }}
            ref={printDomRef}
            dangerouslySetInnerHTML={{ __html: label }}
          />
        )}
        <ModalContainer location={props.location} />
      </Content>
    </>
  );
};

export default Print;
