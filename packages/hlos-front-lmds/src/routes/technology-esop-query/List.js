/*
 * @Description: 图纸查询
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-15 15:52:22
 */

import React, { useEffect, useReducer, useState } from 'react';
import { Button, DataSet, Lov, Select, TextField, Form, Modal, Icon } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { Divider } from 'choerodon-ui';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import uuidv4 from 'uuid/v4';

import { queryList } from '@/services/api';
import home from 'hlos-front/lib/assets/home.png';
import esop from 'hlos-front/lib/assets/ESOP@3x.png';
import square from 'hlos-front/lib/assets/square@2x.png';
import { headDS, listDS } from './store/esopQueryDS';

import styles from './index.less';

let modal = null;
let fileModal = null;

const modalKey = Modal.key();

const defaultSearchOption = {
  organizationObj: true,
  esopObj: false,
  productObj: false,
  itemObj: false,
  operationObj: false,
  projectNum: false,
  partyObj: false,
};

const defaultCurShowFile = {
  key: 0,
  fileName: '一步制造',
  fileUrl: esop,
};

const EsopPlatformQueryListPage = () => {
  const [showFlag, setShowFlag] = useState(false);
  const [nextClick, setNextClick] = useState(false);
  const [beforeClick, setBeforeClick] = useState(false);
  const [optionLength, setOptionLength] = useState(4);
  const [esopList, setEsopList] = useState([]); // 图纸信息
  const [fileList, setFileList] = useState([]); // 当前选择的图纸对应的文件列表
  const [curShowFile, setCurShowFile] = useState(defaultCurShowFile); // 当前展示的图纸
  const [fileIndex, setFileIndex] = useState(0); // 当前展示的图纸索引

  const [searchOption, dispatch] = useReducer((_, action) => {
    return { ...defaultSearchOption, ...action };
  }, defaultSearchOption);

  const todoDataSetFactory = () =>
    new DataSet({
      ...listDS(),
    });

  const todoHeadDataSetFactory = () =>
    new DataSet({
      ...headDS(),
      events: {
        update: ({ name, value }) => {
          if (name === 'searchSetting') {
            handleOptChange(value);
          }
        },
      },
    });

  const QueryListDS = useDataSet(todoDataSetFactory);
  const QueryHeadDS = useDataSet(todoHeadDataSetFactory, EsopPlatformQueryListPage);

  /**
   * @description: 首次进入设置默认组织
   */
  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        QueryListDS.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationCode: res.content[0].organizationCode,
          organizationName: res.content[0].organizationName,
        });
      }
    }
    getUserInfo();
  }, []);

  // 图纸信息
  function handleOpenEsopModal(list = esopList) {
    modal = Modal.open({
      key: modalKey,
      closable: true,
      title: '请选择图纸',
      style: {
        width: '970px',
      },
      className: styles['esop-query-modal'],
      children: previewModal(list, 'esop'),
      footer: null,
    });
  }

  /**
   * 查询
   */
  async function handleSearch() {
    let list = [];
    const res = await QueryListDS.query();
    if (res && !res.failed) {
      if (isEmpty(res)) {
        notification.warning({
          message: '暂无数据',
          placement: 'bottomRight',
        });
        setCurShowFile(defaultCurShowFile);
        return;
      }
      if (res.length > 1) {
        list = res.map((v) => ({
          ...v,
          active: false,
        }));
        setEsopList(list);
        handleOpenEsopModal(list);
      } else if (res.length === 1) {
        list = res.map((v) => ({
          ...v,
          active: true,
        }));
        setEsopList(list);
        handleModalConfirm(list, 'esop');
      } else {
        handleOpenEsopModal(list);
      }
    }
  }

  /**
   * 重置
   */
  function handleReset() {
    QueryListDS.queryDataSet.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   * tab查询条件
   * @returns
   */
  function queryFields() {
    const optionArr = [
      <Lov name="esopObj" key="esopObj" placeholder="请选择ESOP" />,
      <Lov name="productObj" key="productObj" placeholder="请选择产品" />,
      <Lov name="itemObj" key="itemObj" placeholder="请选择产品" />,
      <Lov name="operationObj" key="operationObj" placeholder="请选择工序" />,
    ];
    const { organizationObj, projectNum, partyObj } = searchOption;
    if (organizationObj) {
      optionArr.push(<Lov name="organizationObj" key="organizationObj" placeholder="请选择组织" />);
    }
    if (projectNum) {
      optionArr.push(<TextField name="projectNum" key="projectNum" />);
    }
    if (partyObj) {
      optionArr.push(<Lov name="partyObj" key="partyObj" placeholder="请选择商业伙伴" />);
    }
    return optionArr;
  }

  /**
   * 上一个
   */
  function handleBeforeEsop() {
    if (!beforeClick) return;
    const _fileList = fileList.slice();
    if (!_fileList.length) return;
    if (fileIndex > 0) {
      setCurShowFile(_fileList[fileIndex - 1]);
      setFileIndex(fileIndex - 1);
      if (fileIndex - 1 === 0) {
        setBeforeClick(false);
      }
      if (fileIndex < _fileList.length) {
        setNextClick(true);
      }
    }
  }

  /**
   * 下一个
   */
  function handleNextEsop() {
    if (!nextClick) return;
    const _fileList = fileList.slice();
    if (!_fileList.length) return;
    if (fileIndex < _fileList.length) {
      setCurShowFile(_fileList[fileIndex + 1]);
      setFileIndex(fileIndex + 1);
      if (fileIndex + 1 === _fileList.length - 1) {
        setNextClick(false);
      }
      if (fileIndex + 1 > 0) {
        setBeforeClick(true);
      }
    }
  }

  // 展示全部文件
  function handleOpenAllFile() {
    fileModal = Modal.open({
      key: modalKey,
      closable: true,
      title: '请选择文件',
      style: {
        width: '970px',
      },
      className: styles['esop-query-modal'],
      children: previewModal(fileList, 'file'),
      footer: null,
    });
  }

  function previewModal(list, type) {
    return (
      <div className={styles['preview-wrapper']}>
        <div className={styles['modal-content']}>
          {list.map((record) => (
            <div
              className={
                record.active
                  ? `${styles['order-type-card']} ${styles['order-type-card-active']}`
                  : styles['order-type-card']
              }
              onClick={() => handleTypeClick(record, list, type)}
              key={uuidv4()}
            >
              <div className={styles.image}>
                {record.fileUrl &&
                (record.fileUrl.includes('.jpg') ||
                  record.fileUrl.includes('.png') ||
                  record.fileUrl.includes('.svg')) ? (
                    <img src={record.fileUrl} alt={record.esopName} />
                ) : (
                  <img src={home} alt="默认" />
                )}
              </div>
              <div className={styles['file-name']}>
                {type === 'esop' ? (
                  <div className={styles.title}>{`${record.esopCode}_${record.esopName}`}</div>
                ) : (
                  <div className={styles.title}>{record.fileName}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className={styles['modal-footer']}>
          <Button onClick={handleClose}>取消</Button>
          <Button
            className={styles['confirm-button']}
            onClick={() => handleModalConfirm(list, type)}
          >
            确认
          </Button>
        </div>
      </div>
    );
  }

  // 选择图纸编码
  function handleTypeClick(record, list, type) {
    if (type === 'file') {
      const _list = list.map((v) => {
        if (v.fileKey === record.fileKey) {
          return { ...v, active: true };
        }
        return { ...v, active: false };
      });
      modal.update({
        children: previewModal(_list, type),
      });
      setFileList(_list);
      return;
    }
    const _list = list.map((v) => {
      if (v.esopId === record.esopId) {
        return { ...v, active: true };
      }
      return { ...v, active: false };
    });
    modal.update({
      children: previewModal(_list, type),
    });
    setEsopList(_list);
  }

  // 取消
  function handleClose() {
    if (modal) {
      modal.close();
    }
    if (fileModal) {
      fileModal.close();
    }
  }

  // 确认
  async function handleModalConfirm(list, type) {
    if (type === 'file') {
      const activeIndex = list.findIndex((v) => v.active);

      if (activeIndex === -1) {
        notification.warning({
          message: '请至少选择一条数据',
        });
        return;
      }

      setCurShowFile(list[activeIndex]);
      setFileIndex(activeIndex);
      setBeforeClick(activeIndex !== 0);
      setNextClick(activeIndex !== fileList.length);
      fileModal.close();
      return;
    }

    const activeData = list.filter((v) => v.active);
    if (!activeData.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    const resp = await queryList({
      directory: activeData[0].fileUrl,
    });
    if (resp && resp.content && resp.content.length) {
      const dataList = resp.content.map((v) => ({ ...v, active: false }));
      setFileList(dataList);
      setFileIndex(0);
      setCurShowFile(dataList[0]);
      setNextClick(dataList.length > 1);
    } else if (resp && resp.content && resp.content.length === 0) {
      notification.error({
        message: '未查到图片或文件',
      });
    } else if (resp && resp.failed) {
      notification.error({
        message: resp.message,
      });
    }
    modal.close();
  }

  /**
   * 查询设置选择
   * @param {*} value 当前已选择字段
   */
  function handleOptChange(value) {
    const options = { ...searchOption, organizationObj: false };
    if (isEmpty(value)) {
      dispatch(options);
      setOptionLength(4);
      return;
    }
    value.forEach((item) => {
      if (item === 'ORGANIZATION') {
        options.organizationObj = true;
      } else if (item === 'ESOP') {
        options.esopObj = true;
      } else if (item === 'PRODUCT') {
        options.productObj = true;
      } else if (item === 'ITEM') {
        options.itemObj = true;
      } else if (item === 'OPERATION') {
        options.operationObj = true;
      } else if (item === 'PROJECT') {
        options.projectNum = true;
      } else if (item === 'PARTY') {
        options.partyObj = true;
      }
    });
    handleReset();
    dispatch(options);
    setOptionLength(value.length <= 4 ? 4 : value.length);
  }

  /**
   * 查询折叠按钮
   */
  function getSearchButton() {
    if (optionLength > 4) {
      if (!showFlag) {
        return intl.get('hzero.common.button.viewMore').d('更多查询');
      } else {
        return intl.get('hzero.common.button.collected').d('收起查询');
      }
    }
  }

  /**
   * 展示图纸 iframe props
   */
  function getIframeProps() {
    const iframeProps = {
      width: '100%',
      height: '85%',
      allowFullScreen: true,
      webkitallowfullscreen: 'true',
      mozallowfullscreen: 'true',
      oallowfullscreen: 'true',
      msallowfullscreen: 'true',
      frameBorder: '0',
    };
    if (curShowFile.fileUrl && curShowFile.fileKey && curShowFile.fileUrl.indexOf('pdf') !== -1) {
      iframeProps.src = curShowFile.fileUrl;
    } else if (curShowFile.fileUrl && curShowFile.fileKey) {
      iframeProps.srcDoc = `<img src=${curShowFile.fileUrl} width="100%" height="100%" alt="home" />`;
    } else {
      iframeProps.srcDoc = `<img src=${esop} width="100%" height="100%" alt="home" />`;
    }
    return iframeProps;
  }

  function load() {
    // 图片全屏
    const x = document.getElementById('esop-home-iframe');
    const y = x.contentWindow || x.contentDocument;
    let dom;
    if (y.document) {
      dom = y.document;
    }
    dom.documentElement.style.height = '100%';
    dom.body.style.height = '100%';
  }

  return (
    <div className={styles['esop-box']}>
      <div className={styles['esop-header']}>
        <div className={styles['esop-header-title']}>SOP</div>
        <div className={styles['esop-header-setting']}>
          <Select dataSet={QueryHeadDS} name="searchSetting" maxTagCount={1} maxTagTextLength={2} />
        </div>
      </div>
      <div className={styles['esop-content-box']}>
        <div className={styles['esop-query-bar']}>
          {!!optionLength && (
            <>
              <Form dataSet={QueryListDS.queryDataSet} columns={4}>
                {!showFlag && optionLength > 4 ? queryFields().slice(0, 4) : queryFields()}
              </Form>
              <div
                style={{
                  marginLeft: 15,
                  marginTop: 10,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {optionLength > 4 && <Button onClick={handleToggle}>{getSearchButton()}</Button>}
                {optionLength && (
                  <Button onClick={handleReset}>
                    {intl.get('hzero.common.button.reset').d('重置')}
                  </Button>
                )}
                {optionLength && (
                  <Button color="primary" onClick={() => handleSearch()}>
                    {intl.get('hzero.common.button.search').d('查询')}
                  </Button>
                )}
                {esopList.length && (
                  <Button color="primary" onClick={() => handleOpenEsopModal()}>
                    图纸信息
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
        <div className={styles['esop-content']}>
          <img src={square} alt="square" className={styles['esop-content-square']} />
          <div className={styles['esop-content-header']}>
            <h2 className={styles['esop-content-title']}>{curShowFile.fileName}</h2>
            <div className={styles['select-btn']}>
              <span
                onClick={handleBeforeEsop}
                className={`${styles['select-btn-item']} ${
                  !beforeClick && styles['select-btn-disabled']
                }`}
              >
                <Icon type="navigate_before" style={{ verticalAlign: 'sub' }} /> 上一个
              </span>
              <Divider type="vertical" style={{ verticalAlign: 'sub' }} />
              <span
                onClick={handleNextEsop}
                className={`${styles['select-btn-item']} ${
                  !nextClick && styles['select-btn-disabled']
                }`}
              >
                下一个 <Icon type="navigate_next" style={{ verticalAlign: 'sub' }} />
              </span>
              <Divider type="vertical" style={{ verticalAlign: 'sub' }} />
              <span onClick={handleOpenAllFile} className={styles['select-btn-item']}>
                全部
              </span>
            </div>
          </div>
          <div className={styles['esop-content-iframe']}>
            <iframe
              id="esop-home-iframe"
              title={curShowFile.fileName}
              onLoad={load}
              {...getIframeProps()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsopPlatformQueryListPage;
