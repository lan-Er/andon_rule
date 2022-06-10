#### 前端PC开发规范（试行）

##### 一、依赖安装及项目启动

###### 1、克隆代码到本地

使用Git Bash将需要开发的项目代码克隆到本地，建议优先使用ssh方式。如何配置ssh详情百度。

| 项目名称    | git地址（华远app以外都是ssh）                                |
| ----------- | ------------------------------------------------------------ |
| 广日物流PC  | git@code.choerodon.com.cn:bu-smemp-onestep-grwl/grwl-web.git |
| 浙江华远PC  | git@code.choerodon.com.cn:bu-smemp-zjhy/zjhy-front.git       |
| 浙江华远app | https://rdc.hand-china.com/gitlab/hand-mobile/huayuan-mobile-front.git |
| 研发PC      | git@code.choerodon.com.cn:bu-smemp-hlos/hlos-front.git       |

###### 2、安装依赖

进入项目根目录下执行如下命令

+ hzero版本号大于等于1.4

```node
lerna bootstrap
```

等待依赖下载完成，就完成了依赖的安装。

+ hzero版本号小于1.4

``` node
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 #mac os/linux
set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 #windows
```

```node
lerna bootstrap
```

等待依赖下载完成，就完成了依赖的安装。常见报错原因，未安装npx

###### 3、项目启动

```node
yarn build:dll
```

```node
lerna run transpile  #此过程是将现有资源编译后抽离到lib文件夹下，方便后续启动项目执行。
```

```node
yarn start
```

##### 二、新建子工程

```node
# 在父工程执行
hzero-cli generate sub-module 子模块名称
```

##### 三、新建功能页

###### 1、新建功能页前准备

首先，我们接到一个开发任务时候，都会在猪齿鱼里提任务，任务中会包括模块-功能。我们去线上菜单配置功能，选择租户层，根据任务中模块-功能信息创建对应的菜单。

###### 2、创建功能页

+ 在对应模块-->src-->routers下新建功能名称文件夹，注意首字母大写。
+ 如果需要使用DataSet，在在对应模块-->src-->stores下新建功能名称的Ds文件。
+ 如需要使用自定义网络请求，建议使用dvajs，dvajs解决了redux中的一些性能问题，使用时候在对应模块-->src-->models下创建自己的文件。并且在路由配置中加入models: ['命名空间']，接口定义在对应模块-->src-->services文件夹下

###### 3、关于页面使用dataSet缓存

有时候我们会遇到这样的需求，就是进入详情页再返回时候，我们的查询条件，页面信息都要保留。

+ 类组件(使用类修饰器来完成)

```js
import withProps from 'utils/withProps';
@withProps(
  () => {
    const ds = new DataSet(inspectionQueryDS());
    return {
      ds,
    };
  },
  { cacheState: true }
)
```

此后使用ds，需要从props中获取。

```js
this.props.ds.query(this.props.ds.currentPage);
```

**注意：在提交成功后需要刷新页面时候，调用ds的查询，最好加上当前页。否则，用户正在操作第60页单子，又重新跑到第1页，用户找半天没看到修改的数据，还以为功能有bug**

+ hooks组件使用useDataSet，第二个参数是你的组件名称。由于hooks是顺序执行的，并且每次更新都会重新从上往下执行一下代码，注意使用顺序。

```js
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import formDs from '@/stores/equipmentMonitoringBoardDs';

function MyHeaderList() {
  const queryDs = useDataSet(() => new DataSet(formDs()), MyHeaderList);
.
.
.
}
```

+ dataSet缓存默认从子功能返回之后，不会判断子功能修改与否，需要自己进行添加逻辑：

比如：父界面A和子界面B，在父界面使用dataSet缓存后，需要在进入B界面返回后，如果B界面做出修改，则A界面刷新，否则，A界面仍然保留不刷新。

+ 在B页面保存成功回调中添加如下逻辑：

```js
sessionStorage.setItem('unitPriceParentQuery', true); //虽然sessionStorage在理论上说不同页签不能共用，经过测试发现在hzero中是可以共用的，因此为了防止不同功能间相互影响，命名最好唯一。
```

