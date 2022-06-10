/**
 * @Description: 其他出入库单新建
 */

import React, { useState, useEffect } from 'react';
import { Table, Button, DataSet, Form, TextField, Select, Lov, Modal } from 'choerodon-ui/pro';
import { Icon, Upload } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet, useDataSetEvent, useDataSetIsSelected } from 'hzero-front/lib/utils/hooks';
import { HZERO_FILE } from 'utils/config';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { BUCKET_NAME_WMS } from 'hlos-front/lib/utils/config';
import uuidv4 from 'uuid/v4';
import { downloadFile } from 'services/api';
import { deleteFile, userSetting } from 'hlos-front/lib/services/api';
import { detailHeadDS, detailLineDS } from '@/stores/otherWarehousingDS';
import {
  deleteOtherWarehousing,
  changeOtherWarehousing,
  getItemWarehouseTypeApi,
} from '@/services/otherWarehousingService';
import styles from '../list/index.less';
import fileIcon from '../../../assets/icons/file-icon.png';

const todoHeadDataSetFactory = () => new DataSet({ ...detailHeadDS() });
const todoLineDataSetFactory = () => new DataSet({ ...detailLineDS() });

const modalKey = Modal.key();
const removeFields = require('lodash');

const OtherWarehousingDetail = (props) => {
  const HeadDS = useDataSet(todoHeadDataSetFactory, OtherWarehousingDetail);
  const LineDS = useDataSet(todoLineDataSetFactory);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [disableAll, setDisableAll] = useState(true);
  const [isExistenceId, setIsExistenceId] = useState(true);
  const [cancelFlag, setCancelFlag] = useState(true); // 取消按钮是否禁用
  const [closeFlag, setCloseFlag] = useState(true); // 关闭按钮是否禁用
  const [submitFlag, setSubmitFlag] = useState(true); // 提交按钮是否禁用
  const [isSubmitted, setIsSubmitted] = useState(false); // 已提交状态不能编辑
  // 新增附件按钮及逻辑
  const [fileList, setFileList] = useState([]);

  const isSelected = useDataSetIsSelected(LineDS);

  const directory = 'warehouse';

  useEffect(() => {
    HeadDS.create();

    defaultLovSetting();

    return () => {
      if (HeadDS.current) {
        HeadDS.remove(HeadDS.current);
      }
    };
  }, []);

  useDataSetEvent(HeadDS, 'update', ({ record, name }) => {
    setIsDirty(true);
    const { organizationObj, transactionWayCode } = record.toData();
    if (name === 'organizationObj' || name === 'transactionWayCode') {
      if (!isEmpty(organizationObj) && transactionWayCode) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
      record.set({
        requestOperationType: null,
        partyNameObj: null,
        invTransactionNum: null,
        workerNameObj: null,
        departmentNameObj: null,
        sourceDocNum: null,
        warehouseCodeObj: null,
        wmAreaCodeObj: null,
        toWarehouseCodeObj: null,
        toWmAreaCodeObj: null,
        remark: null,
        status: 'NEW',
      });
      LineDS.data = [];
    }
  });

  /**
   * 查询明细数据
   */
  async function detailedData(id) {
    HeadDS.setQueryParameter('invTransactionId', id);
    const res = await HeadDS.query();
    if (res.invTransactionId) {
      setIsExistenceId(false);
    }
    if (res.status === 'COMPLETED' || res.status === 'CANCELLED') {
      setDisableAll(false);
    }
    if (res.status === 'NEW' || res.status === 'RELEASED') {
      setCancelFlag(false);
    }
    if (res.status !== 'NEW' || res.status !== 'CANCELLED' || res.status !== 'CLOSED') {
      setCloseFlag(false);
    }
    if (res.status === 'NEW' && res.invTransactionId) {
      setSubmitFlag(false);
    }
    if (res.status !== 'NEW') {
      setIsSubmitted(true);
    }
    LineDS.data = res.lineList;
  }

  /**
   *设置默认值
   */
  async function defaultLovSetting() {
    const res = await userSetting({ defaultFlag: 'Y' });
    if (res && res.content && res.content[0]) {
      const { organizationId, organizationCode, organizationName } = res.content[0];
      if (organizationId) {
        HeadDS.current.set('organizationObj', {
          organizationId,
          organizationCode,
          organizationName,
        });
      }
    }
  }

  /**
   * 获取行序号
   * @param {*} record 当前行记录
   */
  function getSerialNum(record) {
    const {
      dataSet: { currentPage, pageSize },
      index,
    } = record;
    record.set('transactionLineNum', (currentPage - 1) * pageSize + index + 1);
    return (currentPage - 1) * pageSize + index + 1;
  }

  /**
   * 保存
   */
  async function handleSave(type) {
    const validateArr = await Promise.all([
      HeadDS.validate(false, false),
      LineDS.validate(false, false),
    ]);
    if (validateArr.some((i) => !i)) {
      notification.warning({
        message: '数据校验不通过',
      });
      return;
    }
    const orderLineList = LineDS.toData().map((item) => {
      return {
        ...removeFields.omit(item, [
          'itemCodeObj',
          'toWarehouseCodeObj',
          'toWmAreaCodeObj',
          'warehouseCodeObj',
          'wmAreaCodeObj',
          'uomObj',
        ]),
      };
    });
    HeadDS.current.set('lineList', orderLineList);
    const res = await HeadDS.submit(false, false);
    if (res && !res.failed) {
      if (type === 'add') {
        HeadDS.current.reset();
        LineDS.data = [];
        defaultLovSetting();
      } else {
        detailedData(res.content[0].invTransactionId);
      }
      setIsDirty(false);
    }
  }

  /**
   * 新增发货单行
   */
  async function handleAddLine() {
    setIsDirty(true);
    const record = HeadDS.get(0);
    const lenth = LineDS.toData().length;
    await LineDS.create({
      warehouseCodeObj: record.get('warehouseCodeObj') || null,
      wmAreaCodeObj: record.get('wmAreaCodeObj') || null,
      toWarehouseCodeObj: record.get('toWarehouseCodeObj') || null,
      toWmAreaCodeObj: record.get('toWmAreaCodeObj') || null,
      sourceDocNum: record.get('sourceDocNum') || null,
      // 新增限制逻辑
      transactionWayCode: HeadDS.current.get('transactionWayCode'),
    });
    LineDS.get(lenth)
      .getField('warehouseCodeObj')
      .setLovPara('organizationId', record.get('organizationId'));
    LineDS.get(lenth)
      .getField('toWarehouseCodeObj')
      .setLovPara('organizationId', record.get('organizationId'));
    console.log('LineDS.toData()', LineDS.toData());
  }

  /**
   * table列
   */
  function columns() {
    return [
      { name: 'transactionLineNum', renderer: ({ record }) => getSerialNum(record) },
      {
        name: 'itemCodeObj',
        editor: (record) =>
          record.get('status') === 'NEW' ? <Lov onChange={handleItemChange} /> : false,
      },
      { name: 'itemDescription' },
      { name: 'specification' },
      { name: 'applyQty', editor: (record) => record.get('status') === 'NEW' },
      { name: 'uomObj' },
      { name: 'tagCode', editor: (record) => record.get('status') === 'NEW' },
      { name: 'batchCode', editor: (record) => record.get('status') === 'NEW' },
      // { name: 'warehouseCodeObj', editor: (record) => !record.get('warehouseCode') },
      // { name: 'wmAreaCodeObj', editor: (record) => !record.get('wmAreaCode') },
      // { name: 'toWarehouseCodeObj', editor: (record) => !record.get('toWarehouseCode') },
      // { name: 'toWmAreaCodeObj', editor: (record) => !record.get('toWmAreaCode') },
      // { name: 'sourceDocNum', editor: (record) => !record.get('sourceDocNum') },
      { name: 'warehouseCodeObj', editor: (record) => record.get('status') === 'NEW' },
      {
        name: 'wmAreaCodeObj',
        editor: (record) => {
          return record.get('warehouseCode') && record.get('warehouseCode') !== '';
        },
      },
      { name: 'toWarehouseCodeObj', editor: (record) => record.get('status') === 'NEW' },
      {
        name: 'toWmAreaCodeObj',
        editor: (record) => {
          return record.get('toWarehouseCode') && record.get('toWarehouseCode') !== '';
        },
      },
      { name: 'sourceDocNum', editor: (record) => record.get('status') === 'NEW' },
      { name: 'status' },
      { name: 'pickedQty' },
      { name: 'lineRemark', editor: (record) => record.get('status') === 'NEW' },
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
              <Upload {...lineUploadProps}>
                <Button>
                  <Icon type="file_upload" />
                </Button>
              </Upload>
              <span
                style={{
                  color: '#29BECE',
                  cursor: 'pointer',
                }}
                onClick={(event) => linePictureRenderer(event, fileUrl)}
              >
                {intl.get('hzero.common.button.view').d('查看')}
              </span>
            </div>
          );
        },
      },
    ];
  }

  /**
   *显示超链接
   * @returns
   */
  function linePictureRenderer(event, value) {
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
    console.log('pictures===', JSON.stringify(pictures));
    return pictures.length > 0
      ? Modal.open({
          key: 'wms-other-warehousing-line-pic-modal',
          title: '查看附件',
          className: styles['lwms-other-warehousing-pic-modal'],
          children: (
            <div className={styles.wrapper}>
              <div className={styles['img-list']}>
                {
                  // eslint-disable-next-line array-callback-return
                  pictures.map((file) => {
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
                    // const fileType = file.name.split('.')[1];
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
                {/* disabled */}
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

  async function lineHandleUploadSuccess(res, file) {
    const { current } = LineDS;
    const currentFile = file;
    console.log('于是url', current.get('fileUrl'));
    if (res && !res.failed) {
      current.set(
        'fileUrl',
        current.get('fileUrl') && current.get('fileUrl') !== ''
          ? `${current.get('fileUrl')}#${res}`
          : res
      );
      if (current.toData() && current.toData().invTransactionId) {
        // await handleSave();
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
  function lineDownFile(file) {
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
  function lineHandleRemove() {
    LineDS.current.set('fileUrl', '');
    deleteFile({ file: this.state.fileList[0].url, directory });
    // setFileList([]);
  }

  // 附件上传data
  function lineUploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_WMS,
      directory,
    };
  }
  //  lineUploadProps
  //  const uploadProps = {
  const lineUploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    action: `${HZERO_FILE}/v1/${getCurrentOrganizationId()}/files/multipart`,
    // accept: ['image/*'],
    onSuccess: lineHandleUploadSuccess,
    onRemove: lineHandleRemove,
    onPreview: lineDownFile,
    data: lineUploadData,
    fileList: [],
  };
  //  ================

  function handleItemChange(rec) {
    if (rec) {
      getItemWarehouseType(rec.itemId);
      const { uomId, uom, uomName } = rec;
      if (uomId) {
        LineDS.current.set('uomObj', {
          uomId,
          uomCode: uom,
          uomName,
        });
      }
    } else {
      LineDS.current.set('uomObj', null);
    }
  }

  async function getItemWarehouseType(itemId) {
    const params = {
      itemId,
    };
    const res = await getItemWarehouseTypeApi(params);
    if (res && !res.failed && res.content && res.content[0]) {
      LineDS.current.set('wmCategoryCode', res.content[0].wmCategoryCode);
    }
  }

  function lineButton() {
    return [
      <Button key="add" disabled={isDisabled || !disableAll || isSubmitted} onClick={handleAddLine}>
        新增
      </Button>,
      <Button key="delete" onClick={rowDelete} disabled={!isSelected || isSubmitted}>
        删除
      </Button>,
      <Button
        key="cancel"
        onClick={() => buttonPromptBox('rowCancel')}
        disabled={!isSelected || cancelFlag || !disableAll}
      >
        取消
      </Button>,
      <Button
        key="close"
        onClick={() => buttonPromptBox('rowClose')}
        disabled={!isSelected || closeFlag || !disableAll}
      >
        关闭
      </Button>,
    ];
  }

  /**
   * 按钮提示框
   */
  function buttonPromptBox(type) {
    const headDSData = HeadDS.toData()[0];
    const promptContent = {
      add: '是否保存当前数据',
      close: '是否关闭其他出入库单',
      cancel: '是否取消其他出入库单',
      rowCancel: '是否取消单据行',
      rowClose: '是否关闭发货单行',
    };
    const status = {
      close: 'CLOSED',
      cancel: 'CANCELLED',
      rowCancel: 'CANCELLED',
      rowClose: 'CLOSED',
    };
    const ifType = type === 'close' || type === 'cancel';
    const selected = LineDS.selected.map((item) => item.toData());
    const ifConditions = {
      close:
        headDSData.status === 'NEW' ||
        headDSData.status === 'CANCELLED' ||
        headDSData.status === 'CLOSED', // 头 关闭按钮
      cancel: !(headDSData.status === 'NEW' || headDSData.status === 'RELEASED'), // 头 取消按钮
      rowClose: selected.some(
        (i) => i.status === 'NEW' || i.status === 'CANCELLED' || i.status === 'CLOSED'
      ), // 头 关闭按钮
      rowCancel: selected.some((i) => !(i.status === 'NEW' || i.status === 'RELEASED')), // 头 取消按钮
    };
    const warning = {
      close: '“新增NEW”，“已取消CANCELLED”和“已关闭CLOSED”状态的发货单不允许关闭', // 头 关闭按钮
      cancel: '只有“新增NEW”和“已提交RELEASED”状态的发货单才允许取消', // 头 取消按钮
      rowCancel: '只有“新增NEW”和“已提交RELEASED”状态的发货单才允许取消', // 行 取消按钮
      rowClose: '“新增NEW”和“已取消CANCELLED”和“已关闭CLOSED”状态的其他出入库单行不允许关闭', // 行 关闭按钮
    };
    Modal.confirm({
      key: modalKey,
      title: promptContent[type],
      okText: '是',
      cancelText: '否',
    }).then(async (btnType) => {
      if (type === 'add' && btnType === 'cancel') {
        setIsDirty(false);
        setIsDisabled(true);
        defaultLovSetting();
        HeadDS.current.reset();
        LineDS.data = [];
      }
      if (btnType === 'ok') {
        if (type === 'add') {
          handleSave('add');
          return;
        }
        if (ifConditions[type]) {
          notification.warning({
            message: warning[type],
          });
          return;
        }
        if (ifType) {
          const lineList = LineDS.toData().map((i) => {
            return { ...i, status: status[type] };
          });
          HeadDS.current.set('lineList', lineList);
          HeadDS.current.set('status', status[type]);
        } else {
          LineDS.selected.forEach((item) => {
            item.set('status', status[type]);
          });
        }
        const res = ifType ? await HeadDS.submit(false, false) : await LineDS.submit(true, false);
        if (res && !res.failed) {
          if (ifType) {
            detailedData(res.content[0].invTransactionId);
          } else {
            detailedData(res.content[0].invTransactionId);
          }
        }
      }
    });
  }

  /**
   * 提交
   */
  async function operatingSubmit() {
    const headDSData = HeadDS.toData()[0];
    if (headDSData.status !== 'NEW') {
      notification.warning({
        message: `只有“新增NEW”状态的其他出入库单才允许提交`,
      });
      return;
    }
    const orderLineList = LineDS.toData().map((item) => {
      return { ...item, status: 'RELEASED' };
    });
    const params = {
      ...headDSData,
      status: 'RELEASED',
      lineList: orderLineList,
    };
    const res = await changeOtherWarehousing(params);
    if (res && !res.failed) {
      notification.success({
        message: `操作成功`,
      });
      detailedData(res.invTransactionId);
    }
  }

  /**
   * 删除
   */
  async function operatingDelete() {
    const headDSData = HeadDS.toData()[0];
    if (headDSData.status !== 'NEW') {
      notification.warning({
        message: `只有“新增NEW”状态的发货单行才允许删除`,
      });
      return;
    }
    const orderLineList = LineDS.toData();
    const params = {
      ...headDSData,
      lineList: orderLineList,
    };
    const res = await deleteOtherWarehousing(params);
    if (res && !res.failed) {
      notification.success({
        message: `操作成功`,
      });
      setTimeout(() => {
        props.history.push({
          pathname: `/raumplus/other-warehousing/list`,
        });
      }, 1000);
    }
  }

  /**
   * 行删除
   */
  function rowDelete() {
    const selected = LineDS.selected.map((item) => {
      return { ...item.toData() };
    });
    if (selected.some((i) => i.status !== 'NEW')) {
      notification.warning({
        message: `只有“新增NEW”状态的发货单行才允许删除`,
      });
      return;
    }
    LineDS.delete(LineDS.selected);
  }

  /**
   * 附件上传成功回调
   * */

  async function handleUploadSuccess(res, file) {
    console.log('res===', res);
    console.log('file===', file);
    const { current } = HeadDS;
    const currentFile = file;
    if (res && !res.failed) {
      // current.set('fileUrl', `${(current.get('fileUrl') && current.get('fileUrl') !== '') ? current.get('fileUrl') : ''}#${res}`);
      current.set(
        'fileUrl',
        current.get('fileUrl') && current.get('fileUrl') !== ''
          ? `${current.get('fileUrl')}#${res}`
          : res
      );
      if (current.toData() && current.toData().invTransactionId) {
        // await HeadDS.submit();
        notification.success({
          message: '上传成功',
        });
      }
      currentFile.url = res;
      setFileList([...fileList, currentFile]);
      console.log('fileList', fileList);
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
    this.detailDS.current.set('fileUrl', '');
    deleteFile({ file: fileList[0].url, directory });
    setFileList([]);
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
    fileList,
  };

  return (
    <>
      <Header
        title="创建其他出入库单"
        backPath="/raumplus/other-warehousing/list"
        isChange={isDirty}
      >
        {disableAll ? (
          <>
            <Button icon="save" color="primary" onClick={handleSave} disabled={isSubmitted}>
              保存
            </Button>
            <Button onClick={operatingSubmit} disabled={submitFlag}>
              {intl.get('hzero.common.button.submit').d('提交')}
            </Button>
            <Button onClick={operatingDelete} disabled={isExistenceId}>
              {intl.get('hzero.common.btn.delete').d('删除')}
            </Button>
            <Button onClick={() => buttonPromptBox('cancel')} disabled={cancelFlag}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </Button>
            <Button onClick={() => buttonPromptBox('close')} disabled={closeFlag}>
              {intl.get('hzero.common.button.close').d('关闭')}
            </Button>
            <Button onClick={() => buttonPromptBox('add')} disabled={isSubmitted}>
              {intl.get('hzero.common.button.add').d('新增')}
            </Button>
          </>
        ) : (
          ''
        )}
      </Header>
      <Content>
        <Form dataSet={HeadDS} columns={4}>
          <Lov name="organizationObj" key="organizationObj" disabled={isSubmitted} />
          <Select name="transactionWayCode" key="transactionWayCode" disabled={isSubmitted} />
          <Select
            name="requestOperationType"
            key="requestOperationType"
            disabled={isDisabled || isSubmitted}
          />
          <Lov name="partyNameObj" key="partyNameObj" disabled={isDisabled || isSubmitted} />
          <TextField name="invTransactionNum" key="invTransactionNum" disabled />
          <Lov name="workerNameObj" key="workerNameObj" disabled={isDisabled || isSubmitted} />
          <Lov
            name="departmentNameObj"
            key="departmentNameObj"
            disabled={isDisabled || isSubmitted}
          />
          <TextField name="sourceDocNum" key="sourceDocNum" disabled={isDisabled || isSubmitted} />
          <Lov
            name="warehouseCodeObj"
            key="warehouseCodeObj"
            disabled={isDisabled || isSubmitted}
          />
          <Lov name="wmAreaCodeObj" key="wmAreaCodeObj" disabled={isDisabled || isSubmitted} />
          <Lov
            name="toWarehouseCodeObj"
            key="toWarehouseCodeObj"
            disabled={isDisabled || isSubmitted}
          />
          <Lov name="toWmAreaCodeObj" key="toWmAreaCodeObj" disabled={isDisabled || isSubmitted} />
          <TextField name="remark" key="remark" disabled={isDisabled || isSubmitted} />
          <Select name="status" key="status" disabled />
        </Form>
        <Upload {...uploadProps}>
          <Button>
            <Icon type="file_upload" /> {intl.get(`hzero.common.button.fileUpload`).d('上传文件')}
          </Button>
        </Upload>
        <Table
          dataSet={LineDS}
          columns={columns()}
          columnResizable="true"
          queryBar="none"
          buttons={disableAll ? lineButton() : []}
          highLightRow={false}
        />
      </Content>
    </>
  );
};

export default formatterCollections({
  code: ['lwms.ship', 'lwms.common'],
})(OtherWarehousingDetail);
