export type JSONObject = Record<string, unknown> | Record<string, unknown>[];

export class JSONParseError extends Error {
    data?: string;

    constructor(message: string, data?: string) {
        super(message);
        this.data = data;
    }

    toString() {
        return `Error parsing JSON: '${this.data}': ${this.message}`;
    }
}

export function tryParse<T extends JSONObject>(str: string): [T | void, Error | void] {
    try {
        return [JSON.parse(str), undefined];
    } catch (err) {
        return [undefined, new JSONParseError(err instanceof Error ? err.message : err?.toString() ?? "")];
    }
}