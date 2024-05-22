// 定义消息类型
type Message = string | ArrayBufferLike | Blob | ArrayBufferView;

// WebSocket客户端配置选项
interface WebSocketClientOptions {
  url: string;// WebSocket服务器地址
  roomId: string;
  heartbeatInterval?: number; // 心跳间隔（毫秒，默认不启用）
  autoReconnect?: boolean;// 是否自动重连，默认不启用
  reconnectInterval?: number;// 重连间隔（毫秒，默认不启用）
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: ErrorEvent) => void;
  onRoomIdChange: (roomId: string) => void;// 房间ID改变
  onMessage?: (message: MessageEvent) => void;
}

// WebSocket客户端
class WebSocketClient {
  private webSocket: WebSocket;
  private heartbeatIntervalId?: any;// 心跳定时器
  private reconnectTimeOutId?: any;// 重连定时器
  private reconnectIntervalId?: any;// 重连定时器
  private markHeartbeat: number;// 心跳标记
  public options: WebSocketClientOptions;

  constructor(options: WebSocketClientOptions) {
    this.options = {
      ...options,
      heartbeatInterval: options.heartbeatInterval || undefined,
      reconnectInterval: options.reconnectInterval || undefined,
    };
    this.webSocket = new WebSocket(this.options.url);
    this.markHeartbeat = 0
    this.setupEventListeners();
  }
  // 重连
  private connect() {
    console.log('重连')
    this.webSocket = new WebSocket(this.options.url);
    this.setupEventListeners();
  }

  // 设置事件监听
  private setupEventListeners() {
    this.webSocket.addEventListener("open", this.onOpen.bind(this));
    this.webSocket.addEventListener("close", this.onClose.bind(this));
    this.webSocket.addEventListener("error", this.onError.bind(this));
    this.webSocket.addEventListener("message", this.onMessage.bind(this));
  }

  // 移除事件监听
  private teardownEventListeners() {
    this.webSocket.removeEventListener("open", this.onOpen.bind(this));
    this.webSocket.removeEventListener("close", this.onClose.bind(this));
    this.webSocket.removeEventListener("error", this.onError.bind(this));
    this.webSocket.removeEventListener("message", this.onMessage.bind(this));
  }

  // 处理打开
  private onOpen(event: Event) {
    if (this.options.heartbeatInterval) {
      this.startHeartbeat();
    }
    if (this.reconnectIntervalId) clearInterval(this.reconnectIntervalId);
    if (this.options.onOpen) {
      this.options.onOpen(event);
    }
  }

  // 处理关闭
  private onClose(event: CloseEvent) {
    this.options.roomId = ''
    this.options.onRoomIdChange('')
    if (this.options.heartbeatInterval) {
      this.stopHeartbeat()
    }
    if (this.options.onClose) {
      this.options.onClose(event);
    }
    // 可能需要在此处自动重连，根据项目需求实现
    if (this.options.autoReconnect) {
      if (this.reconnectIntervalId) clearInterval(this.reconnectIntervalId);
      this.reconnectIntervalId = setInterval(() => {
        this.handleAutoReconnect()
      },
      this.options.reconnectInterval);
    }
  }

  // 处理错误
  private onError(error: any) {
    if (this.options.onError) {
      this.options.onError(error);
    }
    // 可能需要在此处记录错误或触发全局错误处理
  }

  // 处理消息
  private onMessage(message: MessageEvent) {
    this.markHeartbeat = 0
    let data = JSON.parse(message.data)
    if (this.options.onMessage) {
      this.options.onMessage(message);
    }
    if(!this.options.roomId){
      if(data.type == 'ONLINE_USER_REQUEST'){
        this.options.roomId = data.body.roomId
        this.options.onRoomIdChange(data.body.roomId)
      }else if(data.body.data && data.body.data.roomId){
        this.options.roomId = data.body.data.roomId
        this.options.onRoomIdChange(data.body.data.roomId)
      }
    }
    // 可能需要在此处解析消息并更新Pinia store状态
  }

  // 发送消息
  public send(message: Message) {
    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(message);
    } else {
      console.warn("WebSocket is not open; message not sent:", message);
    }
  }

  // 启动心跳
  private startHeartbeat() {
    let Heart = {
      type: "HEAR_BEAT_REQUEST",
      body: {
        content: "PING",
      },
    };
    this.heartbeatIntervalId = setInterval(() => {
      if(this.markHeartbeat == 2){
        this.close();
        clearInterval(this.heartbeatIntervalId)
        return
      }
      this.send(JSON.stringify(Heart)); // 发送心跳包
      this.markHeartbeat++
    }, this.options.heartbeatInterval);
  }

  // 停止心跳
  private stopHeartbeat() {
    if (this.heartbeatIntervalId) {
      clearInterval(this.heartbeatIntervalId);
      this.heartbeatIntervalId = undefined;
    }
    if (this.reconnectTimeOutId) {
      clearInterval(this.reconnectTimeOutId);
      this.reconnectTimeOutId = undefined;
    }
    if (this.reconnectIntervalId) {
      clearInterval(this.reconnectIntervalId);
      this.reconnectIntervalId = undefined;
    }
  }

  // 自动重连
  private handleAutoReconnect() {
    if (!this.options.autoReconnect || !this.webSocket || this.webSocket.readyState !== WebSocket.CLOSED) {
      clearTimeout(this.reconnectTimeOutId);
      return;
    }
  
    const { reconnectInterval } = this.options;
    if (reconnectInterval && reconnectInterval > 0) {
      clearTimeout(this.reconnectTimeOutId);
      this.connect()
    }
  }

  // 关闭连接
  public close(code?: number, reason?: string) {
    this.stopHeartbeat();
    this.teardownEventListeners();
    this.webSocket.close(code, reason);
  }
}

export default WebSocketClient;
export { type WebSocketClientOptions };