在父页面A中添加如下逻辑：

```js
useEffect(() => {
    const myQuery = sessionStorage.getItem('unitPriceParentQuery') || false;
    if (location.pathname === '/lmds/unit-price/list' && myQuery) {
      formHeaderDs.query(formHeaderDs.currentPage).then(()=>{
        sessionStorage.removeItem('unitPriceParentQuery');
      });
    };
    return ()=>{
      sessionStorage.removeItem('unitPriceParentQuery');
    };
  }, [location.pathname]);
```

为什么使用sessionStorage？

首先sessionStorage可以在页面关闭后自动清除，防止，忘记清除。

###### 4、自定义方法/组件，三方库，webpack查找方法引入顺序

三方库要放在第一阶梯，webpack帮你找的放在第二阶梯，自定义方法和组件放在第三阶梯，如下例子所示：

```js
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { Modal, DataSet, Form, Lov, SelectBox, TextField } from 'choerodon-ui/pro';

import Icons from 'components/Icons';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { queryLovData } from 'hlos-front/lib/services/api';

import style from './index.module.less';
import codeConfig from '@/common/codeConfig';
import TopBanner from './component/TopBanner';
import formDs from '@/stores/equipmentMonitoringBoardDs';
```

###### 5、注释和类组件函数this绑定

（1）、注释格式如下：

+ 函数注释

```js
/**
   * @description: 函数描述
   * @param {*} 参数类型
   * @return {*} 返回值类型
   */
```

+ 功能头注释

```js
/*
 * @module: 功能描述
 * @Author: 作者姓名<qianling.zhang@hand-china.com>
 * @Date: 2021-02-05 14:06:39
 * @LastEditTime: 2021-02-22 10:29:55
 * @copyright: Copyright (c) 2020,Hand
 */
```

（2）、函数this绑定

由于使用bind修改this指向后，有些函数注释将不起作用，因此使用hzero提供的方法@Bind来修改

```js
import { Bind } from 'lodash-decorators';

/**
   * @description: 求和
   * @param {*} number
   * @return {*} number
   */
@Bind()
  handleAnnouncementList(a, b) {
    return a+b;
  }
```

###### 6、自定义组件定义和使用

+ 组件定义：自定义组件如果跨模块有使用，建议写在hlos-front-->src-->components下，如果没有跨模块并且只是用一次，就在该功能下的components下创建即可，**注意自定义组件要使用首字母大写**。
+ 自定义组件使用：引入组件写在引入的第三梯队。

###### 7、iconfont图标使用

研发项目README中有详细的简介，在此不再赘述。

###### 8、ref使用

当我们需要获取某个盒子的宽度和高度时候，需要使用ref来实现。定义ref方式有三种，禁止使用如下方式定义：

```js
<div ref="myNode">文本</div>
```

原因是因为此方式没有垃圾回收，使用过多容易引起内存溢出。

###### 9、事件绑定和解绑

+ 绑定：有时候我们需要进入页面就要绑定一个窗口改变事件，绑定时候可以使用如下方式：

```js
window.addEventListener('resize', handleChange);
```

**注意：绑定事件后边函数不能是匿名函数和箭头函数，否则，不能被removeEventListener销毁**

+ 解绑：当我们退出某个功能时候，需要清除掉我们绑定的事件。

```js
window.removeEventListener('resize', handleChange);
```

###### 10、定时器使用和清除

定时器在使用前最好清除一下，这样防止用户骚操作，比如：刷新页面，直接关闭浏览器等。在类组件生命周期componentWillUnmount和hooks清除副作用时候，必须清除一下定时器。

**注：定时器第一个参数避免是字符串，这样将会导致内存溢出**

###### 11、高阶组件以及Render Props

+ 高阶组件（HOC）

在定义高阶组件时候，使用with开头，比如：withRouter（react-router-dom里的用于给非路由跳转的组件植入history等属性）等。

+ Render Props

Render Props并不是一个语法，只是一种使用相同逻辑代码书写方式，因此，render属性也可以是别的名称,例如：

