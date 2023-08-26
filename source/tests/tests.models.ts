/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest } from '@jest/globals';

export interface IAppFactoryProps {
    port?: number;
}

export type IMock<TData> = Record<keyof TData, jest.Mock<any>>;
