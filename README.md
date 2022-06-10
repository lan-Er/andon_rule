`hzero-front`

---

## Online Dev

[在线 Dev](https://zones.saas.onestep-cloud/workplace)

## 使用

### 安装
```bash
lerna bootstrap 
yarn run transpile
```
> 注意:  
> 1. 执行完 lerna bootstrap 会在 node_modules 下面生成一个 hlos-front 的软链接，链接指向 packages/hlos-front  
> 2. 所以在其他子模块里面可以直接引用 hlos-front 模块的文件， 可以把 hlos-front 看成一个公共依赖  
> 3. 执行完 lerna run transpile 之后会生成 packages/hlos-front/lib 文件夹, 模块之间的相互依赖都是通过 lib 目录暴露出去的，如果 lib 文件的代码更新了 ,改动的代码才会生效  
> 4. 注意 dll 不存在时， hzero-cli 会自动帮你执行 `yarn run build:dll` ,但是如果你的 npm 依赖更新了 想刷新 dll ，需要手动运行一次 `yarn run build:dll`  
> 5. 修改了 PUBLIC_URL 环境变量之后, 由于 `src/config/theme.js` 中的数据会直接编译到 dll，影响 dll 内容, 所以如果想更新 dll 中的 PUBLIC_URL, 需要重新运行 `yarn build:dll`
> 6. 如果你想开发调试时能调试 dva、redux, dll 文件 能显示 sourcemap , 需要手动执行一次 `yarn run build:dll-dev`  

### 多环境环境变量配置文件

环境变量配置文件: 

- `src/config/.env.yml`: 默认环境变量配置文件
- `src/config/.env.${NODE_PROFILE}.yml`: 根据环境变量 NODE_PROFILE 的值切换配置文件, 比如当 NODE_PROFILE=development 时, .env.development.yml 会生效, 该文件的优先级比 .env.yml 高。
- `src/config/.env.${NODE_PROFILE}.local.yml`: 本地环境变量, 优先级最高的配置文件, 该配置文件不会进入 git 的版本管理。
- `packages/xxx/src/config/.env.yml`: 子模块独立默认环境变量配置文件，优先级比父模块高，但是只会影响当前子模块

环境变量说明:


- `API_HOST`: 后端接口地址。
- `BASE_PATH`: 浏览器地址栏显示的一级BASE_PATH
- `PUBLIC_URL`: 静态资源加载前缀。
- `PACKAGE_PUBLIC_URL`: 加载独立部署的子模块路径。
- `SKIP_TS_CHECK_IN_START`: [true|false] yarn start 时, 是否跳过 ts 语法检查。
- `SKIP_ESLINT_CHECK_IN_START`: [true|false] yarn start 时, 是否跳过 eslint 语法检查。
- `SKIP_NO_CHANGE_MODULE`: 是否跳过未变更的子模块编译
- `DISABLE_BUILD_DLL`: [true|false] 是否不使用 dll
- `NO_PROXY`: [true|false] 是否不开启 mock 接口
- `GENERATE_SOURCEMAP`: [true|false] 是否生成 sourcemap
- `CUSTOMIZE_ICON_NAME`: [自定义字体](http://hzerodoc.saas.hand-china.com/zh/docs/development-guide/front-develop-guid/component/icons/)
- `TRACE_LOG_ENABLE`: [true|false] 启用 TraceLog 日志追溯分析
- `IM_ENABLE`: [true|false] 是否启用 IM
- `IM_WEBSOCKET_HOST`: im 服务 websocket 地址
- `WEBSOCKET_HOST`: 消息通知服务 websocket 地址
- `BUILD_PUBLIC_MS`: [true|false] 是否编译外部模块
- `BUILD_DIST_PATH`: [string] 指定 dist 输出目录
- `BUILD_SKIP_PARENT`: [true|false] 强制跳过父工程编译
- `FORCE_PROD_DLL`: [true|false] 强制使用 Prod Dll

> `BASE_PATH 和` `PUBLIC_URL` 建议设置成一样的，如果是开发环境（`yarn start`）,必须设置为 `/`。

### hzero-boot 运行环境配置文件

- 配置文件位置可以通过 alias `hzero-boot-customize-init-config` 指定。示例：
  ```js
  const paths = require('hzero-webpack-scripts/config/paths');
  const path = require('path');

  module.exports = {
    'hzero-boot-customize-init-config': `${path.resolve(paths.appRootPath, './src')}/config/customize`
  };
  ```

- `packages/xxx-common/src/config/customize`: hzero 全局配置文件示例：

  ```typescript
  
  ```
  
- 配置文件位置可以通过 alias `hzero-boot-customize-init-config` 指定。示例：
  ```js
  const paths = require('hzero-webpack-scripts/config/paths');
  const path = require('path');

  module.exports = {
    'hzero-boot-customize-init-config': `${path.resolve(paths.appRootPath, './src')}/config/customize`
  };
  ```

- `packages/xxx-common/src/config/customize`: hzero 全局配置文件示例：

  ```typescript
  import { overWriteConfig } from 'hzero-boot';
  import { getConfig } from 'choerodon-ui';
  import { AxiosStatic } from 'axios';
  // import commonConfig from '../commonConfig';

  overWriteConfig({
    // 全局错误处理配置
    dealGlobalError: (error) => {
      // window.location.href = `${commonConfig.BASE_PATH || '/'}error.html?errorMessage=${encodeURIComponent(
      //   error && error.message
      // )}&errorLocation=${encodeURIComponent(window.location.href)}`;
      console.error(error);
    },
    // 在这个文件内可以重新 c7nUi 配置
    initC7nUiConfig: () => {
        return require('hzero-front/lib/utils/c7nUiConfig');
    },
    // 在 dva 对象实例化之后调用，可以在这里添加 dva 插件
    dvaAppInit: (dvaApp) => {
      const axios: AxiosStatic = getConfig('axios');
      axios.interceptors.response.use(
          config => config,
          (error) => {
              return Promise.reject(error);
          }
      )
    },
    // 可以设置 dvaApp.router 的根路由
    dvaRootRouter: () => require('hzero-front/lib/router').default,
    // 可以替换 global 配置
    globalModal: () => require('./models/global').default,
  });
  
  ```
### 开发

开发两种方案

1. 单模块启动: 本地编译调试速度快
2. 全模块启动: 适合做集成测试

#### 1. 单模块启动

```bash
cd packages/hlos-front-lisp
yarn run start
```

#### 2. 全模块启动

```bash
yarn run build:ms # 编译子模块
yarn run start
```
> 如果在父项目运行的话 ，第一次 `yarn start`,  是不会有页面的
> 需要运行一遍 `yarn run build:ms`， 再运行 `yarn start` 可以有页面
> 子模块代码变更之后需要重新编译到父模块（运行 `yarn run build:ms [子模块名]`）， 父模块启动时才会看到最新的子模块内容

### 打包

```bash
#!/usr/bin/env bash

# jenkins 脚本文件

set -e # 报错不继续执行

export BASE_PATH=BUILD_BASE_PATH
export API_HOST=BUILD_API_HOST
export CLIENT_ID=BUILD_CLIENT_ID
export WEBSOCKET_HOST=BUILD_WEBSOCKET_HOST
export PLATFORM_VERSION=BUILD_PLATFORM_VERSION
export BPM_HOST=BUILD_BPM_HOST
export IM_ENABLE=BUILD_IM_ENABLE

# $UPDATE_MICRO_MODULES UPDATE_MICRO_MODULES 变量如果存在值的话就 增量更新微前端子模块。

if  [[ $UPDATE_MICRO_MODULES =~ "ALL" ]] || [[ ! -n "$UPDATE_MICRO_MODULES" ]] ;then
    rm -rf yarn.lock
    yarn install
    yarn build:production
else
    echo 增量编译子模块 $UPDATE_MICRO_MODULES
    yarn run build:ms $UPDATE_MICRO_MODULES
fi

rm -rf ./html
cp -r ./dist ./html

export BUILD_BASE_PATH=/
export BUILD_PUBLIC_URL=/
export BUILD_API_HOST=https://zoneda.onestep-cloud.com
export BUILD_CLIENT_ID=localhost
export BUILD_WFP_EDITOR=""
export BUILD_WEBSOCKET_HOST=https://zoneda.onestep-cloud.com/hpfm/sock-js
export BUILD_PLATFORM_VERSION=SAAS
export BUILD_BPM_HOST=https://zoneda.onestep-cloud.com
export BUILD_IM_ENABLE=false
export BUILD_IM_WEBSOCKET_HOST=ws://im.hlosdev.onestep-cloud.com

find ./html -name '*.js' | xargs sed -i "s BUILD_BASE_PATH $BUILD_BASE_PATH g"
find ./html -name '*.css' | xargs sed -i "s /BUILD_PUBLIC_URL/ $BUILD_PUBLIC_URL g"
find ./html -name '*.js' | xargs sed -i "s /BUILD_PUBLIC_URL/ $BUILD_PUBLIC_URL g"
find ./html -name '*.html' | xargs sed -i "s /BUILD_PUBLIC_URL/ $BUILD_PUBLIC_URL g"
find ./html -name '*.js' | xargs sed -i "s BUILD_API_HOST $BUILD_API_HOST g"
find ./html -name '*.js' | xargs sed -i "s BUILD_CLIENT_ID $BUILD_CLIENT_ID g"
find ./html -name '*.js' | xargs sed -i "s BUILD_BPM_HOST $BUILD_BPM_HOST g"
find ./html -name '*.js' | xargs sed -i "s BUILD_WFP_EDITOR $BUILD_WFP_EDITOR g"
find ./html -name '*.js' | xargs sed -i "s BUILD_WEBSOCKET_HOST $BUILD_WEBSOCKET_HOST g"
find ./html -name '*.js' | xargs sed -i "s BUILD_PLATFORM_VERSION $BUILD_PLATFORM_VERSION g"

# 这里实现你的部署逻辑 deploy ./html

# export CICD_EXECUTION_SEQUENCE=${BUILD_NUMBER:-1}
# docker build . -t  hzero-front-sample:${CICD_EXECUTION_SEQUENCE}
# docker rm -f hzero-front-sample 2>/dev/null
# docker run --rm -it --name hzero-front-sample hzero-front-sample:${CICD_EXECUTION_SEQUENCE}

npx serve html -s # 或者 npx http-server html -P 测试本地打包的文件

```

### 发布

运行完打包之后 html 就是需要发布的文件，放到 nginx 的 html 目录下，然后配置 nginx 即可运行

#### NGINX 配置

```
   user  nginx;
    worker_processes  1;

    error_log  /var/log/nginx/error.log warn;
    pid        /var/run/nginx.pid;


    events {
        worker_connections  1024;
    }

    http {
        include       /etc/nginx/mime.types;
        default_type  application/octet-stream;

        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for"';

        access_log  /var/log/nginx/access.log  main;

        sendfile        on;

        keepalive_timeout  65;

        gzip on;
        gzip_buffers 32 4k;
        gzip_comp_level 6;
        gzip_min_length 200;
        gzip_types text/css text/xml application/javascript;

        server {
            listen       80;
            server_name  localhost;

            location \/[a-z.0-9]\.(js|css|gif|png|jpg)$ {
              expires    7d; # 开启 eTag 缓存
            }

            location / {
                root   /usr/share/nginx/html;
                index  index.html index.htm;
                try_files $uri /index.html; # 启动 Bowser 路由 配置
            }

            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   /usr/share/nginx/html;
            }

        }
    }
