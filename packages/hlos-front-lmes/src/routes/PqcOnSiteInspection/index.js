/*
 * PQC巡检
 * date: 2020-07-09
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import React, { Fragment, useState, useEffect } from 'react';
import {
  DataSet,
  Lov,
  Row,
  Col,
  Form,
  NumberField,
  TextArea,
  TextField,
  Select,
  Modal,
  Button,
  Switch,
  Tooltip,
  Spin,
} from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';

import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { queryLovData, queryIndependentValueSet } from 'hlos-front/lib/services/api';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { closeTab } from 'utils/menuTab';

import {
  Inspect,
  moExecutes,
  queryTags,
  getInspectionTemplate,
  createInspect,
  queryExecuteLines,
} from '@/services/pqcSiteService';
import {
  handleInspectionDocLinesAdd,
  handleInspectionDocLinesModify,
  handleInspectionDocLinesDelete,
} from '@/services/inspectionJudgmentService';
import { pqcSiteFormDS, pqcLoginDS } from '@/stores/pqcSiteInspectionDS';
import logoImg from 'hlos-front/lib/assets/icons/logo.svg';
import exitImg from 'hlos-front/lib/assets/icons/exit.svg';
import resetImg from 'hlos-front/lib/assets/icons/reset.svg';
import submitImg from 'hlos-front/lib/assets/icons/submit.svg';
import inspectImg from 'hlos-front/lib/assets/icons/inspect.svg';
import defaultAvatarImg from 'hlos-front/lib/assets/img-default-avator.png';
import noDataImg from 'hlos-front/lib/assets/no-data.png';
import downIcon from 'hlos-front/lib/assets/icons/down-white.svg';
import changeImg from 'hlos-front/lib/assets/icons/change.svg';
import operationIcon from 'hlos-front/lib/assets/icons/operation-gray.svg';
import editIcon from 'hlos-front/lib/assets/icons/edit.svg';
import deleteIcon from 'hlos-front/lib/assets/icons/delete.svg';
import addIcon from 'hlos-front/lib/assets/icons/add-blue.svg';
import arrowRightBlueIcon from 'hlos-front/lib/assets/icons/arrow-right-blue.svg';
import arrowLeftBlueIcon from 'hlos-front/lib/assets/icons/arrow-left-blue.svg';
import arrowLeftForbiddenIcon from 'hlos-front/lib/assets/icons/arrow-left-forbidden.svg';
import arrowRightForbiddenIcon from 'hlos-front/lib/assets/icons/arrow-right-forbidden.svg';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';

import Time from './Time';
import style from './index.module.less';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

let modal = null;
let addModal = null;

const formDS = new DataSet(pqcSiteFormDS());
const loginDS = new DataSet(pqcLoginDS());

function IqcHead() {
  return (
    <div className={style['iqc-header']}>
      <img src={logoImg} alt="logo" />
      <span className={style['iqc-header-time']}>
        <Time />
      </span>
    </div>
  );
}

function SubHeader({ fileUrl, declarer, organizationName }) {
  return (
    <div className={style['sub-header']}>
      <div className={style.worker}>
        <img src={fileUrl || defaultAvatarImg} alt="" />
        <span>{declarer}</span>
      </div>
      <div>
        <img src={operationIcon} alt="" />
        <span>{organizationName}</span>
      </div>
    </div>
  );
}

function InspectionLine(props) {
  return (
    <Row className={style['content-right-eye']}>
      <Col span={14} className={style.title}>
        <Tooltip title={props.inspectionItemName}>{props.inspectionItemName}</Tooltip>
      </Col>
      {props.resultType === 'NUMBER' ? (
        <Col span={6} className={style.range}>
          {props.lclAccept ? '[' : '('}
          {`${props.lcl}-${props.ucl}`}
          {props.uclAccept ? ']' : ')'}
        </Col>
      ) : (
        <Col span={6} />
      )}
      {props.resultType === 'JUDGE' ? (
        <Col span={2} offset={2} className={style.judge}>
          <Switch
            unCheckedChildren={<Icon type="close" />}
            checked={props.qcJudge}
            onChange={props.onSwitchChange}
          >
            <Icon type="check" />
          </Switch>
        </Col>
      ) : (
        <Col span={4} className={style.number}>
          <NumberField
            className={
              props.qcResult === 'PASS' ? style['qualified-input'] : style['unqualified-input']
            }
            value={props.qcValue}
            onChange={props.onNumberChange}
          />
        </Col>
      )}
    </Row>
  );
}

function IqcContent(props) {
  const {
    typeName,
    curModeList,
    inspectionDocLineList,
    curInspectionDocLine,
    beforeClick,
    nextClick,
    curInspectionDocIndex,
    submitLoading,
  } = props;
  const handleLovChange = async (value, type) => {
    if (!value) return;
    if (type === 'documentObj') {
      formDS.current.set('itemObj', {
        itemId: value.itemId,
        itemCode: value.itemCode,
        description: value.item,
      });
    } else if (type === 'workerObj') {
      formDS.current.set('workerName', `${value.workerCode}_${value.workerName}`);
    } else if (type === 'prodLineObj') {
      formDS.current.set('resourceName', `${value.prodLineCode}_${value.resourceName}`);
    } else if (type === 'workcellObj') {
      formDS.current.set('workcellName', `${value.workcellCode}_${value.workcellName}`);
    } else if (type === 'equipmentObj') {
      formDS.current.set('equipmentName', `${value.equipmentCode}_${value.equipmentName}`);
    }
  };
  return (
    <div className={style['iqc-content']}>
      <div className={style['left-content']}>
        <div className={style['select-options']}>
          {curModeList.value === 'TAG' && (
            <div className={style.option}>
              <Lov
                dataSet={formDS}
                name="documentObj"
                noCache
                placeholder="请输入工单"
                onChange={(value) => handleLovChange(value, 'documentObj')}
              />
            </div>
          )}
          {curModeList.value === 'DOCUMENT' && typeName === 'TASK' && (
            <div className={style.option}>
              <Lov dataSet={formDS} name="documentNum" disabled placeholder="MO" />
            </div>
          )}
          {curModeList.value === 'DOCUMENT' && typeName === 'TASK' && (
            <div className={style.option}>
              <Lov dataSet={formDS} name="operation" disabled placeholder="工序" />
            </div>
          )}
          {(curModeList.value === 'DOCUMENT' || curModeList.value === 'TAG') && (
            <div className={style.option}>
              <Lov dataSet={formDS} name="itemObj" noCache placeholder="请输入物料" />
            </div>
          )}
          <div className={style.option}>
            <Lov
              dataSet={formDS}
              name="workerObj"
              placeholder="请输入操作工"
              noCache
              onChange={(value) => handleLovChange(value, 'workerObj')}
            />
          </div>
          <div className={style.option}>
            <Lov
              dataSet={formDS}
              name="prodLineObj"
              placeholder="请输入生产线"
              noCache
              onChange={(value) => handleLovChange(value, 'prodLineObj')}
            />
          </div>
          <div className={style.option}>
            <Lov
              dataSet={formDS}
              name="workcellObj"
              placeholder="请输入工位"
              noCache
              onChange={(value) => handleLovChange(value, 'workcellObj')}
            />
          </div>
          <div className={style.option}>
            <Lov
              dataSet={formDS}
              name="equipmentObj"
              placeholder="请输入设备"
              noCache
              onChange={(value) => handleLovChange(value, 'equipmentObj')}
            />
          </div>
          <div
            className={style.option}
            style={{
              width: curModeList.value === 'TAG' || curModeList.value === 'ITEM' ? '100%' : '48%',
            }}
          >
            <TextField dataSet={formDS} name="traceNum" placeholder="请输入跟踪号" />
          </div>
        </div>
        <div className={style['iqc-content-textarea']}>
          <TextArea
            dataSet={formDS}
            name="remark"
            className={style['iqc-content-textarea-input']}
            placeholder="请输入备注"
          />
        </div>
      </div>
      <div className={style['right-content']} key={uuidv4()}>
        {Object.keys(curInspectionDocLine).length ? (
          <>
            <div className={style.top}>
              <div className={style['top-left']}>
                <div style={{ width: '40%' }}>
                  <TextField
                    className={style['edit-sample']}
                    value={curInspectionDocLine.sampleNumber}
                    disabled={!curInspectionDocLine.isEdit}
                    onChange={props.onChangeSampleNumber}
                    onEnterDown={props.onEnter}
                  />
                </div>
                <img src={editIcon} alt="" onClick={props.onEdit} />
              </div>
              <div className={style['top-right']}>
                <img src={deleteIcon} alt="" onClick={props.onDeleteSample} />
                <img src={addIcon} alt="" onClick={props.onAddSample} />
              </div>
            </div>
            <div className={style.middle}>
              {curInspectionDocLine.list &&
                curInspectionDocLine.list.length &&
                curInspectionDocLine.list.map((line, lineIndex) => (
                  <InspectionLine
                    key={uuidv4()}
                    {...line}
                    onSwitchChange={(value) => props.onSwitchChange(value, lineIndex)}
                    onNumberChange={(value) => props.onNumberChange(value, lineIndex)}
                  />
                ))}
            </div>
            <div className={style.footer}>
              <div className={style.total}>
                总量: <span>{inspectionDocLineList.length}</span>
              </div>
              <div className={style['to-page']}>
                {beforeClick && (
                  <img
                    style={{ cursor: 'pointer' }}
                    src={arrowLeftBlueIcon}
                    alt=""
                    onClick={props.onBeforeData}
                  />
                )}
                {!beforeClick && (
                  <img style={{ cursor: 'not-allowed' }} src={arrowLeftForbiddenIcon} alt="" />
                )}
                <div className={style.page}>
                  <span>
                    <NumberField
                      value={curInspectionDocIndex + 1}
                      step={1}
                      min={1}
                      max={inspectionDocLineList.length}
                      onChange={props.onPageJump}
                    />
                  </span>
                  <span>/</span>
                  <span>{inspectionDocLineList.length}</span>
                </div>
                {nextClick && (
                  <img
                    style={{ cursor: 'pointer' }}
                    src={arrowRightBlueIcon}
                    alt=""
                    onClick={props.onNextData}
                  />
                )}
                {!nextClick && (
                  <img style={{ cursor: 'not-allowed' }} src={arrowRightForbiddenIcon} alt="" />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className={style['no-data']}>
            <img src={noDataImg} alt="no-data" />
            <span>暂无数据</span>
          </div>
        )}
      </div>
      {submitLoading ? (
        <div className={style['my-loading-yes-no']}>
          <Spin loading={submitLoading} />
        </div>
      ) : null}
    </div>
  );
}

function IqcFoot(props) {
  return (
    <div className={style['iqc-foot']}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div className={style['iqc-foot-item']} onClick={props.onExit}>
          <img src={exitImg} alt="exit" />
          <span>退出</span>
        </div>
        <div className={style['iqc-foot-item']} onClick={props.onChangeLogin}>
          <img src={changeImg} alt="changeImg" />
          <span>切换</span>
        </div>
      </div>
      <div className={style['iqc-foot-item']} onClick={props.onReset}>
        <img src={resetImg} alt="reset" />
        <span>重置</span>
      </div>
      <div className={style['iqc-foot-item']} onClick={props.onSubmit}>
        <img src={inspectImg} alt="inspect" />
        <span>创建</span>
      </div>
      <div className={style['iqc-foot-item-select']}>
        <div>
          <img src={submitImg} alt="inspect" />
          <span>判定</span>
        </div>
        <Select
          dropdownMenuStyle={{
            fontSize: '16px',
            width: '124px',
            height: '162px',
            backgroundColor: '#E5E7E9',
            border: '2px solid rgba(255, 255, 255, 0.193318)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            position: 'absolute',
            left: '-20px',
            bottom: '100px',
            textAlign: 'center',
            color: '#051E2D',
          }}
          dataSet={formDS}
          name="qcResult"
          onChange={props.onJudgeChange}
        />
      </div>
    </div>
  );
}

// 报检模式
function InspectionMode({
  modeList,
  curModeList,
  showModeList,
  chooseActiveMode,
  toggleModeList,
  ds,
  onHeaderLovChange,
  onSelectChange,
}) {
  return (
    <div className={style['inspection-mode']}>
      <div className={style.left}>
        <div className={style.mode} onClick={toggleModeList}>
          <span>{curModeList.meaning}</span>
          <img src={downIcon} alt="downIcon" />
        </div>
        {showModeList && (
          <div className={style['more-mode-list']}>
            {modeList.map((v) => (
              <div
                key={v.value}
                className={`${style['mode-value']} ${
                  v.value === curModeList.value && style['mode-value-active']
                }`}
                onClick={() => chooseActiveMode(v)}
              >
                {v.meaning}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={style.right}>
        <div className={style['left-lov']}>
          {curModeList.value === 'ITEM' && (
            <div className={style['select-item']}>
              <Lov
                dataSet={ds}
                name="itemObj"
                noCache
                placeholder="物料"
                onChange={(value) => onHeaderLovChange(value, 'itemObj')}
              />
            </div>
          )}
          {curModeList.value === 'DOCUMENT' && (
            <div className={style['scan-input']}>
              <Select
                dataSet={ds}
                name="documentType"
                className={style['scan-select']}
                placeholder="请选择"
                onChange={onSelectChange}
              />
              <Lov
                dataSet={ds}
                name="documentObj"
                className={style['scan-lov']}
                noCache
                onChange={(value) => onHeaderLovChange(value, 'documentObj')}
              />
            </div>
          )}
          {curModeList.value === 'TAG' && (
            <div className={style['lov-suffix']}>
              <img className={style['right-icon']} src={scanIcon} alt="" />
              <TextField
                dataSet={ds}
                name="tagCode"
                placeholder="请扫描或输入标签号"
                onChange={(value) => onHeaderLovChange(value, 'tagCode')}
              />
            </div>
          )}
          {curModeList.value === 'OPERATION' && (
            <div className={style['select-item-operation']}>
              <Lov
                dataSet={ds}
                name="operationObj"
                noCache
                placeholder="请输入或扫描工序"
                onChange={(value) => onHeaderLovChange(value, 'operation')}
              />
              <Lov
                dataSet={ds}
                name="itemObj"
                noCache
                placeholder="物料"
                onChange={(value) => onHeaderLovChange(value, 'operation')}
              />
            </div>
          )}
        </div>
        <div className={style['right-lov']}>
          <Lov dataSet={ds} name="inspectionGroupObj" noCache placeholder="检验组" />
        </div>
      </div>
    </div>
  );
}

function IqcInspection(props) {
  const [modeList, setModeList] = useState([]);
  const [curModeList, setCurModeList] = useState({});
  const [showModeList, setShowModeList] = useState(false);
  const [loginData, setLoginData] = useState({});
  const [createRes, setCreateRes] = useState({}); // 创建成功之后返回的数据
  const [inspectionDocLineList, setInspectionDocLineList] = useState([]);
  const [curInspectionDocLine, setCurInspectionDocLine] = useState({});
  const [curInspectionDocIndex, setCurInspectionDocIndex] = useState(0);
  const [beforeClick, setBeforeClick] = useState(false);
  const [nextClick, setNextClick] = useState(false);
  const [typeName, setTypeName] = useState('MO'); // 来源单据大类
  const [organizationId, setOrganizationId] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        formDS.current.set('organizationId', res.content[0].organizationId);
        setOrganizationId(res.content[0].organizationId);
      }
    }
    queryDefaultOrg();

    setDefaultDSValue();
    handleReset();

    async function queryModeList() {
      const res = await queryIndependentValueSet({
        lovCode: 'LMES.ROUTING_TYPE',
      });
      setModeList(res);
      setCurModeList(res[0]);
      if (res[0].value === 'ITEM') {
        formDS.fields.get('itemObj').set('required', true);
      } else if (res[0].value === 'DOCUMENT') {
        formDS.fields.get('documentObj').set('required', true);
      } else {
        formDS.fields.get('tagCode').set('required', true);
      }
    }
    queryModeList();
  }, []);

  /**
   *设置默认查询条件
   */
  async function setDefaultDSValue() {
    const res = await queryLovData({
      lovCode: common.worker,
      defaultFlag: 'Y',
      showOrganization: 'Y',
    });
    if (getResponse(res)) {
      if (res && Array.isArray(res.content) && res.content.length && loginDS.current) {
        loginDS.current.set('declarerObj', res.content[0]);
        setLoginData(loginDS.current.toJSONData());
      }
    }
  }

  // 选择报检模式
  const chooseActiveMode = (v) => {
    // reset
    setCurModeList(v);
    setShowModeList(false);
    handleReset();
    handleDataDisabled(false);

    if (v.value === 'DOCUMENT') {
      formDS.current.set('documentType', typeName);
      formDS.fields.get('documentObj').set('required', true);
      formDS.fields.get('itemObj').set('disabled', true);
    } else if (v.value === 'ITEM') {
      formDS.fields.get('itemObj').set('disabled', false);
      formDS.fields.get('itemObj').set('required', true);
    } else if (v.value === 'TAG') {
      formDS.fields.get('documentObj').set('required', false);
      formDS.fields.get('itemObj').set('disabled', true);
      formDS.fields.get('itemObj').set('required', false);
    } else if (v.value === 'OPERATION') {
      formDS.fields.get('itemObj').set('required', true);
    }
    // setCurModeList(v);
    // setShowModeList(false);
    // handleReset();
    // handleDataDisabled(false);
  };

  const onLogin = async () => {
    const isValid = await loginDS.validate(false, false);
    if (!isValid) {
      return;
    }
    setLoginData(loginDS.current.toJSONData());
    modal.close();
  };

  // 获取对应的检验项
  const handleQueryInspectionLineList = (inspectionList) => {
    if (inspectionList && inspectionList.length) {
      const array = [];
      const obj = {};
      inspectionList.forEach((ele) => {
        if (Reflect.has(obj, ele.sampleNumber)) {
          // eslint-disable-next-line no-unused-expressions
          ele.resultType === 'NUMBER'
            ? obj[ele.sampleNumber].push({ ...ele, qcValue: 0 })
            : obj[ele.sampleNumber].push({ ...ele, qcJudge: true });
        } else {
          // eslint-disable-next-line no-unused-expressions
          ele.resultType === 'NUMBER'
            ? (obj[ele.sampleNumber] = [{ ...ele, qcValue: 0 }])
            : (obj[ele.sampleNumber] = [{ ...ele, qcJudge: true }]);
        }
      });
      for (const key in obj) {
        if (Reflect.ownKeys(obj, key)) {
          array.push({
            sampleNumber: key,
            isEdit: false,
            list: obj[key],
          });
        }
      }
      array.forEach((headerLine) => {
        headerLine.list.forEach((line) => {
          if (line.resultType === 'NUMBER') {
            const lclStatus =
              (line.lclAccept && Number(line.qcValue) >= Number(line.lcl)) ||
              (!line.lclAccept && Number(line.qcValue) > Number(line.lcl));
            const uclStatus =
              (line.uclAccept && Number(line.qcValue) <= Number(line.ucl)) ||
              (!line.uclAccept && Number(line.qcValue) < Number(line.ucl));
            if (lclStatus && uclStatus) {
              Reflect.set(line, 'qcResult', 'PASS');
            } else {
              Reflect.set(line, 'qcResult', 'FAILED');
            }
          }
        });
      });
      setInspectionDocLineList(array);
      setCurInspectionDocLine(array[0]);
    }
  };

  // 获取检验组值
  const handleGetInspectionGroup = async (itemId, operationId) => {
    const resp = await getInspectionTemplate({
      organizationId: formDS.current.get('organizationId'),
      itemId,
      inspectionTemplateType: 'PQC.ROUTING',
      operationId,
    });
    if (getResponse(resp)) {
      formDS.current.set('inspectionGroupObj', {
        templateId: resp.templateId,
        inspectionGroupId: resp.inspectionGroupId,
        inspectionGroupName: resp.inspectionGroupName,
        inspectionTemplateType: resp.inspectionTemplateType,
      });
    }
  };

  // 根据头部LOV, 文本框输入的数据带出相应的数据
  const handleHeaderLovChange = async (value, type) => {
    if (!value && type !== 'operation') {
      formDS.current.reset();
      setInspectionDocLineList([]);
      return;
    }
    if (!value && type === 'operation') {
      formDS.current.set('inspectionGroupObj', null);
      setInspectionDocLineList([]);
      return;
    }
    if (type === 'documentObj') {
      let res = null;
      let inspectionRule = {};
      if (typeName === 'MO') {
        res = await moExecutes({ moId: value.documentId });
      } else {
        res = await queryExecuteLines({ taskId: value.taskId });
        if (value.inspectionRule) {
          inspectionRule = JSON.parse(value.inspectionRule) || {};
        }
      }
      if (res && res.content && res.content.length) {
        const record = res.content[0];
        formDS.current.set('itemObj', {
          itemId: record.itemId,
          itemCode: record.itemCode,
          description:
            record.itemCode &&
            record.itemDescription &&
            `${record.itemCode}_${record.itemDescription}`,
        });
        formDS.current.set('workerObj', {
          workerId: record.workerId,
          workerCode: record.worker,
          workerName: record.worker && record.workerName && `${record.worker}_${record.workerName}`,
        });
        formDS.current.set('prodLineObj', {
          prodLineId: record.prodLineId,
          prodLineCode: record.prodLineCode,
          resourceName:
            record.prodLineCode &&
            (record.prodLineName || record.prodLine) &&
            `${record.prodLineCode}_${record.prodLineName || record.prodLine}`,
        });
        formDS.current.set('workcellObj', {
          workcellId: record.workcellId,
          workcellCode: record.workcellCode,
          workcellName:
            record.workcellCode &&
            (record.workcellName || record.workcell) &&
            `${record.workcellCode}_${record.workcellName || record.workcell}`,
        });
        formDS.current.set('equipmentObj', {
          equipmentId: record.equipmentId,
          equipmentCode: record.equipmentCode,
          equipmentName:
            record.equipmentCode &&
            (record.equipmentName || record.equipment) &&
            `${record.equipmentCode}_${record.equipmentName || record.equipment}`,
        });
        if (record.itemId) {
          formDS.fields.get('itemObj').set('disabled', true);
        } else {
          formDS.fields.get('itemObj').set('disabled', false);
        }
        if (record.workerId) {
          formDS.fields.get('workerObj').set('disabled', true);
        } else {
          formDS.fields.get('workerObj').set('disabled', false);
        }
        if (record.prodLineId) {
          formDS.fields.get('prodLineObj').set('disabled', true);
        } else {
          formDS.fields.get('prodLineObj').set('disabled', false);
        }
        if (record.workcellId) {
          formDS.fields.get('workcellObj').set('disabled', true);
        } else {
          formDS.fields.get('workcellObj').set('disabled', false);
        }
        if (record.equipmentId) {
          formDS.fields.get('equipmentObj').set('disabled', true);
        } else {
          formDS.fields.get('equipmentObj').set('disabled', false);
        }
        if (typeName === 'TASK' && inspectionRule.template_rule === 'ITEM') {
          handleGetInspectionGroup(record.itemId, null);
        } else if (typeName === 'TASK' && inspectionRule.template_rule === 'OPERATION') {
          handleGetInspectionGroup(null, value.operationId);
        } else {
          // 根据物料id获取检验组
          handleGetInspectionGroup(record.itemId, value.operationId);
        }
      }
    } else if (type === 'tagCode') {
      await queryTags({ tagCode: value }).then((tagInfo) => {
        if (tagInfo && tagInfo.failed) {
          notification.error({
            message: tagInfo.message,
          });
          formDS.current.set('tagCode', null);
          return;
        }
        formDS.current.set('tagId', tagInfo.tagId);
        if (tagInfo && tagInfo.documentId) {
          formDS.current.set('documentObj', {
            documentId: tagInfo.documentId,
            documentNum: tagInfo.documentNum,
            documentTypeId: tagInfo.documentTypeId,
            documentTypeCode: tagInfo.documentTypeCode,
            documentTypeName:
              tagInfo.documentNum &&
              tagInfo.documentTypeName &&
              `${tagInfo.documentNum}_${tagInfo.documentTypeName}`,
          });
          moExecutes({
            moId: tagInfo.documentId,
            organizationId: formDS.current.get('organizationId'),
          }).then((res) => {
            if (res && res.failed) {
              notification.error({
                message: res.message,
              });
            } else if (res && res.content && res.content.length) {
              const record = res.content[0];
              formDS.current.set('itemObj', {
                itemId: record.itemId,
                itemCode: record.itemCode,
                description:
                  record.itemCode &&
                  record.itemDescription &&
                  `${record.itemCode}_${record.itemDescription}`,
              });
              formDS.current.set('workerObj', {
                workerId: record.workerId,
                workerCode: record.workerCode,
                workerName:
                  record.workerCode &&
                  record.workerName &&
                  `${record.workerCode}_${record.workerName}`,
              });
              formDS.current.set('prodLineObj', {
                prodLineId: record.prodLineId,
                prodLineCode: record.prodLineCode,
                resourceName:
                  record.prodLineCode &&
                  record.resourceName &&
                  `${record.prodLineCode}_${record.resourceName}`,
              });
              formDS.current.set('workcellObj', {
                workcellId: record.workcellId,
                workcellCode: record.workcellCode,
                workcellName:
                  record.workcellCode &&
                  record.workcellName &&
                  `${record.workcellCode}_${record.workcellName}`,
              });
              formDS.current.set('equipmentObj', {
                equipmentId: record.equipmentId,
                equipmentCode: record.equipmentCode,
                equipmentName:
                  record.equipmentCode &&
                  record.equipmentName &&
                  `${record.equipmentCode}_${record.equipmentName}`,
              });
              // 根据物料id获取检验组
              handleGetInspectionGroup(record.itemId);
            }
          });
        }
      });
    } else if (type === 'itemObj') {
      handleGetInspectionGroup(value.itemId);
    } else if (type === 'operation') {
      const _curRecord = formDS.current.toJSONData();
      formDS.current.set('itemObj', {
        itemId: _curRecord.itemId,
        itemCode: _curRecord.itemCode,
        description:
          _curRecord.itemCode &&
          _curRecord.description &&
          `${_curRecord.itemCode}_${_curRecord.description}`,
      });
      if (_curRecord.operationId && _curRecord.itemId) {
        handleGetInspectionGroup(_curRecord.itemId, _curRecord.operationId);
      }
    }
  };

  // MO,TASK切换
  const handleSelectChange = (value) => {
    setTypeName(value);
    formDS.current.set('documentObj', {});
    formDS.current.set('inspectionGroupObj', null);
    formDS.current.set('itemObj', null);
    formDS.current.set('workerObj', null);
    formDS.current.set('prodLineObj', null);
    formDS.current.set('workcellObj', null);
    formDS.current.set('equipmentObj', null);
    formDS.current.set('traceNum', null);
    formDS.current.set('remark', null);
  };

  // 将样品名称更改为可修改状态
  const handleEdit = (status = true) => {
    const _inspectionDocLineList = inspectionDocLineList.slice();
    _inspectionDocLineList[curInspectionDocIndex].isEdit = status;
    setInspectionDocLineList(_inspectionDocLineList);
  };

  // 修改样品名称
  const handleChangeSampleNumber = async (newVal) => {
    const _inspectionDocLineList = inspectionDocLineList.slice();
    await handleInspectionDocLinesModify({
      inspectionDocId: createRes.inspectionDocId,
      sampleNumber: inspectionDocLineList[curInspectionDocIndex].sampleNumber,
      newSampleNumber: newVal,
    });
    _inspectionDocLineList[curInspectionDocIndex].sampleNumber = newVal;
    setInspectionDocLineList(_inspectionDocLineList);
    setCurInspectionDocLine(_inspectionDocLineList[curInspectionDocIndex]);
  };

  // 样品名称回车操作, 编辑状态为不可编辑
  const handleEnter = () => {
    handleEdit(false);
  };

  // 新增样品
  const handleAddSample = async () => {
    const _inspectionDocLineList = inspectionDocLineList.slice();
    const newSampleNumber = formDS.current.get('sampleNumber');
    const res = await handleInspectionDocLinesAdd({
      inspectionDocId: createRes.inspectionDocId,
      sampleNumber: newSampleNumber,
      templateId: formDS.current.get('templateId'),
    });
    if (getResponse(res)) {
      const list = res.map((v) => {
        if (v.resultType === 'NUMBER') {
          return { ...v, qcValue: 0 };
        }
        return { ...v, qcJudge: true };
      });

      // 添加第一个样品
      _inspectionDocLineList.push({
        sampleNumber: newSampleNumber,
        isEdit: false,
        list, // 同一检验单的检验项是不变的
      });
      setInspectionDocLineList(_inspectionDocLineList);
      setCurInspectionDocLine(_inspectionDocLineList[_inspectionDocLineList.length - 1]);
      setCurInspectionDocIndex(_inspectionDocLineList.length - 1);
      setBeforeClick(true);
    }
    addModal.close();
  };

  // 新增样品弹框
  const handleAddSampleModal = async () => {
    const _inspectionDocLineList = inspectionDocLineList.slice();
    const maxArray = [];
    let titleString = '';
    let newSampleNumber = '';
    if (_inspectionDocLineList.length) {
      _inspectionDocLineList.forEach((ele) => {
        titleString = ele.sampleNumber.replace(/^[^(1-9)]*(\d+)[^\d]*$/, '$1');
        if (!isNaN(Number(titleString))) {
          maxArray.push(Number(titleString));
        }
      });
      let sampleNumberLength = 0;
      if (maxArray.length) {
        sampleNumberLength = (Math.max(...maxArray) + 1).toString().length;
      } else {
        sampleNumberLength = 0;
      }
      if (sampleNumberLength === 0) {
        newSampleNumber = 'S0001';
      } else if (sampleNumberLength === 1) {
        newSampleNumber = `S000${(Math.max(...maxArray) + 1).toString()}`;
      } else if (sampleNumberLength === 2) {
        newSampleNumber = `S00${(Math.max(...maxArray) + 1).toString()}`;
      } else if (sampleNumberLength === 3) {
        newSampleNumber = `S0${(Math.max(...maxArray) + 1).toString()}`;
      } else {
        newSampleNumber = `S${(Math.max(...maxArray) + 1).toString()}`;
      }
    } else {
      newSampleNumber = 'S0001';
    }

    formDS.current.set('sampleNumber', newSampleNumber);

    addModal = Modal.open({
      key: 'lmes-pqc-on-site-inspection-add-sample-modal',
      title: '样品',
      className: style['lmes-pqc-on-site-inspection-add-sample-modal'],
      children: (
        <div>
          <div className={style['lov-suffix']}>
            <img className={style['right-icon']} src={scanIcon} alt="" />
            <TextField
              dataSet={formDS}
              name="sampleNumber"
              className={style['space-left']}
              placeholder="输入或扫描样品编码"
              noCache
            />
          </div>
          <div className={style['modal-footer']}>
            <Button onClick={() => addModal.close()}>取消</Button>
            <Button color="primary" onClick={handleAddSample}>
              确认
            </Button>
          </div>
        </div>
      ),
      footer: null,
      closable: true,
    });
  };

  // 删除样品
  const handleDeleteSample = async () => {
    const _inspectionDocLineList = inspectionDocLineList.slice();
    await handleInspectionDocLinesDelete({
      inspectionDocId: createRes.inspectionDocId,
      sampleNumber: _inspectionDocLineList[curInspectionDocIndex].sampleNumber,
    });
    _inspectionDocLineList.splice(curInspectionDocIndex, 1);
    setInspectionDocLineList(_inspectionDocLineList);
    if (_inspectionDocLineList.length > 0) {
      setCurInspectionDocLine(_inspectionDocLineList[0]);
      setCurInspectionDocIndex(0);
      setBeforeClick(false);
      if (_inspectionDocLineList.length > 1) {
        setNextClick(true);
      } else {
        setNextClick(false);
      }
    } else {
      setCurInspectionDocLine({});
      setCurInspectionDocIndex(0);
    }
  };

  // "JUDGE" 类型
  const handleSwitchChange = (_, lineIndex) => {
    const _inspectionDocLineList = inspectionDocLineList.slice();
    const changeRec = _inspectionDocLineList[curInspectionDocIndex].list[lineIndex];
    changeRec.qcJudge = !changeRec.qcJudge;
    setInspectionDocLineList(_inspectionDocLineList);
    setCurInspectionDocLine(_inspectionDocLineList[curInspectionDocIndex]);
  };

  // "NUMBER" 类型
  const handleNumberChange = (value, lineIndex) => {
    const _inspectionDocLineList = inspectionDocLineList.slice();
    const changeRec = _inspectionDocLineList[curInspectionDocIndex].list[lineIndex];
    changeRec.qcValue = value;
    _inspectionDocLineList.forEach((headerLine) => {
      headerLine.list.forEach((line) => {
        if (line.resultType === 'NUMBER') {
          const lclStatus =
            (line.lclAccept && Number(line.qcValue) >= Number(line.lcl)) ||
            (!line.lclAccept && Number(line.qcValue) > Number(line.lcl));
          const uclStatus =
            (line.uclAccept && Number(line.qcValue) <= Number(line.ucl)) ||
            (!line.uclAccept && Number(line.qcValue) < Number(line.ucl));
          if (lclStatus && uclStatus) {
            Reflect.set(line, 'qcResult', 'PASS');
          } else {
            Reflect.set(line, 'qcResult', 'FAILED');
          }
        }
      });
    });
    setInspectionDocLineList(_inspectionDocLineList);
    setCurInspectionDocLine(_inspectionDocLineList[curInspectionDocIndex]);
  };

  // 上一条数据
  const handleBeforeData = () => {
    const _inspectionDocLineList = inspectionDocLineList.slice();
    if (curInspectionDocIndex > 0) {
      setCurInspectionDocLine(_inspectionDocLineList[curInspectionDocIndex - 1]);
      setCurInspectionDocIndex(curInspectionDocIndex - 1);
      if (curInspectionDocIndex - 1 === 0) {
        setBeforeClick(false);
      }
      if (curInspectionDocIndex < _inspectionDocLineList.length) {
        setNextClick(true);
      }
    }
  };

  // 下一条数据
  const handleNextData = () => {
    const _inspectionDocLineList = inspectionDocLineList.slice();
    if (curInspectionDocIndex < _inspectionDocLineList.length) {
      setCurInspectionDocLine(_inspectionDocLineList[curInspectionDocIndex + 1]);
      setCurInspectionDocIndex(curInspectionDocIndex + 1);
      if (curInspectionDocIndex + 1 === _inspectionDocLineList.length - 1) {
        setNextClick(false);
      }
      if (curInspectionDocIndex + 1 > 0) {
        setBeforeClick(true);
      }
    }
  };

  // 跳转到具体的样品数据页
  const handlePageJump = (value) => {
    const curIndex = Number(value);
    let beforeFlag = true;
    let nextFlag = true;
    if (curIndex > inspectionDocLineList.length || curIndex < 1) return;
    setCurInspectionDocLine(inspectionDocLineList[curIndex - 1]);
    setCurInspectionDocIndex(curIndex - 1);
    if (curIndex === 1 && curIndex < inspectionDocLineList.length) {
      beforeFlag = false;
    }
    if (curIndex === inspectionDocLineList.length && curIndex > 1) {
      nextFlag = false;
    }
    setBeforeClick(beforeFlag);
    setNextClick(nextFlag);
  };

  // 创建
  const handleSubmit = async () => {
    let flag = null;
    if (curModeList.value === 'ITEM') {
      flag = formDS.current.get('itemId');
    } else if (curModeList.value === 'DOCUMENT') {
      if (typeName === 'MO') {
        flag = formDS.current.get('documentId');
      } else {
        flag = formDS.current.get('taskId');
      }
    } else if (curModeList.value === 'TAG') {
      flag = formDS.current.get('tagCode');
    } else if (
      curModeList.value === 'OPERATION' &&
      formDS.current.get('operationId') &&
      formDS.current.get('itemId')
    ) {
      flag = true;
    }

    if (!flag) {
      notification.warning({
        message: '请先完成必输项',
      });
      return;
    }
    if (!formDS.current.get('inspectionGroupId')) {
      notification.warning({
        message: '请先选择检验组',
      });
      return;
    }

    if (createRes.inspectionDocId) {
      notification.warning({
        message: '检验单已创建，请勿重复提交',
      });
      return;
    }

    const loginRec = loginDS.current.toJSONData();
    const formRec = formDS.current.toJSONData();
    const params = {
      organizationId: loginRec.organizationId,
      organizationCode: loginRec.organizationCode,
      inspectionDegree: curModeList.value === 'TAG' ? 'TAG' : null,
      tagId: formRec.tagId || null,
      tagCode: formRec.tagCode || null,
      itemId: formRec.itemId,
      itemCode: formRec.itemCode,
      operationId: formRec.operationId,
      operationCode: formRec.operationCode,
      sourceDocClass: typeName,
      sourceDocTypeId: typeName === 'MO' ? formRec.documentTypeId : formRec.taskTypeId,
      sourceDocTypeCode: typeName === 'MO' ? formRec.documentTypeCode : formRec.taskTypeCode,
      sourceDocId: typeName === 'MO' ? formRec.documentId : formRec.taskId,
      sourceDocNum: typeName === 'MO' ? formRec.documentNum : formRec.taskNumber,
      inspectionGroupId: formRec.inspectionGroupId,
      inspectionGroupCode: formRec.inspectionGroupCode,
      inspectionTemplateType: formRec.inspectionTemplateType,
      templateId: formRec.templateId,
      declarerId: loginRec.declarerId,
      declarer: loginRec.declarerCode,
      inspectionDocNum: null,
      batchQty: '1',
      sampleQty: '1',
      samplingType: null,
      prodLineId: formRec.prodLineId,
      prodLineCode: formRec.prodLineCode,
      workcellId: formRec.workcellId,
      workcellCode: formRec.workcellCode,
      equipmentId: formRec.equipmentId,
      equipmentCode: formRec.equipmentCode,
      workerId: formRec.workerId,
      workerCode: formRec.workerCode,
      remark: formRec.remark,
      traceNum: formRec.traceNum,
      autoFeedbackResult: false,
    };

    setSubmitLoading(true);

    const res = await createInspect(params);
    if (getResponse(res)) {
      setCreateRes(res);
      handleQueryInspectionLineList(res.inspectionDocLineList);
      // 创建成功后检验组不可修改
      handleDataDisabled(true);
    }
    setSubmitLoading(false);
  };

  // 判定
  const handleChange = async (value) => {
    if (!inspectionDocLineList.length) {
      notification.warning({
        message: '请先创建',
      });
      return;
    }

    const _inspectionDocLineList = inspectionDocLineList.slice();
    const formRec = formDS.current.toJSONData();
    const loginRec = loginDS.current.toJSONData();
    const lineList = [];
    _inspectionDocLineList.forEach((headerLine) => {
      headerLine.list.forEach((line) => {
        if (line.resultType === 'JUDGE') {
          Reflect.set(line, 'qcValue', null);
          if (line.qcJudge) {
            Reflect.set(line, 'qcResult', 'PASS');
          } else {
            Reflect.set(line, 'qcResult', 'FAILED');
          }
        } else {
          const lclStatus =
            (line.lclAccept && Number(line.qcValue) >= Number(line.lcl)) ||
            (!line.lclAccept && Number(line.qcValue) > Number(line.lcl));
          const uclStatus =
            (line.uclAccept && Number(line.qcValue) <= Number(line.ucl)) ||
            (!line.uclAccept && Number(line.qcValue) < Number(line.ucl));
          if (lclStatus && uclStatus) {
            Reflect.set(line, 'qcResult', 'PASS');
          } else {
            Reflect.set(line, 'qcResult', 'FAILED');
          }
        }
        const lineObj = {
          ...line,
          qcOkQty: line.qcResult === 'PASS' && line.resultType === 'NUMBER' ? '1' : null,
          qcNgQty: line.qcResult === 'FAILED' && line.resultType === 'NUMBER' ? '1' : null,
          sampleNumber: headerLine.sampleNumber,
          inspectorId: loginRec.declarerId,
          inspector: loginRec.declarerCode,
        };
        lineList.push(lineObj);
      });
    });

    setInspectionDocLineList(_inspectionDocLineList);
    if (createRes.inspectionDocId) {
      const params = {
        inspectionDocId: createRes.inspectionDocId,
        qcResult: value,
        inspectorId: loginRec.declarerId,
        inspector: loginRec.declarer,
        judgedDate: moment().format(DEFAULT_DATETIME_FORMAT),
        remark: formRec.remark,
        qcOkQty: value !== 'FAILED' ? '1' : '0',
        qcNgQty: value === 'FAILED' ? '1' : '0',
        batchQty: inspectionDocLineList.length,
        sampleQty: inspectionDocLineList.length,
        inspectionDocLineList: lineList,
      };
      setSubmitLoading(true);
      const res = await Inspect(params);
      if (getResponse(res)) {
        notification.success({
          message: '判定成功',
        });
        formDS.current.reset();
        handleDataDisabled(false);
        setInspectionDocLineList([]);
        setCreateRes({});
        setCurInspectionDocIndex(0);
        setCurInspectionDocLine({});
      }
      setSubmitLoading(false);
    } else {
      return notification.warning({
        message: '请先创建',
      });
    }
  };

  // 重置
  const handleReset = () => {
    formDS.current.reset();
    setCreateRes({});
    setInspectionDocLineList([]);
    setCurInspectionDocLine({});
    setCurInspectionDocIndex(0);
    handleDataDisabled(false);
    formDS.current.set('organizationId', organizationId);
    formDS.current.set('documentType', typeName);
  };

  // 切换登录
  const handleChangeLogin = () => {
    if (createRes.inspectionDocId) {
      notification.warning({
        message: '创建之后不可切换登录',
      });
      return;
    }
    formDS.current.reset();
    formDS.current.set('organizationId', organizationId);
    modal = Modal.open({
      key: 'lmes-pqc-on-site-inspection-login-modal',
      title: '登录',
      className: style['lmes-pqc-on-site-inspection-login-modal'],
      children: (
        <div>
          <Form dataSet={loginDS}>
            <Lov name="declarerObj" noCache placeholder="操作工" />
          </Form>
          <Button color="primary" onClick={onLogin}>
            登录
          </Button>
        </div>
      ),
      footer: null,
      closable: true,
    });
  };

  // 页面数据不可修改
  const handleDataDisabled = (status = true) => {
    formDS.fields.get('itemObj').set('disabled', status);
    formDS.fields.get('documentObj').set('disabled', status);
    formDS.fields.get('tagCode').set('disabled', status);
    formDS.fields.get('workerObj').set('disabled', status);
    formDS.fields.get('prodLineObj').set('disabled', status);
    formDS.fields.get('workcellObj').set('disabled', status);
    formDS.fields.get('remark').set('disabled', status);
    formDS.fields.get('traceNum').set('disabled', status);
    // formDS.fields.get('inspectionGroupObj').set('disabled', status);
    formDS.fields.get('equipmentObj').set('disabled', status);
    formDS.fields.get('documentType').set('disabled', status);
  };

  // 退出
  const handleExit = () => {
    props.history.push('/workplace');
    closeTab('/pub/lmes/pqc-site-inspectio');
  };

  const handleToggleModeList = () => {
    setShowModeList(!showModeList);
  };

  return (
    <Fragment>
      <IqcHead />
      {Object.keys(loginData).length ? <SubHeader {...loginData} /> : null}
      <InspectionMode
        ds={formDS}
        modeList={modeList}
        curModeList={curModeList}
        showModeList={showModeList}
        chooseActiveMode={chooseActiveMode}
        toggleModeList={handleToggleModeList}
        onHeaderLovChange={handleHeaderLovChange}
        onSelectChange={handleSelectChange}
      />
      <IqcContent
        submitLoading={submitLoading}
        typeName={typeName}
        beforeClick={beforeClick}
        nextClick={nextClick}
        curModeList={curModeList}
        inspectionDocLineList={inspectionDocLineList}
        curInspectionDocLine={curInspectionDocLine}
        curInspectionDocIndex={curInspectionDocIndex}
        onAddSample={handleAddSampleModal}
        onDeleteSample={handleDeleteSample}
        onEdit={handleEdit}
        onChangeSampleNumber={handleChangeSampleNumber}
        onEnter={handleEnter}
        onSwitchChange={handleSwitchChange}
        onNumberChange={handleNumberChange}
        onBeforeData={handleBeforeData}
        onNextData={handleNextData}
        onPageJump={handlePageJump}
      />
      <IqcFoot
        inspectionDocLineList={inspectionDocLineList}
        onChangeLogin={handleChangeLogin}
        onSubmit={handleSubmit}
        onJudgeChange={handleChange}
        onReset={handleReset}
        onExit={handleExit}
      />
    </Fragment>
  );
}

export default IqcInspection;
