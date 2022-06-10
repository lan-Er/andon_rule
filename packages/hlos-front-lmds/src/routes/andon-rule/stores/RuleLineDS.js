/**
 * @Description: 规则项管理信息--tableDS
 * @Author: wenhao.li<wenhao.li@zone-cloud.com>
 * @Date: 2021-10-30 16:33:09
 * @LastEditors: wenhao.li
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';


const { lmdsAndonRule, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.andonRule.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/andon-rule-lines`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'andonRankObj',
      type: 'object',
      label: intl.get(`${preCode}.andonRank`).d('安灯等级'),
      lovCode: lmdsAndonRule.andonRank,
      ignore: 'always',
      required: true,
      dynamicProps: ({ dataSet }) => {
        // 根据安灯规则的Organization对行表的安灯等级Lov进行组织限定
        const parentObj = dataSet.parent.current.data;
        let lovPara = {};
        if(!isEmpty(parentObj.organizationObj)){
          lovPara = {
            organizationId: parentObj.organizationObj.organizationId,
          };
        } else if(parentObj.organizationId) {
          lovPara = {
            organizationId: parentObj.organizationId,
          };
        }
        return {
          lovPara,
        };
      },
    },
    {
      name: 'andonRankId',
      type: 'string',
      bind: 'andonRankObj.andonRankId',
    },
    {
      name: 'andonRankName',
      type: 'string',
      bind: 'andonRankObj.andonRankName',
    },
    {
      name: 'relatedPositionObj',
      type: 'object',
      label: intl.get(`${preCode}.relatedPosition`).d('关联岗位'),
      lovCode: common.position,
      ignore: 'always',
      required: true,
    },
    {
      name: 'relatedPositionId',
      type: 'string',
      bind: 'relatedPositionObj.positionId',
    },
    {
      name: 'positionName',
      type: 'string',
      bind: 'relatedPositionObj.positionName',
    },
    {
      name: 'relatedUserObj',
      type: 'object',
      label: intl.get(`${preCode}.relatedUser`).d('关联用户'),
      lovCode: common.user,
      textField: 'loginName',
      ignore: 'always',
      required: true,
    },
    {
      name: 'relatedUserId',
      type: 'string',
      bind: 'relatedUserObj.id',
    },
    {
      name: 'realName',
      type: 'string',
      label: intl.get(`${preCode}.realName`).d('真实姓名'),
      bind: 'relatedUserObj.realName',
    },
    {
      name: 'userName',
      type: 'string',
      label: intl.get(`${preCode}.realName`).d('真实姓名'),
      bind: 'relatedUserObj.loginName',
    },
    {
      name: 'phoneNumber',
      type: 'string',
      label: intl.get(`${preCode}.phoneNumber`).d('电话'),
    },
    {
      name: 'email',
      type: 'email',
      label: intl.get(`${preCode}.email`).d('邮件'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    read: config => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
  events: {
    update: ({ record }) => {
      if(!isEmpty(record.get('relatedPositionObj'))) {
        record.fields.get('relatedUserObj').set('required', false);
      } else if(!isEmpty(record.get('relatedUserObj'))) {
        record.fields.get('relatedPositionObj').set('required', false);
      }
    },
  },
});
