/**
 * 图文教程管理DS
 * @since: 2020-07-09 10:45:03
 * @author: wei.zhou05@hand-china.com
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWHS } from 'hlos-front/lib/utils/config';

const preCode = 'lwhs.gtm.model';
const commonCode = 'lwhs.common.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LWHS}/v1/${organizationId}/imageTextCourse/getAllImageTextCourse`;

const GtmDS = {
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'POST',
      };
    },
  },
  pageSize: 10,
  selection: false,
  autoQuery: true,
  queryFields: [
    {
      name: 'title',
      type: 'string',
      label: intl.get(`${preCode}.title`).d('标题'),
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.categoryId`).d('所属分组'),
      ignore: 'always',
    },
    {
      name: 'categoryId',
      bind: 'categoryObj.value.id',
    },
  ],
  fields: [
    {
      name: 'coverAndTitle',
      type: 'object',
      label: intl.get(`${commonCode}.cover`).d('标题'),
    },
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${commonCode}.categoryName`).d('所属分组'),
    },
    // {
    //   name: 'title',
    //   type: 'string',
    //   label: intl.get(`${commonCode}.title`).d('标题'),
    // },
    // {
    //   name: 'author',
    //   type: 'string',
    //   label: intl.get(`${commonCode}.author`).d('作者'),
    // },
    {
      name: 'releaseDate',
      type: 'string',
      label: intl.get(`${commonCode}.releaseDate`).d('发布日期'),
    },
  ],
};

export { GtmDS };
