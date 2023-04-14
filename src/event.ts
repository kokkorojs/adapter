/** 上报事件 */
interface Event {
  /** 事件发生的 unix 时间戳 */
  time: number;
  /** 收到事件的机器人的 QQ 号 */
  self_id: number;
  /** 表示该上报的类型 */
  post_type: 'message' | 'message_sent' | 'request' | 'notice' | 'meta_event';
}

/** 元事件上报事件 */
interface MetaEvent extends Event {
  /** 上报类型 */
  post_type: 'meta_event';
  /** 元数据类型 */
  meta_event_type: string;
}

/** 全部元事件 */
type AllMetaEvent = LifecycleMetaEvent | HeartbeatMetaEvent;

/** 生命周期子类型 */
type LifecycleSubType = 'enable' | 'disable' | 'connect';

/** 生命周期事件 */
interface LifecycleMetaEvent<T extends LifecycleSubType = LifecycleSubType> extends MetaEvent {
  /** 元事件类型 */
  meta_event_type: 'lifecycle';
  /** 子类型 */
  sub_type: T;
}

/** 应用程序状态 */
interface Status {
  /** 程序是否初始化完毕 */
  app_initialized: boolean;
  /** 程序是否可用 */
  app_enabled: boolean;
  /** 插件正常(可能为 null) */
  plugins_good: boolean | null;
  /** 程序正常 */
  app_good: boolean;
  /** 是否在线 */
  online: boolean;
  /** 统计信息 */
  stat: {
    /** 收包数 */
    PacketReceived: number;
    /** 发包数 */
    PacketSent: number;
    /** 丢包数 */
    PacketLost: number;
    /** 消息接收数 */
    MessageReceived: number;
    /** 消息发送数 */
    MessageSent: number;
    /** 连接断开次数 */
    DisconnectTimes: number;
    /** 连接丢失次数 */
    LostTimes: number;
    /** 最后一次消息时间 */
    LastMessageTime: number;
  };
}

/** 心跳包事件 */
interface HeartbeatMetaEvent extends MetaEvent {
  /** 元事件类型 */
  meta_event_type: 'heartbeat';
  /** 应用程序状态 */
  status: Status;
  /** 距离上一次心跳包的时间 (单位是毫秒) */
  interval: number;
}

/** 发送者信息 */
interface Sender {
  /** 发送者 QQ 号 */
  user_id: number;
  /** 昵称 */
  nickname: string;
  /** 性别 */
  sex: 'male' | 'female' | 'unknown';
  /** 年龄 */
  age: number;
}

/** 私聊发送者信息 */
interface PrivateSender extends Sender {
  /** 临时群消息来源群号 */
  group_id?: number;
}

/** 群聊发送者信息 */
interface GroupSender extends Sender {
  /** 群名片／备注 */
  card: string;
  /** 地区 */
  area: string;
  /** 成员等级 */
  level: string;
  /** 角色 */
  role: 'owner' | 'admin' | 'member';
  /** 专属头衔 */
  title: string;
}

/** 消息上报事件 */
interface MessageEvent extends Event {
  /** 上报类型 */
  post_type: 'message';
  /** 消息类型 */
  message_type: string;
  /** 表示消息的子类型 */
  sub_type: string;
  /** 消息 ID */
  message_id: number;
  /** 发送者 QQ 号 */
  user_id: number;
  /** 消息内容 */
  message: string;
  /** 原始消息内容 */
  raw_message: string;
  /** 字体 */
  font: number;
  /** 发送人信息 */
  sender: Sender;
}

/** 全部消息事件 */
type AllMessageEvent = PrivateMessageEvent | GroupMessageEvent;

/** 私聊消息子类型 */
type PrivateMessageSubType = 'friend' | 'group' | 'group_self' | 'other';