```

### 启动 css modules

当样式文件名为 `xxx.module.less`（样式文件名以 `.module.less` 为后缀） 时， less 文件中的类名 会自动开启 `css module` 规则:

样式定义文件: `style.module.less`
```less
// ./style.module.less

.test-cls {
  color: red;
}

```
引用样式：
```tsx
// ./HelloDemo1Page.tsx

import React from 'react';
import styles from './style.module.less';

const HelloWorldPage: React.FC = () => {
  return (
    <p>
      css modules 测试: <span className={styles['test-cls']}>{styles['test-cls']}</span>
    </p>
  );
};

export default HelloWorldPage;

```


预览效果：
```html

<style>
.style_test-cls__1GGqN {
  color: red;
}
</style>

<p>
  css modules 测试: 
  <span class="style_test-cls__1GGqN">style_test-cls__1GGqN</span>
</p>
```

在 less 样式文件内加 `global:` 可以取消该样式文件的某一个样式的 `css module` 规则。

定义样式：
```less
// ./style2.module.less

.test-cls1 {
  color: #ff1;
}

:global(.test-cls2) { // test-cls3 不会开启 css module 规则
  color: #ff2;
}

.test-cls3 { // test-cls3 会开启 css module 规则
  color: #ff3;

  :global{

    .test-cls4 { // test-cls4 不开启 css module 规则
      color: #ff3;
    }

  }
}

