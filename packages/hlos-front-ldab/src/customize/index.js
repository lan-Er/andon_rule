/*
 * @module: 卡片开发
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-02 16:24:57
 * @LastEditTime: 2020-12-03 16:36:21
 * @copyright: Copyright (c) 2020,Hand
 */
import { setCard } from 'hzero-front/lib/customize/cards';

const myCardList = [
  { code: 'lingge', component: './PieCard/index.js' },
  { code: 'myLine', component: './LineCard/index.js' },
  { code: 'myScrollList', component: './ListScrollCard/index.js' },
  { code: 'histogram', component: './HistogramCard/index.js' },
];
for (let i = 0; i < myCardList.length; i++) {
  setCard({ code: myCardList[i].code, component: () => import(`${myCardList[i].component}`) });
}
