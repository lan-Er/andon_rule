/**
 * @Description: 标签绑定--Index
 * @Author: tw
 * @Date: 2021-05-11 16:28:08
 * @LastEditors: tw
 */

import React, { useState, useEffect } from 'react';
import { Form, Lov, DataSet, TextField, Modal, Row, Col } from 'choerodon-ui/pro';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import Icons from 'components/Icons';
import { closeTab } from 'utils/menuTab';
import {
  querySubQtyByItemID,
  // queryFert,
  // queryFertLines,
  // fertsSubmit,
  getTagThingByTagCode,
  tagSubmit,
} from '@/services/labelBindingService';
import { queryLovData } from 'hlos-front/lib/services/api';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { HeaderDS } from '@/stores/lableBindingDS';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import processorIcon from 'hlos-front/lib/assets/icons/processor.svg';
import documentTypeIcon from 'hlos-front/lib/assets/icons/document-type.svg';
import scan from 'hlos-front/lib/assets/icons/scan.svg';
import DeleteImg from 'hlos-front/lib/assets/icons/delete.svg';
import styles from './index.less';

import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const commonCode = 'jiachen.common';

const headerDS = () => new DataSet(HeaderDS());

const NonconformingProcessiong = ({ history }) => {
  const headDS = useDataSet(headerDS, NonconformingProcessiong);
  const [avator, setAvator] = useState(null);
  const [fertCodeDisabled, setFertCodeDisabled] = useState(true);
  const [fertData, setFertData] = useState({});
  const [subCodeDisabled, setSubCodeDisabled] = useState(true);
  const [fertLineData, setFertLineData] = useState([]);

  useEffect(() => {
    async function queryDefaultSetting() {
      const res = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(res) && res.content && res.content[0]) {
        headDS.current.set('processorObj', res.content[0]);
        setAvator(res.content[0].fileUrl);
      }
    }
    queryDefaultSetting();
  }, [headDS]);

  const formRender = () => {
    return [
      <Lov
        dataSet={headDS}
        name="processorObj"
        key="processorObj"
        placeholder="处理人"
        prefix={<img src={processorIcon} alt="" style={{ margin: '0 8px' }} />}
        clearButton={false}
        noCache
        // onChange={handleProcessorChange}
      />,
      <Lov
        dataSet={headDS}
        name="itemObj"
        key="itemObj"
        placeholder="物料"
        prefix={<img src={documentTypeIcon} alt="" style={{ margin: '0 8px' }} />}
        noCache
        onChange={handleItemChange}
      />,
    ];
  };

  const handleItemChange = async () => {
    if (headDS.current.get('itemObj') && headDS.current.get('itemObj').itemId) {
      const params = {
        itemCode: headDS.current.get('itemObj').itemCode,
      };
      const res = await querySubQtyByItemID(params);
      headDS.current.set('itemObj', {
        textField: `${headDS.current.get('itemObj').itemCode} (${
          headDS.current.get('itemObj').description
        } ${res.subQty || 0}${headDS.current.get('itemObj').uomName})`,
        itemCode: headDS.current.get('itemObj').itemCode,
        itemName: headDS.current.get('itemObj').itemName,
        itemId: headDS.current.get('itemObj').itemId,
      });
      setFertData({});
      setFertLineData([]);
      setFertCodeDisabled(false);
      setSubCodeDisabled(true);
    } else {
      headDS.current.set('fertCode', null);
      setFertData({});
      setFertLineData([]);
      setFertCodeDisabled(true);
      setSubCodeDisabled(true);
    }
  };

  // 扫描或输入成品码
  const handleFertKeyDown = async (e) => {
    e.persist();
    if (e.keyCode === 13) {
      if (e.target.value) {
        const params = {
          tagCode: e.target.value,
        };
        const res = await getTagThingByTagCode(params);
        if (res && res.failed) {
          notification.error({
            message: res.message,
          });
          headDS.current.set('fertCode', null);
        } else {
          setFertData(res);
          setFertLineData([]);
          setSubCodeDisabled(false);
        }
      }
    }
  };

  const handleSubCodeKeyDown = async (e) => {
    e.persist();
    if (e.keyCode === 13) {
      if (e.target.value) {
        const params = {
          tagCode: e.target.value,
        };
        const res = await getTagThingByTagCode(params);
        if (res && res.failed) {
          notification.error({
            message: res.message,
          });
          headDS.current.set('subCode', null);
        } else {
          let fieldFlag = false;
          if (fertLineData.length > 0) {
            fertLineData.forEach((item) => {
              if (item.tagCode === e.target.value || item.tagCode.toString() === e.target.value) {
                notification.error({
                  message: '该子码已录入',
                });
                fieldFlag = true;
              }
            });
          }
          headDS.current.set('subCode', null);
          if (fieldFlag) {
            return;
          }
          setFertLineData([...fertLineData, res]);
        }
      }
    }
  };

  const handleDelete = (index) => {
    const spliceData = fertLineData;
    spliceData.splice(index, 1);
    setFertLineData([...spliceData]);
  };

  const handleExit = () => {
    Modal.confirm({
      key: Modal.key(),
      children: (
        <span>
          {intl
            .get(`${commonCode}.view.message.exit.no.saving`)
            .d('退出后不保存当前编辑，确认退出？')}
        </span>
      ),
    }).then((button) => {
      if (button === 'ok') {
        history.push('/workplace');
        closeTab('/pub/lmes/nonconforming-processing');
      }
    });
  };

  const handleSubmit = async () => {
    const subCodeList = fertLineData.map((item) => {
      return item.tagCode;
    });
    const params = {
      itemId: headDS.current.get('itemObj').itemId,
      itemCode: headDS.current.get('itemObj').itemCode,
      workerId: headDS.current.get('processorObj').workerId,
      fertCode: headDS.current.get('fertCode'), // 成品code
      subCode: subCodeList, // 子码数据
    };
    const res = await tagSubmit(params);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '绑定成功',
      });
      headDS.current.set('itemObj', null);
      headDS.current.set('fertCode', null);
      headDS.current.set('subCode', null);
      setFertData({});
      setFertLineData([]);
      setFertCodeDisabled(true);
      setSubCodeDisabled(true);
    }
  };

  return (
    <div className={styles['lmes-nonconforming-processing']}>
      <CommonHeader title="标签绑定" />
      <div className={styles['lmes-nonconforming-processing-sub-header']}>
        <img className={styles.avator} src={avator || defaultAvatorImg} alt="" />
        <div className={styles['form-area']}>
          <Form columns={2} labelLayout="placeholder">
            {formRender()}
          </Form>
        </div>
      </div>
      <div className={styles['content-container']}>
        <div className={styles['container-header']}>
          <Row gutter={10}>
            <Col span={8}>
              <div className={`${styles['lov-select']} ${styles['have-right-icon']}`}>
                <TextField
                  dataSet={headDS}
                  name="fertCode"
                  disabled={fertCodeDisabled}
                  // onChange={handleTagAdd}
                  onKeyDown={handleFertKeyDown}
                  placeholder="请扫描或输入成品码"
                />
                <img src={scan} alt="" className={styles['right-icon']} />
              </div>
              {fertData && fertData.tagCode && (
                <span style={{ margin: '20px', fontSize: '16px' }}>
                  已录入成品码: {fertData.tagCode}
                </span>
              )}
            </Col>
          </Row>
        </div>
        <div className={styles['container-table']}>
          <Row gutter={10}>
            <Col span={8}>
              <div className={`${styles['lov-select']} ${styles['have-right-icon']}`}>
                <TextField
                  dataSet={headDS}
                  name="subCode"
                  disabled={subCodeDisabled}
                  // onChange={handleTagAdd}
                  onKeyDown={handleSubCodeKeyDown}
                  placeholder="请扫描或输入子码"
                />
                <img src={scan} alt="" className={styles['right-icon']} />
              </div>
            </Col>
          </Row>
          <div className={styles['tag-list']}>
            {/* <div className={styles['tag-line']}> */}
            {/* <span>23344245242</span> */}
            {/* <img src={DeleteImg} alt="" /> */}
            {/* </div> */}
            {fertLineData.map((item, index) => {
              return (
                <div key={index} className={styles['tag-line']}>
                  <span>{item.tagCode}</span>
                  <img src={DeleteImg} alt="" onClick={() => handleDelete(index)} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles['lmes-nonconforming-processing-footer']}>
        <div className={styles.icon} onClick={handleExit}>
          <Icons type="exit" size="48" />
          <div className={styles.line} />
          <p className={styles.text}>退出</p>
        </div>
        <div>
          <div className={styles.icon} onClick={handleSubmit}>
            {/* <img src={submitImg} alt="" /> */}
            <Icons type="submit" size="48" />
            <div className={styles.line} />
            <p className={styles.text}>提交</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonconformingProcessiong;
