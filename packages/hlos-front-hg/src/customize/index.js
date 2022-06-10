import { setCard } from 'hzero-front/lib/customize/cards';

import { dynamicWrapper } from 'hzero-front-hmsg/lib/utils/router/utils';

setCard({
  code: 'HgMessage',
  component: async () =>
    dynamicWrapper(window.dvaApp, ['cards/message'], () => import('./Message')),
});