```js
<MyMouse children={mouse => (
  <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
)}/>
```

当然为了统一，方便后续代码维护，让别人一眼就能看出来是Render Props写法，统一将属性写为render。

```js
<MyMouse render={mouse => (
  <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
)}/>
```

###### 12、传送门portals

有些需求需要将我们的组件渲染在和root同级，来逃脱root宽度的限制。在退出功能时候必须将传出来的内容销毁，防止退出该功能后影响整体。

###### 13、样式以及模块化

在hzero中样式统一使用less预编译语言来书写，为了防止样式全局污染，因此，有必要使用模块化。css模块化有三种方式，css in js，module等。

+ 当我们使用如下方式引入样式时候，就会自动使用模块化（全局配置过了）。

```js
import styles from './index.less';
```

+ 当然有些人偏偏喜欢使用style，将less文件命名为index.module.less，也可以实现模块化：

```js
import style from './index.module.less';
```

如何验证有没有起作用呢？打开控制台，查看class属性，看是不是在你定义的className后加入“_随机字符”。

**注：在组件中定义calssName后，必须在less文件中书写该className值，否则，不会生成该calss**

+ 多个className同时定义

有些小伙伴可能会遇到同时书写多个className，那么该怎么写呢？

```js
<div className={[style['my-class-one'], style['my-class-two']].join(' ')}>123</div>
```

如何理解呢？

首先className后{}里是表达式 ```[style['my-class-one'], style['my-class-two']].join(' ') ```

```[style['my-class-one'], style['my-class-two']]```转换后不考虑模块化追加随机字符

```js
<div class="my-class-one,my-class-two">123</div>
```

因此，想转换成合格calss，也就是```<div class="my-class-one my-class-two">123</div>```只需要将上述数组转成字符串，并用空格隔开。因此，后边使用join(" ")。

+ 全局样式global

当我们使用choerodon-ui时候，需要修改其样式，我们就需要借助global全局样式。global使用注意如下：

（1）、对于在root路径下的组件，禁止在外层直接使用global，global必须包裹在你的功能下。

（2）、对于和root同级的组件（模态框，气泡卡片等），给需要修改样式的组件加className，如果，不加calssName，书写样式只是在root路径下起作用，将不会对root同级组件产生任何影响。其实，设置类名字不一定叫做className，这个需要看源码来决定。比如气泡卡片叫做overlayClassName。模态框是className

```js
<Popover
                    placement="bottom"
                    overlayClassName={styles['my-popover-list']}
                    trigger="click"
                    content={
                      <div className={styles['my-right-list']}>
                        <a href={`${i.pictureIds}`} target="_black">
                          图片
                        </a>
                        <br />
                        <a href={`${i.referenceDocument}`} target="_black">
                          参考文件
                        </a>
                      </div>
                    }
                  >
```



###### 14、图片资源引入

+ 小图片建议转成base64，大图片不建议使用，因为大图片转成base64以后，将会造成css压缩后体积比图片大的多，得不偿失。
+ 引入图片避免在render里img标签里通过require引入，这样会导致页面重新渲染后，重新加载图片资源。
+ 跨模块使用图片，和定义跨模块使用组件类似，将图片资源放在hlos-front里src->assets下。否则，在自己功能模块里新建assets文件夹，这样可以避免有些租户使用不到该功能，但是hlos-front包里也有该资源。

##### 四、全局提示

虽然choerodon-ui/pro有notification组件，但是，提示出现位置需要手动设置，为了节约时间封装为统一的方法：

```js
import notification from 'utils/notification';
notification.error({ message: “我是错误信息” });
```

使用时候，只需要设置message即可。

##### 五、导出

导出为Excel文件需要使用ExcelExport组件：

```js
import ExcelExport from 'components/ExcelExport';
```

