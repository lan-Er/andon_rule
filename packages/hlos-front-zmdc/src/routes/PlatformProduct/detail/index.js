/**
 * @Description: 平台产品详情页
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-07-28 11:12:26
 */

import React, { useState, useEffect, Fragment } from 'react';
import Icons from 'components/Icons';
import { Header, Content } from 'components/Page';
import IconsPicker from 'components/SvgIconsPicker';
import { Badge, Table as CommonTable, Icon } from 'choerodon-ui';
import {
  DataSet,
  Button,
  Form,
  TextField,
  Lov,
  TextArea,
  Modal,
  Tooltip,
  Select,
} from 'choerodon-ui/pro';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { BasicInfoDS, RoleSelectDS, VersionDS } from '../store/detailDS';
import styles from './index.less';

const { Option } = Select;
const releaseKey = Modal.key();
const intlPrefix = 'zmdc.platformProduct';
const productBasicInfoDS = () => new DataSet(BasicInfoDS());
const roleSelectDS = () => new DataSet(RoleSelectDS());
const ProductVersionDS = () => new DataSet(VersionDS());

function ZmdcPlatformProductDetail({ match, dispatch, history }) {
  const {
    params: { type, productVersionId },
  } = match;

  const ProductBasicInfoDS = useDataSet(productBasicInfoDS, ZmdcPlatformProductDetail);
  const RoleDS = useDataSet(roleSelectDS);
  const PversionDS = useDataSet(ProductVersionDS);
  const [canEdit, setCanEit] = useState(type === 'create'); // 是否可编辑(保存、发布)
  const [canOperate, setCanOperate] = useState(false); // 是否可操作(升级)
  const [statusFlag, setStatusFlag] = useState(false); // 上架状态
  const [basicInfoOpen, setBasicInfoOpen] = useState(true); // 基础信息是否展开
  const [relatedInfoOpen, setRelatedInfoOpen] = useState(true); // 关联信息是否展开
  const [proIcon, setProIcon] = useState(''); // 产品图标
  const [iconShow, setIconShow] = useState(true);
  const [curLeftTab, setCurLeftTab] = useState('role');
  const [basicInfo, setBasicInfo] = useState({});
  const [team, setTeam] = useState(''); // 产品团队
  const [showPreVersion, setShowPreVersion] = useState(false); // 是否展示当前版本号
  const [versionList, setVersionList] = useState([]); // 版本下拉列表数据

  // 关联角色
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [roleRowSelection, setRoleRowSelection] = useState(null);
  const [roleSelectData, setRoleSelectData] = useState([]);
  const [roleTotal, setRoleTotal] = useState(0); // 角色总数
  const [showAllRole, setShowAllRole] = useState(false); // 是否显示全部
  // 关联菜单
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [allRowKeys, setAllRowKeys] = useState([]);

  useEffect(() => {
    ProductBasicInfoDS.setQueryParameter('productVersionId', null);
    ProductBasicInfoDS.data = [];
    ProductBasicInfoDS.create();
    RoleDS.data = [];
    if (type !== 'create') {
      ProductBasicInfoDS.setQueryParameter('productVersionId', productVersionId);
      handleSearch();
    }
  }, [productVersionId]);

  useEffect(() => {
    if (showAllRole) {
      getRoleData();
    }
  }, [showAllRole]);

  useEffect(() => {
    // 这步操作是为了触发图标组件的更新
    setIconShow(false);
    setTimeout(() => {
      setIconShow(true);
    }, 0);
  }, [proIcon]);

  useDataSetEvent(RoleDS, 'update', ({ name, record }) => {
    if (name === 'roleObj') {
      const arr = record.toData().roleObj || [];
      const { productId, productCode } = ProductBasicInfoDS.current.toData();
      const roleArr = arr.map((v) => ({
        roleId: v.id,
        roleCode: v.code,
        roleName: v.name,
        productId,
        productCode,
        productVersionId,
      }));
      RoleDS.reset();
      handleAddRole(roleArr);
    }
  });

  async function handleSearch() {
    await ProductBasicInfoDS.query();
    const {
      productVersionStatus,
      productIcon,
      enabledFlag,
      productVersionMasterList = [],
      productId,
      previousVersionCode,
    } = ProductBasicInfoDS.current.toData();
    setBasicInfo(ProductBasicInfoDS.current.toData());
    setShowPreVersion(previousVersionCode && productVersionStatus === 'Iterating');
    PversionDS.current.set('productId', productId);
    const editFlag =
      productVersionMasterList.findIndex((v) => v.masterUserId === getCurrentUser().id) !== -1;
    const isEdit = productVersionStatus === 'Iterating' && editFlag && type === 'edit';
    setCanEit(isEdit);
    setCanOperate(productVersionStatus === 'Published' && editFlag);
    setStatusFlag(enabledFlag === 1 || enabledFlag === '1');
    setProIcon(productIcon);
    let str = '';
    productVersionMasterList.forEach((v, index) => {
      if (index === 0) {
        str = v.masterUserName;
      } else {
        str = `${str}，${v.masterUserName}`;
      }
    });
    setTeam(str);
    getRoleData();
    handleVersionSearch();
    if (isEdit) {
      setRoleRowSelection({
        selections: true,
        hideDefaultSelections: true,
        onChange: onRoleSelectChange,
      });
    }
  }

  function handleSave() {
    return new Promise(async (resolve) => {
      const validate = await ProductBasicInfoDS.current.validate(true, false);
      if (!validate) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(false);
        return false;
      }
      const obj = ProductBasicInfoDS.current.toData();
      // 选择的产品用户和上次存的已选择的产品用户，判断用户是新增还是删除还是不变
      const arr = obj.productVersionMasterList ? obj.productVersionMasterList.concat([]) : [];
      const selectArr = obj.masterUserObj ? obj.masterUserObj.concat([]) : [];
      const productVersionMasterList = [];
      arr.forEach((v) => {
        if (selectArr.findIndex((sv) => sv.id === v.masterUserId) === -1) {
          productVersionMasterList.push({
            ...v,
            _status: 'delete',
          });
        } else {
          productVersionMasterList.push(v);
        }
      });
      selectArr.forEach((sv) => {
        if (arr.findIndex((v) => v.masterUserId === sv.id) === -1) {
          productVersionMasterList.push({
            masterUserId: sv.id,
            masterUserName: sv.realName,
            _status: 'create',
          });
        }
      });
      const { id, realName } = getCurrentUser();
      if (
        type === 'create' &&
        productVersionMasterList.findIndex((item) => item.masterUserId === id) === -1
      ) {
        productVersionMasterList.push({
          masterUserId: id,
          masterUserName: realName,
          _status: 'create',
        });
      }
      dispatch({
        type: `platformProductModel/${
          type === 'create' ? 'saveProductVersions' : 'updateProductVersions'
        }`,
        payload: {
          ...obj,
          masterUserId: id,
          productVersionMasterList,
          productVersionStatus: obj.productVersionStatus || 'Iterating',
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '保存成功',
          });
          if (type === 'create') {
            history.push({
              pathname: `/zmdc/platform-product/edit/${res.productVersionId}`,
            });
          } else {
            handleSearch();
          }
        }
        resolve();
      });
    });
  }

  function handleVersionSearch() {
    return new Promise((resolve) => {
      const { productId } = ProductBasicInfoDS.current.toData();
      dispatch({
        type: 'platformProductModel/getVersionList',
        payload: {
          enabledFlag: 1,
          productId,
        },
      }).then((res) => {
        if (res && !res.failed) {
          setVersionList(res);
        }
        resolve();
      });
    });
  }

  function handleProductRelease() {
    return new Promise(async (resolve) => {
      const validate = await PversionDS.current.validate(true, false);
      if (!validate) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'platformProductModel/updateProductVersions',
        payload: {
          ...ProductBasicInfoDS.current.toData(),
          ...PversionDS.current.toData(),
          productVersionStatus: 'Published',
          masterUserId: getCurrentUser().id,
          publishUserId: getCurrentUser().id,
          publishUserName: getCurrentUser().realName,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const pathName = `/zmdc/platform-product`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  function handleRelease() {
    const {
      productIntroduction,
      productApplicableScene,
      previousVersionCode,
      productId,
      productName,
    } = ProductBasicInfoDS.current.toData();
    if (!productIntroduction) {
      notification.warning({
        message: '请先填写产品简介',
      });
      return;
    }
    if (!productApplicableScene) {
      notification.warning({
        message: '请先填写适用场景',
      });
      return;
    }
    PversionDS.reset();
    PversionDS.current.set('currentVersionCode', previousVersionCode);
    PversionDS.current.set('productId', productId);
    Modal.open({
      releaseKey,
      title: productName,
      children: (
        <React.Fragment>
          <div>执行产品版本发布前，请确保产品所关联内容通过测试验收，并补充以下内容：</div>
          <Form dataSet={PversionDS} columns={2}>
            {previousVersionCode && (
              <TextField name="currentVersionCode" key="currentVersionCode" disabled />
            )}
            <Select
              name="versionCodeObj"
              key="versionCodeObj"
              label={
                <Tooltip
                  placement="right"
                  title="升级时仅支持版本号向上升级，请谨慎选择需要升级的版本号！"
                >
                  {previousVersionCode ? '升级版本号' : '版本号'}
                  <Icon type="contact_support" />
                </Tooltip>
              }
            >
              {versionList.map((v) => (
                <Option value={v.versionId}>{v.versionCode}</Option>
              ))}
            </Select>
            <TextArea
              name="productVersionRemark"
              key="productVersionRemark"
              colSpan={2}
              rows={8}
              newLine
            />
          </Form>
        </React.Fragment>
      ),
      onOk: handleProductRelease,
      className: styles['zmdc-platform-product-modal'],
    });
  }

  function handleProductUpgrade() {
    return new Promise((resolve) => {
      dispatch({
        type: 'platformProductModel/upgradeProductVersions',
        payload: {
          ...ProductBasicInfoDS.current.toData(),
          masterUserId: getCurrentUser().id,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const pathName = `/zmdc/platform-product/edit/${res.productVersionId}`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  function handleIconChange(e) {
    ProductBasicInfoDS.current.set('productIcon', e);
  }

  function handleTabsChange(e) {
    setCurLeftTab(e);
    if (type !== 'create') {
      if (e === 'role') {
        getRoleData();
        return;
      }
      if (e === 'menu') {
        getMenuData();
      }
    }
  }

  function getRoleData() {
    return new Promise((resolve) => {
      setRoleLoading(true);
      dispatch({
        type: 'platformProductModel/getProductVersionRoles',
        payload: {
          productVersionId,
        },
      }).then((res) => {
        if (res && !res.failed) {
          setRoleTotal(res.length);
          if (!showAllRole && res.length > 5) {
            setRoleData(res.slice(0, 5));
          } else {
            setRoleData(res);
          }
        }
        resolve(setRoleLoading(false));
      });
    });
  }

  function handleRoleExpend() {
    setShowAllRole(true);
  }

  function onRoleSelectChange(selectedRowKeys, selectedRows) {
    setRoleSelectData(selectedRows);
  }

  function handleAddRole(arr) {
    if (arr.length) {
      dispatch({
        type: 'platformProductModel/saveProductVersionRoles',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          getRoleData();
        }
      });
    }
  }

  function handleRoleDelete() {
    return new Promise((resolve) => {
      if (!roleSelectData.length) {
        notification.warning({
          message: intl.get(`zmdc.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'platformProductModel/deleteProductVersionRoles',
        payload: roleSelectData,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          setRoleSelectData([]);
          getRoleData();
        }
        resolve();
      });
    });
  }

  function getMenuData() {
    return new Promise((resolve) => {
      setMenuLoading(true);
      dispatch({
        type: 'platformProductModel/getProductVersionMenus',
        payload: {
          productVersionId,
        },
      }).then((res) => {
        if (res && !res.failed) {
          const arr = getAllRowKeys(res, []);
          setMenuData(res);
          setAllRowKeys(arr);
          setExpandedRowKeys([]);
        }
        resolve(setMenuLoading(false));
      });
    });
  }

  // 获取data下所有的rowKey（不涉及到下层children）
  function getRowKeys(data) {
    const arr = [];
    data.forEach((v) => {
      arr.push(v.id);
    });
    return arr;
  }

  // 获取data中所有的rowKey
  function getAllRowKeys(data, list) {
    const arr = list;
    data.forEach((v) => {
      arr.push(v.id);
      if (v.children) {
        getAllRowKeys(v.children, arr);
      }
    });
    return arr;
  }

  function onExpand(expanded, record) {
    const arr = getRowKeys([record]);
    if (expanded) {
      const list = expandedRowKeys.concat(arr);
      setExpandedRowKeys(list);
    } else {
      const keyarr = expandedRowKeys.concat([]);
      setExpandedRowKeys(keyarr);
    }
  }

  function expandAll() {
    const arr = allRowKeys.concat([]);
    setExpandedRowKeys(arr);
  }

  function collapseAll() {
    setExpandedRowKeys([]);
  }

  const roleColumns = [
    {
      title: intl.get(`${intlPrefix}.roleName`).d('角色名称'),
      dataIndex: 'roleName',
      width: 200,
    },
    {
      title: intl.get(`${intlPrefix}.roleCode`).d('角色编码'),
      dataIndex: 'roleCode',
      width: 200,
    },
  ];

  const menuColumns = [
    {
      title: intl.get(`${intlPrefix}.name`).d('功能名称'),
      dataIndex: 'name',
      width: 300,
    },
  ];

  return (
    <Fragment>
      <Header
        title={`${intl.get(`${intlPrefix}.view.title.platformProductDetail`).d('平台产品详情')}${
          type !== 'create' ? `：${basicInfo ? basicInfo.productName : ''}` : ''
        }`}
        backPath="/zmdc/platform-product"
      >
        {canEdit && (
          <>
            <Button color="primary" onClick={handleSave}>
              保存
            </Button>
            {type !== 'create' && <Button onClick={handleRelease}>发布</Button>}
          </>
        )}
        {canOperate && (
          <Button color="primary" onClick={handleProductUpgrade}>
            升级
          </Button>
        )}
      </Header>
      <Content className={styles['zmdc-platform-product-detail']}>
        <div className={styles['base-title-line']}>
          <span>基础信息</span>
          <span
            className={styles['line-toggle']}
            onClick={() => {
              setBasicInfoOpen(!basicInfoOpen);
            }}
          >
            {basicInfoOpen ? '收起' : '展开'}
          </span>
        </div>
        {basicInfoOpen && canEdit && (
          <Form dataSet={ProductBasicInfoDS} columns={3}>
            <TextField name="productName" key="productName" disabled={!canEdit} />
            <TextField
              name="productCode"
              key="productCode"
              disabled={!canEdit || type !== 'create'}
            />
            <TextField
              name="productVersionStatusMeaning"
              key="productVersionStatusMeaning"
              disabled
            />
            <TextField
              name={showPreVersion ? 'previousVersionCode' : 'versionCode'}
              key={showPreVersion ? 'previousVersionCode' : 'versionCode'}
              disabled
            />
            {iconShow && (
              <IconsPicker
                name="productIcon"
                key="productIcon"
                field="productIcon"
                isButton
                value={proIcon}
                onChange={handleIconChange}
                // allowClear（isButton没有这个属性,设置为input才有）
              />
            )}
            <Badge
              name="enabledFlag"
              key="enabledFlag"
              status={statusFlag ? 'success' : 'error'}
              text={statusFlag ? '是' : '否'}
              label={
                <Tooltip placement="right" title="产品上架状态请在已发布产品列表中调整">
                  上架状态
                  <Icon type="contact_support" />
                </Tooltip>
              }
            />
            <Lov
              name="masterUserObj"
              key="masterUserObj"
              clearButton
              noCache
              disabled={!canEdit}
              colSpan={2}
              newLine
            />
            <TextArea
              name="productIntroduction"
              key="productIntroduction"
              disabled={!canEdit}
              colSpan={2}
              resize="both"
              autoSize
              newLine
            />
            <TextArea
              name="productApplicableScene"
              key="productApplicableScene"
              disabled={!canEdit}
              colSpan={2}
              resize="both"
              autoSize
              newLine
            />
          </Form>
        )}
        {basicInfoOpen && !canEdit && (
          <div className={styles['product-platform-basic-info']}>
            <div className={styles['basic-info-line']}>
              <div className={styles['line-item']}>
                <span className={styles['line-title']}>产品名称：</span>
                <span>{basicInfo.productName}</span>
              </div>
              <div className={styles['line-item']}>
                <span className={styles['line-title']}>产品编码：</span>
                <span>{basicInfo.productCode}</span>
              </div>
              <div className={styles['line-item']}>
                <span className={styles['line-title']}>版本状态：</span>
                <span>{basicInfo.productVersionStatusMeaning}</span>
              </div>
            </div>
            <div className={styles['basic-info-line']}>
              <div className={styles['line-item']}>
                <span className={styles['line-title']}>
                  {`${showPreVersion ? '当前' : ''}版本号：`}
                </span>
                <span>
                  {showPreVersion ? basicInfo.previousVersionCode : basicInfo.versionCode}
                </span>
              </div>
              <div className={styles['line-item']}>
                <span className={styles['line-title']}>产品图标：</span>
                <span>
                  <Icons type={basicInfo.productIcon} />
                </span>
              </div>
              <div className={styles['line-item']}>
                <span className={styles['line-title']}>上架状态：</span>
                <span>
                  <Badge
                    status={statusFlag ? 'success' : 'error'}
                    text={statusFlag ? '是' : '否'}
                  />
                </span>
              </div>
            </div>
            <div className={styles['basic-info-line-self']}>
              <div className={styles['line-title']}>产品团队：</div>
              <div className={styles['line-self-team']}>{team}</div>
            </div>
            <div className={styles['basic-info-line-self']}>
              <div className={styles['line-title']}>产品简介：</div>
              <div className={styles['line-self-desc']}>{basicInfo.productIntroduction}</div>
            </div>
            <div className={styles['basic-info-line-self']}>
              <div className={styles['line-title']}>适用场景：</div>
              <div className={styles['line-self-desc']}>{basicInfo.productApplicableScene}</div>
            </div>
          </div>
        )}
        <div className={styles['base-title-line']}>
          <span>关联信息</span>
          <span
            className={styles['line-toggle']}
            onClick={() => {
              setRelatedInfoOpen(!relatedInfoOpen);
            }}
          >
            {relatedInfoOpen ? '收起' : '展开'}
          </span>
        </div>
        {relatedInfoOpen && (
          <div className={styles['relation-info-content']}>
            <div className={styles['left-tabs']}>
              <div
                className={`${styles['left-tabs-item']} ${
                  curLeftTab === 'role' && styles['left-tabs-item-active']
                }`}
                onClick={() => handleTabsChange('role')}
              >
                {`关联角色(${roleTotal})`}
              </div>
              <div
                className={`${styles['left-tabs-item']} ${
                  curLeftTab === 'menu' && styles['left-tabs-item-active']
                }`}
                onClick={() => handleTabsChange('menu')}
              >
                关联菜单
              </div>
            </div>
            <div className={styles['info-content']}>
              {curLeftTab === 'role' && (
                <div className={styles['info-content-role']}>
                  {canEdit && type !== 'create' && (
                    <div className={styles['role-btn']}>
                      <Button onClick={handleRoleDelete}>删除</Button>
                      <Lov dataSet={RoleDS} name="roleObj" mode="button" clearButton={false}>
                        新增
                      </Lov>
                    </div>
                  )}
                  <CommonTable
                    bordered
                    noFilters
                    rowKey="roleId"
                    filterBar={false}
                    pagination={false}
                    columns={roleColumns}
                    loading={roleLoading}
                    dataSource={roleData}
                    rowSelection={roleRowSelection}
                    scroll={{ y: 235 }}
                  />
                  <div className={styles['role-btn']}>
                    {roleTotal > 5 && <Button onClick={handleRoleExpend}>显示全部</Button>}
                  </div>
                </div>
              )}
              {curLeftTab === 'menu' && (
                <div className={styles['info-content-menu']}>
                  <div className={styles['menu-tab-btn']}>
                    <Button icon="expand_less" onClick={collapseAll}>
                      {intl.get('hzero.common.button.collapseAll').d('全部收起')}
                    </Button>
                    <Button icon="expand_more" onClick={expandAll}>
                      {intl.get('hzero.common.button.expandAll').d('全部展开')}
                    </Button>
                  </div>
                  <CommonTable
                    bordered
                    noFilters
                    rowKey="id"
                    filterBar={false}
                    pagination={false}
                    columns={menuColumns}
                    loading={menuLoading}
                    dataSource={menuData}
                    expandedRowKeys={expandedRowKeys}
                    onExpand={onExpand}
                    scroll={{ y: 360 }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZmdcPlatformProductDetail);
