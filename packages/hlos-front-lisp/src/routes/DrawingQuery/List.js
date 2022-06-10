/*
 * @Description: 图纸查询
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 15:58:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-25 14:29:10
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { useReducer, useState } from 'react';
import { Button, DataSet, Select, TextField, Form, Modal, Icon } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { Divider } from 'choerodon-ui';
import { getCurrentUser } from 'utils/utils';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { queryList } from '@/services/api';
import { headDS, listDS } from '@/stores/drawingQueryDS';

import styles from './index.less';
import home from './assets/home.png';
import square from './assets/square@2x.png';

let modal = null;

const modalKey = Modal.key();
const { loginName } = getCurrentUser();

const defaultSearchOption = {
  attribute2: true,
  attribute10: false,
  attribute13: false,
  attribute15: false,
  attribute17: false,
  attribute19: false,
  attribute21: false,
};

const defaultCurFile = {
  drawingCode: 'Home',
  drawingName: '一步制造',
  lineList: [
    {
      key: 0,
      title: '一步制造',
      fileUrl: home,
    },
  ],
};

const defaultCurShowFile = {
  key: 0,
  title: '一步制造',
  fileUrl: home,
};

const DrawingPlatformQueryListPage = () => {
  const [showFlag, setShowFlag] = useState(false);
  const [nextClick, setNextClick] = useState(false);
  const [beforeClick, setBeforeClick] = useState(false);
  const [optionLength, setOptionLength] = useState(1);
  const [curFile, setCurFile] = useState(defaultCurFile); // 当前选择的行列表
  const [curShowFile, setCurShowFile] = useState(defaultCurShowFile); // 当前展示的图纸

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
  const QueryHeadDS = useDataSet(todoHeadDataSetFactory, DrawingPlatformQueryListPage);

  /**
   * 切换图纸
   * @param {string} value 图纸编码
   * @param {*} dataList 图纸列表
   */
  function handleChange(value, dataList) {
    const fileItem = dataList.find((item) => item.drawingCode === value);
    if (!isEmpty(fileItem)) {
      setCurFile(fileItem);
      setCurShowFile(fileItem.lineList[0]);
      if (fileItem.lineList.length > 1) {
        setNextClick(true);
      } else {
        setNextClick(false);
        setBeforeClick(false);
      }
    }
    modal.close();
  }

  /**
   * 图纸预览
   * @param {Array} dataList 图纸列表
   * @returns
   */
  function getModalPreview(dataList) {
    return (
      <div className={styles['preview-modal']}>
        {!isEmpty(dataList) &&
          dataList.map((item) => (
            <div
              className={styles['preview-item-content']}
              onClick={() => handleChange(item.drawingCode, dataList)}
            >
              <iframe
                src={`${item.lineList[0].fileUrl}#toolbar=0`}
                title={item.lineList[0].title}
                width="200px"
                height="120px"
                scrolling="no"
              />
              <p className={styles['drawing-item-title']}>
                {item.drawingCode}_{item.drawingName}
              </p>
            </div>
          ))}
      </div>
    );
  }

  /**
   * 格式化图纸地址
   * @param {string} data 图纸地址
   * @return 图纸列表
   */
  function formatUrl(data) {
    if (isEmpty(data)) return data;
    const urlList = data.split(';');
    const dataList = urlList.map((item, index) => {
      return {
        key: index,
        title: item.split('@')[1],
        fileUrl: item,
      };
    });
    return dataList;
  }

  /**
   * 查询行数据
   * @param {Array} list 头列表
   */
  function handleSearchLineAll(list) {
    return new Promise((resolve, reject) => {
      if (list.length === 0) {
        resolve([]);
      } else {
        const result = [];
        let index = 0;
        for (let i = 0; i < list.length; i++) {
          queryList({
            user: loginName,
            attribute1: list[i].attribute2,
            functionType: 'DRAWING',
            dataType: 'DRAWING_EDIT_HEAD_LINE',
          }).then(
            // eslint-disable-next-line no-loop-func
            (res) => {
              const lastUpdateItem = res.content.sort((a, b) => b.attribute10 - a.attribute10)[0];
              result[i] = {
                drawingCode: list[i].attribute2,
                drawingName: list[i].attribute3,
                lineList: formatUrl(lastUpdateItem.attribute5),
              };
              if (++index === list.length) {
                resolve(result);
              }
            },
            (err) => {
              reject(err);
              return false;
            }
          );
        }
      }
    });
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const queryData = QueryListDS.queryDataSet.toData()[0];

    let validateValue = true;

    if (!isEmpty(queryData)) {
      for (const key in searchOption) {
        // eslint-disable-next-line no-prototype-builtins
        if (searchOption.hasOwnProperty(key) && searchOption[key] && !queryData[key]) {
          validateValue = false;
          break;
        }
      }
    } else {
      validateValue = false;
    }

    if (!validateValue) {
      notification.warning({
        message: '存在必输查询条件未输入',
      });
      return;
    }

    const res = await QueryListDS.query();
    if (res && !res.failed) {
      if (isEmpty(res.content)) {
        notification.warning({
          message: '暂无数据',
          placement: 'bottomRight',
        });
        setCurFile(defaultCurFile);
        setCurShowFile(defaultCurShowFile);
        return;
      }
      handleSearchLineAll(res.content).then((result) => {
        if (isEmpty(result)) {
          notification({
            message: '暂无数据',
            placement: 'bottomRight',
          });
          return;
        }
        if (result.length === 1) {
          setCurFile(result[0]);
          setCurShowFile(result[0].lineList[0]);
          if (result[0].lineList.length > 1) {
            setNextClick(true);
          } else {
            setNextClick(false);
            setBeforeClick(false);
          }
        } else {
          modal = Modal.open({
            key: modalKey,
            closable: true,
            title: '请选择图纸',
            style: {
              width: '970px',
            },
            className: styles['drawing-query-modal'],
            children: getModalPreview(result),
            footer: null,
          });
        }
      });
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

  // 值集模糊查询
  function searchMatcher({ record, text }) {
    const reg = new RegExp(text, 'i');
    return record.get('value').match(reg);
  }

  /**
   * tab查询条件
   * @returns
   */
  function queryFields() {
    const optionArr = [];
    const {
      attribute2,
      attribute10,
      attribute13,
      attribute15,
      attribute17,
      attribute19,
      attribute21,
    } = searchOption;
    if (attribute2) {
      optionArr.push(
        <Select
          name="attribute2"
          key="attribute2"
          searchable
          searchMatcher={searchMatcher}
          required
        />
      );
    }
    if (attribute10) {
      optionArr.push(
        <Select
          name="attribute10"
          key="attribute10"
          searchable
          searchMatcher={searchMatcher}
          required
        />
      );
    }
    if (attribute13) {
      optionArr.push(
        <Select
          name="attribute13"
          key="attribute13"
          searchable
          searchMatcher={searchMatcher}
          required
        />
      );
    }
    if (attribute15) {
      optionArr.push(
        <Select
          name="attribute15"
          key="attribute15"
          searchable
          searchMatcher={searchMatcher}
          required
        />
      );
    }
    if (attribute17) {
      optionArr.push(
        <Select
          name="attribute17"
          key="attribute17"
          searchable
          searchMatcher={searchMatcher}
          required
        />
      );
    }
    if (attribute19) {
      optionArr.push(<TextField name="attribute19" key="attribute19" required />);
    }
    if (attribute21) {
      optionArr.push(<TextField name="attribute21" key="attribute21" required />);
    }
    return optionArr;
  }

  /**
   * 上一个
   */
  function handleBeforeDrawing() {
    if (!beforeClick) return false;
    const { lineList } = curFile;
    const { key } = curShowFile;
    if (!lineList.length) return false;
    if (key > 0) {
      setCurShowFile(lineList[key - 1]);
      if (key - 1 === 0) {
        setBeforeClick(false);
      }
      if (key - 1 < lineList.length - 1 && key - 1 === 0) {
        setNextClick(true);
      }
    }
  }

  /**
   * 下一个
   */
  function handleNextDrawing() {
    if (!nextClick) return false;
    const { lineList } = curFile;
    const { key } = curShowFile;
    if (!lineList.length) return false;
    if (key < lineList.length) {
      setCurShowFile(lineList[key + 1]);
      if (key + 1 === lineList.length - 1) {
        setNextClick(false);
      }
      if (key + 1 > 0) {
        setBeforeClick(true);
      }
    }
  }

  /**
   * 查询设置选择
   * @param {*} value 当前已选择字段
   */
  function handleOptChange(value) {
    const options = { ...searchOption, attribute2: false };
    if (isEmpty(value)) {
      dispatch(options);
      setOptionLength(0);
      return;
    }
    value.forEach((item) => {
      options[item] = true;
    });
    handleReset();
    dispatch(options);
    setOptionLength(value.length);
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
   * 默认图纸
   */
  function getDefaultImage() {
    const { fileUrl } = defaultCurFile.lineList[0];
    return `<img src=${fileUrl} width="100%" alt="home" />`;
  }

  /**
   * 展示图纸 iframe props
   */
  function getIframeProps() {
    const iframeProps = {
      width: '100%',
      height: '90%',
      allowFullScreen: true,
      webkitallowfullscreen: 'true',
      mozallowfullscreen: 'true',
      oallowfullscreen: 'true',
      msallowfullscreen: 'true',
      frameBorder: '0',
    };
    if (curFile.drawingCode === 'Home') {
      iframeProps.srcDoc = getDefaultImage();
    } else {
      iframeProps.src = `${curShowFile.fileUrl}#toolbar=0`;
    }
    return iframeProps;
  }

  return (
    <div className={styles['drawing-box']}>
      <div className={styles['drawing-header']}>
        <div className={styles['drawing-header-title']}>图纸查询</div>
        <div className={styles['drawing-header-setting']}>
          <Select dataSet={QueryHeadDS} name="searchSetting" maxTagCount={1} maxTagTextLength={2} />
        </div>
      </div>
      <div className={styles['drawing-content-box']}>
        <div className={styles['drawing-query-bar']}>
          {!!optionLength && (
            <>
              <Form dataSet={QueryListDS.queryDataSet} columns={4}>
                {!showFlag && optionLength > 4 ? queryFields().slice(0, 4) : queryFields()}
              </Form>
              <div style={{ marginTop: 10, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {optionLength > 4 && <Button onClick={handleToggle}>{getSearchButton()}</Button>}
                <Button onClick={handleReset}>
                  {intl.get('hzero.common.button.reset').d('重置')}
                </Button>
                <Button color="primary" onClick={() => handleSearch()}>
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
              </div>
            </>
          )}
        </div>
        <div className={styles['drawing-content']}>
          <img src={square} alt="square" className={styles['drawing-content-square']} />
          <div className={styles['drawing-content-header']}>
            <h2 className={styles['drawing-content-title']}>{curShowFile.title}</h2>
            <div className={styles['select-btn']}>
              <span
                onClick={handleBeforeDrawing}
                className={`${styles['select-btn-item']} ${
                  !beforeClick && styles['select-btn-disabled']
                }`}
              >
                <Icon type="navigate_before" style={{ verticalAlign: 'sub' }} /> 上一个
              </span>
              <Divider type="vertical" style={{ verticalAlign: 'sub' }} />
              <span
                onClick={handleNextDrawing}
                className={`${styles['select-btn-item']} ${
                  !nextClick && styles['select-btn-disabled']
                }`}
              >
                下一个 <Icon type="navigate_next" style={{ verticalAlign: 'sub' }} />
              </span>
            </div>
          </div>
          <div className={styles['drawing-content-iframe']}>
            <iframe id="drawing-home-iframe" title={curShowFile.title} {...getIframeProps()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingPlatformQueryListPage;
