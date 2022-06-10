/*
 * @Description: 平台接口配置
 * @Author: jianjun.tan, <jianjun.tan@hand-china.com>
 * @Date: 2020-06-09 15:58:31
 * @LastEditors: jianjun.tan
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment, useEffect, useState } from 'react';
import { Button, DataSet } from 'choerodon-ui/pro';

import intl from 'utils/intl';
import { Card, Col, Row } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import styles from './index.less';
import ProjectPage from './ProjectPage';
import { interfaceCofigDS, projectDS } from '@/stores/interfaceCofigDS';

const preCode = 'ldab.interfaceCofig';

const interfaceCofigSetFactory = () => new DataSet(interfaceCofigDS());
const projectSetFactory = () => new DataSet(projectDS());

const InterfaceConfigPage = (props) => {
  const listDS = useDataSet(interfaceCofigSetFactory, InterfaceConfigPage);
  const projectsDS = useDataSet(projectSetFactory);

  // State
  const [interfaceList, setInterfaceList] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 查询接口配置列表
   */
  async function handleSearch() {
    const listData = await listDS.query();
    setInterfaceList(listData);
  }
  /**
   * 新增项目
   */
  function handleAddProject() {
    projectsDS.query();
    handleProjectModal(true);
  }

  /**
   * 新增平台数据接口
   */
  function handleAddInterface() {
    props.history.push({
      pathname: '/ldab/interface-config/create',
    });
  }

  /**
   * 编辑跳转详情页
   * @param {Object} record 接口配置
   */
  function handleEditInterfaceConfig(record) {
    props.history.push({
      pathname: `/ldab/interface-config/detail/${record.interfaceId}`,
    });
  }

  /**
   * 编辑跳转详情页
   * @param {Object} record 接口配置
   */
  async function handleDeleteInterfaceConfig() {
    await listDS.delete(listDS.current);
    handleSearch();
  }

  /**
   * Modal隐藏和显示
   */
  function handleProjectModal(flag) {
    setVisible(flag);
  }

  const projectProps = {
    title: intl.get(`${preCode}.view.title.project`).d('项目'),
    dataSet: projectsDS,
    visible,
    onModea: handleProjectModal,
  };

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.interface.config`).d('接口配置')}>
        <Button onClick={handleAddInterface} color="primary" icon="add">
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <Button onClick={handleAddProject}>
          {intl.get(`${preCode}.view.title.project.list`).d('平台项目')}
        </Button>
      </Header>
      <Content>
        <Row gutter={16}>
          {interfaceList.map((item) => (
            <Col span={6} style={{ marginBottom: 20 }} key={item.interfaceCode}>
              <Card
                hoverable
                style={{ width: '100%' }}
                className={styles.card}
                actions={[
                  <a onClick={() => handleEditInterfaceConfig(item)}>
                    {intl.get('hzero.common.button.edit').d('编辑')}
                  </a>,
                  <a onClick={handleDeleteInterfaceConfig}>
                    {intl.get('hzero.common.button.delete').d('删除')}
                  </a>,
                ]}
              >
                <div className={styles.interfaceClass}>
                  <div className={styles.interfaceLeftClass}>
                    <span>{intl.get(`${preCode}.model.interfaceCode`).d('接口编码')}:</span>
                  </div>
                  <div className={styles.interfaceRightClass}>
                    <span>{item.interfaceCode}</span>
                  </div>
                </div>
                <div className={styles.interfaceClass}>
                  <div className={styles.interfaceLeftClass}>
                    <span>{intl.get(`${preCode}.model.interfaceName`).d('接口名称')}:</span>
                  </div>
                  <div className={styles.interfaceRightClass}>
                    <span>{item.interfaceName}</span>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
      {visible && <ProjectPage {...projectProps} />}
    </Fragment>
  );
};

export default InterfaceConfigPage;
