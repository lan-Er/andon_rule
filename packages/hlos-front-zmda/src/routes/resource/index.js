/**
 * @Description: 制造协同-资源
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-14 14:31:36
 */

import React, { Fragment } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { ExportButton } from 'hlos-front/lib/components';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { downloadFile } from 'services/api';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import ResourceListDS from './store/ResourceListDS';

const intlPrefix = 'zmda.resource';
const commonPrefix = 'zmda.common';
const directory = 'resource';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class ZmdaResource extends React.Component {
  resourceListDS = new DataSet({
    ...ResourceListDS(),
  });

  /**
   * 下载
   * @param {object} file - 文件
   */
  downloadFile(file) {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: BUCKET_NAME_MDS },
        { name: 'directory', value: directory },
        { name: 'url', value: file },
      ],
    });
  }

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      { name: 'organizationName', width: 150, lock: true },
      { name: 'resourceCode', width: 150, lock: true },
      { name: 'resourceName', width: 150 },
      { name: 'resourceAlias', width: 150 },
      { name: 'description', width: 150 },
      {
        name: 'fileUrl',
        align: 'center',
        renderer: ({ value: file }) => {
          return (
            <div>
              {file && (
                <span
                  className="action-link"
                  style={{
                    display: 'block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <a
                    style={{ marginLeft: '5px' }}
                    title={intl.get('hzero.common.button.download').d('下载')}
                    onClick={() => this.downloadFile(file)}
                  >
                    {getFileName(file)}
                  </a>
                </span>
              )}
            </div>
          );
        },
      },
      { name: 'resourceClassMeaning', width: 150 },
      { name: 'resourceTypeMeaning', width: 150 },
      { name: 'categoryName', width: 150 },
      { name: 'chiefPositionName', width: 150 },
      { name: 'locationName', width: 150 },
      { name: 'resourceStatusMeaning', width: 150 },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
    ];
  }

  render() {
    const { resourceListDS, columns } = this;
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.resource`).d('资源')}>
          <ExportButton
            reportCode={['ZMDA.RESOURCE']}
            exportTitle={
              intl.get(`${intlPrefix}.view.title.resource`).d('资源') +
              intl.get('hzero.common.button.export').d('导出')
            }
          />
        </Header>
        <Content>
          <Table
            dataSet={resourceListDS}
            columns={columns}
            columnResizable="true"
            selectionMode="dblclick"
          />
        </Content>
      </Fragment>
    );
  }
}
