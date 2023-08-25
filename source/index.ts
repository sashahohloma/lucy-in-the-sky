import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';

const bootstrap = async(): Promise<void> => {
    const fastifyAdapter = new FastifyAdapter();

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        fastifyAdapter,
    );

    const appConfig = app.get(AppConfig);

    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
    });

    await app.listen(appConfig.port, '0.0.0.0');
};

bootstrap();
