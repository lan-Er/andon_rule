import React, { useState, useEffect, useMemo } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Table, Button, CheckBox, Lov, TextField } from 'choerodon-ui/pro';
import { Upload, Icon, Popconfirm } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { HZERO_FILE } from 'utils/config';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { useDataSetIsSelected } from 'hzero-front/lib/utils/hooks';
import { deleteFile, userSetting } from 'hlos-front/lib/services/api';

import { ListTableDs, LineTableDs } from '@/stores/moOperationDs';
import { generateTaskOperation, fastGenerateTaskOperation } from '@/services/moOperationService';

import styles from './style.module.less';

// const commonCode = 'lmes.common';
const organizationId = getCurrentOrganizationId();

const preCode = 'neway.moOperation.model';
const directory = 'neway-mo-operation';

const MoOperation = (props) => {
  const listDs = useMemo(() => new DataSet(ListTableDs()), []);
  const lineDs = useMemo(() => new DataSet(LineTableDs()), []);

  const [showLine, setShowLine] = useState(false);
  const [moId, setMoId] = useState(null);
  const [moStatus, setMoStatus] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const isSelected = useDataSetIsSelected(lineDs);

  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        listDs.queryDataSet.current.set('organizationLov', {
          meOuName: res.content[0].meOuName,
          meOuId: res.content[0].meOuId,
        });
        listDs.query();
      }
    }
    getUserInfo();
  }, [listDs]);

  /**
   * 编辑
   */
  const toEdit = () => {
    setIsEdit(true);
  };

  const listColumns = [
    { name: 'ownerOrganizationName', width: 130 },
    { name: 'moNum', width: 130 },
    { name: 'moTypeName', width: 120 },
    {
      name: 'moStatusMeaning',
      width: 100,
      renderer: ({ value }) => {
        return <span className={styles['mo-status']}>{value}</span>;
      },
    },
    { name: 'itemCode', width: 150 },
    { name: 'itemDescription', width: 150 },
    {
      name: 'demandDate',
      width: 120,
      renderer: ({ value }) => {
        return <span>{value.format(DEFAULT_DATE_FORMAT)}</span>;
      },
    },
    { name: 'demandQty', width: 100 },
    { name: 'planStartDate', width: 150 },
    { name: 'planEndDate', width: 150 },
  ];

  const handleRowChange = (record) => {
    return {
      onClick: () => {
        setShowLine(true);
        setMoId(record.get('moId'));
        setMoStatus(record.get('moStatus'));
        lineDs.setQueryParameter('moId', record.get('moId'));
        lineDs.query();
      },
    };
  };

  const handleUploadSuccess = async (res, file, type) => {
    const { current } = lineDs;
    if (res && !res.failed) {
      current.set(type, res);
      await lineDs.submit();
      notification.success({
        message: '上传成功',
      });
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  };

  /**
   * 上传文件
   * @param {*} file
   */
  function uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory: 'meway-mo-operation',
    };
  }

  /**
   * 渲染行图纸链接
   */
  function handleFile(type) {
    const currentUploadProps = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
      accept: ['image/*', 'application/pdf'],
      data: uploadData,
      onSuccess: (res, file) => handleUploadSuccess(res, file, type),
    };
    return (
      <Upload {...currentUploadProps}>
        <Button funcType="flat">
          <Icon type="file_upload" /> Upload
        </Button>
      </Upload>
    );
  }

  /**
   * 删除该文件
   * @param {*} file 待删除文件
   */
  function handleDeleteFile(file, type) {
    deleteFile({ file, directory });
    lineDs.current.set(type, '');
    lineDs.submit();
  }

  const lineColumns = [
    { name: 'sequenceNum', width: 120, lock: true },
    { name: 'operationCode', width: 120 },
    { name: 'operationName', width: 120 },
    { name: 'operationAlias', width: 120 },
    { name: 'description', width: 120 },
    { name: 'operationType', width: 120 },
    {
      name: 'keyOperationFlag',
      width: 120,
      editor: isEdit && <CheckBox />,
    },
    { name: 'firstOperationFlag', width: 120, editor: isEdit && <CheckBox /> },
    { name: 'lastOperationFlag', width: 120, editor: isEdit && <CheckBox /> },
    {
      name: 'preSequenceNum',
      width: 120,
      editor: (record) => {
        if (isEdit) {
          return <TextField name="preSequenceNum" onBlur={() => preSequenceNumOnChange(record)} />;
        }
      },
    },
    { name: 'processTime', width: 120 },
    { name: 'standardWorkTime', width: 120 },
    {
      name: 'referenceDocument',
      width: 120,
      renderer: (record) => {
        const file = record.value;
        return (
          <>
            {file ? (
              <span
                className="action-link"
                style={{
                  display: 'block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Popconfirm
                  okText={intl.get('hzero.common.button.sure').d('确定')}
                  cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                  title={intl
                    .get('lmds.common.view.message.confirm.remove')
                    .d('是否删除此条记录？')}
                  onConfirm={() => handleDeleteFile(file, 'referenceDocument')}
                >
                  <a>
                    <Icon type="delete" />
                  </a>
                </Popconfirm>
                <a
                  style={{ marginLeft: '5px' }}
                  title={intl.get('hzero.common.button.download').d('下载')}
                  onClick={() => this.downloadFile(file)}
                >
                  {getFileName(file)}
                </a>
              </span>
            ) : (
              handleFile('referenceDocument')
            )}
          </>
        );
      },
    },
    {
      name: 'processProgram',
      width: 120,
      renderer: (record) => {
        const file = record.value;
        return (
          <>
            {file ? (
              <span
                className="action-link"
                style={{
                  display: 'block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Popconfirm
                  okText={intl.get('hzero.common.button.sure').d('确定')}
                  cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                  title={intl
                    .get('lmds.common.view.message.confirm.remove')
                    .d('是否删除此条记录？')}
                  onConfirm={() => handleDeleteFile(file, 'referenceDocument')}
                >
                  <a>
                    <Icon type="delete" />
                  </a>
                </Popconfirm>
                <a
                  style={{ marginLeft: '5px' }}
                  title={intl.get('hzero.common.button.download').d('下载')}
                  onClick={() => this.downloadFile(file)}
                >
                  {getFileName(file)}
                </a>
              </span>
            ) : (
              handleFile('processProgram')
            )}
          </>
        );
      },
    },
    { name: 'instruction', width: 120 },
    {
      name: 'executeRuleLov',
      width: 120,
      editor: isEdit && <Lov name="executeRuleLov" />,
    },
    {
      name: 'inspectionRuleLov',
      width: 120,
      editor: isEdit && <Lov name="inspectionRuleLov" />,
    },
    { name: 'releasedTaskFlag', width: 120, editor: isEdit && <CheckBox /> },
    { name: 'remark', width: 160, editor: isEdit },
    { name: 'enabledFlag', width: 120, editor: isEdit && <CheckBox /> },
    { name: 'externalID', width: 120 },
    { name: 'externalNum', width: 120 },
    { name: 'attributeString3', width: 120 },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 120,
      renderer: () => {
        return (
          <a onClick={handleClickTask} disabled>
            {intl.get(`${preCode}.task`).d('任务')}
          </a>
        );
      },
      lock: 'right',
    },
  ];

  /**
   * 前工序 修改
   */
  function preSequenceNumOnChange(record) {
    const currentValue = record.get('preSequenceNum')?.split('#');
    if (currentValue) {
      const maxNum = Math.max(...currentValue);
      const targetIndex = lineDs.toData().findIndex((item) => {
        return Number(item.sequenceNum) === maxNum;
      });
      if (targetIndex !== -1) {
        lineDs.splice(targetIndex + 1, 0, record);
      } else {
        notification.error({
          message: `前工序${record.get('preSequenceNum')}不存在`,
        });
      }
    }
  }

  /**
   * 点击行 任务 关联工序任务界面
   */
  function handleClickTask() {
    // const { current } = lineDs;
    // const operationId = current.get('operationId');
    // console.log(operationId, moId);
  }

  /**
   * 行保存
   */
  const handleSaveLine = async () => {
    try {
      lineDs.forEach((record) => {
        record.set('_status', 'update');
      });
      await lineDs.submit();
      lineDs.query();
    } catch (e) {
      return false;
    }
  };

  function handleToDetail() {
    const lineData = lineDs.toJSONData();
    for (let i = 0; i < lineData.length; i++) {
      if (lineData[i].firstOperationFlag === 0 && !lineData[i].preSequenceNum) {
        notification.error({
          message: intl
            .get('hzero.common.message.confirm.moError')
            .d('存在非首工序未排序，无法生成MO工序图形'),
        });
        return false;
      }
    }
    props.history.push({
      pathname: `/neway/mo-operation/detail/${moId}`,
    });
  }

  /**
   * 生成任务工序
   */
  async function handleClickGenerate(type) {
    try {
      let res;
      if (type === 'onekey') {
        const data = {
          moId,
          moStatus,
        };
        res = await fastGenerateTaskOperation(data);
      } else {
        const data = lineDs.currentSelected.map((item) => item.toData());
        res = await generateTaskOperation(data);
      }
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
        return;
      } else {
        notification.success({
          message: intl.get('hzero.common.message.confirm.title').d('提示'),
          description: intl.get('hord.order.submit.success').d('提交成功'),
        });
      }
      lineDs.setQueryParameter('moId', moId);
      lineDs.query();
    } catch (e) {
      return false;
    }
  }

  return (
    <>
      <Header title={intl.get(`${preCode}.view.title.moOperation`).d('MO工序')} />
      <Content>
        <Table
          dataSet={listDs}
          columns={listColumns}
          onRow={({ record }) => handleRowChange(record)}
          columnResizable="true"
          queryFields={{
            moNumLov: <Lov maxTagCount={1} name="moNumLov" />,
          }}
        />
        <div style={showLine ? { display: 'block', marginTop: '30px' } : { display: 'none' }}>
          <div>{intl.get(`${preCode}.operation`).d('工序')}</div>
          <div className={styles['operation-btn']}>
            {isEdit ? (
              <Button onClick={handleSaveLine}>
                {intl.get('hzero.common.button.save').d('保存')}
              </Button>
            ) : (
              <Button onClick={toEdit}>{intl.get('hzero.common.button.edit').d('编辑')}</Button>
            )}
            <Button onClick={() => handleClickGenerate('onekey')}>
              {intl.get(`${preCode}.fastGenerateTaskOperation`).d('一键生成任务工序')}
            </Button>
            <Button onClick={handleClickGenerate} disabled={!isSelected}>
              {intl.get(`${preCode}.generateTaskOperation`).d('生成任务工序')}
            </Button>
            <Button onClick={handleToDetail}>
              {intl.get(`${preCode}.generateMoprocessGraphics`).d('生成MO工序图形')}
            </Button>
          </div>
          <Table dataSet={lineDs} columns={lineColumns} />
        </div>
      </Content>
    </>
  );
};

export default formatterCollections({ code: 'neway.moOperation' })(MoOperation);
