/**
 * @Description: 公司
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-07 18:05:49
 */

import React, { useState, useEffect, Fragment } from 'react';
import { Badge } from 'choerodon-ui';
import {
  DataSet,
  Button,
  Table,
  Modal,
  Form,
  CheckBox,
  TextField,
  Select,
  DatePicker,
  TextArea,
  Icon,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import Upload from 'components/Upload/UploadButton';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getAccessToken, getCurrentOrganizationId } from 'utils/utils';
import logo from 'hzero-front/lib/assets/reg-logo.png';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { CompanyListDS, CompanyCreateFormDS } from '../store/CompanyDS';
import { groupSearch, companyCreate, companyUpdate } from '@/services/companyService';
import styles from './index.less';

let companyModal;
const companyKey = Modal.key();
const intlPrefix = 'zmda.company';
const organizationId = getCurrentOrganizationId();
const companyListDS = () => new DataSet(CompanyListDS());
const companyCreateFormDS = () => new DataSet(CompanyCreateFormDS());

function Company() {
  const listDS = useDataSet(companyListDS, Company);
  const formDS = useDataSet(companyCreateFormDS);
  const [groupObj, setGroupObj] = useState({}); // 集团信息

  useEffect(() => {
    handleSearch();
  }, []);

  async function handleSearch() {
    const res = await groupSearch({
      tenant: organizationId,
    });
    if (res && res.content && res.content.length) {
      setGroupObj(res.content[0]);
    }
  }

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: 'zmda',
      directory: 'zmda',
    };
  };

  const handleUploadSuccess = (res) => {
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      formDS.current.set('licenceUrl', res.response);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  };

  function handleRemove() {
    formDS.current.set('licenceUrl', null);
  }

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: ['.jpg', '.png', '.jpeg', '.pdf'],
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    data: uploadData,
    bucketName: 'zmda',
    bucketDirectory: 'zmda',
    onUploadSuccess: handleUploadSuccess,
    onRemoveFile: handleRemove,
  };

  function handleAddressOk(title) {
    openModal(title);
  }

  function handleAddress(title) {
    Modal.open({
      key: 'zmda-company-address-modal',
      title: '详细地址',
      children: (
        <Form dataSet={formDS}>
          <TextField name="country" key="country" />
          <TextField name="province" key="province" />
          <TextField name="city" key="city" />
          <TextField name="county" key="county" />
          <TextField name="addressDetail" key="addressDetail" />
        </Form>
      ),
      onOk: () => handleAddressOk(title),
    });
  }

  function handleChange(e, title) {
    openModal(title);
  }

  function openModal(title) {
    const isTerritory = formDS.current.get('inCountryFlag'); // 是否境内
    const fullAddress = formDS.current.get('fullAddress');
    companyModal = Modal.open({
      title,
      key: companyKey,
      drawer: true,
      closable: true,
      style: { width: 800 },
      children: (
        <div>
          <img src={logo} height={160} style={{ marginLeft: 100, marginBottom: 30 }} alt="logo" />
          <Form
            dataSet={formDS}
            columns={2}
            labelWidth={180}
            className={styles['zmda-company-form']}
          >
            <CheckBox
              name="inCountryFlag"
              onChange={(e) => handleChange(e, title)}
              style={{ marginLeft: 180 }}
            >
              我是境内机构
            </CheckBox>
            {isTerritory && (
              <TextField name="unifiedSocialNum" newLine style={{ width: '200px' }} />
            )}
            <TextField name="companyName" newLine style={{ width: '400px' }} />
            <TextField name="companyShortName" newLine style={{ width: '400px' }} />
            <TextField name="orgInstitutionCode" newLine style={{ width: '400px' }} />
            {isTerritory && <TextField name="dunsCode" newLine style={{ width: '200px' }} />}
            {!isTerritory && <TextField name="dunsCodeAbroad" newLine style={{ width: '200px' }} />}
            {isTerritory && <Select name="companyType" newLine style={{ width: '200px' }} />}
            {isTerritory && <Select name="taxpayerType" newLine style={{ width: '200px' }} />}
            {
              <a
                onClick={() => handleAddress(title)}
                newLine
                name="fullAddress"
                style={{ marginTop: '5px' }}
              >
                {fullAddress || '编辑'}
              </a>
            }
            <TextField name="legalPerson" newLine style={{ width: '200px' }} />
            <TextField name="registeredCapital" newLine style={{ width: '100px' }} />
            <div style={{ marginLeft: '-70px', marginTop: '5px' }}>万元</div>
            <DatePicker name="buildDate" newLine style={{ width: '200px' }} />
            {isTerritory && (
              <DatePicker name="businessEndDate" newLine style={{ width: '200px' }} />
            )}
            {isTerritory && (
              <CheckBox name="businessLongFlag" style={{ marginLeft: 80 }}>
                长期
              </CheckBox>
            )}
            <TextArea name="businessScope" newLine style={{ width: '400px' }} rows={8} />
            <Upload
              {...uploadProps}
              newLine
              label={isTerritory ? '营业执照' : '企业登记证件'}
              required
            >
              <Button>
                <Icon type="file_upload" /> {isTerritory ? '营业执照' : '企业登记证件'}
              </Button>
            </Upload>
            <div newLine style={{ color: 'rgba(0,0,0,.45)' }}>
              上传格式：*.jpg;*.png;*.jpeg;*.pdf
            </div>
          </Form>
          <Button color="primary" onClick={handleSave}>
            保存
          </Button>
        </div>
      ),
      footer: null,
      className: styles['zmda-company-modal'],
    });
  }

  function handleAdd() {
    formDS.data = [
      {
        inCountryFlag: true,
        businessLongFlag: true,
      },
    ];
    openModal('新建公司');
  }

  function handleEdit(record) {
    formDS.data = [
      {
        ...record.toData(),
        inCountryFlag: !!record.toData().inCountryFlag,
        businessLongFlag: !!record.toData().businessLongFlag,
        dunsCodeAbroad: record.toData().dunsCode,
      },
    ];
    openModal('编辑公司');
  }

  function handleSave() {
    return new Promise(async (resolve) => {
      const validate = await formDS.current.validate(true, false);
      if (!validate) {
        if (!formDS.current.get('fullAddress')) {
          notification.warning({
            message: '必填字段详细地址未填写，请补充完整',
          });
        } else if (!formDS.current.get('licenceUrl') && formDS.current.get('inCountryFlag')) {
          notification.warning({
            message: '营业执照未上传，请上传',
          });
        } else if (!formDS.current.get('licenceUrl') && !formDS.current.get('inCountryFlag')) {
          notification.warning({
            message: '企业登记证件未上传，请上传',
          });
        } else {
          notification.warning({
            message: '数据校验不通过',
          });
        }
        resolve(false);
        return;
      }
      const obj = formDS.current.toData();
      if (obj && obj.companyId) {
        companyUpdate({
          ...obj,
          inCountryFlag: obj.inCountryFlag ? 1 : 0,
          businessLongFlag: obj.businessLongFlag ? 1 : 0,
          buildDate: `${obj.buildDate} 00:00:00`,
          dunsCode: obj.inCountryFlag ? obj.dunsCode : obj.dunsCodeAbroad,
        }).then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '编辑成功',
            });
            companyModal.close();
            listDS.query();
          } else {
            notification.error({
              message: res.message,
            });
            resolve(false);
            return;
          }
          resolve();
        });
      } else {
        companyCreate({
          groupId: groupObj.groupId,
          groupNum: groupObj.groupNum,
          ...obj,
          companyTenantId: organizationId,
          inCountryFlag: obj.inCountryFlag ? 1 : 0,
          businessLongFlag: obj.businessLongFlag ? 1 : 0,
          buildDate: `${obj.buildDate} 00:00:00`,
          enabledFlag: 1,
          dunsCode: obj.inCountryFlag ? obj.dunsCode : obj.dunsCodeAbroad,
        }).then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '新建成功',
            });
            companyModal.close();
            listDS.query();
          } else {
            notification.error({
              message: res.message,
            });
            resolve(false);
            return;
          }
          resolve();
        });
      }
    });
  }

  function handleChangeStatus(record) {
    const { enabledFlag } = record.toData();
    companyUpdate({
      ...record.toData(),
      enabledFlag: enabledFlag === '1' ? '0' : '1',
    }).then((res) => {
      if (res && !res.failed) {
        notification.success({
          message: enabledFlag === '1' ? '禁用成功' : '启用成功',
        });
        listDS.query();
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  const enableRender = (enabledFlag) => {
    switch (enabledFlag) {
      case '1':
        return <Badge status="success" text="启用" />;
      case '0':
        return <Badge status="error" text="禁用" />;
      default:
        return enabledFlag;
    }
  };

  const columns = [
    { name: 'companyNum', width: 150 },
    {
      name: 'companyName',
      renderer: ({ record, value }) => <a onClick={() => handleEdit(record)}>{value}</a>,
    },
    { name: 'companyShortName', width: 200 },
    {
      name: 'enabledFlag',
      width: 100,
      renderer: ({ value }) => enableRender(value),
    },
    {
      header: '操作',
      width: 100,
      command: ({ record }) =>
        record.get('enabledFlag') === '1'
          ? [
            <Button
              key="disable"
              color="primary"
              funcType="flat"
              onClick={() => handleChangeStatus(record)}
            >
                禁用
            </Button>,
            ]
          : [
            <Button
              key="enable"
              color="primary"
              funcType="flat"
              onClick={() => handleChangeStatus(record)}
            >
                启用
            </Button>,
            ],
      lock: 'right',
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.company`).d('公司')}>
        <Button icon="add" color="primary" onClick={handleAdd}>
          新建
        </Button>
      </Header>
      <Content style={{ margin: 0 }}>
        <Table dataSet={listDS} columns={columns} columnResizable="true" queryFieldsLimit={2} />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({ code: [`${intlPrefix}`] })(Company);
