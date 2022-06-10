/**
 * @Description: 销售预测任务详情
 * @Author: qifeng.deng@hand.com
 * @Date: 2021-07-07 13:56:06
 */
import React, { useState, useEffect, Fragment } from 'react';
// 引入猪齿鱼组件 其中Icon为矢量图标组件
import {
  DataSet,
  Button,
  Form,
  Table,
  TextField,
  Select,
  DateTimePicker,
  Tabs,
  Lov,
  Icon,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
// 获取当前用户信息的方法组件 getCurrentUser
// import { getCurrentUser } from 'utils/utils';
// import { getSerialNum } from '@/utils/renderer';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import styles from './index.less';

import { headDS, saleItemRelDS, entityItemRelDS, paramsDS } from '../store/indexDS';

const intlPrefix = 'zplan.timePredictionModel';
// const organizationId = getCurrentOrganizationId();

const { TabPane } = Tabs;
const CreateHeadDS = () => new DataSet(headDS());
const CreateSaleItemRelDS = () => new DataSet(saleItemRelDS());
const CreateEntityItemRelDS = () => new DataSet(entityItemRelDS());
const CreateParamsDS = () => new DataSet(paramsDS());

function ZplanTimePredictionModel({ match, dispatch, history, location }) {
  // 第二个参数相当于设置缓存?
  const HeadDS = useDataSet(CreateHeadDS, ZplanTimePredictionModel);
  const SaleItemRelDS = useDataSet(CreateSaleItemRelDS);
  const EntityItemRelDS = useDataSet(CreateEntityItemRelDS);
  const ParamsDS = useDataSet(CreateParamsDS);
  // 通过useState定义一个变量及相关方法进行布尔值的切换  要写在React副本里,写在外面会报错
  const [paramsShow, setParamsShow] = useState(false); // 智能预测运行参数
  const [rangeShow, setRangeShow] = useState(false); // 智能预测范围
  const [robotShow, setRobotShow] = useState(false); // 选择智能检测显示,默认为false
  // 将路由跳转传过来的参数用变量保存起来
  const {
    params: { type, saleTemplateId },
  } = match;
  const [canEdit, setCanEdit] = useState(true); // 是否可编辑
  let currentTab = 'item';
  // const [currentTab, setCurrentTab] = useState('item'); // 是否可编辑
  // useEffect监听
  useEffect(() => {
    const { state } = location;
    if (type !== 'create') {
      // 如果不是从列表页跳过来的本地应该没有保存status状态
      setCanEdit(state.status === 'NEW' || type === 'create');
    }
    // 赋值空数组,再create()创建相当于清空缓存数据
    HeadDS.data = [];
    HeadDS.create();
    // SaleItemRelDS.data = [];
    // SaleItemRelDS.create();
    // EntityItemRelDS.data = [];
    // EntityItemRelDS.create();
    if (type === 'detail') {
      handleSearch();
    }

    // if (type === 'create') {
    //   HeadDS.current.set('saleTemplateStatus', 'NEW');
    // }
  }, [saleTemplateId]);

  // record 每一行的值 name 键 value 值
  useDataSetEvent(HeadDS, 'update', ({ name, value }) => {
    const showFlag = value === 'AUTO' ? 1 : 0;
    // 筛选特定的字段进行操作
    if (name === 'saleTemplateType') {
      // setRobotShow()括号里的参数直接传给对应的常量
      setRobotShow(Boolean(showFlag));
      setParamsShow(Boolean(showFlag));
      setRangeShow(Boolean(showFlag));
      // 如果是智能预测,设置给这个对象默认值
      if (showFlag) {
        HeadDS.current.set('userMessage', {
          id: '1',
          realName: 'admin',
        });
      }
      // 不是则给这个字段null,这样也不影响正则,而且从智能预测切换过来也是正常的,不能使用{}给它不然也算是有值
      else {
        HeadDS.current.set('userMessage', null);
      }
    }
  });

  async function handleSearch() {
    // setQueryParameter(para,value) 设置查询参数
    HeadDS.setQueryParameter('saleTemplateId', saleTemplateId);
    await HeadDS.query();
    // setCanEdit是改变canEdit变量(boolean)的方法 保存或者新建
    setCanEdit(HeadDS.current.data.saleTemplateStatus === 'NEW' || type === 'create');
    // 页面一刷新就获取DS中的值,可以在DS.query()方法之后通过DS.current.data.字段名来获取它的值
    setRobotShow(HeadDS.current.data.saleTemplateType === 'AUTO');
    setParamsShow(HeadDS.current.data.saleTemplateType === 'AUTO');
    setRangeShow(HeadDS.current.data.saleTemplateType === 'AUTO');
    ParamsDS.setQueryParameter('saleTemplateId', saleTemplateId);
    ParamsDS.query();
    if (HeadDS.current.data.saleTemplateType === 'AUTO') {
      SaleItemRelDS.setQueryParameter('saleTemplateId', saleTemplateId); // 其他DS设置查询参数
      EntityItemRelDS.setQueryParameter('saleTemplateId', saleTemplateId);
      await SaleItemRelDS.query(); // 查询
      await EntityItemRelDS.query(); // 查询
    }
    // HeadDS.create({})
  }

  async function handleSave(status) {
    // 校验  异步请求dataSet的方法(回调函数validate)进行校验  对headDS中设置了校验的字段进行校验,以及判断是否必填未填
    let validateSaleEntity = true;
    if (status === 'RUNNING') {
      // DS.current相当于表格中的当前行,有些不是的话就直接DS.data / DS.toData()拿数据就好了
      if (EntityItemRelDS.toData().length === 0 || SaleItemRelDS.toData().length === 0) {
        validateSaleEntity = false;
      }
    }
    // current 当前DS
    const validateValue = await HeadDS.current.validate(true, false); // 第一个参数为检测所有添加了validate属性的字段
    let validateValueParams;
    if (robotShow) {
      // console.log(ParamsDS);
      validateValueParams = await ParamsDS.current.validate(false, false); // 智能预测运行参数的校验
    }
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }
    if (robotShow && !(validateValue && validateValueParams)) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法喔！',
      });
      return;
    }
    if (robotShow && !validateSaleEntity && status === 'RUNNING') {
      notification.error({
        message: '请补充预测物料以及销售实体后再提交！',
      });
      return;
    }
    // 根据type参数和保存/提交定义API的名称
    let apiName;
    if (status === 'NEW') {
      apiName = type === 'create' ? 'createSaleTemplates' : 'saleTemplates';
    } else if (status === 'RUNNING') {
      apiName = type === 'create' ? 'createSaleTemplates' : 'saleTemplates';
    }
    return new Promise(async (resolve) => {
      // DS对象  current获取DS中所有的值(记录)  toData() 转换成普通数据(不包括删除的数据)
      const headers = HeadDS.current.toData();
      let paramsds;
      if (robotShow) {
        paramsds = ParamsDS.current.toData();
      }
      // const 为常量局部变量只存在于if中 所以要用let先声明,再复赋值
      const obj = {
        ...headers,
        ...paramsds,
        saleTemplateStatus: status,
      };
      const params = type === 'create' ? obj : [obj];
      // dispatch调用接口  services中编写接口,在models中引入
      dispatch({
        type: `saleTemplateModel/${apiName}`,
        payload: params,
      }).then(async (res) => {
        // 判断res状态 深层次对象外询->内询
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          // 将任务ID赋值给id变量
          let id;
          if (type === 'create') {
            id = res.saleTemplateId;
          } else {
            id = res[0].saleTemplateId;
          }
          // 如果是保存就是/detail加上id的路由
          const pathName =
            status === 'RUNNING'
              ? `/zplan/sale-prediction-task`
              : `/zplan/sale-prediction-task/detail/${id}`;

          if (type === 'create' || status === 'RUNNING') {
            // 如果是新建/保存并提交
            // 这是前端路由跳转吗?
            history.push({
              pathname: pathName,
              state: {
                status,
              },
            });
            resolve();
            return;
          }
          handleSearch();
        }
        resolve();
      });
    });
  }

  function handleSure(obj) {
    const { itemCode, itemId } = SaleItemRelDS.current.toData();
    SaleItemRelDS.current.set('itemAttr', {
      ...SaleItemRelDS.current.toData(),
      ...obj,
      itemId,
      itemCode,
    });
  }

  function handleLineCreate() {
    const { saleTemplateNum } = HeadDS.current.toData();

    const ds = currentTab === 'item' ? SaleItemRelDS : EntityItemRelDS;
    ds.create({
      saleTemplateId,
      saleTemplateNum,
    });
  }

  function handleTabChange(key) {
    // if(type === 'create'){
    //   return;
    // }
    currentTab = key;
    const ds = key === 'item' ? SaleItemRelDS : EntityItemRelDS;
    ds.query();
  }

  function handleLineDelete() {
    const ds = currentTab === 'item' ? SaleItemRelDS : EntityItemRelDS;
    if (!ds.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    ds.delete(ds.selected);
  }

  const columns = [
    {
      name: 'itemObj',
      width: 150,
      align: 'center',
      // editor 是否可编辑 值为判断条件
      editor: () => HeadDS.current.get('saleTemplateStatus') === 'NEW',
    },
    {
      name: 'itemAttr',
      width: 150,
      align: 'center',
      renderer: ({ record, value }) => {
        return (
          <ItemAttributeSelect
            data={value}
            handleSure={handleSure}
            itemId={record.get('itemId')}
            itemDesc={record.get('itemDesc')}
            disabled={!record.editing || HeadDS.current.get('saleTemplateStatus') !== 'NEW'}
          />
        );
      },
    },
    {
      name: 'itemDesc',
      width: 150,
      align: 'center',
    },
    {
      header: '操作',
      lock: 'right',
      align: 'center',
      width: 120,
      // 加上这个就有操作的那两个按钮 相当于操作组件 保存即会调用transport里的create方法 取消则是将此条清空
      command: ['edit'],
    },
  ];

  const entitycolumns = [
    {
      name: 'salesEntityObj',
      width: 200,
      align: 'center',
      editor: () => HeadDS.current.get('saleTemplateStatus') === 'NEW',
    },
    {
      name: 'salesEntityName',
      align: 'center',
    },
    {
      header: '操作',
      lock: 'right',
      align: 'center',
      width: 120,
      command: ['edit'],
    },
  ];

  const operations = (
    <div>
      <Button
        className={styles['zplan-sales-task-darkbtn']}
        disabled={!canEdit || type === 'create'}
        color="primary"
      >
        自动获取
      </Button>
      <Button disabled={!canEdit || type === 'create'}>导入</Button>
      <Button disabled={!canEdit || type === 'create'}>导出</Button>
      <Button disabled={!canEdit || type === 'create'} onClick={handleLineDelete}>
        删除
      </Button>
      <Button
        className={styles['zplan-sales-task-darkbtn']}
        disabled={!canEdit || type === 'create'}
        icon="add"
        color="primary"
        onClick={handleLineCreate}
      >
        新建
      </Button>
    </div>
  );

  return (
    <Fragment>
      <Header
        backPath="/zplan/sale-prediction-task"
        title={
          type === 'create'
            ? intl.get(`${intlPrefix}.view.title.vmiMaterialsApplyCreate`).d('预测任务详情')
            : intl.get(`${intlPrefix}.view.title.vmiMaterialsApplyEdit`).d('预测任务详情')
        }
      >
        {canEdit && (
          <>
            <Button color="primary" onClick={() => handleSave('RUNNING')}>
              保存并提交
            </Button>
            <Button color="primary" onClick={() => handleSave('NEW')}>
              保存
            </Button>
          </>
        )}
      </Header>
      <Content className={styles['zplan-sales-template']}>
        <Form dataSet={HeadDS} columns={4} labelWidth={120}>
          <TextField name="saleTemplateNum" key="saleTemplateNum" disabled />
          <TextField name="saleTemplateName" key="saleTemplateName" disabled={!canEdit} />
          <Select name="saleTemplateStatus" key="saleTemplateStatus" disabled />
          <Select name="saleTemplateType" key="saleTemplateType" disabled={!canEdit} />
          <Lov name="userMessage" key="userMessage" disabled={!canEdit || robotShow} />
          <DateTimePicker
            name="predictionStartDate"
            key="predictionStartDate"
            disabled={!canEdit}
          />
          <TextField name="predictionGap" key="predictionGap" disabled={!canEdit} />
        </Form>
        {/* 显示隐藏 */}
        {robotShow && (
          <div className={styles['zcom-delivery-apply-info']}>
            <span>智能预测运行参数</span>
            <span
              className={styles['info-toggle']}
              onClick={() => {
                setParamsShow(!paramsShow);
              }}
            >
              {paramsShow ? (
                <span>
                  收起 <Icon className={styles['info-toggle-icon']} type="expand_more" />
                </span>
              ) : (
                <span>
                  展开 <Icon className={styles['info-toggle-icon']} type="expand_less" />
                </span>
              )}
            </span>
          </div>
        )}
        {paramsShow && (
          <Form dataSet={ParamsDS} columns={4} labelWidth={120}>
            <TextField name="lifecycleLength" key="lifecycleLength" disabled={!canEdit} />
            <DateTimePicker name="runStartDate" key="runStartDate" disabled={!canEdit} />
            <DateTimePicker name="runEndDate" key="runEndDate" disabled={!canEdit} />
            <TextField name="runGap" key="runGap" disabled={!canEdit} />
            <DateTimePicker name="lastRunDate" key="lastRunDate" disabled={!canEdit} />
            <DateTimePicker name="nextRunDate" key="nextRunDate" disabled={!canEdit} />
          </Form>
        )}
        {robotShow && (
          <div className={styles['zcom-delivery-apply-info']}>
            <span>智能预测范围</span>
            <span
              className={styles['info-toggle']}
              onClick={() => {
                setRangeShow(!rangeShow);
              }}
            >
              {rangeShow ? (
                <span>
                  收起 <Icon className={styles['info-toggle-icon']} type="expand_more" />
                </span>
              ) : (
                <span>
                  展开 <Icon className={styles['info-toggle-icon']} type="expand_less" />
                </span>
              )}
            </span>
          </div>
        )}
        {rangeShow && (
          // tab栏切换
          <Tabs
            defaultActiveKey={currentTab}
            // operation 在头部右边
            tabBarExtraContent={operations}
            onChange={handleTabChange}
          >
            <TabPane tab="预测物料" key="item" className={styles['zplan-plan-detail-table']}>
              {/* editMode="inline" 允许行内操作 */}
              <Table dataSet={SaleItemRelDS} columns={columns} editMode="inline" rowHeight="auto" />
            </TabPane>
            <TabPane tab="销售实体" key="sales" className={styles['zplan-plan-detail-table']}>
              <Table
                className={styles['zplan-sales-template-entity']}
                width={700}
                dataSet={EntityItemRelDS}
                columns={entitycolumns}
                editMode="inline"
                rowHeight="auto"
              />
            </TabPane>
          </Tabs>
        )}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZplanTimePredictionModel {...props} />;
});
