/**
 * @Description: 其他出入库平台--头表
 */
import React, { useState, useEffect } from 'react';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { Table, Button, Lov, Form, Select, DataSet, Modal } from 'choerodon-ui/pro';
import { Icon, Upload } from 'choerodon-ui';
import uuidv4 from 'uuid/v4';
import { HLOS_LWMSS, BUCKET_NAME_WMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, filterNullValueObject, getAccessToken } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { HZERO_FILE } from 'utils/config';
import { isEmpty } from 'lodash';
import { useDataSet, useDataSetIsSelected } from 'hzero-front/lib/utils/hooks';
import { queryLovData, deleteFile } from 'hlos-front/lib/services/api';
import {
  batchChangeOtherWarehousing,
  batchDeleteOtherWarehousing,
} from '@/services/otherWarehousingService';
import { downloadFile } from 'services/api';
import codeConfig from '@/common/codeConfig';
import { queryHeadDS, queryLineDS } from '@/stores/otherWarehousingDS';
import LineTable from './otherWarehousingPlatformLine';
import styles from './index.less';
import fileIcon from '../../../assets/icons/file-icon.png';

const organizationId = getCurrentOrganizationId();
const directory = 'warehouse';
const preCode = 'raumplus.otherWarehousing';
const { common } = codeConfig.code;
const modalKey = Modal.key();

