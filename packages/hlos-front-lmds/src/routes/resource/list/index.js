/*
 * @Description: 资源管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-07 19:32:48
 * @LastEditors: 赵敏捷
 */

import React, { Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { HLOS_LMDS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ResourceListDS from '../stores/ResourceListDS';

const intlPrefix = 'lmds.resource';
const commonPrefix = 'lmds.common';
const directory = 'resource';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class Resource extends React.Component {
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
      { name: 'organizationName', editor: false, width: 150, lock: true },
      { name: 'resourceCode', editor: false, width: 150, lock: true },
      { name: 'resourceName', editor: false, width: 150 },
      { name: 'resourceAlias', editor: false, width: 150 },
      { name: 'description', editor: false, width: 150 },
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
      { name: 'resourceClassMeaning', editor: false, width: 150 },
      { name: 'resourceTypeMeaning', editor: false, width: 150 },
      { name: 'categoryName', editor: false, width: 150 },
      { name: 'chiefPositionName', editor: false, width: 150 },
      { name: 'locationName', editor: false, width: 150 },
      { name: 'resourceStatusMeaning', editor: false, width: 150 },
      {
        name: 'enabledFlag',
        editor: false,
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
    ];
  }

  @Bind()
  getExportQueryParams() {
    const { resourceListDS: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      // tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    const { resourceListDS, columns } = this;
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.resource`).d('资源')}>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/resources/excel`}
            queryParams={this.getExportQueryParams}
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
