/**
 * @Description: 飞达料车--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-05 16:53:29
 * @LastEditors: yu.na
 */

import React, { Fragment, useMemo, useState } from 'react';
import {
  Table,
  DataSet,
  Lov,
  Icon,
  IntlField,
  Form,
  TextField,
  Button,
  CheckBox,
} from 'choerodon-ui/pro';
import { Upload, Tag, Popconfirm, Tabs } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { HZERO_FILE } from 'utils/config';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { deleteFile } from 'hlos-front/lib/services/api';
import { ExportButton } from 'hlos-front/lib/components';
import { ListDS } from '../stores/ListDS';

const dsFactory = () => new DataSet(ListDS());

const preCode = 'lmds.feeder';
const directory = 'resource-feeder-trolley';
const organizationId = getCurrentOrganizationId();
const { TabPane } = Tabs;

const FeederTrolley = (props) => {
  const listDS = useDataSet(dsFactory, FeederTrolley);
  const [activeKey, setActiveKey] = useState('main');

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: 'image/*',
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    data: uploadData,
    showUploadList: false,
    beforeUpload,
  };

  const fileRender = (file, type) => {
    return (
      <div>
        {file ? (
          <span
            className="action-link"
            style={{
              display: 'block',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Popconfirm
              okText={intl.get('hzero.common.button.sure').d('确定')}
              cancelText={intl.get('hzero.common.button.cancel').d('取消')}
              title={intl.get('lmds.common.view.message.confirm.remove').d('是否删除此条记录？')}
              onConfirm={() => handleDeleteFile(file, type)}
            >
              <a>
                <Icon type="delete" />
              </a>
            </Popconfirm>
            <a
              style={{ marginLeft: '5px' }}
              title={intl.get('hzero.common.button.download').d('下载')}
              onClick={() => downloadFile(file)}
            >
              {getFileName(file)}
            </a>
          </span>
        ) : (
          <Tag title="选择本地图片上传">
            <Upload {...uploadProps} onSuccess={(res) => handleSuccess(type, res)}>
              <a>{intl.get('hzero.common.button.upload').d('上传')}</a>
            </Upload>
          </Tag>
        )}
      </div>
    );
  };

  const codeRender = ({ value, record }) => {
    return <a onClick={() => handleToDetailPage(record.data.trolleyId)}>{value}</a>;
  };

  const mainColumns = useMemo(() => {
    return [
      {
        name: 'organizationObj',
        width: 128,
        editor: (record) => (record.status === 'add' ? <Lov /> : null),
        lock: true,
      },
      {
        name: 'trolleyCode',
        width: 128,
        editor: (record) => (record.status === 'add' ? <IntlField /> : null),
        renderer: codeRender,
        lock: true,
      },
      {
        name: 'trolleyName',
        width: 200,
        editor: true,
        lock: true,
      },
      {
        name: 'trolleyAlias',
        width: 128,
        editor: true,
      },
      {
        name: 'description',
        width: 336,
        editor: true,
      },
      {
        name: 'trolleyType',
        width: 128,
        editor: true,
      },
      {
        name: 'fileUrl',
        width: 200,
        renderer: ({ value }) => fileRender(value, 'fileUrl'),
      },
      {
        name: 'categoryObj',
        width: 200,
        editor: true,
      },
      {
        name: 'trolleyGroup',
        width: 128,
        editor: true,
      },
      {
        name: 'trolleyStatus',
        width: 82,
        editor: true,
      },
      {
        name: 'loadSeatQty',
        width: 82,
        editor: true,
      },
      {
        name: 'chiefPositionObj',
        width: 128,
        editor: true,
      },
      {
        name: 'departmentObj',
        width: 128,
        editor: true,
      },
      {
        name: 'supervisorObj',
        width: 128,
        editor: true,
      },
      {
        name: 'ownerType',
        width: 82,
        editor: true,
      },
      {
        name: 'ownerObj',
        width: 200,
        editor: true,
      },
      {
        name: 'assetNumber',
        width: 128,
        editor: true,
      },
      {
        name: 'purchaseDate',
        width: 100,
        editor: true,
      },
      {
        name: 'startUseDate',
        width: 100,
        editor: true,
      },
      {
        name: 'supplier',
        width: 200,
        editor: true,
      },
      {
        name: 'manufacturer',
        width: 200,
        editor: true,
      },
      {
        name: 'servicePhone',
        width: 128,
        editor: true,
      },
      {
        name: 'currencyObj',
        width: 82,
        editor: true,
      },
      {
        name: 'initialValue',
        width: 82,
        editor: true,
      },
      {
        name: 'currentValue',
        width: 82,
        editor: true,
      },
      {
        name: 'bomObj',
        width: 82,
        editor: true,
      },
      {
        name: 'remark',
        width: 326,
        editor: true,
      },
      {
        name: 'enabledFlag',
        width: 82,
        align: 'center',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }, []);

  const locationColumns = useMemo(() => {
    return [
      {
        name: 'organizationObj',
        width: 128,
        editor: (record) => (record.status === 'add' ? <Lov /> : null),
        lock: true,
      },
      {
        name: 'trolleyCode',
        width: 128,
        editor: (record) => (record.status === 'add' ? <IntlField /> : null),
        renderer: codeRender,
        lock: true,
      },
      {
        name: 'trolleyName',
        width: 200,
        editor: true,
        lock: true,
      },
      {
        name: 'loadFeeder',
        width: 128,
        editor: 336,
      },
      {
        name: 'prodLineObj',
        width: 128,
        editor: true,
      },
      {
        name: 'equipmentObj',
        width: 128,
        editor: true,
      },
      {
        name: 'workcellObj',
        width: 128,
        editor: true,
      },
      {
        name: 'workerGroupObj',
        width: 128,
        editor: true,
      },
      {
        name: 'workerObj',
        width: 128,
        editor: true,
      },
      {
        name: 'warehouseObj',
        width: 128,
        editor: true,
      },
      {
        name: 'wmAreaObj',
        width: 128,
        editor: true,
      },
      {
        name: 'wmUnitObj',
        width: 128,
        editor: true,
      },
      {
        name: 'locationObj',
        width: 200,
        editor: true,
      },
      {
        name: 'outsideLocation',
        width: 200,
        editor: true,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }, []);

  const tpmColumns = useMemo(() => {
    return [
      {
        name: 'organizationObj',
        width: 128,
        editor: (record) => (record.status === 'add' ? <Lov /> : null),
        lock: true,
      },
      {
        name: 'trolleyCode',
        width: 128,
        editor: (record) => (record.status === 'add' ? <IntlField /> : null),
        renderer: codeRender,
        lock: true,
      },
      {
        name: 'trolleyName',
        width: 200,
        editor: true,
        lock: true,
      },

      {
        name: 'tpmGroupObj',
        width: 128,
        editor: true,
      },
      {
        name: 'tpmWorkerObj',
        width: 128,
        editor: true,
      },
      {
        name: 'trolleyUsedCount',
        width: 82,
        editor: true,
      },
      {
        name: 'maintenancedTimes',
        width: 82,
        editor: true,
      },
      {
        name: 'lastTpmDate',
        width: 100,
        editor: true,
      },
      {
        name: 'lastTpmManObj',
        width: 128,
        editor: true,
      },
      {
        name: 'referenceDocument',
        width: 200,
        renderer: ({ value }) => fileRender(value, 'referenceDocument'),
      },
      {
        name: 'drawingCode',
        width: 200,
        renderer: ({ value }) => fileRender(value, 'drawingCode'),
      },
      {
        name: 'instruction',
        width: 300,
        editor: true,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }, []);

  function handleToDetailPage(val) {
    props.history.push({
      pathname: `/lmds/resource-feeder-trolley/detail/${val}`,
    });
  }

  /**
   *tab数组
   * @returns
   */
  function tabsArr() {
    return [
      {
        key: 'main',
        title: '主要',
        columns: mainColumns,
      },
      {
        key: 'location',
        title: '位置',
        columns: locationColumns,
      },
      {
        key: 'tpm',
        title: 'TPM',
        columns: tpmColumns,
      },
    ];
  }

  function handleTabsChange(key) {
    setActiveKey(key);
  }

  /**
   * 下载
   * @param {object} file - 文件
   */
  function downloadFile(file) {
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

  /**
   * 删除该文件
   * @param {*} file 待删除文件
   */
  function handleDeleteFile(file, type) {
    deleteFile({ file, directory });
    listDS.current.set(`${type}`, '');
    listDS.submit();
  }

  function beforeUpload(file) {
    const isImg = file.type.indexOf('image') !== -1;
    if (!isImg) {
      notification.warning({
        message: intl
          .get('lmds.common.view.message.upload.selectImage')
          .d('请选择图片格式文件上传'),
      });
    }
    return isImg;
  }

  function uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory,
    };
  }

  /**
   * 文件上传回调
   * @param res
   * @returns {Promise<void>}
   */
  async function handleSuccess(type, res) {
    if (res && !res.failed) {
      const { current } = listDS;
      current.set(`${type}`, res);
      // 对处于编辑状态的单据(包含新建)自动提交
      if (!current.editing) {
        await listDS.submit();
        notification.success({
          message: '上传成功',
        });
      }
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  }

  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  async function handleSearch() {
    await listDS.query();
  }

  function handleAddLine() {
    listDS.create({}, 0);
  }

  return (
    <Fragment key="feeder-trolley">
      <Header title={intl.get(`${preCode}.view.title.list`).d('飞达料车')}>
        <Button icon="add" color="primary" onClick={handleAddLine}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <ExportButton
          reportCode={['LMDS.FEEDER_TROLLEY']}
          exportTitle={intl.get(`${preCode}.buton.export`).d('飞达料车导出')}
        />
      </Header>
      <Content>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <Form dataSet={listDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            <TextField name="trolleyCode" />
            <TextField name="trolleyName" />
          </Form>
          <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Tabs activeKey={activeKey} onChange={handleTabsChange}>
          {tabsArr().map((tab) => (
            <TabPane tab={intl.get(`${preCode}.view.title.${tab.key}`).d(tab.title)} key={tab.key}>
              <Table
                dataSet={listDS}
                bordered="false"
                columns={tab.columns}
                columnResizable="true"
                editMode="inline"
                queryBar="none"
              />
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </Fragment>
  );
};

export default FeederTrolley;