```
引用样式
```tsx
// ./HelloDemo1Page.tsx

import React from 'react';
import s from './style2.module.less';

const HelloWorldPage: React.FC = () => {
  return (
    <p>
      css modules 测试: 
      <span className={s['test-cls1']}>{s['test-cls1']}</span>
      <span className={s['test-cls2']}>{s['test-cls2']}</span>
    </p>
  );
};

export default HelloWorldPage;

```
输出结果：
```html
<style>
.style2_test-cls1__6dzAN {
    color: #ff1;
}
.test-cls2 {
  color: #ff2;
}

.style2_test-cls3__0H3Aq {
  color: #ff3;
}

.style2_test-cls3__0H3Aq .test-cls4 {
  color: #ff4;
}

</style>
<p>
  css modules 测试: 
  <span class="style2_test-cls1__6dzAN">style_test-cls1__6dzAN</span>
  <span class="test-cls2">test-cls2</span>
</p>
```

## hzero
```
"hzero-boot": "~1.4.60",
"hzero-cli": "~1.4.75",
```


## 文件上传
```
<FileChunkUploader
  key={uuid()}
  type="bucket"
  componentType="hzero"
  organizationId={0}
  bucketName='test'
  directory='test'
  modalProps={{
    width: '1000px',
  }}
  title={intl.get('hfile.fileAggregate.view.button.upload').d('文件上传')}
