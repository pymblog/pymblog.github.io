---
layout: post
title: "TeleWatch 开发记录：小米手表 Vela 通过 Cloudflare Worker 接入 Telegram Bot"
date: 2026-07-30 23:00:00 +0800
categories: 教程 Vela 小米手表 Cloudflare Telegram
---

> 记录 TeleWatch 项目的完整开发过程：如何让小米手表 Vela 快应用通过 Cloudflare Worker 稳定访问 Telegram Bot API，并解决 eSIM 网络、Cloudflare 域名访问、Worker 部署以及 Vela 平台兼容性等问题。

## 项目背景

手机通知同步到智能手表已经有很多方案，但直接在手表端运行 Telegram Bot 客户端仍然存在不少限制。

小米手表 Vela 平台虽然支持 JavaScript 快应用开发，但实际开发过程中遇到了：

- eSIM 网络访问国外服务不稳定；
- Telegram Bot API 无法直接访问；
- Cloudflare `workers.dev` 域名在部分网络环境下异常；
- Vela 系统接口兼容性不足。

因此，TeleWatch 最终采用 **Cloudflare Worker 作为中转代理**，让手表只负责发送请求，由 Worker 负责访问 Telegram API。

## 最终架构

```text
┌───────────────┐
│ 小米手表 Vela │
│ Quick App JS  │
└───────┬───────┘
        │ HTTPS
        ▼
┌──────────────────┐
│ Cloudflare Worker│
│ 代理 + 鉴权      │
└───────┬──────────┘
        │ Telegram Bot API
        ▼
┌──────────────┐
│ Telegram Bot │
└──────────────┘
```

整体流程：

1. 手表发送请求；
2. Worker 校验身份；
3. Worker 注入 Bot Token；
4. 转发 Telegram API；
5. 返回执行结果。

## 为什么选择 Cloudflare Worker

选择 Worker 的原因：

- 免费额度满足个人项目；
- 全球节点访问速度较快；
- 可以绑定自定义域名；
- 可以隐藏 Telegram Bot Token；
- 不需要额外服务器。

## Worker 代理实现

Worker 主要负责：

1. 请求鉴权；
2. 参数转发；
3. Telegram API 响应返回。

```javascript
export default {
  async fetch(request, env) {

    const auth =
      request.headers.get("X-Auth-Key");

    if(auth !== env.AUTH_KEY){
      return new Response(
        JSON.stringify({
          ok:false,
          error:"Unauthorized"
        })
      );
    }

    const body =
      await request.json();

    const response =
      await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/${body.method}`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:
            JSON.stringify(body.params || {})
        }
      );

    return new Response(
      await response.text(),
      {
        headers:{
          "Content-Type":"application/json"
        }
      }
    );
  }
};
```

部署：

```bash
npx wrangler deploy src/index.js \
--name telewatch-proxy \
--compatibility-date 2026-07-30
```

## 开发过程中遇到的问题

## 1. workers.dev 在 eSIM 网络下 503

最开始直接使用 Cloudflare 默认域名：

```text
https://telewatch-proxy.xxx.workers.dev
```

WiFi 环境正常，但是切换到手表 eSIM 网络后出现 503。

原因：

部分移动网络环境会对 Cloudflare Workers 默认域名产生干扰。

解决：

绑定自定义域名，例如：

```text
pymstu.top
```

使用：

```text
https://pymstu.top
```

替代：

```text
workers.dev
```

## 2. 自定义域名访问 /health 返回 521

问题：

根路径正常：

```text
https://pymstu.top
```

但是：

```text
https://pymstu.top/health
```

返回：

```text
521
```

原因：

Workers Route 配置错误。

错误：

```text
pymstu.top
```

正确：

```text
pymstu.top/*
```

必须匹配所有路径。

## 3. Wrangler 部署提示 Missing entry-point

错误：

```text
Missing entry-point
```

原因：

wrangler 无法找到入口文件。

解决：

直接指定入口：

```bash
npx wrangler deploy src/index.js
```

## 4. Vela storage 接口兼容问题

部分设备：

```javascript
@system.storage
```

无法正常使用。

最终改用：

```javascript
@system.file
```

保存配置。

示例：

```javascript
import file from '@system.file'

file.writeText({
 uri:'internal://app/config.json',
 text:JSON.stringify(config)
})
```

## 5. manifest 缺少 feature 声明

Vela 编译需要声明系统接口：

```json
{
 "features":[
   {
    "name":"system.fetch"
   },
   {
    "name":"system.file"
   },
   {
    "name":"system.prompt"
   }
 ]
}
```

否则会出现：

```text
missing feature
```

## 手表端实现

最终版本只保留核心功能：

- 配置 Worker 地址；
- 发送 Telegram 消息；
- 显示发送状态。

请求示例：

```javascript
fetch.fetch({

url:"https://pymstu.top",

method:"POST",

header:{
 "X-Auth-Key":AUTH_KEY,
 "Content-Type":"application/json"
},

data:JSON.stringify({

method:"sendMessage",

params:{
 chat_id:"YOUR_CHAT_ID",
 text:"TeleWatch 测试成功"
}

})

})
```

## 构建发布

```bash
npm install

npm run build

aiot install
```

生成 `.rpk` 文件后即可安装到小米手表。

## 总结

|问题|解决方案|
|-|-|
|eSIM 无法访问 workers.dev|绑定自定义域名|
|Worker 子路径 521|Route 使用 `/*`|
|Bot Token 安全问题|放入 Worker 环境变量|
|Vela storage 不稳定|使用 file 接口|
|编译失败|补充 manifest features|

这次开发最大的经验：

1. 移动端网络环境比代码本身更容易出问题；
2. 智能设备开发需要考虑平台限制；
3. Cloudflare Worker 是轻量 IoT 项目的优秀中间层；
4. Vela 开发优先选择兼容性更好的系统 API。

目前 TeleWatch 已经可以通过小米手表 eSIM 网络稳定访问 Telegram Bot，实现独立于手机的消息发送能力。
