import { EventEmitter } from 'events';
import { ClientRequestArgs } from 'http';
import { nanoid } from 'nanoid';
import { WebSocket, ClientOptions, RawData } from 'ws';
import { ApiName, ApiResponse, ApiParams, ApiResult } from '~/api.js';
import { EventName, EventMap } from '~/event.js';

export interface Client {
  addListener<T extends EventName>(eventName: T, listener: EventMap<this>[T]): this;
  addListener<S extends string | symbol>(eventName: S & Exclude<S, EventName>, listener: (this: this, ...args: any[]) => void): this;
  on<T extends EventName>(eventName: T, listener: EventMap<this>[T]): this;
  on<S extends string | symbol>(eventName: S & Exclude<S, EventName>, listener: (this: this, ...args: any[]) => void): this;
  once<T extends EventName>(eventName: T, listener: EventMap<this>[T]): this;
  once<S extends string | symbol>(eventName: S & Exclude<S, EventName>, listener: (this: this, ...args: any[]) => void): this;
  removeListener<T extends EventName>(eventName: T, listener: EventMap<this>[T]): this;
  removeListener<S extends string | symbol>(eventName: S & Exclude<S, EventName>, listener: (this: this, ...args: any[]) => void): this;
  off<T extends EventName>(eventName: T, listener: EventMap<this>[T]): this;
  off<S extends string | symbol>(eventName: S & Exclude<S, EventName>, listener: (this: this, ...args: any[]) => void): this;
  removeAllListeners<T extends EventName>(eventName?: T): this;
  removeAllListeners<S extends string | symbol>(eventName?: S & Exclude<S, EventName>): this;
  listeners<T extends EventName>(eventName: T): Function[];
  listeners<S extends string | symbol>(eventName: S & Exclude<S, EventName>): Function[];
  rawListeners<T extends EventName>(eventName: T): Function[];
  rawListeners<S extends string | symbol>(eventName: S & Exclude<S, EventName>): Function[];
  listenerCount<T extends EventName>(eventName: T): number;
  listenerCount<S extends string | symbol>(eventName: S & Exclude<S, EventName>): number;
  prependListener<T extends EventName>(eventName: T, listener: EventMap<this>[T]): this;
  prependListener<S extends string | symbol>(eventName: S & Exclude<S, EventName>, listener: (this: this, ...args: any[]) => void): this;
  prependOnceListener<T extends EventName>(eventName: T, listener: EventMap<this>[T]): this;
  prependOnceListener<S extends string | symbol>(eventName: S & Exclude<S, EventName>, listener: (this: this, ...args: any[]) => void): this;
  eventNames(): Array<string | symbol>;
}

export class Client extends EventEmitter {
  private ws: WebSocket;

  constructor(address: string | URL, options?: ClientOptions | ClientRequestArgs) {
    super();

    this.ws = new WebSocket(address, options);
    this.initEvents();
  }

  private initEvents(): void {
    this.ws.on('open', this.onOpen.bind(this));
    this.ws.on('message', this.onMessage.bind(this));
  }

  private onOpen(): void {
    console.log('link start');
  }

  private onMessage(data: RawData): void {
    const event = JSON.parse(data.toString());
    const { post_type, sub_type, echo } = event;

    if (echo) {
      this.emit(echo, event);
      return;
    }
    const types = [];
    const event_type = eval(`event.${post_type}_type`);

    types.push(post_type);
    types.push(event_type.replace('_', '.'));
    sub_type && types.push(sub_type);

    while (types.length) {
      const event_name = types.join('.');

      this.emit(event_name, {
        event_name, ...event,
      });
      types.pop();
    }
  }

  public postChannel<T extends ApiName>(action: T, params?: ApiParams<T>): Promise<ApiResult<T>> {
    const echo = nanoid();
    const data = {
      action, params, echo,
    };

    return new Promise((resolve, reject) => {
      this.once(echo, (event: ApiResponse) => {
        const { data, status, wording } = event;

        switch (status) {
          case 'failed':
            const error = new Error(wording);
            return reject(error);
          case 'async':
          case 'ok':
            return resolve(data);
        }
      });
      this.ws.send(JSON.stringify(data));
    });
  }

  /**
   * 获取登录号信息
   */
  public getLoginInfo() {
    return this.postChannel('get_login_info');
  }

  /**
   * 发送私聊消息
   *
   * @param user_id - 对方 QQ 号
   * @param message - 要发送的内容
   * @param group_id - 主动发起临时会话时的来源群号
   * @param auto_escape - 消息内容是否作为纯文本发送
   * @returns 消息 ID
   */
  public sendPrivateMsg(user_id: number, message: string, group_id?: number, auto_escape: boolean = false) {
    const params = {
      user_id, message, group_id, auto_escape,
    };
    return this.postChannel('send_private_msg', params);
  }

  /**
   * 发送群聊消息
   *
   * @param group_id - 群号
   * @param message - 要发送的内容
   * @param auto_escape - 消息内容是否作为纯文本发送
   * @returns 消息 ID
   */
  public sendGroupMsg(group_id: number, message: string, auto_escape: boolean = false) {
    const params = {
      group_id, message, auto_escape,
    };
    return this.postChannel('send_group_msg', params);
  }

  /**
   * 发送消息
   *
   * @param message_type - 消息类型
   * @param user_id - 对方 QQ 号
   * @param group_id - 群号
   * @param message - 要发送的内容
   * @param auto_escape - 消息内容是否作为纯文本发送
   * @returns 消息 ID
   */
  public sendMsg(message_type: string, user_id: number, group_id: number, message: string, auto_escape: boolean = false) {
    const params = {
      message_type, user_id, group_id, message, auto_escape,
    };
    return this.postChannel('send_group_msg', params);
  }

  /**
   * 获取消息
   *
   * @param message_id - 消息id
   */
  public getMsg(message_id: number) {
    const params = {
      message_id,
    };
    return this.postChannel('get_msg', params);
  }

  /**
   * 撤回消息
   *
   * @param message_id - 消息id
   */
  public deleteMsg(message_id: number) {
    const params = {
      message_id,
    };
    return this.postChannel('delete_msg', params);
  }

  /**
   * 标记消息已读
   *
   * @param message_id - 消息id
   */
  public markMsgAsRead(message_id: number) {
    const params = {
      message_id,
    };
    return this.postChannel('mark_msg_as_read', params);
  }
}

export function createClient(address: string | URL, options?: ClientOptions | ClientRequestArgs): Client {
  return new Client(address, options);
}
