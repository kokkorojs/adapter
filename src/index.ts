import { EventEmitter } from 'events';
import { ClientRequestArgs } from 'http';
import { nanoid } from 'nanoid';
import { WebSocket, ClientOptions, RawData } from 'ws';
import { EventMap } from './event.js';

/** 客户端事件 */
interface ClientEvent {
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
  data: Record<string, unknown> | null;
  /** 回声, 如果请求时指定了 echo, 那么响应也会包含 echo */
  echo?: unknown;
}

export interface Client {
  addListener<T extends keyof EventMap>(eventName: T, listener: EventMap<this>[T]): this;
  addListener<S extends string | symbol>(eventName: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
  on<T extends keyof EventMap>(eventName: T, listener: EventMap<this>[T]): this;
  on<S extends string | symbol>(eventName: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
  once<T extends keyof EventMap>(eventName: T, listener: EventMap<this>[T]): this;
  once<S extends string | symbol>(eventName: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
  removeListener<T extends keyof EventMap>(eventName: T, listener: EventMap<this>[T]): this;
  removeListener<S extends string | symbol>(eventName: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
  off<T extends keyof EventMap>(eventName: T, listener: EventMap<this>[T]): this;
  off<S extends string | symbol>(eventName: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
  removeAllListeners<T extends keyof EventMap>(eventName?: T): this;
  removeAllListeners<S extends string | symbol>(eventName?: S & Exclude<S, keyof EventMap>): this;
  listeners<T extends keyof EventMap>(eventName: T): Function[];
  listeners<S extends string | symbol>(eventName: S & Exclude<S, keyof EventMap>): Function[];
  rawListeners<T extends keyof EventMap>(eventName: T): Function[];
  rawListeners<S extends string | symbol>(eventName: S & Exclude<S, keyof EventMap>): Function[];
  listenerCount<T extends keyof EventMap>(eventName: T): number;
  listenerCount<S extends string | symbol>(eventName: S & Exclude<S, keyof EventMap>): number;
  prependListener<T extends keyof EventMap>(eventName: T, listener: EventMap<this>[T]): this;
  prependListener<S extends string | symbol>(eventName: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
  prependOnceListener<T extends keyof EventMap>(eventName: T, listener: EventMap<this>[T]): this;
  prependOnceListener<S extends string | symbol>(eventName: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
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
    const event_type = eval(`event.${post_type}_type`) as string;

    types.push(post_type);
    types.push(event_type.replace('_', '.'));
    sub_type && types.push(sub_type);

    while (types.length) {
      const event_name = types.join('.') as any;

      this.emit(event_name, {
        event_name, ...event,
      });
      types.pop();
    }
  }

  public postChannel(action: string, params?: object) {
    const echo = nanoid();
    const data = {
      action, params, echo,
    };

    return new Promise((resolve, reject) => {
      this.once(echo, (event: ClientEvent) => {
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
   * @returns 消息 ID
   */
  public sendPrivateMsg(user_id: number, message: string) {
    return this.postChannel('send_private_msg', {
      user_id, message,
    });
  }

  /**
   * 发送群聊消息
   *
   * @param group_id - 群号
   * @param message - 要发送的内容
   * @returns 消息 ID
   */
  public sendGroupMsg(group_id: number, message: string) {
    return this.postChannel('send_group_msg', {
      group_id, message,
    });
  }
}

export function createClient(address: string | URL, options?: ClientOptions | ClientRequestArgs): Client {
  return new Client(address, options);
}
