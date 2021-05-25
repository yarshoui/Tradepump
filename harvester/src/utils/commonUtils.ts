export const wait = (timeout = 1000) => new Promise(resolve => setTimeout(resolve, timeout));
export const jsonToBuffer = (json: Record<string, unknown>) => Buffer.from(JSON.stringify(json));
