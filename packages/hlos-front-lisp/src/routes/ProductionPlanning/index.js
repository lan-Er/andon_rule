/*
 * @Description: 排产计划
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-08-04 17:02:19
 */

import React, { Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { Button, Table, DataSet, Form, Row, Col } from 'choerodon-ui/pro';

import { deliveryReplyDS, rowCombineArr } from '@/stores/productionPlanningDS';
import './index.less';
import redFlag from '../../assets/icons/red-flag.svg';
import ascIcon from '../../assets/supplierOrder/asc.svg';
import descIcon from '../../assets/supplierOrder/desc.svg';

const pDs = new DataSet(deliveryReplyDS());

class ProductionPlanning extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dateSort: true,
    };
  }

  componentDidMount() {
    // this.handleSort(this.state.dateSort);
  }

  // 排序
  handleSort = async (sort) => {
    pDs.setQueryParameter('finishTimeOrder', sort === false ? 1 : 0);
    pDs.setQueryParameter('field', 'date');
    await pDs.query();
    this.setState({
      dateSort: !this.state.dateSort,
    });
  };

  // table 列
  columns = () => {
    const _this = this;
    // const currentDateArr = [];
    return [
      {
        name: 'date',
        value: '日期',
        width: 120,
        align: 'center',
        onCell({ record }) {
          const { index } = record;
          const rowSpan = rowCombineArr[index];
          return {
            rowSpan,
            hidden: rowSpan === 0,
          };
        },
        header(dataset, name) {
          const field = dataset.getField(name);
          return (
            <div className="header-cell" onClick={() => _this.handleSort(_this.state.dateSort)}>
              <span>{field ? field.get('label') : ''}</span>
              <span className="sort">
                <img src={_this.state.dateSort ? ascIcon : descIcon} alt="order" />
              </span>
            </div>
          );
        },
      },
      {
        name: 'item&description',
        value: '物料',
        width: 150,
        align: 'center',
        tooltip: 'overflow',
        renderer({ record }) {
          return (
            <div className="prod">
              <div className="val">{record.get('item')}</div>
              <div className="desc">{record.get('description')}</div>
            </div>
          );
        },
      },
      {
        name: 'supplier',
        value: '供应商',
        width: 120,
        align: 'center',
        renderer: ({ value }) => (
          <Fragment>
            <img src={redFlag} alt="redFlag" style={{ marginRight: '6px' }} />
            {value}
          </Fragment>
        ),
      },
      {
        name: 'demandQty',
        value: '需求数量',
        width: 120,
        align: 'center',
      },
      {
        name: 'reportQty',
        value: '完工数量',
        width: 120,
        align: 'center',
      },
      {
        name: 'makingQty',
        value: '在制数量',
        width: 120,
        align: 'center',
      },
      {
        name: 'instockQty',
        value: '入库数量',
        width: 120,
        align: 'center',
      },
      {
        name: 'supplyQty',
        value: '供应数量',
        width: 120,
        align: 'center',
      },
      {
        name: 'processBar',
        value: '进度',
        width: 300,
        renderer: ({ record }) => {
          const total = record.get('demandQty');
          const supplyQty = (record.get('supplyQty') / total) * 100;
          const instockQty = (record.get('instockQty') / total) * 100;
          const reportQty = (record.get('reportQty') / total) * 100;
          const makingQty = (record.get('makingQty') / total) * 100;
          return (
            <div className="lisp-production-planning-progress">
              <p className="legend">
                <span>
                  <span className="circle finish" />
                  完工
                </span>
                <span>
                  <span className="circle making" />
                  在制
                </span>
                <span>
                  <span className="circle warehousing" />
                  入库
                </span>
                <span>
                  <span className="circle supply" />
                  供应
                </span>
              </p>
              <Row className="chart">
                <Col style={{ width: `${reportQty}%` }} className="finish" />
                <Col style={{ width: `${makingQty}%` }} className="making" />
                <Col style={{ width: `${instockQty}%` }} className="warehousing" />
                <Col style={{ width: `${supplyQty}%` }} className="supply" />
              </Row>
            </div>
          );
        },
      },
    ];
  };

  // renderBar
  renderBar = (props) => {
    const { queryFields, queryDataSet, queryFieldsLimit, dataSet } = props;
    if (queryDataSet) {
      return (
        <div className="ds-jc-between">
          <Form
            className="query-form"
            style={{ flex: 1 }}
            columns={queryFieldsLimit}
            dataSet={queryDataSet}
          >
            {queryFields}
            <div className="ds-jc-between">
              <Button
                color="primary"
                dataSet={null}
                onClick={() => {
                  dataSet.query();
                }}
              >
                筛选
              </Button>
              <Button onClick={() => queryDataSet.reset()}>重置</Button>
            </div>
          </Form>
        </div>
      );
    }
  };

  render() {
    return (
      <Fragment>
        <Header title="生产进度查询" />
        <Content>
          <div className="content">
            <Table
              dataSet={pDs}
              columns={this.columns()}
              border={false}
              columnResizable="true"
              rowHeight="auto"
              queryFieldsLimit={4}
            />
          </div>
        </Content>
      </Fragment>
    );
  }
}

export default ProductionPlanning;
