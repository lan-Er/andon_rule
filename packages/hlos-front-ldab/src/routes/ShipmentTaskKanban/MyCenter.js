/*
 * @module-: 中间部分内容
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-06 09:49:04
 * @LastEditTime: 2020-11-24 14:29:01
 * @copyright: Copyright (c) 2018,Hand
 */
import ReactEcharts from 'echarts-for-react';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import keyUserImg from 'hlos-front/lib/assets/key-user.png';
import style from './index.module.less';
import MyBr from './components/MyBr';

let timer = null;
let timerCenterLeft = null;
export default function MyCenter({ leftList, rightPie, getLeft, getRight }) {
  const centerNode = useRef(null);
  const mainNode = useRef(null);
  const ulList = useRef(null);
  const myPie = useRef(null);
  const [actualParentHeight, setActualParentHeight] = useState(0);
  const [pieHeight, setPieHeight] = useState(0);
  const [rightPieList, setRightPieList] = useState([{}]);
  const leftUpdate = useMemo(() => leftList, [leftList]);
  const newRightPie = useMemo(() => rightPie, [rightPie]);
  const [loading, setLoading] = useState(false);

  leftUpdate.forEach((item, index) => {
    return Object.assign(item, { key: index });
  });
  useEffect(() => {
    const { current } = centerNode;
    const domHeight = current.offsetHeight;
    const parentHeightAll = mainNode && mainNode.current.offsetHeight;
    const actualParentHeights = parentHeightAll - 100; // 滚动视窗高度
    const newPieList = [
      { name: '已发货', value: newRightPie.executeOrderQty },
      { name: '未发货', value: newRightPie.unExecuteOrderQty },
    ];
    setRightPieList(newPieList);
    setActualParentHeight(actualParentHeights);
    setPieHeight(actualParentHeights + 28);
    myPie.current.style.height = `${pieHeight}px`;
    ulList.current.style.overflow = 'hidden';
    handleChangeSize();
    current.style.zIndex = 2;
    if (actualParentHeight < domHeight && !loading) {
      scrollList(actualParentHeights);
    } else {
      handleDelayGetList();
    }
  }, [centerNode, leftUpdate, myPie, rightPie, actualParentHeight, pieHeight, loading]);

  useEffect(() => {
    window.addEventListener('resize', handleChangeSize);
    return () => handleClear();
  }, []);

  /**
   *当左侧数据没有滚动时候
   *
   */
  function handleDelayGetList() {
    clearInterval(timerCenterLeft);
    timerCenterLeft = setInterval(() => {
      setLoading(true);
      Promise.all([getRight(), getLeft()])
        .then(() => setLoading(false))
        .catch((err) => console.log(err));
    }, 1000 * 60);
  }
  /**
   *清除副作用
   *
   */
  function handleClear() {
    clearInterval(timer);
    clearInterval(timerCenterLeft);
    window.removeEventListener('resize', handleChangeSize);
  }

  /**
   *缩放窗口时候自适应
   *
   */
  function handleChangeSize() {
    const actualHeight = actualParentHeight || mainNode.current.offsetHeight - 100;
    ulList.current.style.height = `${actualHeight}px`;
    setActualParentHeight(actualHeight);
  }
  /**
   *滚动操作
   *
   */
  function scrollList(domHeight) {
    const { current } = centerNode;
    current.style.top = `${actualParentHeight}px`;
    let top = Number(domHeight) || 0;
    clearInterval(timer);
    timer = setInterval(() => {
      if (-top > current.offsetHeight && !loading) {
        current.style.top = `${actualParentHeight}px`;
        clearInterval(timer);
        setLoading(true);
        Promise.all([getRight(), getLeft()])
          .then(() => {
            setLoading(false);
            if (centerNode.current.offsetHeight < mainNode.current.offsetHeight - 100) {
              centerNode.current.style.top = '0px';
            }
          })
          .catch((err) => console.log(err));
      } else {
        top -= 1;
        current.style.top = `${top}px`;
      }
    }, 2000 / 60);
  }
  const color = [
    {
      type: 'conic',
      x: 0,
      y: 0,
      x2: 1,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: 'rgba(117,235,173, 0.9)',
        },
        {
          offset: 1,
          color: 'rgba(71,134,177, 0.8)',
        },
      ],
      global: false,
    },
    'rgba(110, 216, 166, 0.31)',
  ];
  // 这步主要是为了让小圆点的颜色和饼状图的块对应，如果圆点的颜色是统一的，只需要把itemStyle写在series里面
  const setLabel = (dataList) => {
    const opts = [];
    for (let i = 0; i < dataList.length; i++) {
      const item = {};
      item.name = dataList[i].name;
      item.value = dataList[i].value;
      item.label = {
        normal: {
          // 控制引导线上文字颜色和位置,此处a是显示文字区域，b做一个小圆圈在引导线尾部显示
          show: true,
          // a和b来识别不同的文字区域
          formatter: [
            '{a|{d}%  {b}}', // 引导线上面文字
            '{b|}', // 引导线下面文字
          ].join('\n'), // 用\n来换行
          rich: {
            a: {
              left: 20,
              padding: [0, -30, -5, -30],
              color: '#fff',
            },
            // b: {
            //   height: 5,
            //   width: 5,
            //   lineHeight: 5,
            //   marginBottom: 10,
            //   padding: [0, -5],
            //   borderRadius: 5,
            //   backgroundColor: color[i], // 圆点颜色和饼图块状颜色一致
            // },
          },
        },
      };

      opts.push(item);
    }
    return opts;
  };

  const option = () => {
    return {
      animation: true,
      series: [
        {
          color,
          name: '饼图圆点',
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: true,
          labelLine: {
            normal: {
              show: true,
              length: 10, // 第一段线 长度
              length2: 30, // 第二段线 长度
              align: 'left',
            },
            emphasis: {
              show: true,
            },
          },
          data: setLabel(rightPieList),
        },
      ],
    };
  };
  return (
    <div className={style['my-center-list']}>
      <div
        className={style['my-center-left']}
        ref={(node) => {
          mainNode.current = node;
        }}
      >
        <MyBr title="待拣概况" />
        <div className={style['center-left-table']}>
          <ul>
            <li className={style['center-left-table-title']}>
              <span>物料</span>
              <span>来源仓库</span>
              <span>客户</span>
              <span>目标地址</span>
              <span>待拣数</span>
            </li>
          </ul>
          <ul
            ref={(node) => {
              ulList.current = node;
            }}
          >
            <div
              ref={(node) => {
                centerNode.current = node;
              }}
            >
              {leftUpdate &&
                leftUpdate.map((item) => {
                  return (
                    <li key={item.key}>
                      <span>
                        {item.itemCode}-{item.description}
                      </span>
                      <span>{item.warehouseName}</span>
                      <span>
                        {item.customerRank === 'A' ? <img src={keyUserImg} alt="关键" /> : null}{' '}
                        {item.customerName}
                      </span>
                      <span>{item.customerAddress}</span>
                      <span>
                        {item.applyQty} {item.uomName}
                      </span>
                    </li>
                  );
                })}
            </div>
          </ul>
        </div>
      </div>
      <div
        className={style['my-center-right']}
        ref={(node) => {
          myPie.current = node;
        }}
      >
        <MyBr title="发货单概况" />
        <div className={style['center-right-pie-chart']}>
          <div className={style['my-pie-out']}>
            <ReactEcharts
              style={{
                height: '100%',
                width: '100%',
              }}
              option={option()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
