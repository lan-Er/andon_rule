#!/usr/bin/env bash

# jenkins 脚本文件

set -e # 报错不继续执行
# 获取最新代码
git pull
export BASE_PATH=BUILD_BASE_PATH
export API_HOST=BUILD_API_HOST
export CLIENT_ID=BUILD_CLIENT_ID
export WEBSOCKET_HOST=BUILD_WEBSOCKET_HOST
export PLATFORM_VERSION=BUILD_PLATFORM_VERSION
export BPM_HOST=BUILD_BPM_HOST
export IM_ENABLE=BUILD_IM_ENABLE

# $UPDATE_MICRO_MODULES UPDATE_MICRO_MODULES 变量如果存在值的话就 增量更新微前端子模块。
if  [[ $UPDATE_MICRO_MODULES =~ "all" ]] || [[ ! -n "$UPDATE_MICRO_MODULES" ]] ;then
    yarn install
    yarn run build:dll
    yarn run transpile # 编译子模块
    yarn build
else
    echo 批量更新微子模块 $UPDATE_MICRO_MODULES
    yarn run build:ms $UPDATE_MICRO_MODULES  # 编译微前端子模块模块
fi


rm -rf ./html
cp -r ./dist ./html

export BUILD_BASE_PATH=/
export BUILD_API_HOST=https://zoneda.onestep-cloud.com
export BUILD_CLIENT_ID=zone-front-dev
export BUILD_WFP_EDITOR=""
export BUILD_WEBSOCKET_HOST=https://zoneda.onestep-cloud.com/hpfm/sock-js
export BUILD_PLATFORM_VERSION=SAAS
export BUILD_BPM_HOST=https://zoneda.onestep-cloud.com
export BUILD_IM_ENABLE=false
export BUILD_IM_WEBSOCKET_HOST=ws://im.zoneda.onestep-cloud.com

find ./html -name '*.js' | xargs sed -i "s BUILD_BASE_PATH $BUILD_BASE_PATH g"
find ./html -name '*.js' | xargs sed -i "s BUILD_API_HOST $BUILD_API_HOST g"
find ./html -name '*.js' | xargs sed -i "s BUILD_CLIENT_ID $BUILD_CLIENT_ID g"
find ./html -name '*.js' | xargs sed -i "s BUILD_BPM_HOST $BUILD_BPM_HOST g"
find ./html -name '*.js' | xargs sed -i "s BUILD_WFP_EDITOR $BUILD_WFP_EDITOR g"
find ./html -name '*.js' | xargs sed -i "s BUILD_WEBSOCKET_HOST $BUILD_WEBSOCKET_HOST g"
find ./html -name '*.js' | xargs sed -i "s BUILD_PLATFORM_VERSION $BUILD_PLATFORM_VERSION g"
