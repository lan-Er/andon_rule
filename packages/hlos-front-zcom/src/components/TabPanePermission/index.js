import React from 'react';
import PropTypes from 'prop-types';
import { Bind } from 'lodash-decorators';
import { Tabs } from 'choerodon-ui/pro';
import { PENDING } from 'components/Permission/Status';

const SUCCESS = 2;
const { TabPane } = Tabs;

export default class TabPanePermission extends React.Component {
  // 获取传递的context
  static contextTypes = {
    permission: PropTypes.object,
  };

  state = {
    status: PENDING,
    controllerType: 'hidden',
  };

  // 在 render 之前检查权限
  // eslint-disable-next-line
  componentDidMount() {
    const { permissionList } = this.props;
    if (permissionList !== undefined && Array.isArray(permissionList)) {
      this.check(this.props, this.context);
    }
  }

  /**
   * 调用 context 的 check
   * @param {object} props - 检查所需参数
   * @param {object} context - 上下文
   */
  @Bind()
  check(props, context) {
    const { permissionList = [] } = props;
    if (context.permission) {
      context.permission.check({ permissionList }, this.handlePermission);
    }
  }

  @Bind()
  handlePermission(status, controllerType = 'hidden') {
    this.setState({
      status,
      controllerType,
    });
    if (this.props.onControllerTyper) {
      this.props.onControllerTyper(controllerType);
    }
  }

  @Bind()
  extendProps() {
    const { status, controllerType } = this.state;
    const { permissionList, ...otherProps } = this.props;
    if (permissionList === undefined || !Array.isArray(permissionList)) {
      return <TabPane {...otherProps} />;
    }
    if (status === SUCCESS) {
      if (controllerType === 'hidden') {
        return null;
      } else {
        return <TabPane {...otherProps} />;
      }
    } else {
      return <TabPane {...otherProps} />;
    }
  }

  render() {
    return this.extendProps();
  }
}
