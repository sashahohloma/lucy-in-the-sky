import { Readable } from 'stream';

export interface IReadable<TData> extends Readable {
    [Symbol.asyncIterator](): AsyncIterableIterator<TData>;
}
