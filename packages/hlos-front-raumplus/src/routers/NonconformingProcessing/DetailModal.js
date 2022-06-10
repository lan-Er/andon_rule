/**
 * @Description: 不合格品处理--批次Modal
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-01-22 10:28:08
 * @LastEditors: yu.na
 */

import React, { useMemo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import uuidv4 from 'uuid/v4';
import { Button, Modal, DataSet, Table, NumberField } from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';
import { BUCKET_NAME_MES } from 'hlos-front/lib/utils/config';
import { getAccessToken, getCurrentOrganizationId } from 'utils/utils';
import { HZERO_FILE } from 'utils/config';
import Icons from 'components/Icons';
import { LeftTableDS } from '@/stores/nonconformingProcessiongDS';
import intl from 'utils/intl';
import styles from './index.less';

let picturesModal = null;
const directory = 'nonconforming-processing';
const preCode = 'lmes.nonconformingProcessing';

const DetailModal = ({ headerData, onModalClose, dispatch, inspectDocList }) => {
  const leftTableDS = useMemo(() => new DataSet(LeftTableDS()), []);

  const [leftInfo, setLeftInfo] = useState({});

  useEffect(() => {
    leftQuery();
  }, []);

  // 判断是否已经有行数据了 如果有 跳过查询 把行数据赋值到ds
  const leftQuery = async () => {
    const cloneList = [...inspectDocList];
    const idx = inspectDocList.findIndex((i) => i.inspectionDocId === headerData.inspectionDocId);
    if (cloneList[idx].lineList) {
      cloneList[idx].lineList.forEach((i) => {
        leftTableDS.create(i);
      });
      return;
    }
    leftTableDS.queryParameter = {
      inspectionDocId: headerData.inspectionDocId,
    };
    const res = await leftTableDS.query();
    if (res && Array.isArray(res)) {
      if (idx >= 0) {
        cloneList.splice(idx, 1, {
          ...cloneList[idx],
          lineList: res,
        });
        dispatch({
          type: 'nonconformingProcessing/updateState',
          payload: {
            inspectDocList: cloneList,
          },
        });
      }
    }
  };

  const editRender = ({ record }) => {
    return <a onClick={() => handleShowRightTable(record.data)}>处理结果录入</a>;
  };

  const ngQtyRender = ({ value, record }) => {
    return (
      <span>
        {value}/{record.data.batchQty}
      </span>
    );
  };

  const lotOrTagRender = ({ record }) => {
    if (headerData.itemControlType === 'LOT') {
      return record.data.lotNumber;
    }
    return record.data.tagCode;
  };

  // 设置左侧选中行信息
  const handleShowRightTable = (record) => {
    setLeftInfo(record);
  };

  // 设置左侧table列
  const leftColumns = useMemo(() => {
    return [
      {
        name: 'lotOrTag',
        renderer: lotOrTagRender,
      },
      {
        name: 'qcNgQty',
        width: 180,
        renderer: ngQtyRender,
      },
      {
        header: intl.get(`${preCode}.delayQtyEdit`).d('处理结果录入'),
        width: 180,
        renderer: editRender,
      },
    ];
  }, []);

  const imgRender = ({ record }) => {
    return (
      <span className={styles.upload} onClick={() => handlePicturesModal(record.data)}>
        <Icons type="ziyuan54" size="20" />
        <span>上传图片</span>
      </span>
    );
  };

  const propsData = (record) => {
    return {
      name: 'file',
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${HZERO_FILE}/v1/${getCurrentOrganizationId()}/files/multipart`,
      accept: ['image/*'],
      listType: 'picture-card',
      multiple: true,
      data: uploadData,
      onSuccess: (res) => handleImgSuccess(res, record),
      onPreview: handlePreview,
      onRemove: (res) => handleRemove(res, record),
    };
  };

  const uploadButton = () => (
    <div>
      <Icons type="add-blue" size={28} color="#999" />
      <div>
        <span>
          <p>点击上传</p>
          <p>最多可上传9张</p>
        </span>
      </div>
    </div>
  );

  // 上传成功
  const handleImgSuccess = (res, record) => {
    if (!res) {
      return;
    }
    const _fileList = [];
    const fileObj = {
      uid: uuidv4(),
      name: res.split('@')[1],
      status: 'done',
      url: res,
    };
    _fileList.unshift(fileObj);
    leftTableDS.children.detailLine.current.set('exceptionPictures', [
      ..._fileList,
      ...record.exceptionPictures,
    ]);
    // leftTableDS.children.detailLine.current.set('exceptionPicturesUrl', _fileList.map(pic=> pic.url).toString());
    updateModal(record);
  };

  // 预览图片
  const handlePreview = (file) => {
    if (!file.url) return;
    window.open(file.url);
  };

  // 删除图片
  const handleRemove = (file, record) => {
    const _record = record;
    _record.exceptionPictures = record.exceptionPictures.filter((v) => v.uid !== file.uid);
    updateModal(record);
  };

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MES,
      directory,
    };
  };

  const handleConfirm = () => {
    picturesModal.close();
  };

  // 弹框更新
  const updateModal = (record) => {
    picturesModal.update({
      children: (
        <div className={styles.wrapper}>
          <div className={styles['img-list']}>
            <Upload {...propsData(record)} fileList={record.exceptionPictures}>
              {record.exceptionPictures && record.exceptionPictures.length >= 9
                ? null
                : uploadButton()}
            </Upload>
          </div>
          <div className={styles['footer-button']} onClick={() => handleConfirm()}>
            <span>确认</span>
          </div>
        </div>
      ),
    });
  };

  const handlePicturesModal = (record) => {
    picturesModal = Modal.open({
      key: 'nonconforming-processing-pictures-modal',
      title: '图片',
      className: styles['nonconforming-processing-pictures-modal'],
      children: (
        <div className={styles.wrapper}>
          <div className={styles['img-list']}>
            <Upload {...propsData(record)} fileList={record.exceptionPictures}>
              {record.exceptionPictures && record.exceptionPictures.length >= 9
                ? null
                : uploadButton()}
            </Upload>
          </div>
          <div className={styles['footer-button']} onClick={() => handleConfirm()}>
            <span>确认</span>
          </div>
        </div>
      ),
      footer: null,
      movable: true,
      closable: true,
    });
  };

  // 输入数量大于不合格数量时清空，显示“0”；
  // 每输入一次校验一次；不允许大于不合格数量；
  // 需要校验本次确定的异常数量之和≤不合格数量（QC_NG_QTY）
  const handleQtyChange = (val) => {
    const { detailLine } = leftTableDS.children;
    const qtyArr = detailLine.map((i) => i.data.delayQty);
    const totalQty = qtyArr.reduce((pre, cur) => pre + cur);
    const ngQty = leftInfo.qcNgQty || 0;
    if (val > ngQty || totalQty > ngQty) {
      detailLine.current.set('delayQty', 0);
    }
  };

  // 右侧table列
  const rightColumns = useMemo(() => {
    return [
      { name: 'exceptionObj', width: 160, editor: true },
      { name: 'delayWay', width: 150, editor: true },
      { name: 'delayQty', width: 150, editor: <NumberField onChange={handleQtyChange} /> },
      { header: '上传图片', width: 150, renderer: imgRender },
      { name: 'remark', width: 200, editor: true },
    ];
  }, [leftInfo]);

  const handleAddLine = async () => {
    await leftTableDS.children.detailLine.create({}, 0);
  };

  const handleDelLine = async () => {
    await leftTableDS.children.detailLine.delete(leftTableDS.children.detailLine.selected);
  };

  const handleModalOk = () => {
    const cloneList = [...inspectDocList];
    const idx = inspectDocList.findIndex((i) => i.inspectionDocId === headerData.inspectionDocId);
    const newList = cloneList[idx].lineList.map((i) => {
      let _i = i;
      leftTableDS.toJSONData().forEach((j) => {
        if (j.inspectionDocLotId === _i.inspectionDocLotId) {
          _i = j;
        }
      });
      return _i;
    });
    cloneList.splice(idx, 1, {
      ...cloneList[idx],
      checked: true,
      lineList: newList,
    });
    dispatch({
      type: 'nonconformingProcessing/updateState',
      payload: {
        inspectDocList: cloneList,
      },
    });
    onModalClose();
  };

  return (
    <div>
      <div className={styles['table-wrapper']}>
        <div className={styles.left}>
          <div className={styles['item-title']}>
            <span>{headerData.inspectionDocNum}</span>
            <span>{headerData.relatedDocNum}</span>
          </div>
          <div>
            <span className={styles['item-code']}>{headerData.itemCode}</span>
            <span className={styles['item-desc']}>{headerData.description}</span>
          </div>
          <Table dataSet={leftTableDS} columns={leftColumns} columnResizable="true" />
        </div>
        {!isEmpty(leftInfo) && (
          <div className={styles.right}>
            <div>
              <Icons type="item" size="32" color="#1C879C" />
              <span className={styles['item-code']}>{headerData.itemCode}</span>
              <span className={styles['item-desc']}>{headerData.description}</span>
            </div>
            <div>
              <div>
                <span>
                  标签/批次号: <span>{leftInfo.tagCode || leftInfo.lotNumber}</span>
                </span>
                <span>
                  批次数量: <span>{leftInfo.batchQty || 0}</span>
                </span>
                <span>
                  不合格数量: <span className={styles.ng}>{leftInfo.qcNgQty || 0}</span>
                </span>
              </div>
              <div>
                <Icons type="delete" size="24" color="#505050" onClick={handleDelLine} />
                <Icons type="Group3" size="24" color="#505050" onClick={handleAddLine} />
              </div>
            </div>
            <Table
              dataSet={leftTableDS.children.detailLine}
              columns={rightColumns}
              columnResizable="true"
            />
          </div>
        )}
      </div>
      <div className={styles['table-footer']}>
        <Button onClick={onModalClose}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button color="primary" onClick={handleModalOk}>
          {intl.get('lwms.common.button.sure').d('确认')}
        </Button>
      </div>
    </div>
  );
};

export default connect(({ nonconformingProcessing }) => ({
  inspectDocList: nonconformingProcessing?.inspectDocList || [],
}))(DetailModal);