/** 私聊消息事件 */
interface PrivateMessageEvent<T extends PrivateMessageSubType = PrivateMessageSubType> extends MessageEvent {
  /** 消息类型 */
  message_type: 'private';
  /** 消息子类型 */
  sub_type: T;
  /** 接收者 QQ 号 */
  target_id: number;
  /** 临时会话来源 */
  temp_source: number;
  /** 发送者信息 */
  sender: PrivateSender;
}

/** 私聊消息子类型 */
type GroupMessageSubType = 'normal' | 'anonymous' | 'notice';

/** 群消息事件 */
interface GroupMessageEvent<T extends GroupMessageSubType = GroupMessageSubType> extends MessageEvent {
  /** 消息类型 */
  message_type: 'group';
  /** 消息子类型 */
  sub_type: T;
  /** 群号 */
  group_id: number;
  /** 匿名信息, 如果不是匿名消息则为 null */
  anonymous: number | null;
  /** 发送者信息 */
  sender: GroupSender;
}

/** 请求事件 */
interface RequestEvent extends Event {
  /** 上报类型 */
  post_type: 'request';
  /** 请求类型 */
  request_type: string;
}

/** 全部请求事件 */
type AllRequestEvent = FriendRequestEvent | GroupRequestEvent;

/** 加好友请求事件 */
interface FriendRequestEvent extends RequestEvent {
  /** 请求类型 */
  request_type: 'friend';
  /** 发送请求的 QQ 号 */
  user_id: number;
  /** 验证信息 */
  comment: string;
  /** 请求 flag, 在调用处理请求的 API 时需要传入 */
  flag: string;
}

/** 加群请求类型, 分别表示加群请求、邀请登录号入群 */
type GroupRequestSubType = 'add' | 'invite';

/** 加群请求／邀请事件 */
interface GroupRequestEvent<T extends GroupRequestSubType = GroupRequestSubType> extends RequestEvent {
  /** 请求类型 */
  request_type: 'group';
  /** 请求子类型 */
  sub_type: T;
  /** 群号 */
  group_id: number;
  /** 发送请求的 QQ 号 */
  user_id: number;
  /** 验证信息 */
  comment: string;
  /** 请求 flag, 在调用处理请求的 API 时需要传入 */
  flag: string;
}

/** 通知事件 */
interface NoticeEvent extends Event {
  /** 上报类型 */
  post_type: 'notice';
  /** 通知类型 */
  notice_type: string;
}

/** 全部通知事件 */
type AllNoticeEvent = ClientStatusNoticeEvent | EssenceNoticeEvent | AllFriendNoticeEvent | AllGroupNoticeEvent | AllNotifyNoticeEvent;
/** 全部好友通知事件 */
type AllFriendNoticeEvent = FriendAddNoticeEvent | FriendRecallNoticeEvent;
/** 全部群通知事件 */
type AllGroupNoticeEvent = GroupRecallNoticeEvent | GroupIncreaseNoticeEvent | GroupDecreaseNoticeEvent | GroupAdminNoticeEvent | GroupUploadNoticeEvent | GroupBanNoticeEvent;
/** 全部消息通知事件 */
type AllNotifyNoticeEvent = NotifyPokeNoticeEvent | NotifyLuckyKingNoticeEvent | NotifyHonorNoticeEvent | NotifyTitleNoticeEvent | NotifyGroupCardNoticeEvent | NotifyOfflineFileNoticeEvent;

/** 好友添加事件 */
interface FriendAddNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'friend_add';
  /** 新添加好友 QQ 号 */
  user_id: number;
}

/** 私聊消息撤回 */
interface FriendRecallNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'friend_recall';
  /** 好友 QQ 号 */
  user_id: number;
  /** 被撤回的消息 ID */
  message_id: number;
}

/** 私聊消息撤回 */
interface GroupRecallNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'group_recall';
  /** 群号 */
  group_id: number;
  /** 消息发送者 QQ 号 */
  user_id: number;
  /** 操作者 QQ 号 */
  operator_id: number;
  /** 被撤回的消息 ID */
  message_id: number;
}