| ExcelExport组件属性 | 含义         | 值      | 默认值 |
| ------------------- | ------------ | ------- | ------ |
| exportAsync         | 异步导出     | boolean | false  |
| requestUrl          | 导出后端地址 | string  |        |
| queryParams         | 参数         | object  |        |
| method              | 请求方式     | string  | GET    |
| buttonText          | 按钮显示文字 | string  | 导出   |
| otherButtonProps    | 改变按钮属性 | object  |        |

###### 1、同步导出

```html
<ExcelExport
    requestUrl={`/grwl-aps/v1/${getCurrentOrganizationId()}/mo-abnormals/export`}
    queryParams={this.getExportQueryParams} // 传入参数
 />
```

###### 2、异步导出

```html
<ExcelExport
    requestUrl={exportUrl}
    exportAsync={true}
    method="GET"
    queryParams={this.getExportQueryParams}
/>
```

###### 3、导出按钮禁用与可用控制

```html
<ExcelExport
    requestUrl={exportUrl}
    queryParams={this.getExportQueryParams}
    otherButtonProps={{disabled: 控制值}}
/>
```

###### 4、导出按钮文字修改

直接修改buttonText属性就可以

##### 六、打印

###### 1、前端打印常用工具

+ 前端打印大致思路都是一样的，都是获取需要打印DOM进行打印。如果，简单实现，不考虑用户体验，将当前页面替换成需要打印的DOM节点，调用window.print()方法。当然当前页面也就发生了改变，用户体验极差。**禁止使用**。
+ 借助iframe，将需要打印的DOM节点以及样式传递过去，完成打印。许多打印插件实现思路，建议使用。

+ 打印工具有react-to-print，print-js等。
+ react-to-print使用ref，能够响应式的打印，优先考虑。

###### 2、使用react-to-print做打印

其实，在研发项目中已经抽离成一个单独的函数（hlos-front/lib/components/PrintElement），如果是别的项目，需要安装react-to-print插件。

+ 使用时候可以从该路径引入，然后使用，具体可以看react-to-print的官方文档。下面只说简单使用流程，具体例子可以看MO工作台的流转卡打印，这个例子对换页要求比价严格，通过试图层解决不了，从数据层出发，结合纸张尺寸，动态改变数据结构，达到自适应打印的。

```js
import ReactToPrint from 'hlos-front/lib/components/PrintElement'; // 引入打印处理方法
import React, { Fragment, useRef, useState } from 'react';
export default function MyPrint(){
    const printNode = useRef(null); // 定义打印ref变量
    const [printResultArr, setPrintResultArr] = useState([]);
    
    function handlePrint() {
        if (
          printNode &&
          printNode.current &&
          printNode.current.children &&
          printNode.current.children.length > 0
        ) {
          ReactToPrint({ content: printNode && printNode.current }); // 打印操作，传入ref
        } else {
          notification.warning({ message: '没有打印的数据' });
        }
    }

    return (
    	<Fragment>
        	<Button funcType="flat" color="primary" icon="print" onClick={handlePrint} disabled={!allowPrint}>打印</Button>
        	<div
              ref={(node) => {
                printNode.current = node;
              }}
            >
              {printResultArr &&
                printResultArr.map((resultList, index) => {
                  return (
                    <Fragment key={index.toString()}>
                      <ResultPrint resultList={resultList} />
                    </Fragment>
                  );
                })}
            </div>
        </Fragment>
    )
}
```

###### 3、打印换页

换页主要有两个属性决定的，根据需求自己确定。

```css
page-break-before: always; //在此处之前设置换页
page-break-after: always; //在此处之后设置换页
```

###### 4、纸张，方向

+ 纸张设置用@page媒体查询设置，因此，也就会产生一些问题。如果@page不放在具体模块中，而是放在全局中将会引起全局样式污染。

错误做法：

```less
@media print {
  body {
    @page {
        size: A4 landscape;
        margin: 40pt 0;
        overflow: hidden;
     }
  }
}
```

正确做法：

```less
@media print {
  body {
    .transfer-card-print-result {
      @page {
        size: A4 landscape;
        margin: 40pt 0;
        overflow: hidden;
      }
    }
  }
}
```

**注意：@media print也是媒体查询，尽量不要在@media print里写打印样式，而是将打印的样式写在@media print同级下。**

