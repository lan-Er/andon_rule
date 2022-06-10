import React from 'react';
import { Modal } from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';
import Icons from 'components/Icons';
import { getAccessToken, getCurrentOrganizationId } from 'utils/utils';
import { HZERO_FILE } from 'utils/config';
import uuidv4 from 'uuid/v4';

import buttonImageIcon from 'hlos-front/lib/assets/icons/image.svg';
import intl from 'utils/intl';
import styles from './index.less';

const intlPrefix = 'lwms.purchaseReceipt.model';
let picturesModal = null;

const ImgUpload = (props) => {
  const { pictures = [], bucketName, directory, onChange, maxPicture, childrens } = props;

  const updateModal = (data) => {
    if (picturesModal) {
      picturesModal.update({
        children: (
          <div className={styles.wrapper}>
            <div className={styles['img-list']}>
              <Upload {...propsData(data)} fileList={data}>
                {data && data.length >= maxPicture ? null : uploadButton()}
              </Upload>
            </div>
            <div className={styles['footer-button']} onClick={() => handleConfirm()}>
              <span>确认</span>
            </div>
          </div>
        ),
      });
    }
  };

  const handleImage = () => {
    picturesModal = Modal.open({
      key: 'img-modal',
      title: '图片',
      className: styles['pictures-modal'],
      children: (
        <div className={styles.wrapper}>
          <div className={styles['img-list']}>
            <Upload {...propsData(pictures)} fileList={pictures}>
              {pictures && pictures.length >= maxPicture ? null : uploadButton()}
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

  const propsData = (data) => {
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
      onSuccess: (res) => handleImgSuccess(res, data),
      onPreview: handlePreview,
      onRemove: (res) => handleRemove(res, data),
      // fileList: this.state.fileList,
    };
  };

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName,
      directory,
    };
  };

  // 上传成功
  const handleImgSuccess = async (res, data) => {
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
    onChange([..._fileList, ...data]);
    updateModal([..._fileList, ...data]);
  };

  // 预览图片
  const handlePreview = (file) => {
    if (!file.url) return;
    window.open(file.url);
  };

  // 删除图片
  const handleRemove = async (file, data) => {
    onChange(data.filter((v) => v.uid !== file.uid));
    updateModal(data.filter((v) => v.uid !== file.uid));
  };

  const uploadButton = () => (
    <div>
      <Icons type="add-blue" size={28} color="#999" />
      <div>
        <span>
          <p>点击上传</p>
          <p>最多可上传{maxPicture}张</p>
        </span>
      </div>
    </div>
  );

  const handleConfirm = () => {
    picturesModal.close();
  };

  return (
    <React.Fragment>
      {!childrens && (
        <div className={`${styles['image-button']} ${styles.button}`} onClick={handleImage}>
          <img src={buttonImageIcon} alt="" />
          <div className={styles['split-line']} />
          <span>{intl.get(`${intlPrefix}.button.image`).d('图片')}</span>
        </div>
      )}
      {childrens && <div onClick={handleImage}>{childrens}</div>}
    </React.Fragment>
  );
};

export default ImgUpload;