/** 群成员增加事件 */
interface GroupIncreaseNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'group_increase';
  /** 事件子类型, 分别表示管理员已同意入群、管理员邀请入群 */
  sub_type: 'approve' | 'invite';
  /** 群号 */
  group_id: number;
  /** 操作者 QQ 号 */
  operator_id: number;
  /** 加入者 QQ 号 */
  user_id: number;
}

/** 群成员减少类型 */
type GroupDecreaseSubType = 'leave' | 'kick' | 'kick_me';

/** 群成员减少事件 */
interface GroupDecreaseNoticeEvent<T extends GroupDecreaseSubType = GroupDecreaseSubType> extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'group_decrease';
  /** 事件子类型, 分别表示主动退群、成员被踢、登录号被踢 */
  sub_type: T;
  /** 群号 */
  group_id: number;
  /** 操作者 QQ 号 ( 如果是主动退群, 则和 user_id 相同 ) */
  operator_id: number;
  /** 离开者 QQ 号 */
  user_id: number;
}

/** 群管理员变动类型 */
type GroupAdminSubType = 'set' | 'unset';

/** 群管理员变动事件 */
interface GroupAdminNoticeEvent<T extends GroupAdminSubType = GroupAdminSubType> extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'group_admin';
  /** 事件子类型, 分别表示主动退群、成员被踢、登录号被踢 */
  sub_type: T;
  /** 群号 */
  group_id: number;
  /** 管理员 QQ 号 */
  user_id: number;
}

/** 文件信息 */
interface UploadFile {
  /** 文件 ID */
  id: string;
  /** 文件名 */
  name: string;
  /** 文件大小 ( 字节数 ) */
  size: number;
  /** busid ( 目前不清楚有什么作用 ) */
  busid: number;
}

/** 群文件上传事件 */
interface GroupUploadNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'group_upload';
  /** 群号 */
  group_id: number;
  /** 发送者 QQ 号 */
  user_id: number;
  /** 文件信息 */
  file: UploadFile;
}

/** 群管理员变动类型 */
type GroupBanSubType = 'ban' | 'lift_ban';

/** 群禁言事件 */
interface GroupBanNoticeEvent<T extends GroupBanSubType = GroupBanSubType> extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'group_ban';
  /** 事件子类型, 分别表示禁言、解除禁言 */
  sub_type: T;
  /** 群号 */
  group_id: number;
  /** 操作者 QQ 号 */
  operator_id: number;
  /** 被禁言 QQ 号 (为全员禁言时为0) */
  user_id: number;
  /** 禁言时长, 单位秒 (为全员禁言时为-1) */
  duration: number;
}

/** 戳一戳事件 */
interface NotifyPokeNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'notify';
  /** 提示类型 */
  sub_type: 'poke';
  /** 群号 (群聊时存在) */
  group_id?: number;
  /** 发送者 QQ 号 */
  user_id: number;
  /** 发送者 QQ 号 (私聊时存在) */
  sender_id?: number;
  /** 被戳者 QQ 号 */
  target_id: number;
}

/** 群红包运气王事件 */
interface NotifyLuckyKingNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'notify';
  /** 提示类型 */
  sub_type: 'lucky_king';
  /** 群号 */
  group_id: number;
  /** 红包发送者id */
  user_id: number;
  /** 运气王id */
  target_id: number;
}

/** 群成员荣誉变更事件 */
interface NotifyHonorNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'notify';
  /** 提示类型 */
  sub_type: 'honor';
  /** 群号 */
  group_id: number;
  /** 成员id */
  user_id: number;
  /** 荣誉类型, 龙王、群聊之火、快乐源泉 */
  honor_type: 'talkative' | 'performer' | 'emotion';
}

/** 群成员头衔变更事件 */
interface NotifyTitleNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'notify';
  /** 提示类型 */
  sub_type: 'title';
  /** 群号 */
  group_id: number;
  /** 变更头衔的用户 QQ 号 */
  user_id: number;
  /** 获得的新头衔 */
  title: string;
}

