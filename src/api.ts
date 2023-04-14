import { Device } from '@/event.js';

/** API 响应 */
export interface ApiResponse {
  /** 状态, 表示 API 是否调用成功, 如果成功, 则是 OK */
  status: 'ok' | 'async' | 'failed';
  /** 返回码, 0 调用成功 1 已提交 async 处理 */
  retcode: number;
  /** 返回消息 */
  message: string;
  /** 错误消息, 仅在 API 调用失败时有该字段 */
  msg?: string;
  /** 对错误的详细解释(中文), 仅在 API 调用失败时有该字段 */
  wording?: string;
  /** 响应数据 */
  data: any;
  /** 回声, 如果请求时指定了 echo, 那么响应也会包含 echo */
  echo?: any;
}

/** 设置登录号资料 */
interface SetQqProfileParams {
  /** 名称 */
  nickname: string;
  /** 公司 */
  company: string;
  /** 邮箱 */
  email: string;
  /** 学校 */
  college: string;
  /** 个人说明 */
  personal_note: string;
}

/** 获取在线机型 */
interface GetModelShowParams {
  /** 机型名称 */
  model: string;
}

/** 设置在线机型 */
interface SetModelShowParams {
  /** 机型名称 */
  model: string;
  model_show: string;
}

/** 获取当前账号在线客户端列表 */
interface GetOnlineClientsParams {
  /** 是否无视缓存 */
  no_cache?: boolean;
}

/** 获取陌生人信息 */
interface GetStrangerInfoParams {
  /** QQ 号 */
  user_id: number;
  /** 是否不使用缓存，默认 false （使用缓存可能更新不及时, 但响应更快） */
  no_cache?: boolean;
}

/** 发送私聊消息 */
interface SendPrivateMsgParams {
  /** 对方 QQ 号 */
  user_id: number;
  /** 主动发起临时会话时的来源群号(可选, 机器人本身必须是管理员/群主) */
  group_id?: number;
  /** 要发送的内容 */
  message: string;
  /** 消息内容是否作为纯文本发送 ( 即不解析 CQ 码 ) , 只在 message 字段是字符串时有效 */
  auto_escape?: boolean;
}

/** 发送群聊消息 */
interface SendGroupMsgParams {
  /** 群号 */
  group_id: number;
  /** 要发送的内容 */
  message: string;
  /** 消息内容是否作为纯文本发送 ( 即不解析 CQ 码 ) , 只在 message 字段是字符串时有效 */
  auto_escape?: boolean;
}

/** 发送消息 */
interface SendMsgParams {
  /** 消息类型, 支持 private、group , 分别对应私聊、群组, 如不传入, 则根据传入的 *_id 参数判断 */
  message_type: 'private' | 'group';
  /** 对方 QQ 号 ( 消息类型为 private 时需要 ) */
  user_id: number;
  /** 群号 ( 消息类型为 group 时需要 ) */
  group_id: number;
  /** 要发送的内容 */
  message: string;
  /** 消息内容是否作为纯文本发送 ( 即不解析 CQ 码 ) , 只在 message 字段是字符串时有效 */
  auto_escape: boolean;
}

/** 事件名 */
export type ApiName = keyof ApiRequestMap;
/** 接口参数 */
export type ApiParams<T extends ApiName> = Parameters<ApiRequestMap[T]>[0];
/** 接口结果 */
export type ApiResult<T extends ApiName> = ReturnType<ApiRequestMap[T]>;

/** API 请求地图 */
export interface ApiRequestMap {
  /** 获取登录号信息 */
  'get_login_info': () => {
    /** QQ 号 */
    user_id: number;
    /** QQ 昵称 */
    nickname: string;
  };
  /** 设置登录号资料 */
  'set_qq_profile': (params: SetQqProfileParams) => null;
  /** 获取企点账号信息 */
  'qidian_get_account_info': () => null;
  /** 获取在线机型 */
  '_get_model_show': (params: GetModelShowParams) => {
    variants: {
      model_show: string;
      need_pay: boolean;
    }[];
  };
  /** 设置在线机型 */
  '_set_model_show': (params: SetModelShowParams) => null;
  /** 获取当前账号在线客户端列表 */
  'get_online_clients': (params: GetOnlineClientsParams) => {
    /** 在线客户端列表 */
    clients: Device[];
  };

  /** 获取陌生人信息 */
  'get_stranger_info': (params: GetStrangerInfoParams) => {
    /** QQ 号 */
    user_id: number;
    /** 昵称 */
    nickname: string;
    /** 性别, male 或 female 或 unknown */
    sex: string;
    /** 年龄 */
    age: number;
    /** qid ID身份卡 */
    qid: string;
    /** 等级 */
    level: number;
    /** 等级 */
    login_days: number;
  };
  /** 获取好友列表 */
  'get_friend_list': () => ({
    /** QQ 号 */
    user_id: number;
    /** 昵称 */
    nickname: string;
    /** 备注名 */
    remark: string;
  }[]);
  /** 获取单向好友列表 */
  'get_unidirectional_friend_list': () => ({
    /** QQ 号 */
    user_id: number;
    /** 昵称 */
    nickname: string;
    /** 来源 */
    source: string;
  }[]);

  /** 删除好友 */
  'delete_friend': (params: { user_id: number; }) => null;
  /** 删除单向好友 */
  'delete_unidirectional_friend': (params: { user_id: number; }) => null;

  /** 发送私聊消息 */
  'send_private_msg': (params: SendPrivateMsgParams) => {
    /** 消息 ID */
    message_id: number;
  };
  /** 发送群聊消息 */
  'send_group_msg': (params: SendGroupMsgParams) => {
    /** 消息 ID */
    message_id: number;
  };
  /** 发送群聊消息 */
  'send_msg': (params: SendMsgParams) => {
    /** 消息 ID */
    message_id: number;
  };
}
