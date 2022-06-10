/**
 * @Description: 集团
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-07 14:41:23
 */

import React, { useState, useEffect, Fragment } from 'react';
import { Icon } from 'hzero-ui';
import { Icon as CIcon } from 'choerodon-ui';
import { DataSet, Button, Modal, Form, TextField } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { GroupDS } from '../store/GroupDS';
import { groupCreate, groupUpdate } from '@/services/groupService';
import styles from './index.less';

const intlPrefix = 'zmda.group';
const groupKey = Modal.key();
const groupDS = () => new DataSet(GroupDS());

function Group() {
  const groupItemDS = useDataSet(groupDS, Group);
  const [haveGroup, setHaveGroup] = useState(false); // 集团是否有值
  const [groupNumValue, setGroupNumValue] = useState('');
  const [groupNameValue, setGroupNameValue] = useState('');

  useEffect(() => {
    handleSearch();
  }, []);

  async function handleSearch() {
    groupItemDS.setQueryParameter('tenantId', getCurrentOrganizationId());
    await groupItemDS.query();
    const data = groupItemDS.toData();
    if (data && data.length) {
      setHaveGroup(true);
      setGroupNumValue(data[0].groupNum);
      setGroupNameValue(data[0].groupName);
    }
  }

  function handleGroupAdd() {
    return new Promise(async (resolve) => {
      const validate = await groupItemDS.current.validate(true, false);
      if (!validate) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(false);
        return;
      }
      groupCreate({
        tenantId: getCurrentOrganizationId(),
        groupTenantId: getCurrentOrganizationId(),
        groupName: groupItemDS.current.get('groupName'),
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '创建成功',
          });
          handleSearch();
        } else {
          notification.error({
            message: res.message,
          });
          resolve(false);
          return;
        }
        resolve();
      });
    });
  }

  function handleEdit() {
    return new Promise(async (resolve) => {
      const validate = await groupItemDS.current.validate(true, false);
      if (!validate) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(false);
        return;
      }
      groupUpdate({
        ...groupItemDS.current.toData(),
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '编辑成功',
          });
          handleSearch();
        } else {
          notification.error({
            message: res.message,
          });
          resolve(false);
          return;
        }
        resolve();
      });
    });
  }

  function openModal(title) {
    Modal.open({
      title,
      key: groupKey,
      closable: true,
      children: (
        <Form dataSet={groupItemDS} columns={1}>
          <TextField name="groupNum" disabled />
          <TextField name="groupName" />
        </Form>
      ),
      className: styles['zmda-group-modal'],
      onOk: haveGroup ? handleEdit : handleGroupAdd,
    });
  }

  function handleCreate() {
    groupItemDS.reset();
    openModal('新建集团');
  }

  function handleUpdate() {
    groupItemDS.current.set('groupNum', groupNumValue);
    groupItemDS.current.set('groupName', groupNameValue);
    openModal('编辑集团');
  }

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.group`).d('集团')} />
      <Content className={styles['zmda-group-content']}>
        {!haveGroup && (
          <Button onClick={handleCreate}>
            <CIcon type="control_point" />
          </Button>
        )}
        {haveGroup && (
          <div>
            <div>集团编码：{groupNumValue}</div>
            <div className={styles['group-name']}>
              <span>集团名称：{groupNameValue}</span>
              <Button onClick={handleUpdate}>
                <Icon type="edit" />
              </Button>
            </div>
          </div>
        )}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({ code: [`${intlPrefix}`] })(Group);
