import React, { Fragment } from 'react';
import { Tooltip } from 'hzero-ui';
import classNames from 'classnames';

import { ORIGIN_ICON_NAME } from './Status';

import iconFont from './iconfont.css';

/**
 * Icons 组件 - 使用iconfont图标库
 * 图标的更新方式：
 * 1. 登录iconfont，添加图标，规范化图标的名称；
 * 2. 在图标项目中的Font Class中更新, 生成新的图标样式链接，例如：//at.alicdn.com/t/font_1089395_95h9j1chzts.css；
 * 3. 将 src/utils/icon.js 中的 aliUrl 属性替换为新的图标样式链接；
 * 4. 执行 yarn icon 命名下载图标文件
 * 5. 引入Icons组件，type属性值为除去公共后缀后的图标名称，
 * 比如，hzero-icon-edit，hzero-icon-是公共命名，edit是图标名称，
 * 所以，type="edit"
 * @author wangjiacheng <jiacheng.wang@hand-china.com>
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {!string} [type = ''] - 图标名称，例如 hzero-icon-edit, 取edit
 * @reactProps {?string} [size = ''] - 图标大小，默认以px为单位
 * @reactProps {?string} [color = ''] - 图标颜色，支持16进制或者rgb/rgba形式
 * @reactProps {?string} [className = ''] - class属性
 * @reactProps {?string} [title = ''] - tooltip提示文字，设置该属性将自动使用Tooltip
 * @reactProps {?object} [tipProps = {}] - Tooltip其余属性
 * @reactProps {?object} [style = {}] - style样式
 * @example
 * import Icons from 'components/Icons';
 *
 * <Icons type="edit" />
 */
export default class LKIcon extends React.Component {
  render() {
    const {
      type,
      title = '',
      size = '12',
      color = '',
      className = '',
      tipProps = {},
      style = {},
      ...rest
    } = this.props;
    return (
      <Fragment>
        {title ? (
          <Tooltip title={title} {...tipProps}>
            <i
              className={classNames({
                [iconFont[ORIGIN_ICON_NAME]]: true,
                [iconFont[`${ORIGIN_ICON_NAME}-${type}`]]: !!type,
              })}
              style={{
                fontSize: `${size}px`,
                color,
                ...style,
              }}
              {...rest}
            />
          </Tooltip>
        ) : (
          <i
            className={classNames({
              [iconFont[ORIGIN_ICON_NAME]]: true,
              [className]: !!className,
              [iconFont[`${ORIGIN_ICON_NAME}-${type}`]]: !!type,
            })}
            style={{
              fontSize: `${size}px`,
              color,
              ...style,
            }}
            {...rest}
          />
        )}
      </Fragment>
    );
  }
}