/>
```

## iconfont-阿里巴巴矢量图库使用

##### 上传图标
+ 在开发中如果需要使用图标，首先使用iconfont账号登录iconfont官方网站[iconfont](https://www.iconfont.cn/)
+ 查看自己的图标是否已经存在项目中，如果不存在则先上传到项目中，然后，进行使用（如何使用下边详细解释）。
**注意： 如果只是颜色不一样不需要重新上传，可以在代码中修改颜色**
+ 上传图标成功后，iconfont网站会提示刷新链接，以使用新导入以及以前图标，点击更新。切换到Font calss标签页复制生成的新链接。
+ 将上述链接替换到项目中的packages.json里的"npx cross-env ICON_FONT_URL=//at.alicdn.com/t/font_2326072_3sz1m2ekim5.css node scripts/icon.js"中　**//at.alicdn.com/t/font_2326072_3sz1m2ekim5.css ** 更改为iconfont网站生成的新地址。
然后在项目中执行
```
yarn icon
```
来从阿里巴巴图库中下载我们刚刚上传的图库资源。
汉得开放平台对此有说明：[图标组件](https://open.hand-china.com/document-center/doc/product/10067/10032?_back=%2Fsearch%3Fq%3D%25E5%259B%25BE%25E6%25A0%2587&doc_id=6792#%E5%9B%BE%E6%A0%87%E7%BB%84%E4%BB%B6)
如果没有报错就说明成功了。
##### 使用图标
1、走到这一步说明你的图标已经在iconfont库里边了，本地也已经是最新的图库。
2、引入图标组件
```
import Icons from 'components/Icons';
```
3、使用
```
<Icons type="component" size="16" color="#333" />
```
4、参数说明：
+ type是你要使用的图标名称，由于建的图标仓库font-family为zone-icon，因此，默认图标名称为zone-icon-上传前名字，
项目中.env.yml中CUSTOMIZE_ICON_NAME修改为: **CUSTOMIZE_ICON_NAME：${CUSTOMIZE_ICON_NAME:zone-icon} **（已经修改过不用动）
+ size为字体大小，也即是图标大小（单位：px）
+ color为字体颜色，也即是图标颜色。如果不想加入color参数，可以通过样式:global{.zone-icon{color: 你的颜色}}，为了防止样式全局污染，:global使用时候，最好在他外层有你的模块样式。
##### 使用用例
1、例如：我的iconfont网站上项目中Font class页签下有个名为zone-icon-reset图标，项目中大小为48像素。
+ 使用传入样式
```
<div><Icon type="reset" sieze="48" color="#ccc" /></div>
```
+ 使用less样式
```
<div className={[style['my-demo'], style['icon-parent']].join(' ')}><Icon type="reset" sieze="48" color="#ccc" /></div>

