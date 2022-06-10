import React from 'react';
import PropTypes from 'prop-types';
import { Bind } from 'lodash-decorators';
import { Lov } from 'choerodon-ui/pro';
import request from 'utils/request';
import { PENDING, SUCCESS } from 'components/Permission/Status';

export default class LovPermission extends React.Component {
  // 获取传递的context
  static contextTypes = {
    permission: PropTypes.object,
  };

  state = {
    status: PENDING,
    controllerType: 'disabled',
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
  handlePermission(status, controllerType = 'disabled') {
    this.setState({
      status,
      controllerType,
    });
    if (this.props.onPermissionStatus) {
      this.props.onPermissionStatus(status);
    }
  }

  @Bind()
  async extraSet(ds, name, attr) {
    const { onChange } = this.props;
    if (attr.limit) {
      ds.fields.get(name).set('dynamicProps', {
        lovPara: ({ record }) => ({
          [attr.limit]: record.get(attr.limit),
        }),
      });
    }
    if (attr.defaultValue) {
      if (!this.props.isCreate) return;
      const codeAttr = Object.keys(attr.defaultValue).filter((i) => i.substr(-4, 4) === 'Code')[0];
      if (attr.defaultValue.url) {
        const res = await request(attr.defaultValue.url, {
          method: 'GET',
          query: {
            [codeAttr]: attr.defaultValue[codeAttr],
          },
        });
        if (res && res.content && res.content[0]) {
          ds.current.set(name, res.content[0]);
        }
        if (onChange) {
          onChange(res.content[0]);
        }
      }
    }
  }

  @Bind()
  extendProps() {
    const { permissionList, dataSet, extraAttr, ...otherProps } = this.props;
    const { status, controllerType } = this.state;
    if (permissionList === undefined || !Array.isArray(permissionList)) {
      return <Lov {...otherProps} />;
    }
    if (status === SUCCESS) {
      if (controllerType === 'disabled') {
        return <Lov {...otherProps} disabled />;
      } else {
        // approved=true，则controllerType=disabled则禁用，其他，则不控制
        this.extraSet(dataSet, otherProps.name, extraAttr);
        return <Lov {...otherProps} />;
      }
    } else {
      return <Lov {...otherProps} />;
    }
  }

  render() {
    return this.extendProps();
  }
}
