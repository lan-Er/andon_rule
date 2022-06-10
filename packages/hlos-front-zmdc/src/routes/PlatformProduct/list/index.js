/*
 * @Descripttion: 平台产品列表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-07-28 10:33:55
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-07-28 14:55:09
 */

import React, { useEffect, useState, Fragment } from 'react';
import { DataSet, Button, Table, Tabs, Select, Modal } from 'choerodon-ui/pro';
import { Badge, Popover } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { getCurrentUserId } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import notification from 'utils/notification';
import Icons from 'components/Icons';
import formatterCollections from 'utils/intl/formatterCollections';
import { publishedListDS, unpublishListDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zmdc.platformProduct';
const clonePublishedListDS = () => new DataSet(publishedListDS());
const cloneUnpublishListDS = () => new DataSet(unpublishListDS());

const { TabPane } = Tabs;
const currentUserId = getCurrentUserId();

function ZmdcPlatformProduct({ dispatch, history }) {
  const [currentTab, setCurrentTab] = useState('published');
  const PublishedListDS = useDataSet(clonePublishedListDS);
  const UnpublishListDS = useDataSet(cloneUnpublishListDS);
  useEffect(() => {
    PublishedListDS.query();
  }, []);

  function handleToDetail(id, type) {
    history.push({
      pathname: `/zmdc/platform-product/${type}/${id}`,
    });
  }

  const handleCreate = () => {
    history.push({
      pathname: `/zmdc/platform-product/create`,
    });
  };

  const handleOperate = (record, enabledFlag) => {
    const { versionCode } = record.data;
    Modal.confirm({
      title: '一步云仓储管理',
      children: (
        <div>
          <p>当前版本号： {versionCode}</p>
          <p>
            {!enabledFlag
              ? '产品下架后，业务租户在产品订阅列表无法查找到产品（已订阅历史版本产品的租户不受影响），请联系产品主管确认后下架！'
              : '产品上架后，业务租户在产品订阅列表可以查看并订阅产品，请确保测试充分，并联系产品主管确认后上架！'}
          </p>
        </div>
      ),
      onOk: () => {
        handleOffOrUp(record, enabledFlag);
      },
    });
  };

  const handleOffOrUp = (record, enabledFlag) => {
    return new Promise(async (resolve) => {
      dispatch({
        type: `platformProductModel/updateProducts`,
        payload: {
          ...record.data,
          enabledFlag,
        },
      }).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          PublishedListDS.query();
        }
        resolve();
      });
    });
  };

  const handleUpgrade = (record) => {
    return new Promise(async (resolve) => {
      dispatch({
        type: `platformProductModel/upgradeProductVersions`,
        payload: {
          ...record.data,
          masterUserId: currentUserId,
        },
      }).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const { productVersionId } = res;
          handleToDetail(productVersionId, 'edit');
        }
        resolve();
      });
    });
  };

  const queryField = () => {
    return {
      productVersionStatusArray: (
        <Select
          name="productVersionStatusArray"
          noCache
          optionsFilter={({ data }) => data.value !== 'Published'}
        />
      ),
    };
  };

  const columns = [
    {
      name: 'productName',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('productVersionId');
        return <a onClick={() => handleToDetail(id, 'detail')}>{value}</a>;
      },
      lock: 'left',
    },
    {
      name: 'versionCode',
      width: 120,
      lock: 'left',
    },
    {
      name: 'productVersionMaster',
      width: 180,
      renderer: ({ record }) => {
        const { productVersionMasterList } = record.toData();

        const masterUserName = productVersionMasterList.map((i) => i.masterUserName).join(',');
        return (
          <Popover overlayStyle={{ maxWidth: 360 }} placement="topRight" content={masterUserName}>
            {masterUserName}
          </Popover>
        );
      },
    },
    {
      name: 'productIcon',
      width: 70,
      renderer: ({ value }) => {
        return <Icons type={value} size={16} />;
      },
    },
    {
      name: 'productIntroduction',
      width: 280,
      renderer: ({ value }) => {
        return (
          <Popover overlayStyle={{ maxWidth: 360 }} placement="topRight" content={value}>
            {value}
          </Popover>
        );
      },
    },
    {
      name: 'enabledFlag',
      width: 90,
      renderer: yesOrNoRender,
      align: 'left',
      lock: 'right',
    },
    {
      name: 'productVersionStatusMeaning',
      lock: 'right',
      width: 90,
      renderer: ({ record, value }) => {
        const { productVersionStatus } = record.toData();
        let badgeStatus = '';
        switch (productVersionStatus) {
          case 'Iterating':
            badgeStatus = 'warning';
            break;
          case 'Published':
            badgeStatus = 'success';
            break;
          case 'InOperation':
            badgeStatus = 'processing';
            break;
          default:
            break;
        }

        return <Badge status={badgeStatus} text={value} />;
      },
    },
    {
      header: '操作',
      width: 120,
      command: ({ record }) => {
        const { enabledFlag, productVersionMasterList } = record.data;
        const masterUserIdList = productVersionMasterList.map((i) => i.masterUserId);
        const buttonFlag = masterUserIdList.indexOf(currentUserId) === -1;
        return [
          <Popover
            overlayStyle={{ display: buttonFlag ? '' : 'none', width: 200 }}
            content="仅产品团队成员有权限编辑产品，请联系相应产品团队维护"
          >
            <Button
              key="update"
              color="primary"
              onClick={() => handleUpgrade(record)}
              disabled={buttonFlag}
              funcType="flat"
              style={{
                display: 'inline-block',
                marginTop: '-6px',
              }}
            >
              升级
            </Button>
          </Popover>,
          <Popover
            overlayStyle={{ display: buttonFlag ? '' : 'none', width: 200 }}
            content="仅产品团队成员有权限编辑产品，请联系相应产品团队维护"
          >
            <Button
              key="view"
              color="primary"
              funcType="flat"
              onClick={() => handleOperate(record, enabledFlag ? 0 : 1)}
              disabled={buttonFlag}
              style={{
                display: 'inline-block',
                marginTop: '-6px',
                marginLeft: '-12px',
              }}
            >
              {enabledFlag ? '下架' : '上架'}
            </Button>
          </Popover>,
        ];
      },
      lock: 'right',
    },
  ];

  const unpublishColumns = [
    {
      name: 'productName',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('productVersionId');
        return <a onClick={() => handleToDetail(id, 'detail')}>{value}</a>;
      },
      lock: 'left',
    },
    {
      name: 'versionCode',
      width: 120,
      lock: 'left',
    },
    {
      name: 'lastVersionFlag',
      lock: 'left',
      width: 100,
      align: 'left',
      renderer: yesOrNoRender,
    },
    {
      name: 'publishDate',
      width: 150,
    },
    {
      name: 'publishUserName',
      width: 90,
    },
    {
      name: 'productVersionRemark',
      width: 280,
      renderer: ({ value }) => {
        return (
          <Popover overlayStyle={{ maxWidth: 360 }} placement="topRight" content={value}>
            {value}
          </Popover>
        );
      },
    },
    {
      name: 'productVersionMaster',
      width: 180,
      renderer: ({ record }) => {
        const { productVersionMasterList } = record.toData();

        const masterUserName = productVersionMasterList.map((i) => i.masterUserName).join(',');
        return (
          <Popover overlayStyle={{ maxWidth: 360 }} placement="topRight" content={masterUserName}>
            {masterUserName}
          </Popover>
        );
      },
    },
    {
      name: 'productVersionStatusMeaning',
      lock: 'right',
      width: 80,
      renderer: ({ record, value }) => {
        const { productVersionStatus } = record.toData();
        let badgeStatus = '';
        switch (productVersionStatus) {
          case 'Iterating':
            badgeStatus = 'warning';
            break;
          case 'Published':
            badgeStatus = 'success';
            break;
          case 'InOperation':
            badgeStatus = 'processing';
            break;
          default:
            break;
        }

        return <Badge status={badgeStatus} text={value} />;
      },
    },
    {
      header: '操作',
      width: 90,
      command: ({ record }) => {
        const id = record.get('productVersionId');
        const { productVersionMasterList, productVersionStatus } = record.data;
        const masterUserIdList = productVersionMasterList.map((i) => i.masterUserId);
        const buttonFlag = masterUserIdList.indexOf(currentUserId) === -1;
        return productVersionStatus !== 'InOperation'
          ? [
            <Popover
              overlayStyle={{ display: buttonFlag ? '' : 'none', width: 200 }}
              content="仅产品团队成员有权限编辑产品，请联系相应产品团队维护"
            >
              <Button
                key="update"
                color="primary"
                funcType="flat"
                disabled={buttonFlag}
                onClick={() => handleToDetail(id, 'edit')}
              >
                  编辑
              </Button>
            </Popover>,
            ]
          : null;
      },
      lock: 'right',
    },
  ];

  function handleTabChange(key) {
    setCurrentTab(key);
    if (key === 'published') {
      PublishedListDS.query();
    }
  }

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('平台产品列表')}>
        {currentTab === 'unpublish' && <Button onClick={handleCreate}>新建产品</Button>}
      </Header>
      <Content className={styles['zmdc-platform-product-list']}>
        <Tabs defaultActiveKey={currentTab} onChange={handleTabChange}>
          <TabPane tab="已发布产品" key="published">
            <Table dataSet={PublishedListDS} columns={columns} />
          </TabPane>
          <TabPane tab="未发布产品" key="unpublish">
            <Table
              dataSet={UnpublishListDS}
              columns={unpublishColumns}
              queryFields={queryField()}
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZmdcPlatformProduct {...props} />;
});
