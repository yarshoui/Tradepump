let i = 0;
export class Mutex {
    private _promise: Promise<void>[] = [];
    private _resolve: (() => void)[] = [];

    lock() {
        const prevPromise = this._promise[this._promise.length - 1];
        console.log("Called", prevPromise, this._promise.length);
        this._promise.push(new Promise<void>(resolve => {
            this._resolve.push(resolve);
        }));

        return new Promise<void>(end => {
            if (prevPromise) {
                console.log(`Waiting for prev promise`, i ++);
                prevPromise.then(end);
            } else {
                end();
            }
        });
    }

    unlock() {
        this._resolve.pop()?.();
        this._promise.pop();
    }
}