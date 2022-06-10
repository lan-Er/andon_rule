import React from 'react';
import { OrderView, OrderChart, TroubleOrder, ReturnChart } from './components';
import './index.less';

export default function OrderOverview({ customer }) {
  return (
    <div className="view-order-overview">
      <OrderView customer={customer} />
      <OrderChart customer={customer} />
      <TroubleOrder customer={customer} />
      <ReturnChart customer={customer} />
    </div>
  );
}
