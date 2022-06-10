/*
 * @Description: 设备履历
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-23 10:22:03
 */
import React, { useState, useEffect, useRef } from 'react';
import { Header } from 'components/Page';
import {
  DataSet,
  Lov,
  Form,
  Button,
  Select,
  DatePicker,
  DateTimePicker,
  Modal,
  TextField,
  Spin,
} from 'choerodon-ui/pro';
import { Upload, Icon } from 'choerodon-ui';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HZERO_FILE } from 'utils/config';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting, deleteFile } from 'hlos-front/lib/services/api';
import { getResponse, getAccessToken, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';

import { queryEquipmentLines, resourceTracks } from '@/services/equipmentResumeService';
import { EquipmentListDS, EquipmentLineDS, EquipmentAddDS } from '../store/EquipmentResumeDS.js';
import SubHeader from './sub-header.js';
import ContentArea from './content-area.js';
import DetailsModal from './details-modal.js';

import styles from './index.less';

const organizationId = getCurrentOrganizationId();
const directory = 'equipment-resume';
const modalKey = Modal.key();
let uploadModal = null;

const listFactory = () => new DataSet(EquipmentListDS());
const lineFactory = () => new DataSet(EquipmentLineDS());
const addFactory = () => new DataSet(EquipmentAddDS());

export default function EquipmentResume() {
  const listDS = useDataSet(listFactory, EquipmentResume);
  const lineDS = useDataSet(lineFactory);
  const addDS = useDataSet(addFactory);
  const [loading, setLoading] = useState(false);
  const [equipmentData, setEquipmentData] = useState({});
  const [lineList, setLineList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const fileListRef = useRef(fileList);

  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        if (listDS.queryDataSet.current) {
          listDS.queryDataSet.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationCode: res.content[0].organizationCode,
            organizationName: res.content[0].organizationName,
          });
        }
        if (addDS.current) {
          addDS.current.set('organizationId', res.content[0].organizationId);
          addDS.current.set('workerObj', {
            workerId: res.content[0].workerId,
            workerCode: res.content[0].workerCode,
            workerName: res.content[0].workerName,
          });
        }
        if (lineDS.current) {
          lineDS.current.set('organizationId', res.content[0].organizationId);
        }
      }
    }
    getUserInfo();
  }, []);

  useEffect(() => {
    fileListRef.current = fileList;
  }, [fileList]);

  const queryFields = [
    <Lov name="organizationObj" key="organizationObj" placeholder="组织" />,
    <Lov name="equipmentObj" key="equipmentObj" placeholder="设备" onChange={handleEquipment} />,
    <Select name="trackType" />,
    <Lov name="workerObj" key="workerObj" placeholder="操作工" />,
    <DatePicker name="time" placeholder={['开始日期', '结束日期']} />,
  ];

  const addFields = [
    <Select name="trackType" />,
    <DateTimePicker name="trackTime" />,
    <Lov name="workerObj" key="workerObj" />,
    <Lov name="linkResourceObj" key="linkResourceObj" />,
    <TextField name="remark" key="remark" colSpan={2} />,
    <Lov name="prodLineObj" key="prodLineObj" />,
    <Lov name="toProdLineObj" key="toProdLineObj" />,
    <Lov name="workcellObj" key="workcellObj" />,
    <Lov name="toWorkcellObj" key="toWorkcellObj" />,
    <Lov name="locationObj" key="locationObj" />,
    <Lov name="toLocationObj" key="toLocationObj" />,
    <TextField name="outsideLocation" key="outsideLocation" />,
    <TextField name="toOutsideLocation" key="toOutsideLocation" />,
  ];

  function handleEquipment(value) {
    if (value) {
      handleSearch();
    }
  }

  // 更多 - 筛选
  function handleMoreModal() {
    Modal.open({
      key: modalKey,
      title: '更多查询',
      drawer: true,
      drawerTransitionName: 'slide-right',
      closable: true,
      children: <Form dataSet={lineDS}>{queryFields.slice(2, queryFields.length)}</Form>,
      onOk: () => handleSearchLine(),
    });
  }

  async function handleSearch() {
    const isValid = await listDS.queryDataSet.validate(false, false);
    if (isValid) {
      const resp = await listDS.query();
      if (getResponse(resp) && resp?.content?.length) {
        setEquipmentData(resp.content[0]);
        handleSearchLine(resp.content[0]);
      } else {
        notification.warning({
          message: '暂无满足条件的数据',
        });
      }
    }
  }

  // 获取行数据
  async function handleSearchLine(data = equipmentData) {
    if (!data.equipmentId) {
      notification.warning({
        message: '请先完成设备录入',
      });
      return;
    }
    setLoading(true);
    const _lineDate = lineDS.current.toJSONData();
    const { trackType, workerId, time } = _lineDate;
    const resp = await queryEquipmentLines({
      resourceId: data.equipmentId,
      trackType,
      workerId,
      trackTimeStart: time?.trackTimeStart
        ? moment(time.trackTimeStart).format(DEFAULT_DATETIME_FORMAT)
        : '',
      trackTimeEnd: time?.trackTimeEnd
        ? moment(time.trackTimeEnd).format(DEFAULT_DATETIME_FORMAT)
        : '',
    });
    if (getResponse(resp)) {
      const _lineList = resp.content.map((v) => {
        const _trackTime = v.trackTime.split(' ');
        return {
          ...v,
          _date: _trackTime[0],
          _dateTime: _trackTime[1],
          imgList: v.pictures ? v.pictures.split('#') : [],
        };
      });
      setLineList(_lineList);
      setLoading(false);
    }
  }

  function showDetailModal(item) {
    const data = {
      ...item,
    };
    Modal.open({
      key: modalKey,
      title: '设备履历明细',
      drawer: true,
      drawerTransitionName: 'slide-right',
      closable: true,
      className: styles['lmds-equipment-resume-details-modal'],
      children: <DetailsModal data={data} detailsPreview={handlePreview} />,
    });
  }

  function uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory,
    };
  }

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: ['image/*'],
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    multiple: true,
    listType: 'picture',
    onSuccess: handleUploadSuccess,
    onRemove: handleRemove,
    onPreview: handlePreview,
    data: uploadData,
    fileList,
  };

  // 预览图片
  function handlePreview(file) {
    if (!file.url) return;
    window.open(file.url);
  }

  // 上传文件
  function handleUploadSuccess(res) {
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      let _fileList = fileListRef.current.slice();
      const fileObj = {
        uid: uuidv4(),
        name: res.split('@')[1],
        status: 'done',
        url: res,
        thumbUrl: res,
      };
      _fileList.unshift(fileObj);
      if (_fileList.length > 9) {
        _fileList = _fileList.slice(_fileList.length - 9, _fileList.length);
      }
      setFileList(_fileList);
      handleUpdateModal(_fileList);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  }

  // 移除文件
  function handleRemove(file) {
    let _fileList = fileListRef.current.slice();
    _fileList = _fileList.filter((v) => v.uid !== file.uid);
    deleteFile({ file: file.url, directory });
    setFileList(_fileList);
    handleUpdateModal(_fileList);
  }

  function handleUpdateModal(list = fileListRef.current) {
    uploadModal.update({
      key: modalKey,
      title: '设备履历明细',
      drawerTransitionName: 'slide-right',
      closable: true,
      children: (
        <div className={styles['add-modal']}>
          <div className={styles['header-info']}>
            <span>{equipmentData.organizationName}</span>
            <span>{equipmentData.equipmentName}</span>
          </div>
          <Form dataSet={addDS} columns={2}>
            {addFields}
          </Form>
          <Upload {...uploadProps} fileList={list}>
            {list.length >= 9 ? null : (
              <Button>
                <Icon type="file_upload" />
                上传图片
              </Button>
            )}
          </Upload>
        </div>
      ),
    });
  }

  // 新增弹框
  function handleAdd() {
    const _data = listDS.queryDataSet.current.toJSONData();
    if (!_data.organizationName || !_data.equipmentName) {
      notification.warning({
        message: '请先完成必输项',
      });
      return;
    }
    uploadModal = Modal.open({
      key: modalKey,
      title: '设备履历明细',
      drawer: true,
      drawerTransitionName: 'slide-right',
      closable: true,
      className: styles['lmds-equipment-resume-add-modal'],
      children: (
        <div className={styles['add-modal']}>
          <div className={styles['header-info']}>
            <span>{_data.organizationName}</span>
            <span>{_data.equipmentName}</span>
          </div>
          <Form dataSet={addDS} columns={2}>
            {addFields}
          </Form>
          <Upload {...uploadProps}>
            {fileListRef.current.length >= 9 ? null : (
              <Button>
                <Icon type="file_upload" />
                上传图片
              </Button>
            )}
          </Upload>
        </div>
      ),
      onOk: () => handleSubmit(),
    });
  }

  async function handleSubmit() {
    const isValid = await addDS.validate(false, false);
    if (!isValid) return false;
    const fileUrls = fileListRef.current.map((v) => v.url);
    const params = [
      {
        organizationId: listDS.queryDataSet.current.get('organizationId'),
        organizationCode: listDS.queryDataSet.current.get('organizationCode'),
        resourceId: equipmentData.equipmentId,
        resourceCode: equipmentData.equipmentCode,
        pictures: fileUrls.join('#'),
        ...addDS.current.toJSONData(),
      },
    ];
    const resp = await resourceTracks(params);
    if (getResponse(resp)) {
      notification.success({
        message: '提交成功',
      });
      handleSearchLine();
    }
  }

  return (
    <div className={styles['lmds-equipment-resume']}>
      <Header title="设备履历">
        <div className={styles['equipment-lov-choose']} span={14}>
          <Form dataSet={listDS.queryDataSet}>{queryFields.slice(0, 2)}</Form>
          <Button
            className={`${styles['left-button']} ${styles['more-button']}`}
            onClick={handleMoreModal}
          >
            更多查询
          </Button>
          <Button
            color="primary"
            className={`${styles['left-button']} ${styles['search-button']}`}
            onClick={() => handleAdd()}
          >
            新增
          </Button>
        </div>
      </Header>
      {Object.keys(equipmentData).length ? (
        <div className={styles['equipment-resume-content']}>
          <SubHeader {...equipmentData} />
          <ContentArea lineList={lineList} showDetailModal={showDetailModal} />
        </div>
      ) : null}
      {loading ? (
        <div className={styles['my-loading-yes-no']}>
          <Spin tip="Loading..." />
        </div>
      ) : null}
    </div>
  );
}
