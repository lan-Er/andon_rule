/**
 * @Description: 核企 对账单确认 - index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-24  09:41:22
 * @LastEditors: yu.na
 */

import React, { useState, useEffect } from 'react';
import { Button, Lov, Table, DataSet, DatePicker, Form, Select, SelectBox } from 'choerodon-ui/pro';
import { Modal, Icon, Upload } from 'choerodon-ui';
import moment from 'moment';
import { Header } from 'components/Page';
import { getResponse, getAccessToken, getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { HZERO_FILE } from 'utils/config';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { downloadFile } from 'services/api';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { deleteFile } from 'hlos-front/lib/services/api';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getSerialNum } from '@/utils/renderer';
import { ListDS } from '@/stores/statementConfirmationDS';
import { ListDS as ModalDS } from '@/stores/statementCreateDS';
import { updateStatementApi } from '@/services/statementService';

import qiIcon from './assets/qi.svg';
import './style.less';
import DetailModal from './Modal';

const { Sidebar } = Modal;
const { Option } = SelectBox;
const organizationId = getCurrentOrganizationId();
const directory = 'lisp.statement';

const StatementConfirmation = (props) => {
  const ds = () =>
    new DataSet({
      ...ListDS(),
      events: {
        select: ({ dataSet }) => handleSelect(dataSet),
        unSelect: ({ dataSet }) => handleSelect(dataSet),
        selectAll: ({ dataSet }) => handleSelect(dataSet),
        unSelectAll: ({ dataSet }) => handleSelect(dataSet),
      },
    });
  const mDS = () =>
    new DataSet({
      ...ModalDS(),
      selection: false,
      autoQuery: false,
    });

  const modalDS = useDataSet(mDS, StatementConfirmation);
  const listDS = useDataSet(ds);

  const [showMore, toggleShowMore] = useState(false);
  const [showFlag, setDetailShowFlag] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [pageType, setPageType] = useState('enterprise');
  const [attr, setAttr] = useState(null);
  const [disabledFlag, setDisabled] = useState(false);

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    accept: ['*'],
    data: uploadData,
    onSuccess: handleUploadSuccess,
    onRemove: handleRemove,
    onPreview: downFile,
    fileList,
  };

  useEffect(() => {
    const {
      location: { pathname },
    } = props;
    if (pathname.indexOf('supply') !== -1) {
      setPageType('supply');
    }
  }, [props]);

  /**
   * 文件上传成功
   * @param res 返回response
   * @param file 上传文件信息
   */
  function handleUploadSuccess(res, file) {
    const currentFile = file;
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      listDS.current.set('attribute12', res);
      updateStatementApi([listDS.current.toJSONData()]);
      currentFile.url = res;
      setFileList([currentFile]);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  }

  /**
   * 移除文件
   */
  function handleRemove() {
    listDS.current.set('attribute12', '');
    deleteFile({ file: fileList[0].url, directory });
    setFileList([]);
  }

  /**
   * 下载
   * @param {object} record - 参考文档
   */
  function downFile(file) {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: BUCKET_NAME_MDS },
        { name: 'directory', value: directory },
        { name: 'url', value: file.url },
      ],
    });
  }

  function uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory,
    };
  }

  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { header: 'No.', width: 70, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      {
        name: 'attribute1',
        width: 150,
        tooltip: 'overflow',
        renderer: ({ value }) => {
          return <a onClick={() => handleShowDetail(value)}>{value}</a>;
        },
        lock: 'left',
      },
      {
        name: 'attribute2',
        width: 175,
        tooltip: 'overflow',
        hidden: pageType === 'supply',
        renderer: ({ value, record }) => {
          if (record.get('attribute13') === '1') {
            return (
              <span>
                <img src={qiIcon} alt="" style={{ marginRight: 6 }} />
                {value}
              </span>
            );
          }
          return value;
        },
        lock: 'left',
      },
      {
        name: 'attribute3',
        width: 100,
        tooltip: 'overflow',
        hidden: pageType === 'enterprise',
        renderer: ({ value, record }) => {
          if (record.get('attribute14') === '1') {
            return (
              <span>
                <img src={qiIcon} alt="" style={{ marginRight: 6 }} />
                {value}
              </span>
            );
          }
          return value;
        },
        lock: 'left',
      },
      {
        name: 'attribute4',
        width: 100,
        className: 'high-light',
        tooltip: 'overflow',
        renderer: ({ value, record }) => {
          return (
            <span>
              {record.get('attribute6')} {value}
            </span>
          );
        },
      },
      {
        name: 'attribute5',
        width: 100,
        className: 'high-light',
        tooltip: 'overflow',
      },
      {
        name: 'attribute7',
        width: 100,
        tooltip: 'overflow',
      },
      { name: 'attribute8', width: 100, tooltip: 'overflow' },
      {
        name: 'attribute9',
        width: pageType === 'enterprise' ? 100 : 110,
        tooltip: 'overflow',
        header: pageType === 'enterprise' ? '对账标识' : '客户对账标识',
        renderer: ({ value }) => {
          let style = {
            background: '#DDF7EC',
            color: '#24BDA2',
          };
          if (value === '未对账') {
            style = {
              background: '#f66767',
              color: '#fff',
            };
          }
          return (
            <div
              style={{
                ...style,
                borderRadius: '9.5px',
                width: 52,
                height: 19,
                lineHeight: '19px',
                marginTop: 5,
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              {value}
            </div>
          );
        },
      },
      {
        name: 'attribute10',
        width: pageType === 'enterprise' ? 110 : 100,
        header: pageType === 'enterprise' ? '客户对账标识' : '对账标识',
        tooltip: 'overflow',
        renderer: ({ value }) => {
          let style = {
            background: '#DDF7EC',
            color: '#24BDA2',
          };
          if (value === '未对账') {
            style = {
              background: '#f66767',
              color: '#fff',
            };
          }
          return (
            <div
              style={{
                ...style,
                borderRadius: '9.5px',
                width: 52,
                height: 19,
                lineHeight: '19px',
                marginTop: 5,
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              {value}
            </div>
          );
        },
      },
      {
        name: 'attribute11',
        width: 100,
        align: 'center',
        tooltip: 'overflow',
        renderer: ({ value }) => {
          if (value === '是') {
            return <Icon type="done" style={{ color: '#24BDA2' }} />;
          }
          return <Icon type="close" style={{ color: '#f66767' }} />;
        },
      },
      {
        name: 'attribute12',
        width: 150,
        align: 'center',
        tooltip: 'overflow',
        renderer: ({ value, record }) => {
          if (value || pageType !== 'supply') {
            return (
              <a target="_blank" rel="noopener noreferrer" href={value}>
                {value}
              </a>
            );
          }
          if (pageType === 'supply' && record.data.attribute11 === '是') {
            return (
              <Upload {...uploadProps}>
                <Button>
                  <Icon type="file_upload" /> 上传文件
                </Button>
              </Upload>
            );
          }
          return (
            <Button className="lisp-statement-confirm-upload-btn" onClick={handleUploadAbandon}>
              <Icon type="file_upload" /> 上传文件
            </Button>
          );
        },
      },
    ];
  }

  function handleUploadAbandon() {
    notification.warning({
      message: '请先开票再上传附件',
    });
  }

  function handleToggle() {
    toggleShowMore(!showMore);
  }

  async function handleShowDetail(value) {
    setAttr(value);
    modalDS.queryParameter = {
      attribute37: value,
    };
    await modalDS.query();
    setDetailShowFlag(true);
  }

  /**
   *重置
   */
  async function handleReset() {
    listDS.queryDataSet.current.reset();
    await listDS.query();
    setDisabled(false);
    toggleShowMore(false);
  }

  /**
   *查询
   * @returns
   */
  async function handleSearch() {
    const validateValue = await listDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    await listDS.query();
    toggleShowMore(false);
    setDisabled(false);
  }

  /**
   *对账确认
   */
  async function handleConfirm() {
    if (!listDS.selected.length) {
      notification.warning({
        message: '请至少选择一条对账单',
      });
      return;
    }
    const list = [];
    if (pageType === 'enterprise') {
      listDS.selected.forEach((item) => {
        list.push({
          ...item.data,
          attribute9: '已对账',
          attribute8: moment(new Date()).format(DEFAULT_DATE_FORMAT),
        });
      });
    } else {
      if (!listDS.selected.every((item) => item.data.attribute9 === '已对账')) {
        notification.warning({
          message: '请核企先确认对账',
        });
        return;
      }
      listDS.selected.forEach((item) => {
        list.push({
          ...item.data,
          attribute10: '已对账',
          attribute8: moment(new Date()).format(DEFAULT_DATE_FORMAT),
        });
      });
    }

    const res = await updateStatementApi(list);
    if (getResponse(res) && !res.failed) {
      notification.success();
      await listDS.query();
      setDisabled(false);
    }
  }

  /**
   *取消确认
   */
  async function handleCancelConfirm() {
    if (!listDS.selected.length) {
      notification.warning({
        message: '请至少选择一条对账单',
      });
      return;
    }

    if (pageType === 'enterprise') {
      if (listDS.selected.every((item) => item.data.attribute10 === '未对账')) {
        // 若供应商对账标识为“已对账”，则核企不能取消确认
        const list = [];
        listDS.selected.forEach((item) => {
          list.push({
            ...item.data,
            attribute9: '未对账',
          });
        });
        const res = await updateStatementApi(list);
        if (getResponse(res) && !res.failed) {
          notification.success();
          await listDS.query();
        }
      } else {
        notification.warning({
          message: '供应商已对账，核企无法取消对账',
        });
      }
    } else if (listDS.selected.every((item) => item.data.attribute11 === '否')) {
      // 若开票标识为“是”，则供应商不能取消确认。
      const list = [];
      listDS.selected.forEach((item) => {
        list.push({
          ...item.data,
          attribute10: '未对账',
        });
      });
      const res = await updateStatementApi(list);
      if (getResponse(res) && !res.failed) {
        notification.success();
        await listDS.query();
        setDisabled(false);
      }
    }
  }

  function handleCancel() {
    toggleShowMore(false);
  }

  function handleDetailClose() {
    setDetailShowFlag(false);
  }

  function handleModalSearch() {
    modalDS.queryParameter = {
      attribute37: attr,
    };
    modalDS.query();
  }

  /**
   *取消开票
   */
  async function handleCancelInvoice() {
    if (!listDS.selected.length) {
      notification.warning({
        message: '请至少选择一条对账单',
      });
      return;
    }
    if (!listDS.selected.every((item) => item.data.attribute10 === '已对账')) {
      return;
    }
    const data = [];
    listDS.selected.forEach((item) => {
      data.push({
        ...item.data,
        attribute11: '否',
      });
    });
    const res = await updateStatementApi(data);
    if (getResponse(res) && !res.failed) {
      notification.success();
      await listDS.query();
      setDisabled(false);
    }
  }

  /**
   *确认开票
   */
  async function handleInvoice() {
    if (!listDS.selected.length) {
      notification.warning({
        message: '请至少选择一条对账单',
      });
      return;
    }
    if (!listDS.selected.every((item) => item.data.attribute10 === '已对账')) {
      return;
    }
    const data = [];
    listDS.selected.forEach((item) => {
      data.push({
        ...item.data,
        attribute11: '是',
      });
    });
    const res = await updateStatementApi(data);
    if (getResponse(res) && !res.failed) {
      notification.success();
      await listDS.query();
      setDisabled(false);
    }
  }

  function handleSelect(dataSet) {
    if (!dataSet.selected.every((item) => item.data.attribute10 === '已对账')) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }

  return (
    <div className="lisp-statement-confirmation">
      <Header title="对账单确认">
        <Button color="primary" onClick={handleSearch}>
          {intl.get('hzero.common.button.search').d('查询')}
        </Button>
        <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
        <span className="more-btn" onClick={handleToggle}>
          更多
          <Icon type="expand_more" />
        </span>
        {pageType === 'supply' ? (
          <Lov dataSet={listDS.queryDataSet} name="attribute3" placeholder="选择客户" noCache />
        ) : (
          <Lov dataSet={listDS.queryDataSet} name="attribute2" placeholder="选择供应商" noCache />
        )}
        <Lov dataSet={listDS.queryDataSet} name="attribute1" placeholder="选择对账单号" noCache />
      </Header>
      <div className="sub-header">
        <Button className="cancel-btn" onClick={handleCancelConfirm}>
          <Icon type="close" />
          取消对账
        </Button>
        <Button onClick={handleConfirm}>
          <Icon type="done" />
          对账确认
        </Button>
        {pageType === 'supply' && (
          <Button className="cancel-btn" disabled={disabledFlag} onClick={handleCancelInvoice}>
            <Icon type="close" />
            取消开票
          </Button>
        )}
        {pageType === 'supply' && (
          <Button onClick={handleInvoice} disabled={disabledFlag}>
            <Icon type="done" />
            确认开票
          </Button>
        )}
      </div>
      <div className="content">
        <Table
          dataSet={listDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          editMode="inline"
          queryBar="none"
        />
      </div>
      <Sidebar
        title="筛选"
        className="lisp-statement-confirmation-more-modal"
        visible={showMore}
        onCancel={handleCancel}
        cancelText="重置"
        okText="查询"
        width={560}
        closable
        footer={null}
        zIndex={999}
      >
        <Form className="form" dataSet={listDS.queryDataSet}>
          <Lov name="attribute1" noCache />
          {pageType === 'supply' ? (
            <Lov name="attribute3" noCache />
          ) : (
            <Lov name="attribute2" noCache />
          )}
          <DatePicker name="formDateStart" />
          <Select name={pageType === 'supply' ? 'attribute10' : 'attribute9'} />
          <SelectBox name="attribute11">
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </SelectBox>
        </Form>
        <div className="foot-btn">
          <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
          <Button color="primary" onClick={handleSearch}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
      </Sidebar>
      <DetailModal
        pageType={pageType}
        onModalSearch={handleModalSearch}
        modalDS={modalDS}
        showFlag={showFlag}
        onDetailClose={handleDetailClose}
      />
    </div>
  );
};

export default formatterCollections({
  code: ['lisp.statementCreate', 'lisp.common'],
})(StatementConfirmation);