/** 群成员名片更新事件 */
interface NotifyGroupCardNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'notify';
  /** 提示类型 */
  sub_type: 'group_card';
  /** 群号 */
  group_id: number;
  /** 成员id */
  user_id: number;
  /** 新名片 */
  card_new: string;
  /** 旧名片 */
  card_old: string;
}

/** 离线文件 */
interface OfflineFile {
  /** 文件名 */
  name: string;
  /** 文件大小 */
  size: number;
  /** 下载链接 */
  url: string;
}

/** 接收到离线文件事件 */
interface NotifyOfflineFileNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'notify';
  /** 提示类型 */
  sub_type: 'offline_file';
  /** 发送者id */
  user_id: number;
  /** 文件数据 */
  file: OfflineFile;
}

/** 客户端信息 */
export interface Device {
  /** 客户端ID */
  app_id: number;
  /** 设备名称 */
  device_name: string;
  /** 设备类型 */
  device_kind: string;
}

/** 其他客户端在线状态变更事件 */
interface ClientStatusNoticeEvent extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'client_status';
  /** 客户端信息 */
  client: Device;
  /** 当前是否在线 */
  online: boolean;
}

/** 精华消息变更类型 */
type EssenceSubType = 'add' | 'delete';

/** 精华消息变更 */
interface EssenceNoticeEvent<T extends EssenceSubType = EssenceSubType> extends NoticeEvent {
  /** 通知类型 */
  notice_type: 'essence';
  /** 精华消息变更类型 */
  sub_type: T;
  /** 群号 */
  group_id: number;
  /** 消息发送者ID */
  sender_id: number;
  /** 操作者ID */
  operator_id: number;
  /** 消息ID */
  message_id: number;
}

/** 事件名 */
export type EventName = keyof EventMap;

/** 事件地图 */
export interface EventMap<T = any> {
  /** 全部元事件 */
  'meta_event': (this: T, event: AllMetaEvent) => void;
  /** 生命周期 */
  'meta_event.lifecycle': (this: T, event: LifecycleMetaEvent) => void;
  /** 启用 */
  'meta_event.lifecycle.enable': (this: T, event: LifecycleMetaEvent<'enable'>) => void;
  /** 禁用 */
  'meta_event.lifecycle.disable': (this: T, event: LifecycleMetaEvent<'disable'>) => void;
  /** 连接 */
  'meta_event.lifecycle.connect': (this: T, event: LifecycleMetaEvent<'connect'>) => void;
  /** 心跳包 */
  'meta_event.heartbeat': (this: T, event: HeartbeatMetaEvent) => void;

  /** 全部消息 */
  'message': (this: T, event: AllMessageEvent) => void;
  /** 私聊消息 */
  'message.private': (this: T, event: PrivateMessageEvent) => void;
  /** 好友消息 */
  'message.private.friend': (this: T, event: PrivateMessageEvent<'friend'>) => void;
  /** 群临时会话 */
  'message.private.group': (this: T, event: PrivateMessageEvent<'group'>) => void;
  /** 群中自身发送 */
  'message.private.group_self': (this: T, event: PrivateMessageEvent<'group_self'>) => void;
  /** 论外 */
  'message.private.other': (this: T, event: PrivateMessageEvent<'other'>) => void;
  /** 群消息 */
  'message.group': (this: T, event: GroupMessageEvent) => void;
  /** 正常消息 */
  'message.group.normal': (this: T, event: GroupMessageEvent<'normal'>) => void;
  /** 匿名消息 */
  'message.group.anonymous': (this: T, event: GroupMessageEvent<'anonymous'>) => void;
  /** 系统提示 ( 如「管理员已禁止群内匿名聊天」) */
  'message.group.notice': (this: T, event: GroupMessageEvent<'notice'>) => void;

