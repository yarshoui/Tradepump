interface SocketData {
  socket: WebSocket | undefined;
  activePayload: string [] | undefined;
  dataHandler?: (msg: string) => void;
}

const apiData: SocketData = {
  socket: undefined,
  activePayload: undefined,
};

let intervalId: NodeJS.Timeout;
const backoffConfig = {
  initialTimeout: 1000,
  timeout: 1000,
  maxTimeout: 60000,
  factor: 2,
};

export function restoreSocket() {
  return new Promise<WebSocket>((resolve) => {
    const hostname = window.location.hostname;
    const proto = window.location.protocol === "https" ? "wss" : "ws";
    const socket = new WebSocket(process.env.API_WEBSOCKET_HOST ?? `${proto}://${hostname}:8080/`);
    
    socket.addEventListener("close", () => {
      const timeout = backoffConfig.timeout;
      backoffConfig.timeout = backoffConfig.timeout < backoffConfig.maxTimeout
        ? Math.min(backoffConfig.factor * backoffConfig.timeout, backoffConfig.maxTimeout)
        : backoffConfig.maxTimeout;
      console.debug(`[close] API WebSocket is closed now. Reconnecting in ${timeout / 1000}s...`);
      setTimeout(() => {
        restoreSocket();
      }, timeout);
    });

    socket.addEventListener("open", () => {
      console.debug('[open] Connection established to API WebSocket');
      intervalId && clearInterval(intervalId);
      backoffConfig.timeout = backoffConfig.initialTimeout;
      resolve(apiData.socket!);
    });

    socket.addEventListener("error", (error: any) => {
      console.debug(`[error] ${error.message}`);
    });

    socket.addEventListener("message", (msg: MessageEvent<string>) => {
      apiData.dataHandler && apiData.dataHandler(msg.data);
    });

    apiData.socket = socket;
  });
}

export const getAPISocket = async (): Promise<WebSocket> => {
  if (!apiData.socket) {
    return restoreSocket();
  }

  return apiData.socket;
};

export const setDataHandler = (dataHandler: SocketData["dataHandler"]) => {
  apiData.dataHandler = dataHandler;
};
