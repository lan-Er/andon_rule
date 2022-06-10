/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-04-26 00:12:27
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-06-09 22:51:50
 */
/**
 * @Description: 其他出入库平台行信息
 */
import React from 'react';
import { Table, Tooltip, Button, Modal } from 'choerodon-ui/pro';
import { Icon, Upload } from 'choerodon-ui';
import intl from 'utils/intl';
import uuidv4 from 'uuid/v4';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { HZERO_FILE } from 'utils/config';
import { BUCKET_NAME_WMS } from 'hlos-front/lib/utils/config';
import { downloadFile } from 'services/api';
import { deleteFile } from 'hlos-front/lib/services/api';
import styles from './index.less';
import fileIcon from '../../../assets/icons/file-icon.png';

function LineTable(props) {
  const directory = 'warehouse';
  const columns = [
    { name: 'transactionLineNum' },
    { name: 'itemCode' },
    { name: 'itemDescription' },
    { name: 'specification' },
    { name: 'applyQty' },
    { name: 'uomName' },
    { name: 'tagCode' },
    { name: 'batchCode' },
    { name: 'warehouseCode' },
    { name: 'wmAreaCode' },
    { name: 'toWarehouseCode' },
    { name: 'toWmAreaCode' },
    { name: 'sourceDocNum' },
    { name: 'statusDes' },
    { name: 'pickedQty' },
    {
      name: 'lineRemark',
      width: 150,
      renderer: ({ value }) => (
        <Tooltip placement="bottomRight" title={value} theme="light">
          <span>{value}</span>
        </Tooltip>
      ),
    },
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
    const { current } = props.tableDS;
    const currentFile = file;
    if (res && !res.failed) {
      current.set(
        'fileUrl',
        current.get('fileUrl') && current.get('fileUrl') !== ''
          ? `${current.get('fileUrl')}#${res}`
          : res
      );
      if (current.toData() && current.toData().invTransactionLineId) {
        // await handleSave();
        // current
        props.tableDS.submit();
        // props.tableDS.update(current);
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
    props.tableDS.current.set('fileUrl', '');
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

  return (
    <React.Fragment>
      <Table
        dataSet={props.tableDS}
        border={false}
        columnResizable="true"
        editMode="inline"
        columns={columns}
      />
    </React.Fragment>
  );
}

export default LineTable;
