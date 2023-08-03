export const wait = (timeout = 1000) => new Promise(resolve => setTimeout(resolve, timeout));
export const jsonToBuffer = (json: Record<string, unknown>) => Buffer.from(JSON.stringify(json));
export const parseJSONPayload = <T extends Record<string, unknown>>(rawData: string | Buffer | Buffer[] | ArrayBuffer): { stringData: string, records: (T | string)[] } => {
    let stringData = "";

    if (Array.isArray(rawData)) {
        stringData = Buffer.concat(rawData).toString();
    } else if (Buffer.isBuffer(rawData)) {
        stringData = rawData.toString();
    } else if (rawData instanceof ArrayBuffer) {
        stringData = Buffer.from(rawData).toString();
    } else {
        stringData = rawData;
    }

    return {
        stringData,
        records: stringData.split(/\n/g).map(line => {
            try {
                return JSON.parse(line.trim()) as T;
            } catch (_) {
                // return string if parsing did not succeed
                return line.trim();
            }
        }),
    };
};