  /** 全部请求 */
  'request': (this: T, event: AllRequestEvent) => void;
  /** 好友请求 */
  'request.friend': (this: T, event: FriendRequestEvent) => void;
  /** 群请求 */
  'request.group': (this: T, event: GroupRequestEvent) => void;
  /** 加群请求 */
  'request.group.add': (this: T, event: GroupRequestEvent<'add'>) => void;
  /** 邀请入群 */
  'request.group.invite': (this: T, event: GroupRequestEvent<'invite'>) => void;

  /** 全部通知 */
  'notice': (this: T, event: AllNoticeEvent) => void;
  /** 好友消息 */
  'notice.friend': (this: T, event: AllFriendNoticeEvent) => void;
  /** 好友添加 */
  'notice.friend.add': (this: T, event: FriendAddNoticeEvent) => void;
  /** 好友消息撤回 */
  'notice.friend.recall': (this: T, event: FriendRecallNoticeEvent) => void;

  /** 群消息 */
  'notice.group': (this: T, event: AllGroupNoticeEvent) => void;
  /** 群消息撤回 */
  'notice.group.recall': (this: T, event: GroupRecallNoticeEvent) => void;
  /** 群成员增加 */
  'notice.group.increase': (this: T, event: GroupIncreaseNoticeEvent) => void;
  /** 群成员减少 */
  'notice.group.decrease': (this: T, event: GroupDecreaseNoticeEvent) => void;
  /** 主动退群 */
  'notice.group.decrease.leave': (this: T, event: GroupDecreaseNoticeEvent<'leave'>) => void;
  /** 成员被踢 */
  'notice.group.decrease.kick': (this: T, event: GroupDecreaseNoticeEvent<'kick'>) => void;
  /** 登录号被踢 */
  'notice.group.decrease.kick_me': (this: T, event: GroupDecreaseNoticeEvent<'kick_me'>) => void;
  /** 群管理员变更 */
  'notice.group.admin': (this: T, event: GroupAdminNoticeEvent) => void;
  'notice.group.admin.set': (this: T, event: GroupAdminNoticeEvent<'set'>) => void;
  'notice.group.admin.unset': (this: T, event: GroupAdminNoticeEvent<'unset'>) => void;
  /** 群文件上传 */
  'notice.group.upload': (this: T, event: GroupUploadNoticeEvent) => void;
  /** 群成员禁言 */
  'notice.group.ban': (this: T, event: GroupBanNoticeEvent) => void;
  /** 禁言 */
  'notice.group.ban.ban': (this: T, event: GroupBanNoticeEvent<'ban'>) => void;
  /** 解除禁言 */
  'notice.group.ban.lift_ban': (this: T, event: GroupBanNoticeEvent<'lift_ban'>) => void;

  /** 全部消息 */
  'notice.notify': (this: T, event: AllNotifyNoticeEvent) => void;
  /** 戳一戳 */
  'notice.notify.poke': (this: T, event: NotifyPokeNoticeEvent) => void;
  /** 群红包运气王 */
  'notice.notify.lucky_king': (this: T, event: NotifyLuckyKingNoticeEvent) => void;
  /** 群成员荣誉变更 */
  'notice.notify.honor': (this: T, event: NotifyHonorNoticeEvent) => void;
  /** 群成员头衔变更 */
  'notice.notify.title': (this: T, event: NotifyTitleNoticeEvent) => void;
  /** 群成员名片更新 */
  'notice.notify.group_card': (this: T, event: NotifyGroupCardNoticeEvent) => void;
  /** 接收到离线文件 */
  'notice.notify.offline_file': (this: T, event: NotifyOfflineFileNoticeEvent) => void;

  /** 其他客户端在线状态变更 */
  'notice.client.status': (this: T, event: ClientStatusNoticeEvent) => void;

  /** 精华消息变更 */
  'notice.essence': (this: T, event: EssenceNoticeEvent) => void;
  /** 添加 */
  'notice.essence.add': (this: T, event: EssenceNoticeEvent<'add'>) => void;
  /** 移出 */
  'notice.essence.delete': (this: T, event: EssenceNoticeEvent<'delete'>) => void;
}
