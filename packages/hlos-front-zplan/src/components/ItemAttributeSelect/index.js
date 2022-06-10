/**
 * @Description: 物料属性选择弹框
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-15 14:28:19
 */

import React, { useState, useEffect } from 'react';
import { DataSet, Modal, Button, Form, Select, TextField } from 'choerodon-ui/pro';
import request from 'utils/request';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import styles from './index.less';

let formDS;
let selectModal;
let attrData = [];
const { Option } = Select;
const selectModalKey = Modal.key();

export default ({
  itemId = '',
  itemDesc = '',
  data = {},
  handleSure,
  disabled,
  warning,
  required = true,
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      handleSearch();
    }
  }, [visible]);

  function getFormDS() {
    const arr = [
      {
        name: 'itemCode',
        type: 'string',
        label: '物料编码',
      },
      {
        name: 'itemDesc',
        type: 'string',
        label: '物料名称',
      },
    ];
    attrData.forEach((v, index) => {
      arr.push({
        name: `attributeId${index + 1}`,
        type: 'string',
      });
      arr.push({
        name: `attributeCode${index + 1}`,
        type: 'string',
      });
      arr.push({
        name: `attributeDesc${index + 1}`,
        type: 'string',
      });
      arr.push({
        name: `attributeValue${index + 1}`,
        type: 'string',
        label: v.attributeDesc,
        required,
      });
    });
    return {
      autoCreate: true,
      fields: arr,
    };
  }

  async function initForm() {
    formDS = await new DataSet(getFormDS());
    formDS.current.set('itemCode', attrData[0].itemCode);
    formDS.current.set('itemDesc', itemDesc);
    attrData.forEach((v, index) => {
      formDS.current.set(`attributeId${index + 1}`, v.attributeId);
      formDS.current.set(`attributeCode${index + 1}`, v.attributeCode);
      formDS.current.set(`attributeDesc${index + 1}`, v.attributeDesc);
    });
    if (data && data.attributeValue1) {
      formDS.data = [
        {
          ...formDS.current.toData(),
          ...data,
        },
      ];
    }
    openModal();
  }

  async function handleSearch() {
    return new Promise(async (resolve) => {
      setLoading(true);
      request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/item-attributes`, {
        method: 'GET',
        query: {
          itemId,
        },
      }).then(async (res) => {
        if (res && !res.failed) {
          if (!res.content.length) {
            notification.warning({
              message: '当前物料无关键属性配置',
            });
            setVisible(false);
          } else {
            attrData = res.content;
            initForm();
          }
        } else {
          notification.error({
            message: res.message,
          });
          resolve(setLoading(false));
          return;
        }
        resolve(setLoading(false));
      });
    });
  }

  async function handleOk() {
    const validate = await formDS.current.validate(true, false);
    if (!validate) {
      notification.warning({
        message: '数据校验不通过',
      });
      return false;
    }
    setVisible(false);
    handleSure({
      ...formDS.current.toData(),
      attributeNum: attrData.length,
    });
  }

  function handleCancel() {
    selectModal.close();
    setVisible(false);
  }

  function openModal() {
    selectModal = Modal.open({
      title: '属性值',
      key: selectModalKey,
      style: { width: 400 },
      children: (
        <Form dataSet={formDS} columns={1} labelLayout="vertical">
          <TextField name="itemCode" key="itemCode" disabled />
          <TextField name="itemDesc" key="itemDesc" disabled />
          {attrData.map((ele, index) => (
            <Select name={`attributeValue${index + 1}`} key={`attributeValue${index + 1}`}>
              {ele.itemAttributeValueList.map((v) => (
                <Option value={v.attributeValue}>{v.attributeValue}</Option>
              ))}
            </Select>
          ))}
        </Form>
      ),
      onOk: handleOk,
      onCancel: handleCancel,
      className: styles['item-attribute-select-modal'],
    });
  }

  function handleClick() {
    if (!disabled) {
      if (!itemId) {
        notification.warning({
          message: '请先选择物料',
        });
        return;
      }
      setVisible(true);
    }
  }

  return (
    <div>
      {data && data.attributeValue1 ? (
        <div
          onClick={handleClick}
          style={{
            color: `${disabled ? '#000' : '#29BECE'}`,
            cursor: `${disabled ? 'auto' : 'pointer'}`,
          }}
          className={warning && disabled ? styles['item-attr-warning'] : ''}
        >
          {new Array(data.attributeNum)
            .join(',')
            .split(',')
            .map((v, index) => (
              <div>
                {`${data[`attributeDesc${index + 1}`]}：${data[`attributeValue${index + 1}`]}`}
              </div>
            ))}
        </div>
      ) : (
        <Button loading={loading} onClick={handleClick} disabled={disabled}>
          选择关键属性
        </Button>
      )}
    </div>
  );
};
