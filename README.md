# adapter

OneBot adapter for kokkoro.

## Usage

```typescript
import { Client } from '@kokkoro/adapter';

const client = new Client('ws://localhost:2333');

client.on('message.private', (event) => {
  const { user_id } = event;
  client.sendPrivateMsg(user_id, 'hello world');
});
```

## Events

| Event                         | Description |
|-------------------------------|-------------|
| meta_event                    | 全部元事件       |
| meta_event.lifecycle          | 生命周期        |
| meta_event.lifecycle.enable   | 启用          |
| meta_event.lifecycle.disable  | 禁用          |
| meta_event.lifecycle.connect  | 连接          |
| meta_event.heartbeat          | 心跳包         |
| message                       | 全部消息        |
| message.private               | 私聊消息        |
| message.private.friend        | 好友消息        |
| message.private.group         | 群临时会话       |
| message.private.group_self    | 群中自身发送      |
| message.private.other         | 论外          |
| message.group                 | 群消息         |
| message.group.normal          | 正常消息        |
| message.group.anonymous       | 匿名消息        |
| message.group.notice          | 系统提示        |
| request                       | 全部请求        |
| request.friend                | 好友请求        |
| request.group                 | 群请求         |
| request.group.add             | 加群请求        |
| request.group.invite          | 邀请入群        |
| notice                        | 全部通知        |
| notice.friend                 | 好友消息        |
| notice.friend.add             | 好友添加        |
| notice.friend.recall          | 好友消息撤回      |
| notice.group                  | 群消息         |
| notice.group.recall           | 群消息撤回       |
| notice.group.increase         | 群成员增加       |
| notice.group.decrease         | 群成员减少       |
| notice.group.decrease.leave   | 主动退群        |
| notice.group.decrease.kick    | 成员被踢        |
| notice.group.decrease.kick_me | 登录号被踢       |
| notice.group.admin            | 群管理员变更      |
| notice.group.admin.set        | 群管理员变更      |
| notice.group.admin.unset      | 群管理员变更      |
| notice.group.upload           | 群文件上传       |
| notice.group.ban              | 群成员禁言       |
| notice.group.ban.ban          | 禁言          |
| notice.group.ban.lift_ban     | 解除禁言        |
| notice.notify                 | 全部消息        |
| notice.notify.poke            | 戳一戳         |
| notice.notify.lucky_king      | 群红包运气王      |
| notice.notify.honor           | 群成员荣誉变更     |
| notice.notify.title           | 群成员头衔变更     |
| notice.notify.group_card      | 群成员名片更新     |
| notice.notify.offline_file    | 接收到离线文件     |
| notice.client.status          | 其他客户端在线状态变更 |
| notice.essence                | 精华消息变更      |
| notice.essence.add            | 添加          |
| notice.essence.delete         | 移出          |

## Features

| Server       | Support |
|--------------|---------|
| HTTP         | 🔴      |
| HTTP Webhook | 🔴      |
| 正向 WebSocket | 🟢      |
| 反向 WebSocket | 🟡      |