禁止在@media print使用标签选择器书写样式，使用class选择器一定要使用css模块化，避免有些class名重复，产生全局污染。模块化后重复概率降低几百倍甚至几千倍。

```less
@media print { // 错误做法，禁止使用
    table{
        xxxx
    }
    div{
        xxxx
    }
}
```

如果有些样式必须在@media print写，则使用如下方式书写（react-to-print里例子也是这样，可能也是出于这方面考虑）：

```less
@media print {
  body {
    .transfer-card-print-result { // 建议用法
        table{
            xxx
        }
        div{
            xxx
        }
    }
  }
}
```

书归正传，想要设置A4值怎么办呢？只需要对@page设置就行。

```css
@page{
    size: A4;
}
```

我既要A4又要横向打印呢？

```css
@page{
    size: A4 landscape; //纵向是 size: A4 landscape;
}
```

那么整体例子

```less
@media print {
  body {
    .transfer-card-print-result {
      // 此处一定要加模块名，避免全局样式污染
      color: #000;
      display: block;
      margin: 0;
      box-sizing: border-box;
      overflow: hidden;
      @page {
        size: A4 landscape;
        margin: 40pt 0;
        overflow: hidden;
      }
    }
  }
}
// 尽量把样式写在此处
.transfer-card-print-result {
  display: none;
  width: 100%;
  padding: 0 1.7cm;
  box-sizing: border-box;
  color: #000;
  margin: 0 auto;
  overflow: hidden;
  header {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 10px;
    h1 {
      flex: 1;
      text-align: center;
    }
    > span {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .transfer-card-print-content {
    margin-top: 10px;
    .transfer-card-print-content-title {
      width: 100%;
      font-size: 12px;
      tr {
        td:nth-child(odd) {
          text-align: right;
          width: 110px;
        }
      }
    }
    .transfer-card-print-content-list {
      width: 100%;
      text-align: center;
      border: 1px solid #000;
      font-size: 12px;
      margin: 10px 0;
      .my-talbe-print-line-list {
        overflow: hidden;
      }
      tr {
        page-break-inside: avoid;
        td:nth-child(1),
        td:nth-child(2),
        td:nth-child(3),
        td:nth-child(5),
        td:nth-child(6) {
          white-space: nowrap;
          padding: 6px;
        }
        td:nth-child(2) {
          padding: 6px 18px;
        }
        td:nth-child(4) {
          text-align: center;
        }
      }
    }
  }
  footer {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
```

###### 5、打印后回调

如果你遇到打印成功后，需要做某些事情的需求，那就不用考虑打印后回调能解决了，因为，暂时没有事件支持。可以使用别的方法解决，比如：打印后弹窗让用户自己选择成功与否。

| 事件名称    | 含义及触发时机       |
| ----------- | -------------------- |
| beforeprint | 打印机已经就绪时触发 |
| afterprint  | 打印机关闭时触发     |

通过打印事件让你更加清醒，afterprint是打印机关闭时候触发的，也就是我在打印预览界面没选择确定打印，而是取消打印，并没有发出打印指令，afterprint却执行了。是不是打破了你的认知？我是觉得很诡异，w3c制定规则也太随意了。

##### 七、权限按钮

如果遇到一些需求，需要某些有权限的账号才能看到，其他账号看不到该按钮，怎么办呢？hzero封装了一个按钮组件，加载时候会先调用权限接口，根据返回值来决定按钮显示与隐藏。使用如下：

```js
import { Button as ButtonPermission } from 'components/Permission';

<ButtonPermission
  onClick={updateMosStatus}
  loading={updateMoStatusLoading}
  type="c7n-pro"
  icon="update"
  permissionList={[
    {
      code: `button.updatemotransflag`,
      type: 'button',
      meaning: 'MO传输标识修改权限',
    },
  ]}
>
  MO状态更改
</ButtonPermission>
```

其中permissionList属性是权限集，需要去配置权限。

##### 八、按钮Loading，防抖与节流

###### 1、Loading

