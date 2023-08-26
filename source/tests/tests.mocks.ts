import { jest } from '@jest/globals';
import { EntityManager } from 'typeorm';

export class MocksFactory {

    public static entityManager(): EntityManager {
        const mock: Partial<Record<keyof EntityManager, jest.Mock<never>>> = {
            upsert: jest.fn(),
        };
        return mock as never as EntityManager;
    }

    public static transaction(t: (entityManager: EntityManager) => Promise<unknown>): Promise<unknown> {
        const em = MocksFactory.entityManager();
        return t(em);
    }

}