function OtherWarehousing(props) {
  let headDataSet = useDataSet(() => new DataSet(queryHeadDS()), OtherWarehousing);
  const lineDataSet = useDataSet(() => new DataSet(queryLineDS()));

  // 新增附件按钮及逻辑
  // const [headFileList, setHeadFileList] = useState([]);
  // const [loading, setLoading] = useState(false);

  const [moreQuery, setMoreQuery] = useState(false);

  const [orderId, setOrderId] = useState(-1);

  const isSelected = useDataSetIsSelected(headDataSet);

  useEffect(() => {
    defaultLovSetting();
    return () => {
      headDataSet = new DataSet(queryHeadDS());
    };
  }, []);

  const HeadColumns = [
    { name: 'organizationName' },
    { name: 'transactionWayCode' },
    { name: 'requestOperationType' },
    { name: 'partyName' },
    { name: 'invTransactionNum' },
    { name: 'workerName' },
    { name: 'departmentName' },
    { name: 'sourceDocNum' },
    { name: 'statusDes' },
    { name: 'remark' },
    {
      name: 'fileUrl',
      width: 200,
      align: 'center',
      renderer: ({ record }) => {
        const { fileUrl } = record.data;
        // if (fileUrl === undefined) {
        //   fileUrl = `${directory}/${uuidv4()}/`;
        //   record.set('fileUrl', fileUrl);
        // }
        return (
          <div className={styles['file-td']}>
            <Upload {...uploadProps}>
              <Button>
                <Icon type="file_upload" />
              </Button>
            </Upload>
            <span
              style={{
                color: '#29BECE',
                cursor: 'pointer',
              }}
              onClick={(event) => pictureRenderer(event, fileUrl)}
            >
              {intl.get('hzero.common.button.view').d('查看')}
            </span>
          </div>
        );
      },
    },
  ];

  /**
   *显示超链接
   * @returns
   */
  function pictureRenderer(event, value) {
    event.stopPropagation(); // 阻止冒泡
    if (!value || value === '') {
      notification.warning({
        message: '暂无文件可查看',
      });
      return;
    }
    const pictures = [];
    if (value) {
      value.split('#').forEach((item) => {
        pictures.push({
          url: item,
          uid: uuidv4(),
          name: item.split('@')[1],
          status: 'done',
        });
      });
    }
    return pictures.length > 0
      ? Modal.open({
          key: 'wms-other-warehousing-pic-modal',
          title: intl.get(`${preCode}.view.title.lookpicture`).d('查看附件'),
          className: styles['lwms-other-warehousing-pic-modal'],
          children: (
            <div className={styles.wrapper}>
              <div className={styles['img-list']}>
                {
                  // eslint-disable-next-line array-callback-return
                  pictures.map((file) => {
                    // const fileType = file.name.split('.')[1];
                    return (
                      <div
                        className={styles['img-file']}
                        onClick={() => {
                          if (!file.url) return;
                          window.open(file.url);
                        }}
                      >
                        <img src={fileIcon} alt={file.name} />
                        <span>{file.name}</span>
                      </div>
                    );
                    // if (fileType === 'png' || fileType === 'jpg') {
                    //   return (
                    //     <div
                    //       className={styles['img-item']}
                    //       onClick={() => {
                    //         if (!file.url) return;
                    //         window.open(file.url);
                    //       }}
                    //     >
                    //       {<img src={file.url} alt={file.name} /> || <span>{file.name}</span>}
                    //     </div>
                    //   );
                    // } else {
                    //   return (
                    //     <div
                    //       className={styles['img-file']}
                    //       onClick={() => {
                    //         if (!file.url) return;
                    //         window.open(file.url);
                    //       }}
                    //     >
                    //       <img src={fileIcon} alt={file.name} />
                    //       <span>{file.name}</span>
                    //     </div>
                    //   );
                    // }
                  })
                }
                {/* <Upload
                  listType="picture-card"
                  onPreview={(file) => {
                    if (!file.url) return;
                    window.open(file.url);
                  }}
                  fileList={pictures}
                /> */}
              </div>
            </div>
          ),
          footer: null,
          movable: true,
          closable: true,
        })
      : '';
  }

  /**
   * 附件上传成功回调
   * */

  async function handleUploadSuccess(res, file) {
    const { current } = headDataSet;
    const currentFile = file;
    if (res && !res.failed) {
      current.set(
        'fileUrl',
        current.get('fileUrl') && current.get('fileUrl') !== ''
          ? `${current.get('fileUrl')}#${res}`
          : res
      );
      if (current.toData() && current.toData().invTransactionId) {
        await headDataSet.submit();
        notification.success({
          message: '上传成功',
        });
      }
      currentFile.url = res;
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  }

  /**
   * 下载
   * @param {object} record - 参考文档
   */
  function downFile(file) {
    const api = `${HZERO_FILE}/v1/${getCurrentOrganizationId()}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: BUCKET_NAME_WMS },
        { name: 'directory', value: directory },
        { name: 'url', value: file.url },
      ],
    });
  }

  /**
   * 移除文件
   */
  function handleRemove() {
    headDataSet.current.set('fileUrl', '');
    deleteFile({ file: this.state.fileList[0].url, directory });
    // setFileList([]);
  }

  // 附件上传data
  function uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_WMS,
      directory,
    };
  }
  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    action: `${HZERO_FILE}/v1/${getCurrentOrganizationId()}/files/multipart`,
    // accept: ['image/*'],
    onSuccess: handleUploadSuccess,
    onRemove: handleRemove,
    onPreview: downFile,
    data: uploadData,
    // fileList: headFileList,
    fileList: [],
  };

  /**
   *重置
   *
   */
  function handleReset() {
    headDataSet.queryDataSet.current.reset();
  }

  /**
   *查询
   *
   * @returns
   */
  async function handleSearch() {
    setOrderId(-1);
    const validateValue = await headDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    await headDataSet.query();
  }

  /**
   *头点击事件
   *
   */
  function handleClick({ record }) {
    return {
      onClick: () => {
        setOrderId(record.data.invTransactionId);
        lineDataSet.queryParameter = { invTransactionId: record.data.invTransactionId };
        lineDataSet.query();
      },
    };
  }

  /**
   *导出
   *
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = headDataSet && headDataSet.queryDataSet && headDataSet.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  /**
   *设置默认查询条件
   *
   */
  async function defaultLovSetting() {
    const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
    if (res) {
      if (!isEmpty(res.content) && headDataSet.queryDataSet && headDataSet.queryDataSet.current) {
        headDataSet.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
        });
      }
    }
  }

  async function handleShowTypeSelectModal() {
    handleToDetail();
  }

  /**
   * 跳转详情页面
   * @param {*} id
   */
  function handleToDetail() {
    props.history.push({
      pathname: `/raumplus/other-warehousing/detail`,
    });
  }

  /**
   * handlePrint打印
   * */
  function handlePrint() {
    //  console.log('handlePrint');
    //  lineDataSet.select

    if (!lineDataSet.selected.length && !headDataSet.selected.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    if (lineDataSet.selected.length) {
      const { invTransactionId } = headDataSet.current.toData();
      const reportLineDTOList = lineDataSet.selected.map((line) => ({
        invTransactionLineId: line.toJSONData().invTransactionLineId,
      }));
      props.history.push({
        pathname: `/raumplus/other-warehousing/print`,
        // search: `deliveryOrderId=${invTransactionLineIds}`,
        state: { invTransactionId, reportLineDTOList },
      });
    } else if (headDataSet.selected.length !== 1) {
      return notification.warning({
        message: '请选择一条头数据',
      });
    } else {
      const { invTransactionId } = headDataSet.selected[0].toData();
      props.history.push({
        pathname: `/raumplus/other-warehousing/print`,
        // search: `deliveryOrderId=${invTransactionLineIds}`,
        state: { invTransactionId },
      });
    }
  }

  /**
   * 按钮提示框
   */
  function buttonPromptBox(type) {
    const status = {
      close: 'CLOSED',
      cancel: 'CANCELLED',
    };
    const selected = headDataSet.selected.map((item) => {
      return { ...item.toData(), status: status[type] };
    });
    const promptContent = {
      close: '是否关闭其他出入库单',
      cancel: '是否取消其他出入库单',
    };
    const handleSelected = headDataSet.selected.map((item) => item.toData());
    const ifConditions = {
      close: handleSelected.some(
        (i) => i.status === 'NEW' || i.status === 'CANCELLED' || i.status === 'CLOSED'
      ), // 头 关闭按钮
      cancel: handleSelected.some((i) => !(i.status === 'NEW' || i.status === 'RELEASED')), // 头 取消按钮
    };
    const warning = {
      close: '“新增NEW”，“已取消CANCELLED”和“已关闭CLOSED”状态的发货单不允许关闭', // 头 关闭按钮
      cancel: '只有“新增NEW”和“已提交RELEASED”状态的发货单才允许取消', // 头 取消按钮
    };
    Modal.confirm({
      key: modalKey,
      title: promptContent[type],
      okText: '是',
      cancelText: '否',
    }).then(async (btnType) => {
      if (btnType === 'ok') {
        if (ifConditions[type]) {
          notification.warning({
            message: warning[type],
          });
          return;
        }
        const res = await batchChangeOtherWarehousing(selected);
        if (res && !res.failed) {
          notification.success({
            message: `操作成功`,
          });
          headDataSet.query();
        }
      }
    });
  }

  /**
   * 提交
   */
  async function operatingSubmit() {
    const selected = headDataSet.selected.map((item) => item.toData());
    if (selected.some((i) => i.status !== 'NEW')) {
      notification.warning({
        message: `只有“新增NEW”状态的其他出入库单才允许提交`,
      });
      return;
    }
    const selectedData = headDataSet.selected.map((item) => {
      return { ...item.toData(), status: 'RELEASED' };
    });
    const res = await batchChangeOtherWarehousing(selectedData);
    if (res && !res.failed) {
      notification.success({
        message: `操作成功`,
      });
      headDataSet.query();
    }
  }

  /**
   * 删除
   */
  async function operatingDelete() {
    const selected = headDataSet.selected.map((item) => {
      return { ...item.toData() };
    });
    if (selected.some((i) => i.status !== 'NEW')) {
      notification.warning({
        message: `只有“新增NEW”状态的发货单行才允许删除`,
      });
      return;
    }
    const res = await batchDeleteOtherWarehousing(selected);
    if (res && !res.failed) {
      notification.success({
        message: `操作成功`,
      });
      headDataSet.query();
    }
  }

  return (
    <React.Fragment>
      {/* <Spin spinning={loading}> */}
      <Header title={intl.get(`${preCode}.view.title.otherWarehousing`).d('其他出入库平台')}>
        <Button icon="add" color="primary" onClick={handleShowTypeSelectModal}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <ExcelExport
          requestUrl={`${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers/export`}
          queryParams={getExportQueryParams}
        />
        <Button disabled={!isSelected} onClick={operatingSubmit}>
          {intl.get('hzero.common.button.submit').d('提交')}
        </Button>
        <Button disabled={!isSelected} onClick={operatingDelete}>
          {intl.get('hzero.common.btn.delete').d('删除')}
        </Button>
        <Button disabled={!isSelected} onClick={() => buttonPromptBox('cancel')}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button disabled={!isSelected} onClick={() => buttonPromptBox('close')}>
          {intl.get('hzero.common.button.close').d('关闭')}
        </Button>
        <Button onClick={() => handlePrint()}>
          {intl.get('lwms.common.view.title.print').d('打印')}
        </Button>
      </Header>
      <Content>
        <div className={styles['lwms-ship-platform']}>
          <Form dataSet={headDataSet.queryDataSet} columns={4}>
            <Lov name="organizationObj" clearButton noCache />
            <Select name="transactionWayCode" />
            <Select name="requestOperationType" />
            <Lov name="partyNameObj" clearButton noCache />
            {moreQuery && <Lov name="invTransactionNumObj" clearButton noCache />}
            {moreQuery && <Lov name="workerNameObj" clearButton noCache />}
            {moreQuery && <Lov name="departmentNameObj" clearButton noCache />}
            {moreQuery && <Lov name="sourceDocNumObj" clearButton noCache />}
            {moreQuery && <Select name="status" clearButton noCache />}
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
            <Button
              onClick={() => {
                setMoreQuery(!moreQuery);
              }}
            >
              {moreQuery
                ? intl.get('hzero.common.button.collected').d('收起查询')
                : intl.get('hzero.common.button.viewMore').d('更多查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Table
          dataSet={headDataSet}
          border={false}
          columnResizable="true"
          editMode="inline"
          columns={HeadColumns}
          queryFieldsLimit={4}
          queryBar="none"
          onRow={(record) => handleClick(record)}
          pagination={{
            onChange: () => setOrderId(-1),
          }}
        />
        {orderId !== -1 && <LineTable tableDS={lineDataSet} />}
      </Content>
      {/* </Spin> */}
    </React.Fragment>
  );
}

export default formatterCollections({
  code: [`${preCode}`],
})((props) => {
  return <OtherWarehousing {...props} />;
});