// 样式
.my-demo{
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-parent{
  :global{
    .zone-icon{
      color: yellow;
      font-size: 200px;
    }
  }
}
```
上述在样式中修改的字体大小将不会起作用，因为，Icon组件将传入size作为行内样式，所以，你需要增加超过行内样式权重才能起作用。

2、使用实例二：需要实现一个类似底部导航功能，底部有六个iconfont图标，每个图标demo宽度60px,图标实际大小为40px，要求六个图标间隔都相等，不允许加入空标签起占位功能，不允许使用calc来计算宽度。图标颜色为blue。

```html
div className={[style['my-demo'], style['my-icon-list']].join(' ')}>
  <section><Icon type="back" sieze="40" /></section>
  <section><Icon type="reset" sieze="40" /></section>
  <section><Icon type="file" sieze="40" /></section>
  <section><Icon type="remark" sieze="40" /></section>
  <section><Icon type="person" sieze="40" /></section>
  <section><Icon type="submit" sieze="40" /></section>
</div>
// 样式
.my-demo{
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.my-demo section{
  width: 60px;
  background-color: red;
  height: 60px;
}
.my-demo::after{
  width: 0;
  height: 60px;
  display: block;
  content: '';
}
.my-demo::before{
  width: 0;
  height: 60px;
  display: block;
  content: '';
}
.my-icon-list{
  :global{
    .zone-icon{
      color: blue;
    }
  }
}
```
## 只编译父工程
```
yarn build --only-build-parent
```

##  hlos-front
```
"hlos-front": "2.0.0-beta.01",
```

// "choerodon-ui": "1.2.0-beta.2",

##  生产环境镜像发布流程
### 1. 配置.npmrc
```bash
sudo vi ~/.npmrc
```
添加配置信息
```
_auth="aGxvcy1kZXBsb3llcjpIbG9zMTIzNCE="
email=mingbo.zhang@hand-china.com(自己邮箱)
```
### 2. 打包编译
1.切换到对应分支并切到对应子模块目录下
2.在package.json中修改version对应版本信息
3.编译
```
yarn run transpile
```
4.发布npm版本
```
npm publish --registry=http://nexus.saas.hand-china.com/content/repositories/hlos-ui/
```
5.联系发布管理员（张明波&颜乐莹）告知子模块名称与版本更新镜像版本

6.发布管理员修改生产环境工程依赖版本，并发布版本。
