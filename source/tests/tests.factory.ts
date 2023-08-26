import { faker } from '@faker-js/faker';
import { ModuleMetadata, NestInterceptor, VersioningType } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { LogsInterceptor } from '../modules/logs/logs.interceptor';
import { IAppFactoryProps } from './tests.models';

export class ApplicationFactory {

    private readonly port: number;

    private _application?: NestFastifyApplication;

    public get instance(): NestFastifyApplication {
        if (this._application === undefined) {
            throw new Error(`You should run "${this.init.name}()" before accessing Nest Instance`);
        }
        return this._application;
    }

    constructor(props?: IAppFactoryProps) {
        this.port = props?.port ?? faker.number.int({ min: 3000, max: 9000 });
    }

    public async init(testModule: ModuleMetadata): Promise< void> {
        const fastifyAdapter = new FastifyAdapter();

        const logsInterceptorMock: NestInterceptor = {
            intercept: (_context, next) => next.handle(),
        };

        const moduleFixture = await Test
            .createTestingModule(testModule)
            .overrideInterceptor(LogsInterceptor)
            .useValue(logsInterceptorMock)
            .compile();

        this._application = moduleFixture.createNestApplication<NestFastifyApplication>(fastifyAdapter);

        this._application.enableVersioning({
            type: VersioningType.URI,
        });

        await this._application.listen(this.port);
    }

    public async close(): Promise<void> {
        await this.instance.close();
    }

}
