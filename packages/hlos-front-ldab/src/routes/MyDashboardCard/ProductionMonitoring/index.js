/*
 * @module: 生产监控看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-04 14:59:38
 * @LastEditTime: 2020-12-07 11:11:49
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import RGL from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Card, Icon } from 'hzero-ui';
import { Bind, Debounce } from 'lodash-decorators';
// 可能会被其他页面当作组件使用, 所以需要这个注解注入 match
import { withRouter } from 'dva/router';

import { Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { DEBOUNCE_TIME } from 'utils/constants';

import { loadCardAsync, setCard } from 'hzero-front/lib/customize/cards';

import styles from './index.less';
import CardsSetting from './CardsSetting';

import DashboardHeader from '../DashboardHeader';
import FullScreenContainer from '../../../common/kanbanViewport/fullScreenContainer';

const ReactGridLayout = RGL;

// 将一样的不会变化的样式 抽取出来 放在最外面

const pageContentStyle = {
  padding: '0',
  margin: '0',
  backgroundColor: 'rgba(255, 255, 255, 0)',
};
const layoutContainerStyle = { position: 'relative', top: '0' };

@connect(({ cardWorkplace, loading, global = {} }) => ({
  cardWorkplace,
  loadAssignableCardsLoading: loading.effects['cardWorkplace/fetchCards'],
  activeTabKey: global.activeTabKey,
}))
@withRouter
@formatterCollections({ code: ['hzero.workplace'] })
export default class MyDashboardCard extends React.Component {
  static defaultProps = {
    className: styles.gridLayoutContainer,
    cols: 20,
    rowHeight: 28,
  };

  static propTypes = {
    className: PropTypes.string,
    cols: PropTypes.number,
    rowHeight: PropTypes.number,
  };

  initCards = {}; // 初始化的卡片, {[code: string]: card}; // 存储初始化的卡片

  constructor(props) {
    super(props);
    // 存储进入设计状态之前的 layout
    this.state = {
      modalVisible: false, // 编辑状态是否可见
      loading: true, //
      setting: false, // 设计状态
      layout: [], // 现有的布局数据
      cards: [], // 现有的布局 对应的 组件
      currentCards: [], // 当前布局内卡片的原始数据
    };

    this.originLayout = null;
    this.originCurrentCards = null;
    this.mounted = false; // 表示组件是否加载
    const { cardsConfig = [] } = props;
    cardsConfig.forEach((cardConfig) => {
      setCard(cardConfig);
    });
  }

  componentDidMount() {
    // this.loadCards(this.fetchLayout());
    const { dispatch } = this.props;
    dispatch({
      type: 'cardWorkplace/fetchLayoutAndInit',
    }).then((res) => {
      if (res) {
        this.setState({
          currentCards: res,
        });
        this.loadCards(
          res.map((card) => {
            const { cardId, ...rest } = card;
            if (card.initFlag === 1) {
              this.initCards[String(cardId)] = card;
            }
            return { ...rest, i: String(cardId) };
          })
        );
      }
    });
    this.mounted = true;
    // 监听 windowResize
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  }

  componentWillUnmount() {
    this.mounted = false;
    // 移除监听 windowResize
    window.removeEventListener('resize', this.handleWindowResize);
    this.handleWindowResize.cancel();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.needUpdateWidth) {
      this.needUpdateWidth = false;
      this.handleWindowResize();
    }
  }

  /**
   * 是 初始化卡片
   * @param {string} cardId - 卡片Id
   */
  @Bind()
  isInitCard(cardId) {
    return !!this.initCards[cardId];
  }

  /**
   * window resize 后 重新设置宽度
   */
  @Debounce(DEBOUNCE_TIME)
  @Bind()
  handleWindowResize() {
    if (!this.mounted) {
      // 如果组件没有在组件树中, 则不重新设置宽度
      return;
    }
    const {
      match: { path },
      activeTabKey,
    } = this.props;
    if (path !== activeTabKey) {
      // 如果当前 tab 页 不是本页面, 则不更新 width, 但是要设置 标志, 在 DidUpdate 中更新
      this.needUpdateWidth = true;
      return;
    }
    // eslint-disable-next-line
    const node = ReactDOM.findDOMNode(this); // Flow casts this to Text | Element
    if (node instanceof HTMLElement) {
      this.setState({ width: node.offsetWidth });
    }
  }

  renderCard() {
    const { setting = false, cards = [] } = this.state;
    return cards.map((item) => {
      // TODO: GridItem need width
      if (setting === true) {
        return (
          <div key={item.name}>
            {item.component}
            <div className={styles.dragCard} />
            {!this.isInitCard(item.name) && (
              <Icon
                type="close"
                className={styles.closeBtn}
                onClick={() => {
                  this.handleRemoveCard(item.name);
                }}
              />
            )}
          </div>
        );
      }
      return (
        <div key={item.name} className={styles.boxShadow}>
          {item.component}
        </div>
      );
    });
  }

  /**
   * layout 改变的回调
   */
  @Bind()
  onLayoutChange(layout) {
    // 现在错误的 卡片也会占一个位置了
    // if (layout.length === 1 && layout[0].name === 'error') return;
    this.setState({
      layout,
    });
  }

  /**
   * 加载单独的卡片组件, 失败返回 失败的Card
   * @param {string} cardCode - 卡片代码
   * @return {React.Component|null}
   */
  async importCard(cardCode) {
    let loadCard = null;
    try {
      loadCard = await loadCardAsync(cardCode);
    } catch (e) {
      loadCard = null;
    }
    return loadCard;
  }

  /**
   * 加载所有的卡片组件
   */
  async importCards(...cardCodes) {
    return Promise.all(cardCodes.map((cardCode) => this.importCard(cardCode)));
  }

  /**
   * 查找id相同的card
   * @param {string} i
   */
  @Bind()
  getCard(i, flag) {
    const { currentCards } = this.state;
    return !flag
      ? currentCards.find((n) => String(n.cardId) === i)
      : this.originCurrentCards.find((n) => String(n.cardId) === i);
  }

  /**
   * 将 卡片 加载成 layout
   */
  @Bind()
  loadCards(layouts = [], flag) {
    const layout = layouts;
    let cards = [];
    this.importCards(...layout.map((c) => this.getCard(c.i, flag).code))
      .then((cmps) => {
        cards = layout.map((card, index) => {
          const data = this.getCard(card.i);
          const cmp = cmps[index];
          if (cmp) {
            if (cmp.__esModule) {
              const WorkplaceCard = cmp.default;
              return {
                name: card.i,
                component: <WorkplaceCard cardParams={data.cardParams} name={data.name} />,
              };
            }
            const WorkplaceCard = cmp;
            return {
              name: card.i,
              component: <WorkplaceCard cardParams={data.cardParams} name={data.name} />,
            };
          }
          return {
            name: card.i,
            component: <Card loading />,
          };
        });
      })
      .finally(() => {
        this.setState({
          loading: false,
          layout,
          cards,
        });
      });
  }

  /**
   * 移除指定 id 的卡片
   */
  @Bind()
  handleRemoveCard(id) {
    const { layout = [], currentCards = [] } = this.state;
    const layouts = layout.filter((l) => l.i !== id);
    const cards = currentCards.filter((l) => l.cardId !== id);
    if (layouts.length === layout.length) {
      // 已经移除了 不要重复移除
      // FIXME: 是否在 CardsSetting 中判断
    }
    this.setState(
      {
        currentCards: cards,
      },
      () => {
        this.loadCards(layouts);
      }
    );
  }

  @Bind()
  handleAddCard(card) {
    const { layout = [], currentCards = [] } = this.state;
    const { cardId } = card;
    if (layout.some((l) => l.i === String(cardId))) {
      // 已经添加了 不要重复添加
      // FIXME: 是否在 CardsSetting 中判断
      return;
    }
    const layouts = [
      ...layout,
      {
        ...card,
        i: String(cardId),
      },
    ];
    currentCards.push(card);
    this.setState(
      {
        currentCards,
      },
      () => {
        this.loadCards(layouts);
      }
    );
  }

  /**
   * 关闭卡片设置页面
   */
  @Bind()
  hideModal() {
    this.setState({
      modalVisible: false,
    });
  }

  /**
   * 加载可以分配的卡片
   */
  @Bind()
  loadAssignableCards() {
    const {
      dispatch,
      prevRoleCards: { roleCards },
    } = this.props;
    return dispatch({
      type: 'cardWorkplace/fetchCards',
      payload: {
        roleCards,
      },
    });
  }

  render() {
    console.log(this.props, 'props');
    const {
      cardWorkplace: { prevRoleCards, roleCards = [], catalogType = [] },
      loadAssignableCardsLoading,
    } = this.props;
    const {
      setting = false,
      layout = [],
      loading = true,
      modalVisible = false,
      width,
    } = this.state;
    const allCards = this.renderCard();
    const reactGridLayoutProps = {};
    if (width) {
      reactGridLayoutProps.width = width;
    }

    return (
      <FullScreenContainer>
        <div style={{ height: '100vh', backgroundColor: '#182534' }}>
          <DashboardHeader title="发货任务看板" history={this.props.history} />
          <Content noCard style={pageContentStyle}>
            {loading === true ? (
              <Card loading />
            ) : (
              <ReactGridLayout
                {...reactGridLayoutProps}
                style={layoutContainerStyle}
                layout={layout}
                className={styles.gridLayoutContainer}
                isDraggable={setting}
                isResizable={setting}
                cols={120}
                rowHeight={1}
                margin={[0, 12]}
                onLayoutChange={this.onLayoutChange}
              >
                {allCards}
              </ReactGridLayout>
            )}
            <CardsSetting
              loading={loadAssignableCardsLoading}
              loadAssignableCards={this.loadAssignableCards}
              onRemoveCard={this.handleRemoveCard}
              onAddCard={this.handleAddCard}
              onCancel={this.hideModal}
              loadCards={this.loadCards}
              prevRoleCards={prevRoleCards}
              roleCards={roleCards}
              visible={modalVisible}
              layout={layout}
              catalogType={catalogType}
              isInitCard={this.isInitCard}
              getCard={this.getCard}
            />
          </Content>
        </div>
      </FullScreenContainer>
    );
  }
}