在需要提交操作的按钮上，必须加loading，这样，可以，防止没提交成功时候可以多点。通过变量控制loading与否，在接口返回成功时候，再将loading取消掉，就可以实现有效拦截多余操作。

###### 2、防抖，节流

+ 防抖

在窗口缩放操作中，以及执行过于频繁的操作需要加上防抖与节流。防止在操作过程中频繁渲染，导致页面卡顿，甚至内存溢出。必要时可以借助 requestIdleCallback(时间切片-浏览器空闲贞执行)

```js
function debounce(fn,wait=200){
    let timer = null;
    return function(){
        if(timer !== null){
            clearTimeout(timer);
        }
        timer = setTimeout(fn,wait);
    }
}
```

+ 节流

在滚动操作中，每个一定时间间隔执行一次。

```js
const throttle = function(func, delay=60) {            
　　let prev = Date.now();            
　　return function() {                
　　　　const context = this;                
　　　　const args = arguments;                
　　　　const now = Date.now();                
　　　　if (now - prev >= delay) {                    
　　　　　　func.apply(context, args);                    
　　　　　　prev = Date.now();                
　　　　}            
　　}        
}   
```

##### 九、卡片开发

卡片开发在开放平台有详细说明，在此不再赘述。

##### 十、版本发布前检查

+ 如果后续功能稳定了，检查一下代码中的console.log()，并将其删除掉。
+ 由于业务频繁更改需求，为应对业务变更注释的代码也清楚掉。

##### 十一、前端环境搭建

如果遇到需要搭建前端环境，需要在服务器安装node环境，yarn，lerna怎么办？

具体可以参考我的博客 [前端环境搭建](https://blog.csdn.net/zhangqling/article/details/106265629)

**注意：由于后端使用的不是node服务，因此， forever 不需要安装。如果使用docker部署，请绕过此处，出门左转^_^**。

##### 十二、全屏

###### 1、pub路由

pub路由顾名思义就是在路由行加pub关键字，在路由处理时候，匹配到pub字符串就会让不再渲染左侧菜单栏，但是，pub本身存在着问题，当我们想要在某个功能操作要输入MO时候，此时又要返回MO功能去查询，如果使用浏览器顶部返回按钮，再进来又会重新渲染，以前查询东西不会被保留。操作不能在返回基础上进行操作。并且，一旦退出该pub功能，就会执行销毁生命周期，再次进入，执行更新生命周事件就会存在问题。不太建议使用，除非就是一次性使用界面。

###### 2、portals（传送门）和dataV全屏组件

我们使用pub的目的就是为了全屏，不受左侧菜单的宽度限制，那么portals就是将DOM传送到和root同级的，或者比菜单栏更高的DOM树下，自己封装传送门在切换功能时候可能会在回收时候处理不当，因此，可以借助阿里的dataV全屏组件来实现，毕竟antd-pro和hzero界面结构基本相同，可以放心使用。

###### 3、dataV全屏好处：

+ 做了防抖，在界面缩放窗口时候，不会卡顿。
+ 封装了portals，返回菜单时候（没关闭页签），不会走生命周期结束，只是单纯的将传送内容返回回去，当前页面展示是需要跳转的功能。
+ 切换页签不受影响。
+ 会根据起始尺寸在页面缩放时候，等比例缩放。
+ 目前设备监控看板，华远车间操作台，核企看板，生成计划看板，中天晨会看板，中天班组看板使用都是dataV全屏工具，点击标题就会退出看板，点击头部页签又会复原。

##### 十三、状态，是否组件

+ 表格列是否字段处理

当我们开发表格时候，如果有显示是否的列，就需要使用是否方法来处理：

```js
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
.
.
.
{ name: 'enabledFlag', renderer: yesOrNoRender, tooltip: 'overflow' },
```

+ 表格列有状态字段

使用公用方法来处理

```js
import { statusRender } from 'hlos-front/lib/utils/renderer';
.
.
.
{
    name: 'ticketLineStatus',
    width: 150,
    align: 'center',
    renderer: ({ value, text }) => statusRender(value, text),
},
```

